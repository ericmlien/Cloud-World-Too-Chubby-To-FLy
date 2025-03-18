class Transition extends Phaser.Scene {
    constructor() {
        super("transitionScene");
    }
    init() {
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED");
        this.GAMES = this.registry.get("GAMES");
        this.TRANSITIONS = this.registry.get("TRANSITIONS");
        this.TRANSITIONS_PLAYED = this.registry.get("TRANSITIONS_PLAYED");
        this.LOWEST = Math.floor(this.NUM_PLAYED / this.GAMES.length);
        this.LOWEST_TRANSITION = Math.floor(this.TRANSITIONS_PLAYED / this.TRANSITIONS.length);
    }
    create() {
        this.cameras.main.setBackgroundColor(0xDAAAAB);  
        console.log("The number of games played is: " + this.NUM_PLAYED);
        console.log("The lowest game played is: " + this.LOWEST);

        console.log("The number of transitions played is: " + this.TRANSITIONS_PLAYED);
        console.log("The lowest transition played is: " + this.LOWEST_TRANSITION);

        this.transition = this.sound.add("transition", {volume: 0.5});

        if (!this.game.sound.get("window")) {
            this.music = this.game.sound.add('window', {
            loop: true,
            volume: 0.5,
            });
            this.music.play();
        }


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

        let next_transition_found = false;
        this.next_transition = "";

        for (let i = 0; i < this.TRANSITIONS.length; i++){
            console.log("The " + i + "th element in TRANSITIONS is: " + this.TRANSITIONS[i][0]);
            console.log("its playcount is: " + this.TRANSITIONS[i][1]);
        }
        while(!next_transition_found) {
            this.ROLL = Phaser.Math.Between(0, this.TRANSITIONS.length - 1);
            if (this.TRANSITIONS[this.ROLL][1] == this.LOWEST_TRANSITION) {
                this.TRANSITIONS[this.ROLL][1]++;
                this.registry.set("TRANSITIONS", this.TRANSITIONS);
                this.next_transition = this.TRANSITIONS[this.ROLL][0];
                this.TRANSITIONS_PLAYED++;
                this.registry.set("TRANSITIONS_PLAYED", this.TRANSITIONS_PLAYED);
                next_transition_found = true;
            }
        }
        if (this.next_transition == "chomp") {
            this.background = this.add.image(width / 2, height / 2, "chompBackground").setScale(1.11);
            this.chomper = this.add.sprite(width / 2, height / 2 + 20, "chomp", 0).setScale(1.11);
            this.anims.create({
                key: "chomp",
                frames: this.anims.generateFrameNumbers("chomp", {start: 0, end: 4}),
                frameRate: 10,
                repeat:-1,
            });
            this.chomper.play("chomp");
        }

        this.lifeGroup = this.add.group();
        this.turnRight = false;

        for (let i = 1; i <= this.LIVES; i++) {
            let outline = new LifeIcon(this, 60, i * (height / 7), 0.22).setTint(0xc0fbf2);
            let life_icon = new LifeIcon(this, 60, i * (height / 7), 0.2);
            life_icon.setAngle(-10);
            outline.setAngle(-10);
            this.lifeGroup.add(life_icon);
            this.lifeGroup.add(outline);
        }

        this.time.addEvent({
            delay: 600,
            callback: () => {
                this.turnRight = !this.turnRight;
                this.lifeGroup.getChildren().forEach(life_icon => {
                    life_icon.setAngle(this.turnRight ? 10 : -10);
                });
            },
            loop: true
        });

        let scoreConfig = {
            fontFamily: "puppycat",
            fontSize:"96px",
            color: "#c0fbf2",
            align: "center",
        }

        this.runningScore = this.registry.get("RUNNING_SCORE");
        this.gameScore = this.registry.get("GAME_SCORE");

        this.scoreCounter = this.add.text(width / 2, height / 3, this.runningScore, scoreConfig).setOrigin(0.5);

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

            if (this.gameScore > 0) {
                this.popup = this.add.image(width / 2, height / 2, "complete").setOrigin(0.5, 0.5).setScale(0);
                this.popupout = this.tweens.chain({
                    targets: this.popup,
                    loop: 0,
                    tweens: [
                        {
                            scale: 1,
                            ease: "Expo.easeOut",
                            duration: 400,
                            repeat: 0,
                        },
                        {
                            y: -this.popup.height,
                            ease: "Expo.easeIn",
                            duration: 300,
                            repeat:0,
                        }
                    ],
                });
            }
        } else {
            console.log('texture error');
        }
    }
}