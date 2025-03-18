class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    create () {
        this.background = this.add.image(width / 2, height / 2, "titleBackground").setScale(0.6);
        this.credits = this.add.image(width / 2, height / 2, "credits").setScale(1.11);
        cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown){
            this.scene.start("titleScene");
        }
    }
}