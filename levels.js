"use strict";

/*
  levels.js contains your main gameplay scenes:
  - Farm
  - Food
  - Industrial
  - Bonus

  The logic is identical to your original code.
*/

// -----------------------------------------------------
// Farm Scene
// -----------------------------------------------------
class Farm extends Phaser.Scene {
  constructor() {
    super("farmScene");
  }

  init() {
    // Original property assignments
    this.ACCELERATION = 400;
    this.DRAG = 500;
    this.physics.world.gravity.y = 1500;
    this.JUMP_VELOCITY = -600;
    this.PARTICLE_VELOCITY = 50;
    this.SCALE = 2.0;
    this.jumpCount = 0;
    this.playerHP = 100;
    this.gameLost = false;
  }

  create() {
    // Create tilemap
    this.map = this.add.tilemap("farm", 18, 18, 45, 25);

    // Add tileset
    this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
    this.tilesetFarm = this.map.addTilesetImage("tilemap_packed_farm", "tilemap_tiles_farm");
    this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

    // SFX
    this.collectSFX = this.sound.add('collect');
    this.jump2SFX = this.sound.add('jump2');

    // Jump vfx
    this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['trace_05.png', 'trace_06.png'],
      scale: { start: 0.3, end: 0.1 },
      maxAliveParticles: 200,
      lifespan: 500,
      alpha: { start: 1, end: 0.1 },
      on: false
    });
    this.jumpEmitter.stop();

    // HP text
    this.HPText = this.add.text(50, 50, "HP:100", { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: 10 });

    // Layers
    this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetFarm, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tilesetFarm, 0, 0);
    this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);

    // Collide
    this.groundLayer.setCollisionByProperty({ collides: true });

    // Coins
    this.coins = this.map.createFromObjects("Objects", {
      name: "coin",
      key: "tilemap_sheet",
      frame: 151
    });
    // Heart
    this.heart = this.map.createFromObjects("Objects", {
      name: "heart",
      key: "tilemap_sheet",
      frame: 44
    });

    this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

    this.coinGroup = this.add.group(this.coins);
    this.heartGroup = this.add.group(this.heart);

    // Player
    my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
    my.sprite.player.setCollideWorldBounds(true);

    // Enemy
    my.sprite.enemy = this.physics.add.sprite(100, 250, "platformer_characters", "tile_0002.png");
    my.sprite.enemy.setCollideWorldBounds(true);
    my.sprite.enemy.patrolBounds = { left: 100, right: 180 };
    my.sprite.enemy.patrolSpeed = 50;
    my.sprite.enemy.direction = 1;
    this.physics.add.collider(my.sprite.enemy, this.groundLayer);
    this.physics.add.overlap(my.sprite.player, my.sprite.enemy, (player, enemy) => {
      enemy.destroy();
      this.sound.play("explode", { volume: 0.5 });
      this.playerHP -= 100;
    });

    // Key
    this.key = this.physics.add.sprite(30, 300, "key");
    this.key.visible = false;
    this.key.interactable = false;

    // Collisions
    this.physics.add.collider(my.sprite.player, this.groundLayer);
    this.physics.add.collider(this.key, this.groundLayer);

    // UI text
    this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#FFFFFF' });
    this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all coins to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });

    // Overlaps
    this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
      obj2.destroy();
      score += 100;
      this.collectSFX.play();
    });
    this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
      obj2.destroy();
      this.playerHP += 20;
      this.sound.play("heart", { volume: 0.5 });
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    // Debug toggle
    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

    // Movement vfx
    my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
      frame: ['smoke_03.png','smoke_09.png'],
      random: true,
      scale: { start: 0.03, end: 0.1 },
      maxAliveParticles: 8,
      lifespan: 350,
      gravityY: -400,
      alpha: { start: 1, end: 0.1 }
    });
    my.vfx.walking.stop();

    // Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {
    // Enemy patrol
    if (my.sprite.enemy && my.sprite.enemy.active) {
      if (my.sprite.enemy.x <= my.sprite.enemy.patrolBounds.left) {
        my.sprite.enemy.direction = 1;
      } else if (my.sprite.enemy.x >= my.sprite.enemy.patrolBounds.right) {
        my.sprite.enemy.direction = -1;
      }
      my.sprite.enemy.setVelocityX(my.sprite.enemy.patrolSpeed * my.sprite.enemy.direction);
    }

    // Game over
    if(this.playerHP <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.loseText1 = this.add.text(this.cameras.main.worldView.x+240, 130, "You died!", {
        fontFamily: 'Lucida, monospace', fontSize: 20
      });
      this.loseText3 = this.add.text(this.cameras.main.worldView.x+160, 170, "Press R to restart", {
        fontFamily: 'Lucida, monospace', fontSize: 20
      });
      this.physics.pause();
    }

    // HP text
    this.HPText.setText("HP: " + Math.floor(this.playerHP));
    this.HPText.x = my.sprite.player.x - 28;
    this.HPText.y = my.sprite.player.y - 45;

    // Score text
    this.scoreText.setText(score);
    this.scoreText.x = my.sprite.player.x - 15;
    this.scoreText.y = my.sprite.player.y - 26;

    // Condition text
    this.conditionText.x = my.sprite.player.x - 20;
    this.conditionText.y = my.sprite.player.y - 36;

    // Movement
    if(cursors.left.isDown) {
      my.sprite.player.setAccelerationX(-this.ACCELERATION);
      my.sprite.player.resetFlip();
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if(cursors.right.isDown) {
      my.sprite.player.setAccelerationX(this.ACCELERATION);
      my.sprite.player.setFlip(true, false);
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setAccelerationX(0);
      my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.anims.play('idle');
      my.vfx.walking.stop();
    }

    // Jump
    if(!my.sprite.player.body.blocked.down) {
      my.sprite.player.anims.play('jump');
    }
    if(my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      my.sprite.player.anims.play('jump');
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    // Restart
    if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // If coins are cleared, spawn key
    if(this.coinGroup.getLength() === 0) {
      this.key.visible = true;
      this.key.interactable = true;
      if(keycountFarm === 0) {
        this.conditionText.setText('The key has spawned somewhere.');
      }
    }

    // Collect key
    if(this.key.interactable && Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), this.key.getBounds())) {
      this.key.destroy();
      this.conditionText.setText('Congrats! Proceed to the right to the next scene.');
      keycountFarm++;
    }

    // Next scene
    if(my.sprite.player.x > this.map.widthInPixels) {
      this.scene.start("loadFoodScene");
    }
  }
}

