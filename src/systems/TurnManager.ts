import { GameSystem } from './GameSystem';
import { Board } from '../board/Board';
import { PieceColor, Position, Move, GameEvent } from '../game/types';

/**
 * TurnManager — orchestrates all active game systems.
 * Manages turn order, aggregates valid moves from all systems,
 * and checks win conditions across all systems.
 */
export class TurnManager {
  private systems: GameSystem[] = [];
  private currentTurn: PieceColor = PieceColor.White;
  private board: Board;
  private eventLog: GameEvent[] = [];

  constructor(board: Board) {
    this.board = board;
  }

  /** Register a system and call its onRegister hook */
  registerSystem(system: GameSystem): void {
    this.systems.push(system);
    system.onRegister(this.board);
  }

  /** Get the registered board */
  getBoard(): Board {
    return this.board;
  }

  /** Get whose turn it is */
  getCurrentTurn(): PieceColor {
    return this.currentTurn;
  }

  /** Get all events that have occurred */
  getEventLog(): GameEvent[] {
    return this.eventLog;
  }

  // ─── Turn Lifecycle ───────────────────────────────

  /** Notify all systems that a turn is starting */
  startTurn(): void {
    for (const system of this.systems) {
      system.onTurnStart?.(this.currentTurn);
    }
  }

  /** Execute a move, running it through all systems */
  executeMove(move: Move): GameEvent[] {
    const allEvents: GameEvent[] = [];

    for (const system of this.systems) {
      if (system.onMove) {
        const events = system.onMove(this.board, move);
        allEvents.push(...events);
      }
    }

    this.eventLog.push(...allEvents);
    return allEvents;
  }

  /** End the current turn, notify systems, and switch player */
  endTurn(): void {
    for (const system of this.systems) {
      system.onTurnEnd?.(this.currentTurn);
    }
    this.currentTurn = this.currentTurn === PieceColor.White
      ? PieceColor.Black
      : PieceColor.White;
  }

  // ─── Queries ──────────────────────────────────────

  /**
   * Get all valid moves for a position.
   * Aggregates moves from all systems.
   */
  getValidMoves(pos: Position): Position[] {
    const allMoves: Position[] = [];
    for (const system of this.systems) {
      if (system.getValidMoves) {
        allMoves.push(...system.getValidMoves(this.board, pos));
      }
    }
    return allMoves;
  }

  /**
   * Get all possible moves for a color.
   * Used by AI to pick a move.
   */
  getAllMovesForColor(color: PieceColor): Move[] {
    const allMoves: Move[] = [];
    for (const system of this.systems) {
      if (system.getAllMovesForColor) {
        allMoves.push(...system.getAllMovesForColor(this.board, color));
      }
    }
    return allMoves;
  }

  /**
   * Check if any system reports a winner.
   * Returns the winning color or null.
   */
  checkWinCondition(): PieceColor | null {
    for (const system of this.systems) {
      if (system.checkWinCondition) {
        const winner = system.checkWinCondition(this.board);
        if (winner) return winner;
      }
    }
    return null;
  }
}
