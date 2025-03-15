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
        this.load.image("wallBG", "wall.jpg");
    }

    create() {
        // Background color
        //this.cameras.main.setBackgroundColor('#2D2B55');
        this.add.image(0, 0, "wallBG")
        .setOrigin(0.25, 0.08)
        .setDepth(-1)
        .setScrollFactor(1);

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
            this.cameras.main.centerX, 150, 'Wreck-It Ralph-Turbo’s Rampage', titleStyle
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

        let headerStyle2 = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '40px',
            color: '#0fcde7',
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
        this.add.text(this.cameras.main.centerX, 200, 'Game Design:', headerStyle2).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 250, 'Xifan Luo, Xuan He', headerStyle2).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 300, 'xluo46@ucsc.edu xhe83@ucsc.edu', headerStyle2).setOrigin(0.5);

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

        // // Title text
        // this.add.text(this.cameras.main.centerX, 100, 'Instructions', headerStyle).setOrigin(0.5);

        // // Instruction lines
        // this.add.text(
        //     this.cameras.main.centerX, 200,
        //     '1. Use the arrow keys to move your character. Press R to reset if needed.', textStyle
        // ).setOrigin(0.5);
        // this.add.text(
        //     this.cameras.main.centerX, 250,
        //     '2. Pick up coins or fuel simply by touching them', textStyle
        // ).setOrigin(0.5);
        // this.add.text(
        //     this.cameras.main.centerX, 300,
        //     '3. Your score appears above the player—grab as many points as possible!', textStyle
        // ).setOrigin(0.5);
        // this.add.text(
        //     this.cameras.main.centerX, 350,
        //     '4. Once you advance to a new area, you won’t be able to go back.', textStyle
        // ).setOrigin(0.5);
        // this.add.text(
        //     this.cameras.main.centerX, 400,
        //     '5. Watch out for enemies—your health decreases if they touch you. Pick up hearts to restore it.', textStyle
        // ).setOrigin(0.5);
        // this.add.text(
        //     this.cameras.main.centerX, 450,
        //     '6. Have fun playing!', textStyle
        // ).setOrigin(0.5);

        // Example revised styles
            let headerStyle2 = {
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

            let instructionsStyle = {
                fontFamily: 'Verdana, Geneva, sans-serif',
                fontSize: '20px',
                color: '#FFFFFF',
                align: 'center',
                wordWrap: { width: 600, useAdvancedWrap: true },
                stroke: '#000000',
                strokeThickness: 2,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000',
                    blur: 4,
                    stroke: true,
                    fill: true
                }
            };

            // Title text
            this.add.text(
                this.cameras.main.centerX,
                100,
                'Instructions',
                headerStyle
            ).setOrigin(0.5);

            // Instruction lines
            this.add.text(
                this.cameras.main.centerX, 200,
                '1. Use the arrow keys to move your character. Press R to reset if needed.',
                instructionsStyle
            ).setOrigin(0.5);

            this.add.text(
                this.cameras.main.centerX, 250,
                '2. Collect coins or fuel simply by touching them to boost your score.',
                instructionsStyle
            ).setOrigin(0.5);

            this.add.text(
                this.cameras.main.centerX, 300,
                '3. Your HP (health) is shown above your player—grab hearts to restore it.',
                instructionsStyle
            ).setOrigin(0.5);

            this.add.text(
                this.cameras.main.centerX, 350,
                '4. Once you move on to a new area, there’s no going back, so explore carefully!',
                instructionsStyle
            ).setOrigin(0.5);

            this.add.text(
                this.cameras.main.centerX, 400,
                '5. Enemies will damage your health if they touch you—avoid them or lose HP!',
                instructionsStyle
            ).setOrigin(0.5);

            this.add.text(
                this.cameras.main.centerX, 450,
                '6. Most importantly, have fun and enjoy Turbo’s Rampage!',
                instructionsStyle
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
//  ("Game Over") Scene
// -----------------------------------------------------
class GG extends Phaser.Scene {
    constructor() {
        super("ggScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('click', 'switch1.ogg');
        this.load.image("gg", "gg.jpg");
    }

    create() {
        //this.cameras.main.setBackgroundColor('#000000');
        // this.add.image(0, 0, "gg")
        // .setOrigin(0, 0)
        // .setDepth(-1)
        // .setScrollFactor(1);
        let bg = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            "gg"
          )
          .setOrigin(0.5, 0.5) // Center the image on its own midpoint
          .setDepth(-1)       // Behind everything else
          .setScrollFactor(1); // Lock it so it doesn't scroll
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.clickSFX = this.sound.add('click');

        this.ggText = this.add.text(
            this.cameras.main.centerX, 150, 
            'Game Over', 
            { font: '70px Arial', fill: '#0f16e7' }
        ).setOrigin(0.5);
        this.ggText = this.add.text(
            this.cameras.main.centerX, 200, 
            'Score: ' + score, 
            { font: '40px Arial', fill: '#d00fe7' }
        ).setOrigin(0.5);
        this.ButtonText = this.add.text(
            this.cameras.main.centerX, 250, 
            'Click to Return to Title', 
            { font: '40px Arial', fill: '#0f95e7' }
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
