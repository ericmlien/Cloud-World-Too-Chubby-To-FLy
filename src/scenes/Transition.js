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

        this.transitionTimerConfig = {
            args: null,
            callback: () => {
                this.scene.pause();
                this.transitionOut();
            },
            callbackScope: this,
            delay: 3000,
            loop: false,
        };

        this.transitionTimer = this.time.addEvent(this.transitionTimerConfig);


        for (let i = 1; i <= this.LIVES; i++) {
            let life_icon = new LifeIcon(this, 60, 40 + i * (height / 7), 1.5);
        }

        
        this.transitionIn();
    }
    update() {

    }

    transitionOut() {
        let textureManager = this.textures;
        this.game.renderer.snapshot((snapshotImage) => {
            if(textureManager.exists('gamesnapshot')) {
                textureManager.remove('gamesnapshot');
            }
            textureManager.addImage('gamesnapshot', snapshotImage);
        });
        this.scene.start(this.next_game);
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