// Rocket prefab
class Zombie extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.moveSpeed = 2;         // pixels per frame
        // this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx
    }

    update() {
        //! chase the player if in a certain range 
        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
