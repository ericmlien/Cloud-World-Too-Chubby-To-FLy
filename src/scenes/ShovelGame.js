class ShovelGame extends Phaser.Scene {
    constructor() {
        super("shovelScene");
    }

    init() {
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED") + 1;
        this.GAMES = this.registry.get("GAMES");
        this.LOWEST = Math.floor(this.NUM_PLAYED / this.GAMES.length);
    }

    create() {
        this.shovel = this.add.sprite(width / 2, height / 2, "arrow").setScale(5).setOrigin(0.5, 1);
        this.shovel.angle = -120;

        this.GAMES[3][1] += 1;
        this.registry.set("GAMES", this.GAMES);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.transition = this.sound.add("transition");
        this.win = false;

        this.lastKey = null;
        this.shakes = 0;
        this.maxShakes = Math.round(25 + 0.5 *  Math.pow(this.NUM_PLAYED, 1.05));
        console.log("Max Shakes: " + this.maxShakes)
        this.gameOver = false;

        this.transitioning = false;
        this.transitionIn();

        this.progressBar = this.add.rectangle(0, height - 30, width, 60, 0xFFF000, 1).setOrigin(0, 0.5);
        this.progess = this.add.tween({
            targets: this.progressBar,
            width: 0,
            duration: 7000 - Math.pow(this.LOWEST, 1.3) > 3000 ? 7000 - Math.pow(this.LOWEST, 1.3) : 3000,
            onComplete: () => {
                this.gameOver = true;
                this.timeUp = true;
                this.LIVES -= 1;
                console.log("Lives: " + this.LIVES);
                this.registry.set("LIVES", this.LIVES);
                this.transitionOut();
            },
            onCompleteScope: this,
        });
    }

    update() {
        if (this.shakes > this.maxShakes || this.gameOver) {
            this.win = true;
            this.transitionOut();
        } else if (this.shakes <= this.maxShakes && !this.gameOver){
            let pressedKey = null;

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                pressedKey = 'up';
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
                pressedKey = 'down';
            }

            if (pressedKey) {
                if (this.lastKey && this.lastKey !== pressedKey) {
                    this.shovel.angle += pressedKey === 'up' ? -10 : 10;
                    this.shakes++;
                }
                this.lastKey = pressedKey;   
            }
        }
    }

    transitionOut() {
        if (this.transitioning) return;
        this.scene.pause();
        this.transitioning = true;
        this.registry.set("NUM_PLAYED", this.NUM_PLAYED);
        let textureManager = this.textures;
        this.game.renderer.snapshot((snapshotImage) => {
            if (textureManager.exists('gamesnapshot')) {
                textureManager.remove('gamesnapshot');
            }
            textureManager.addImage('gamesnapshot', snapshotImage);
            
            requestAnimationFrame(() => {
                if (this.win) {
                    this.registry.set("GAME_SCORE", 100 * (1 + 0.5 * (Math.pow(this.LOWEST, 1.4))));                
                }
                if (this.LIVES > 0) {
                    console.log("going to transition to the transition scene!");
                    this.scene.start("transitionScene");
                } else {
                    this.registry.set("GAME_SCORE", 0);
                    this.scene.start("menuScene");
                }
            });
        });
    }

    transitionIn() {
        if (this.textures.exists("gamesnapshot")) {
            let screenshot = this.add.image(width / 2, height / 2, "gamesnapshot");
            let iris = this.add.graphics()
            iris.fillRect(0, 0, width, height).fillStyle(0x000000).lineStyle(4, 0xfacade);
            this.transition.play();
            const mask = iris.createGeometryMask();
            screenshot.setMask(mask);
            this.irisout = this.tweens.add({
                targets: iris,
                x: width / 2,
                y: height / 2,
                scale: 0,
                ease: "linear",
                duration: 300,
                repeat: 0,
                yoyo: false,
                paused: false,
                onComplete: () => {
                    screenshot.destroy();
                    iris.destroy();
                    mask.destroy();
                }
            });

            this.popup = this.add.image(width / 2, height / 2, "mash").setOrigin(0.5, 0.5).setScale(0);
            this.popupout = this.tweens.chain({
                targets: this.popup,
                loop: 0,
                tweens: [
                    {
                        scale: 0.3,
                        ease: "Expo.easeOut",
                        duration: 600,
                        repeat: 0,
                    },
                    {
                        y: -this.popup.height,
                        ease: "Expo.easeIn",
                        duration: 400,
                        repeat:0,
                    }
                ],
            });

        } else {
            console.log('texture error');
        }
    }
}