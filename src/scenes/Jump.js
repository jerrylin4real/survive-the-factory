// A play scene with jump implemented
class Jump extends Phaser.Scene {
    constructor() {
        super('jumpScene');
        this.guiGenerated = false;
    }

    preload() {
        // set load path
        this.load.image('backgroundIMG', './assets/background.png');
        this.load.image('ground', './assets/ground.png');
        this.load.audio('bgm', './assets/bgm1.m4a');
        this.load.audio('selectsound', './assets/switchsound.wav'); // can replace with Select.wav
        this.load.audio('jumpsound', './assets/jumpsound.wav');
        this.load.audio('pickupcoin', './assets/Pickup_Coin.wav');


        this.load.path = './assets/';
        this.load.atlas('platformer', 'spritesheet.png', 'spritesheet.json');
    }

    create() {
        // variables and settings

        this.ACCELERATION = 1500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 3; // change for double/triple/etc. jumps 🤾‍♀
        this.JUMP_VELOCITY = -700;
        this.Y_GRAVITY = 2600;
        //this.characterDead = false;
        this.groundY = 420;
        this.bgmPlayed = false;
        this.bgmCreated = false;
        this.gameOver = false;
        this.WORLD_COLLIDE = true;
        this.physicsDebug = true;

        this.initialTime = 0;

        this.BGcolor = '#223344';

        // setup dat.gui for Game Devs
        if (this.guiGenerated == true) { // change true to false to enable gui
            this.gui = new dat.GUI();
            let playerFolder = this.gui.addFolder('Player Parameters');
            playerFolder.add(this, 'ACCELERATION', 0, 2500).step(50);
            playerFolder.add(this, 'DRAG', 0, 2000).step(50);
            playerFolder.add(this, 'JUMP_VELOCITY', -2000, 0).step(50);
            playerFolder.add(this, 'MAX_JUMPS', 1, 5).step(1);
            playerFolder.open();

            let settingsFolder = this.gui.addFolder('Settings');
            settingsFolder.add(this, 'Y_GRAVITY', 0, 5000).step(50);
            settingsFolder.addColor(this, 'BGcolor');
            settingsFolder.add(this, 'WORLD_COLLIDE');
            this.guiGenerated = true; // prevent multiple gui on screen
        }

        // place tile sprite
        this.backgroundIMG = this.add.tileSprite(0, 0, 1338, 525, 'backgroundIMG').setOrigin(0, 0);

        // set bg color
        //this.cameras.main.setBackgroundColor(this.BGcolor);

        // draw grid lines for jump height reference
        /*
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
        for (let y = game.config.height - 70; y >= 35; y -= 35) {
            graphics.lineBetween(0, y, game.config.width, y);
        } 
        */

        // For each 1000 ms or 1 second, call updateTime
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });

        // add 3 initial drivers
        this.driver01 = this.physics.add.sprite(this.randint(700, game.config.width - tileSize), this.randint(200, 300), 'platformer', 'enemy');
        this.driver01.body.setAllowGravity(false).setVelocityX(-1 * this.randint(100, 200));
        this.driver02 = this.physics.add.sprite(this.randint(700, game.config.width - tileSize), this.randint(300, 400), 'platformer', 'enemy');
        this.driver02.body.setAllowGravity(false).setVelocityX(-1 * this.randint(200, 300));
        this.driver03 = this.physics.add.sprite(this.randint(720, game.config.width - tileSize), this.randint(400, 500), 'platformer', 'enemy');
        this.driver03.body.setAllowGravity(false).setVelocityX(-1 * this.randint(250, 320));

        this.coin = this.physics.add.sprite(this.randint(tileSize, 400), this.randint(tileSize, 400), 'platformer', 'money');
        this.coin.body.setAllowGravity(false).setVelocityX(-1 * Math.floor(Math.random() * 600));
        this.coin.coinCount = 0;
        this.coin.toplay_pickupcoin = false;


        // message text
        this.add.text(game.config.width / 2, 30, `Control: Cursor  ←↑→  (M)enu; (R)estart`, { font: '16px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        this.besttimeText = this.add.text(290, borderUISize + borderPadding + 10, 'Best Time: ' + this.formatTime(localStorage.getItem("NeonRunnerBestTime")));
        this.coinText = this.add.text(200, borderUISize + borderPadding + 10, 'Coin: ' + this.coin.coinCount);
        this.timeText = this.add.text(460, borderUISize + borderPadding + 10, 'Cur_Time: ' + this.formatTime(this.initialTime));

        /* make ground tiles group

        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        
        //this.ground.body.setAllowGravity(false).setVelocityX(-30);

         // hovering ground
        for (let i = tileSize * 2; i < game.config.width - tileSize * 2; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize * 9, 'ground').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        */

        // set up character
        this.character = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'platformer', 'stand').setScale(SCALE * 2);
        this.character.dead = false;
        this.character.setCollideWorldBounds(this.WORLD_COLLIDE);
        this.character.body.setSize(20, 55, 0) // usage: setSize(width, height, center); set the size of the hitbox

        this.character.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        // create animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'walk',
                start: 1,
                end: 6,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'jump' }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'stand',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'stand',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });

        this.anims.create({
            key: 'dead',
            defaultTextureKey: 'platformer',
            frames: this.anims.generateFrameNames('platformer', {
                prefix: 'dead',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // add physics colliders
        //this.physics.add.collider(this.character, this.ground);
        this.physics.add.collider(this.character, this.driver01, function crashdriver03(character, driver) {
            if (!this.gameOver) { // if game is not over
                character.dead = true;
                console.log("character collides with driver01");
                //coin.setActive(false).setVisible(false); // alternative to destory
                driver.destroy();
            }
        });
        this.physics.add.collider(this.character, this.driver02, function crashdriver03(character, driver) {
            if (!this.gameOver) { // if game is not over
                character.dead = true;
                console.log("character collides with deriver02");
                //coin.setActive(false).setVisible(false); // alternative to destory
                driver.destroy();
            }
        });
        this.physics.add.collider(this.character, this.driver03, function crashdriver03(character, driver) {
            if (!this.gameOver) { // if game is not over
                character.dead = true;
                console.log("character collides with driver03");
                //coin.setActive(false).setVisible(false); // alternative to destory
                driver.destroy();
            }
        });

        this.physics.add.collider(this.character, this.coin, function crashcoin(character, coin) {
            if (!this.gameOver) { // if game is not over
                coin.coinCount += 1;
                coin.toplay_pickupcoin = true;
                console.log("character collides with coin " + coin.coinCount);
                //coin.setActive(false).setVisible(false); // alternative to destory
                coin.destroy();
            }
        });



        // Define keys 
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);


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
        // allow dat.gui updates on some parameters
        this.physics.world.gravity.y = this.Y_GRAVITY;
        this.cameras.main.setBackgroundColor(this.BGcolor);
        //this.character.setCollideWorldBounds(this.WORLD_COLLIDE);

        // check keyboard input ...
        // press R to restart the game

        if (this.character.dead) {
            this.character.anims.play('dead');
            this.MAX_JUMPS = 0; // dead man no jumps
            this.gameOver = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            console.log("game restarted");
            this.pauseBGM();
            this.sound.play('selectsound');
            //this.initialTime = 0;
            this.scene.restart();
        }

        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.pauseBGM();
            console.log("Loaded Menu Scene");
            this.sound.play('selectsound');
            this.scene.start("menuScene");
        }


        if (!this.character.dead && cursors.left.isDown) {
            this.character.body.setAccelerationX(-this.ACCELERATION);
            this.character.setFlip(true, false);
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.character.anims.play('walk', true);
        } else if (!this.character.dead && cursors.right.isDown) {
            this.character.body.setAccelerationX(this.ACCELERATION);
            this.character.resetFlip();
            this.character.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.character.body.setAccelerationX(0);
            this.character.body.setDragX(this.DRAG);
            if (this.character.dead) {
                this.character.anims.play('dead');
            } else {
                this.character.anims.play('stand');
            }
        }

        //this.checkCollision(this.character, this.coin);

        if (this.character.dead) {
            this.character.anims.play('dead');
        }
        // check if character is grounded
        if (this.character.body.y >= this.groundY) {
            this.character.isGrounded = true;
        } else {
            this.character.isGrounded = false;
        }
        //console.log("character y"+ this.character.body.y)
        // if so, we have jumps to spare 
        if (this.character.isGrounded && !this.character.dead) {
            this.jumps = this.MAX_JUMPS; // refresh jumps
            this.jumping = false;
        } else if (this.character.dead) {
            this.jumps = 0;
        } else {
            this.character.anims.play('jump');
        }
        // allow steady velocity change up to a certain key down duration
        if (this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
            this.character.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
            this.sound.play('jumpsound');
        }
        // finally, letting go of the UP key subtracts a jump
        if (this.jumping && Phaser.Input.Keyboard.UpDuration(cursors.up)) {
            this.jumps--;
            this.jumping = false;
        }

        if (this.coin.toplay_pickupcoin) {
            this.sound.play('pickupcoin');
            this.coin.toplay_pickupcoin = false; // stop if played
        }


        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.driver01, this.driver01.width / 2);
        this.physics.world.wrap(this.driver02, this.driver02.width / 2);
        this.physics.world.wrap(this.driver03, this.driver03.width / 2);
        this.physics.world.wrap(this.coin, this.coin.width / 2);
        this.backgroundIMG.tilePositionX += 3;  // update tile sprite

        //console.log("gameOver: " + this.gameOver);

    }

    /* When the character crashes a driver
    crashedDriver(character, driver) {
        if (!this.gameOver) { // if game is not over
            if (driver = this.coin) {
                this.sound.play('pickupcoin');
    
            }
            console.log(character + "collides " + driver);
            this.character.dead = true; // player character is dead
            driver.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                driver.destroy();
            });
    
    
    
            this.gameOver = true; // or life --
        }
    }
    */
    pauseBGM(bgm) {
        if (this.bgmCreated) {
            this.bgm.pause()
            this.bgmPlayed = false;
            console.log("Paused BGM");
        }
        return;
    }

    randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    updateTime() {
        if (!this.gameOver) {
            this.update();
            this.initialTime += 1;
            // console.log("initialTime: " + this.initialTime); // debug time 
            this.timeText.setText('Cur_Time: ' + this.formatTime(this.initialTime));
            this.coinText.setText("Coin: " + this.coin.coinCount);
        } else {
            // game is over
            if (this.initialTime > localStorage.getItem("NeonRunnerBestTime")) {
                localStorage.setItem("NeonRunnerBestTime", this.initialTime);
                this.besttimeText.setText('Best Time: ' + this.formatTime(localStorage.getItem("NeonRunnerBestTime")));
            }
            this.add.text(game.config.width / 2, game.config.height / 2, `Game Over!`, { font: '32px Futura', fill: 'white' }).setOrigin(0.5);

            // reinitialize time and restart game
        }

        return;
    }
}
/*
    checkCollision(character, driver) { // trynna make this a class
        // simple AABB checking
        if (character.body.x < driver.body.x + driver.body.width &&
            character.body.x + character.body.width > driver.body.x &&
            character.body.y < driver.body.y + driver.body.height &&
            character.body.height + character.body.y > driver.body.y) {

            console.log(character + "collides " + driver);
            if (driver == this.coin) {
                this.sound.play('pickupcoin');
            }
        }
    }

*/

/*Reference:
    https://ansimuz.itch.io/phaser-3-tutorial-part-9-collisions
*/
