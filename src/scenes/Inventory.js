class Inventory extends Phaser.Scene {

    constructor() {
        // inventory scene
        super({ key: 'UIScene', active: true });

        this.score = 0;
    }

    create() {
        //  Our GLOBAL Text object to display the Inventory
        console.log("entered Inventory scene");
        let inventoryText = this.add.text(10, 10, 'Inventory: 0', { font: '48px Arial', fill: 'WHITE' });

        // set the text to be invisible as default
        inventoryText.alpha = 0;
        console.log("Loading inventoryText");

        //  Grab a reference to the Play Scene
        let ourGame = this.scene.get('playScene');

        // define key control
        keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        //  Listen for events from it
        //!FIXME events listening does now work
        ourGame.events.on('openInventory', function () {
            console.log("Loading inventory");

            // add UI Panel
            // @ param                          (scene, x, y, width, height, fillColor);
            var inventoryUI = this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderLimitDown, "WHITE").setOrigin(0, 0);

            inventoryText.setText('Score: ' + this.score);

        }, this);

        if (Phaser.Input.Keyboard.JustDown(keyTAB)) {
            console.log("Pressed TAB");

            // set the inventoryText to be visible
            inventoryText.alpha = 1;
            //  Dispatch a Scene event
            //this.events.emit('closeInventory');
        }   
    }

    update() {


    }
}
