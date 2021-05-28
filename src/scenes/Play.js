// Main scene carrying out the game
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        // display score

        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {  // set the size of the display box
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
    }

    preload() {
        console.log("preload");

        // load images/tile sprites
        //this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/nebulaRed.png'); // Not showing the full img? Default: starfield.png 
        this.load.image('smallfreighterspr', './assets/smallfreighterspr.png');
        this.load.image('speedship', './assets/speedship.png');
        this.load.image('player', './assets/Runner-obstacle.png'); // Placeholder file for now; FIXME!!!


        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('explosion2', './assets/explosion2.png', { frameWidth: 100, frameHeight: 90, startFrame: 0, endFrame: 12 });
        this.load.audio('bgm', './assets/mixkit-space-game-668.wav');

        // load audio
        this.load.audio('switchsound', './assets/Select.wav');

        this.load.path = './assets/';
        this.load.atlas('platformer', 'player-and-food.png', 'player-and-food.json');

    }
    // Note: The keyword 'this' refers to the class 'Play'


    create() {
        console.log("create");
        // Scene-level variables
        gameOver = false;
        at_MENU_Scene = false;

        this.bgmPlayed = false;
        this.bgmCreated = false;
        this.hasted = false;
        this.superWeaponRewarded = false;
        this.openedMetabolism = false;


        //  Make the world larger than the actual canvas; buggy
        //this.game.world.setBounds(1400, 1400);

        // Add time counters
        this.hasteCounter = 0; // Increase ships' movespeed if >= 30.
        this.superWeaponCount = 0;

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 9999, 9999, 'starfield').setOrigin(0, 0);

        // Azure/0x3e5861 UI background
        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderLimitDown, 0x00BBFF).setOrigin(0, 0);

        // Grey/0x00BBFF borders 
        /* Borders might be Unnecessary in SCUM-2D
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        */

        // add player 
        //this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 10, 'rocket2').setOrigin(0.5, 0);
        this.player1 = new Player(this, borderLimitDown + borderUISize, game.config.height - borderLimitDown, 'platformer', 'stand').setScale(1); // scale the size of this.player1
        player1 = this.player1;

        //*** add camera
        // Set the camera bounds
        this.cameras.main.setBounds(0, 0, game.config.width * 10, game.config.height * 10);
        this.cameras.main.setZoom(1);
        //Set the camera to follow this.player1
        this.cameras.main.startFollow(player1);


        // follow style switch buttons
        /*btn0 = game.add.button(6, 40, 'button', lockonFollow, this, 0, 0, 0);
        btn1 = game.add.button(6, 120, 'button', platformerFollow, this, 1, 1, 1);
        btn2 = game.add.button(6, 200, 'button', topdownFollow, this, 2, 2, 2);
        btn3 = game.add.button(6, 280, 'button', topdownTightFollow, this, 3, 3, 3);
        */
        // add Spaceships (x3)

        this.ship01 = new Spaceship(this, game.config.width + borderLimitUp, borderUISize * 5, 'speedship', 0, 30, 3).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20, 2).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderLimitUp + borderPadding * 4, 'spaceship', 0, 10, 1).setOrigin(0, 0);
        this.ship04 = new Spaceship(this, game.config.width, borderLimitDown + 45, 'smallfreighterspr', 0, 100, 10).setOrigin(0, 0);
        this.ship04.moveSpeed = 10;

        // define key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyTAB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L); // show player location on console.log
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);



        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 12, first: 0 }),
            frameRate: 10
        });
        this.anims.create({
            key: 'walkleft',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'walkleft' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'walkright',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'walkright' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'go-up',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'go-up',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });
        this.anims.create({
            key: 'go-down',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'go-down',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });
        this.anims.create({
            key: 'stand',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'stand' }
            ],
            repeat: -1
        });




        // initialize score
        this.p1Score = 0;
        // display text

        // display Left and middle UI
        //this.currentScoreText = this.add.text(borderUISize, borderUISize + borderPadding + 5, 'Score:', textConfig);
        //this.scoreLeft = this.add.text(borderUISize + borderPadding + 50, borderUISize + borderPadding + 5, this.p1Score, textConfig);

        // this.topScoreText = this.add.text(borderUISize, borderUISize + borderPadding + 35, 'Top Score:', textConfig);
        // this.topScoreLeft = this.add.text(borderUISize + 100, borderUISize + borderPadding + 35,
        //     localStorage.getItem("RocketPatrolTopScore"), textConfig);

        let redConfig = {
            color: 'red', // color hex code: black
            fixedWidth: 150
        }
        // this.moveText = this.add.text(230, borderUISize + borderPadding + 15, 'Move: WSAD', redConfig);
        // this.quitText = this.add.text(250, borderUISize + borderPadding + 35, 'Quit: Q', redConfig);

        // clear GAME OVER flag

        // play clock
        this.scoreConfig.fixedWidth = 0;

        // super weapon indicator
        //this.superWeaponText = this.add.text(440, borderUISize + borderPadding + 40, 'Superweapon(V): ' + this.superWeaponCount);
        /*
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or (ESC) to Menu', this.scoreConfig).setOrigin(0.5);
            gameOver = true;
        }, null, this);
        */
        // play background music 
        if (this.bgmPlayed == false) {
            if (this.bgmCreated) {
                this.bgm.resume();
                return;
            }
            this.bgm = this.sound.add('bgm', {
                mute: false,
                volume: 0.3,
                rate: 1,
                loop: true,
                delay: 0
            });
            this.bgmCreated = true;
            this.bgm.play();
        } else {
            // Resume bgm if bgm exists
            this.bgm.resume();
        }

        // * reset values
        player_hunger = 0;
        player_thrist = 0;
    }

    update() {
        //console.log("update()");
        // let paused = false;
        // check key input for restart / menu
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            gameOver = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            gameOver = true;
            at_MENU_Scene = true;
            this.scene.start("menuScene");
        }

        // Interact button
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            //!implement interaction
            //! add peach for sprint 2
            num_peach += 1;
            // if F a loot
            // randomly gerenate an item/weapon;      
        }

        // Press L to show player location
        if (Phaser.Input.Keyboard.JustDown(keyL)) {
            // console.log("x:" + this.player1.x + " y:" + this.player1.y);
            console.log("x:" + player1_x + " y:" + player1_y);

        }


        if (player_exhausted) {

            if (exhausted_countdown > 0) {
                exhausted_countdown -= 1;
                player_exhausted = true;

            } else {
                exhausted_countdown = init_exhausted_countdown;
                player_stamina = 1; // to get out of infinate loop
                player_exhausted = false;
            }
        } else {
            // not exhausted 
            //!move keycontrol to play!!!

            //***  player movement control:W S A D
            // is Down = keep pressed down
            if (keyA.isDown && this.player1.x >= borderUISize) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.x -= this.player1.runspeed;
                    // running loses more stamina
                    this.player1.stamina -= 2;
                } else {
                    this.player1.x -= this.player1.walkspeed;
                    this.player1.stamina -= 1;
                }

            } else if (keyD.isDown && this.player1.x < game.config.width * 10 - borderUISize) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.x += this.player1.runspeed;
                    // running loses more stamina
                    this.player1.stamina -= 2;
                } else {
                    this.player1.x += this.player1.walkspeed;
                    this.player1.stamina -= 1;
                }
            }
            if (keyW.isDown && this.player1.y >= borderLimitUp - borderUISize) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.y -= this.player1.runspeed;
                    // running loses more stamina
                    this.player1.stamina -= 2;
                } else {
                    this.player1.y -= this.player1.walkspeed;
                    this.player1.stamina -= 1;
                }
            } else if (keyS.isDown && this.player1.y <= game.config.height * 10 - borderLimitDown) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.y += this.player1.runspeed;
                    // running loses more stamina
                    this.player1.stamina -= 2;
                } else {
                    this.player1.y += this.player1.walkspeed;
                    this.player1.stamina -= 1;
                }
            }
            //state machines
            // metabolism 
        }

        if (this.hasteCounter > 30 && this.hasted == false) {
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
            this.ship04.moveSpeed += 2;
            this.hasted = true;
        }

        if (gameOver) {
            if (this.bgmCreated) {
                this.bgm.pause()
                this.bgmPlayed = false;
            }
            if (restartPlay || Phaser.Input.Keyboard.JustDown(keyR)) { //!condition Phaser.Input.Keyboard.JustDown(keyR) may be redundant
                console.log("Restarting game...");
                this.sound.play('switchsound');
                this.scene.restart();
                // clear event flag
                restartPlay = false;
            }
        }
        if (!gameOver) {

            this.player1.update();             // update this.player1
            this.ship01.update();               // update spaceship (x4)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();

            // Debugging Only
            // console.log('gametime: ' + this.game.getTimer());
        }

        // ** Send events to UI.js
        if (Phaser.Input.Keyboard.JustDown(keyTAB) || Phaser.Input.Keyboard.JustDown(keyI) || Phaser.Input.Keyboard.JustDown(key1)) {
            //  Dispatch openInventory event
            this.sound.play('switchsound');
            this.events.emit('openInventory');
        }

        if (Phaser.Input.Keyboard.JustDown(keyM) || Phaser.Input.Keyboard.JustDown(key3)) {
            //console.log("Pressed M");
            this.sound.play('switchsound');
            //  Dispatch openMetabolism  event
            this.events.emit('openMetabolism');
            // console.log("EVENT openMetabolism dispatched");
        }
        if (Phaser.Input.Keyboard.JustDown(keyT) || Phaser.Input.Keyboard.JustDown(key4)) {
            this.sound.play('switchsound');
            this.events.emit('openTutorial');
            // console.log("EVENT openTutorial dispatched");

        }

        this.starfield.tilePositionX -= 0;  // update tile sprite

        // if game is not over...


        // new weapon
        if (this.superWeaponCount > 0 && Phaser.Input.Keyboard.JustDown(keyV)) { // if pressed v for superweapon
            let ships = [
                this.ship01,
                this.ship02,
                this.ship03,
                this.ship04
            ];

            let randomShip = ships[Math.floor(Math.random() * ships.length)];
            //this.player1.reset();
            this.shipExplode2(randomShip);
            this.superWeaponCount -= 1;
        }

        // check collisions
        if (this.checkCollision(this.player1, this.ship04)) {
            //this.player1.reset();
            this.shipExplode(this.ship04);
        }

        if (this.checkCollision(this.player1, this.ship03)) {
            //this.player1.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.player1, this.ship02)) {
            //this.player1.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.player1, this.ship01)) {
            //this.player1.reset();
            this.shipExplode(this.ship01);
        }

    }

    render() {
        /* mouse debug
        this.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
        this.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);
        this.debug.text("Right Button: " + game.input.activePointer.rightButton.isDown, 300, 260);
        */
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



    checkCollision(player, item) { //!FIXME rewrite this !
        // simple AABB checking
        if (player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.height + player.y > item.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        // this.p1Score += ship.points;
        // if (this.p1Score > localStorage.getItem("RocketPatrolTopScore")) {
        //     localStorage.setItem("RocketPatrolTopScore", this.p1Score);
        //     this.topScoreLeft.text = localStorage.getItem("RocketPatrolTopScore");
        // }
        // this.scoreLeft.text = this.p1Score;

        let soundFXLib = [
            'sfx_explosion_spell',
            'sfx_explosion_sea-mine',
            'sfx_explosion_shot-light',
            'sfx_explosion_crash'
        ];
        let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        this.explosionFX = this.sound.add(soundFXLib[random4SoundFX], { volume: 0.1 });
        this.explosionFX.play();
    }

    shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom2 = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom2.anims.play('explode2');             // play explode animation
        boom2.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom2.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        // this.p1Score += ship.points;
        // if (this.p1Score > localStorage.getItem("RocketPatrolTopScore")) {
        //     localStorage.setItem("RocketPatrolTopScore", this.p1Score);
        //     this.topScoreLeft.text = localStorage.getItem("RocketPatrolTopScore");
        // }
        // this.scoreLeft.text = this.p1Score;

        let soundFXLib = [
            'sfx_explosion_spell',
            'sfx_explosion_sea-mine',
            'sfx_explosion_shot-light',
            'sfx_explosion_crash'
        ];
        let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        this.explosionFX = this.sound.add(soundFXLib[random4SoundFX], { volume: 0.1 });
        this.explosionFX.play();
        // add time bonus
    }

    setMap(scene, mapName) {
        currentMap = mapName;
        // currentMap = "dungeonMap";
        map = scene.make.tilemap({ key: currentMap });
        const tileset = map.addTilesetImage("room-tileset", "tiles");

        const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
        worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });
        aboveLayer.setDepth(10);
        spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        const enterArea = map.findObject("Objects", obj => obj.name === "Enter Area");
        enterRec = new Phaser.GameObjects.Rectangle(scene, enterArea.x, enterArea.y, enterArea.width, enterArea.height);

        // Create a sprite with physics enabled via the physics system. The image used for the sprite has
        // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
        // if(player)
        if (player == undefined) {
            player = scene.physics.add
                .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
                .setSize(30, 40)
                .setOffset(0, 24).setDepth(5);
        } else {
            scene.physics.world.removeCollider(colPW);
            player.x = spawnPoint.x;
            player.y = spawnPoint.y;
        }

        colPW = scene.physics.add.collider(player, worldLayer);

        camera = scene.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
}

