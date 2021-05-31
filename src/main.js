/******************************************************
* SCUM-2D Developers:
* Leland Jin 
* Jerry Lin
* Lakery Cao
//!make sure it is in the canvaus comment as well.
*******************************************************/

let config = {
  type: Phaser.WEBGL,
  parent: "main", // name of main
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [
    Menu,
    Play,
    Credit,
    Tutorial,
    UI
  ]
};

var game = new Phaser.Game(config);


// set UI sizes
let borderUISize = game.config.height / 19;
let borderPadding = borderUISize / 3;
let borderLimitDown = borderUISize * 2.5;

let borderLimitDown_x = 9980;
let borderLimitDown_y = 5085;

let borderLimitUp_x = 9965;
let borderLimitUp_y = 1378;

let fullpage_x = 590;
let fullpage_y = 400;
// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyW, keyS, keyShift, keyL, keyC,
  keyA, keyD, keyQ, keyP, keyM, keyV, keyESC, keyTAB, keyT, keyI, key1, key3, key4;


/******************************************************
// Macros, Global Variables:
*******************************************************/
var initialTime = 0;

var restartPlay = false;
var openedInventory = false;
var openedMetabolism = false;
var openedTutorial = false;
var at_MENU_Scene = true;
var gameOver = false;

//*** Global Inventory Variables
var num_peach = 0;
var num_cherry = 0;
var num_pitaya = 0 ;
var num_watermalon = 0;
var num_canned_beef = 0;


//*** Global Player Variables
var player1;
var player1_x;
var player1_y;
var player_exhausted = false;
var player_dead = false;

var init_countdown = 600;

var stamina_lvl = 0;
var exhausted_countdown = 0;
var init_exhausted_countdown = init_countdown;
var player_stamina = 1000;

var health_lvl = 0;
var restoredhealth;
var player_hp = 100;
var healthregen = false;
var healthregenCounted = false;

var hunger_lvl = 0;
var player_hunger = 0;
var hungerCounted = false;
var player_stomach_volume = 0;
var poo = false;
var poo_countdown = init_countdown;

var thrist_lvl = 0;
var player_thrist = 0;
var thristCounted = false;
var player_bladder_volume = 0;
var pee_countdown = init_countdown;
var pee = false;

//*** Global Environment Variables
var nearRiver = false;
var leftIsWall = false;
var rightIsWall = false;
var upIsWall = false;
var downIsWall = false;

var nearChest = false;

//*** Global weapon Variables
var haveAxe = false;
//* Global Lists
var chestList = [];
var itemList = [];
var inventoryMap = new Map();

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

localStorage.setItem("Scum2DTopScore", 0);
localStorage.setItem("Scum2DBestTimeSurvived", 0);
