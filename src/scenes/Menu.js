class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    this.load.audio('switchsound', './assets/sound/Select.wav');

    // load img
    this.load.image('MENU_img', './assets/page_imgs/menu.png');
    this.load.image('nebulatest', './assets/nebulaRed2.png');
    //!this.load.image('Tutorial_img', './assets/page_imgs/xxx');

  }

  create() {
    // menu text configuration
    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }
    at_MENU_Scene = true;
    gameOver = true;


    // show menu text
    this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'SCUM-2D', menuConfig).setOrigin(0.5);
    this.tutorialText = this.add.text(game.config.width / 2, game.config.height / 2, 'Use WSAD to move and mouse to interact\nPress TAB or 1 for inventory\nPress T for Tutorial \
    press M or 3 for metabolism UI\nPress Shift to sprint\nPress Q end game\nPress ESC to MENU\nPress F to get item').setOrigin(0.5);
    menuConfig.backgroundColor = '#00FF00';
    menuConfig.color = '#000';
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Press p to play', menuConfig).setOrigin(0.5);

    // show menu img
    this.menu_img = this.add.image(0, 0, 'MENU_img').setOrigin(0, 0);


    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      // // Novice mode
      // game.settings = {
      //   spaceshipSpeed: 3,
      //   gameTimer: 0 // 0 second
      // }
      // at_MENU_Scene = false;

      // this.sound.play('switchsound');
      // this.scene.start("playScene");
    }
    if (Phaser.Input.Keyboard.JustDown(keyP)) {
      // Expert mode
      game.settings = {
        spaceshipSpeed: 4,
        gameTimer: 0
      }
      at_MENU_Scene = true;
      this.sound.play('switchsound');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyUP)) {
      // // Quick Test mode
      // game.settings = { // a list of settings
      //   spaceshipSpeed: 5,
      //   gameTimer: 0
      // }
      // this.sound.play('sfx_select');
      // this.scene.start("playScene");
    }

  }
}