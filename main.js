"use strict";

/*
  main.js holds your global variables, your Phaser configuration,
  and the creation of the actual Phaser.Game instance. The rest of
  your Scenes are defined in the other JS files.
*/

// Global variables
var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };
let score = 0;
let keycountFarm = 0;
let keycountFood = 0;
let keycountIndustrial = 0;

// Phaser game config (same as original logic):
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
    // Scenes consolidated from the other files
    scene: [
        Title,
        Credits,
        Instruction,
        LoadFarm,
        Farm,
        LoadFood,
        Food,
        LoadIndustrial,
        Industrial,
        LoadBonus,
        Bonus,
        GG
    ]
};

// Create the game
let game = new Phaser.Game(config);
