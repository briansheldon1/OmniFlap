export default class Rung {
    constructor(color, loc, vel, theta) {
        this.color = color;
        this.loc = loc;
        this.vel = vel;
        this.theta = theta;
        this.width = 60;
        this.height = 1000;
        this.hole = 400;
        this.hole_height = 100;

    }

    draw(c) {
        this.update();
        c.save();
        c.translate(this.loc.x+this.width/2, this.loc.y+this.height/2);
        c.rotate(this.theta);
        c.translate(-this.loc.x-this.width/2, -this.loc.y-this.height/2);
        this.draw_bottom_rung(c);
        this.draw_top_rung(c);

        c.restore();
        
        
    }
    draw_top_rung(c) {
        c.fillStyle = this.color;

        // draw up to hole
        c.fillRect(this.loc.x, this.loc.y, this.width, this.hole);
    }
    draw_bottom_rung(c) {
        c.fillStyle = this.color;

        // draw from below hole to bottom
        c.fillRect(this.loc.x, this.loc.y + this.hole + this.hole_height,
                     this.width, this.height - this.hole - this.hole_height);
    }
    update() {
        this.loc.x += this.vel.x;
        this.loc.y += this.vel.y;
    }
    transform(x, y) {
        // move center of rung -> 0, 0
        x -= (this.loc.x + this.width/2);
        y -= (this.loc.y + this.height/2);

        // rotate about origin by -theta
        let x_prime = x*Math.cos(-this.theta) - y*Math.sin(-this.theta);
        let y_prime = x*Math.sin(-this.theta) + y*Math.cos(-this.theta);

        // move top left of rung -> 0, 0
        y_prime += this.height/2;
        //x_prime += this.width/2;
        return [x_prime, y_prime];
    }
    check_intersect(x, y, radius) {
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
    check_intersect_circle_rect(c_x, c_y, c_r, r_x, r_y, r_w, r_h) {

        let circleDistance = {
            x: Math.abs(c_x - r_x),
            y: Math.abs(c_y - r_y)
        }

        if (circleDistance.x > (r_w/2 + c_r)) { return false; }
        if (circleDistance.y > (r_h/2 + c_r)) { return false; }
        if (circleDistance.x <= (r_w/2)) { return true; }
        if (circleDistance.y <= (r_h/2)) { return true; }

        cornerDist_sq = (circleDistance.x - r_w/2)^2 +
                        (circleDistance.y - r_h/2)^2;
        
        return (cornerDist_sq <= c_r^2);
    }

}