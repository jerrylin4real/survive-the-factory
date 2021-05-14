let config = {
  type: Phaser.WEBGL,
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
var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
var ROTATION_SPEED = 1 * Math.PI; // 0.5 arc per sec, 2 sec per arc
var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
var TOLERANCE = 0.02 * ROTATION_SPEED;
localStorage.setItem("RocketPatrolTopScore", 0);
// localStorage.setItem("RocketPatrolSettings", {});

