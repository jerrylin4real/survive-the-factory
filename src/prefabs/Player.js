// Player Class prefab; might not be necessary

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        //! Translate variable to main.js as var(s), like what Leland did with player_exhausted 
        this.health = 100;
        this.famePoint = 0;
        this.stamina = 1000;
        this.max_stamina = 1000;

        // Unavailiable for sprint 2
        // this.kcal_intake = 2500;
        // this.kcal_usage = 2500;
        // this.target_percentage = this.kcal_intake * 100 / this.kcal_usage;

        this.hunger = 0; // character dies after their hunger reaches 100 for 7 days 
        this.thrist = 0; // character dies after their thrist reaches 100 for 3 days 

        // Digestion Variables
        // volumes below are in percentage
        this.stomach_volume = 0;
        this.intestine_volume = 0;
        this.colon_volume = 0;
        this.bladder_volume = 0;

        this.walkspeed = 3; // pixels per frame
        this.runspeed = 6;

        this.init_countdown = 600; // 6 seconds
        this.countdown = this.init_countdown;

    }


    update() {
        // left/right movement

        // Interact button
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            //!implement interaction
            this.isFiring = true;
        }

        if (this.stamina <= 0) {
            player_exausted = true;
        }
        if (player_exausted) {

            if (this.countdown > 0) {
                this.countdown -= 1;
                player_exausted = true;
            } else {
                this.countdown = this.init_countdown;
                player_exausted = false;
            }

        } else {
            // not exausted 
            //***  player control:W S A D
            // is Down = keep pressed down
            if (keyA.isDown && this.x >= borderLimitDown) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.x -= this.runspeed;
                    // running loses more stamina
                    this.stamina -= 2;
                } else {
                    this.x -= this.walkspeed;
                    this.stamina -= 1;
                }

            } else if (keyD.isDown && this.x <= game.config.width * 10) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.x += this.runspeed;
                    // running loses more stamina
                    this.stamina -= 2;
                } else {
                    this.x += this.walkspeed;
                    this.stamina -= 1;
                }
            }
            if (keyW.isDown && this.y >= borderLimitUp - borderUISize) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.y -= this.runspeed;
                    // running loses more stamina
                    this.stamina -= 2;
                } else {
                    this.y -= this.walkspeed;
                    this.stamina -= 1;
                }
            } else if (keyS.isDown && this.y <= game.config.height * 10 - borderLimitDown) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.y += this.runspeed;
                    // running loses more stamina
                    this.stamina -= 2;
                } else {
                    this.y += this.walkspeed;
                    this.stamina -= 1;
                }
            }
            //state machines
            // metabolism 

        }
        if (this.stamina < 500) {
            console.log("stamina: " + this.stamina);
        }
        // restore stamina 
        if (this.stamina < this.max_stamina) {
            this.stamina += 1;
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

