const { Ship } = require('../models/ship');
const { Gameboard } = require('../models/gameboard');
const { Player } = require('../models/player')

describe('Ship', () => {
  test('starts with zero hits and not sunk', () => {
    const s = new Ship(3);
    expect(s.hits).toBe(0);
    expect(s.sunk).toBe(false);
    expect(s.length).toBe(3);
  });

  test('increments hits and does not sink before reaching length', () => {
    const s = new Ship(3);
    s.hit();
    expect(s.hits).toBe(1);
    expect(s.sunk).toBe(false);

    s.hit();
    expect(s.hits).toBe(2);
    expect(s.sunk).toBe(false);
  });

  test('sinks when hits reach length', () => {
    const s = new Ship(3);
    s.hit(); s.hit(); s.hit();
    expect(s.hits).toBe(3);
    expect(s.sunk).toBe(true);
  });

  test('ignores hits after sunk', () => {
    const s = new Ship(2);
    s.hit(); s.hit();          
    s.hit(); s.hit();         
    expect(s.hits).toBe(2);
    expect(s.sunk).toBe(true);
  });

  test('switch placement axis', () => {
    const s = new Ship(2);
    expect(s.xAxis).toBe(true);
    s.swithAxis();
    expect(s.xAxis).toBe(false);
  });
});

describe('Gameboard', () => {
  test('generate board', () => {
    const gb = new Gameboard();
    expect(gb.board.length).toBe(100);
    for(let i = 0; i < 99; i++){
      expect(gb.board[i]).toEqual(null);
    }
  });

  test('placing a ship horizontally', () => {
    const s = new Ship(2);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [5, 5])).toBe(true);
    expect(gb.board[55]).toEqual(s);
    expect(gb.board[56]).toEqual(s);
    expect(gb.board[57]).toBe(null);
  });

  test('placing a ship vertically', () => {
    const s = new Ship(2);
    const gb = new Gameboard();
    s.swithAxis();
    expect(gb.placeShip(s, [5, 5])).toBe(true);
    expect(gb.board[55]).toEqual(s);
    expect(gb.board[65]).toEqual(s);
    expect(gb.board[75]).toBe(null);
  });

  test('placing a ship to go outside bounds horizontally', () => {
    const s = new Ship(3);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [8, 8])).toBe(false);
    expect(gb.board[88]).toBe(null);
    expect(gb.board[89]).toBe(null);
    expect(gb.board[90]).toBe(null);
  });

  test('placing a ship to go outside bounds vertically', () => {
    const s = new Ship(3);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [8, 8])).toBe(false);
    expect(gb.board[88]).toBe(null);
    expect(gb.board[99]).toBe(null);
    expect(gb.board[109]).toBe(undefined);
  });

  test('placing a ship on top of a ship', () => {
    const s1 = new Ship(3);
    const s2 = new Ship(3);
    s2.swithAxis();
    const gb = new Gameboard();
    expect(gb.placeShip(s1, [5, 5])).toBe(true);
    expect(gb.placeShip(s2, [3, 5])).toBe(false);
    expect(gb.board[55]).toEqual(s1);
    expect(gb.board[56]).toEqual(s1);
    expect(gb.board[57]).toEqual(s1);
    expect(gb.board[35]).toBe(null);
    expect(gb.board[45]).toBe(null);
    expect(gb.board[55]).toEqual(s1);
  });

  test('attacking a ship', () => {
    const s = new Ship(3);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [5, 5])).toBe(true);
    expect(gb.receiveAttack([5, 5])).toBe(true);
  });

  test('double attacking same ship position', () => {
    const s = new Ship(3);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [5, 5])).toBe(true);
    expect(gb.receiveAttack([5, 5])).toBe(true);
    expect(gb.receiveAttack([5, 5])).toBe(false);
  });

  test('attacking empty slot', () => {
    const gb = new Gameboard();
    expect(gb.receiveAttack([1, 1])).toBe(true);
  });

  test('double attacking same empty slot', () => {
    const gb = new Gameboard();
    expect(gb.receiveAttack([1, 1])).toBe(true);
    expect(gb.receiveAttack([1, 1])).toBe(false);
  });

  test('sink a ship + check if separate ship spaces are the same ship', () => {
    const s = new Ship(3);
    const gb = new Gameboard();
    expect(gb.placeShip(s, [5, 5])).toBe(true);
    expect(gb.receiveAttack([5, 5])).toBe(true);
    expect(gb.receiveAttack([5, 6])).toBe(true);
    expect(gb.receiveAttack([5, 7])).toBe(true);
    expect(s.sunk).toBe(true);
    expect(s.hits).toBe(3);

    // Double check if the ship objects received here are all the same
    const s1 = gb.board[55];
    const s2 = gb.board[56];
    const s3 = gb.board[57];
    expect(s1).toEqual(s);
    expect(s2).toEqual(s);
    expect(s3).toEqual(s);
  });
});

describe('Player', () => {
  test('Create a controlled player', () => {
    const p = new Player(true);
    expect(p.player).toBe(true)
  });

  test('Create a AI player', () => {
    const p = new Player(false);
    expect(p.player).toBe(false)
  });
  
  test('Check if board is applied to player', () => {
    const p = new Player(true);
    expect(p.board).toEqual(new Gameboard());
  });
});