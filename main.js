"use strict";

/*Created by: Xifan Luo(xluo46@ucsc.edu) and Xuan He(xhe83@ucsc.edu)
/*
  main.js holds our global variables, Phaser configuration,
  and the creation of the Phaser.Game instance.

  -------------------------------------
  MAJOR PHASER COMPONENTS USED IN GAME:
  1) Arcade Physics
     - We use `this.physics.add.sprite(...)`, collision, and overlap in Farm/Industrial Scenes.
  2) Cameras
     - For example, `this.cameras.main.startFollow(...)` tracks the player.
  3) Particle Effects
     - Jump emitter and walking smoke (e.g. `this.add.particles(...)`).
  4) Tilemaps
     - Tiled JSON maps (farm.tmj, industrial.tmj, etc.) loaded via `this.add.tilemap()`.
  5) Text Objects
     - Title text, instructions, Game Over text (e.g. `this.add.text(...)` in coreScenes).
  -------------------------------------
  assets https://wreckitralph.fandom.com/wiki/Candy_Cane_Forest
    -----https://wallpapers.com/wreck-it-ralph
    -----WallpaperCat.com
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
        LoadIndustrial,
        Industrial,
        GG
    ]
};

// Create the game
let game = new Phaser.Game(config);
