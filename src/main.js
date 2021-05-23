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
    Play,
    UI
  ]
};

var game = new Phaser.Game(config);


// set UI sizes
let borderUISize = game.config.height / 17;
let borderPadding = borderUISize / 3;
let borderLimitDown = borderUISize * 2.5;
let borderLimitUp = borderUISize * 6;
// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, KeyDOWN, keyW, keyS,
  keyA, keyD, keyQ, keyP, keyM, keyV, keyESC, keyTAB, keyT, keyI, key1, key3, key4;


/******************************************************
// Macros, global variables:
*******************************************************/
var restartPlay = false;
var openedInventory = false;
var openedMetabolism = false;
var openedTutorial = false;
var gameOver = false;

// Define colors 
var BROWN = 0x664C47;
var sadBLUE = 0x194376;

var textConfig = {
  fontFamily: 'Courier',
  fontSize: '15px',
  //backgroundColor: '#000000',
  color: '#843605', // color hex code: black
  align: 'left',
  padding: {  // set the size of the display box
    top: 5,
    bottom: 5,
  },
  fixedWidth: 100
}
/*
var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
var ROTATION_SPEED = 1 * Math.PI; // 0.5 arc per sec, 2 sec per arc
var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
var TOLERANCE = 0.02 * ROTATION_SPEED;
*/
localStorage.setItem("Scum2DTopScore", 0);
localStorage.setItem("Scum2DBestTimeSurvived", 0);


