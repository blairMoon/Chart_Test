// ✅ zustand 상태 (src/state/useNodeStore.ts)
import { create } from "zustand";

export type NodeType = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type NodeStore = {
  nodes: NodeType[];
  focusedNodeId: string | null;
  setFocusedNode: (id: string | null) => void;
};

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: [
    { id: "me", name: "나", x: 0, y: 0 },
    { id: "1", name: "민수", x: 300, y: 0 },
    { id: "2", name: "영희", x: -200, y: -150 },
  ],
  focusedNodeId: null,
  setFocusedNode: (id) => set({ focusedNodeId: id }),
}));
