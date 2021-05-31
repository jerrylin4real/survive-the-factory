// Player Class prefab; might not be necessary

class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        //! Translate variable to main.js as var(s), like what Leland did with player_exhausted 
        this.number = 1; // number/packs of food
        this.hunger_restore_value = 0;
        this.durability = 100;
        this.name = "peach";

        this.width = 10;
        this.height = 10;
    }

    update() {

        if (this.durability <= 0) {
            //!FIXME destory item
        }
        // allocate hunger_restore_value based on food type
        //!not effective for now
        if (this.name == "cherry") {
            this.hunger_restore_value = 5;
        }

        if (this.name == "peach") {
            this.hunger_restore_value = 10;
            //player_thrist -= 5;
        }

        if (this.name == "pitaya") {
            this.hunger_restore_value = 20;
        }

        if (this.name == "watermalon") {
            this.hunger_restore_value = 30;
        }


        if (this.name == "canned_beef") {
            this.hunger_restore_value = 50;
        }

        if (this.name == "river") {
            // near river
            // if it is with in distance
                // this.nearRiver = true;
        }

    }

}