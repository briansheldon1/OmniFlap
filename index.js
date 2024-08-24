import GameManager from './core/game-manager.js';
import GameStateMachine from './core/game-state-machine.js';

class Game {
    constructor() {

        // initialize canvas
        this.init_canvas();

        // initialize GameManager which holds game objects and assets
        this.gameManager = new GameManager(this.canvas.width, this.canvas.height, document);

        // initialize GameStateMachine which holds and manages game states
        this.gameStateMachine = new GameStateMachine(this.gameManager, this.c);


        document.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left)*scaleX;
            const mouseY = (e.clientY - rect.top)*scaleY;
            this.gameManager.handleClick(mouseX, mouseY);  
        });
    }

    init_canvas() {
        this.canvas = document.getElementById('canvas');
        this.c = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth*0.6;
        this.canvas.height = this.canvas.width;
    }

    start() {
        this.loop();
    }

    loop() {
        this.gameStateMachine.update();
        this.gameStateMachine.render();
        requestAnimationFrame(this.loop.bind(this));
    }
}

const game = new Game();
game.start();
/* OLD CODE
// game objects
import { Player } from './objects/main-player.js';
import Rungs from './objects/rungs.js';

// global variable object
import GameManager from './objects/game-manager.js';

// util functions
import {handleGameOver, drawCount, checkCollision_and_pass} from './util.js';


// initialize canvas
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth*0.6;
canvas.height = canvas.width;


// initialize variables and objects
let gameManager, player, rungs, spawnInterval;
let backgroundMusic; // TESTING
function init() {

    // initialize global variables
    gameManager = new GameManager(canvas.width, canvas.height);

    gameManager.backgroundMusic.play();

    // initialize main player, add controls
    player = new Player(gameManager.playerArgs);
    player.init_controls(document);

    // initialize rungs
    rungs = new Rungs(gameManager.rungsArgs);    
    
    // begin interval for spawning rungs
    spawnInterval = setInterval(() => {rungs.spawn_rung()}, gameManager.spawnRate);      
}










function animate() {

    // request next frame
    requestAnimationFrame(animate);

    // clear previous canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    // draw background image
    c.drawImage(gameManager.backgroundImg, 0, 0, canvas.width, canvas.height);

    // draw game objects
    player.draw(c);
    rungs.draw(c);

    // draw count
    drawCount(c, gameManager);

    // handle collision and game over
    if (checkCollision_and_pass(player, rungs.rungsArray, gameManager)) {
        gameManager.failSound.play();
        handleGameOver(player, rungs.rungsArray, spawnInterval);
    }
    

}

init();
animate();
*/