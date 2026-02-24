import { GameSystem } from './GameSystem';
import { Board } from '../board/Board';
import {
  PieceType, PieceColor, EntityType, Position, Move, GameEvent,
  GameEventType, ChessPieceEntity,
} from '../game/types';

let pieceIdCounter = 0;
function nextPieceId(): string {
  return `chess_${pieceIdCounter++}`;
}

/**
 * ChessSystem — handles chess piece placement, movement, captures, and win condition.
 * Implements GameSystem so it plugs into TurnManager.
 * Contains NO Phaser code — pure game logic.
 */
export class ChessSystem implements GameSystem {
  readonly id = 'chess';

  onRegister(board: Board): void {
    pieceIdCounter = 0; // Reset IDs for each new game
    this.placeInitialPieces(board);
  }

  // ─── Initial Setup ────────────────────────────────

  private placeInitialPieces(board: Board): void {
    const backRow: PieceType[] = [
      PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen,
      PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook,
    ];

    // Black pieces (rows 0–1)
    for (let col = 0; col < 8; col++) {
      board.setEntity(0, col, this.createPiece(backRow[col], PieceColor.Black));
      board.setEntity(1, col, this.createPiece(PieceType.Pawn, PieceColor.Black));
    }

    // White pieces (rows 6–7)
    for (let col = 0; col < 8; col++) {
      board.setEntity(7, col, this.createPiece(backRow[col], PieceColor.White));
      board.setEntity(6, col, this.createPiece(PieceType.Pawn, PieceColor.White));
    }
  }

  private createPiece(type: PieceType, color: PieceColor): ChessPieceEntity {
    return {
      entityType: EntityType.ChessPiece,
      color,
      id: nextPieceId(),
      pieceType: type,
      hasMoved: false,
    };
  }

  // ─── Move Validation ──────────────────────────────

  getValidMoves(board: Board, pos: Position): Position[] {
    const entity = board.getEntity(pos.row, pos.col);
    if (!entity || entity.entityType !== EntityType.ChessPiece) return [];

    const piece = entity as ChessPieceEntity;

    switch (piece.pieceType) {
      case PieceType.Pawn:   return this.getPawnMoves(board, pos, piece);
      case PieceType.Rook:   return this.getSlidingMoves(board, pos, piece, [[0,1],[0,-1],[1,0],[-1,0]]);
      case PieceType.Bishop: return this.getSlidingMoves(board, pos, piece, [[1,1],[1,-1],[-1,1],[-1,-1]]);
      case PieceType.Queen:  return this.getSlidingMoves(board, pos, piece, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
      case PieceType.King:   return this.getKingMoves(board, pos, piece);
      case PieceType.Knight: return this.getKnightMoves(board, pos, piece);
      default: return [];
    }
  }

  // ─── Move Execution ───────────────────────────────

  onMove(board: Board, move: Move): GameEvent[] {
    const entity = board.getEntityAt(move.from);
    if (!entity || entity.entityType !== EntityType.ChessPiece) return [];

    const piece = entity as ChessPieceEntity;
    const events: GameEvent[] = [];

    // Check for capture
    const target = board.getEntityAt(move.to);
    if (target) {
      events.push({
        type: GameEventType.PieceCaptured,
        data: { captured: target, capturedBy: piece, at: move.to },
      });
    }

    // Execute move
    board.moveEntity(move.from.row, move.from.col, move.to.row, move.to.col);
    piece.hasMoved = true;

    events.push({
      type: GameEventType.PieceMoved,
      data: { piece, from: move.from, to: move.to },
    });

    return events;
  }

  // ─── Win Condition ────────────────────────────────

  checkWinCondition(board: Board): PieceColor | null {
    const kings = board.findEntities(e =>
      e.entityType === EntityType.ChessPiece &&
      (e as ChessPieceEntity).pieceType === PieceType.King
    );

    const whiteKing = kings.some(k => k.entity.color === PieceColor.White);
    const blackKing = kings.some(k => k.entity.color === PieceColor.Black);

    if (!whiteKing) return PieceColor.Black;
    if (!blackKing) return PieceColor.White;
    return null;
  }

  // ─── AI Support ───────────────────────────────────

  getAllMovesForColor(board: Board, color: PieceColor): Move[] {
    const pieces = board.findEntities(e =>
      e.entityType === EntityType.ChessPiece && e.color === color
    );

    const moves: Move[] = [];
    for (const { pos } of pieces) {
      const validMoves = this.getValidMoves(board, pos);
      for (const to of validMoves) {
        moves.push({ from: pos, to });
      }
    }
    return moves;
  }

  // ─── Move Generators ─────────────────────────────

  private getPawnMoves(board: Board, pos: Position, piece: ChessPieceEntity): Position[] {
    const moves: Position[] = [];
    const dir = piece.color === PieceColor.White ? -1 : 1;
    const startRow = piece.color === PieceColor.White ? 6 : 1;

    // Forward 1
    if (board.inBounds(pos.row + dir, pos.col) && !board.getEntity(pos.row + dir, pos.col)) {
      moves.push({ row: pos.row + dir, col: pos.col });

      // Forward 2 from starting row
      if (pos.row === startRow && !board.getEntity(pos.row + dir * 2, pos.col)) {
        moves.push({ row: pos.row + dir * 2, col: pos.col });
      }
    }

    // Diagonal captures
    for (const dc of [-1, 1]) {
      const nr = pos.row + dir;
      const nc = pos.col + dc;
      if (board.inBounds(nr, nc)) {
        const target = board.getEntity(nr, nc);
        if (target && target.color !== piece.color) {
          moves.push({ row: nr, col: nc });
        }
      }
    }

    return moves;
  }

  private getSlidingMoves(board: Board, pos: Position, piece: ChessPieceEntity, directions: number[][]): Position[] {
    const moves: Position[] = [];
    for (const [dr, dc] of directions) {
      let r = pos.row + dr;
      let c = pos.col + dc;
      while (board.inBounds(r, c)) {
        const target = board.getEntity(r, c);
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  private getKingMoves(board: Board, pos: Position, piece: ChessPieceEntity): Position[] {
    const moves: Position[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = pos.row + dr;
        const c = pos.col + dc;
        if (board.inBounds(r, c)) {
          const target = board.getEntity(r, c);
          if (!target || target.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
        }
      }
    }
    return moves;
  }

  private getKnightMoves(board: Board, pos: Position, piece: ChessPieceEntity): Position[] {
    const moves: Position[] = [];
    const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of offsets) {
      const r = pos.row + dr;
      const c = pos.col + dc;
      if (board.inBounds(r, c)) {
        const target = board.getEntity(r, c);
        if (!target || target.color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }
}
