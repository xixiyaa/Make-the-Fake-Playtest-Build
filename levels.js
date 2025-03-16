"use strict";

/*
  levels.js contains main gameplay scenes:
  - Farm
  - Industrial
  The logic is identical to our original code except that we now use three static images
*/

// -----------------------------------------------------
// Farm Scene
// -----------------------------------------------------
class Farm extends Phaser.Scene {
  constructor() {
    super("farmScene");
  }

  init() {
    this.ACCELERATION = 150;
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
    this.map = this.add.tilemap("farm", 18, 18, 45, 25);

    //this.tilesetBackground = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_tiles_background");

    this.add.image(0, 0, "back").setOrigin(0, 0).setDepth(-1).setScrollFactor(1);



    this.tilesetFarm = this.map.addTilesetImage("tilemap_packed_farm", "tilemap_tiles_farm");
    this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

    this.collectSFX = this.sound.add('collect');
    this.jump2SFX = this.sound.add('jump2');

    this.jumpEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['trace_05.png', 'trace_06.png'],
      scale: { start: 0.3, end: 0.1 },
      maxAliveParticles: 200,
      lifespan: 500,
      alpha: { start: 1, end: 0.1 },
      on: false
    });
    this.jumpEmitter.stop();

    //this.HPText = this.add.text(50, 50, "HP:100", { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: 10 });

    //this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetFarm, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tilesetFarm, 0, 0);
    this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);

    this.groundLayer.setCollisionByProperty({ collides: true });

    this.coins = this.map.createFromObjects("Objects", {
      name: "coin",
      key: "tilemap_sheet",
      frame: 151
    });
    this.heart = this.map.createFromObjects("Objects", {
      name: "heart",
      key: "tilemap_sheet",
      frame: 44
    });

    this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

    this.coinGroup = this.add.group(this.coins);
    this.heartGroup = this.add.group(this.heart);

    // Use the new character image for the player (starting with the "stay" texture)
    my.sprite.player = this.physics.add.sprite(30, 200, "character_stay");
    my.sprite.player.setScale(0.18); 
    my.sprite.player.setCollideWorldBounds(true);
    my.sprite.player.body.setSize(80, 120);
    my.sprite.player.body.setOffset(30, 70);


    my.sprite.enemy = this.physics.add.sprite(100, 250, "monster_left");

    my.sprite.enemy.setScale(0.2);
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

    this.key = this.physics.add.sprite(30, 300, "key");
    this.key.visible = false;
    this.key.interactable = false;

    this.physics.add.collider(my.sprite.player, this.groundLayer);
    this.physics.add.collider(this.key, this.groundLayer);


    //this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all coins to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });

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

    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

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

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {

    let hpEl = document.getElementById('hpText');
    let scoreEl = document.getElementById('scoreText');
    let condEl = document.getElementById('conditionText');
    let someConditionTextHere = "Try to collect all coins!";


    hpEl.textContent = `HP: ${Math.floor(this.playerHP)}`;
    scoreEl.textContent = ` | Score: ${score}`;
    condEl.textContent = ` | ${someConditionTextHere}`;

    if (this.gameLost) {
      // Allow restart but prevent any further movement or actions.
      if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
        this.scene.restart();
      }
      return; // Stop processing any further input or movement.
    }
    

    if (my.sprite.enemy && my.sprite.enemy.active) {
      if (my.sprite.enemy.x <= my.sprite.enemy.patrolBounds.left) {
        my.sprite.enemy.direction = 1;
      } else if (my.sprite.enemy.x >= my.sprite.enemy.patrolBounds.right) {
        my.sprite.enemy.direction = -1;
      }
      my.sprite.enemy.setVelocityX(my.sprite.enemy.patrolSpeed * my.sprite.enemy.direction);
    }

    if (this.playerHP <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.loseText1 = this.add.text(this.cameras.main.worldView.x + 240, 130, "You died!", {
        fontFamily: 'Lucida, monospace', fontSize: 20
      });
      this.loseText3 = this.add.text(this.cameras.main.worldView.x + 160, 170, "Press R to restart", {
        fontFamily: 'Lucida, monospace', fontSize: 20
      });
      this.physics.pause();
    }


    // Movement: Change texture based on input
    if (cursors.left.isDown) {
      my.sprite.player.setVelocityX(-this.ACCELERATION);
      my.sprite.player.setTexture("character_left");
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if (my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if (cursors.right.isDown) {
      my.sprite.player.setVelocityX(this.ACCELERATION);
      my.sprite.player.setTexture("character_right");
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if (my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setVelocityX(0);
      //my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.setTexture("character_stay");
      my.vfx.walking.stop();
    }

    // Jump logic (removed jump animation)
    if (!my.sprite.player.body.blocked.down) {
      // No texture change during jump
    }
    if (my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    if (my.sprite.player.x > this.map.widthInPixels) {
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
    this.ACCELERATION = 150;
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
    this.add.image(0, 0, "back2").setOrigin(0, 0).setDepth(-1).setScrollFactor(0);


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

    //this.backgroundLayer = this.map.createLayer("Background", this.tilesetBackground, 0, 0);
    this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tilesetIndustrial, 0, 0);
    this.decorationLayer = this.map.createLayer("Decoration", this.tilesetIndustrial, 0, 0);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.gas = this.map.createFromObjects("Objects", {
      name: "gas",
      key: "tilemap_sheet_industrial",
      frame: 10
    });
    this.heart = this.map.createFromObjects("Objects", {
      name: "heart",
      key: "tilemap_sheet",
      frame: 44
    });


    this.physics.world.enable(this.gas, Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.world.enable(this.heart, Phaser.Physics.Arcade.STATIC_BODY);

    this.heartGroup = this.add.group(this.heart);
    this.gasGroup = this.add.group(this.gas);

    // Create player with new image
    my.sprite.player = this.physics.add.sprite(30, 200, "character_stay");
    my.sprite.player.setScale(0.18); // Adjust the value as needed
    my.sprite.player.setCollideWorldBounds(true);
    my.sprite.player.body.setSize(80, 120);
    my.sprite.player.body.setOffset(30, 70);

    this.enemies = this.physics.add.group();
    //my.sprite.enemy = this.physics.add.sprite(100, 250, "car");
    const enemyPositions = [{ x: 130, y: 200 }, { x: 270, y: 250 }, { x: 450, y: 450 }, { x: 700, y: 300 }];
    enemyPositions.forEach(pos => {
      let enemy = this.enemies.create(pos.x, pos.y, "car");
      enemy.setScale(0.2);

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

    this.key = this.physics.add.sprite(30, 200, "key");
    this.key.visible = false;
    this.key.interactable = false;

    this.physics.add.collider(my.sprite.player, this.groundLayer);
    this.physics.add.collider(this.key, this.groundLayer);
    this.physics.add.collider(this.enemies, this.groundLayer);

    //this.scoreText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 26, score, { fontSize: '12px', fill: '#FFFFFF' });
    //this.conditionText = this.add.text(my.sprite.player.x - 15, my.sprite.player.y - 36, 'Collect all gas to spawn the key!', { fontSize: '12px', fill: '#FFFFFF' });
    let someConditionTextHere = "Try to collect all gas!";
    let condEl = document.getElementById('conditionText');
    condEl.textContent = ` | ${someConditionTextHere}`;

    this.physics.add.overlap(my.sprite.player, this.gasGroup, (obj1, obj2) => {
      obj2.destroy();
      score += 100;
      this.collectSFX.play();
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey('R');

    this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
    this.physics.world.debugGraphic.clear();

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

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
  }

  update() {
    let hpEl = document.getElementById('hpText');
    let scoreEl = document.getElementById('scoreText');
    let condEl = document.getElementById('conditionText');
    let someConditionTextHere = "Try to collect all gas!";

    hpEl.textContent = `HP: ${Math.floor(this.playerHP)}`;
    scoreEl.textContent = ` | Score: ${score}`;
    condEl.textContent = ` | ${someConditionTextHere}`;

    if (this.gameLost) {
      // Allow restart but prevent any further movement or actions.
      if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
        this.scene.restart();
      }
      return; // Stop processing any further input or movement.
    }
    

    this.enemies.children.iterate(enemy => {
      if (enemy.x <= enemy.patrolBounds.left) {
        enemy.direction = 1;
      } else if (enemy.x >= enemy.patrolBounds.right) {
        enemy.direction = -1;
      }
      enemy.setVelocityX(enemy.patrolSpeed * enemy.direction);
    });

    if (this.playerHP <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.loseText1 = this.add.text(this.cameras.main.worldView.x + 240, 130, "You died!", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.loseText3 = this.add.text(this.cameras.main.worldView.x + 160, 170, "Press R to restart", { fontFamily: 'Lucida, monospace', fontSize: 20 });
      this.physics.pause();
    }


    // Movement: update texture based on input
    if (cursors.left.isDown) {
      my.sprite.player.setVelocityX(-this.ACCELERATION);
      my.sprite.player.setTexture("character_left");
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if (my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else if (cursors.right.isDown) {
      my.sprite.player.setVelocityX(this.ACCELERATION);
      my.sprite.player.setTexture("character_right");
      my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5);
      my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
      if (my.sprite.player.body.blocked.down) {
        my.vfx.walking.start();
      }
    } else {
      my.sprite.player.setVelocityX(0);
      //my.sprite.player.setDragX(this.DRAG);
      my.sprite.player.setTexture("character_stay");
      my.vfx.walking.stop();
    }

    if (!my.sprite.player.body.blocked.down) {
      // No change during jump
    }
    if (my.sprite.player.body.blocked.down) {
      this.jumpCount = 0;
      this.jumpEmitter.stop();
    }
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < 2) {
      my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
      this.jumpCount++;
      this.jump2SFX.play();
      this.jumpEmitter.setPosition(my.sprite.player.x, my.sprite.player.y);
      this.jumpEmitter.start();
    } else {
      this.jumpEmitter.stop();
    }

    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }



    if (my.sprite.player.x > this.map.widthInPixels) {
        this.scene.start("ggScene");
    }
  }
}
