class CrumbGame extends Phaser.Scene {
    constructor() {
        super('crumbScene');
    }

    init() {
        this.DIFFICULTY = this.registry.get("DIFFICULTY");
        this.LIVES = this.registry.get("LIVES");
        this.NUM_PLAYED = this.registry.get("NUM_PLAYED") + 1;
        this.PLAYER_VELOCITY = (20 + this.DIFFICULTY) * (20 + this.DIFFICULTY);
        this.CRUMB_SIZE = this.textures.get("rock").getSourceImage().width;
        this.GAMES = this.registry.get("GAMES");
        this.LOWEST = Math.floor(this.NUM_PLAYED / this.GAMES.length);

    }


    create() {
        console.log("" + this.DIFFICULTY);
        this.cameras.main.postFX.addPixelate(0.4);
        this.cameras.main.setBackgroundColor(0xFACADE);
        this.GAMES[0][1] += 1;
        this.registry.set("GAMES", this.GAMES);

        this.transition = this.sound.add("transition");

        this.player = this.physics.add.sprite(width / 2, height / 2, "character", 1).setScale(2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setCircle(this.player.body.width / 3, this.player.body.width / 2 - this.player.body.width / 3, this.player.body.height / 4);
        
        this.crumbGroup = this.add.group({
            runChildUpdate: true,
        });
        for (let i = 0; i < 3 + Math.floor(this.NUM_PLAYED * 0.2); i++) {
            this.spawnCrumb();
        }

        cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.crumbGroup, () => {
            console.log(" HII !!!");
        });
        
        this.gameOver = false;
        this.timeUp = false;
        this.win = false;

        this.progressBar = this.add.rectangle(0, height - 30, width, 60, 0xFFF000, 1).setOrigin(0, 0.5);
        this.progess = this.add.tween({
            targets: this.progressBar,
            width: 0,
            duration: 7000 - Math.pow(this.LOWEST, 1.3) > 3000 ? 7000 - Math.pow(this.LOWEST, 1.3) : 3000,
            onComplete: () => {
                this.gameOver = true;
                this.timeUp = true;
                this.LIVES -= 1;
                console.log("Lives: " + this.LIVES);
                this.registry.set("LIVES", this.LIVES);
                this.transitionOut();
            },
            onCompleteScope: this,
        });

        this.transitioning = false;
        this.transitionIn();
        
    }

    update() {
        if (!this.timeUp && this.checkCrumbs()){
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
        } else if (!this.gameOver) {
            // Change the background to show the fat bird smiling instead!
            // Maybe spawn some rotating sparkles or smth when you complete the sidequest
            this.timeUp = true;
            this.gameOver = true;
            console.log("The gameover in update is running!");
            this.win = true;
            this.transitionOut();
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

    transitionOut() {
        if (this.transitioning) return;
        this.scene.pause();
        this.transitioning = true;
        this.registry.set("NUM_PLAYED", this.NUM_PLAYED);
        let textureManager = this.textures;
        this.game.renderer.snapshot((snapshotImage) => {
            if (textureManager.exists('gamesnapshot')) {
                textureManager.remove('gamesnapshot');
            }
            textureManager.addImage('gamesnapshot', snapshotImage);
            
            requestAnimationFrame(() => {
                if (this.win) {
                    this.registry.set("GAME_SCORE", 100 * (1 + 0.5 * (Math.pow(this.LOWEST, 1.4))));
                } else {
                    this.registry.set("GAME_SCORE", 0);
                }
                if (this.LIVES == 0) {
                    this.scene.start("gameoverScene");
                } else {
                    this.scene.start("transitionScene");
                }
            });
        });
    }

    transitionIn() {
        if (this.textures.exists("gamesnapshot")) {
            let screenshot = this.add.image(width / 2, height / 2, "gamesnapshot");
            let iris = this.add.graphics()
            iris.fillRect(0, 0, width, height).fillStyle(0x000000).lineStyle(4, 0xfacade);
            this.transition.play();
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

            this.popup = this.add.image(width / 2, height / 2, "clean").setOrigin(0.5, 0.5).setScale(0);
            this.popupout = this.tweens.chain({
                targets: this.popup,
                loop: 0,
                tweens: [
                    {
                        scale: 0.27,
                        ease: "Expo.easeOut",
                        duration: 600,
                        repeat: 0,
                    },
                    {
                        y: -this.popup.height,
                        ease: "Expo.easeIn",
                        duration: 400,
                        repeat:0,
                    }
                ],
            });

        } else {
            console.log('texture error');
        }
    }

}