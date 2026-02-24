/** Status of a node on the map */
export enum NodeStatus {
  Locked = 'locked',       // Cannot access yet
  Available = 'available', // Can be clicked
  Active = 'active',       // Currently in this node (in combat)
  Completed = 'completed', // Already beaten
}

/** Type of encounter at this node */
export enum NodeType {
  Combat = 'combat',   // Standard enemy fight
  Elite = 'elite',     // Harder fight, better rewards
  Boss = 'boss',       // Region boss
  Reward = 'reward',   // Pick a card/item
  Rest = 'rest',       // Heal or upgrade
  Shop = 'shop',       // Buy with gold
  Mystery = 'mystery', // Random event
  Gamble = 'gamble',   // Risk for reward
}

/** A single node on the map */
export interface MapNode {
  id: string;
  type: NodeType;
  status: NodeStatus;
  label: string;        // Display name (e.g. "Battle I", "BOSS")
  /** Position on screen (0-1 normalized, mapped to actual pixels in scene) */
  x: number;
  y: number;
  /** IDs of nodes this connects to (next nodes) */
  connections: string[];
}
