const dgram = require('dgram');
const ServerUpdateMsg = new Buffer('\xFF\xFF\xFF\xFFgetstatus','ascii');

const TEAM_SPECTATOR = 0;
const TEAM_PLAYERS = 1;
const TEAM_ALPHA = 2;
const TEAM_BETA = 3;

function cmplayer(a, b) {
  if ( a.s == b.s )
    return 0;
  return (b.s-a.s);
}

function cmplayertime(a, b) {
  var aa = parseInt(a.s.toString().replace(".","").replace(":",""));
  var bb = parseInt(b.s.toString().replace(".","").replace(":",""));
  if ( aa == bb )
    return 0;
  if ( aa == "no time" )
    return -1;
  if ( bb == "no time" )
    return 1;
  return (aa-bb);
}

function uncolor(input) {
  if ( input == undefined ) return input;
  return input.replace(/\^(\d)(([^^]|\^(?!\d))*)/g,'$2');
}

class WarsowServer {

  constructor(type, ip, port) {
    this.type = type;
    this.ip = ip;
    this.port = port;
    this.nextRequest = 0;

    this.rawinfo = "";
    this.info = null;
    this.totalping = 0;
    this.playernames = [];

    this.timeout = null;

    //this.setNextRequest(Math.random()*1000); // random delay so it doesn't flood connections
  }

  setNextRequest(nextRequest) {
    this.nextRequest = (new Date()).getTime() + nextRequest;
  }

  update() {
    if ( (new Date()).getTime() < this.nextRequest )
      return;

    var client = dgram.createSocket(this.type);

    client.on('message', (message, remote) => {
      client.close();
      clearTimeout(this.timeout);

      this.rawinfo = message.toString();
      this.parseInfo();
      console.log("got message:", this.info);
    });

    client.send( ServerUpdateMsg, 0, ServerUpdateMsg.length, this.port, this.ip, function(err, bytes) {
      //client.close();
      // TODO: can this fail? afaik udp never fails to send. (maybe if address is faulty)
    });

    this.timeout = setTimeout(() => function(){
      console.log("timed out");
      client.close();
    });

    //this.setNextReq(10000 + Math.random()*1000);
  }

  parseInfo() {
    var info = {
      type: this.type,
      ip: this.ip,
      port: this.port
    };
    var players = this.rawinfo.split("\n");
    players.shift();
    players.pop();

    var infoarr = players.shift();
    if ( infoarr == undefined )
      return;
    infoarr = infoarr.slice(12); // slice off header
    infoarr = infoarr.split("\\");

    for ( var i = 0; i < infoarr.length; i+=2 )
    {
      info[infoarr[i]] = infoarr[i+1];
    }

    var isRace = false;
    if ( info.gametype != undefined )
      isRace = (info.gametype.indexOf("race") > -1);

    var score = {};
    if ( info.hasOwnProperty("g_match_score") )
    {
      if ( info.g_match_score == "" )
      {
        score = {
          A: { n:"ALPHA", p:0, s:0 },
          B: { n:"BETA", p:0, s:0 }
        };
      } else {
        var tempscore = info.g_match_score.match(/^(.*?): (.*?) (.*?): (.*?)$/);
        score = {
          A: { n:tempscore[1], p:0, s:tempscore[2] },
          B: { n:tempscore[3], p:0, s:tempscore[4] },
        };
      }
    } else {
      score = {
        A: { n:"ALPHA", p:0, s:0 },
        B: { n:"BETA", p:0, s:0 }
      };
    }
    info.score = score;

    var numAlpha = 0;
    var numBeta = 0;

    info.S = [];
    info.P = [];
    info.A = [];
    info.B = [];

    var totalping = 0;
    this.playernames = [];
    //var server = this;

    players.forEach((player) => {
      player = player.match(/"(?:\\\\.|[^\\\\"])*"|\S+/g);
      var team = player[3];
      if ( team > TEAM_BETA )
        return;
      var score = parseInt(player[0]);
      var name = player[2].slice(1,-1);
      this.playernames.push(uncolor(name));
      if ( isRace )
      {
        score *= 10;
        if ( score < 0 )
          score += 65536;
        if ( score != 0 )
        {
          var scoretime = new Date(score);
          score = "";
          if ( scoretime.getMinutes() > 0 )
          {
            score += scoretime.getMinutes() + ":";
            if ( scoretime.getSeconds() < 10  )
              score += "0";
          }
          score += scoretime.getSeconds() + ".";
          if ( scoretime.getMilliseconds() < 100 )
            score += "0";
          if ( scoretime.getMilliseconds() < 10 )
            score += "0";
          score += scoretime.getMilliseconds();
        } else {
          score = "no time";
        }
      }
      player = {
        p:player[1],
        s:score,
        n:name
      }
      totalping += player.p;

      if ( team == TEAM_SPECTATOR )
      {
        info.S.push(player);
      } else if ( team == TEAM_PLAYERS )
      {
        info.P.push(player);
      } else if ( team == TEAM_ALPHA )
      {
        numAlpha++;
        info.score.A.p += parseInt(player.p);
        info.A.push(player);
      } else if ( team == TEAM_BETA )
      {
        numBeta++;
        info.score.B.p += parseInt(player.p);
        info.B.push(player);
      }
    });

    if ( info.S.length <= 0 )
      delete info.S;
    else
    {
      if ( isRace )
        info.S.sort(cmplayertime);
      else
        info.S.sort(cmplayer);
    }
    if ( info.P.length <= 0 )
      delete info.P;
    else
    {
      if ( isRace )
        info.P.sort(cmplayertime);
      else
        info.P.sort(cmplayer);
    }
    if ( info.A.length <= 0 )
      delete info.A;
    else
    {
      if ( isRace )
        info.A.sort(cmplayertime);
      else
        info.A.sort(cmplayer);
    }
    if ( info.B.length <= 0 )
      delete info.B;
    else
    {
      if ( isRace )
        info.B.sort(cmplayertime);
      else
        info.B.sort(cmplayer);
    }

    if ( numAlpha > 1 )
      info.score.A.p = Math.round(info.score.A.p/numAlpha);
    if ( numBeta > 1 )
      info.score.B.p = Math.round(info.score.B.p/numBeta);

    /*if ( this.info != null )
    {
      this.changes = obj_diff(info, this.info);
    } else {
      this.changes = obj_diff(info, {});
    }*/
    //console.log(this.changes);

    this.info = info;
    this.totalping = totalping;

    /*if ( info.hasOwnProperty("tv") )
    {
      //console.log("[TV] " + info.tv_name + " " + info.clients + "/" + info.sv_maxclients);
      this.setNextReq(1200000); // 20 minutes
    } else {
      //console.log("[SV] " + info.sv_hostname + " " + info.clients + "/" + info.sv_maxclients);

      if ( info.clients > 0 && totalping > 0 )
      {
        this.setNextReq(1000); // 1 second
      } else if ( info.clients > 0 ) {
        this.setNextReq(5000); // 5 seconds
      } else {
        this.setNextReq(10000); // 10 seconds
      }
    }*/
  }

}

module.exports = WarsowServer;
