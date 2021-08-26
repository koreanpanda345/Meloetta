import EventEmitter = require('events');

type PokemonId = {
  player: 'p1' | 'p2' | 'p3' | 'p4';
  position?: 'a' | 'b';
  pokemon: string;
  name?: string;
  shiny?: boolean;
  gender?: 'M' | 'F' | undefined;
};

export interface BattleEvents {
  // Battle Initialization
  player: (player: 'p1' | 'p2', username: string, avatar: string, rating: number) => void;
  teamsize: (player: 'p1' | 'p2', size: number) => void;
  gametype: (gametype: 'singles' | 'doubles' | 'triples' | 'multi' | 'freeforall') => void;
  gen: (gen: number) => void;
  tier: (format: string) => void;
  rated: (message?: string) => void;
  rule: (name: string, description: string) => void;
  clearpoke: () => void;
  poke: (details: PokemonId, item: string) => void;
  start: () => void;
  // Battle Progress
  request: (request: JSON) => void;
  inactive: (message: string) => void;
  inactiveoff: (message: string) => void;
  upkeep: () => void;
  turn: (turn: number) => void;
  win: (user: string) => void;
  tie: () => void;
  't:': (timestamp: Date) => void;
  // Identifying Pokemon
  move: (attacker: PokemonId, target: PokemonId | string, move: string) => void;
  switchAndDrag: (details: PokemonId, hp: [number, number]) => void;
  detailschangeAndFormechange: (details: PokemonId, hp: [number, number]) => void;
  replace: (details: PokemonId, hp: [number, number]) => void;
  swap: (pokemon: string, position: number) => void;
  cant: (pokemon: string, reason: string, move?: string) => void;
  faint: (details: PokemonId) => void;
  // Minor Actions
  '-fail': (details: PokemonId, action: string) => void;
  '-block': (attacker: PokemonId, target: PokemonId, effect: string, move: string) => void;
  '-notarget': (details: PokemonId) => void;
  '-miss': (source: string, target: PokemonId) => void;
  '-damage': (details: PokemonId, hp: [number, number]) => void;
  '-heal': (details: PokemonId, hp: [number, number]) => void;
  '-sethp': (details: PokemonId, hp: number) => void;
  '-status': (details: PokemonId, status: string) => void;
  '-curestatus': (details: PokemonId, status: string) => void;
  '-cureteam': (details: PokemonId) => void;
  '-boost': (details: PokemonId, stat: string, amount: number) => void;
  '-unboost': (details: PokemonId, stat: string, amount: number) => void;
  '-setboost': (details: PokemonId, stat: string, amount: number) => void;
  '-swapboost': (source: PokemonId, target: PokemonId, stats: string[]) => void;
  '-invertboost': (details: PokemonId) => void;
  '-clearboost': (details: PokemonId) => void;
  '-clearallboost': () => void;
  '-clearpositiveboost': (target: PokemonId, details: PokemonId, effect: string) => void;
  '-clearnegativeboost': (details: PokemonId) => void;
  '-copyboost': (details: PokemonId, target: PokemonId) => void;
  '-weather': (weather: string) => void;
  '-fieldstart': (condition: string) => void;
  '-fieldend': (condition: string) => void;
  '-sidestart': (side: 'p1' | 'p2' | 'p3' | 'p4', condition: string) => void;
  '-sideend': (side: 'p1' | 'p2' | 'p3' | 'p4', condition: string) => void;
  '-start': (details: PokemonId, effect: string) => void;
  '-end': (details: PokemonId, effect: string) => void;
  '-crit': (details: PokemonId) => void;
  '-supereffective': (details: PokemonId) => void;
  '-resisted': (details: PokemonId) => void;
  '-immune': (details: PokemonId) => void;
  '-item': (details: PokemonId, item: string) => void;
  '-enditem': (details: PokemonId, item: string, effect?: string) => void;
  '-ability': (details: PokemonId, ability: string, effect?: string) => void;
  '-endability': (details: PokemonId) => void;
  '-transform': (details: PokemonId, species: string) => void;
  '-mega': (details: PokemonId, megastone: string) => void;
  '-primal': (details: PokemonId) => void;
  '-burst': (details: PokemonId, species: string, item: string) => void;
  '-zpower': (details: PokemonId) => void;
  '-zbroken': (details: PokemonId) => void;
  '-activate': (effect: string) => void;
  '-hint': (message: string) => void;
  '-center': () => void;
  '-message': (message: string) => void;
  '-combine': () => void;
  '-waiting': (details: PokemonId, target: PokemonId) => void;
  '-prepare': (attacker: PokemonId, move: string, target: PokemonId) => void;
  '-mustrecharge': (details: PokemonId) => void;
  '-nothing': () => void;
  '-hitcount': (details: PokemonId, num: number) => void;
  '-singlemove': (details: PokemonId, move: string) => void;
  '-singleturn': (details: PokemonId, move: string) => void;
}

