class GameOver extends Phaser.Scene {
    constructor() {
        super ("gameoverScene");
    }

    create() {
        this.score = this.registry.get("RUNNING_SCORE");
        this.count = 0;

        this.background = this.add.image(width / 2, height / 2, "gameOver").setScale(1.11);


        let scoreConfig = {
            fontFamily: "puppycat",
            fontSize:"48px",
            color: "#BEEAAD",
            align: "center",
        }
        this.scoreCounter = this.add.text(width / 2, height - height / 10, this.count, scoreConfig).setOrigin(0.5);

        this.scoreCountUp = this.tweens.add({
            targets: {
                value: this.count,
            },
            value: this.score,
            duration: this.score,
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