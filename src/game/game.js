import { Player } from "../models/player.js";
import { Ship } from "../models/ship.js";
import { UIRenderer } from "../ui/UIRenderer.js"; // adjust path if different

export class GameLogic {
  constructor() {
    // Game UI. Players have their own contained UI objects
    this.UI = new UIRenderer(this);
    this.turn = false; // Alternate true/false for turns. False = player starts
    this.mainMenu();
  }

  // Main menu -> start button -> let player assign ships -> randomly assing boats to npc -> start game
  mainMenu(){
    this.UI.loadMainMenu();
  }

  // Create a player for the game
  createPlayer(){
    // Create the players. Place ships randomly. Render the boards.
    const p1 = new Player(true);
    const p2 = new Player(false);
    this.UI.clearWindow();
    this.placeShipsRandomly(p1);
    this.placeShipsRandomly(p2);
    this.UI.playerboardUI(p1);
    this.UI.playerboardUI(p2);
  }

  // Turn logic 
  turnLogic(){
    this.turn = !this.turn;
  }

  // Return random integer
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Set the ship axis randomly
  setRandomAxis(ship) {
    const horizontal = Math.random() < 0.5;
    if ('xAxis' in ship) {
      ship.xAxis = horizontal;            // if your Ship exposes an xAxis flag
    } else if (typeof ship.switchAxis === 'function') {
      // ensure desired orientation using switchAxis() if that's what your Ship provides
      if (ship.xAxis !== horizontal) ship.switchAxis();
    }
  }

  // Place ships randomly
  placeShipsRandomly(player, size = 10) {
    // Ships
    const ships = [2, 3, 3, 4, 5].map(len => new Ship(len));

    // Just a safety check, avoid infinite loops
    const maxAttempts = 500; 
    let attempts = 0;

    // Placement attempts
    while (ships.length > 0 && attempts < maxAttempts) {
      attempts++;

      // Pick a random ship from the remaining ones
      const idx = this.randInt(0, ships.length - 1);
      const ship = ships[idx];

      // Randomize orientation
      this.setRandomAxis(ship);

      // Random position
      const x = this.randInt(0, 9);
      const y = this.randInt(0, 9);

      // try to place -> your Gameboard.placeShip should return true/false
      const placed = player.board.placeShip(ship, [x, y]);
      if (placed) {
        // Remove this ship from the pool
        ships.splice(idx, 1);
      }
      // Else -> try again
    }

    // Safety wrapper
    if (ships.length > 0) {
      console.warn('Failed to place all ships within attempt limit:', { remaining: ships.length });
    }
  }
}