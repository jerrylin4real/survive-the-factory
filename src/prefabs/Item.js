// Player Class prefab; might not be necessary

class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing, displayList, updateList
        //! Translate variable to main.js as var(s), like what Leland did with player_exhausted 
        this.number = 1; // number/packs of food
        this.hunger_restore_value;
        this.durability = 100;

    }
    update() {
        if(this.durability <= 0){
            //!FIXME destory item
        }

    }
}