// -----------------------------------------------------
// Food Scene
// -----------------------------------------------------
class Food extends Phaser.Scene {
  constructor() {
    super("foodScene");
  }

  init() {
    this.ACCELERATION = 400;
    this.DRAG = 500;
    this.physics.world.gravity.y = 1500;
    this.JUMP_VELOCITY = -600;
    this.PARTICLE_VELOCITY = 50;
    this.SCALE = 2.0;
    this.jumpCount = 0;
    this.playerHP = 100;
    this.gameLost = false;
  }

  create() {
    this.map = this.add.tilemap("food", 18, 18, 45, 25);

    this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
    this.tilesetFood = this.map.addTilesetImage("tilemap_packed_food", "tilemap_tiles_food");

    this.collectSFX = this.sound.add('collect');
    this.jump2SFX = this.sound.add('jump2');

    this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['trace_05.png','trace_06.png'],
      scale: { start: 0.3, end: 0.1 },
      maxAliveParticles: 200,
      lifespan: 500,
      alpha: { start: 1, end: 0.1 },
      on: false
    });
    this.jumpEmitter.stop();

    this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetFood, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tilesetFood, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.coins = this.map.createFromObjects("Objects", { name: "coin", key: "tilemap_sheet_food", frame: 13 });
    this.heart = this.map.createFromObjects("Objects", { name: "heart", key: "tilemap_sheet", frame: 44 });

    this.HPText = this.add.text(50, 50, "HP:100", { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: 10 });

    this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);
    this.heartGroup = this.add.group(this.heart);
    this.coinGroup = this.add.group(this.coins);

    my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
    my.sprite.player.setCollideWorldBounds(true);

    // Enemies
    this.enemies = this.physics.add.group();
    const enemyPositions = [{ x: 150, y: 300 }, { x: 250, y: 250 }, { x: 500, y: 250 }, { x: 700, y: 300 }];
    enemyPositions.forEach(pos => {
      let enemy = this.enemies.create(pos.x, pos.y, "platformer_characters", "tile_0021.png");
      enemy.setCollideWorldBounds(true);
      enemy.patrolBounds = { left: pos.x - 25, right: pos.x + 25 };
      enemy.patrolSpeed = 50;
      enemy.direction = 1;
      this.physics.add.collider(enemy, this.groundLayer);
    });
    this.physics.add.overlap(my.sprite.player, this.enemies, (player, enemy) => {
      enemy.destroy();
      this.playerHP -= 50;
      this.sound.play("explode", { volume: 0.5 });
    });

    // Key
    this.key = this.physics.add.sprite(30, 300, "key");
    this.key.visible = false;
    this.key.interactable = false;

    // Collisions
    this.physics.add.collider(my.sprite.player, this.groundLayer);
    this.physics.add.collider(this.key, this.groundLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);

    // UI text
    this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#FFFFFF' });
    this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all coins to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });

    // Overlaps
    this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
      obj2.destroy();
      score += 100;
      this.collectSFX.play();
    });
    this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
      obj2.destroy();
      this.playerHP += 20;
      this.sound.play("heart", { volume: 0.5 });
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    // Debug toggle
    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

    // Movement vfx
    my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
      frame: ['smoke_03.png','smoke_09.png'],
      random: true,
      scale: {start: 0.03, end: 0.1},
      maxAliveParticles: 8,
      lifespan: 350,
      gravityY: -400,
      alpha: {start: 1, end: 0.1}
    });
    my.vfx.walking.stop();

    // Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {
    // Enemy patrol
    this.enemies.children.iterate(enemy => {
      if(enemy.x <= enemy.patrolBounds.left) {
        enemy.direction = 1;
      } else if(enemy.x >= enemy.patrolBounds.right) {
        enemy.direction = -1;
      }
      enemy.setVelocityX(enemy.patrolSpeed * enemy.direction);
    });

    // Game over
    if(this.playerHP <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.loseText1 = this.add.text(this.cameras.main.worldView.x+240, 130, "You died!", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.loseText3 = this.add.text(this.cameras.main.worldView.x+160, 170, "Press R to restart", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.physics.pause();
    }

    // HP
    this.HPText.setText("HP: " + Math.floor(this.playerHP));
    this.HPText.x = my.sprite.player.x - 28;
    this.HPText.y = my.sprite.player.y - 45;

    // Score
    this.scoreText.setText(score);
    this.scoreText.x = my.sprite.player.x - 15;
    this.scoreText.y = my.sprite.player.y - 26;

    // Condition text
    this.conditionText.x = my.sprite.player.x - 20;
    this.conditionText.y = my.sprite.player.y - 36;

    // Movement
    if(cursors.left.isDown) {
      my.sprite.player.setAccelerationX(-this.ACCELERATION);
      my.sprite.player.resetFlip();
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if(cursors.right.isDown) {
      my.sprite.player.setAccelerationX(this.ACCELERATION);
      my.sprite.player.setFlip(true, false);
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setAccelerationX(0);
      my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.anims.play('idle');
      my.vfx.walking.stop();
    }

    // Jump
    if(!my.sprite.player.body.blocked.down) {
      my.sprite.player.anims.play('jump');
    }
    if(my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      my.sprite.player.anims.play('jump');
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // key spawn
    if(this.coinGroup.getLength() === 0) {
      this.key.visible = true;
      this.key.interactable = true;
      if(keycountFood === 0){
        this.conditionText.setText('The key has spawned somewhere.');
      }
    }
    if(this.key.interactable && Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), this.key.getBounds())) {
      this.key.destroy();
      this.conditionText.setText('Congrats! Proceed to the right to the next scene.');
      keycountFood++;
    }

    // Next scene
    if(my.sprite.player.x > this.map.widthInPixels) {
      this.scene.start("loadIndustrialScene");
    }
  }
}

