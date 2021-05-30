class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        //! Translate variable to main.js as var(s), like what Leland did with player_exhausted 
        this.hunger = 0; // character dies after their hunger reaches 100 for 7 days or 7 minutes
        this.thrist = 0; // character dies after their thrist reaches 100 for 3 days or 3 minutes

        // Unavailiable for sprint 2
        //this.famePoint = 0;

        // this.kcal_intake = 2500;
        // this.kcal_usage = 2500;
        // this.target_percentage = this.kcal_intake * 100 / this.kcal_usage;

        // Digestion Variables
        // Unavailiable for sprint 2

        // volumes below are in percentage
        player_stomach_volume = 0;
        player_bladder_volume = 0;

        // this.intestine_volume = 0;
        // this.colon_volume = 0;



        // Level UP milestones:  [lvl0, lvl1, lvl2, ...]
        health_lvl = 0;
        this.health_milestone = [100, 120, 140, 160, 180, 200];
        restoredhealth = 0;
        this.max_health = this.health_milestone[health_lvl];
        player_hp = this.max_health; // init hp match

        stamina_lvl = 0;
        this.stamina_milestone = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
        this.max_stamina = this.stamina_milestone[stamina_lvl];
        player_stamina = this.max_stamina;
        this.restoredstamina = 0;

        this.riverSpeedDebuff = 0;
        this.walkspeed = 3 + stamina_lvl + this.riverSpeedDebuff; // pixels per frame, will move faster for higher stamina lvl //!speed was 3
        this.runspeed = this.walkspeed * 2;


        //!fixme for final sprint [optional]
        hunger_lvl = 0;
        this.hunger_milestone = [100, 125, 150, 175, 200];
        this.max_hunger = this.hunger_milestone[hunger_lvl];

        // hunger will reduce current stamina
        // movement will + hunger
        // will die if reached 100 for 7 min

        thrist_lvl = 0;
        this.thrist_milestone = [100, 125, 150, 175, 200];
        this.max_thrist = this.thrist_milestone[thrist_lvl];

        // thrist will reduce current stamina
        // movement will + thrist
        // will die if reached 100 for 3 min


        this.width = 10;
        this.height = 10;
    }


    update() {

        // upload player stat to global variable
        if (player_hp <= 0 || player_hunger >= 100 || player_thrist >= 100) { //!use simple hunger condition for now
            player_hp = 0;
            player_dead = true;
            gameOver = true;
        }

        //* make sure player stat is within range
        if (player_hp > this.max_health) {
            player_hp = this.max_health;
        }

        if (player_thrist > this.max_thrist) {
            player_thrist = this.max_thrist;
        }

        if (player_thrist < 0) { // no negative thrist
            player_thrist = 0;
        }

        if (player_hunger < 0) { // no negative hunger
            player_hunger = 0;
        }

        if (player_bladder_volume < 0) {
            player_bladder_volume = 0;
        }

        if (player_bladder_volume >= 100) {
            player_bladder_volume = 100;
            pee = true;
        }

        
        if (player_stomach_volume >= 100) {
            player_stomach_volume = 100;
            poo = true;
        }

        this.max_stamina = this.stamina_milestone[stamina_lvl];

        //update speed
        this.walkspeed = 3 + stamina_lvl + this.riverSpeedDebuff; // pixels per frame, will move faster for higher stamina lvl //!speed was 3
        this.runspeed = this.walkspeed * 2;

        if (player_stamina <= 0 && !player_exhausted) {
            player_stamina = 0; // avoid negative stamina# to be bug-free
            console.log("player exhausted");

            // apply penalties
            player_hp -= 10;
            player_thrist += 10;
            player_hunger += 6;
            player_exhausted = true;
        }

        if (player_stamina < player_stamina / 5) {
            //!fixme add sound/text warning @ 1/5 lvl before exhuased; example: send boolean to UI
            //console.log("stamina: " + player_stamina);
        }
        //*** stamina level mechanism
        if (player_stamina < this.max_stamina && !player_exhausted) {
            player_stamina += 1;
            this.restoredstamina += 1; //! not calculated by the timer in UI.js
            if (stamina_lvl < this.stamina_milestone.length - 1 && this.restoredstamina / 2 >= this.stamina_milestone[stamina_lvl]) {
                stamina_lvl += 1;
                this.restoredstamina = 0;

                console.log("stamina_lvl up to " + stamina_lvl);
            }
        }

        //*** hp level mechanism
        if (player_hp < this.max_health) {
            // if restored health:
            // restoredhealth += 1; done in UI.js
            if (health_lvl < this.health_milestone.length - 1 && restoredhealth * 5 >= this.health_milestone[health_lvl]) {
                health_lvl += 1;
                restoredhealth = 0;
                console.log("health_lvl up to " + health_lvl);
            }
        }

        if (nearRiver) {
            this.riverSpeedDebuff = -2;
            // console.log("walkspeed:" + this.walkspeed);
        } else {
            this.riverSpeedDebuff = 0;

        }

    }
}

