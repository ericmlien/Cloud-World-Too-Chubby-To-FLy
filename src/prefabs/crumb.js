class Crumb extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, size, scale) {
        super (scene, Phaser.Math.Between(size, game.config.width - size), Phaser.Math.Between(size, game.config.height - size), "rock");
        this.setScale(scale);
        this.width = size;
        this.height = size;
        this.parentScene = scene;
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this).setCircle(this.width / (2 * (scale * 1.1)), 0, this.height / (scale * 10)).setBounce(2);
    }

    update() {
        if ((this.x < -this.width || this.x > game.config.width + this.width) || this.y < -this.height || this.y > game.config.height + this.height){
            console.log("DESTROYED!!!");
            this.destroy();
        }
    }
}