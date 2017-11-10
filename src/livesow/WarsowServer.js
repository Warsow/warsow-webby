const dgram = require('dgram');
const _ = require('lodash');
const ServerUpdateMsg = new Buffer('\xFF\xFF\xFF\xFFgetstatus','ascii');

const TEAM_SPECTATOR = 0;
const TEAM_PLAYERS = 1;
const TEAM_ALPHA = 2;
const TEAM_BETA = 3;

function cmplayer(a,b) {
  if ( a.score == b.score )
    return 0;
  return (b.score-a.score);
}

function cmplayertime(a,b) {
  var aa = parseInt(a.score.toString().replace(".","").replace(":",""));
  var bb = parseInt(b.score.toString().replace(".","").replace(":",""));
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
    this.info = {
      type: this.type,
      ip: this.ip,
      port: this.port
    };
    this.newinfo = this.info;
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
      /*console.log("got message:");
      console.log(this.info);
      console.log(this.newinfo);*/
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

    info.teams = {
      Spectators: {name:"SPECTATORS", ping:0, score:0, players:[]},
      Players:    {name:"PLAYERS",    ping:0, score:0, players:[]},
      Alpha:      {name:"ALPHA",      ping:0, score:0, players:[]},
      Beta:       {name:"BETA",       ping:0, score:0, players:[]}
    };

    if ( info.hasOwnProperty("g_match_score") && info.g_match_score != "" ) {
      info.g_match_score = info.g_match_score.trim();
      var tempscore = info.g_match_score.match(/^(.*?): (.*?) (.*?): (.*?)$/);
      info.teams.Alpha = {name:tempscore[1], ping:0, score:parseInt(tempscore[2]), players:[]};
      info.teams.Beta  = {name:tempscore[3], ping:0, score:parseInt(tempscore[4]), players:[]};
    }

    var numSpec = 0;
    var numPlayers = 0;
    var numAlpha = 0;
    var numBeta = 0;

    var totalping = 0;
    this.playernames = [];

    players.forEach((player) => {
      player = player.match(/"(?:\\\\.|[^\\\\"])*"|\S+/g);
      var team = parseInt(player[3]);
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
        ping:parseInt(player[1]),
        score:score,
        name:name
      };

      totalping += player.ping;

      switch ( team ) {
        case TEAM_SPECTATOR:
          numSpec++;
          info.teams.Spectators.ping += player.ping;
          info.teams.Spectators.players.push(player);
          break;
        case TEAM_PLAYERS:
          numPlayers++;
          info.teams.Players.ping += player.ping;
          info.teams.Players.players.push(player);
          break;
        case TEAM_ALPHA:
          numAlpha++;
          info.teams.Alpha.ping += player.ping;
          info.teams.Alpha.players.push(player);
          break;
        case TEAM_BETA:
          numBeta++;
          info.teams.Beta.ping += player.ping;
          info.teams.Beta.players.push(player);
          break;
        default:
          break;
      }
    });

    if ( info.teams.Spectators.players.length <= 0 )
      delete info.teams.Spectators;
    else
    {
      if ( isRace )
        info.teams.Spectators.players.sort(cmplayertime);
      else
        info.teams.Spectators.players.sort(cmplayer);
    }
    if ( info.teams.Players.players.length <= 0 )
      delete info.teams.Players;
    else
    {
      if ( isRace )
        info.teams.Players.players.sort(cmplayertime);
      else
        info.teams.Players.players.sort(cmplayer);
    }
    if ( info.teams.Alpha.players.length <= 0 )
      delete info.teams.Alpha;
    else
    {
      if ( isRace )
        info.teams.Alpha.players.sort(cmplayertime);
      else
        info.teams.Alpha.players.sort(cmplayer);
    }
    if ( info.teams.Beta.players.length <= 0 )
      delete info.teams.Beta;
    else
    {
      if ( isRace )
        info.teams.Beta.players.sort(cmplayertime);
      else
        info.teams.Beta.players.sort(cmplayer);
    }

    if ( numSpec > 1 )
      info.teams.Spectators.ping = Math.round(info.teams.Spectators.ping/numSpec);
    if ( numPlayers > 1 )
      info.teams.Players.ping = Math.round(info.teams.Players.ping/numPlayers);
    if ( numAlpha > 1 )
      info.teams.Alpha.ping = Math.round(info.teams.Alpha.ping/numAlpha);
    if ( numBeta > 1 )
      info.teams.Beta.ping = Math.round(info.teams.Beta.ping/numBeta);


    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    if ( this.info )
      this.changes = changes(info, this.info);


    this.newinfo = info;
    this.totalping = totalping;

    if ( info.hasOwnProperty("tv") )
    {
      this.setNextRequest(1200000); // 20 minutes
    } else {
      if ( info.clients > 0 && totalping > 0 )
      {
        this.setNextRequest(1000); // 1 second
      } else if ( info.clients > 0 ) {
        this.setNextRequest(5000); // 5 seconds
      } else {
        this.setNextRequest(10000); // 10 seconds
      }
    }
  }

  getUpdates() {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    var ret = changes(this.newinfo, this.info );

    this.info = this.newinfo;

    return ret;
  }

}

module.exports = WarsowServer;
