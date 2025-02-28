class CrumbGame extends Phaser.Scene {
    constructor() {
        super('crumbScene')
    }

    init() {
        this.DIFFICULTY = 1;
        this.PLAYER_VELOCITY = (20 + this.DIFFICULTY) * (20 + this.DIFFICULTY);
        this.CRUMB_SIZE = this.textures.get("rock").getSourceImage().width;
    }


    create() {
        this.cameras.main.postFX.addPixelate(0.4);
        this.cameras.main.setBackgroundColor(0xDDDDDD);
        this.player = this.physics.add.sprite(width / 2, height / 2, "character", 1).setScale(2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setCircle(this.player.body.width / 3, this.player.body.width / 2 - this.player.body.width / 3, this.player.body.height / 4);
        this.crumbGroup = this.add.group({
            runChildUpdate: true,
        });
        for (let i = 0; i < 3 + this.DIFFICULTY; i++) {
            this.spawnCrumb();
        }
        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.crumbGroup, () => {
            console.log(" HII !!!");
        });
    }

    update() {
        if (this.checkCrumbs()){
            let playerVector = new Phaser.Math.Vector2(0, 0);
            if (cursors.left.isDown){
                playerVector.x = -1;

            } else if (cursors.right.isDown){
                playerVector.x = 1;
            }
            if (cursors.up.isDown){
                playerVector.y = -1;
            } else if (cursors.down.isDown){
                playerVector.y = 1;
            }
            playerVector.normalize();
            this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);
        } else {
            
        }
        
    }

    spawnCrumb() {
        let crumb_scale = Phaser.Math.Between(8, 12);
        let crumb = new Crumb(this, this.CRUMB_SIZE * (crumb_scale / 10), crumb_scale / 10);
        console.log("Width: " + crumb.width);
        console.log("Height: " + crumb.height);
        this.crumbGroup.add(crumb);
    }    
    
    checkCrumbs() {
        let clear = true;
        if (this.crumbGroup.getLength() == 0){
            clear = false;
        }
        return clear;
    }
}