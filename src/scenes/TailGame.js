class TailGame extends Phaser.Scene {
    constructor() {
        super('tailScene');
    }
    init() {
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED") + 1;
        this.HAND_SPEED = (20 + this.DIFFICULTY) * (20 + this.DIFFICULTY);
        this.TAIL_SPEED = (20 + this.DIFFICULTY + 1) * (20 + this.DIFFICULTY + 1);
        this.GAMES = this.registry.get("GAMES");
    }
    
    create () {
        this.cameras.main.setBackgroundColor(0xDDDDDD);

        this.physics.world.setBounds(0, 0, width, height);

        this.GAMES[1][1] += 1;
        this.registry.set("GAMES", this.GAMES);

        this.gameOver = false;
        this.timeUp = false;

        this.hand = this.physics.add.sprite(width - this.textures.get("rock").getSourceImage().width, height / 2, "rock").setCollideWorldBounds(true).setScale(1.5);
        this.tail = this.physics.add.sprite(this.textures.get("rock").getSourceImage().width, height / 2, "rock").setImmovable(true).setCollideWorldBounds(true).setBounce(1).setScale(1.5);
        this.tail.body.onWorldBounds = true;


        this.stopInteraction = false;
        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.hand, this.tail, () => {
            console.log("GRABBED!!!");
            if (!this.stopInteraction) {
                this.gameOver = true;
            }
        });

        this.grabbing = false;
    

        this.input.keyboard.on("keydown-LEFT", () => {
            if (!this.grabbing){
                this.grabbing = true;
                this.hand.setVelocityY(0);
                this.grabTimer = this.time.delayedCall(80000 / (this.HAND_SPEED / 2), () => {this.grabbing = false});
                this.grabTween = this.tweens.add({
                    targets: this.hand,
                    x: {
                        from: width,
                        to: this.hand.width + this.tail.width,
                    },
                    duration: 80000 / (this.HAND_SPEED / 2),
                    repeat: 0,
                    yoyo: true,
                });
            }
        });
        
        this.tailDirection = -1;
        function moveTail() {
            this.tailMoveTo = this.tailDirection < 0 ? Phaser.Math.Between(this.tail.height, this.tail.body.y) : Phaser.Math.Between(this.tail.body.y, game.config.height - this.tail.height);
            this.tweens.add({
                targets: this.tail,
                y: this.tailMoveTo,
                ease: "Back.easeOut",
                duration: 800000 / this.TAIL_SPEED,
                onComplete: () => {
                    this.tailDirection *= -1;
                    this.time.delayedCall(4000 / (this.HAND_SPEED / 2), moveTail, [], this);
                },
            });
        }
        
        moveTail.call(this);

        this.progressBar = this.add.rectangle(0, height - 30, width, 60, 0xFFF000, 1).setOrigin(0, 0.5);
        this.progess = this.add.tween({
            targets: this.progressBar,
            width: 0,
            duration: 7000 - ((this.DIFFICULTY / 2) * 1000),
            onComplete: () => {
                this.scene.pause();
                this.timeUp = true;
                this.LIVES -= 1;
                console.log("Lives: " + this.LIVES);
                this.registry.set("LIVES", this.LIVES);
                this.transitionOut();
            },
            onCompleteScope: this,
        });

        this.transitionIn();

        // this.tailTween = this.tweens.add({
        //     targets: this.tail,
        //     y: {
        //         from: this.tail.body.y,
        //         to: this.TAIL_DIRECTION == "up" ? Phaser.Math.Between(this.tail.body.y, height - this.tail.height) : Phaser.Math.Between(this.tail.height, this.tail.body.y),
        //     },
        //     ease: "Cubic",
        //     duration: 80000 / (this.TAIL_SPEED / 2),
        //     repeat: -1,
        //     yoyo: false,
        // })

        // this.tail.setVelocityY(Phaser.Math.Between(1, 2) < 2 ? -this.TAIL_SPEED : this.TAIL_SPEED);

    }

    update() {
        if (!this.timeUp && !this.gameOver) {
            if (!this.grabbing) {
            let handVector = new Phaser.Math.Vector2(0, 0);
            if (cursors.up.isDown){
                handVector.y = -1;
            } else if (cursors.down.isDown){
                handVector.y = 1;
            }
            handVector.normalize();
            this.hand.setVelocity(0, this.HAND_SPEED * handVector.y);
            }
        } else if (this.gameOver){
            this.gameOver = false;
            this.stopInteraction = true;
            this.scene.pause();
            this.transitionOut();
        }
    }

    transitionOut() {
        this.registry.set("NUM_PLAYED", this.NUM_PLAYED);
        let textureManager = this.textures;
        this.game.renderer.snapshot((snapshotImage) => {
            if(textureManager.exists('gamesnapshot')) {
                textureManager.remove('gamesnapshot');
            }
            textureManager.addImage('gamesnapshot', snapshotImage);
        });
        if (this.LIVES > 0) {
            console.log("going to transition to the transition scene!");
;
            this.scene.start("transitionScene");
        } else {
            this.scene.stop();
            this.scene.start("menuScene");
        }   
    }

    transitionIn() {
        if (this.textures.exists("gamesnapshot")) {
            let screenshot = this.add.image(width / 2, height / 2, "gamesnapshot");
            let iris = this.add.graphics()
            iris.fillRect(0, 0, width, height).fillStyle(0x000000).lineStyle(4, 0xfacade);

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