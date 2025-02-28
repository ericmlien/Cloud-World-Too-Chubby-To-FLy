class TailGame extends Phaser.Scene {
    constructor() {
        super('tailScene');
    }
    init() {
        this.DIFFICULTY = 1;
        this.HAND_SPEED = (20 + this.DIFFICULTY) * (20 + this.DIFFICULTY);
        this.TAIL_SPEED = (20 + this.DIFFICULTY + 1) * (20 + this.DIFFICULTY + 1);
    }
    
    create () {
        this.cameras.main.setBackgroundColor(0xDDDDDD);

        this.physics.world.setBounds(0, 0, width, height);

        this.hand = this.physics.add.sprite(width - this.textures.get("rock").getSourceImage().width, height / 2, "rock").setCollideWorldBounds(true).setScale(1.5);
        this.tail = this.physics.add.sprite(this.textures.get("rock").getSourceImage().width, height / 2, "rock").setImmovable(true).setCollideWorldBounds(true).setBounce(1).setScale(1.5);
        this.tail.body.onWorldBounds = true;

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.hand, this.tail, () => {
            console.log(" HII !!!");
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

        this.tail.setVelocityY(Phaser.Math.Between(1, 2) < 2 ? -this.TAIL_SPEED : this.TAIL_SPEED);

        this.turnTimerConfig = {
            args: null,
            callback: () => {
                this.tail.body.velocity.y *= -1;
            },
            callbackScope: this,
            delay: Phaser.Math.Between(700, 1400),
            loop: true,
        };

        this.turnTimer = this.time.addEvent(this.turnTimerConfig);

        this.physics.world.on('worldbounds', () => {
            console.log("HIIIIII!!!!!!");
            this.turnTimerConfig.delay = Phaser.Math.Between(700, 1400);
            this.turnTimer.reset(this.turnTimerConfig);
        });

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
        if (!this.grabbing){
            let handVector = new Phaser.Math.Vector2(0, 0);
            if (cursors.up.isDown){
                handVector.y = -1;
            } else if (cursors.down.isDown){
                handVector.y = 1;
            }
            handVector.normalize();
            this.hand.setVelocity(0, this.HAND_SPEED * handVector.y);
        }
    }

}