// -----------------------------------------------------
// Industrial Scene
// -----------------------------------------------------
class Industrial extends Phaser.Scene {
  constructor() {
    super("industrialScene");
  }

  init() {
    this.ACCELERATION = 400;
    this.DRAG = 500;
    this.physics.world.gravity.y = 1500;
    this.JUMP_VELOCITY = -600;
    this.PARTICLE_VELOCITY = 50;
    this.SCALE = 2.0;
    this.jumpCount = 0;
    this.playerHP = 100;
    this.gameLost = false;
  }

  create() {
    this.map = this.add.tilemap("industrial", 18, 18, 45, 25);

    this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
    this.tilesetIndustrial = this.map.addTilesetImage("tilemap_packed_industrial", "tilemap_tiles_industrial");

    this.collectSFX = this.sound.add('collect');
    this.jump2SFX = this.sound.add('jump2');
    this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['trace_05.png','trace_06.png'],
      scale: { start: 0.3, end: 0.1 },
      maxAliveParticles: 200,
      lifespan: 500,
      alpha: { start: 1, end: 0.1 },
      on: false
    });
    this.jumpEmitter.stop();

    this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetIndustrial, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tilesetIndustrial, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    // Gas objects
    this.gas = this.map.createFromObjects("Objects", {
      name: "gas",
      key: "tilemap_sheet_industrial",
      frame: 10
    });
    // Heart
    this.heart = this.map.createFromObjects("Objects", {
      name: "heart",
      key: "tilemap_sheet",
      frame: 44
    });

    this.HPText = this.add.text(50, 50, "HP:100", { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: 10 });

    this.physics.world.enable(this.gas, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

    this.heartGroup = this.add.group(this.heart);
    this.gasGroup = this.add.group(this.gas);

    my.sprite.player = this.physics.add.sprite(30, 200, "platformer_characters", "tile_0000.png");
    my.sprite.player.setCollideWorldBounds(true);

    // Enemies
    this.enemies = this.physics.add.group();
    const enemyPositions = [{ x: 130, y: 200 }, { x: 270, y: 250 }, { x: 450, y: 450 }, { x: 700, y: 300 }];
    enemyPositions.forEach(pos => {
      let enemy = this.enemies.create(pos.x, pos.y, "platformer_characters", "tile_0021.png");
      enemy.setCollideWorldBounds(true);
      enemy.patrolBounds = { left: pos.x - 25, right: pos.x + 25 };
      enemy.patrolSpeed = 50;
      enemy.direction = 1;
      this.physics.add.collider(enemy, this.groundLayer);
    });
    this.physics.add.overlap(my.sprite.player, this.enemies, (player, enemy) => {
      enemy.destroy();
      this.playerHP -= 50;
      this.sound.play("explode", { volume: 0.5 });
    });
    this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
      obj2.destroy();
      this.playerHP += 20;
      this.sound.play("heart", { volume: 0.5 });
    });

    // Key
    this.key = this.physics.add.sprite(30, 200, "key");
    this.key.visible = false;
    this.key.interactable = false;

    // Collisions
    this.physics.add.collider(my.sprite.player, this.groundLayer);
    this.physics.add.collider(this.key, this.groundLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);

    // UI text
    this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#FFFFFF' });
    this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all gas to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });

    // Overlap with gas
    this.physics.add.overlap(my.sprite.player, this.gasGroup, (obj1, obj2) => {
      obj2.destroy();
      score += 100;
      this.collectSFX.play();
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    // Debug
    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

    // Movement vfx
    my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
      frame: ['smoke_03.png','smoke_09.png'],
      random: true,
      scale: {start: 0.03, end: 0.1},
      maxAliveParticles: 8,
      lifespan: 350,
      gravityY: -400,
      alpha: {start: 1, end: 0.1}
    });
    my.vfx.walking.stop();

    // Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {
    // Enemy patrol
    this.enemies.children.iterate(enemy => {
      if(enemy.x <= enemy.patrolBounds.left) {
        enemy.direction = 1;
      } else if(enemy.x >= enemy.patrolBounds.right) {
        enemy.direction = -1;
      }
      enemy.setVelocityX(enemy.patrolSpeed * enemy.direction);
    });

    // Game over
    if(this.playerHP <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.loseText1 = this.add.text(this.cameras.main.worldView.x+240, 130, "You died!", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.loseText3 = this.add.text(this.cameras.main.worldView.x+160, 170, "Press R to restart", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.physics.pause();
    }

    // HP
    this.HPText.setText("HP: " + Math.floor(this.playerHP));
    this.HPText.x = my.sprite.player.x - 28;
    this.HPText.y = my.sprite.player.y - 45;

    // Score
    this.scoreText.setText(score);
    this.scoreText.x = my.sprite.player.x - 15;
    this.scoreText.y = my.sprite.player.y - 26;

    this.conditionText.x = my.sprite.player.x - 20;
    this.conditionText.y = my.sprite.player.y - 36;

    // Movement
    if(cursors.left.isDown) {
      my.sprite.player.setAccelerationX(-this.ACCELERATION);
      my.sprite.player.resetFlip();
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if(cursors.right.isDown) {
      my.sprite.player.setAccelerationX(this.ACCELERATION);
      my.sprite.player.setFlip(true, false);
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setAccelerationX(0);
      my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.anims.play('idle');
      my.vfx.walking.stop();
    }

    // Jump
    if(!my.sprite.player.body.blocked.down) {
      my.sprite.player.anims.play('jump');
    }
    if(my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      my.sprite.player.anims.play('jump');
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    // Restart
    if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // Spawn key if no gas left
    if(this.gasGroup.getLength() === 0) {
      this.key.visible = true;
      this.key.interactable = true;
      if(keycountIndustrial === 0){
        this.conditionText.setText('The key has spawned somewhere.');
      }
    }
    if(this.key.interactable && Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), this.key.getBounds())) {
      this.key.destroy();
      this.conditionText.setText('Congrats! Proceed to the right to the next scene.');
      keycountIndustrial++;
    }

    // Next scene
    if(my.sprite.player.x > this.map.widthInPixels) {
      if(keycountFarm && keycountFood && keycountIndustrial) {
        this.scene.start("loadBonusScene");
      } else {
        this.scene.start("ggScene");
      }
    }
  }
}

