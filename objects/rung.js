export default class Rungs {
    constructor({spawnCenter, spawnRadius, rungSpeed, rungHeight, rungWidth, rungHoleHeight, 
                columnHeadImg, columnPoleImg}) {
        this.rungsArray = [];

        this.spawnCenter = spawnCenter;
        this.spawnRadius = spawnRadius;
        this.rungSpeed = rungSpeed;
        this.total_rungs_so_far = 0;

        this.rungHeight = rungHeight;
        this.rungWidth = rungWidth;
        this.rungHoleHeight = rungHoleHeight;

        this.columnHeadImg = columnHeadImg;
        this.columnPoleImg = columnPoleImg;
    }

    draw(c) {
        this.rungsArray.forEach(rung => {
            rung.draw(c);
        });
    }

    spawn_rung() {


        // spawn randomly on spawn radius
        let theta = Math.random() * Math.PI * 2;
        let loc = {
            x: this.spawnCenter.x + this.spawnRadius * Math.cos(theta),
            y: this.spawnCenter.y + this.spawnRadius * Math.sin(theta)
        }

        // generate velocity towards center, scale to correct speed
        let vel = {
            x: (this.spawnCenter.x - loc.x)/100,
            y: (this.spawnCenter.y - loc.y)/100
        }

        let divide_by = Math.sqrt((vel.x)**2 + (vel.y)**2);
        vel.x *= (this.rungSpeed / divide_by);
        vel.y *= (this.rungSpeed / divide_by);

        // shift location so that center of rung is at loc
        loc.x += Math.sin(theta) * this.rungHeight/2;
        loc.y -= Math.cos(theta) * this.rungHeight/2;

        
        let rung_hole = (0.38 + 0.22*Math.random())*this.rungHeight;

        let color = 'black';
        let rung = new Rung(color, loc, vel, theta, this.rungHeight, this.rungWidth, rung_hole, this.rungHoleHeight, 
                            this.columnHeadImg, this.columnPoleImg
        );
        this.rungsArray.push(rung);
        this.total_rungs_so_far++;
    }

    garbage_collection() {
        this.rungsArray = this.rungsArray.filter(rung => {
            return (rung.loc.x-this.spawnCenter.x)**2 + (rung.loc.y-this.spawnCenter.y)**2 < 10*this.spawnRadius**2;
        });
    }

    test_rung() {
        let rung = new Rung('black', {x: 300, y:300}, {x:0, y:0}, Math.PI/4, 400, 100, 100, 100, 
            this.columnHeadImg, this.columnPoleImg);
        this.rungsArray.push(rung);
    }
}














class Rung {
    constructor(color, loc, vel, theta, height, width, hole, hole_height, 
                head_image, pole_image) {
        this.color = color;
        this.loc = loc;
        this.vel = vel;
        this.theta = theta;
        this.height = height || 2000;
        this.width = width || 50;
        this.hole = hole || 1000;
        this.hole_height = hole_height || 100;
        
        // flag for rung having been passed
        this.passed = false;
        
        // images
        this.head_image = head_image;      // image of column headpiece
        this.pole_image = pole_image;      // image of column pole

        this.img_width_scale = 1.4;                    // scale image rel to hitbox to cover
        this.midX = this.loc.x + this.width/2.0;       // x-coord of center of rung

        // get width and height of headpiece image (scaled by image width scale)
        this.head_width = this.width*this.img_width_scale; 
        this.head_height = this.head_width*0.6;

        // get width of pole image
        this.pole_width_scale = 0.56; // scale pole image by this factor (skinner than head)
        this.pole_width = this.width*this.pole_width_scale*this.img_width_scale;

    }

