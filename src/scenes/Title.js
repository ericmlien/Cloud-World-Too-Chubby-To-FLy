class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.spritesheet("character", "./assets/spritesheets/Character_002.png",{
            frameWidth: 48,
        });
        this.load.image("rock", "./assets/rrrock.png");
        this.load.image("arrow", "./assets/arrow.png");
        this.load.audio("transition", "./assets/Boo-womp - Sound Effect.mp3");
        this.load.font("puppycat", "./assets/puppycat.ttf");
        this.load.image("title", "./assets/Cloudworld Title.png");
        this.load.image("titleBackground", "./assets/Title Background.png");
        this.load.image("fallin", "./assets/Fallin'.png");
        this.load.image("leftTitleCloud", "./assets/leftTitleCloud.png");
        this.load.image("rightTitleCloud", "./assets/rightTitleCloud.png");
        this.load.image("centerTitleCloud", "./assets/centerTitleCloud.png");
        this.load.image("startButton", "./assets/StartButton.png");
        this.load.image("mash", "./assets/Mash!.png");
        this.load.image("toss", "./assets/Toss!.png");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xBEEEED);
        this.registry.set("GAMES", [
            ["crumbScene", 0],
            ["tailScene", 0],
            ["boneScene", 0],
            ["shovelScene", 0],
        ]);
        
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
                this.time.addEvent({
                    delay: 1000,
                    callback: this.moveRightCloud,
                    callbackScope: this,
                    loop: true
                });
                this.time.addEvent({
                    delay: 1000,
                    callback: this.moveLeftCloud,
                    callbackScope: this,
                    loop: true
                });
                this.time.addEvent({
                    delay: 1000,
                    callback: this.moveCenterCloud,
                    callbackScope: this,
                    loop: true
                });
                this.startIn.play();
                
            },
        });

        this.startIn = this.add.tween({
            paused: true,
            targets: this.start,
            alpha: 1,  
            duration: 1000,
            ease: "Quint.easeOut",
        });

        this.start.on("pointerdown", () => {
            this.scene.start("transitionScene");
        });

        this.start.on("pointerover", () => {
            this.start.setScale(0.45);
        });

        this.start.on("pointerout", () => {
            this.start.setScale(0.4);
        });

    }

    update() {

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