import Phaser from 'phaser';
import { BOARD_SIZE, TILE_SIZE, BOARD_OFFSET_X, BOARD_OFFSET_Y } from '../utils/Constants';
import { Board } from '../board/Board';
import { TurnManager } from '../systems/TurnManager';
import { ChessSystem } from '../systems/ChessSystem';
import {
  PieceColor, PieceType, EntityType,
  ChessPieceEntity, Position,
} from '../game/types';
import { RunState } from '../map/RunState';

/**
 * GameScene — the core board gameplay.
 * Uses the modular system architecture:
 *   Board (generic grid) + TurnManager + ChessSystem (pluggable)
 */
export class GameScene extends Phaser.Scene {
  private board!: Board;
  private turnManager!: TurnManager;
  private selectedTile: Position | null = null;
  private tileGraphics: Phaser.GameObjects.Rectangle[][] = [];
  private pieceTexts: (Phaser.GameObjects.Text | null)[][] = [];
  private highlightGraphics: Phaser.GameObjects.Rectangle[] = [];
  private turnText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private gameOver = false;
  private isAIThinking = false;
  private runState: RunState | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { runState?: RunState }): void {
    this.runState = data.runState ?? null;
  }

  create(): void {
    // ─── Set up modular architecture ────────────────
    this.board = new Board(BOARD_SIZE, BOARD_SIZE);
    this.turnManager = new TurnManager(this.board);

    // Register game systems (add more here as we build regions)
    this.turnManager.registerSystem(new ChessSystem());

    // ─── Reset state ────────────────────────────────
    this.selectedTile = null;
    this.tileGraphics = [];
    this.pieceTexts = [];
    this.highlightGraphics = [];
    this.gameOver = false;
    this.isAIThinking = false;

    // ─── Render ─────────────────────────────────────
    this.createBoardGraphics();
    this.createUI();
    this.renderEntities();
  }

  // ─── Board Rendering ──────────────────────────────

  private createBoardGraphics(): void {
    for (let row = 0; row < BOARD_SIZE; row++) {
      this.tileGraphics[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const x = BOARD_OFFSET_X + col * TILE_SIZE;
        const y = BOARD_OFFSET_Y + row * TILE_SIZE;
        const isDark = (row + col) % 2 === 1;
        const color = isDark ? 0x4a3660 : 0x6b5080;

        const tile = this.add.rectangle(x, y, TILE_SIZE - 1, TILE_SIZE - 1, color)
          .setOrigin(0, 0)
          .setInteractive({ useHandCursor: true });

        tile.on('pointerdown', () => this.onTileClick(row, col));
        tile.on('pointerover', () => {
          if (!this.isHighlighted(row, col)) {
            tile.setFillStyle(isDark ? 0x5a4670 : 0x7b6090);
          }
        });
        tile.on('pointerout', () => {
          if (!this.isHighlighted(row, col)) {
            tile.setFillStyle(color);
          }
        });

        this.tileGraphics[row][col] = tile;
      }
    }
  }

  // ─── UI ───────────────────────────────────────────

  private createUI(): void {
    this.turnText = this.add.text(BOARD_OFFSET_X, 10, 'Turn: White', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    });

    this.statusText = this.add.text(BOARD_OFFSET_X, 30, 'Select a piece to move', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#8888cc',
    });

    const backLabel = this.runState ? '← Map' : '← Menu';
    const backBtn = this.add.text(10, 10, backLabel, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666688',
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#aaaacc'));
    backBtn.on('pointerout', () => backBtn.setColor('#666688'));
    backBtn.on('pointerdown', () => {
      if (this.runState) {
        // Reset node from Active back to Available (abandoning mid-battle)
        if (this.runState.currentNodeId) {
          this.runState.nodeMap.abandonNode(this.runState.currentNodeId);
          this.runState.currentNodeId = null;
        }
        this.scene.start('NodeMapScene', { runState: this.runState });
      } else {
        this.scene.start('MenuScene');
      }
    });
  }

  // ─── Entity Rendering ────────────────────────────

  private renderEntities(): void {
    // Clear old
    for (const row of this.pieceTexts) {
      if (row) for (const text of row) text?.destroy();
    }
    this.pieceTexts = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      this.pieceTexts[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const entity = this.board.getEntity(row, col);

        if (entity && entity.entityType === EntityType.ChessPiece) {
          const piece = entity as ChessPieceEntity;
          const x = BOARD_OFFSET_X + col * TILE_SIZE + TILE_SIZE / 2;
          const y = BOARD_OFFSET_Y + row * TILE_SIZE + TILE_SIZE / 2;
          const symbol = this.getPieceSymbol(piece.pieceType, piece.color);

          const text = this.add.text(x, y, symbol, {
            fontFamily: 'serif',
            fontSize: '40px',
            color: piece.color === PieceColor.White ? '#ffffff' : '#222222',
          }).setOrigin(0.5);

          if (piece.color === PieceColor.White) {
            text.setStroke('#000000', 2);
          } else {
            text.setStroke('#888888', 2);
          }

          this.pieceTexts[row][col] = text;
        } else {
          this.pieceTexts[row][col] = null;
        }
      }
    }
  }

  // ─── Input Handling ───────────────────────────────

  private onTileClick(row: number, col: number): void {
    if (this.gameOver || this.isAIThinking) return;

    const currentTurn = this.turnManager.getCurrentTurn();

    if (this.selectedTile) {
      // Try to move
      const from = this.selectedTile;
      const validMoves = this.turnManager.getValidMoves(from);
      const isValid = validMoves.some(m => m.row === row && m.col === col);

      this.clearHighlights();
      this.selectedTile = null;

      if (isValid) {
        // Execute move through TurnManager
        this.turnManager.executeMove({ from, to: { row, col } });
        this.turnManager.endTurn();
        this.renderEntities();

        // Check win
        const winner = this.turnManager.checkWinCondition();
        if (winner) {
          this.onGameOver(winner);
          return;
        }

        this.turnText.setText(`Turn: ${this.turnManager.getCurrentTurn() === PieceColor.White ? 'White' : 'Black'}`);
        this.statusText.setText('Select a piece to move');

        // AI turn
        if (this.turnManager.getCurrentTurn() === PieceColor.Black) {
          this.statusText.setText('Black is thinking...');
          this.isAIThinking = true;
          this.time.delayedCall(400, () => this.doAIMove());
        }
      } else {
        // Re-select if clicking own piece
        const entity = this.board.getEntity(row, col);
        if (entity && entity.color === currentTurn) {
          this.selectTile(row, col);
        } else {
          this.statusText.setText('Invalid move. Select a piece.');
        }
      }
    } else {
      // Select a piece
      const entity = this.board.getEntity(row, col);
      if (entity && entity.color === currentTurn) {
        this.selectTile(row, col);
      }
    }
  }

  // ─── Selection & Highlighting ─────────────────────

  private selectTile(row: number, col: number): void {
    this.clearHighlights();
    this.selectedTile = { row, col };

    // Highlight selected
    const sx = BOARD_OFFSET_X + col * TILE_SIZE;
    const sy = BOARD_OFFSET_Y + row * TILE_SIZE;
    this.highlightGraphics.push(
      this.add.rectangle(sx, sy, TILE_SIZE - 1, TILE_SIZE - 1, 0xffff00, 0.3).setOrigin(0, 0)
    );

    // Highlight valid moves
    const validMoves = this.turnManager.getValidMoves({ row, col });
    for (const move of validMoves) {
      const mx = BOARD_OFFSET_X + move.col * TILE_SIZE;
      const my = BOARD_OFFSET_Y + move.row * TILE_SIZE;
      const hasEntity = this.board.getEntity(move.row, move.col) !== null;
      const moveColor = hasEntity ? 0xff4444 : 0x44ff44;
      this.highlightGraphics.push(
        this.add.rectangle(mx, my, TILE_SIZE - 1, TILE_SIZE - 1, moveColor, 0.25).setOrigin(0, 0)
      );
    }

    const entity = this.board.getEntity(row, col);
    const pieceName = entity?.entityType === EntityType.ChessPiece
      ? (entity as ChessPieceEntity).pieceType
      : 'Entity';
    this.statusText.setText(`Selected: ${pieceName} (${validMoves.length} moves)`);
  }

  private clearHighlights(): void {
    for (const rect of this.highlightGraphics) rect.destroy();
    this.highlightGraphics = [];
  }

  private isHighlighted(row: number, col: number): boolean {
    if (!this.selectedTile) return false;
    if (this.selectedTile.row === row && this.selectedTile.col === col) return true;
    const moves = this.turnManager.getValidMoves(this.selectedTile);
    return moves.some(m => m.row === row && m.col === col);
  }

  // ─── AI ───────────────────────────────────────────

  private doAIMove(): void {
    if (this.gameOver) return;

    this.isAIThinking = true;

    const allMoves = this.turnManager.getAllMovesForColor(PieceColor.Black);
    if (allMoves.length === 0) {
      this.statusText.setText('Black has no moves — stalemate?');
      return;
    }

    // Prioritize captures
    const captures = allMoves.filter(m => this.board.getEntity(m.to.row, m.to.col) !== null);
    const chosen = captures.length > 0
      ? captures[Math.floor(Math.random() * captures.length)]
      : allMoves[Math.floor(Math.random() * allMoves.length)];

    this.turnManager.executeMove(chosen);
    this.turnManager.endTurn();
    this.renderEntities();

    const winner = this.turnManager.checkWinCondition();
    if (winner) {
      this.onGameOver(winner);
      return;
    }

    this.turnText.setText('Turn: White');
    this.statusText.setText('Your turn — select a piece');
    this.isAIThinking = false;
  }

  // ─── Game Over ────────────────────────────────────

  private onGameOver(winner: PieceColor): void {
    this.gameOver = true;
    const playerWon = winner === PieceColor.White;
    this.statusText.setText(playerWon ? 'Victory! King captured!' : 'Defeat... Your king has fallen.');
    this.statusText.setColor(playerWon ? '#44ff44' : '#ff4444');
    this.turnText.setText(playerWon ? 'VICTORY' : 'DEFEAT');

    // Show continue/retry button
    const { width, height } = this.scale;
    const btnLabel = playerWon ? '▶  Continue' : '↻  Try Again';

    const btnBg = this.add.rectangle(width / 2, height - 40, 200, 42, playerWon ? 0x2a5a2a : 0x5a2a2a)
      .setStrokeStyle(2, playerWon ? 0x44ff44 : 0xff4444)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height - 40, btnLabel, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    btnBg.on('pointerdown', () => {
      if (playerWon && this.runState) {
        // Mark node completed and return to map
        this.runState.completeCurrentNode();
        this.scene.start('NodeMapScene', { runState: this.runState });
      } else {
        // Lose = back to menu
        this.scene.start('MenuScene');
      }
    });
  }

  // ─── Helpers ──────────────────────────────────────

  private getPieceSymbol(type: PieceType, color: PieceColor): string {
    const symbols: Record<PieceType, [string, string]> = {
      [PieceType.King]:   ['♔', '♚'],
      [PieceType.Queen]:  ['♕', '♛'],
      [PieceType.Rook]:   ['♖', '♜'],
      [PieceType.Bishop]: ['♗', '♝'],
      [PieceType.Knight]: ['♘', '♞'],
      [PieceType.Pawn]:   ['♙', '♟'],
    };
    return symbols[type][color === PieceColor.White ? 0 : 1];
  }
}