    draw(c) {
        this.update();
        c.save();
        c.translate(this.loc.x, this.loc.y);
        c.rotate(this.theta);
        c.translate(-this.loc.x, -this.loc.y);
        this.draw_bottom_rung(c);

        // flip canvas to draw top rung upside down
        // note that the y-coord must be updated to draw in correct location (see draw_top_rung)
        c.scale(1, -1);

        this.draw_top_rung(c);

        c.restore();
        
        
    }
    draw_top_rung(c) {
        /* Draws top section of rung above hole */


        // Headpiece 
        let head_loc = {
                    x: this.midX - this.head_width/2, 
                    y: this.loc.y+this.hole-this.head_height};
        head_loc.y = -head_loc.y-this.head_height; // flip y-coord since c.scale(1, -1)
        
        c.drawImage(this.head_image, head_loc.x, head_loc.y, this.head_width, this.head_height);

        // Pole-piece
        let pole_height = this.hole - this.head_height;
        let pole_loc = {
            x: this.midX - this.pole_width/2, 
            y: this.loc.y+pole_height*0.004 //draw a little higher to avoid gap between head and pole
        };
        pole_loc.y = -pole_loc.y - pole_height; // flip y-coord since c.scale(1, -1)

        c.drawImage(this.pole_image, pole_loc.x, pole_loc.y, this.pole_width, pole_height);

        /* Draw Hitbox
        c.scale(1, -1);
        c.fillStyle = 'rgba(80, 0, 0, 0.5)';
        c.fillRect(this.loc.x, this.loc.y, this.width, this.hole);
        */
        
    }
    draw_bottom_rung(c) {
        // Headpiece
        let head_loc = {
            x: this.midX - this.head_width/2,
            y: this.loc.y + this.hole + this.hole_height
        };
        c.drawImage(this.head_image, head_loc.x, head_loc.y, this.head_width, this.head_height);

        // Pole-piece
        let pole_height = this.height - this.hole - this.hole_height - this.head_height;
        let pole_loc = {
            x: this.midX - this.pole_width/2,
            y: this.loc.y + this.hole + this.hole_height + this.head_height - pole_height*0.004
        }
        
        c.drawImage(this.pole_image, pole_loc.x, pole_loc.y, this.pole_width, pole_height);
        /* Draw Hitbox
        c.fillStyle = 'rgba(80, 0, 0, 0.5)';
        c.fillRect(this.loc.x, this.loc.y + this.hole + this.hole_height,
                     this.width, this.height - this.hole - this.hole_height);
        */
        
    }
    update() {
        this.loc.x += this.vel.x;
        this.loc.y += this.vel.y;
        this.midX = this.loc.x + this.width/2.0;
    }
    transform(x, y) {
        // move center of rung -> 0, 0
        x -= (this.loc.x);
        y -= (this.loc.y);

        // rotate about origin by -theta
        let x_prime = x*Math.cos(-this.theta) - y*Math.sin(-this.theta);
        let y_prime = x*Math.sin(-this.theta) + y*Math.cos(-this.theta);

        return [x_prime, y_prime];
    }
    checkCollision(x, y, radius) {
        // transform x and y to be relative to run where rung is unrotated at 0,0
        let [x_t, y_t] = this.transform(x, y);

        
        // check intersection with top rectangle
        let top_intersect = this.check_intersect_circle_rect(x_t, y_t, radius, 0, 0, this.width, this.hole);

        if (top_intersect) {return true;}

        let bot_intersect = this.check_intersect_circle_rect(
                                        x_t, y_t, radius, 
                                        0, this.hole + this.hole_height, this.width, this.height - this.hole - this.hole_height);
        return bot_intersect;
    }
    checkCollision_and_pass(x, y, radius) {
        // transform x and y to be relative to run where rung is unrotated at 0,0
        let [x_t, y_t] = this.transform(x, y);


        // check intersection with top rectangle
        let top_intersect = this.check_intersect_circle_rect(x_t, y_t, radius, 0, 0, this.width, this.hole);

        // intersect with top rung
        if (top_intersect) {
            this.passed = true;
            return [true, 0];}

        let bot_intersect = this.check_intersect_circle_rect(
                                        x_t, y_t, radius, 
                                        0, this.hole + this.hole_height, this.width, this.height - this.hole - this.hole_height);
        
        // intersect with bottom rung
        if (bot_intersect) {
            this.passed = true;
            return [true, 0];}

        // if rung already passed, do not check again
        if (this.passed) {return [false, 0];}

        // check if passed by if xt > width
        if (x_t > this.width) {
            this.passed = true;
            return [false, 1];
        }
        else {
            return [false, 0];
        }
    }
    check_intersect_circle_rect(c_x, c_y, c_r, r_x, r_y, r_w, r_h) {

        // move center of rectangle to 0, 0
        r_x += r_w/2;
        r_y += r_h/2;

        let circleDistance = {
            x: Math.abs(c_x - r_x),
            y: Math.abs(c_y - r_y)
        }

        if (circleDistance.x > (r_w/2 + c_r)) { return false; }
        if (circleDistance.y > (r_h/2 + c_r)) { return false; }
        if (circleDistance.x <= (r_w/2)) { return true; }
        if (circleDistance.y <= (r_h/2)) { return true; }

        let cornerDist_sq = (circleDistance.x - r_w/2)**2 + (circleDistance.y - r_h/2)**2;
        
        return (cornerDist_sq <= c_r^2);
    }

}


