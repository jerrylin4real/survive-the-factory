class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    this.load.audio('switchsound', './assets/sound/Select.wav');

    // load img
    this.load.image('MENU_img', './assets/page_imgs/menu.png');
  }

  create() {
    at_MENU_Scene = true;
    gameOver = true;

    // show menu img
    this.menu_img = this.add.image(fullpage_x, fullpage_y, 'MENU_img');

    // menu text configuration //! legacy code are commented out and replaced by menu_img 
    // let menuConfig = {
    //   fontFamily: 'Courier',
    //   fontSize: '28px',
    //   backgroundColor: '#F3B141',
    //   color: '#843605',
    //   align: 'right',
    //   padding: {
    //     top: 5,
    //     bottom: 5,
    //   },
    //   fixedWidth: 0
    // }

    // show menu text 
    // this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'SCUM-2D', menuConfig).setOrigin(0.5);
    // this.tutorialText = this.add.text(game.config.width / 2, game.config.height / 2, 'Use WSAD to move and mouse to interact\nPress TAB or 1 for inventory\nPress T for Tutorial \
    // press M or 3 for metabolism UI\nPress Shift to sprint\nPress Q end game\nPress ESC to MENU\nPress F to get item').setOrigin(0.5);
    // menuConfig.backgroundColor = '#00FF00';
    // menuConfig.color = '#000';
    // this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Press p to play', menuConfig).setOrigin(0.5);


    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyP)) {
      at_MENU_Scene = true;
      this.sound.play('switchsound');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyC)) {
      console.log("Loaded Credit Scene");
      this.sound.play('switchsound');
      this.scene.start("creditScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyT)) {
      console.log("Loaded Tutorial Scene");
      this.sound.play('switchsound');
      this.scene.start("tutorialScene");

    }
  }
}
