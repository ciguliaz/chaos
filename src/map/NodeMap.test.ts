import { describe, it, expect, beforeEach } from 'vitest';
import { NodeMap } from './NodeMap';
import { NodeStatus, NodeType } from './MapNode';
import { RunState } from './RunState';

describe('NodeMap', () => {
  let map: NodeMap;

  beforeEach(() => {
    map = NodeMap.generateRegion1();
  });

  describe('generation', () => {
    it('creates 5 nodes for Region 1', () => {
      expect(map.nodes).toHaveLength(5);
    });

    it('sets region name', () => {
      expect(map.regionName).toBe('The Chess Kingdom');
    });

    it('first node is Available, rest are Locked', () => {
      expect(map.nodes[0].status).toBe(NodeStatus.Available);
      for (let i = 1; i < map.nodes.length; i++) {
        expect(map.nodes[i].status).toBe(NodeStatus.Locked);
      }
    });

    it('last node is a Boss', () => {
      const last = map.nodes[map.nodes.length - 1];
      expect(last.type).toBe(NodeType.Boss);
    });

    it('each node connects to the next (linear)', () => {
      for (let i = 0; i < map.nodes.length - 1; i++) {
        expect(map.nodes[i].connections).toContain(map.nodes[i + 1].id);
      }
      // Last node has no connections
      expect(map.nodes[map.nodes.length - 1].connections).toHaveLength(0);
    });
  });

  describe('node operations', () => {
    it('getNode finds by id', () => {
      const node = map.getNode('r1_n1');
      expect(node).toBeDefined();
      expect(node!.label).toBe('Battle I');
    });

    it('getAvailableNodes returns only available nodes', () => {
      expect(map.getAvailableNodes()).toHaveLength(1);
      expect(map.getAvailableNodes()[0].id).toBe('r1_n1');
    });

    it('enterNode sets status to Active', () => {
      map.enterNode('r1_n1');
      expect(map.getNode('r1_n1')!.status).toBe(NodeStatus.Active);
    });

    it('abandonNode resets Active back to Available', () => {
      map.enterNode('r1_n1');
      expect(map.getNode('r1_n1')!.status).toBe(NodeStatus.Active);
      map.abandonNode('r1_n1');
      expect(map.getNode('r1_n1')!.status).toBe(NodeStatus.Available);
    });

    it('abandonNode does nothing if node is not Active', () => {
      // Locked node — should not change
      map.abandonNode('r1_n2');
      expect(map.getNode('r1_n2')!.status).toBe(NodeStatus.Locked);
    });

    it('completeNode marks done and unlocks next', () => {
      map.enterNode('r1_n1');
      map.completeNode('r1_n1');
      expect(map.getNode('r1_n1')!.status).toBe(NodeStatus.Completed);
      expect(map.getNode('r1_n2')!.status).toBe(NodeStatus.Available);
    });

    it('completing all nodes makes region complete', () => {
      expect(map.isRegionComplete()).toBe(false);
      // Complete all
      for (let i = 0; i < map.nodes.length; i++) {
        const node = map.nodes[i];
        map.enterNode(node.id);
        map.completeNode(node.id);
      }
      expect(map.isRegionComplete()).toBe(true);
    });
  });

  describe('boss detection', () => {
    it('isBossDefeated is false initially', () => {
      expect(map.isBossDefeated()).toBe(false);
    });

    it('isBossDefeated is true after boss completed', () => {
      // Complete all nodes to reach boss
      for (const node of map.nodes) {
        map.enterNode(node.id);
        map.completeNode(node.id);
      }
      expect(map.isBossDefeated()).toBe(true);
    });
  });
});

describe('RunState', () => {
  let run: RunState;

  beforeEach(() => {
    run = RunState.newRun();
  });

  it('starts with 0 gold and 0 nodes completed', () => {
    expect(run.gold).toBe(0);
    expect(run.nodesCompleted).toBe(0);
  });

  it('enterNode sets currentNodeId', () => {
    run.enterNode('r1_n1');
    expect(run.currentNodeId).toBe('r1_n1');
  });

  it('completeCurrentNode adds gold and increments count', () => {
    run.enterNode('r1_n1');
    run.completeCurrentNode();
    expect(run.gold).toBe(10);
    expect(run.nodesCompleted).toBe(1);
    expect(run.currentNodeId).toBeNull();
  });

  it('isRunComplete after boss defeated', () => {
    expect(run.isRunComplete()).toBe(false);
    for (const node of run.nodeMap.nodes) {
      run.enterNode(node.id);
      run.completeCurrentNode();
    }
    expect(run.isRunComplete()).toBe(true);
    expect(run.gold).toBe(50); // 5 nodes × 10 gold
  });
});
