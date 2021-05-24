// Player Class prefab; might not be necessary

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        //! Translate variable to main.js as var(s), like what Leland did with player_exhausted 
        this.famePoint = 0;
        this.hunger = 0; // character dies after their hunger reaches 100 for 7 days 
        this.thrist = 0; // character dies after their thrist reaches 100 for 3 days 
        // Unavailiable for sprint 2
        // this.kcal_intake = 2500;
        // this.kcal_usage = 2500;
        // this.target_percentage = this.kcal_intake * 100 / this.kcal_usage;

        // Digestion Variables
        // Unavailiable for sprint 2

        // volumes below are in percentage
        // this.stomach_volume = 0;
        // this.intestine_volume = 0;
        // this.colon_volume = 0;
        this.bladder_volume = 0;


        // Level UP milestones:  [lvl0, lvl1, lvl2, ...]
        health_lvl = 0;
        this.health_milestone = [100, 120, 140, 160, 180, 200];
        this.restoredhealth = 0;
        this.max_health = this.health_milestone[health_lvl];
        player_hp = this.max_health;

        stamina_lvl = 0;
        this.stamina_milestone = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
        this.max_stamina = this.stamina_milestone[stamina_lvl];
        this.stamina = this.max_stamina;
        this.restoredstamina = 0;
        this.walkspeed = 3 + stamina_lvl; // pixels per frame, will be faster for higher lvl
        this.runspeed = this.walkspeed * 2;
        this.init_exhausted_countdown = 600; // 6 seconds cd for exhausted status penalty 
        
        exhausted_countdown = this.init_exhausted_countdown;

    }


    update() {
        // upload player stat to global variable
        if(player_hp <= 0){
            player_hp = 0;
            player_dead = true;
            gameOver = true;
        }

        player_stamina = this.stamina;
        this.max_stamina = this.stamina_milestone[stamina_lvl];

        // Interact button
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            //!implement interaction
            this.isFiring = true;
        }

        if (this.stamina <= 0 && !player_exhausted) {
            this.stamina = 0; // avoid negative stamina# to be bug-free
            console.log("player exhausted");
            player_hp -= 50; //! change to -10 hp penalty for being exhausted
            player_exhausted = true;
        }

        if (player_exhausted) {
            if (exhausted_countdown > 0) {
                exhausted_countdown -= 1;
                player_exhausted = true;
            } else {
                exhausted_countdown = this.init_exhausted_countdown;
                player_exhausted = false;
            }

        } else {
            // not exhausted 
            //***  player movement control:W S A D
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
        if (this.stamina < this.stamina / 5) {
            //!fixme add sound/text warning @ 1/5 lvl before exhuased; example: send boolean to UI
            //console.log("stamina: " + this.stamina);
        }
        //*** stamina level mechanism
        if (this.stamina < this.max_stamina && !player_exhausted) {
            this.stamina += 1;
            this.restoredstamina += 1;
            if (stamina_lvl < this.stamina_milestone.length - 1 && this.restoredstamina / 2 >= this.stamina_milestone[stamina_lvl]) {
                stamina_lvl += 1;
                console.log("stamina_lvl up to " + stamina_lvl);
                this.restoredstamina = 0;
            }
        }

        //*** health level mechanism
        if (player_hp < this.max_health) {
            // if restored health:
            // this.restoredhealth += 1;
            if (health_lvl < this.health_milestone.length - 1 && this.restoredhealth / 2 >= this.health_milestone[health_lvl]) {
                health_lvl += 1;
                console.log("health_lvl up to " + health_lvl);
                this.restoredhealth = 0;
            }
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

