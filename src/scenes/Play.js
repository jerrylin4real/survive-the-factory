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
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('mainmap', './assets/map/SCUM-MAP.png'); // Not showing the full img? Default: mainmap.png 
        this.load.image('smallfreighterspr', './assets/smallfreighterspr.png');
        this.load.image('speedship', './assets/speedship.png');
        this.load.image('player', './assets/Runner-obstacle.png'); // Placeholder file for now; FIXME!!!


        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        this.load.spritesheet('explosion2', './assets/explosion2.png', { frameWidth: 100, frameHeight: 90, startFrame: 0, endFrame: 12 });


        // load audio
        this.load.audio('bgm', './assets/sound/scumbgm.mp3');
        this.load.audio('switchsound', './assets/sound/Select.wav');

        // load atlas animation
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
        init_countdown = 600;
        init_exhausted_countdown = init_countdown; // 6 seconds cd for exhausted status penalty 
        exhausted_countdown = init_exhausted_countdown;

        // place tile sprite
        this.mainmap = this.add.tileSprite(0, 0, 9999, 9999, 'mainmap').setOrigin(0, 0);

        // Azure/0x3e5861 UI background
        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderLimitDown, 0x00BBFF).setOrigin(0, 0);

        // Add river rectange for distance check
        // new Rectangle                    (scene, x, y [, width] [, height] [, fillColor] [, fillAlpha])
        //this.riverNS1 = this.add.rectangle(1400, 2000, 200, 2100, sadBLUE);
        //this.riverEW1 = this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize,).setOrigin(0, 0);
        // this.add.rectangle(0, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);
        // this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x3e5861).setOrigin(0, 0);


        // add player at world(x, y)
        this.init_spawn_x = 7960; //!was 62
        this.init_spawn_y = 2975; //!was 1510

        this.player1 = new Player(this, this.init_spawn_x, this.init_spawn_y, 'platformer', 'stand').setScale(1); // scale the size of this.player1
        // this.player1.body.setSize(20, 55, 0) // usage: setSize(width, height, center)

        player1 = this.player1;

        //*** add camera
        // Set the camera bounds
        this.cameras.main.setBounds(0, 0, borderLimitDown_x + borderUISize * 1.9, borderLimitDown_y + borderUISize * 0.9);
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

        this.ship01 = new Spaceship(this, game.config.width + borderLimitUp_y, borderUISize * 5, 'speedship', 0, 30, 3).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20, 2).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderLimitUp_y + borderPadding * 4, 'spaceship', 0, 10, 1).setOrigin(0, 0);
        this.ship04 = new Spaceship(this, game.config.width, borderLimitDown + 45, 'smallfreighterspr', 0, 100, 10).setOrigin(0, 0);
        this.ship04.moveSpeed = 10;

        // define key control
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
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
            key: 'baoxiang2',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'baoxiang2' }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'baoxiang2',
            defaultTextureKey: 'platformer',
            frames: [
                { frame: 'baoxiang2' }
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
        // pass playerx and playery to the globle variables
        player1_x = this.player1.x;
        player1_y = this.player1.y;

        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            gameOver = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            gameOver = true;
            this.scene.start("menuScene");
        }

        // Interact button F
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            if (nearRiver) {
                // drink water!
                player_thrist -= 20;
                player_bladder_volume += 20;
            }
            //! add peach for sprint 2
            num_peach += 1;
            // if F a loot
            // randomly gerenate an item/weapon;      
        }

        // press UP to pee
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            pee = true;
        }
        // preess DOWN to poo
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            poo = true;
        }
        // Press L to show player location
        if (Phaser.Input.Keyboard.JustDown(keyL)) {
            // console.log("x:" + this.player1.x + " y:" + this.player1.y);
            console.log("x:" + player1_x + " y:" + player1_y);
        }

        // water area detection
        // river1
        if (this.player1.x >= 1300 && this.player1.x <= 1600 && this.player1.y >= 1345 && this.player1.y <= 3745) {
            console.log("near river!");
            nearRiver = true;
        } else if (this.player1.x >= 32 && this.player1.x <= 1412 && this.player1.y >= 3355 && this.player1.y <= 3745) {
            console.log("near river!");
            nearRiver = true;
        }

        // river2
        else if (this.player1.x >= 6437 && this.player1.x <= 6700 && this.player1.y >= 1345 && this.player1.y <= 3745) {
            console.log("near river!");
            nearRiver = true;
        }

        else if (this.player1.x >= 5072 && this.player1.x <= 6482 && this.player1.y >= 3415 && this.player1.y <= 3760) {
            console.log("near river!");
            nearRiver = true;
        } else {
            nearRiver = false;
        }
        //* ___________________________________________________________________________________________________________________
        //! wall detection; hard coded; if made as a seperate function it would probably not work 
        //* small building1 (Left-to-right order) Top Left coordinate (x,y) =  (100, 1579)
        this.smallBuilding1_x = 100;
        this.smallBuilding1_y = 1580;


        // * small building2 (Left-to-right order) Top Left (x,y)
        this.smallBuilding2_x = 5224;
        this.smallBuilding2_y = 1585;

        // * big building1 (Left-to-right order) Top Left (x, y)
        this.bigBuilding1_x = 2845;
        this.bigBuilding1_y = 2997;

        // * big building2  top left x = 7960 ; y = 2975
        this.bigBuilding2_x = 7960;
        this.bigBuilding2_y = 2997;

        if (this.player1.x >= this.smallBuilding1_x && this.player1.x <= this.smallBuilding1_x + 10 && ((this.player1.y >= this.smallBuilding1_y && this.player1.y <= this.smallBuilding1_y + 107) ||
            (this.player1.y >= this.smallBuilding1_y + 207 && this.player1.y <= this.smallBuilding1_y + 370) || (this.player1.y >= this.smallBuilding1_y + 400 && this.player1.y <= this.smallBuilding1_y + 557) ||
            (this.player1.y >= this.smallBuilding1_y + 656 && this.player1.y <= this.smallBuilding1_y + 806))) {
            rightIsWall = true;


        } else if ((this.player1.x >= this.smallBuilding1_x + 559 && this.player1.x <= this.smallBuilding1_x + 569) && ((this.player1.y >= this.smallBuilding1_y && this.player1.y <= this.smallBuilding1_y + 107) ||
            (this.player1.y >= this.smallBuilding1_y + 656 && this.player1.y <= this.smallBuilding1_y + 806)) || ((this.player1.x >= this.smallBuilding1_x + 214 && this.player1.x <= this.smallBuilding1_x + 224) &&
                (((this.player1.y >= this.smallBuilding1_y + 435 && this.player1.y <= this.smallBuilding1_y + 563)) || (this.player1.y >= this.smallBuilding1_y + 215 && this.player1.y <= this.smallBuilding1_y + 370)))) {
            leftIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding1_x && this.player1.x <= this.smallBuilding1_x + 559) && (
            (this.player1.y >= this.smallBuilding1_y + 807 && this.player1.y <= this.smallBuilding1_y + 817) || (this.player1.y >= this.smallBuilding1_y + 96 && this.player1.y <= this.smallBuilding1_y + 106))) {
            upIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding1_x + 46 && this.player1.x <= +230) && (
            (this.player1.y >= this.smallBuilding1_y + 535 && this.player1.y <= this.smallBuilding1_y + 645) || (this.player1.y >= this.smallBuilding1_y && this.player1.y <= this.smallBuilding1_y + 10) ||
            (this.player1.y >= this.smallBuilding1_y + 339 && this.player1.y <= this.smallBuilding1_y + 349))) {
            upIsWall = true;
        }
        else if ((this.player1.x >= this.smallBuilding1_x && this.player1.x <= this.smallBuilding1_x + 568) && ((this.player1.y >= this.smallBuilding1_y && this.player1.y <= this.smallBuilding1_y + 10) ||
            (this.player1.y >= this.smallBuilding1_y + 652 && this.player1.y <= this.smallBuilding1_y + 752))) {
            downIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding1_x + 56 && this.player1.x <= this.smallBuilding1_x + 226) && ((this.player1.y >= this.smallBuilding1_y + 223 && this.player1.y <= this.smallBuilding1_y + 233) ||
            (this.player1.y >= this.smallBuilding1_y + 400 && this.player1.y <= this.smallBuilding1_y + 410))) {
            downIsWall = true;
        }

        // * small building2    
        else if (this.player1.x >= this.smallBuilding2_x && this.player1.x <= this.smallBuilding2_x + 10 && ((this.player1.y >= this.smallBuilding2_y && this.player1.y <= this.smallBuilding2_y + 107) ||
            (this.player1.y >= this.smallBuilding2_y + 207 && this.player1.y <= this.smallBuilding2_y + 370) || (this.player1.y >= this.smallBuilding2_y + 400 && this.player1.y <= this.smallBuilding2_y + 557) ||
            (this.player1.y >= this.smallBuilding2_y + 656 && this.player1.y <= this.smallBuilding2_y + 806))) {
            rightIsWall = true;


        } else if ((this.player1.x >= this.smallBuilding2_x + 559 && this.player1.x <= this.smallBuilding2_x + 569) && ((this.player1.y >= this.smallBuilding2_y && this.player1.y <= this.smallBuilding2_y + 107) ||
            (this.player1.y >= this.smallBuilding2_y + 656 && this.player1.y <= this.smallBuilding2_y + 806)) || ((this.player1.x >= this.smallBuilding2_x + 214 && this.player1.x <= this.smallBuilding2_x + 224) &&
                (((this.player1.y >= this.smallBuilding2_y + 435 && this.player1.y <= this.smallBuilding2_y + 563)) || (this.player1.y >= this.smallBuilding2_y + 215 && this.player1.y <= this.smallBuilding2_y + 370)))) {
            leftIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding2_x && this.player1.x <= this.smallBuilding2_x + 559) && (
            (this.player1.y >= this.smallBuilding2_y + 807 && this.player1.y <= this.smallBuilding2_y + 817) || (this.player1.y >= this.smallBuilding2_y + 96 && this.player1.y <= this.smallBuilding2_y + 106))) {
            upIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding2_x + 46 && this.player1.x <= +230) && (
            (this.player1.y >= this.smallBuilding2_y + 535 && this.player1.y <= this.smallBuilding2_y + 645) || (this.player1.y >= this.smallBuilding2_y && this.player1.y <= this.smallBuilding2_y + 10) ||
            (this.player1.y >= this.smallBuilding2_y + 339 && this.player1.y <= this.smallBuilding2_y + 349))) {
            upIsWall = true;
        }
        else if ((this.player1.x >= this.smallBuilding2_x && this.player1.x <= this.smallBuilding2_x + 568) && ((this.player1.y >= this.smallBuilding2_y && this.player1.y <= this.smallBuilding2_y + 10) ||
            (this.player1.y >= this.smallBuilding2_y + 652 && this.player1.y <= this.smallBuilding2_y + 752))) {
            downIsWall = true;
        }

        else if ((this.player1.x >= this.smallBuilding2_x + 56 && this.player1.x <= this.smallBuilding2_x + 226) && ((this.player1.y >= this.smallBuilding2_y + 223 && this.player1.y <= this.smallBuilding2_y + 233) ||
            (this.player1.y >= this.smallBuilding2_y + 400 && this.player1.y <= this.smallBuilding2_y + 410))) {
            downIsWall = true;
        }
        // * big building1  top left x = 2845; y = 2997;
        // right is wall (this.bigBuilding1_x, this.bigBuilding1_y)  top left x = 2845; y = 2997;
        // lowerleft 2845, 4655 

        // top right 4888, 3104; lower right 4888, 4205 
        // mid right 4173,4224; mid left 4180 4637
        // default conditions
        else if ((this.player1.x >= this.bigBuilding1_x && this.player1.x <= this.bigBuilding1_x + 10 && ((this.player1.y >= this.bigBuilding1_y && this.player1.y <= this.bigBuilding1_y + 1658)) ||
            ((this.player1.x >= this.bigBuilding1_x && this.player1.x <= this.bigBuilding1_x + 10) && (this.player1.y >= this.bigBuilding1_y + 107 && this.player1.y <= this.bigBuilding1_y + 1203)) ||
            (this.player1.x >= this.bigBuilding1_x + 2043 && this.player1.x <= this.bigBuilding1_x + 2053 && ((this.player1.y >= this.bigBuilding1_y + 107 && this.player1.y <= this.bigBuilding1_y + 1208)))
        ) || (this.player1.x >= this.bigBuilding1_x + 1328 && this.player1.x <= this.bigBuilding1_x + 1428 && (this.player1.y >= this.bigBuilding1_y + 1227 && this.player1.y <= this.bigBuilding1_y + 1640))) {
            rightIsWall = true;
        }
        // left is wall (this.bigBuilding1_x, this.bigBuilding1_y) top left x = 2925; y: from 3100 to 4195;
        // mid left x:3692 [y:4198, 4652]
        // top right x:3693 [y:2968 to 4652]
        else if ((this.player1.x >= this.bigBuilding1_x + 80 && this.player1.x <= this.bigBuilding1_x + 90 && ((this.player1.y >= this.bigBuilding1_y + 95 && this.player1.y <= this.bigBuilding1_y + 1193)) ||
            ((this.player1.x >= this.bigBuilding1_x + 847 && this.player1.x <= this.bigBuilding1_x + 857) && (this.player1.y >= this.bigBuilding1_y + 1201 && this.player1.y <= this.bigBuilding1_y + 1660)) ||
            (this.player1.x >= this.bigBuilding1_x + 2040 && this.player1.x <= this.bigBuilding1_x + 2045 && ((this.player1.y >= this.bigBuilding1_y + 95 && this.player1.y <= this.bigBuilding1_y + 1220)))
        ) || (this.player1.x >= this.bigBuilding1_x + 2123 && this.player1.x <= this.bigBuilding1_x + 2127 && (this.player1.y >= this.bigBuilding1_y && this.player1.y <= this.bigBuilding1_y + 1655))) {
            leftIsWall = true;
        }

        // up is wall (this.bigBuilding1_x, this.bigBuilding1_y) : [x: 2931 to 4886, y:3106]
        // lower x:[2863 to 3675 and 4200 to 4950 ]y : 4709 or 4661
        else if ((this.player1.x >= this.bigBuilding1_x + 75 && this.player1.x <= this.bigBuilding1_x + 2041 && ((this.player1.y >= this.bigBuilding1_y + 111 && this.player1.y <= this.bigBuilding1_y + 115)) ||
            ((this.player1.x >= this.bigBuilding1_x + 18 && this.player1.x <= this.bigBuilding1_x + 830) && (this.player1.y >= this.bigBuilding1_y + 1664 && this.player1.y <= this.bigBuilding1_y + 1670)) ||
            (this.player1.x >= this.bigBuilding1_x + 1350 && this.player1.x <= this.bigBuilding1_x + 2105 && ((this.player1.y >= this.bigBuilding1_y + 1664 && this.player1.y <= this.bigBuilding1_y + 1670)))
        )) {
            upIsWall = true;
        }

        // down is wall (this.bigBuilding1_x, this.bigBuilding1_y) : [x: 2866 to 4955, y:2975]
        // lower x:[x: 2920 to 3670 and 4206 to 4890, y:4193]
        else if ((this.player1.x >= this.bigBuilding1_x + 15 && this.player1.x <= this.bigBuilding1_x + 2110 && ((this.player1.y >= this.bigBuilding1_y - 18 && this.player1.y <= this.bigBuilding1_y)) ||
            ((this.player1.x >= this.bigBuilding1_x + 75 && this.player1.x <= this.bigBuilding1_x + 821) && (this.player1.y >= this.bigBuilding1_y + 1192 && this.player1.y <= this.bigBuilding1_y + 1200)) ||
            (this.player1.x >= this.bigBuilding1_x + 1361 && this.player1.x <= this.bigBuilding1_x + 2050 && ((this.player1.y >= this.bigBuilding1_y + 1192 && this.player1.y <= this.bigBuilding1_y + 1200)))
        )) {
            downIsWall = true;
        }

        // * big building2  top left x = 7960 ; y = 2975; // altered from building2
        else if ((this.player1.x >= this.bigBuilding2_x && this.player1.x <= this.bigBuilding2_x + 10 && ((this.player1.y >= this.bigBuilding2_y && this.player1.y <= this.bigBuilding2_y + 1658)) ||
            ((this.player1.x >= this.bigBuilding2_x && this.player1.x <= this.bigBuilding2_x + 10) && (this.player1.y >= this.bigBuilding2_y + 107 && this.player1.y <= this.bigBuilding2_y + 1203)) ||
            (this.player1.x >= this.bigBuilding2_x + 2043 && this.player1.x <= this.bigBuilding2_x + 2053 && ((this.player1.y >= this.bigBuilding2_y + 107 && this.player1.y <= this.bigBuilding2_y + 1208)))
        ) || (this.player1.x >= this.bigBuilding2_x + 1328 && this.player1.x <= this.bigBuilding2_x + 1428 && (this.player1.y >= this.bigBuilding2_y + 1227 && this.player1.y <= this.bigBuilding2_y + 1640))) {
            rightIsWall = true;
        }
        // left is wall (this.bigBuilding2_x, this.bigBuilding2_y)
        else if ((this.player1.x >= this.bigBuilding2_x + 75 && this.player1.x <= this.bigBuilding2_x + 90 && ((this.player1.y >= this.bigBuilding2_y + 95 && this.player1.y <= this.bigBuilding2_y + 1193)) ||
            ((this.player1.x >= this.bigBuilding2_x + 847 && this.player1.x <= this.bigBuilding2_x + 857) && (this.player1.y >= this.bigBuilding2_y + 1201 && this.player1.y <= this.bigBuilding2_y + 1660)) ||
            (this.player1.x >= this.bigBuilding2_x + 2040 && this.player1.x <= this.bigBuilding2_x + 2045 && ((this.player1.y >= this.bigBuilding2_y + 95 && this.player1.y <= this.bigBuilding2_y + 1220)))
        ) || (this.player1.x >= this.bigBuilding2_x + 2123 && this.player1.x <= this.bigBuilding2_x + 2127 && (this.player1.y >= this.bigBuilding2_y && this.player1.y <= this.bigBuilding2_y + 1655))) {
            leftIsWall = true;
        }

        // up is wall (this.bigBuilding2_x, this.bigBuilding2_y) : [x: 2931 to 4886, y:3106]
        // lower x:[2863 to 3675 and 4200 to 4950 ]y : 4709 or 4661
        else if ((this.player1.x >= this.bigBuilding2_x + 80 && this.player1.x <= this.bigBuilding2_x + 2041 && ((this.player1.y >= this.bigBuilding2_y + 111 && this.player1.y <= this.bigBuilding2_y + 115)) ||
            ((this.player1.x >= this.bigBuilding2_x + 18 && this.player1.x <= this.bigBuilding2_x + 830) && (this.player1.y >= this.bigBuilding2_y + 1664 && this.player1.y <= this.bigBuilding2_y + 1670)) ||
            (this.player1.x >= this.bigBuilding2_x + 1350 && this.player1.x <= this.bigBuilding2_x + 2105 && ((this.player1.y >= this.bigBuilding2_y + 1664 && this.player1.y <= this.bigBuilding2_y + 1670)))
        )) {
            upIsWall = true;
        }

        // down is wall (this.bigBuilding2_x, this.bigBuilding2_y) : [x: 2866 to 4955, y:2975]
        // lower x:[x: 2920 to 3670 and 4206 to 4890, y:4193]
        else if ((this.player1.x >= this.bigBuilding2_x + 15 && this.player1.x <= this.bigBuilding2_x + 2110 && ((this.player1.y >= this.bigBuilding2_y - 18 && this.player1.y <= this.bigBuilding2_y)) ||
            ((this.player1.x >= this.bigBuilding2_x + 75 && this.player1.x <= this.bigBuilding2_x + 821) && (this.player1.y >= this.bigBuilding2_y + 1192 && this.player1.y <= this.bigBuilding2_y + 1200)) ||
            (this.player1.x >= this.bigBuilding2_x + 1361 && this.player1.x <= this.bigBuilding2_x + 2050 && ((this.player1.y >= this.bigBuilding2_y + 1192 && this.player1.y <= this.bigBuilding2_y + 1200)))
        )) {
            downIsWall = true;
        }


        else {
            // Reset all direction booleans
            upIsWall = false;
            downIsWall = false;
            leftIsWall = false;
            rightIsWall = false;
        }
        //* -----------------------------------------------------------------------------------------------------------------

        //* Player stat detection
        if (player_exhausted) {
            if (exhausted_countdown > 0) {
                exhausted_countdown -= 1;
                player_exhausted = true;

            } else {
                exhausted_countdown = init_exhausted_countdown;
                player_stamina = 1; // to get out of infinate loop
                player_exhausted = false;
            }
        } else if (pee) {
            if (pee_countdown > 0) {
                pee_countdown -= 1;
                pee = true;

            } else {
                pee_countdown = init_countdown;
                if (player_bladder_volume >= 100) { // full bladder penalty
                    player_hp -= 10;
                }
                player_bladder_volume = 0; // empty bladder
                pee = false;
            }

        } else if (poo) {
            if (poo_countdown > 0) {
                poo_countdown -= 1;
                poo = true;

            } else {
                poo_countdown = init_countdown;
                if (player_stomach_volume >= 100) { // full stomach penalty
                    player_hp -= 10;
                }
                player_stomach_volume = 0; // empty stomach; well it is a compomise

                poo = false;
            }
        }
        else if (!gameOver) {
            // not exhausted 
            //***  player movement control:W S A D
            // is Down = keep pressed down
            if (keyA.isDown && this.player1.x >= borderUISize && !leftIsWall) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.x -= this.player1.runspeed;
                    this.player1.anims.play('walkleft').scaleX = 1; //! Note: use scaleX to flip animation
                    // running loses more stamina
                    player_stamina -= 2;
                } else {
                    this.player1.x -= this.player1.walkspeed;
                    this.player1.anims.play('walkleft').scaleX = 1;
                    player_stamina -= 1;
                }

            } else if (keyD.isDown && this.player1.x < borderLimitUp_x && !rightIsWall) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.x += this.player1.runspeed;
                    this.player1.anims.play('walkright').scaleX = -1;
                    // running loses more stamina
                    player_stamina -= 2;
                } else {
                    this.player1.x += this.player1.walkspeed;
                    this.player1.anims.play('walkright').scaleX = -1;
                    player_stamina -= 1;
                }
            }
            if (keyW.isDown && this.player1.y >= borderLimitUp_y && !upIsWall) {
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.y -= this.player1.runspeed;
                    //this.player1.anims.play('go-up');
                    // running loses more stamina
                    player_stamina -= 2;
                } else {
                    this.player1.y -= this.player1.walkspeed;
                    //this.player1.anims.play('go-up');
                    player_stamina -= 1;
                }
            } else if (keyS.isDown && this.player1.y <= borderLimitDown_y - 2 && !downIsWall) { // 2 is the offset
                if (keyShift.isDown) {
                    // speed up if boost
                    this.player1.y += this.player1.runspeed;
                    //this.player1.anims.play('go-down');
                    // running loses more stamina
                    player_stamina -= 2;
                } else {
                    this.player1.y += this.player1.walkspeed;
                    //.player1.anims.play('go-down');
                    player_stamina -= 1;
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

        this.mainmap.tilePositionX -= 0;  // update tile sprite

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

    checkInteractionInBound(player, item) { //!fix me 
        this.interactionRange = 200;
        this.distance = Phaser.Math.Between(player.x, player.y, item.x, item.y);
        if (this.distance <= this.interactionRange) {
            console.log("Interaction in range");
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

        // let soundFXLib = [
        //     'sfx_explosion_spell',
        //     'sfx_explosion_sea-mine',
        //     'sfx_explosion_shot-light',
        //     'sfx_explosion_crash'
        // ];
        // let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        // this.explosionFX = this.sound.add(soundFXLib[random4SoundFX], { volume: 0.1 });
        // this.explosionFX.play();
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
}

