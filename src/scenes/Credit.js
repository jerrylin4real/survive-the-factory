class Credit extends Phaser.Scene {
  constructor() {
    super("creditScene");
  }

  preload() {

    // load image
    this.load.image('creditPage', './assets/page_imgs/credit.png');

    // load audio
    this.load.audio('switchsound', './assets/switchsound.wav');

  }

  create() {
    // Define keys 
    keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.add.image(fullpage_x, fullpage_y, 'creditPage');

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(keyM) || Phaser.Input.Keyboard.JustDown(keyC)) {
      console.log("Loaded Menu Scene");
      this.sound.play('switchsound');
      this.scene.start("menuScene");
    }
  }
}