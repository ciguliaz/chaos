import { Board } from '../board/Board';
import { PieceColor, Position, Move, GameEvent } from '../game/types';

/**
 * GameSystem — interface for pluggable game mechanics.
 * Each region introduces a new system. Systems are registered with TurnManager
 * and called during the turn lifecycle.
 *
 * Systems should NOT import or depend on each other.
 * They communicate via the shared Board state and GameEvents.
 */
export interface GameSystem {
  /** Unique identifier for this system (e.g., 'chess', 'minesweeper') */
  readonly id: string;

  /** Called once when the system is registered. Set up initial state. */
  onRegister(board: Board): void;

  /** Called at the start of each turn. */
  onTurnStart?(color: PieceColor): void;

  /**
   * Return valid moves for an entity at the given position.
   * Return empty array if this system doesn't govern that entity.
   */
  getValidMoves?(board: Board, pos: Position): Position[];

  /**
   * Called when a move is executed. The system can react (e.g., capture logic).
   * Return any events that occurred.
   */
  onMove?(board: Board, move: Move): GameEvent[];

  /** Called at the end of each turn. Systems can react (e.g., spawn enemies). */
  onTurnEnd?(color: PieceColor): void;

  /**
   * Check if this system's win/lose condition is met.
   * Return the winning color, or null if the game continues.
   */
  checkWinCondition?(board: Board): PieceColor | null;

  /**
   * Get all possible moves for a given color.
   * Used by AI to enumerate options.
   */
  getAllMovesForColor?(board: Board, color: PieceColor): Move[];
}
