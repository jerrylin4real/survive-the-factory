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
        at_MENU_Scene = true;

        //  Grab a reference to the Scenes
        this.ourPlayScene = this.scene.get('playScene');

        // Add time counters
        initialTime = 0;
        this.timeText = this.add.text(game.config.width / 1.3, borderUISize - borderPadding, 'Time Survived: ' + this.formatTime(initialTime), { font: '24px Arial', fill: 'WHITE' });
        this.bestTimeSurvived = this.add.text(game.config.width / 1.7, borderUISize - borderPadding, 'Best Time: ' + this.formatTime(localStorage.getItem("Scum2DBestTimeSurvived")), { font: '24px Arial', fill: 'WHITE' });

        // For each 1000 ms or 1 second, call onTimedEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onTimeEvent, callbackScope: this, loop: true });


        // add gameOver UI
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER\nPress (R) to Restart or (ESC) to Menu', this.scoreConfig).setOrigin(0.5);
        this.gameOverText.alpha = 0;

        //*** add Inventory UI Panel
        this.inventoryText = this.add.text(10, 10, '(I)nventory  ', { font: '48px Arial', fill: 'WHITE' });

        // @ param          (scene(neglected),    x, y,                          ,width,        
        this.inventoryUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 11,
            //                          height, fillColor)
            game.config.height - borderPadding, BROWN).setOrigin(0, 0);

        this.inventoryUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 9, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, BROWN).setOrigin(0, 0);

        //! maybe we can make inventory item as a button
        this.peachText = this.add.text(borderUISize, borderUISize * 1.5, 'Peach#: ' + num_peach + " F for more", { font: '24px Arial', fill: 'PINK' });
        this.peachText.setInteractive().on('pointerdown', () => this.consumeItem("peach"));

        //*** add Metabolism UI Panel
        this.metabolismText = this.add.text(10 + borderUISize * 6, 10, '(M)etabolism  ', { font: '48px Arial', fill: 'WHITE' });
        this.metabolismUILeft = this.add.rectangle(0, borderUISize + borderPadding, game.config.width / 2 - borderPadding * 11,
            //                          height, fillColor)
            game.config.height - borderPadding, sadBLUE).setOrigin(0, 0);

        this.metabolismUIRight = this.add.rectangle(game.config.width / 3 + borderUISize * 9, borderUISize + borderPadding, game.config.width / 2 - borderPadding,
            game.config.height * 2, sadBLUE).setOrigin(0, 0);

        //!FIXME finish Player Stat UI Panel
        // @ param                                   , borderUISize * y // change y to list-show stat
        this.healthText = this.add.text(borderUISize, borderUISize * 1.5, 'HP(lvl.' + health_lvl + '): ' + player_hp, { font: '24px Arial', fill: 'WHITE' });
        this.healthText_LowerLeft = this.add.text(borderUISize, borderUISize * 15, 'HP(lvl.' + health_lvl + '): ' + player_hp, { font: '24px Arial', fill: 'WHITE' });
        this.staminaText = this.add.text(borderUISize, borderUISize * 2.5, 'Stamina(lvl.' + stamina_lvl + '): ' + player_stamina, { font: '24px Arial', fill: 'WHITE' });
        this.staminaText_LowerLeft = this.add.text(borderUISize, borderUISize * 16, 'Stamina(lvl.' + stamina_lvl + '): ' + player_stamina, { font: '24px Arial', fill: 'WHITE' });
        this.exhaustedText = this.add.text(borderUISize, borderUISize * 3.5, 'Status: run-able', { font: '24px Arial', fill: 'GREEN' });

        this.hungerText = this.add.text(borderUISize, borderUISize * 4.5, 'Hunger: ' + player_hunger, { font: '24px Arial', fill: 'ORANGE' });

        this.thristText = this.add.text(borderUISize, borderUISize * 5.5, 'Thrist: ' + player_thrist, { font: '24px Arial', fill: 'WHITE' });


        // add Tutorial UI Panel
        this.tutorialText = this.add.text(game.config.width / 2, game.config.height / 2, 'Use WSAD to move and mouse to interact\nPress TAB or 1 for inventory\nPress T for Tutorial \
        press M or 3 for metabolism UI\nPress Shift to sprint\nPress F to get item\nClick on item to use\nPress Q to end game', { font: '36px Arial', fill: 'WHITE' }).setOrigin(0.5);


        // set the UI to be invisible as default
        this.inventoryUILeft.alpha = 0;
        this.inventoryUIRight.alpha = 0;
        this.inventoryText.alpha = 0;

        this.metabolismText.alpha = 0;
        this.metabolismUILeft.alpha = 0;
        this.metabolismUIRight.alpha = 0;

        this.tutorialText.alpha = 0;
        this.exhaustedText.alpha = 0;
        this.hungerText.alpha = 0;
        this.staminaText.alpha = 0;
        this.healthText.alpha = 0;
        this.healthText_LowerLeft.alpha = 0;
        this.staminaText_LowerLeft.alpha = 0;
        this.thristText.alpha = 0;
        this.peachText.alpha = 0;


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
        // update texts to display
        this.staminaText.setText('Stamina(lvl.' + stamina_lvl + '): ' + player_stamina);
        this.healthText.setText('HP(lvl.' + health_lvl + '): ' + player_hp);
        this.hungerText.setText('Hunger: ' + player_hunger);
        this.thristText.setText("Thrist: " + player_thrist);
        this.peachText.setText("Peach#: " + num_peach + " F for more");

        //sync always-on display text outside Metabolism or Inventory

        if (initialTime > 0){
            if (openedMetabolism || openedInventory) {
                this.staminaText_LowerLeft.alpha = 0;
                this.healthText_LowerLeft.alpha = 0;
            } else {
                this.staminaText_LowerLeft.alpha = 1;
                this.healthText_LowerLeft.alpha = 1;
            }
    
        }
      
        this.staminaText_LowerLeft.setText('Stamina(lvl.' + stamina_lvl + '): ' + player_stamina);
        this.healthText_LowerLeft.setText('HP(lvl.' + health_lvl + '): ' + player_hp);

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            // *** Restart the game ***
            initialTime = 0;
            // set up event flag for restarting Play Scene
            restartPlay = true;
        }

        if (player_exhausted) {
            this.exhaustedText.setText("Status: exhausted..." + exhausted_countdown / 100 + "s");
            this.exhaustedText.setColor("RED");

        } else if (!player_exhausted) {
            this.exhaustedText.setText("Status: run-able");
            this.exhaustedText.setColor("GREEN");
        }

        if (initialTime > localStorage.getItem("Scum2DBestTimeSurvived")) {
            localStorage.setItem("Scum2DBestTimeSurvived", initialTime);
            this.bestTimeSurvived.setText('Best Time: ' + this.formatTime(localStorage.getItem("Scum2DBestTimeSurvived")));
        }

        if (initialTime > 1) { // make sure not doing 0 % x; 
            //! need to fix this logic

            //*  increment thrist
            if ((initialTime % 14) == 0) {
                // set flag one sec before the event
                thristCounted = false;
            }
            if (!thristCounted) {
                if ((initialTime % 15) == 0) { // for every 15 second...
                    player_thrist += 1;
                    // clear flag
                    thristCounted = true;
                }

            }


            //*  increment hunger
            if ((initialTime % 24) == 0) {
                // set flag one sec before the event
                hungerCounted = false;
            }
            if (!hungerCounted) {
                if ((initialTime % 25) == 0) { // for every 25 second...
                    player_hunger += 1;
                    // clear flag
                    hungerCounted = true;
                }

            }


            //* health regen
            if ((initialTime % 29) == 0 && player_hunger < 50 && player_thrist < 90) {
                // set flag one sec before the event
                healthregenCounted = false;
            }
            if (!healthregenCounted && (initialTime % 30) == 0) { // for every 30 second...
                // restore 1 hp
                player_hp += (health_lvl + 1);
                restoredhealth += (health_lvl + 1); //aka restoredhp
                // clear flag
                healthregenCounted = true;
            }
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
            this.gameOverText.alpha = 0;

        } else {
            // game is over
            if (openedInventory) {
                this.closeInventory();
            }
            if (openedMetabolism) {
                this.closeMetabolism();
            }
            if (openedTutorial) {
                this.closeTutorial();
            }
            initialTime = 0;

            if (at_MENU_Scene) {
                this.gameOverText.alpha = 0;
            } else {
                this.gameOverText.alpha = 1;
            }
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

            // show (x, y) on click
            console.log("x:" + pointer.x + " y:" + pointer.y);

        });
    }

    closeInventory() {
        console.log("closing inventory");
        // close UI Panel            
        this.inventoryUILeft.alpha = 0;
        this.inventoryText.alpha = 0;
        this.inventoryUIRight.alpha = 0;
        this.peachText.alpha = 0;
        
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
        this.peachText.alpha = 1;


        openedInventory = true;
    }

    closeMetabolism() {
        console.log("closing Metabolism");

        // close UI Panel            
        this.metabolismUILeft.alpha = 0;
        this.metabolismText.alpha = 0;
        this.metabolismUIRight.alpha = 0;
        this.exhaustedText.alpha = 0;
        this.staminaText.alpha = 0;
        this.healthText.alpha = 0;
        this.hungerText.alpha = 0;
        this.thristText.alpha = 0;

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
        this.staminaText.alpha = 1;
        this.healthText.alpha = 1;
        this.hungerText.alpha = 1;
        this.thristText.alpha = 1;

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

    consumeItem(item_name) {
        if (openedInventory) {
            if (item_name == "peach") {
                if (num_peach > 0) {
                    num_peach -= 1;
                    player_hunger -= 10;
                    player_thrist -= 5;
                } else {
                    //! print "no more peach"
                    console.log("No more peach!");
                }
            }
        }
    }

    // add10thrist(){
    //     player_thrist += 10; // get kind of thristy when player is exhausted 
    // }

}

