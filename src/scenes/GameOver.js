class GameOver extends Phaser.Scene {
    constructor() {
        super ("gameoverScene");
    }

    create() {
        this.score = 3500;
        this.count = 0;


        let scoreConfig = {
            fontFamily: "puppycat",
            fontSize:"48px",
            color: "#BEEAAD",
            align: "center",
        }
        this.scoreCounter = this.add.text(width / 2, height / 2, this.count, scoreConfig).setOrigin(0.5);

        this.scoreCountUp = this.tweens.add({
            targets: {
                value: this.count,
            },
            value: this.score,
            duration: this.score * 1.5,
            ease: "Quart.easeOut",
            repeat: false,
            onUpdate: (tween) => {
                this.scoreCounter.setText(Math.floor(tween.getValue()));
            },
        });
    }

    update() {

    }
}