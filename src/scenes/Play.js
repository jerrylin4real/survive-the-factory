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
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/nebulaRed2.png'); // Not showing the full img? Default: starfield.png 
        this.load.image('smallfreighterspr', './assets/smallfreighterspr.png');
        this.load.image('speedship', './assets/speedship.png');
        this.load.image('player', './assets/Runner-obstacle.png'); // Placeholder file for now; FIXME!!!
        this.load.image('mouse', 'assets/sprites/mouse.png'); // for mouse control


        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('explosion2', './assets/explosion2.png', { frameWidth: 100, frameHeight: 90, startFrame: 0, endFrame: 12 });
        this.load.audio('bgm', './assets/mixkit-space-game-668.wav');
    }
    // Note: The keyword 'this' refers to the class 'Play'


    create() {
        console.log("create");
        // Scene-level variables
        this.bgmPlayed = false;
        this.bgmCreated = false;
        this.hasted = false;
        this.superWeaponRewarded = false;


        //  Make the world larger than the actual canvas; buggy
        //this.game.world.setBounds(0, 0, 1400, 1400);

        // Add time counters
        this.initialTime = game.settings.gameTimer;
        this.hasteCounter = 0; // Increase ships' movespeed if >= 30.
        this.superWeaponCount = 0;

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // Azure/0x3e5861 UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderLimitDown, 0x00BBFF).setOrigin(0, 0);

        // Grey/0x00BBFF borders 
        /* Borders might be Unnecessary in SCUM-2D
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        */

        // add player 
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 10, 'rocket2').setOrigin(0.5, 0);
        this.player1 = new Player(this, borderLimitDown + borderUISize, game.config.height - borderLimitDown, 'player').setScale(0.1); // scale the size of player1

        // add camera

        // Set the camera bounds
        this.cameras.main.setBounds(0, 0, game.config.width * 10, game.config.height* 10);
        this.cameras.main.setZoom(1);
        //Set the camera to follow player1
        this.cameras.main.startFollow(this.player1);


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

        // define mouse control
        this.mouse = this.add.sprite(game.config.width / 2, game.config.height / 2, 'mouse').setScale(0.2);
        this.input.mouse.capture = true;
        this.mouseEvent(); // redirect to mouseEvent()
        //Mouse Wheel example: https://phaser.io/examples/v3/view/input/mouse/mouse-wheel


        // define key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyV = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);

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


        // initialize score
        this.p1Score = 0;

        // display text
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '15px',
            //backgroundColor: '#000000',
            color: '#843605', // color hex code: black
            align: 'left',
            padding: {  // set the size of the display box
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }


        // display Left and middle UI
        this.currentScoreText = this.add.text(borderUISize, borderUISize + borderPadding + 5, 'Score:', textConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding + 50, borderUISize + borderPadding + 5, this.p1Score, textConfig);

        this.topScoreText = this.add.text(borderUISize, borderUISize + borderPadding + 35, 'Top Score:', textConfig);
        this.topScoreLeft = this.add.text(borderUISize + 100, borderUISize + borderPadding + 35,
            localStorage.getItem("RocketPatrolTopScore"), textConfig);

        let redConfig = {
            color: 'red', // color hex code: black
            fixedWidth: 150
        }
        this.moveText = this.add.text(230, borderUISize + borderPadding + 15, 'Move: WSAD', redConfig);
        this.quitText = this.add.text(250, borderUISize + borderPadding + 35, 'Quit: Q', redConfig);

        // GAME OVER flag
        this.gameOver = false;

        // play clock
        this.scoreConfig.fixedWidth = 0;
        this.timeText = this.add.text(440, borderUISize + borderPadding + 10, 'Time: ' + this.formatTime(this.initialTime));

        // super weapon indicator
        this.superWeaponText = this.add.text(440, borderUISize + borderPadding + 40, 'Superweapon(V): ' + this.superWeaponCount);

        // For each 1000 ms or 1 second, call onTimedEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onTimeEvent, callbackScope: this, loop: true });

        /*
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← to Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
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
                volume: 0.7,
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
    }

    mouseEvent() {
        // crossair follows the user mouse input
        this.input.on('pointermove', pointer => {
            this.mouse.x = pointer.x;
            this.mouse.y = pointer.y;
        });

        this.input.on('pointerdown', pointer => {
            //create a seperate function for on click event
            this.superWeaponCount += 1;
        });
    }


    update() {
        // let paused = false;
        // check key input for restart / menu
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.gameOver = true;
            //this.initialTime = 0;
        }

        // Game Over text
        if (this.gameOver) {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← to Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        // Pause feature
        /* if (Phaser.Input.Keyboard.JustDown(keyP)) {
            this.scene.pause();
            paused = true;
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME PAUSED').setOrigin(0.5);
            if (paused == true) {
                this.scene.resume();
                paused = false;
            }
        }
        */

        if (this.hasteCounter > 30 && this.hasted == false) {
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
            this.ship04.moveSpeed += 2;
            this.hasted = true;
        }


        if (this.gameOver && this.bgmCreated) {
            this.bgm.pause()
            this.bgmPlayed = false;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 0;  // update tile sprite

        // if game is not over...
        if (!this.gameOver) {

            this.player1.update();             // update player1
            this.ship01.update();               // update spaceship (x4)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();

            // Debugging Only
            // console.log('gametime: ' + this.game.getTimer());
        }

        // new weapon
        if (this.superWeaponCount > 0 && Phaser.Input.Keyboard.JustDown(keyV)) { // if pressed v for superweapon
            let ships = [
                this.ship01,
                this.ship02,
                this.ship03,
                this.ship04
            ];

            let randomShip = ships[Math.floor(Math.random() * ships.length)];
            this.p1Rocket.reset();
            this.shipExplode2(randomShip);
            this.superWeaponCount -= 1;
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }

    render() {
        // mouse debug
        this.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
        this.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);
        this.debug.text("Right Button: " + game.input.activePointer.rightButton.isDown, 300, 260);

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
        if (!this.gameOver) {
            this.initialTime += 1; // countdown 1 for one second
            this.timeText.setText('Time: ' + this.formatTime(this.initialTime));
            if (this.hasted == false) { 
                this.hasteCounter += 1; // if >= 30, ships will go faster
            }
            if (this.p1Score >= 30 && this.p1Score <= 100 && !this.superWeaponRewarded) {
                this.superWeaponRewarded = true;
                this.superWeaponCount += 1;
            }
            this.superWeaponText.setText('Superweapon(V): ' + this.superWeaponCount);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
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
        this.p1Score += ship.points;
        if (this.p1Score > localStorage.getItem("RocketPatrolTopScore")) {
            localStorage.setItem("RocketPatrolTopScore", this.p1Score);
            this.topScoreLeft.text = localStorage.getItem("RocketPatrolTopScore");
        }
        this.scoreLeft.text = this.p1Score;

        let soundFXLib = [
            'sfx_explosion_spell',
            'sfx_explosion_sea-mine',
            'sfx_explosion_shot-light',
            'sfx_explosion_crash'
        ];
        let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        this.sound.play(soundFXLib[random4SoundFX]);
        // add time bonus
        this.initialTime += ship.timeBonus;
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
        this.p1Score += ship.points;
        if (this.p1Score > localStorage.getItem("RocketPatrolTopScore")) {
            localStorage.setItem("RocketPatrolTopScore", this.p1Score);
            this.topScoreLeft.text = localStorage.getItem("RocketPatrolTopScore");
        }
        this.scoreLeft.text = this.p1Score;

        let soundFXLib = [
            'sfx_explosion_spell',
            'sfx_explosion_sea-mine',
            'sfx_explosion_shot-light',
            'sfx_explosion_crash'
        ];
        let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        this.sound.play(soundFXLib[random4SoundFX]);
        // add time bonus
        this.initialTime += ship.timeBonus;
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

