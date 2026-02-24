import { describe, it, expect, beforeEach } from 'vitest';
import { ChessSystem } from './ChessSystem';
import { Board } from '../board/Board';
import {
  PieceType, PieceColor, EntityType, ChessPieceEntity,
} from '../game/types';

function getPiece(board: Board, row: number, col: number): ChessPieceEntity | null {
  const entity = board.getEntity(row, col);
  if (entity?.entityType === EntityType.ChessPiece) return entity as ChessPieceEntity;
  return null;
}

describe('ChessSystem', () => {
  let board: Board;
  let chess: ChessSystem;

  beforeEach(() => {
    board = new Board(8, 8);
    chess = new ChessSystem();
    chess.onRegister(board);
  });

  describe('initial setup', () => {
    it('places all 32 pieces correctly', () => {
      const all = board.findEntities(() => true);
      expect(all).toHaveLength(32);
    });

    it('places white pieces on rows 6 and 7', () => {
      const whites = board.findEntities(e => e.color === PieceColor.White);
      expect(whites).toHaveLength(16);
      for (const { pos } of whites) {
        expect(pos.row).toBeGreaterThanOrEqual(6);
      }
    });

    it('places black pieces on rows 0 and 1', () => {
      const blacks = board.findEntities(e => e.color === PieceColor.Black);
      expect(blacks).toHaveLength(16);
      for (const { pos } of blacks) {
        expect(pos.row).toBeLessThanOrEqual(1);
      }
    });

    it('places kings at e1 and e8', () => {
      const whiteKing = getPiece(board, 7, 4);
      expect(whiteKing?.pieceType).toBe(PieceType.King);
      expect(whiteKing?.color).toBe(PieceColor.White);

      const blackKing = getPiece(board, 0, 4);
      expect(blackKing?.pieceType).toBe(PieceType.King);
      expect(blackKing?.color).toBe(PieceColor.Black);
    });
  });

  describe('pawn moves', () => {
    it('can move forward 1 or 2 from starting position', () => {
      const moves = chess.getValidMoves(board, { row: 6, col: 4 });
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 4 });
      expect(moves).toHaveLength(2);
    });

    it('can only move 1 after first move', () => {
      // Move pawn forward
      chess.onMove(board, { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } });
      const moves = chess.getValidMoves(board, { row: 4, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 4 });
      expect(moves).toHaveLength(1);
    });

    it('can capture diagonally', () => {
      // Move white pawn to row 5
      chess.onMove(board, { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } });
      // Move black pawn to row 3 col 3 (beside white pawn's diagonal)
      chess.onMove(board, { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } });
      // Now white pawn at (4,4) should be able to capture at (3,3)
      const moves = chess.getValidMoves(board, { row: 4, col: 4 });
      expect(moves).toContainEqual({ row: 3, col: 3 }); // capture
      expect(moves).toContainEqual({ row: 3, col: 4 }); // forward
    });

    it('cannot move forward if blocked', () => {
      // Place a piece directly in front
      chess.onMove(board, { from: { row: 1, col: 4 }, to: { row: 5, col: 4 } });
      const moves = chess.getValidMoves(board, { row: 6, col: 4 });
      // Pawn at (6,4) blocked by piece at (5,4)
      const forwardMoves = moves.filter(m => m.col === 4);
      expect(forwardMoves).toHaveLength(0);
    });
  });

  describe('knight moves', () => {
    it('moves in L-shape from starting position', () => {
      const moves = chess.getValidMoves(board, { row: 7, col: 1 }); // b1 knight
      expect(moves).toContainEqual({ row: 5, col: 0 }); // a3
      expect(moves).toContainEqual({ row: 5, col: 2 }); // c3
      expect(moves).toHaveLength(2);
    });

    it('can jump over pieces', () => {
      // Knight can jump over pawns
      const moves = chess.getValidMoves(board, { row: 7, col: 6 }); // g1 knight
      expect(moves.length).toBeGreaterThan(0);
    });
  });

  describe('rook moves', () => {
    it('has no moves from starting position (blocked by pawns)', () => {
      const moves = chess.getValidMoves(board, { row: 7, col: 0 }); // a1 rook
      expect(moves).toHaveLength(0);
    });

    it('slides along rows and columns when unblocked', () => {
      // Remove pawn in front of rook
      board.removeEntity(6, 0);
      const moves = chess.getValidMoves(board, { row: 7, col: 0 });
      // Should slide up the a-file (6,0) through (1,0) but stopped by black pawn
      expect(moves.length).toBeGreaterThan(0);
      expect(moves).toContainEqual({ row: 6, col: 0 });
      expect(moves).toContainEqual({ row: 5, col: 0 });
    });
  });

  describe('bishop moves', () => {
    it('has no moves from starting position (blocked by pawns)', () => {
      const moves = chess.getValidMoves(board, { row: 7, col: 2 }); // c1 bishop
      expect(moves).toHaveLength(0);
    });
  });

  describe('queen moves', () => {
    it('has no moves from starting position (blocked)', () => {
      const moves = chess.getValidMoves(board, { row: 7, col: 3 }); // d1 queen
      expect(moves).toHaveLength(0);
    });
  });

  describe('king moves', () => {
    it('has no moves from starting position (blocked by own pieces)', () => {
      const moves = chess.getValidMoves(board, { row: 7, col: 4 }); // e1 king
      expect(moves).toHaveLength(0);
    });
  });

  describe('move execution', () => {
    it('moves piece and returns events', () => {
      const events = chess.onMove(board, { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } });
      expect(events.length).toBeGreaterThan(0);
      expect(board.getEntity(6, 4)).toBeNull();
      expect(board.getEntity(4, 4)).not.toBeNull();
    });

    it('returns capture event on capture', () => {
      // Set up a direct capture scenario
      board.removeEntity(4, 4); // clear tile
      chess.onMove(board, { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } });
      chess.onMove(board, { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } });
      // Now capture
      const events = chess.onMove(board, { from: { row: 4, col: 4 }, to: { row: 3, col: 3 } });
      const captures = events.filter(e => e.type === 'PieceCaptured');
      expect(captures).toHaveLength(1);
    });
  });

  describe('win condition', () => {
    it('returns null when both kings alive', () => {
      expect(chess.checkWinCondition(board)).toBeNull();
    });

    it('returns Black when white king removed', () => {
      board.removeEntity(7, 4); // remove white king
      expect(chess.checkWinCondition(board)).toBe(PieceColor.Black);
    });

    it('returns White when black king removed', () => {
      board.removeEntity(0, 4); // remove black king
      expect(chess.checkWinCondition(board)).toBe(PieceColor.White);
    });
  });

  describe('getAllMovesForColor', () => {
    it('returns all valid moves for white', () => {
      const moves = chess.getAllMovesForColor(board, PieceColor.White);
      // Pawns: 2 moves each × 8 = 16 + Knights: 2 moves each × 2 = 4 = 20
      expect(moves).toHaveLength(20);
    });

    it('returns all valid moves for black', () => {
      const moves = chess.getAllMovesForColor(board, PieceColor.Black);
      expect(moves).toHaveLength(20);
    });
  });
});
