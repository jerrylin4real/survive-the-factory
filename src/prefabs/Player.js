// Player Class prefab; might not be necessary
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.health = 100;
        this.hunger = 0;
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
