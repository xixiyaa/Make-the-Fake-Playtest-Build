"use strict";


// Global variables
var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };
let score = 0;
// We can remove keycountFood & keycountIndustrial because those levels no longer exist:
let keycountFarm = 0; 

// Phaser game config with updated scene array (no Food/Industrial):
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { x: 0, y: 0 }
        }
    },
    width: 900,
    height: 900,
    // Scenes: Title, Credits, Instruction, LoadFarm, Farm, LoadBonus, Bonus, Gameover
    scene: [
        Title,
        Credits,
        Instruction,
        LoadFarm,
        Farm,
        LoadBonus,
        //Bonus,
        GG
    ]
};

// Create the game
let game = new Phaser.Game(config);
