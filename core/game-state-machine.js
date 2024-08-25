export default class GameStateMachine {
    constructor(gameManager, c) {
        this.gameManager = gameManager;
        this.c = c;
        this.states = {
            PRE_GAME: new PreGameState(this),
            MENU: new MenuState(this),
            CLASSIC: new ClassicMode(this),
            HYPER: new HyperMode(this),
            GAME_OVER: new GameOverState(this)
        };
        
        this.lastState = null;

        // set current state up
        this.currentState = this.states.PRE_GAME;
        this.currentState.enter();
    }

    transitionTo(state) {
        this.lastState = this.currentState.key;
        this.currentState.exit();
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    transitionToLastState() {
        this.transitionTo(this.lastState);
    }

    update() {
        this.currentState.update();
    }

    render() {
        this.currentState.render(this.c);
    }
}


// PRE_GAME (black screen with start button, no music)
class PreGameState {
    constructor(machine) {
        this.key = 'PRE_GAME';
        this.machine = machine;
        this.gameManager = machine.gameManager;
    }

    enter() {
        // initialize startButton
        this.gameManager.pregameStartBtn.visible = true;
        this.gameManager.pregameStartBtn.setOnClick(() => {
            this.machine.transitionTo('MENU');
        })
    }

    exit() {
        // Cleanup pre-game state
        this.machine.gameManager.pregameStartBtn.visible = false;
    }

    update() {
        // no updating in this state
        return;
    }

    render(c) {
        // Render background as black
        c.fillStyle = 'black';
        c.fillRect(0, 0, c.canvas.width, c.canvas.height);

        // Draw start button
        this.machine.gameManager.pregameStartBtn.draw(c);
    }
}


// MENU (menu screen with various buttons and menu music)
class MenuState {
    constructor(machine) {
        this.key = 'MENU';
        this.machine = machine;
        this.gameManager = machine.gameManager;
    }

    enter() {
        // make menuUI visible
        this.gameManager.menuUI.visible = true;

        // set onClick for each button
        this.gameManager.menuUI.elements['playButton'].setOnClick(() => {
            this.machine.transitionTo('CLASSIC');
        })
        this.gameManager.hyperButton.setOnClickOnce(() => {
            this.machine.transitionTo('HYPER');
        });

        // play music
        this.gameManager.backgroundMusic.play();

        // move player to visible position
        this.gameManager.player.loc = {x: this.gameManager.canvasWidth/2, y: this.gameManager.canvasHeight/4};
        this.gameManager.player.vel = {x: 0, y: 0, theta: 0};
        this.gameManager.player.theta = Math.PI/8;
    }


    exit() {
        // Cleanup menu state
        this.gameManager.menuUI.visible = false;
    }

    update() {
        // no updating in this state
        return;
    }

    render(c) {
        // render playing background image
        c.drawImage(this.gameManager.backgroundImg, 0, 0, c.canvas.width, c.canvas.height);

        // draw flappy character
        this.gameManager.player.draw(c, c.canvas.width, c.canvas.height);

        // Draw menu buttons
        this.gameManager.menuUI.draw(c);
    }
}


// CLASSIC (actual game state with game objects and game music)
class ClassicMode {
    constructor(machine) {
        this.key = 'CLASSIC';
        this.machine = machine;
        this.gameManager = machine.gameManager;
    }

    enter() {

        // begin interval for spawning rungs
        this.gameManager.spawnInterval = setInterval(() => {
            this.gameManager.rungs.spawn_rung()
        }, this.gameManager.rungSpawnRate);

        // ensure player and rungs not halted
        this.gameManager.player.reset({resetLoc: false});
        this.gameManager.rungs.reset();
    }

    exit() {
        // Cleanup playing state
        clearInterval(this.gameManager.spawnInterval);

        // play fail sound
        this.gameManager.failSound.play();

        // halt player and rungs
        this.gameManager.player.halted = true;
        this.gameManager.rungs.halted = true;
    }

    update() {
        // update game objects
        this.gameManager.player.update();
        this.gameManager.rungs.update();

        let player = this.gameManager.player;
        if (player.loc.y + player.radius >= this.gameManager.canvasHeight) {
            player.theta = 0;
        }

        // check for collision
        if (this.checkCollision_and_pass()) {
            this.machine.transitionTo('GAME_OVER');
        }

    }

    render(c) {
        // clear previous canvas
        c.clearRect(0, 0, innerWidth, innerHeight);

        // draw background image
        c.drawImage(this.gameManager.backgroundImg, 0, 0, c.canvas.width, c.canvas.height);

        // draw game objects
        this.gameManager.rungs.draw(c);
        this.gameManager.player.draw(c, c.canvas.width, c.canvas.height);
        

        // draw count
        this.gameManager.drawCount(c);
    }
    checkCollision_and_pass() {

        let player = this.gameManager.player;
        let rungsArray = this.gameManager.rungs.rungsArray;
    
        let x = player.loc.x;
        let y = player.loc.y;
        let radius = player.radius;
    
        // check collision with each rung
        for (let i=0; i<rungsArray.length; i++) {
            let rung = rungsArray[i];
            let [collision, passed] = rung.checkCollision_and_pass(x, y, radius);
            if (collision) {
                return true;
            }
            this.gameManager.count += passed;
        }
        return false;
    }
}

class HyperMode extends ClassicMode {
    constructor(machine) {
        super(machine);
        this.key = 'HYPER';

        // speed multiplier for hyper mode
        this.currMult = 1;
        this.maxMult = 3;
        this.rungsPerLevel = 1;
        this.currLevel = 1;
        this.maxLevel = 100;

        // store old spawn rates and rung sped
        this.origSpawnRate = this.gameManager.rungSpawnRate;
        this.origRungSpeed = this.gameManager.rungs.rungSpeed;
    }
    update() {

        // speed up when new level reached
        this.currLevel = 1+Math.floor(this.gameManager.count/this.rungsPerLevel);
        if (this.currLevel > this.gameManager.level) {
            this.speedUp();
        }

        super.update();
    }
    exit() {
        super.exit();
        this.gameManager.rungSpawnRate = this.origSpawnRate;
        this.gameManager.rungs.rungSpeed = this.origRungSpeed;
    }
    speedUp() {

        // update level
        this.gameManager.level = this.currLevel;

        // update curr multiplier
        this.currMult = 1+(this.gameManager.level/this.maxLevel)*(this.maxMult-1);

        // increase speed and spawn rate
        this.gameManager.rungSpawnRate = this.origSpawnRate/this.currMult;
        this.gameManager.rungs.rungSpeed = this.origRungSpeed*this.currMult;
        this.gameManager.rungs.rungsArray.forEach(rung => {
            rung.vel.x *= this.currMult;
            rung.vel.y *= this.currMult;
        });

        // create new spawn interval
        clearInterval(this.gameManager.spawnInterval);
        this.gameManager.spawnInterval = setInterval(() => {
            this.gameManager.rungs.spawn_rung()
        }, this.gameManager.rungSpawnRate);
    }
}
class GameOverState extends MenuState {
    constructor(machine) {
        super(machine);
        this.key = 'GAME_OVER';
    }

    enter() {
        // make menuUI visible
        this.gameManager.deathUI.visible = true;

        // add onclick for restart button
        this.gameManager.restartButton.setOnClickOnce(() => {
                this.gameManager.count = 0;
                this.gameManager.player.reset({resetLoc: true});
                this.machine.transitionToLastState();
            });

        this.gameManager.mainMenuButton.setOnClickOnce(() => {
            this.gameManager.count = 0;
            this.machine.transitionTo('MENU');
        });
    }
    update() {
        this.gameManager.player.update();
        this.gameManager.rungs.update();
    }

    exit() {
        // Cleanup game over state
        this.gameManager.menuUI.visible = false;
    }

    render(c) {
        // render playing background image
        c.drawImage(this.gameManager.backgroundImg, 0, 0, c.canvas.width, c.canvas.height);

        // Draw menu buttons
        this.gameManager.rungs.draw(c);
        this.gameManager.player.draw(c);
        this.gameManager.deathUI.draw(c);
    }
}