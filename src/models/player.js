import { Gameboard } from "./gameboard.js";

export class Player {
    constructor(player){
        this.player = player; // True if player, false if computer
        this.board = new Gameboard();
    }
}

//module.exports = { Player };
