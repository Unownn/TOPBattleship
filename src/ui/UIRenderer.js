export class UIRenderer{
    constructor(player){
        this.player = player;
        this.playerboardUI(this.player.board);
    }

    playerboardUI(playerBoard) {
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
                if(this.player.player == true){
                    this.changeClass(playerBoard, [i, j], box);
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

            // Get cell coordinates and mark it as hit/miss
            const x = Number(cell.dataset.x);
            const y = Number(cell.dataset.y);
            this.player.board.receiveAttack([x, y]);
            this.changeClass(this.player.board, [x, y], cell);

            // Check game state
            const allShipsHit = [...this.player.board.shipAt].every(key => this.player.board.hitBoxes.has(key));
            if(allShipsHit){
                console.log(`${this.player} won!`);
            }
        });
    }

    changeClass(boardSet, xy, box){
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
}

const toKey = ([x,y]) => `${x}${y}`;