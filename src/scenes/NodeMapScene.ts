import Phaser from 'phaser';
import { RunState } from '../map/RunState';
import { MapNode, NodeStatus, NodeType } from '../map/MapNode';

/**
 * NodeMapScene — Inscryption-inspired dark node map.
 * Renders the region's nodes as a vertical path.
 * Click an available node to enter combat.
 */
export class NodeMapScene extends Phaser.Scene {
  private runState!: RunState;

  constructor() {
    super({ key: 'NodeMapScene' });
  }

  init(data: { runState?: RunState }): void {
    // Get run state from scene data, or create a new run
    this.runState = data.runState ?? RunState.newRun();
  }

  create(): void {
    const { width, height } = this.scale;

    // ─── Dark atmospheric background ─────────────────
    this.cameras.main.setBackgroundColor('#0d0d1a');

    // Ambient particles (floating dust)
    this.addAmbientParticles(width, height);

    // ─── Region title ────────────────────────────────
    this.add.text(width / 2, 30, `♟  ${this.runState.nodeMap.regionName}`, {
      fontFamily: 'monospace',
      fontSize: '26px',
      color: '#c9a84c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Progress subtitle
    const completed = this.runState.nodeMap.getCompletedNodes().length;
    const total = this.runState.nodeMap.nodes.length;
    this.add.text(width / 2, 58, `${completed} / ${total} completed`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666688',
    }).setOrigin(0.5);

    // ─── Draw connections (lines between nodes) ──────
    this.drawConnections(width, height);

    // ─── Draw nodes ──────────────────────────────────
    for (const node of this.runState.nodeMap.nodes) {
      this.drawNode(node, width, height);
    }

    // ─── Gold display ────────────────────────────────
    this.add.text(width - 15, height - 15, `💰 ${this.runState.gold} gold`, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#c9a84c',
    }).setOrigin(1, 1);

    // ─── Back to menu ────────────────────────────────
    const backBtn = this.add.text(15, height - 15, '← Abandon Run', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#664444',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#aa6666'));
    backBtn.on('pointerout', () => backBtn.setColor('#664444'));
    backBtn.on('pointerdown', () => this.scene.start('MenuScene'));

    // ─── Check run completion ────────────────────────
    if (this.runState.isRunComplete()) {
      this.showRunComplete(width, height);
    }
  }

  // ─── Node Drawing ──────────────────────────────────

  private drawNode(node: MapNode, sceneW: number, sceneH: number): void {
    const x = node.x * sceneW;
    const y = node.y * sceneH;
    const radius = 24;

    // Node circle
    const { fillColor, strokeColor, alpha } = this.getNodeColors(node);
    const circle = this.add.circle(x, y, radius, fillColor, alpha)
      .setStrokeStyle(2, strokeColor);

    // Node icon
    const icon = this.getNodeIcon(node);
    const iconText = this.add.text(x, y, icon, {
      fontFamily: 'serif',
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Node label (below)
    const labelColor = node.status === NodeStatus.Completed ? '#446644'
      : node.status === NodeStatus.Available ? '#ccccdd'
      : '#444455';

    this.add.text(x, y + radius + 12, node.label, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: labelColor,
    }).setOrigin(0.5);

    // Completed checkmark overlay
    if (node.status === NodeStatus.Completed) {
      this.add.text(x + radius - 4, y - radius + 2, '✓', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#44ff44',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // ─── Interactivity ───────────────────────────────
    if (node.status === NodeStatus.Available) {
      circle.setInteractive({ useHandCursor: true });

      // Glow pulse animation
      this.tweens.add({
        targets: circle,
        scaleX: 1.08,
        scaleY: 1.08,
        alpha: 0.9,
        duration: 800,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      });

      circle.on('pointerover', () => {
        circle.setStrokeStyle(3, 0xffff88);
        iconText.setScale(1.15);
      });

      circle.on('pointerout', () => {
        circle.setStrokeStyle(2, strokeColor);
        iconText.setScale(1);
      });

      circle.on('pointerdown', () => {
        this.enterNode(node.id);
      });
    }
  }

  private getNodeColors(node: MapNode): { fillColor: number; strokeColor: number; alpha: number } {
    if (node.status === NodeStatus.Completed) {
      return { fillColor: 0x223322, strokeColor: 0x448844, alpha: 0.6 };
    }
    if (node.status === NodeStatus.Available) {
      switch (node.type) {
        case NodeType.Boss:
          return { fillColor: 0x6b2020, strokeColor: 0xff4444, alpha: 0.9 };
        case NodeType.Elite:
          return { fillColor: 0x6b4b20, strokeColor: 0xffaa44, alpha: 0.9 };
        default:
          return { fillColor: 0x2a2a4e, strokeColor: 0x6666cc, alpha: 0.9 };
      }
    }
    // Locked
    return { fillColor: 0x151520, strokeColor: 0x333344, alpha: 0.4 };
  }

  private getNodeIcon(node: MapNode): string {
    if (node.status === NodeStatus.Completed) return '✓';

    switch (node.type) {
      case NodeType.Combat: return '⚔️';
      case NodeType.Elite: return '🔥';
      case NodeType.Boss: return '👑';
      case NodeType.Reward: return '🎁';
      case NodeType.Rest: return '⛺';
      case NodeType.Shop: return '🏪';
      case NodeType.Mystery: return '❓';
      case NodeType.Gamble: return '🎰';
      default: return '•';
    }
  }

  // ─── Connection Lines ──────────────────────────────

  private drawConnections(sceneW: number, sceneH: number): void {
    const graphics = this.add.graphics();

    for (const node of this.runState.nodeMap.nodes) {
      for (const connId of node.connections) {
        const target = this.runState.nodeMap.getNode(connId);
        if (!target) continue;

        const x1 = node.x * sceneW;
        const y1 = node.y * sceneH;
        const x2 = target.x * sceneW;
        const y2 = target.y * sceneH;

        // Color based on completion
        const isCompleted = node.status === NodeStatus.Completed;
        const lineColor = isCompleted ? 0x448844 : 0x333355;
        const lineAlpha = isCompleted ? 0.8 : 0.4;

        graphics.lineStyle(2, lineColor, lineAlpha);
        graphics.beginPath();
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.strokePath();
      }
    }
  }

  // ─── Ambient Effects ───────────────────────────────

  private addAmbientParticles(w: number, h: number): void {
    // Simple floating dots for atmosphere
    for (let i = 0; i < 20; i++) {
      const dot = this.add.circle(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h),
        Phaser.Math.Between(1, 2),
        0x4444aa,
        0.3
      );

      this.tweens.add({
        targets: dot,
        y: dot.y - Phaser.Math.Between(30, 80),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        ease: 'Sine.easeIn',
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          dot.setPosition(Phaser.Math.Between(0, w), Phaser.Math.Between(h * 0.5, h));
          dot.setAlpha(0.3);
        },
      });
    }
  }

  // ─── Navigation ────────────────────────────────────

  private enterNode(nodeId: string): void {
    this.runState.enterNode(nodeId);
    this.scene.start('GameScene', { runState: this.runState });
  }

  // ─── Run Complete ──────────────────────────────────

  private showRunComplete(w: number, h: number): void {
    // Overlay
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6);

    this.add.text(w / 2, h * 0.35, '🏆 REGION COMPLETE!', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#c9a84c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.45, `Gold earned: ${this.runState.gold}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#aaaacc',
    }).setOrigin(0.5);

    const btn = this.add.rectangle(w / 2, h * 0.58, 220, 45, 0x4a2d8a)
      .setStrokeStyle(2, 0x8855ff)
      .setInteractive({ useHandCursor: true });

    this.add.text(w / 2, h * 0.58, '← Back to Menu', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    btn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
