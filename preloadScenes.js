"use strict";

/*
  preloadScenes.js contains "loading" scenes:
  - LoadFarm
  - LoadIndustrial
  These scenes load assets, then immediately start the next gameplay scene.
*/

// -----------------------------------------------------
// LoadFarm
// -----------------------------------------------------
class LoadFarm extends Phaser.Scene {
  constructor() {
    super("loadFarmScene");
  }

  preload() {
    this.load.setPath("./assets/");
    
    // Load audio
    this.load.audio('jump2', 'jump.wav');
    this.load.audio('collect', 'impactMetal_light_003.ogg');
    this.load.audio("explode", "explode.ogg");
    this.load.audio("heart", "heart.ogg");

    // Load key
    this.load.image("key", "tile_0027.png");
    //this.load.image("wallBG", "wall.jpg");

    // Load new character images instead of atlas
    this.load.image("character_stay", "character_stay.png");
    this.load.image("character_left", "character_left.png");
    this.load.image("character_right", "character_right.png");

    this.load.image("monster_left", "monster_left.png");

    // Characters
    //this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
    this.load.atlas("monster_left", "monster_left.png");

    // Tilemaps and tilesheets
    this.load.image("tilemap_tiles_background", "tilemap-backgrounds_packed.png");
    this.load.image("tilemap_tiles_farm", "tilemap_packed_farm.png");
    this.load.image("tilemap_tiles", "tilemap_packed.png");
    this.load.image("back", "back.jpg");
    this.load.tilemapTiledJSON("farm", "farm.tmj");

    this.load.spritesheet("tilemap_sheet_background", "tilemap-backgrounds_packed.png", {
      frameWidth: 18,
      frameHeight: 18
    });
    this.load.spritesheet("tilemap_sheet_farm", "tilemap_packed_farm.png", {
      frameWidth: 18,
      frameHeight: 18
    });
    this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
      frameWidth: 18,
      frameHeight: 18
    });

    // Particle multiatlas
    this.load.multiatlas("kenny-particles", "kenny-particles.json");
  }

  create() {
    this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-1: Farm...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    // No animations are needed now since the character uses static images

    this.scene.start("farmScene");
  }
}

// -----------------------------------------------------
// LoadFood
// -----------------------------------------------------
class LoadFood extends Phaser.Scene {
  constructor() {
    super("loadFoodScene");
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.audio('jump2', 'jump.wav');
    this.load.audio("explode", "explode.ogg");
    this.load.audio("heart", "heart.ogg");

    this.load.image("tilemap_tiles_food", "tilemap_packed_food.png");
    this.load.tilemapTiledJSON("food", "food.tmj");
    this.load.spritesheet("tilemap_sheet_food", "tilemap_packed_food.png", {
      frameWidth: 18,
      frameHeight: 18
    });
  }

  create() {
    this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-2: Food...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.scene.start("foodScene");
  }
}

// -----------------------------------------------------
// LoadIndustrial
// -----------------------------------------------------
class LoadIndustrial extends Phaser.Scene {
  constructor() {
    super("loadIndustrialScene");
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.audio('jump2', 'jump.wav');
    this.load.audio("explode", "explode.ogg");
    this.load.audio("heart", "heart.ogg");


    this.load.image("tilemap_tiles_industrial", "tilemap_packed_industrial.png");
    this.load.image("back2", "back2.jpg");
    this.load.image("car", "car.png");

    this.load.tilemapTiledJSON("industrial", "industrial.tmj");
    this.load.spritesheet("tilemap_sheet_industrial", "tilemap_packed_industrial.png", {
      frameWidth: 18,
      frameHeight: 18
    });
  }

  create() {
    this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Level-3: Industrial...', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.scene.start('industrialScene');
  }
}

