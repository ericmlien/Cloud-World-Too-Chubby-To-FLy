class LifeIcon extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, scale) {
        super (scene, x, y, "rock");
        this.setScale(scale);
        this.parentScene = scene;
        this.parentScene.add.existing(this);
    }
    
}