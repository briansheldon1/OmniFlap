import {UIFrame, Button, TextElement, ImageElement} from '../objects/ui.js';
import Player from '../objects/player.js';
import Rungs from '../objects/rungs.js';

export default class GameManager {
    constructor(canvasWidth, canvasHeight, document) {

        // set canvasWidth and canvasHeight 
        // (dictates game object sizes)
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // reference to document object
        this.document = document;

        // create and store UIs for game
        this.init_UIs();
        
        // initialize images and sounds
        this.init_images();
        this.init_sounds();

        this.init_player();
        this.init_rungs();

        // initialize counter and count visual configs
        this.init_count();
    }

    init_UIs() {

        this.uiArray = [];

        // store default style of buttons
        this.init_defButtonStyle();

        // standalone ui consisting of just start game
        // prior to entering actual game
        this.init_pregameStartBtn();
        
        // UI of main menu
        this.init_menuUI();

        // UI of death screen
        this.init_deathUI();
    }

    /**
     * Define default button styling for clicked and unclicked states
     */
    init_defButtonStyle() {
        this.defaultBtnStyle = {
            text: 'Button',
            font: `${Math.floor(this.canvasWidth/40)}px "Press Start 2P"`,
            fillStyle: 'white',
            strokeStyle: 'black',
            lineWidth: Math.floor(this.canvasWidth/100),
            textAlign: 'center',
            textBaseline: 'middle',
            bkgColor: 'orange',
            bkgBorderColor: 'black',
            bkgBorderWidth: Math.floor(this.canvasWidth/200),
        }
        this.btnWidth = this.canvasWidth/3;
        this.btnHeight = this.canvasHeight/20;
        this.btnMarginTop = this.canvasHeight/40;
    }
    /**
     * Initialize button that enters user into game (necessary for menu bkg music)
     */
    init_pregameStartBtn() {

        // Set style of button
        let style = JSON.parse(JSON.stringify(this.defaultBtnStyle));
        let buttonArgs = {
            text: 'Start',
            loc: {x: this.canvasWidth/2, y: this.canvasHeight/2},
            width: this.canvasWidth/5,
            height: this.canvasHeight/20,
            style: style,
            centerBtn: true
        };

        // Create button add to uiArray as a "standalone UI"
        this.pregameStartBtn = new Button(buttonArgs);
        this.uiArray.push(this.pregameStartBtn);
    }

    /**
     * Create UI for main menu (entered after hitting pregame start button)
     */
    init_menuUI() {


        // initialize menu UI
        this.menuUI = new UIFrame({loc: {x: this.canvasWidth/2, y: this.canvasHeight/2}});
        this.menuUI.visible = false;

        // Classic button
        let style = JSON.parse(JSON.stringify(this.defaultBtnStyle));
        let playButtonArgs = {
            text: 'Classic',
            loc: {x: 0, y: 0},
            width: this.btnWidth,
            height: this.btnHeight,
            style: style,
            centerBtn: true
        };
        let playButton = new Button(playButtonArgs);
        this.menuUI.addElement('playButton', playButton);
        
        // Hyper Mode button
        let hyperButtonArgs = {
            text: 'Hyper Mode',
            loc: {x: 0, y: this.btnMarginTop+this.btnHeight},
            width: this.btnWidth,
            height: this.btnHeight,
            style: style,
            centerBtn: true
        };
        let hyperButton = new Button(hyperButtonArgs);
        this.menuUI.addElement('hyperButton', hyperButton);

        // Settings button (halfWidth of other buttons)
        let smallStyle = JSON.parse(JSON.stringify(style));
        smallStyle.font = `${Math.floor(this.canvasWidth/60)}px "Press Start 2P"`;
        let halfWidth = this.btnWidth*0.5*0.9;
        let settingsButtonArgs = {
            text: 'Settings',
            loc: {x: (halfWidth-this.btnWidth)/2, y: 2*(this.btnMarginTop+this.btnHeight)},
            width: halfWidth,
            height: this.btnHeight,
            style: smallStyle,
            centerBtn: true
        };
        let settingsButton = new Button(settingsButtonArgs);
        this.menuUI.addElement('settingsButton', settingsButton);

        // Credits button
        let creditsButtonArgs = {
            text: 'Credits',
            loc: {x: -(halfWidth-this.btnWidth)/2, y: 2*(this.btnMarginTop+this.btnHeight)},
            width: halfWidth,
            height: this.btnHeight,
            style: smallStyle,
            centerBtn: true
        };
        let creditsButton = new Button(creditsButtonArgs);
        this.menuUI.addElement('creditsButton', creditsButton);

        // Add menu UI to uiArray
        this.uiArray.push(this.menuUI);
    }

