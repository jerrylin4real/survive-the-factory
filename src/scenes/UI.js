class UI extends Phaser.Scene {

    constructor() {
        // inventory scene is kind of a HUD/UI panel
        super({ key: 'UIScene', active: true }); // !Note that there can only be one UIScene
        this.score = 0;
    }
    preload() {

        // load image
        this.load.image('mouse', 'assets/sprites/mouse.png'); // for mouse control

        // load audio
        //this.load.audio('switchsound', './assets/switchsound.wav');

    }
    create() {
        //  Our GLOBAL Text object to display the Inventory
        console.log("entered UI scene");
        //  Grab a reference to the Scenes
        this.ourPlayScene = this.scene.get('playScene');
        // Add time counters
        initialTime = 0;
        this.timeText = this.add.text(game.config.width / 1.3, borderUISize - borderPadding, 'Time Survived: ' + this.formatTime(initialTime), { font: '24px Arial', fill: 'WHITE' });
        this.bestTimeSurvived = this.add.text(game.config.width / 1.7, borderUISize - borderPadding, 'Best Time: ' + this.formatTime(localStorage.getItem("Scum2DBestTimeSurvived")), { font: '24px Arial', fill: 'WHITE' });

        // For each 1000 ms or 1 second, call onTimedEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onTimeEvent, callbackScope: this, loop: true });

        // add Inventory UI Panel
        this.inventoryText = this.add.text(10, 10, '(I)nventory  ', { font: '48px Arial', fill: 'WHITE' });

        // @ param          (scene(neglected),    x, y,                          ,width,        
        this.inventoryUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 8,
            //                          height, fillColor)
            game.config.height - borderPadding, BROWN).setOrigin(0, 0);

        this.inventoryUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 6, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, BROWN).setOrigin(0, 0);

        // add Metabolism UI Panel
        this.metabolismText = this.add.text(10 + borderUISize * 6, 10, '(M)etabolism  ', { font: '48px Arial', fill: 'WHITE' });
        this.metabolismUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 8,
            //                          height, fillColor)
            game.config.height - borderPadding, sadBLUE).setOrigin(0, 0);

        this.metabolismUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 6, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, sadBLUE).setOrigin(0, 0);

        this.exhaustedText = this.add.text(borderUISize * 2, borderUISize * 2, 'Status: run-able', { font: '24px Arial', fill: 'WHITE' });


        // add Tutorial UI Panel
        this.tutorialText = this.add.text(game.config.width / 2, game.config.height / 2, 'Use WSAD to move and mouse to interact\nPress TAB or 1 for inventory\nPress T for Tutorial \
        press M or 3 for metabolism UI').setOrigin(0.5);

        //! add Player Stat UI Panel
        // set the UI to be invisible as default
        this.inventoryUILeft.alpha = 0;
        this.inventoryUIRight.alpha = 0;
        this.inventoryText.alpha = 0;

        this.metabolismText.alpha = 0;
        this.metabolismUILeft.alpha = 0;
        this.metabolismUIRight.alpha = 0;

        this.tutorialText.alpha = 0;
        this.exhaustedText.alpha = 0;

        // define key control
        keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        // define mouse control
        this.mouse = this.add.sprite(game.config.width / 2, game.config.height / 2, 'mouse').setScale(0.2);
        this.input.mouse.capture = true;
        this.mouseEvent(); // redirect to mouseEvent()
        //Mouse Wheel example: https://phaser.io/examples/v3/view/input/mouse/mouse-wheel


        //**  Listen for events
        this.ourPlayScene.events.on('openInventory', function () {
            if (!openedInventory) {
                console.log("Loading inventory");
                this.openInventory();
            } else {
                this.closeInventory();
            }

        }, this);

        this.ourPlayScene.events.on('openMetabolism', function () {
            if (!openedMetabolism) {
                console.log("Loading Metabolism");
                this.openMetabolism();
            } else {
                this.closeMetabolism();
            }

        }, this);

        this.ourPlayScene.events.on('openTutorial', function () {
            if (!openedTutorial) {
                this.openTutorial();
            } else {
                this.closeTutorial();
            }

        }, this);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            // *** Restart the game ***
            initialTime = 0;
            // set up event flag for restarting Play Scene
            restartPlay = true;
        }
        if (player_exhausted) {
            this.exhaustedText.setText("Status: exhausted");
        } else if (!player_exhausted) {
            this.exhaustedText.setText("Status: run-able");
        }

        if (initialTime > localStorage.getItem("Scum2DBestTimeSurvived")) {
            localStorage.setItem("Scum2DBestTimeSurvived", initialTime);
            this.bestTimeSurvived.setText('Best Time: ' + this.formatTime(localStorage.getItem("Scum2DBestTimeSurvived")));
        }
    }

    /******************************************************
    * Module-level funcions defined below
    *******************************************************/
    formatTime(seconds) {
        // Minutes
        var minutes = Math.floor(seconds / 60);
        // Seconds
        var partInSeconds = seconds % 60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, '0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    onTimeEvent() {
        // run update()
        this.update();
        if (!gameOver) {
            initialTime += 1; // countdown 1 for one second
        } else {
            // game is over
            initialTime = 0;
        }
        this.timeText.setText('Time Survived: ' + this.formatTime(initialTime));

    }

    mouseEvent() {
        // crossair follows the user mouse input
        this.input.on('pointermove', pointer => {
            this.mouse.x = pointer.x;
            this.mouse.y = pointer.y;
        });

        this.input.on('pointerdown', pointer => {
            //create a seperate function for on click event

        });
    }

    closeInventory() {
        console.log("closing inventory");
        // close UI Panel            
        this.inventoryUILeft.alpha = 0;
        this.inventoryText.alpha = 0;
        this.inventoryUIRight.alpha = 0;

        openedInventory = false;
    }

    openInventory() {
        this.closeMetabolism();
        this.closeTutorial();
        console.log("opening inventory");
        // visualize UI Panel            
        this.inventoryUILeft.alpha = 1;
        this.inventoryText.alpha = 1;
        this.inventoryUIRight.alpha = 1;

        openedInventory = true;
    }

    closeMetabolism() {
        console.log("closing Metabolism");

        // close UI Panel            
        this.metabolismUILeft.alpha = 0;
        this.metabolismText.alpha = 0;
        this.metabolismUIRight.alpha = 0;
        this.exhaustedText.alpha = 0;

        openedMetabolism = false;
    }

    openMetabolism() {
        this.closeInventory();
        this.closeTutorial();
        console.log("opening metabolism");
        // visualize UI Panel            
        this.metabolismUILeft.alpha = 1;
        this.metabolismText.alpha = 1;
        this.metabolismUIRight.alpha = 1;
        this.exhaustedText.alpha = 1;


        openedMetabolism = true;
    }

    closeTutorial() {
        console.log("closing Metabolism");

        // close UI Panel            
        this.tutorialText.alpha = 0;
        openedTutorial = false;
    }

    openTutorial() {
        this.closeInventory();
        this.closeMetabolism();
        console.log("opening metabolism");
        // visualize UI Panel            
        this.tutorialText.alpha = 1;
        openedTutorial = true;
    }

}

