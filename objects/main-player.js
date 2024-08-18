export class MainPlayer {
    constructor(color) {
        this.color = color;
        this.gravity = 0.1;
        this.radius = 10;
        this.loc = {
            x: 50,
            y: 50
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.friction = 0.99;
    }
    draw(c, windowWidth, windowHeight) {

        this.update(windowWidth, windowHeight);
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
    }
    update(windowWidth, windowHeight) {

        // apply gravity
        this.vel.y += this.gravity;
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;


        this.loc.x += this.vel.x;
        this.loc.y += this.vel.y;


        // apply bounds
        if (this.loc.x + this.radius > windowWidth) {
            this.loc.x = windowWidth - this.radius;
        }
        if (this.loc.x - this.radius < 0) {
            this.loc.x = this.radius;
        }
        if (this.loc.y + this.radius > windowHeight) {
            this.loc.y = windowHeight - this.radius;
        }
        if (this.loc.y - this.radius < 0) {
            this.loc.y = this.radius;
        }
    }
    init_controls(doc) {
        doc.addEventListener('keydown', this.keyDown.bind(this));
    } 
    keyDown(e) {
        if (e.code == 'Space') {
            this.vel.y = -7;
        }
        if (e.code == 'KeyD' || e.code == 'ArrowRight') {
            this.vel.x = 6;
        }
        if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
            this.vel.x = -6;
        }
    }
}