    init_deathUI() {



        // initialize death UI
        this.deathUI = new UIFrame({loc: {x: this.canvasWidth/2, y: this.canvasHeight/2}});
        this.deathUI.visible = false;

        let btnWidth = this.btnWidth*1.6;
        let halfWidth = btnWidth*0.5*0.95;
        
        // Restart button (halfWidth + smallStyle)
        let style = JSON.parse(JSON.stringify(this.defaultBtnStyle));
        let smallStyle = JSON.parse(JSON.stringify(style));
        smallStyle.font = `${Math.floor(this.canvasWidth/60)}px "Press Start 2P"`;
        let restartBtnArgs = {
            text: 'Restart',
            loc: {x: (halfWidth-btnWidth)/2, y: 0},
            width: halfWidth,
            height: this.btnHeight,
            style: style,
            centerBtn: true
        };
        this.restartButton = new Button(restartBtnArgs);
        this.deathUI.addElement('restartButton', this.restartButton);

        // Main Menu button (halfWidth + smallStyle)
        let mainMenuBtnArgs = {
            text: 'Main Menu',
            loc: {x: -(halfWidth-btnWidth)/2, y: 0},
            width: halfWidth,
            height: this.canvasHeight/20,
            style: style,
            centerBtn: true
        };
        this.mainMenuButton = new Button(mainMenuBtnArgs);
        this.deathUI.addElement('mainMenuButton', this.mainMenuButton);

        // Leaderboard button
        let leaderboardBtnArgs = {
            text: 'Add To Leaderboard',
            loc: {x: 0, y: this.canvasHeight/10},
            width: btnWidth,
            height: this.canvasHeight/20,
            style: style,
            centerBtn: true
        };
        this.leaderboardButton = new Button(leaderboardBtnArgs);
        this.deathUI.addElement('leaderboardButton', this.leaderboardButton);




        // Add death UI to uiArray
        this.uiArray.push(this.deathUI);
    }
    init_images() {
        this.flappyImg = new Image();
        this.flappyImg.src = './assets/images/flappy_angel.png';

        this.columnHeadImg = new Image();
        this.columnHeadImg.src = './assets/images/column_head.png';

        this.columnPoleImg = new Image();
        this.columnPoleImg.src = './assets/images/column_pole.png';

        this.backgroundImg = new Image();
        this.backgroundImg.src = './assets/images/background.png';
    }
    init_sounds() {
 
        this.volume = 0.5;

        this.backgroundMusic = new Audio('./assets/sound/background-main.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5*this.volume;
        
        this.jumpSound = new Audio('./assets/sound/jump-sound.mp3');
        this.jumpSound.volume = this.volume;

        this.successSound = new Audio('./assets/sound/success-sound.mp3');
        this.successSound.volume = this.volume;

        this.failSound = new Audio('./assets/sound/fail-sound.mp3');
        this.failSound.volume = this.volume;
    }
    init_count() {
        this.countConfig = {
            font: `${Math.floor(this.canvasWidth/13)}px "Press Start 2P"`,
            textAlign: 'center',
            textBaseline: 'middle',
            strokeStyle: 'black',
            lineWidth: Math.floor(this.canvasWidth/60),
            fillStyle: 'white',
            loc: {
                x: this.canvasWidth/2,
                y: this.canvasHeight/5
            }
        };
        this.count = 0;
    }
    init_player() {

        // set player arguments
        this.playerArgs = {
            img: this.flappyImg,
            gravity: this.canvasWidth/6600.0,
            radius: Math.floor(this.canvasWidth/28),
            loc: {x: this.canvasWidth/2, y: this.canvasHeight/2},
            friction: 0.98, 
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            jumpSpeed: Math.floor(this.canvasHeight/80),
            leftRightSpeed: Math.floor(this.canvasWidth/150),
            jumpSound: this.jumpSound
        };

        // initialize players, add controls event listener
        this.player = new Player(this.playerArgs);
        this.player.init_controls(this.document);
    }

    init_rungs() {

        // rung spawn rate (ms)
        this.rungSpawnRate = 4000;

        // define rung sepcs (size, speed, etc.)
        this.rungsArgs = {
            spawnCenter: {
                x: this.canvasWidth/2,
                y: this.canvasHeight/2
            },
            spawnRadius: 0.5*(canvas.width**2 + canvas.height**2)**0.5,
            rungSpeed: canvas.width/400,
            rungHeight: 1.1*Math.sqrt(canvas.width**2+canvas.height**2),
            rungWidth: Math.floor(canvas.width/7),
            rungHoleHeight: Math.floor(canvas.width/3.3), 
            columnHeadImg: this.columnHeadImg,
            columnPoleImg: this.columnPoleImg,
            successSound: this.successSound
        };

        // create rungs object
        this.rungs = new Rungs(this.rungsArgs);
    }

    handleClick(mouseX, mouseY) {
        for (let i=0; i<this.uiArray.length; i++) {
            const clicked = this.uiArray[i].handleClick(mouseX, mouseY);
            if (clicked) {
                return;
            }
        }
    }

    drawCount(c) {

        // apply g.countConfig to context
        Object.keys(this.countConfig).forEach(key => {
            c[key] = this.countConfig[key];
        });
        c.strokeText(this.count, this.countConfig.loc.x, this.countConfig.loc.y);
        c.fillText(this.count, this.countConfig.loc.x, this.countConfig.loc.y);
    }

}