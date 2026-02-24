/** Chess piece types */
export enum PieceType {
  King = 'King',
  Queen = 'Queen',
  Rook = 'Rook',
  Bishop = 'Bishop',
  Knight = 'Knight',
  Pawn = 'Pawn',
}

/** Piece colors */
export enum PieceColor {
  White = 'white',
  Black = 'black',
}

/** A chess piece on the board */
export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved: boolean;
}

/** A move from one tile to another */
export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}
