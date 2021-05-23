// Player Class prefab; might not be necessary
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.health = 100;
        this.kcal_intake = 2500;
        this.kcal_usage = 2500;
        this.target_percentage = this.kcal_intake * 100 / this.kcal_usage;
        this.hunger = 0; // character dies after their hunger reaches 100 for 7 days 
        this.thrist = 0; // character dies after their thrist reaches 100 for 3 days 
        
        // Digestion Variables
        // volumes below are in percentage
        this.stomach_volume = 0;
        this.intestine_volume = 0;
        this.colon_volume = 0;
        this.bladder_volume = 0;
        
        this.walkspeed = 6;
        this.runspeed = 10;

        this.moveSpeed = 15;         // pixels per frame
    }

    update() {
        // left/right movement

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
        }

        //  player control:W S A D
        //  !FIXME OFFSET Correction
        // is Down = keep pressed down
        if (keyA.isDown && this.x >= borderLimitDown) {
            this.x -= this.moveSpeed;
        } else if (keyD.isDown && this.x <= game.config.width * 10) {
            this.x += this.moveSpeed;
        }
        if (keyW.isDown && this.y >= borderLimitUp - borderUISize) {
            this.y -= this.moveSpeed;
        } else if (keyS.isDown && this.y <= game.config.height * 10 - borderLimitDown) {
            this.y += this.moveSpeed;
        }
        
        //state machines

        // metabolism 
        

        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            // this.reset();
        }
    }

    // reset player to "ground"
    reset() {
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
