class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }
    init() {
        this.DIFFICULTY = 1;
    }
    
    preload() {
        this.load.spritesheet("character", "./assets/spritesheets/Character_002.png",{
            frameWidth: 48,
        });
        this.load.image("rock", "./assets/rrrock.png");
        this.load.image("arrow", "./assets/arrow.png");
    }

    create () {
        this.cameras.main.setBackgroundColor(0xBEEEED);

        let buttonConfig = {
            fontFamily: "Courier",
            fontSize: 80,
            backgroundColor: "#0398FC",
            color: "#843605",
            align: "center",
            padding: {
                top: 2,
                bottom: 2,
            },
        };

        this.crumbButton = this.add.text(width / 5, height + 100, "crumb", buttonConfig);
        this.crumbIn = this.tweens.add({
            targets: this.crumbButton,
            y: {
                from: height + 100,
                to: height - (height / 4),
            },
            ease: "Cubic",
            duration: 1000,
            repeat: 0,
            yoyo: false,
        });
        this.crumbButton.setInteractive();
        this.crumbButton.on("pointerover", () => {
            this.crumbButton.setBackgroundColor("#da5125");
            this.crumbButton.setColor("#ffff8e");
        });
        this.crumbButton.on("pointerout", () => {
            this.crumbButton.setBackgroundColor("#0398FC");
            this.crumbButton.setColor("#843605");
        });
        this.crumbButton.on("pointerdown", () => {
            this.timer = this.time.delayedCall(1000, () => {this.scene.start("crumbScene")});
        });


        this.tailButton = this.add.text(width - (width / 2) + 40, height + 100, "tail", buttonConfig);
        this.tailIn = this.tweens.add({
            targets: this.tailButton,
            y: {
                from: height + 100,
                to: height - (height / 4),
            },
            ease: "Cubic",
            duration: 1000,
            repeat: 0,
            yoyo: false,
        });
        this.tailButton.setInteractive();
        this.tailButton.on("pointerover", () => {
            this.tailButton.setBackgroundColor("#da5125");
            this.tailButton.setColor("#ffff8e");
        });
        this.tailButton.on("pointerout", () => {
            this.tailButton.setBackgroundColor("#0398FC");
            this.tailButton.setColor("#843605");
        });
        this.tailButton.on("pointerdown", () => {
            this.timer = this.time.delayedCall(1000, () => {this.scene.start("tailScene")});
        });

        this.boneButton = this.add.text(width + 100, height / 2 + 100, "bone", buttonConfig);
        this.boneIn = this.tweens.add({
            targets: this.boneButton,
            x: {
                from: this.boneButton.x,
                to: width - (width / 2) + 40,
            },
            ease: "Cubic",
            duration: 1000,
            repeat: 0,
            yoyo: false,
        });
        this.boneButton.setInteractive();
        this.boneButton.on("pointerover", () => {
            this.boneButton.setBackgroundColor("#da5125");
            this.boneButton.setColor("#ffff8e");
        });
        this.boneButton.on("pointerout", () => {
            this.boneButton.setBackgroundColor("#0398FC");
            this.boneButton.setColor("#843605");
        });
        this.boneButton.on("pointerdown", () => {
            this.timer = this.time.delayedCall(1000, () => {this.scene.start("boneScene")});
        });

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
        } else {
            console.log('texture error');
        }
    }

    update() {

    }
}