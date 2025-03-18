class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.spritesheet("character", "./assets/spritesheets/player.png",{
            frameWidth: 480,
            frameHeight: 480,
        });
        this.load.spritesheet("bone", "./assets/spritesheets/bone.png",{
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet("receiver", "./assets/spritesheets/receiver.png",{
            frameWidth: 480,
            frameHeight: 480,
        });
        this.load.spritesheet("thrower", "./assets/spritesheets/thrower.png",{
            frameWidth: 480,
            frameHeight: 480,
        });
        this.load.spritesheet("chomp", "./assets/spritesheets/chomp.png",{
            frameWidth: 720,
            frameHeight: 720,
        });
        this.load.image("arrow", "./assets/arrow.png");
        this.load.font("puppycat", "./assets/puppycat.ttf");
        this.load.image("title", "./assets/Cloudworld Title.png");
        this.load.image("titleBackground", "./assets/Title Background.png");
        this.load.image("fallin", "./assets/Fallin'.png");
        this.load.image("leftTitleCloud", "./assets/leftTitleCloud.png");
        this.load.image("rightTitleCloud", "./assets/rightTitleCloud.png");
        this.load.image("centerTitleCloud", "./assets/centerTitleCloud.png");
        this.load.image("startButton", "./assets/StartButton.png");
        this.load.image("shake", "./assets/Shake!.png");
        this.load.image("toss", "./assets/Toss!.png");
        this.load.image("reach", "./assets/Reach!.png");
        this.load.image("clean", "./assets/Clean!.png");
        this.load.image("shovel", "./assets/shovel.png");
        this.load.image("tail", "./assets/tail.png");
        this.load.image("hand", "./assets/hand.png");
        this.load.image("crumbBackground1", "./assets/crumbBackground1.png");
        this.load.image("crumbBackground2", "./assets/crumbBackground2.png");
        this.load.image("crumb", "./assets/crumb.png");
        this.load.image("complete", "./assets/complete.png");
        this.load.image("fart", "./assets/fart.png");
        this.load.image("fartBackground", "./assets/fartBackground.png");
        this.load.image("chompBackground", "./assets/chompBackground.png");
        this.load.image("life", "./assets/life.png");
        this.load.image("gameOver", "./assets/gameOver.png");
        this.load.image("creditInstruct", "./assets/creditInstruct.png");
        this.load.image("credits", "./assets/credits.png");


        this.load.audio("world", "./assets/audio/Cloud World.mp3");
        this.load.audio("dog", "./assets/audio/A Dog Is Choking On Your Hair.mp3");
        this.load.audio("transition", "./assets/audio/transition.mp3");
        this.load.audio("shovelOut", "./assets/audio/shovelOut.mp3");
        this.load.audio("throw", "./assets/audio/throw.mp3");
        this.load.audio("catch", "./assets/audio/catch.mp3");
        this.load.audio("kick", "./assets/audio/kick.mp3");
        this.load.audio("window", "./assets/audio/Stuck in the Window.mp3");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xBEEEED);

        if (!this.game.sound.get("world")) {
            this.music = this.game.sound.add('world', {
            loop: true,
            volume: 0.5,
            });
            this.music.play();
        }

        this.registry.set("GAMES", [
            ["crumbScene", 0],
            ["shovelScene", 0],
            ["boneScene", 0],
        ]);

        this.registry.set("TRANSITIONS", [
            ["chomp", 0],
        ])

        this.registry.set("TRANSITIONS_PLAYED", 0);
        
        this.registry.set("DIFFICULTY", 1);
        this.registry.set("LIVES", 3);
        this.registry.set("NUM_PLAYED", 0);
        this.registry.set("GAME_SCORE", 0);
        this.registry.set("RUNNING_SCORE", 0);

        this.background = this.add.image(width / 2, height / 2, "titleBackground").setScale(2);

        this.title = this.add.image(width / 2, -this.textures.get("title").getSourceImage().height - 400, "title").setOrigin(0.5, 0.5).setScale(2.6);

        this.fallin = this.add.image(2 * (width / 3), -this.textures.get("fallin").getSourceImage().height, "fallin").setOrigin(0.5, 0.5).setScale(0.6).setAngle(-40);

        this.leftCloud = this.add.image(-1000, height + 1300, "leftTitleCloud").setOrigin(0, 1).setScale(1.4);
        this.rightCloud = this.add.image(width + 1000, height + 600, "rightTitleCloud").setOrigin(1, 1).setScale(1.4);
        this.centerTitleCloud = this.add.image(width / 2, height + 1600, "centerTitleCloud").setOrigin(0.5, 1).setScale(1.2);

        this.start = this.add.image(width / 2, 3 * height / 7, "startButton").setOrigin(0.5, 0.5).setScale(0.4).setInteractive({useHandCusor: true, pixelPerfect: true}).setAlpha(0);

        this.leftCloudDirection = 1;
        this.rightCloudDirection = -1;
        this.centerCloudDirection = 1;

        this.fallinDown = this.add.tween({
            targets: this.fallin,
            paused: true,
            y: height + this.textures.get("fallin").getSourceImage().height,
            x: width / 2,
            duration: 400,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
        });

        this.time.delayedCall(300, () => {this.fallinDown.play()});
        this.time.delayedCall(200, () => {this.backgroundOut.play()});
        this.time.delayedCall(1000, () => {this.leftCloudIn.play()});
        this.time.delayedCall(1100, () => {this.rightCloudIn.play()});
        this.time.delayedCall(1300, () => {this.centerCloudIn.play()});
        this.time.delayedCall(1100, () => {this.titleDown.play()});
        
        this.leftCloudIn = this.add.tween({
            paused: true,
            targets: this.leftCloud,
            x: 0,
            y: height,
            scale: 0.3,
            ease: "Quint.easeOut",
            duration: 1900,
        })

        this.rightCloudIn = this.add.tween({
            paused: true,
            targets: this.rightCloud,
            x: width,
            y: height,
            scale: 0.3,
            ease: "Quint.easeOut",
            duration: 1600,
        })

        this.backgroundOut = this.add.tween({
            paused: true,
            targets: this.background,
            scale: 0.6,
            ease: "Quint.easeInOut",
            duration: 2500,
        })

        this.titleDown = this.add.tween({
            paused: true,
            targets: this.title,
            y: height / 5,
            scale: 0.36,
            duration: 1600,
            ease:"Quint.easeOut",
            repeat: 0,
            yoyo: false,
        });

        this.centerCloudIn = this.add.tween({
            paused: true,
            targets: this.centerTitleCloud,
            y: height + 100,
            scale: 0.36,
            duration: 1400,
            ease:"Quint.easeOut",
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                this.tweens.add({
                    targets: this.rightCloud,
                    y: this.rightCloud.y + 15,
                    duration: 1800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                this.tweens.add({
                    targets: this.centerTitleCloud,
                    y: this.centerTitleCloud.y + 10,
                    duration: 1400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                

                this.tweens.add({
                    targets: this.leftCloud,
                    y: this.leftCloud.y + 25,
                    duration: 2200,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                this.startIn.play();
                
            },
        });

        this.creditInstruct = this.add.image(width / 2, 20 + height / 2, "creditInstruct").setAlpha(0);

        this.startIn = this.add.tween({
            paused: true,
            targets: [this.start, this.creditInstruct],
            alpha: 1,  
            duration: 1000,
            ease: "Quint.easeOut",
        });

        this.start.on("pointerdown", () => {
            this.music.stop();
            this.scene.start("transitionScene");
        });

        this.start.on("pointerover", () => {
            this.start.setScale(0.45);
        });

        this.start.on("pointerout", () => {
            this.start.setScale(0.4);
        });


        cursors = this.input.keyboard.createCursorKeys();
        
    }

    update() {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown){
            this.scene.start("creditsScene");
        }
    }

    moveRightCloud() {
        this.rightCloud.y += this.rightCloudDirection * 10;
        if (this.rightCloud.y > height + 15 || this.rightCloud.y < height - 15) {
            this.rightCloudDirection *= -1;
        }
    }

    moveCenterCloud() {
        this.centerTitleCloud.y += this.centerCloudDirection * 7;
        if (this.centerTitleCloud.y > height + 100 + 10 || this.centerTitleCloud.y < height + 100) {
            this.centerCloudDirection *= -1;
        }
    }

    moveLeftCloud() {
        this.leftCloud.y += this.leftCloudDirection * 10;
        if (this.leftCloud.y > height + 10 || this.leftCloud.y < height - 25) {
            this.leftCloudDirection *= -1;
        }
    }

}