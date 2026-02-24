import Phaser from 'phaser';
import { BOARD_SIZE, TILE_SIZE, BOARD_OFFSET_X, BOARD_OFFSET_Y } from '../utils/Constants';
import { Board } from '../board/Board';
import { PieceColor, PieceType } from '../game/types';

/**
 * GameScene — the core chess board gameplay.
 * Phase 1: renders an 8x8 grid with chess pieces and basic movement.
 */
export class GameScene extends Phaser.Scene {
  private board!: Board;
  private selectedTile: { row: number; col: number } | null = null;
  private tileGraphics: Phaser.GameObjects.Rectangle[][] = [];
  private pieceTexts: (Phaser.GameObjects.Text | null)[][] = [];
  private highlightGraphics: Phaser.GameObjects.Rectangle[] = [];
  private turnText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.board = new Board();
    this.selectedTile = null;
    this.tileGraphics = [];
    this.pieceTexts = [];
    this.highlightGraphics = [];

    this.createBoard();
    this.createUI();
    this.renderPieces();
  }

  /** Draw the 8x8 chessboard grid */
  private createBoard(): void {
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

  /** Create HUD elements */
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

    // Back to menu button
    const backBtn = this.add.text(10, 10, '← Menu', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666688',
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#aaaacc'));
    backBtn.on('pointerout', () => backBtn.setColor('#666688'));
    backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  /** Render chess pieces as Unicode characters on the board */
  private renderPieces(): void {
    // Clear old piece texts
    for (const row of this.pieceTexts) {
      if (row) {
        for (const text of row) {
          text?.destroy();
        }
      }
    }
    this.pieceTexts = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      this.pieceTexts[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.board.getPiece(row, col);
        if (piece) {
          const x = BOARD_OFFSET_X + col * TILE_SIZE + TILE_SIZE / 2;
          const y = BOARD_OFFSET_Y + row * TILE_SIZE + TILE_SIZE / 2;
          const symbol = this.getPieceSymbol(piece.type, piece.color);
          const text = this.add.text(x, y, symbol, {
            fontFamily: 'serif',
            fontSize: '40px',
            color: piece.color === PieceColor.White ? '#ffffff' : '#222222',
          }).setOrigin(0.5);

          // Add a subtle shadow for readability
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

  /** Handle tile click — select piece or move piece */
  private onTileClick(row: number, col: number): void {
    const currentTurn = this.board.getCurrentTurn();

    if (this.selectedTile) {
      // Try to move
      const from = this.selectedTile;
      const success = this.board.movePiece(from.row, from.col, row, col);

      this.clearHighlights();
      this.selectedTile = null;

      if (success) {
        this.renderPieces();

        // Check win/lose
        const winner = this.board.checkWinner();
        if (winner) {
          this.statusText.setText(`${winner === PieceColor.White ? 'White' : 'Black'} wins! King captured!`);
          this.statusText.setColor('#ffaa00');
          this.turnText.setText('GAME OVER');
          return;
        }

        this.turnText.setText(`Turn: ${this.board.getCurrentTurn() === PieceColor.White ? 'White' : 'Black'}`);
        this.statusText.setText('Select a piece to move');

        // If it's now Black's turn, trigger simple AI
        if (this.board.getCurrentTurn() === PieceColor.Black) {
          this.statusText.setText('Black is thinking...');
          this.time.delayedCall(400, () => this.doAIMove());
        }
      } else {
        // Invalid move — check if clicking own piece to re-select
        const piece = this.board.getPiece(row, col);
        if (piece && piece.color === currentTurn) {
          this.selectTile(row, col);
        } else {
          this.statusText.setText('Invalid move. Select a piece.');
        }
      }
    } else {
      // Select a piece
      const piece = this.board.getPiece(row, col);
      if (piece && piece.color === currentTurn) {
        this.selectTile(row, col);
      }
    }
  }

  /** Highlight selected tile and valid moves */
  private selectTile(row: number, col: number): void {
    this.clearHighlights();
    this.selectedTile = { row, col };

    // Highlight selected tile
    const sx = BOARD_OFFSET_X + col * TILE_SIZE;
    const sy = BOARD_OFFSET_Y + row * TILE_SIZE;
    const selRect = this.add.rectangle(sx, sy, TILE_SIZE - 1, TILE_SIZE - 1, 0xffff00, 0.3)
      .setOrigin(0, 0);
    this.highlightGraphics.push(selRect);

    // Highlight valid moves
    const validMoves = this.board.getValidMoves(row, col);
    for (const move of validMoves) {
      const mx = BOARD_OFFSET_X + move.col * TILE_SIZE;
      const my = BOARD_OFFSET_Y + move.row * TILE_SIZE;
      const hasPiece = this.board.getPiece(move.row, move.col) !== null;
      const moveColor = hasPiece ? 0xff4444 : 0x44ff44;
      const moveRect = this.add.rectangle(mx, my, TILE_SIZE - 1, TILE_SIZE - 1, moveColor, 0.25)
        .setOrigin(0, 0);
      this.highlightGraphics.push(moveRect);
    }

    const piece = this.board.getPiece(row, col);
    const pieceName = piece ? PieceType[piece.type] : '';
    this.statusText.setText(`Selected: ${pieceName} (${validMoves.length} moves)`);
  }

  private clearHighlights(): void {
    for (const rect of this.highlightGraphics) {
      rect.destroy();
    }
    this.highlightGraphics = [];
  }

  private isHighlighted(row: number, col: number): boolean {
    if (!this.selectedTile) return false;
    if (this.selectedTile.row === row && this.selectedTile.col === col) return true;
    const moves = this.board.getValidMoves(this.selectedTile.row, this.selectedTile.col);
    return moves.some(m => m.row === row && m.col === col);
  }

  /** Simple AI: pick a random valid move for Black */
  private doAIMove(): void {
    const allMoves = this.board.getAllMovesForColor(PieceColor.Black);
    if (allMoves.length === 0) {
      this.statusText.setText('Black has no moves — stalemate?');
      return;
    }

    // Prioritize captures, then random
    const captures = allMoves.filter(m => this.board.getPiece(m.toRow, m.toCol) !== null);
    const chosen = captures.length > 0
      ? captures[Math.floor(Math.random() * captures.length)]
      : allMoves[Math.floor(Math.random() * allMoves.length)];

    this.board.movePiece(chosen.fromRow, chosen.fromCol, chosen.toRow, chosen.toCol);
    this.renderPieces();

    const winner = this.board.checkWinner();
    if (winner) {
      this.statusText.setText(`${winner === PieceColor.White ? 'White' : 'Black'} wins!`);
      this.statusText.setColor('#ffaa00');
      this.turnText.setText('GAME OVER');
      return;
    }

    this.turnText.setText('Turn: White');
    this.statusText.setText('Your turn — select a piece');
  }

  /** Get Unicode chess symbol */
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
