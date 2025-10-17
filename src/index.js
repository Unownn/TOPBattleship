import "./styles.css";
import { Player } from "./models/player.js";
import { Ship } from "./models/ship.js";

function gen(){
  const s1 = new Ship(2);
  const s2 = new Ship(3);
  const s3 = new Ship(3);
  const s4 = new Ship(4);
  const s5 = new Ship(5);
  const ships = [s1, s2, s3, s4, s5];
  const placement = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]];

  const p1 = new Player(true);
  const p2 = new Player(false);

  for(let i = 0; i < 5; i++){
    p1.board.placeShip(ships[i], placement[i]);
    p2.board.placeShip(ships[i], placement[i]);
  }
  console.log(p1);
  console.log(p2);
}

gen();