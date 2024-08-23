// game objects
import { MainPlayer } from './objects/main-player.js';
import Rungs from './objects/rung.js';

// global variable object
import G from './objects/g.js';

// util functions
import {handleGameOver, drawCount, checkCollision_and_pass} from './util.js';


// initialize canvas
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth*0.6;
canvas.height = canvas.width;


// initialize variables and objects
let g, mainPlayer, rungs, spawnInterval;
let backgroundMusic; // TESTING
function init() {

    // initialize global variables
    g = new G(canvas.width, canvas.height);

    g.backgroundMusic.play();

    // initialize main player, add controls
    mainPlayer = new MainPlayer(g.mainPlayerArgs);
    mainPlayer.init_controls(document);

    // initialize rungs
    rungs = new Rungs(g.rungsArgs);    
    
    // begin interval for spawning rungs
    spawnInterval = setInterval(() => {rungs.spawn_rung()}, g.spawnRate);      
}










function animate() {

    // request next frame
    requestAnimationFrame(animate);

    // clear previous canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    // draw background image
    c.drawImage(g.backgroundImg, 0, 0, canvas.width, canvas.height);

    // draw game objects
    mainPlayer.draw(c, canvas.width, canvas.height);
    rungs.garbage_collection();
    rungs.draw(c);

    // draw count
    drawCount(c, g);

    // handle collision and game over
    if (checkCollision_and_pass(mainPlayer, rungs.rungsArray, g)) {
        g.failSound.play();
        handleGameOver(mainPlayer, rungs.rungsArray, spawnInterval);
    }
    

}

init();
animate();