import { describe, it, expect, beforeEach } from 'vitest';
import { TurnManager } from './TurnManager';
import { ChessSystem } from './ChessSystem';
import { Board } from '../board/Board';
import { PieceColor } from '../game/types';

describe('TurnManager', () => {
  let board: Board;
  let manager: TurnManager;

  beforeEach(() => {
    board = new Board(8, 8);
    manager = new TurnManager(board);
    manager.registerSystem(new ChessSystem());
  });

  describe('initialization', () => {
    it('starts on White turn', () => {
      expect(manager.getCurrentTurn()).toBe(PieceColor.White);
    });

    it('board has pieces after system registration', () => {
      const entities = board.findEntities(() => true);
      expect(entities).toHaveLength(32);
    });
  });

  describe('turn flow', () => {
    it('switches turn after endTurn', () => {
      expect(manager.getCurrentTurn()).toBe(PieceColor.White);
      manager.endTurn();
      expect(manager.getCurrentTurn()).toBe(PieceColor.Black);
      manager.endTurn();
      expect(manager.getCurrentTurn()).toBe(PieceColor.White);
    });
  });

  describe('valid moves', () => {
    it('returns pawn moves from starting position', () => {
      const moves = manager.getValidMoves({ row: 6, col: 4 });
      expect(moves).toHaveLength(2);
      expect(moves).toContainEqual({ row: 5, col: 4 });
      expect(moves).toContainEqual({ row: 4, col: 4 });
    });

    it('returns empty for empty tiles', () => {
      const moves = manager.getValidMoves({ row: 4, col: 4 });
      expect(moves).toHaveLength(0);
    });
  });

  describe('move execution', () => {
    it('executes a move and generates events', () => {
      const events = manager.executeMove({
        from: { row: 6, col: 4 },
        to: { row: 4, col: 4 },
      });
      expect(events.length).toBeGreaterThan(0);
      expect(board.getEntity(4, 4)).not.toBeNull();
      expect(board.getEntity(6, 4)).toBeNull();
    });

    it('event log accumulates', () => {
      manager.executeMove({ from: { row: 6, col: 4 }, to: { row: 4, col: 4 } });
      manager.endTurn();
      manager.executeMove({ from: { row: 1, col: 4 }, to: { row: 3, col: 4 } });
      expect(manager.getEventLog().length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('win condition', () => {
    it('returns null during normal play', () => {
      expect(manager.checkWinCondition()).toBeNull();
    });

    it('detects when a king is captured', () => {
      board.removeEntity(0, 4); // remove black king
      expect(manager.checkWinCondition()).toBe(PieceColor.White);
    });
  });

  describe('getAllMovesForColor', () => {
    it('returns moves for White', () => {
      const moves = manager.getAllMovesForColor(PieceColor.White);
      expect(moves.length).toBe(20); // 16 pawn + 4 knight
    });

    it('returns moves for Black', () => {
      const moves = manager.getAllMovesForColor(PieceColor.Black);
      expect(moves.length).toBe(20);
    });
  });

  describe('multiple systems', () => {
    it('aggregates moves from multiple registered systems', () => {
      // Currently only chess — when we add minesweeper,
      // its moves would also appear here.
      // This test confirms the aggregation pipeline works.
      const moves = manager.getValidMoves({ row: 6, col: 0 });
      expect(moves.length).toBeGreaterThan(0);
    });
  });

  describe('full game simulation', () => {
    it('can play a sequence of moves without crashing', () => {
      // Scholar's mate opening moves
      manager.executeMove({ from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }); // e2→e4
      manager.endTurn();
      manager.executeMove({ from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }); // e7→e5
      manager.endTurn();
      manager.executeMove({ from: { row: 7, col: 5 }, to: { row: 4, col: 2 } }); // Bf1→c4
      manager.endTurn();

      expect(manager.getCurrentTurn()).toBe(PieceColor.Black);
      expect(manager.checkWinCondition()).toBeNull();

      // Board state should be consistent
      expect(board.getEntity(4, 4)).not.toBeNull(); // white pawn
      expect(board.getEntity(3, 4)).not.toBeNull(); // black pawn
      expect(board.getEntity(4, 2)).not.toBeNull(); // white bishop
    });
  });
});
