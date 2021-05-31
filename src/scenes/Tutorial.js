class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload() {

        // load image
        this.load.image('Tutorial_Page', './assets/page_imgs/TUTORIAL.png');

        // load audio
        this.load.audio('switchsound', './assets/switchsound.wav');

    }

    create() {
        // Define keys 
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        this.add.image(fullpage_x, fullpage_y, 'Tutorial_Page');

    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyM) || Phaser.Input.Keyboard.JustDown(keyT)) {
            console.log("Loaded Menu Scene");
            this.sound.play('switchsound');
            this.scene.start("menuScene");
        }
    }
}