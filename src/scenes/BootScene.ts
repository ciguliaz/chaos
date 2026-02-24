import Phaser from 'phaser';

/**
 * BootScene — preloads all assets, then transitions to MenuScene.
 * For now, just shows a loading bar. Add asset loading here as we add sprites/audio.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // --- Loading bar ---
    const { width, height } = this.scale;
    const barW = width * 0.6;
    const barH = 24;
    const barX = (width - barW) / 2;
    const barY = height / 2;

    const bg = this.add.rectangle(barX + barW / 2, barY, barW, barH, 0x222244);
    bg.setStrokeStyle(2, 0x6644aa);

    const fill = this.add.rectangle(barX + 2, barY, 0, barH - 4, 0x8855ff);
    fill.setOrigin(0, 0.5);

    const label = this.add.text(width / 2, barY - 30, 'Loading...', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      fill.width = (barW - 4) * value;
    });

    this.load.on('complete', () => {
      bg.destroy();
      fill.destroy();
      label.destroy();
    });

    // --- Preload assets here ---
    // this.load.image('king', 'assets/sprites/king.png');
    // this.load.audio('bgm', 'assets/audio/menu.mp3');
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
