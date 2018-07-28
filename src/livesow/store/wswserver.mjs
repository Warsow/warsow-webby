import EventEmitter from 'events';
import { createUuid } from '../../common/uuid.mjs';
import { udpRequest } from '../lib/udputils.mjs';
import { WswPlayer } from './wswplayer.mjs';

const servers = new Set();
const changes = new Set();

const OOB_PADDING = '\xFF\xFF\xFF\xFF';

const REQUESTINFO = OOB_PADDING + 'getstatus';
const REQUESTHEADER = OOB_PADDING + 'statusResponse\n\\';
const STATUS_SEPARATOR = '\\';

const MATCH_SCORE_REGEX = /^(.*?): (.*?) (.*?): (.*?)$/;
const TOKENIZE_REGEX = /"(?:\\\\.|[^\\\\"])*"|\S+/g;

const INTERVAL_EMPTY =     10000;
const INTERVAL_NOPING =    5000;
const INTERVAL_POPULATED = 1000;

export class WswServer extends EventEmitter{
    constructor(family, ip, port) {
      super();

      this.id = createUuid();
      this.family = family
      this.ip = ip;
      this.port = port;
      this.players = new Set();

      this.active = false;

      this.emit('serverInitialized', this);
      this.sendRequest();
    }

    async sendRequest() {
      let msg = await udpRequest(
        this.family,
        this.ip,
        this.port,
        Buffer.from(REQUESTINFO, 'ascii')
      );

      if (!msg) {
        this.active = false;
        this.emit('serverDelete', this, {id: this.id});
        WswServer.delete(this);
        return;
      }

      this.handleResponse(msg.toString('ascii', REQUESTHEADER.length));
    }

    handleResponse(msg) {
      this.active = true;

      let playerStrings = msg.split('\n');
      let infostring = playerStrings.shift();
      let infoArr = infostring.split(STATUS_SEPARATOR);

      let info = {
        id: this.id,
        family: this.family,
        ip: this.ip,
        port: this.port,
      };

      for (let i = 0; i < infoArr.length; i+=2) {
        info[infoArr[i]] = infoArr[i+1].trim();
      }

      info = this.processInfo(info);
      const isNew = !this.info;
      if (isNew) {
        this.emit('serverAdd', this, info);
      } else {
        const changes = this.getInfoChanges(info)
        if (changes) {
          this.emit('serverUpdate', this, changes);
        }
      }
      this.info = info;

      let totalPing = 0;
      playerStrings.pop();

      this.players.clear();
      playerStrings.forEach( (playerString) => {
        let playerArr = playerString.match(TOKENIZE_REGEX);

        const score = parseInt(playerArr[0]);
        const ping  = parseInt(playerArr[1]);
        const name  = playerArr[2].slice(1, -1);
        const team  = parseInt(playerArr[3]);

        totalPing += ping;
        const player = WswPlayer.getOrCreateOrUpdate(this, name, score, team, ping,
          (player, changes) => {
            this.emit('playerAdd', this, player, changes);
          },
          (player, changes) => {
            this.emit('playerUpdate', this, player, changes);
          }
        );

        this.players.add(player);
      });

      WswPlayer.pruneGhostsForServer(this, (player, changes) => {
        this.emit('playerDelete', this, player, changes);
      });

      let interval = 0;
      if ( this.players.size > 0 && totalPing > 0 ) {
        interval = INTERVAL_POPULATED;
      } else if ( this.players.size > 0 ) {
        interval = INTERVAL_NOPING;
      } else {
        interval = INTERVAL_EMPTY;
      }

      setTimeout( () => {
        this.sendRequest();
      }, interval);
    }

    parseInfoInt(info, prop) {
      if (info.hasOwnProperty(prop)) {
        info[prop] = parseInt(info[prop]);
      }
    }

    processInfo(info) {
      this.parseInfoInt(info, 'g_antilag');
      this.parseInfoInt(info, 'g_instagib');
      this.parseInfoInt(info, 'g_needpass');
      this.parseInfoInt(info, 'g_race_gametype');
      this.parseInfoInt(info, 'protocol');
      this.parseInfoInt(info, 'sv_cheats');
      this.parseInfoInt(info, 'sv_http');
      this.parseInfoInt(info, 'sv_maxclients');
      this.parseInfoInt(info, 'sv_maxmvclients');
      this.parseInfoInt(info, 'sv_mm_enable');
      this.parseInfoInt(info, 'sv_mm_loginonly');
      this.parseInfoInt(info, 'sv_pps');
      this.parseInfoInt(info, 'sv_pure');
      this.parseInfoInt(info, 'sv_skilllevel');
      this.parseInfoInt(info, 'sv_skillRating');
      this.parseInfoInt(info, 'clients');

      if (!info.hasOwnProperty('g_race_gametype')) {
        info.race = ~~(info.hasOwnProperty('gametype') && info.gametype.includes('race'));
      } else {
        info.race = ~~(info.g_race_gametype == 1);
      }

      if (info.hasOwnProperty('g_match_score') && info.g_match_score) {
        const tempScore = info.g_match_score.match(MATCH_SCORE_REGEX);
        info.team_alpha_name =  tempScore[1];
        info.team_alpha_score = tempScore[2];
        info.team_beta_name =   tempScore[3];
        info.team_beta_score =  tempScore[4];
      }

      return info;
    }

    getInfoChanges(info) {
      const changes = {};
      let hasChanges = false;
      Object.entries(info).forEach( ([key, value]) => {
        if (this.info.hasOwnProperty(key) && this.info[key] != info[key]) {
          changes[key] = value;
          hasChanges = true;
        }
      });
      if (!hasChanges) {
        return false;
      }
      changes.id = this.id;
      return changes;
    }

    toString() {
      return `[${this.id.substr(0, 7)} => (${this.family}) ${this.ip}:${this.port}]`;
    }

    addPlayer(name) {
      const player = WswPlayer.create(this, name);
      return player;
    }

    getPlayerByName(name) {
      return [...this.players].find( (player) => {
        return player.name == name;
      });
    }

    static create(family, ip, port) {
      let server = new WswServer(family, ip, port);
    }

    static getOrCreate(family, ip, port, onCreated) {
      let server = WswServer.getByIp(family, ip, port);
      if (!server) {
        server = new WswServer(family, ip, port);
        servers.add(server);
        onCreated(server);
      }

      return server;
    }

    static delete(server) {
      servers.delete(server);
    }

    static getById(id) {
      return [...servers].forEach( (server) => {
        return server.id == id;
      });
    }

    static getByIp(family, ip, port) {
      return [...servers].find( (server) => {
        return server.family == family &&
          server.ip == ip &&
          server.port == port;
      });
    }

    static getAllActive() {
      return [...servers].filter( (server) => {
        return server.active;
      }).map( (server) => {
        return server.info;
      });
    }
  }
