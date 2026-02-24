import { BOARD_SIZE } from '../utils/Constants';
import { Piece, PieceType, PieceColor, Move } from '../game/types';

/**
 * Board — pure game logic for chess.
 * NO Phaser imports. This is the "logic layer" that the GameScene reads from.
 */
export class Board {
  private grid: (Piece | null)[][];
  private currentTurn: PieceColor = PieceColor.White;
  private whiteKingAlive = true;
  private blackKingAlive = true;

  constructor() {
    this.grid = this.createInitialBoard();
  }

  /** Standard chess starting position */
  private createInitialBoard(): (Piece | null)[][] {
    const grid: (Piece | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );

    const backRow: PieceType[] = [
      PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen,
      PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook,
    ];

    // Black pieces (rows 0–1)
    for (let col = 0; col < BOARD_SIZE; col++) {
      grid[0][col] = { type: backRow[col], color: PieceColor.Black, hasMoved: false };
      grid[1][col] = { type: PieceType.Pawn, color: PieceColor.Black, hasMoved: false };
    }

    // White pieces (rows 6–7)
    for (let col = 0; col < BOARD_SIZE; col++) {
      grid[7][col] = { type: backRow[col], color: PieceColor.White, hasMoved: false };
      grid[6][col] = { type: PieceType.Pawn, color: PieceColor.White, hasMoved: false };
    }

    return grid;
  }

  getPiece(row: number, col: number): Piece | null {
    if (!this.inBounds(row, col)) return null;
    return this.grid[row][col];
  }

  getCurrentTurn(): PieceColor {
    return this.currentTurn;
  }

  /** Attempt to move a piece. Returns true if the move was valid and executed. */
  movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const piece = this.grid[fromRow][fromCol];
    if (!piece) return false;
    if (piece.color !== this.currentTurn) return false;

    const validMoves = this.getValidMoves(fromRow, fromCol);
    const isValid = validMoves.some(m => m.row === toRow && m.col === toCol);
    if (!isValid) return false;

    // Check if capturing a king
    const target = this.grid[toRow][toCol];
    if (target?.type === PieceType.King) {
      if (target.color === PieceColor.White) this.whiteKingAlive = false;
      if (target.color === PieceColor.Black) this.blackKingAlive = false;
    }

    // Execute move
    this.grid[toRow][toCol] = piece;
    this.grid[fromRow][fromCol] = null;
    piece.hasMoved = true;

    // Switch turn
    this.currentTurn = this.currentTurn === PieceColor.White ? PieceColor.Black : PieceColor.White;
    return true;
  }

  /** Get all valid moves for a piece at (row, col) */
  getValidMoves(row: number, col: number): { row: number; col: number }[] {
    const piece = this.grid[row][col];
    if (!piece) return [];

    switch (piece.type) {
      case PieceType.Pawn:   return this.getPawnMoves(row, col, piece);
      case PieceType.Rook:   return this.getSlidingMoves(row, col, piece, [[0,1],[0,-1],[1,0],[-1,0]]);
      case PieceType.Bishop: return this.getSlidingMoves(row, col, piece, [[1,1],[1,-1],[-1,1],[-1,-1]]);
      case PieceType.Queen:  return this.getSlidingMoves(row, col, piece, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
      case PieceType.King:   return this.getKingMoves(row, col, piece);
      case PieceType.Knight: return this.getKnightMoves(row, col, piece);
      default: return [];
    }
  }

  /** Get all possible moves for a color */
  getAllMovesForColor(color: PieceColor): Move[] {
    const moves: Move[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = this.grid[row][col];
        if (piece && piece.color === color) {
          const validMoves = this.getValidMoves(row, col);
          for (const m of validMoves) {
            moves.push({ fromRow: row, fromCol: col, toRow: m.row, toCol: m.col });
          }
        }
      }
    }
    return moves;
  }

  /** Check if a king has been captured */
  checkWinner(): PieceColor | null {
    if (!this.whiteKingAlive) return PieceColor.Black;
    if (!this.blackKingAlive) return PieceColor.White;
    return null;
  }

  // --- Move Generators ---

  private getPawnMoves(row: number, col: number, piece: Piece): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    const dir = piece.color === PieceColor.White ? -1 : 1;
    const startRow = piece.color === PieceColor.White ? 6 : 1;

    // Forward 1
    if (this.inBounds(row + dir, col) && !this.grid[row + dir][col]) {
      moves.push({ row: row + dir, col });

      // Forward 2 (from starting position)
      if (row === startRow && !this.grid[row + dir * 2][col]) {
        moves.push({ row: row + dir * 2, col });
      }
    }

    // Diagonal captures
    for (const dc of [-1, 1]) {
      const nr = row + dir;
      const nc = col + dc;
      if (this.inBounds(nr, nc) && this.grid[nr][nc] && this.grid[nr][nc]!.color !== piece.color) {
        moves.push({ row: nr, col: nc });
      }
    }

    return moves;
  }

  private getSlidingMoves(row: number, col: number, piece: Piece, directions: number[][]): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (this.inBounds(r, c)) {
        const target = this.grid[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.color !== piece.color) {
            moves.push({ row: r, col: c }); // capture
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  private getKingMoves(row: number, col: number, piece: Piece): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (this.inBounds(r, c)) {
          const target = this.grid[r][c];
          if (!target || target.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
        }
      }
    }
    return moves;
  }

  private getKnightMoves(row: number, col: number, piece: Piece): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of offsets) {
      const r = row + dr;
      const c = col + dc;
      if (this.inBounds(r, c)) {
        const target = this.grid[r][c];
        if (!target || target.color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }

  private inBounds(row: number, col: number): boolean {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }
}
