class Tutorial extends Phaser.Scene {
//!fixme unfinished scene
    constructor() {
        // Tutorial scene is kind of a HUD/UI panel
        super({ key: 'UIScene', active: true });

        this.score = 0;
    }
    preload() {

        // load image
        this.load.image('testimg1', './assets/starfield.png');

        // load audio
        //this.load.audio('switchsound', './assets/switchsound.wav');

    }
    create() {
        //  Our GLOBAL Text object to display the Tutorial
        console.log("entered Tutorial scene");

        this.testimg1 = this.add.image(410, 310, 'testimg1');
        this.testimg1.alpha = 0; //!fixme add img to event logic to toggle visibility


        this.TutorialText = this.add.text(10, 10, 'Tutorial:  ', { font: '48px Arial', fill: 'WHITE' });

        // add UI Panel
        // @ param          (scene(neglected),    x, y,                          ,width,        
        this.TutorialUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 8,
            //                          height, fillColor)
            game.config.height - borderPadding, BROWN).setOrigin(0, 0);

        this.TutorialUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 6, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, BROWN).setOrigin(0, 0);


        // set the UI to be invisible as default
        this.TutorialUILeft.alpha = 0;
        this.TutorialUIRight.alpha = 0;

        this.TutorialText.alpha = 0;

        //  Grab a reference to the Play Scene
        this.ourGame = this.scene.get('playScene');

        // define key control
        keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        //  Listen for events from it
        this.ourGame.events.on('openTutorial', function () {
            if (!this.openedTutorial) {
                console.log("Loading Tutorial");

                // visualize UI Panel            
                this.TutorialUILeft.alpha = 1;
                this.TutorialText.alpha = 1;
                this.TutorialUIRight.alpha = 1;

                this.openedTutorial = true;
            } else {
                console.log("closing Tutorial");
                // close UI Panel            
                this.TutorialUILeft.alpha = 0;
                this.TutorialText.alpha = 0;
                this.TutorialUIRight.alpha = 0;

                this.openedTutorial = false;
            }


        }, this);
    }

    update() {


    }
}
