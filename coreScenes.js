"use strict";



// -----------------------------------------------------
// Title Scene
// -----------------------------------------------------
class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
    }

    create() {
        // Background color
        this.cameras.main.setBackgroundColor('#2D2B55');
        this.clickSFX = this.sound.add('click');

        let titleStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '56px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 4, offsetY: 4, color: '#000', blur: 4, stroke: true, fill: true
            }
        };
        let buttonStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '26px',
            color: '#FFFFFF'
        };

        // Title text
        this.titleText = this.add.text(
            this.cameras.main.centerX, 150, 'Turbo’s Rampage', titleStyle
        ).setOrigin(0.5);

        // Start Game button
        this.startGameButton = this.add.text(
            this.cameras.main.centerX, 280, 'Click to Start New Game', buttonStyle
        ).setOrigin(0.5);
        this.startGameButton.setInteractive();
        this.startGameButton.on('pointerdown', () => {
            this.scene.start('loadFarmScene');
            this.clickSFX.play();
        });

        // Credits button
        this.creditsButton = this.add.text(
            this.cameras.main.centerX, 340, 'Click for Credits', buttonStyle
        ).setOrigin(0.5);
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerdown', () => {
            this.scene.start('creditsScene');
            this.clickSFX.play();
        });

        // Instructions button
        this.instructionButton = this.add.text(
            this.cameras.main.centerX, 400, 'Click for Instructions', buttonStyle
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
        this.cameras.main.setBackgroundColor('#3B3B58');
        this.clickSFX = this.sound.add('click');

        const titleStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '52px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5,
            shadow: {
                offsetX: 3, offsetY: 3, color: '#000', blur: 4, stroke: true, fill: true
            }
        };
        const textStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '20px',
            color: '#FFFFFF'
        };

        // “Credits” title
        this.add.text(
            this.cameras.main.centerX, 100, 'Credits', titleStyle
        ).setOrigin(0.5);

        // Credits text
        this.add.text(this.cameras.main.centerX, 200, 'Game Design:', textStyle).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 250, 'XIFAN LUO, XUAN HE', textStyle).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 300, 'XLUO46@UCSC.EDU XHE83@UCSC.EDU', textStyle).setOrigin(0.5);

        // Return button
        const buttonText = this.add.text(
            this.cameras.main.centerX, 400,
            'Click Here to Return to Title',
            { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '24px', color: '#FFD700' }
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
        this.cameras.main.setBackgroundColor('#2D2B55');
        this.clickSFX = this.sound.add('click');

        let headerStyle = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '48px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 3, offsetY: 3, color: '#000', blur: 4, stroke: true, fill: true
            }
        };
        let textStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '20px',
            color: '#FFFFFF',
            wordWrap: { width: 600, useAdvancedWrap: true }
        };

        // Title text
        this.add.text(this.cameras.main.centerX, 100, 'Instructions', headerStyle).setOrigin(0.5);

        // Instruction lines
        this.add.text(
            this.cameras.main.centerX, 200,
            '1. Use the arrow keys to move your character. Press R to reset if needed.', textStyle
        ).setOrigin(0.5);
        this.add.text(
            this.cameras.main.centerX, 250,
            '2. Pick up coins or fuel simply by touching them', textStyle
        ).setOrigin(0.5);
        this.add.text(
            this.cameras.main.centerX, 300,
            '3. Your score appears above the player—grab as many points as possible!', textStyle
        ).setOrigin(0.5);
        this.add.text(
            this.cameras.main.centerX, 350,
            '4. Once you advance to a new area, you won’t be able to go back.', textStyle
        ).setOrigin(0.5);
        this.add.text(
            this.cameras.main.centerX, 400,
            '5. Watch out for enemies—your health decreases if they touch you. Pick up hearts to restore it.', textStyle
        ).setOrigin(0.5);
        this.add.text(
            this.cameras.main.centerX, 450,
            '6. Have fun playing!', textStyle
        ).setOrigin(0.5);

        // Return button
        let buttonStyle = {
            fontFamily: 'Verdana, Geneva, sans-serif',
            fontSize: '24px',
            color: '#FFD700'
        };
        let returnButton = this.add.text(
            this.cameras.main.centerX, 550,
            'Click Here to Return to Title', buttonStyle
        ).setOrigin(0.5);

        returnButton.setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}

// -----------------------------------------------------
// GG ("Game Over") Scene
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
        this.cameras.main.setBackgroundColor('#000000');
        this.clickSFX = this.sound.add('click');

        this.ggText = this.add.text(
            this.cameras.main.centerX, 150, 
            'Game Over', 
            { font: '40px Arial', fill: '#ffffff' }
        ).setOrigin(0.5);
        this.ggText = this.add.text(
            this.cameras.main.centerX, 200, 
            'Score: ' + score, 
            { font: '20px Arial', fill: '#ffffff' }
        ).setOrigin(0.5);
        this.ButtonText = this.add.text(
            this.cameras.main.centerX, 250, 
            'Click to Return to Title', 
            { font: '20px Arial', fill: '#ffffff' }
        ).setOrigin(0.5);

        // Reset overall score
        score = 0;

        this.ButtonText.setInteractive();
        this.ButtonText.on('pointerdown', () => {
            this.scene.start('titleScene');
            this.clickSFX.play();
        });
    }
}
