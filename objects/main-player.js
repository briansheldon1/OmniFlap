export class MainPlayer {
    constructor({img, jumpSound, gravity, radius, loc, friction, canvasWidth, canvasHeight, 
                jumpSpeed, leftRightSpeed}) {
        this.img = img;
        this.jumpSound = jumpSound;
        this.gravity = gravity;
        this.radius = radius;
        this.imgSize = 1.3*Math.sqrt(2)*radius;
        this.loc = loc;
        this.vel = {
            x: 0,
            y: 0, 
            theta: 0
        };
        this.friction = friction;
        this.theta = 0;
        this.pointing_right = 1;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.jumpSpeed = jumpSpeed;
        this.leftRightSpeed = leftRightSpeed;

        // flag for halting controls
        this.halted = false;
    }
    draw(c) {

        this.update();
        c.save();
        
        c.translate(this.loc.x, this.loc.y);
        c.rotate(-this.pointing_right * this.theta);
        c.scale(this.pointing_right, 1);
        c.translate(-this.loc.x, -this.loc.y);
        c.drawImage(this.img, this.loc.x - this.radius, this.loc.y - this.radius, 1.2*this.imgSize, this.imgSize);

        c.restore();
    }
    update() {


        // apply gravity and friction to vel
        this.vel.y += this.gravity;
        this.vel.theta -= 0.002*this.gravity; 
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;


        this.loc.x += this.vel.x;
        this.loc.y += this.vel.y;
        this.theta += this.vel.theta;
        if (this.theta < -Math.PI/2) {this.theta = -Math.PI/2};
        if (this.theta > Math.PI/3) {this.theta = Math.PI/3; this.vel.theta = 0};


        // apply bounds
        if (this.loc.x + this.radius > this.canvasWidth) {
            this.loc.x = this.canvasWidth - this.radius;
        }
        if (this.loc.x - this.radius < 0) {
            this.loc.x = this.radius;
        }
        if (this.loc.y + this.radius > this.canvasHeight) {
            this.loc.y = this.canvasHeight - this.radius;
        }
        if (this.loc.y - this.radius < 0) {
            this.loc.y = this.radius;
        }
    }
    init_controls(doc) {
        doc.addEventListener('keydown', this.keyDown.bind(this));
    } 
    keyDown(e) {

        // ignore inputs when player is halted
        if (this.halted) {
            return;
        }

        if (e.code == 'Space') {
            this.jumpSound.currentTime = 0;
            this.jumpSound.play();
            this.vel.y = -this.jumpSpeed;
            this.vel.theta = 1;
        }
        if (e.code == 'KeyD' || e.code == 'ArrowRight') {
            this.vel.x = this.leftRightSpeed;
            this.pointing_right = 1;
        }
        if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
            this.vel.x = -this.leftRightSpeed;
            this.pointing_right = -1;
        }
    }
}