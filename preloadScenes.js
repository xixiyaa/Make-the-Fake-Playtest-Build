"use strict";

/*
  preloadScenes.js contains your "loading" scenes:
  - LoadFarm
  - LoadFood
  - LoadIndustrial
  - LoadBonus

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
    this.load.audio('jump2', 'Jump2.ogg');
    this.load.audio('collect', 'impactMetal_light_003.ogg');
    this.load.audio("explode", "explode.ogg");
    this.load.audio("heart", "heart.ogg");

    // Load key
    this.load.image("key", "tile_0027.png");

    // Characters
    this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

    // Tilemaps
    this.load.image("tilemap_tiles_background", "tilemap-backgrounds_packed.png");
    this.load.image("tilemap_tiles_farm", "tilemap_packed_farm.png");
    this.load.image("tilemap_tiles", "tilemap_packed.png");
    
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

    // Animations (walk, idle, jump)
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('platformer_characters', {
        prefix: "tile_",
        start: 0,
        end: 1,
        suffix: ".png",
        zeroPad: 4
      }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      defaultTextureKey: "platformer_characters",
      frames: [ { frame: "tile_0000.png" } ],
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      defaultTextureKey: "platformer_characters",
      frames: [ { frame: "tile_0001.png" } ],
    });

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
    this.load.audio('jump2', 'Jump2.ogg');
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
    this.load.audio('jump2', 'Jump2.ogg');
    this.load.audio("explode", "explode.ogg");
    this.load.audio("heart", "heart.ogg");

    this.load.image("tilemap_tiles_industrial", "tilemap_packed_industrial.png");
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

// -----------------------------------------------------
// LoadBonus
// -----------------------------------------------------
class LoadBonus extends Phaser.Scene {
  constructor() {
    super("loadBonusScene");
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.audio('jump2', 'Jump2.ogg');

    this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
    this.load.tilemapTiledJSON("bonus", "bonus.tmj");
  }

  create() {
    this.loadText = this.add.text(this.cameras.main.centerX, 150, 'Loading Bonus Level', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.loadText = this.add.text(this.cameras.main.centerX, 200, 'Please wait...', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.scene.start('bonusScene');
  }
}
