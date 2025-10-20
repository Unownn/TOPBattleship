import { Player } from "../models/player.js";
import { GameLogic } from "../game/game.js";

export class UIRenderer{
    constructor(subject){
        if(subject instanceof GameLogic){
            this.logic = subject;
            return;
        }
        else{
            console.error("Can only pass GameLogic object ass a constructor");
            
        }
    }
    // Render board of the given player
    playerboardUI(player) {
        // Board div
        const board = document.createElement("div");
        board.className = "board";

        // 10x10 board
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                // Box div
                const box = document.createElement("div");
                box.className = "box";
                box.dataset.x = i;
                box.dataset.y = j;

                // Change class of the box. Hide NPC board ships
                if(player?.player == true){
                    this.changeClass(player.board, [i, j], box);
                }
                
                board.appendChild(box);
            }
        }

        // Append the elements to the content div
        const content = document.getElementById("content");
        content.appendChild(board);

        // Event listener for clicks
        board.addEventListener('click', (e) => {
            // Get clicked cell
            const cell = e.target.closest('.box');
            if (!cell) return;

            // Avoid hitting duplicates
            if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

            // Check whos turn before going further
            if(!(this.logic.turn == player.player)) return;
            else{
                this.logic.turnLogic();
            }

            // Get cell coordinates and mark it as hit/miss
            const x = Number(cell.dataset.x);
            const y = Number(cell.dataset.y);

            // receiveAttack returns true/false
            if(player.board.receiveAttack([x, y])){
                this.changeClass(player.board, [x, y], cell);
            }

            // Check game state
            const allShipsHit = [...player.board.shipAt].every(key => player.board.hitBoxes.has(key));
            if(allShipsHit){
                console.log(`${player} won!`);
                this.gameOver(player);
            }
        });
    }

    // Change class of given box, indicators for whats where
    changeClass(boardSet, xy, box){
        box.classList.remove("ship","hit","miss");
        // If a coordinate is hit and has a ship
        if(boardSet.hitBoxes.has(toKey(xy)) && boardSet.shipAt.has(toKey(xy))){
            box.classList.add("hit");
            return;
        }
        // If a coordinate has only a ship
        if(boardSet.shipAt.has(toKey(xy))){
            box.classList.add("ship");
            return;
        }
        // If a coordinate has had a shot at
        if(boardSet.hitBoxes.has(toKey(xy))){
            box.classList.add("miss");
            return;
        }
    }

    // Load the main menu
    loadMainMenu(){
        this.clearWindow();
        
        const content = document.getElementById("content");
        let btn = document.createElement("button");
        btn.innerHTML = "Start Game";
        btn.className = "mainmenubtn";

        btn.addEventListener('click', () => {
            this.logic.createPlayer();
        });
        content.appendChild(btn);
    }

    gameOver(player){
        this.clearWindow();
        
        const content = document.getElementById("content");

        let wintext = document.createElement("div");
        wintext.innerHTML = `${player} WON`;

        let btn = document.createElement("button");
        btn.innerHTML = "Main Menu";
        btn.className = "mainmenubtn";

        btn.addEventListener('click', () => {
            this.logic.mainMenu();
        });
        content.appendChild(wintext);
        content.appendChild(btn);
    }

    // Helper to clear out the content div
    clearWindow(){
        const content = document.getElementById("content");
        content.innerHTML = "";
    }
}

const toKey = ([x,y]) => `${x}${y}`;