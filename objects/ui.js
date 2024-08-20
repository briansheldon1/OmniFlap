export default class UI {
    constructor({loc, width, height, backgroundColor}) {

        // array of buttons within UI
        this.buttonsArray = [];

        this.loc = loc;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;


        // flag for seeing ui
        // if not visible cannot interact with buttons
        this.visible = false;
    }

    draw(c) {
        if (!this.visible) {return;}

        // draw background
        if (this.backgroundColor!=undefined) {
            c.fillStyle = this.backgroundColor;
            c.fillRect(this.loc.x, this.loc.y, this.width, this.height);
        }

        // draw buttons
        this.buttonsArray.forEach(button => 
                                    {button.draw(c);}
                                );

    }

    handleClick(x, y) {

        // if not visible return early
        if (!this.visible) {return;}

        // if click not within ui return early
        if (x < this.loc.x || x > this.loc.x + this.width || 
            y < this.loc.y || y > this.loc.y + this.height) {
            return;
        }

        // check each button to see if within click
        let x_rel = x - this.loc.x;
        let y_rel = y - this.loc.y;
        for (let i=0; i<this.buttonsArray.length; i++) {
            let button = this.buttonsArray[i];
            if (x_rel > button.loc.x && x_rel < button.loc.x + button.width && 
                y_rel > button.loc.y && y_rel < button.loc.y + button.height) {
                button.onClick();
                return; // only one button can be clicked
            }
        }
    }
    addButton(button) {
        // check if button fits
        if (button.loc.x<0 || button.loc.y<0 || 
            button.loc.x+button.width>this.width || button.loc.y+button.height>this.height) {
        if (button.loc.x + button.width > this.width || button.loc.y + button.height > this.height) {
            throw new Error('Button does not fit within UI');
        }
    }
    }
}


class button {
    constructor({uiParent, doc, loc, width, height, font, fillStyle, textAlign, strokeStyle, lineWidth, onClick}) {
        this.uiParent = uiParent;
        this.loc = loc; // rel to uiParent
        this.width = width;
        this.height = height;
        this.fontArgs = {
            font: font,
            fillStyle: fillStyle,
            textAlign: textAlign,
            strokeStyle: strokeStyle,
            lineWidth: lineWidth
        };
        this.text = text;
        this.font = font;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.onClick = onClick;
    }
    draw(c) {
        c.save();

        // apply uiParent loc
        c.translate(this.uiParent.loc.x, this.uiParent.loc.y);

        // draw button
        c.fillStyle = this.fillStyle;
        c.strokeStyle = this.strokeStyle;
        c.lineWidth = this.lineWidth;
        c.fillRect(this.loc.x, this.loc.y, this.width, this.height);
        c.strokeRect(this.loc.x, this.loc.y, this.width, this.height);

        // draw text
        c.font = this.font;
        c.fillStyle = 'black';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);

        c.restore
    }
}