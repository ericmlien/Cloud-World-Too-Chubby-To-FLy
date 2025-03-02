class BoneGame extends Phaser.Scene {
    constructor() {
        super('boneScene');
    }
    init (){
        this.DIFFICULTY = 1;
        this.GRAVITY = 400;
        this.BONE_SPEED =  400;
        this.ARROW_SPEED = 0.6;
        this.ARROW_DIRECTION = 1;
        this.TURN_DELAY = 600 / this.ARROW_SPEED;
    }
    create() {
        this.cameras.main.setBackgroundColor(0xDDDDDD);
        this.ground = this.add.rectangle(width / 2, height - 120, width, 240, "0xFF00FF", 1);
        this.ground_body = this.physics.add.existing(this.ground);
        this.ground_body.body.setAllowGravity(false).setImmovable(true);
        this.arrow = this.add.sprite(width, height - this.ground.height - 50, "arrow").setScale(1).setOrigin(0.5, 2);
        this.arrow.angle = -90;
        this.bone = this.physics.add.sprite(width + this.textures.get("rock").getSourceImage().width, height + 200, "rock").setBounce(1).setScale(1);
        this.bone.body.setAllowGravity(false);

        // this.aim_line = this.add.line(0, 0, this.arrow.getBottomCenter().x, this.arrow.getBottomCenter().y, this.arrow.getTopCenter().x, this.arrow.getTopCenter().y, "OxFF0000", 1);

        this.physics.world.gravity.y = this.GRAVITY;

        // this.aim_radius = (this.BONE_SPEED ** 2) / (this.gravity * Math.cos(Phaser.Geom.Line.Angle(this.aim_line)));

        this.throwing = false;     

        this.turnTimerConfig = {
            args: null,
            callback: () => {
                this.ARROW_DIRECTION *= -1;
            },
            startAt: 0,
            callbackScope: this,
            delay: this.TURN_DELAY,
            loop: true,
        };

        this.turnTimer = this.time.addEvent(this.turnTimerConfig);

        

        this.input.on("pointerdown", (pointer) => {
            if (!this.throwing) {
                this.throwing = true;
                this.bone.setPosition(this.arrow.getTopCenter().x, this.arrow.getTopCenter().y);
                console.log("Angle: " + this.arrow.angle);
                console.log(" COS: " + Math.cos(Phaser.Math.DegToRad(this.arrow.angle)));
                console.log(" sin: " + Math.sin(Phaser.Math.DegToRad(this.arrow.angle)));
                this.bone.body.setAllowGravity(true);
                let boneVector = new Phaser.Math.Vector2(this.BONE_SPEED * Math.sin(Phaser.Math.DegToRad(this.arrow.angle)), this.BONE_SPEED * -Math.cos(Phaser.Math.DegToRad(this.arrow.angle)));

                this.bone.body.setVelocity(boneVector.x, boneVector.y);
                console.log("HI!!!");
            }
        });
        
        this.physics.add.collider(this.ground_body, this.bone, () => {
            this.throwing = false;
            this.bone.setPosition(width + this.textures.get("rock").getSourceImage().width, height + 200);
        });


        
        // this.aim_arc = this.add.arc(this.arrow.getTopCenter().x + (this.aim_radius * Math.cos(Phaser.Geom.Line.Angle(this.aim_line))), this.arrow.getTopCenter().y + (this.aim_radius * Math.sin(Phaser.Geom.Line.Angle(this.aim_line))), Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.aim_line)), 90, true);
        // console.log(" HII! X : " + this.aim_arc.x);
        // console.log(" HII!! Y: " + this.aim_arc.y);
        // this.aim_arc.setStrokeStyle(100, "FACADE", 1);
        //this.arrow.x + (this.arrow.width / 2), this.arrow.y + (this.arrow.height * this.arrow.originY)
        
    }

    

    update() {
        this.arrow.angle += (this.ARROW_SPEED * this.ARROW_DIRECTION);
        if (this.bone.x < 0) {
            this.throwing = false;
            this.bone.setPosition(width + this.textures.get("rock").getSourceImage().width, height + 200);
        }
            // this.update_line();


    }

    flip() {
        
    }

    // update_line() {
    //     this.aim_line.setTo(this.arrow.getBottomCenter().x, this.arrow.getBottomCenter().y, this.arrow.getTopCenter().x, this.arrow.getTopCenter().y);
    // }

}