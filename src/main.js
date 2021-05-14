let config = {
  type: Phaser.AUTO,
  parent: "main", // name of main
  pixelArt: true,
  physics: {
    default: "matter",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [
    Menu, 
    Play
  ]
};

var game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, KeyDOWN, keyW, keyS, keyA, keyD, keyQ, keyP, keyM, keyV;

// global variables/storages
localStorage.setItem("RocketPatrolTopScore", 0);
// localStorage.setItem("RocketPatrolSettings", {});

