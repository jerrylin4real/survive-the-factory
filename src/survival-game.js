import MatterPhysics from "./scenes/MatterPhysics";

let config = {
    type: Phaser.AUTO,
    parent: "survivial-game",
    backgroundColor: '#333333',
    pixelArt: true,
    scene: [
        MatterPhysics
    ],
    scale: {
        zoom: 2,
    },
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: { y: 0 }
        }
    },

    plugins: {
        scene: [
            {
                plugin:PhaserMatterCollisionPlugin,
                key:'matterCollision',
                mapping:'matterCollision'
            }
        ]
    }
};

new Phaser.Game(config);