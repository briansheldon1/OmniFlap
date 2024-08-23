export default class G {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.spawnRate = 4000; // ms between rung spawn

        this.init_images();
        this.init_mainPlayer();
        this.init_rungs();
        this.init_count();

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
    init_mainPlayer() {
        this.mainPlayerArgs = {
            img: this.flappyImg,
            gravity: this.canvasWidth/6600.0,
            radius: Math.floor(this.canvasWidth/28),
            loc: {x: this.canvasWidth/2, y: this.canvasHeight/2},
            friction: 0.98, 
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            jumpSpeed: Math.floor(this.canvasHeight/80),
            leftRightSpeed: Math.floor(this.canvasWidth/150)
        };
    }

    init_rungs() {
        this.rungsArgs = {
            spawnCenter: {
                x: this.canvasWidth/2,
                y: this.canvasHeight/2
            },
            spawnRadius: 0.5*(canvas.width**2 + canvas.height**2)**0.5,
            rungSpeed: canvas.width/500,
            rungHeight: 1.1*Math.sqrt(canvas.width**2+canvas.height**2),
            rungWidth: Math.floor(canvas.width/7),
            rungHoleHeight: Math.floor(canvas.width/3.3), 
            columnHeadImg: this.columnHeadImg,
            columnPoleImg: this.columnPoleImg
        };
    }

}