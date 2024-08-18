import { MainPlayer } from './objects/main-player.js';
import Controls from './objects/controls.js';
import Rung from './objects/rung.js';

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
    x: 0, 
    y: 0
}
document.addEventListener('mousemove', function(event) {mouse.x = event.clientX; mouse.y = event.clientY;});

var mainPlayer = new MainPlayer('red');
mainPlayer.init_controls(document);

var rung = new Rung('black', {x: 500, y: 300}, {x: 0, y: 0}, Math.PI/4);

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    // draw for mouse temporarily
    c.beginPath();
    c.fillStyle = 'blue';
    c.arc(mouse.x, mouse.y, 10, 0, Math.PI*2, false);
    c.fill();

    // get transformed point
    if (rung.check_intersect(mouse.x, mouse.y, 10)) {
        rung.color = 'green';
    }
    else {rung.color = 'black';}

    mainPlayer.draw(c, canvas.width, canvas.height);
    rung.draw(c);

}
animate();