import Phaser from 'phaser';

/**
 * MenuScene — main menu with title and start button.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // Title
    this.add.text(width / 2, height * 0.3, 'CHAOS PROTOCOL', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height * 0.42, 'Every game. One board. Pure chaos.', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#8888cc',
    }).setOrigin(0.5);

    // Start button
    const btnBg = this.add.rectangle(width / 2, height * 0.6, 200, 50, 0x4a2d8a)
      .setStrokeStyle(2, 0x8855ff)
      .setInteractive({ useHandCursor: true });

    const btnText = this.add.text(width / 2, height * 0.6, '▶  START', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Hover effects
    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x6644aa);
      btnText.setColor('#ffff88');
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x4a2d8a);
      btnText.setColor('#ffffff');
    });
    btnBg.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Version
    this.add.text(width - 10, height - 10, 'v0.1-dev', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#555577',
    }).setOrigin(1, 1);
  }
}
