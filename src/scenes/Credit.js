class Credit extends Phaser.Scene {
  constructor() {
    super("creditScene");
  }

  preload() {

    // load image
    this.load.image('creditPage', './assets/Credit.png');

    // load audio
    this.load.audio('switchsound', './assets/switchsound.wav');

  }

  create() {
    // Define keys 
    keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.add.image(410, 310, 'creditPage');

  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(keyM)) {
      console.log("Loaded Menu Scene");
      this.sound.play('switchsound');
      this.scene.start("menuScene");
    }
  }
}