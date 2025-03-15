"use strict";


// -----------------------------------------------------
// Title Scene
// -----------------------------------------------------
// Title Scene with new style
class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        // Set a background color 
        this.cameras.main.setBackgroundColor('#2D2B55'); // any color you like

        // Optionally, add a subtle background rectangle or gradient
        // this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1A1A40).setOrigin(0);

        // Add an animated background image or sprite if you want, 
        // (not required; just a demonstration) 
        /*
        this.bg = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'title_bg');
        this.bg.setOrigin(0.5);
        // e.g. if you had a sprite loaded in preload
        */

        // Click SFX
        this.clickSFX = this.sound.add('click');

        // A style object for your text
        let titleStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '56px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        };

        let buttonStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '26px',
            color: '#FFFFFF'
        };

        // Title text
        this.titleText = this.add.text(
            this.cameras.main.centerX, 
            150, 
            'Starlight Sprinter', 
            titleStyle
        ).setOrigin(0.5);

        // Start Game button
        this.startGameButton = this.add.text(
            this.cameras.main.centerX, 
            280, 
            'Click to Start New Game', 
            buttonStyle
        ).setOrigin(0.5);
        this.startGameButton.setInteractive();
        this.startGameButton.on('pointerdown', () => {
            this.scene.start('loadFarmScene');
            this.clickSFX.play();
        });

        // Credits button
        this.creditsButton = this.add.text(
            this.cameras.main.centerX, 
            340, 
            'Click for Credits', 
            buttonStyle
        ).setOrigin(0.5);
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerdown', () => {
            this.scene.start('creditsScene');
            this.clickSFX.play();
        });

        // Instructions button
        this.instructionButton = this.add.text(
            this.cameras.main.centerX, 
            400, 
            'Click for Instructions', 
            buttonStyle
        ).setOrigin(0.5);
        this.instructionButton.setInteractive();
        this.instructionButton.on('pointerdown', () => {
            this.scene.start('instructionScene');
            this.clickSFX.play();
        });
    }
}


// -----------------------------------------------------
// Credits Scene
// -----------------------------------------------------
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        // Set a different background color for Credits
        this.cameras.main.setBackgroundColor('#3B3B58');

        // Audio
        this.clickSFX = this.sound.add('click');

        // Create a title-like style
        const titleStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '52px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        };

        // Create a smaller text style
        const textStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '20px',
            color: '#FFFFFF'
        };

        // “Credits” title
        this.add.text(
            this.cameras.main.centerX,
            100,
            'Credits',
            titleStyle
        ).setOrigin(0.5);

        // Credits text
        this.add.text(
            this.cameras.main.centerX, 
            200,
            'Game Design:',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX, 
            250,
            'Guangyang Chen, Jinghang Li, Shuhao Lu',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX, 
            300,
            'gchen79@ucsc.edu, jli758@ucsc.edu, slu51@ucsc.edu',
            textStyle
        ).setOrigin(0.5);

        // Button to return
        const buttonText = this.add.text(
            this.cameras.main.centerX, 
            400,
            'Click Here to Return to Title',
            {
                fontFamily: 'Verdana, Geneva, sans-serif',
                fontSize: '24px',
                color: '#FFD700'
            }
        ).setOrigin(0.5);

        buttonText.setInteractive();
        buttonText.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}


// -----------------------------------------------------
// Instruction Scene
// -----------------------------------------------------
class Instruction extends Phaser.Scene {
    constructor() {
        super("instructionScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        // Background color for the Instruction scene
        this.cameras.main.setBackgroundColor('#2D2B55');

        // Click sound
        this.clickSFX = this.sound.add('click');

        // Style for large header
        let headerStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '48px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        };

        // Style for each instruction line
        let textStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '20px',
            color: '#FFFFFF',
            wordWrap: { width: 600, useAdvancedWrap: true }
        };

        // Title text
        this.add.text(
            this.cameras.main.centerX, 
            100, 
            'Instructions', 
            headerStyle
        ).setOrigin(0.5);

        // Instruction lines (same text, new style)
        this.add.text(
            this.cameras.main.centerX,
            200,
            '1. Use arrow keys to control player movement; press R to restart.',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            250,
            '2. Collect coins/gas by touching them.',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            300,
            '3. Score is shown above the player—collect as many as you can!',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            350,
            '4. Once you move to the next scene, you cannot go back.',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            400,
            '5. Enemies will deduct HP; gather hearts to restore HP.',
            textStyle
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.centerX,
            450,
            '6. Enjoy the Game!',
            textStyle
        ).setOrigin(0.5);

        // Return button
        let buttonStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '24px',
            color: '#FFD700'
        };

        let returnButton = this.add.text(
            this.cameras.main.centerX,
            550,
            'Click Here to Return to Title',
            buttonStyle
        ).setOrigin(0.5);

        returnButton.setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}


// -----------------------------------------------------
// Game Over Scene
// -----------------------------------------------------
class GG extends Phaser.Scene {
  constructor() {
    super("ggScene");
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.audio('click', 'switch1.ogg');
  }

  create() {
    this.clickSFX = this.sound.add('click');

    this.ggText = this.add.text(this.cameras.main.centerX, 150, 'Game Over', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.ggText = this.add.text(this.cameras.main.centerX, 200, 'Score: ' + score, { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.ButtonText = this.add.text(this.cameras.main.centerX, 250, 'Click to Return to Title', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    // Reset overall score
    score = 0;

    this.ButtonText.setInteractive();
    this.ButtonText.on('pointerdown', () => {
      this.scene.start('titleScene');
      this.clickSFX.play();
    });
  }
}
