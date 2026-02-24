// ─── Tile Types ─────────────────────────────────────────

/** Types of tiles on the board. New types added per region. */
export enum TileType {
  Normal = 'Normal',
  Fog = 'Fog',           // R2: Minesweeper hidden tile
  Mine = 'Mine',          // R2: Minesweeper mine
  Number = 'Number',      // R2: Adjacent mine count
  Slot = 'Slot',          // R4: Gambling slot machine
  Chest = 'Chest',        // R4: Loot or mimic
  Water = 'Water',        // R5: Impassable water
  Ship = 'Ship',          // R5: Hidden battleship segment
  Portal = 'Portal',      // R6: Teleport pair
  Block = 'Block',        // R7: Tetris debris
  Resource = 'Resource',  // R8: Craft resource
  Letter = 'Letter',      // R11: Wordle/Scrabble
  Gem = 'Gem',            // R6: Collectible
}

// ─── Entity Types ───────────────────────────────────────

/** Category of entities that can occupy a tile. */
export enum EntityType {
  ChessPiece = 'ChessPiece',
  PvZPlant = 'PvZPlant',     // R3
  LaneEnemy = 'LaneEnemy',   // R3
  Turret = 'Turret',         // R14
}

/** Chess piece types */
export enum PieceType {
  King = 'King',
  Queen = 'Queen',
  Rook = 'Rook',
  Bishop = 'Bishop',
  Knight = 'Knight',
  Pawn = 'Pawn',
}

/** Piece colors / sides */
export enum PieceColor {
  White = 'white',
  Black = 'black',
}

/** Base entity — anything that can stand on a tile. */
export interface Entity {
  entityType: EntityType;
  color: PieceColor;
  id: string;               // Unique ID for tracking
}

/** A chess piece entity. */
export interface ChessPieceEntity extends Entity {
  entityType: EntityType.ChessPiece;
  pieceType: PieceType;
  hasMoved: boolean;
}

// ─── Moves ──────────────────────────────────────────────

/** A position on the board */
export interface Position {
  row: number;
  col: number;
}

/** A move from one position to another */
export interface Move {
  from: Position;
  to: Position;
}

// ─── Events ─────────────────────────────────────────────

/** Events that systems can emit during gameplay. */
export enum GameEventType {
  PieceMoved = 'PieceMoved',
  PieceCaptured = 'PieceCaptured',
  TileRevealed = 'TileRevealed',
  MineTriggered = 'MineTriggered',
  SlotSpun = 'SlotSpun',
  EnemySpawned = 'EnemySpawned',
  TurnChanged = 'TurnChanged',
  GameWon = 'GameWon',
  GameLost = 'GameLost',
}

export interface GameEvent {
  type: GameEventType;
  data?: Record<string, unknown>;
}
