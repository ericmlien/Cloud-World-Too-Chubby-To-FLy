class BoneGame extends Phaser.Scene {
    constructor() {
        super('boneScene');
    }
    init (){
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED") + 1;
        this.GAMES = this.registry.get("GAMES");
        this.LOWEST = Math.floor(this.NUM_PLAYED / this.GAMES.length);
        this.GRAVITY = 700 * (this.DIFFICULTY / 2);
        this.BONE_SPEED =  2400 * (this.DIFFICULTY / 2);
        this.ARROW_SPEED = 1.4 * (this.DIFFICULTY / 2);
        this.ARROW_DIRECTION = 1;
        this.TURN_DELAY = 1200 / this.ARROW_SPEED;
    }
    create() {

        this.GAMES[2][1] += 1;
        this.registry.set("GAMES", this.GAMES);

        this.cameras.main.setBackgroundColor(0xDDDDDD);
        this.arrow = this.add.sprite(Phaser.Math.Between(width - (width / 4), width), Phaser.Math.Between(height - (height / 4), height), "arrow").setScale(1).setOrigin(0.5, 2);
        this.player = this.add.sprite(this.arrow.x - (this.arrow.width / 4), this.arrow.y - (this.arrow.height / 8), "rock");
        this.arrow.angle = -90;
        this.bone = this.physics.add.sprite(width + this.textures.get("rock").getSourceImage().width, height + 200, "rock").setBounce(1).setScale(1).setDrag(0.5).setDamping(true);
        this.bone.body.setAllowGravity(false);
        this.receiverOffsetX = Phaser.Math.Between(200, this.arrow.x - width / 2);
        this.receiver = this.physics.add.sprite(this.receiverOffsetX, height - (height - this.receiverOffsetX), "rock").setImmovable(true).setScale(1);
        this.receiver.body.setAllowGravity(false)
        // this.aim_line = this.add.line(0, 0, this.arrow.getBottomCenter().x, this.arrow.getBottomCenter().y, this.arrow.getTopCenter().x, this.arrow.getTopCenter().y, "OxFF0000", 1);

        this.physics.world.gravity.y = this.GRAVITY;

        this.transition = this.sound.add("transition");

        // this.aim_radius = (this.BONE_SPEED ** 2) / (this.gravity * Math.cos(Phaser.Geom.Line.Angle(this.aim_line)));

        this.throwing = false;     

        this.turnTimerConfig = {
            args: null,
            callback: () => {
                this.ARROW_DIRECTION *= -1;
            },
            startAt: 0,
            callbackScope: this,
            delay: this.TURN_DELAY,
            loop: true,
        };

        this.turnTimer = this.time.addEvent(this.turnTimerConfig);

        this.progressBar = this.add.rectangle(0, height - 30, width, 60, 0xFFF000, 1).setOrigin(0, 0.5);
        this.progess = this.add.tween({
            targets: this.progressBar,
            width: 0,
            duration: 6000 - Math.pow(this.LOWEST, 1.3) > 2000 ? 6000 - Math.pow(this.LOWEST, 1.3) : 2000,
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

        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on("keydown-UP", () => {
            if (!this.throwing) {
                this.throwing = true;
                this.bone.setPosition(this.arrow.x - 40, this.arrow.y - 40);
                console.log("Angle: " + this.arrow.angle);
                console.log(" COS: " + Math.cos(Phaser.Math.DegToRad(this.arrow.angle)));
                console.log(" sin: " + Math.sin(Phaser.Math.DegToRad(this.arrow.angle)));
                this.bone.body.setAllowGravity(true);
                let boneVector = new Phaser.Math.Vector2(this.BONE_SPEED * Math.sin(Phaser.Math.DegToRad(this.arrow.angle)), this.BONE_SPEED * -Math.cos(Phaser.Math.DegToRad(this.arrow.angle)));

                this.bone.body.setVelocity(boneVector.x, boneVector.y);
                console.log("HI!!!");
            }
        });

        this.hit = false;
        this.win = false;
        
        this.physics.add.overlap(this.receiver, this.bone, () => {
            this.hit = true;
        });

        this.transitioning = false;
        this.transitionIn();


        
        // this.aim_arc = this.add.arc(this.arrow.getTopCenter().x + (this.aim_radius * Math.cos(Phaser.Geom.Line.Angle(this.aim_line))), this.arrow.getTopCenter().y + (this.aim_radius * Math.sin(Phaser.Geom.Line.Angle(this.aim_line))), Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.aim_line)), 90, true);
        // console.log(" HII! X : " + this.aim_arc.x);
        // console.log(" HII!! Y: " + this.aim_arc.y);
        // this.aim_arc.setStrokeStyle(100, "FACADE", 1);
        //this.arrow.x + (this.arrow.width / 2), this.arrow.y + (this.arrow.height * this.arrow.originY)
        
    }

    

    update() {
        if (!this.hit) {
            this.arrow.angle += (this.ARROW_SPEED * this.ARROW_DIRECTION);
            if (this.bone.x < 0) {
                this.throwing = false;
                this.bone.setPosition(width + this.textures.get("rock").getSourceImage().width, height + 200);
            }
        } else {
            this.hit = false;
            this.win = true;
            this.scene.pause();
            this.transitionOut();
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

    // update_line() {
    //     this.aim_line.setTo(this.arrow.getBottomCenter().x, this.arrow.getBottomCenter().y, this.arrow.getTopCenter().x, this.arrow.getTopCenter().y);
    // }

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

            this.popup = this.add.image(width / 2, height / 2, "toss").setOrigin(0.5, 0.5).setScale(0);
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