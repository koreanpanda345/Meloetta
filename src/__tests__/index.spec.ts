import {Battle} from './../client/models/Battle';
describe('Testing Battle Feature', () => {
  const battle = new Battle('');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Player Event', () => {
    battle.addLine('player', ['p1', 'iG koreanpanda', 'anabel', '1000']);
    
    battle.on('player', (player, username, avatar, rating) => {
      expect({
        player,
        username,
        avatar,
        rating
      }).toEqual({
        player: 'p1',
        username: 'iG koreanpanda',
        avatar: 'anabel',
        rating: 1000
      });
    });
  });

  test('Pokemon Event', () => {
    battle.addLine('poke', ['p1', 'Lopunny']);

    battle.on('poke', (details) => {
      expect(details.pokemon).toEqual('Lopunny');
    });
  });

  test('To Log Method', () => {
    battle.addLine('faint', ['p1a: Lopunny']);

    let log = `|player|p1|iG koreanpanda|anabel|1000\n|poke|p1|Lopunny\n|faint|p1a: Lopunny`;

    expect(battle.toLog()).toEqual(log);
  });

  test('To Json Method', () => {
    
  })
});