// -----------------------------------------------------
// Bonus Scene
// -----------------------------------------------------
class Bonus extends Phaser.Scene {
  constructor() {
    super("bonusScene");
  }

  init() {
    this.ACCELERATION = 400;
    this.DRAG = 500;
    this.physics.world.gravity.y = 1500;
    this.JUMP_VELOCITY = -600;
    this.PARTICLE_VELOCITY = 50;
    this.SCALE = 2.0;
    this.jumpCount = 0;
  }

  create() {
    this.map = this.add.tilemap("bonus", 18, 18, 45, 25);

    this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");
    this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_sheet");

    this.collectSFX = this.sound.add('collect');
    this.jump2SFX = this.sound.add('jump2');
    this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['trace_05.png','trace_06.png'],
      scale: { start: 0.3, end: 0.1 },
      maxAliveParticles: 200,
      lifespan: 500,
      alpha: { start: 1, end: 0.1 },
      on: false
    });
    this.jumpEmitter.stop();

    this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tileset, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.coins = this.map.createFromObjects("Objects", { name: "coin", key: "tilemap_sheet", frame: 151 });
    this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
    this.coinGroup = this.add.group(this.coins);

    my.sprite.player = this.physics.add.sprite(30, 300, "platformer_characters", "tile_0000.png");
    my.sprite.player.setCollideWorldBounds(true);
    this.physics.add.collider(my.sprite.player, this.groundLayer);

    this.welcomeText = this.add.text(50, 100, 'Welcome to the Bonus Level gifted by your 3 keys!', { fontSize: '12px', fill: '#000000' });
    this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#000000' });
    this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Endless Coins!', { fontSize: '12px', fill: '#000000' });

    this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
      obj2.destroy();
      score += 100;
      this.collectSFX.play();
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    // Debug
    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

    // Movement vfx
    my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
      frame: ['smoke_03.png','smoke_09.png'],
      random: true,
      scale: {start: 0.03, end: 0.1},
      maxAliveParticles: 8,
      lifespan: 350,
      gravityY: -400,
      alpha: {start: 1, end: 0.1},
    });
    my.vfx.walking.stop();

    // Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {
    // Score update
    this.scoreText.setText(score);
    this.scoreText.x = my.sprite.player.x - 15;
    this.scoreText.y = my.sprite.player.y - 26;

    // Condition text
    this.conditionText.x = my.sprite.player.x - 20;
    this.conditionText.y = my.sprite.player.y - 36;

    // Movement
    if(cursors.left.isDown) {
      my.sprite.player.setAccelerationX(-this.ACCELERATION);
      my.sprite.player.resetFlip();
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if(cursors.right.isDown) {
      my.sprite.player.setAccelerationX(this.ACCELERATION);
      my.sprite.player.setFlip(true, false);
      my.sprite.player.anims.play('walk', true);
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if(my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setAccelerationX(0);
      my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.anims.play('idle');
      my.vfx.walking.stop();
    }

    // Jump
    if(!my.sprite.player.body.blocked.down) {
      my.sprite.player.anims.play('jump');
    }
    if(my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if(Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      my.sprite.player.anims.play('jump');
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    // Restart
    if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // Next scene (goes to GG)
    if(my.sprite.player.x > this.map.widthInPixels) {
      this.scene.start("ggScene");
    }
  }
}
