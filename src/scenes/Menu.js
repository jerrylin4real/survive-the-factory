class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio

    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion0', './assets/explosion38.wav');
    this.load.audio('sfx_explosion_spell', './assets/mixkit-explosion-spell-1685.wav');
    this.load.audio('sfx_explosion_sea-mine', './assets/mixkit-sea-mine-explosion-1184.wav');
    this.load.audio('sfx_explosion_shot-light', './assets/mixkit-shot-light-explosion-1682.wav');
    this.load.audio('sfx_explosion_crash', './assets/mixkit-truck-crash-with-explosion-1616.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
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

    // show menu text
    this.add.text(game.config.width / 2, game.config.height / 2 - borderUISize - borderPadding, 'ROCKET PATROL?!', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width / 2, game.config.height / 2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
    menuConfig.backgroundColor = '#00FF00';
    menuConfig.color = '#000';
    this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      // Novice mode
      game.settings = {
        spaceshipSpeed: 3,
        gameTimer: 60 // 60 second
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      // Expert mode
      game.settings = {
        spaceshipSpeed: 4,
        gameTimer: 45
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyUP)) {
      // Quick Test mode
      game.settings = { // a list of settings
        spaceshipSpeed: 5,
        gameTimer: 3
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }

    if (Phaser.Input.Keyboard.JustDown(keyM)) {
      // Simultaneous two-player mode
      game.settings = {
        spaceshipSpeed: 5,
        gameTimer: 120
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");
    }

  }
}