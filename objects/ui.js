export class UIFrame {
    constructor({loc}) {

        // array of elements within UI
        this.elements = [];

        this.loc = loc;


        // flag for seeing ui
        // if not visible cannot interact with elements
        this.visible = false;
    }

    draw(c) {

        // if not visible return early
        if (!this.visible) {return;}

        // draw elements
        this.elements.forEach(element => 
                                 {element.draw(c);}
                              );  

    }

    handleClick(x, y) {

        // if not visible return early
        if (!this.visible) {return;}

        // check each element to see if within click
        let x_rel = x - this.loc.x;
        let y_rel = y - this.loc.y;
        for (let i=0; i<this.elements.length; i++) {
            let element = this.elements[i];
            if (x_rel > element.loc.x && x_rel < element.loc.x + element.width && 
                y_rel > element.loc.y && y_rel < element.loc.y + element.height) {
                element.onClick();a
                return; // only one element can be clicked
            }
        }
    }
    addElement(element) {
        // add element to elements array
        this.elements.push(element);
        element.uiParent = this;
        console.log(this.loc);
    }
}


export class Button {
    constructor({uiParent, loc, width, height, unClickedStyle, clickedStyle, onClick}) {
        /*  
            style: {
                text (str): string of text to display on button
                font: font style for text
                fillStyle: fill style for text
                strokeStyle: stroke style for text
                lineWidth: line-width for text
                textAlign: text alignment
                textBaseline: text baseline
                bkgColor: background color of button
                bkgBorderColor: border color of button
                bkgBorderWidth: border width of button
            }
        */
        this.uiParent = uiParent;
        this.loc = loc; // rel to uiParent
        this.width = width;
        this.height = height;
        this.onClick = onClick;
        this.text = 'Button';
        this.background = 'white';
        this.visible = true;

        // styles
        this.unClickedStyle = unClickedStyle;
        this.clickedStyle = clickedStyle;
        this.clicked = false;

        // initialize onClick with additional style change added
        this.setOnClick(onClick);
    }
    setOnClick(onClick) {
        // set onClick using wrapper 
        this.onClick = () => {
            if (!this.visible) {return;}
            this.clicked = !this.clicked;
            onClick();
        }
    }
    draw(c) {
        c.save();

        // translate to uiParent loc if exists
        if (this.uiParent !== undefined) {
            c.translate(this.uiParent.loc.x, this.uiParent.loc.y);
        }

        // draw button background
        this.applyBkgStyle(c);
        c.fillRect(this.loc.x, this.loc.y, this.width, this.height);
        c.strokeRect(this.loc.x, this.loc.y, this.width, this.height);

        // draw button text
        this.applyTextStyle(c);
        c.fillText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);

        c.restore();
    }
    applyTextStyle(c) {

        // set style based on clicked
        let style = this.clicked ? this.clickedStyle : this.unClickedStyle;

        // apply style for text
        this.text = style.text;
        c.font = style.font;
        c.fillStyle = style.fillStyle;
        c.strokeStyle = style.strokeStyle;
        c.lineWidth = style.lineWidth;
        c.textAlign = style.textAlign;
        c.textBaseline = style.textBaseline;
    }
    applyBkgStyle(c) {

        // set style based on clicked
        let style = this.clicked ? this.clickedStyle : this.unClickedStyle;

        c.fillStyle = style.bkgColor;
        c.strokeStyle = style.bkgBorderColor;
        c.lineWidth = style.bkgBorderWidth;
    }
}

export class TextElement {
    constructor({uiParent, loc, width, height, style, visible}) {
        this.uiParent = uiParent;
        this.loc = loc;
        this.width = width;
        this.height = height;
        this.style = style;

        // set visibility
        if (visible === undefined) {
            this.visible = true;
        } else {
            this.visible = visible;
        }
    }
    draw(c) {

        // if not visible return early
        if (!this.visible) {return;}


        c.save();

        // apply uiParent loc
        if (this.uiParent !== undefined) {
            c.translate(this.uiParent.loc.x, this.uiParent.loc.y);
        }

        // draw element
        this.applyStyle(c);
        c.fillStyle = 'black';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);

        c.restore();
    }
    applyStyle(c) {
        return;
    }
}

export class ImageElement {
    constructor({uiParent, loc, width, height, img, visible}) {
        this.uiParent = uiParent;
        this.loc = loc;
        this.width = width;
        this.height = height;
        this.img = img;

        // set visibility
        if (visible === undefined) {
            this.visible = true;
        } else {
            this.visible = visible;
        }
    }
    draw(c) {

        // if not visible return early
        if (!this.visible) {return;}


        c.save();

        // apply uiParent loc
        if (this.uiParent !== undefined) {
            c.translate(this.uiParent.loc.x, this.uiParent.loc.y);
        }

        // draw element
        c.drawImage(this.img, this.loc.x, this.loc.y, this.width, this.height);

        c.restore();
    }
}