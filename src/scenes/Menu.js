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
    }

    create () {
        this.cameras.main.setBackgroundColor(0xDDDDDD);

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

        this.crumbButton = this.add.text(game.config.width / 5, game.config.height + 100, "crumb", buttonConfig);
        this.crumbIn = this.tweens.add({
            targets: this.crumbButton,
            y: {
                from: game.config.height + 100,
                to: game.config.height - (game.config.height / 4),
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


        this.tailButton = this.add.text(game.config.width - (game.config.width / 2) + 40, game.config.height + 100, "tail", buttonConfig);
        this.tailIn = this.tweens.add({
            targets: this.tailButton,
            y: {
                from: game.config.height + 100,
                to: game.config.height - (game.config.height / 4),
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
    }

    update() {

    }
}