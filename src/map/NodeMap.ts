import { MapNode, NodeStatus, NodeType } from './MapNode';

/**
 * NodeMap — generates and manages the node graph for a region.
 * V1: 5 linear nodes (3 combat + 1 elite + 1 boss).
 * Future: branching Inscryption/Slay the Spire-style paths.
 */
export class NodeMap {
  readonly nodes: MapNode[];
  readonly regionName: string;

  constructor(regionName: string, nodes: MapNode[]) {
    this.regionName = regionName;
    this.nodes = nodes;
  }

  /** Get a node by ID */
  getNode(id: string): MapNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  /** Get all currently available (clickable) nodes */
  getAvailableNodes(): MapNode[] {
    return this.nodes.filter(n => n.status === NodeStatus.Available);
  }

  /** Get all completed nodes */
  getCompletedNodes(): MapNode[] {
    return this.nodes.filter(n => n.status === NodeStatus.Completed);
  }

  /** Mark a node as active (player is in combat there) */
  enterNode(id: string): void {
    const node = this.getNode(id);
    if (node && node.status === NodeStatus.Available) {
      node.status = NodeStatus.Active;
    }
  }

  /** Abandon an active node (return it to available) */
  abandonNode(id: string): void {
    const node = this.getNode(id);
    if (node && node.status === NodeStatus.Active) {
      node.status = NodeStatus.Available;
    }
  }

  /** Mark a node as completed and unlock its connections */
  completeNode(id: string): void {
    const node = this.getNode(id);
    if (!node) return;

    node.status = NodeStatus.Completed;

    // Unlock connected nodes
    for (const connId of node.connections) {
      const next = this.getNode(connId);
      if (next && next.status === NodeStatus.Locked) {
        next.status = NodeStatus.Available;
      }
    }
  }

  /** Check if all nodes are completed */
  isRegionComplete(): boolean {
    return this.nodes.every(n => n.status === NodeStatus.Completed);
  }

  /** Check if the boss node is completed */
  isBossDefeated(): boolean {
    return this.nodes.some(n => n.type === NodeType.Boss && n.status === NodeStatus.Completed);
  }

  // ─── Generation ───────────────────────────────────

  /**
   * Generate a simple linear map for Region 1.
   * 5 nodes: Combat → Combat → Combat → Elite → Boss
   */
  static generateRegion1(): NodeMap {
    const nodes: MapNode[] = [
      {
        id: 'r1_n1',
        type: NodeType.Combat,
        status: NodeStatus.Available, // First node is always available
        label: 'Battle I',
        x: 0.5,
        y: 0.85,
        connections: ['r1_n2'],
      },
      {
        id: 'r1_n2',
        type: NodeType.Combat,
        status: NodeStatus.Locked,
        label: 'Battle II',
        x: 0.5,
        y: 0.67,
        connections: ['r1_n3'],
      },
      {
        id: 'r1_n3',
        type: NodeType.Combat,
        status: NodeStatus.Locked,
        label: 'Battle III',
        x: 0.5,
        y: 0.49,
        connections: ['r1_n4'],
      },
      {
        id: 'r1_n4',
        type: NodeType.Elite,
        status: NodeStatus.Locked,
        label: '★ Elite',
        x: 0.5,
        y: 0.31,
        connections: ['r1_n5'],
      },
      {
        id: 'r1_n5',
        type: NodeType.Boss,
        status: NodeStatus.Locked,
        label: '👑 Grandmaster',
        x: 0.5,
        y: 0.13,
        connections: [],
      },
    ];

    return new NodeMap('The Chess Kingdom', nodes);
  }
}
