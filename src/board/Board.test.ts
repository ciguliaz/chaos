import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from './Board';
import { Tile } from './Tile';
import { TileType, EntityType, PieceColor, PieceType, ChessPieceEntity } from '../game/types';

function makeChessPiece(type: PieceType, color: PieceColor): ChessPieceEntity {
  return {
    entityType: EntityType.ChessPiece,
    color,
    id: `test_${type}_${color}`,
    pieceType: type,
    hasMoved: false,
  };
}

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(8, 8);
  });

  describe('construction', () => {
    it('creates an 8x8 grid of Normal tiles', () => {
      expect(board.rows).toBe(8);
      expect(board.cols).toBe(8);
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const tile = board.getTile(r, c);
          expect(tile).not.toBeNull();
          expect(tile!.type).toBe(TileType.Normal);
          expect(tile!.entity).toBeNull();
        }
      }
    });

    it('supports custom sizes', () => {
      const small = new Board(4, 6);
      expect(small.rows).toBe(4);
      expect(small.cols).toBe(6);
      expect(small.getTile(3, 5)).not.toBeNull();
      expect(small.getTile(4, 0)).toBeNull();
    });
  });

  describe('bounds checking', () => {
    it('returns true for valid positions', () => {
      expect(board.inBounds(0, 0)).toBe(true);
      expect(board.inBounds(7, 7)).toBe(true);
      expect(board.inBounds(3, 4)).toBe(true);
    });

    it('returns false for out-of-bounds positions', () => {
      expect(board.inBounds(-1, 0)).toBe(false);
      expect(board.inBounds(0, -1)).toBe(false);
      expect(board.inBounds(8, 0)).toBe(false);
      expect(board.inBounds(0, 8)).toBe(false);
    });
  });

  describe('entity management', () => {
    it('places and retrieves entities', () => {
      const pawn = makeChessPiece(PieceType.Pawn, PieceColor.White);
      board.setEntity(6, 0, pawn);
      expect(board.getEntity(6, 0)).toBe(pawn);
    });

    it('returns null for empty tiles', () => {
      expect(board.getEntity(3, 3)).toBeNull();
    });

    it('returns null for out-of-bounds', () => {
      expect(board.getEntity(-1, 0)).toBeNull();
    });

    it('removes entities', () => {
      const pawn = makeChessPiece(PieceType.Pawn, PieceColor.White);
      board.setEntity(6, 0, pawn);
      const removed = board.removeEntity(6, 0);
      expect(removed).toBe(pawn);
      expect(board.getEntity(6, 0)).toBeNull();
    });

    it('moves entities and returns captured', () => {
      const white = makeChessPiece(PieceType.Pawn, PieceColor.White);
      const black = makeChessPiece(PieceType.Pawn, PieceColor.Black);
      board.setEntity(6, 0, white);
      board.setEntity(5, 1, black);

      const captured = board.moveEntity(6, 0, 5, 1);
      expect(captured).toBe(black);
      expect(board.getEntity(6, 0)).toBeNull();
      expect(board.getEntity(5, 1)).toBe(white);
    });

    it('moves to empty tile returns null', () => {
      const pawn = makeChessPiece(PieceType.Pawn, PieceColor.White);
      board.setEntity(6, 0, pawn);
      const captured = board.moveEntity(6, 0, 5, 0);
      expect(captured).toBeNull();
      expect(board.getEntity(5, 0)).toBe(pawn);
    });
  });

  describe('queries', () => {
    it('findEntities returns matching entities', () => {
      board.setEntity(0, 0, makeChessPiece(PieceType.King, PieceColor.White));
      board.setEntity(7, 7, makeChessPiece(PieceType.King, PieceColor.Black));
      board.setEntity(6, 0, makeChessPiece(PieceType.Pawn, PieceColor.White));

      const whites = board.findEntities(e => e.color === PieceColor.White);
      expect(whites).toHaveLength(2);

      const kings = board.findEntities(e =>
        e.entityType === EntityType.ChessPiece &&
        (e as ChessPieceEntity).pieceType === PieceType.King
      );
      expect(kings).toHaveLength(2);
    });

    it('findTiles returns matching tiles', () => {
      board.setTileType(3, 3, TileType.Mine);
      board.setTileType(4, 4, TileType.Mine);
      const mines = board.findTiles(t => t.type === TileType.Mine);
      expect(mines).toHaveLength(2);
    });
  });

  describe('tile operations', () => {
    it('sets tile type', () => {
      board.setTileType(3, 3, TileType.Water);
      expect(board.getTile(3, 3)!.type).toBe(TileType.Water);
    });

    it('getEntityAt works with Position objects', () => {
      const king = makeChessPiece(PieceType.King, PieceColor.White);
      board.setEntity(4, 4, king);
      expect(board.getEntityAt({ row: 4, col: 4 })).toBe(king);
    });
  });
});

describe('Tile', () => {
  it('defaults to Normal, empty, revealed', () => {
    const tile = new Tile();
    expect(tile.type).toBe(TileType.Normal);
    expect(tile.entity).toBeNull();
    expect(tile.revealed).toBe(true);
    expect(tile.isOccupied()).toBe(false);
  });

  it('reports passability', () => {
    const normal = new Tile(TileType.Normal);
    expect(normal.isPassable()).toBe(true);
    const water = new Tile(TileType.Water);
    expect(water.isPassable()).toBe(false);
    const block = new Tile(TileType.Block);
    expect(block.isPassable()).toBe(false);
  });

  it('clones correctly', () => {
    const tile = new Tile(TileType.Mine);
    tile.entity = makeChessPiece(PieceType.Pawn, PieceColor.White);
    tile.revealed = false;
    tile.metadata.set('count', 3);

    const clone = tile.clone();
    expect(clone.type).toBe(TileType.Mine);
    expect(clone.entity).toEqual(tile.entity);
    expect(clone.entity).not.toBe(tile.entity); // different reference
    expect(clone.revealed).toBe(false);
    expect(clone.metadata.get('count')).toBe(3);
  });
});
