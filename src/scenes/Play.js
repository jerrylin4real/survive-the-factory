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
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/nebulaRed2.png'); // Not showing the full img? Default: starfield.png 
        this.load.image('smallfreighterspr', './assets/smallfreighterspr.png');
        this.load.image('speedship', './assets/speedship.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('explosion2', './assets/explosion2.png', { frameWidth: 100, frameHeight: 90, startFrame: 0, endFrame: 12});
        this.load.audio('bgm', './assets/mixkit-space-game-668.wav');
    }
    // Note: The keyword 'this' refers to the class 'Play'


    create() {
        this.bgmPlayed = false;
        this.bgmCreated = false;
        this.hasted = false;
        this.superWeaponRewarded = false;

        // Add time counters
        this.initialTime = game.settings.gameTimer;
        this.hasteCounter = 0; // Increase ships' movespeed if >= 30.
        this.superWeaponCount = 0;

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // Azure/0x3e5861 UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00BBFF).setOrigin(0, 0);

        // Grey/0x00BBFF borders 
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);

        // add Rockets for player(s) 
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 10, 'rocket2').setOrigin(0.5, 0);

        this.p2Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(490, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 5, 'speedship', 0, 30, 3).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20, 2).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10, 1).setOrigin(0, 0);
        this.ship04 = new Spaceship(this, game.config.width, borderUISize * 2 + 45, 'smallfreighterspr', 0, 100, 10).setOrigin(0, 0);
        this.ship04.moveSpeed = 10;

        // define keys
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
        this.moveText = this.add.text(230, borderUISize + borderPadding + 15, 'Move: F <- ->', redConfig);
        this.quitText = this.add.text(250, borderUISize + borderPadding + 35, 'Quit: Q', redConfig);

        // GAME OVER flag
        this.gameOver = false;

        // play clock
        this.scoreConfig.fixedWidth = 0;
        this.countdownText = this.add.text(440, borderUISize + borderPadding + 10, 'Countdown: ' + this.formatTime(this.initialTime));

        // super weapon indicator
        this.superWeaponText = this.add.text(440, borderUISize + borderPadding + 40, 'Superweapon(V): ' + this.superWeaponCount);

        // For each 1000 ms or 1 second, call onEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

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



    update() {
        // let paused = false;
        // check key input for restart / menu
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.gameOver = true;
            this.initialTime = 0;
        }

        if (this.initialTime <= 0) {
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

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if (!this.gameOver) {

            this.p1Rocket.update();             // update p1
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

    onEvent() {

        // console.log("initialTime: " + this.initialTime); // debug only
        this.update();
        if (!this.gameOver) {
            this.initialTime -= 1; // countdown 1 for one second
            this.countdownText.setText('Countdown: ' + this.formatTime(this.initialTime));
            if (this.hasted == false) {
                this.hasteCounter += 1;
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
}