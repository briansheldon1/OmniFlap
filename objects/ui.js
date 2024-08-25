export class UIFrame {
    constructor({loc}) {

        // array of elements within UI
        this.elements = {};

        this.loc = loc;


        // flag for seeing ui
        // if not visible cannot interact with elements
        this.visible = false;
    }

    draw(c) {

        // if not visible return early
        if (!this.visible) {return;}

        // draw elements
        for (const [key, element] of Object.entries(this.elements)) {
            element.draw(c);
        }

    }

    handleClick(x, y) {

        // if not visible return early
        if (!this.visible) {return false;}

        // check each element to see if within click
        let x_rel = x - this.loc.x;
        let y_rel = y - this.loc.y;
        
        for (const [key, element] of Object.entries(this.elements)) {
            if (element.type !== 'button') {continue;}
            if (x_rel > element.loc.x && x_rel < element.loc.x + element.width && 
                y_rel > element.loc.y && y_rel < element.loc.y + element.height) {
                element.onClick();
                return true; 
            }
        }
        return false;
    }
    addElement(key, element) {

        // return early if key already exists
        if (key in this.elements) {
            return;
        }

        // add element to elements array
        
        this.elements[key] = element;
        element.uiParent = this;
    }
}


export class Button {
    constructor({uiParent, loc, width, height, textStyle, bkgStyle, onClick, centerBtn, text}) {
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
        this.type = 'button';
        this.uiParent = uiParent;
        this.loc = loc; // rel to uiParent
        this.width = width;
        this.height = height;
        this.onClick = onClick;
        this.text = text;
        this.background = 'white';
        this.visible = true;

        // styles
        this.textStyle = textStyle;
        this.bkgStyle = bkgStyle;

        // center the button if specified
        if (centerBtn !== undefined && centerBtn) {
            this.loc.x -= this.width/2;
            this.loc.y -= this.height/2;
        }

        // initialize onClick with additional style change added
        if (onClick !== undefined) {
            this.setOnClick(onClick);
        }
    }
    setOnClick(onClickSet) {

        // set onClick using wrapper 
        this.onClick = () => {
            if (!this.visible) {return;}
            onClickSet();
        }
    }
    setOnClickOnce(onClickSet) {
        if (this.onClick === undefined) {
            this.setOnClick(onClickSet);
        }
    }
    draw(c) {
        c.save();

        // translate to uiParent loc if exists
        if (this.uiParent !== undefined) {
            c.translate(this.uiParent.loc.x, this.uiParent.loc.y);
        }

        // draw button background
        this.applyStyle(c, this.bkgStyle);
        c.fillRect(this.loc.x, this.loc.y, this.width, this.height);
        c.strokeRect(this.loc.x, this.loc.y, this.width, this.height);

        // draw button text
        this.applyStyle(c, this.textStyle);
        c.fillText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);

        c.restore();
    }
    applyStyle(c, style) {
        for (let key in style) {
            c[key] = style[key];
        }
    }
    handleClick(x, y) {
        /* Returns boolean of whether click went through */

        // only for if no ui parent exists
        if (!(this.uiParent === undefined)) {
            
            return false;
        }

        // if not visible return early
        if (!(this.visible)) {
            return false;
        }
        
        // check if click is within button
        if (x > this.loc.x && x < this.loc.x + this.width && 
            y > this.loc.y && y < this.loc.y + this.height) {
            
            this.onClick();
            return true;
        }
        return false;
    }
    changeText(text) {
        this.text = text;
    }
}

export class TextElement {
    constructor({uiParent, loc, width, height, textStyle, bkgStyle, visible, text, centerText}) {
        this.type = 'textElement';
        this.uiParent = uiParent;
        this.loc = loc;
        this.width = width;
        this.height = height;
        this.text = text;
        this.bkgStyle = bkgStyle;
        this.textStyle = textStyle;

        // center the text if specified
        if (centerText !== undefined && centerText) {
            this.loc.x -= this.width/2;
            this.loc.y -= this.height/2;
        }

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

        // draw background
        if (this.bkgStyle !== undefined) {
            this.applyStyle(c, this.bkgStyle);
            c.fillRect(this.loc.x, this.loc.y, this.width, this.height);
        }

        // draw text
        if (this.textStyle !== undefined) {
            this.applyStyle(c, this.textStyle);
            c.fillText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);

            // draw stroke text if lineWidth is defined and non-zero
            if (this.textStyle.lineWidth !== undefined && 
                this.textStyle.lineWidth !==0) {
                c.strokeText(this.text, this.loc.x + this.width/2, this.loc.y + this.height/2);
            }
        }

        c.restore();
    }
    applyStyle(c, style) {
        for (let key in style) {
            c[key] = style[key];
        }
    }
}

export class ImageElement {
    constructor({uiParent, loc, width, height, img, visible}) {
        this.type = 'imageElement';
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