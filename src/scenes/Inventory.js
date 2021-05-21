class Inventory extends Phaser.Scene {

    constructor() {
        // inventory scene is kind of a HUD/UI panel
        super({ key: 'UIScene', active: true });

        this.score = 0;
    }
    preload() {

        // load image
        //this.load.image('testimg1', './assets/starfield.png');

        // load audio
        //this.load.audio('switchsound', './assets/switchsound.wav');
        

    }
    create() {
        //  Our GLOBAL Text object to display the Inventory
        console.log("entered Inventory scene");
        

        this.inventoryText = this.add.text(10, 10, 'Inventory:  ', { font: '48px Arial', fill: 'WHITE' });

        // add UI Panel
        // @ param          (scene(neglected),    x, y,                          ,width,        
        this.inventoryUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 8,
            //                          height, fillColor)
            game.config.height - borderPadding, BROWN).setOrigin(0, 0);

        this.inventoryUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 6, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, BROWN).setOrigin(0, 0);


        // set the UI to be invisible as default
        this.inventoryUILeft.alpha = 0;
        this.inventoryUIRight.alpha = 0;

        this.inventoryText.alpha = 0;

        //  Grab a reference to the Play Scene
        this.ourGame = this.scene.get('playScene');

        // define key control
        keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        //  Listen for events from it
        this.ourGame.events.on('openInventory', function () {
            if (!this.openedInventory) {
                console.log("Loading inventory");

                // visualize UI Panel            
                this.inventoryUILeft.alpha = 1;
                this.inventoryText.alpha = 1;
                this.inventoryUIRight.alpha = 1;

                this.openedInventory = true;
            } else {
                console.log("closing inventory");
                // close UI Panel            
                this.inventoryUILeft.alpha = 0;
                this.inventoryText.alpha = 0;
                this.inventoryUIRight.alpha = 0;

                this.openedInventory = false;
            }


        }, this);
    }

    update() {


    }
}