export interface Battle {
  on<Event extends keyof BattleEvents>(event: Event, listener: BattleEvents[Event]): this;
  off<Event extends keyof BattleEvents>(event: Event, listener: BattleEvents[Event]): this;
  emit<Event extends keyof BattleEvents>(event: Event, ...args: Parameters<BattleEvents[Event]>): boolean;
}
export class Battle extends EventEmitter {
  private _data: string[] = [];
  constructor(private _battleId: string) {
    super();
  }

  public addLine(command: string, sections: string[]) {
    this.data.push(`|${command}|${sections.join('|')}`);
    switch (command) {
      // Battle Initialization
      case 'player':
        this.emit('player', sections[0] as 'p1' | 'p2', sections[1], sections[2], Number(sections[3]));
        break;
      case 'teamsize':
        this.emit('teamsize', sections[0] as 'p1' | 'p2', Number(sections[1]));
        break;
      case 'gametype':
        this.emit('gametype', sections[0] as 'singles' | 'doubles' | 'triples' | 'multi' | 'freeforall');
        break;
      case 'gen':
        this.emit('gen', Number(sections[0]));
        break;
      case 'tier':
        this.emit('tier', sections[0]);
        break;
      case 'rated':
        this.emit('rated', sections[0]);
        break;
      case 'rule':
        this.emit('rule', sections[0].split(':')[0], sections[0].split(':')[1].trim());
        break;
      case 'clearpoke':
        this.emit('clearpoke');
        break;
      case 'poke':
        this.emit(
          'poke',
          {
            player: sections[0] as 'p1' | 'p2' | 'p3' | 'p4',
            pokemon: sections[1],
          },
          sections[2],
        );
        break;
      case 'start':
        this.emit('start');
        break;
      // Battle Progress
      case '|':
        break;
      case 'request':
        this.emit('request', JSON.parse(sections[0]));
        break;
      case 'inactive':
        this.emit('inactive', sections[0]);
        break;
      case 'inactiveoff':
        this.emit('inactiveoff', sections[0]);
        break;
      case 'upkeep':
        this.emit('upkeep');
        break;
      case 'turn':
        this.emit('turn', Number(sections[0]));
        break;
      case 'win':
        this.emit('win', sections[0]);
        break;
      case 'tie':
        this.emit('tie');
        break;
      case 't:':
        this.emit('t:', new Date(sections[0]));
        break;
      // Identifying Pokemon
      case 'switch':
      case 'drag':
        this.emit('switchAndDrag', this.getDetails(sections[0]), [
          Number(sections[2].split('/')[0]),
          Number(sections[2].split('/')[1]),
        ]);
        break;
      case 'faint':
        this.emit('faint', this.getDetails(sections[0]));
        break;
      case 'move':
        this.emit(
          'move',
          this.getDetails(sections[0]),
          sections[2] === '' ? '' : this.getDetails(sections[2]),
          sections[1],
        );
        break;

      // Minor Actions
      case '-damage':
        this.emit('-damage', this.getDetails(sections[0]), [
          Number(sections[1].split('/')[0]),
          Number(sections[1].split('/')[1]),
        ]);
        break;
      case '-start':
        this.emit('-start', this.getDetails(sections[0]), sections[1]);
        break;
      case '-heal':
        this.emit('-heal', this.getDetails(sections[0]), [
          Number(sections[1].split('/')[0]),
          Number(sections[1].split('/')[1]),
        ]);
        break;
      case 'upkeep':
        this.emit('upkeep');
        break;
      case '-ability':
        this.emit('-ability', this.getDetails(sections[0]), sections[1], sections[2]);
        break;
      case '-fail':
        this.emit('-fail', this.getDetails(sections[0]), sections[1]);
        break;
      case '-boost':
        this.emit('-boost', this.getDetails(sections[0]), sections[1], Number(sections[2]));
        break;
      case '-status':
        this.emit('-status', this.getDetails(sections[0]), sections[1]);
        break;
      case '-weather':
        this.emit('-weather', sections[0]);
        break;
      case '-sidestart':
        this.emit('-sidestart', sections[0].split(':')[0] as 'p1' | 'p2' | 'p3' | 'p4', sections[1]);
        break;
      case '-enditem':
        this.emit('-enditem', this.getDetails(sections[0]), sections[1], sections[2]);
        break;
      case '-curestatus':
        this.emit('-curestatus', this.getDetails(sections[0]), sections[1]);
        break;
      case '-activate':
        this.emit('-activate', sections[1]);
        break;
      case '-fieldstart':
        this.emit('-fieldstart', sections[0]);
        break;
      case '-fieldend':
        this.emit('-fieldend', sections[0]);
        break;
    }
  }

  private getDetails(str: string) {
    //Position: Name
    let player = str.split(':')[0];
    let pokemon = str.split(':')[1].trim();
    let data: PokemonId = {
      player: (player[0] + player[1]) as 'p1' | 'p2' | 'p3' | 'p4',
      position: player[2] as 'a' | 'b',
      pokemon: pokemon.split(',')[0],
    };
    return data;
  }

  public get data() {
    return this._data;
  }
}
