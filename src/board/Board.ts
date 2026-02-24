import { Tile } from './Tile';
import { Entity, Position, TileType } from '../game/types';

/**
 * Board — a generic grid of Tiles.
 * Knows NOTHING about chess, minesweeper, or any game system.
 * Provides CRUD operations for tiles and entities.
 */
export class Board {
  readonly rows: number;
  readonly cols: number;
  private grid: Tile[][];

  constructor(rows: number = 8, cols: number = 8) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => new Tile())
    );
  }

  // ─── Tile Access ────────────────────────────────────

  /** Get the tile at a position. Returns null if out of bounds. */
  getTile(row: number, col: number): Tile | null {
    if (!this.inBounds(row, col)) return null;
    return this.grid[row][col];
  }

  /** Get tile at a Position object */
  getTileAt(pos: Position): Tile | null {
    return this.getTile(pos.row, pos.col);
  }

  /** Set the tile type at a position */
  setTileType(row: number, col: number, type: TileType): void {
    const tile = this.getTile(row, col);
    if (tile) tile.type = type;
  }

  // ─── Entity Management ─────────────────────────────

  /** Get the entity at a position. Returns null if empty or out of bounds. */
  getEntity(row: number, col: number): Entity | null {
    const tile = this.getTile(row, col);
    return tile?.entity ?? null;
  }

  /** Get entity at a Position object */
  getEntityAt(pos: Position): Entity | null {
    return this.getEntity(pos.row, pos.col);
  }

  /** Place an entity on a tile. Overwrites any existing entity. */
  setEntity(row: number, col: number, entity: Entity): boolean {
    const tile = this.getTile(row, col);
    if (!tile) return false;
    tile.entity = entity;
    return true;
  }

  /** Remove the entity from a tile. Returns the removed entity or null. */
  removeEntity(row: number, col: number): Entity | null {
    const tile = this.getTile(row, col);
    if (!tile) return null;
    const removed = tile.entity;
    tile.entity = null;
    return removed;
  }

  /** Move an entity from one position to another. Returns captured entity or null. */
  moveEntity(fromRow: number, fromCol: number, toRow: number, toCol: number): Entity | null {
    const fromTile = this.getTile(fromRow, fromCol);
    const toTile = this.getTile(toRow, toCol);
    if (!fromTile || !toTile || !fromTile.entity) return null;

    const captured = toTile.entity;
    toTile.entity = fromTile.entity;
    fromTile.entity = null;
    return captured;
  }

  // ─── Queries ───────────────────────────────────────

  /** Find all entities matching a filter predicate */
  findEntities(filter: (entity: Entity, row: number, col: number) => boolean): { entity: Entity; pos: Position }[] {
    const results: { entity: Entity; pos: Position }[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const entity = this.grid[row][col].entity;
        if (entity && filter(entity, row, col)) {
          results.push({ entity, pos: { row, col } });
        }
      }
    }
    return results;
  }

  /** Find all tiles matching a filter predicate */
  findTiles(filter: (tile: Tile, row: number, col: number) => boolean): { tile: Tile; pos: Position }[] {
    const results: { tile: Tile; pos: Position }[] = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (filter(this.grid[row][col], row, col)) {
          results.push({ tile: this.grid[row][col], pos: { row, col } });
        }
      }
    }
    return results;
  }

  /** Check if a position is within bounds */
  inBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }
}
