import { NodeMap } from './NodeMap';

/**
 * RunState — holds all state for a single run.
 * Persists between scene transitions (passed via Phaser registry or scene data).
 * Future: gold, deck, items, HP, warp tokens.
 */
export class RunState {
  readonly nodeMap: NodeMap;
  currentNodeId: string | null = null;
  gold: number = 0;
  nodesCompleted: number = 0;

  constructor(nodeMap: NodeMap) {
    this.nodeMap = nodeMap;
  }

  /** Enter a node (start combat) */
  enterNode(nodeId: string): void {
    this.currentNodeId = nodeId;
    this.nodeMap.enterNode(nodeId);
  }

  /** Complete the current node (won combat) */
  completeCurrentNode(): void {
    if (this.currentNodeId) {
      this.nodeMap.completeNode(this.currentNodeId);
      this.nodesCompleted++;
      this.gold += 10; // Base gold per win
      this.currentNodeId = null;
    }
  }

  /** Check if the run is complete (boss defeated) */
  isRunComplete(): boolean {
    return this.nodeMap.isBossDefeated();
  }

  /** Create a fresh Region 1 run */
  static newRun(): RunState {
    return new RunState(NodeMap.generateRegion1());
  }
}
