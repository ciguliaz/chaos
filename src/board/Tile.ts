import { TileType, Entity } from '../game/types';

/**
 * Tile — a single cell on the board.
 * Can have a type (Normal, Mine, Slot, etc.) and an optional entity on it.
 * Metadata map allows systems to attach arbitrary data without coupling.
 */
export class Tile {
  type: TileType;
  entity: Entity | null;
  revealed: boolean;
  metadata: Map<string, unknown>;

  constructor(type: TileType = TileType.Normal) {
    this.type = type;
    this.entity = null;
    this.revealed = true;
    this.metadata = new Map();
  }

  /** Check if this tile has an entity on it */
  isOccupied(): boolean {
    return this.entity !== null;
  }

  /** Check if this tile is passable (not water, not block, etc.) */
  isPassable(): boolean {
    return this.type !== TileType.Water && this.type !== TileType.Block;
  }

  /** Clone this tile (for undo/snapshots) */
  clone(): Tile {
    const t = new Tile(this.type);
    t.entity = this.entity ? { ...this.entity } : null;
    t.revealed = this.revealed;
    t.metadata = new Map(this.metadata);
    return t;
  }
}
