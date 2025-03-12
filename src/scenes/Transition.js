class Transition extends Phaser.Scene {
    constructor() {
        super("transitionScene");
    }
    init() {
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED");
        this.GAMES = this.registry.get("GAMES");
        this.LOWEST = Math.floor(this.NUM_PLAYED / this.GAMES.length);
    }
    create() {
        this.cameras.main.setBackgroundColor(0xDAAAAB);  
        console.log("The number of games played is: " + this.NUM_PLAYED);
        console.log("The lowest game played is: " + this.LOWEST);

        this.transition = this.sound.add("transition");


        this.ROLL = 0;
        let next_game_found = false;
        this.next_game = "";
        console.log ("We are now in the transition scene!" + (this.GAMES.length - 1));
        for (let i = 0; i < this.GAMES.length; i++){
            console.log("The " + i + "th element in GAMES is: " + this.GAMES[i][0]);
            console.log("its playcount is: " + this.GAMES[i][1]);
        }
        while (!next_game_found) {
            this.ROLL = Phaser.Math.Between(0, this.GAMES.length - 1);
            if (this.GAMES[this.ROLL][1] == this.LOWEST) {
                this.registry.set("GAMES", this.GAMES);
                this.next_game = this.GAMES[this.ROLL][0];
                next_game_found = true;
            }
        }


        this.transitionTimer = this.time.addEvent(this.transitionTimerConfig);


        for (let i = 1; i <= this.LIVES; i++) {
            let life_icon = new LifeIcon(this, 60, 40 + i * (height / 7), 1.5);
        }

        let scoreConfig = {
            fontFamily: "puppycat",
            fontSize:"48px",
            color: "#BEEAAD",
            align: "center",
        }

        this.runningScore = this.registry.get("RUNNING_SCORE");
        this.gameScore = this.registry.get("GAME_SCORE");

        this.scoreCounter = this.add.text(width / 2, height / 2, this.runningScore, scoreConfig).setOrigin(0.5);

        this.scoreCountUp = this.tweens.add({
            targets: {
                value: this.runningScore,
            },
            value: this.runningScore + this.gameScore,
            duration: 2000,
            ease: "Cubic.easeInOut",
            repeat: false,
            onUpdate: (tween) => {
                this.scoreCounter.setText(Math.floor(tween.getValue()));
            },
            onComplete: () => {
                this.registry.set("RUNNING_SCORE", this.runningScore + this.gameScore);
                this.registry.set("GAME_SCORE", 0);
                this.scene.pause();
                this.transitionOut();
            }
        })

        this.transitionIn();
    }
    update() {

    }

    transitionOut() {
        let textureManager = this.textures;
        this.game.renderer.snapshot((snapshotImage) => {
            if (textureManager.exists('gamesnapshot')) {
                textureManager.remove('gamesnapshot');
            }
            textureManager.addImage('gamesnapshot', snapshotImage);
        });
        requestAnimationFrame(() => {
            this.scene.start(this.next_game);
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

            this.popup = this.add.image(width / 2, height / 2, "rock").setOrigin(0.5, 0.5).setScale(0);
            this.popupout = this.tweens.chain({
                targets: this.popup,
                loop: 0,
                tweens: [
                    {
                        scale: 2,
                        ease: "Expo.easeOut",
                        duration: 200,
                        repeat: 0,
                    },
                    {
                        y: -this.popup.height,
                        ease: "Back.easeIn",
                        duration: 400,
                        repeat:0,
                    }
                ],
            })

        } else {
            console.log('texture error');
        }
    }
}