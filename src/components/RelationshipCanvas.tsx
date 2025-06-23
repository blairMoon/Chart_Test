// ✅ 관계도 캔버스 (src/components/RelationshipCanvas.tsx)
import { Stage, Layer } from "react-konva";
import { useNodeStore } from "../state/useNodeStore";
import Node from "./Node";
import { useSpring, animated } from "@react-spring/web";
import { useEffect } from "react";

export default function RelationshipCanvas() {
  const nodes = useNodeStore((state) => state.nodes);
  const focusedNodeId = useNodeStore((state) => state.focusedNodeId);
  const setFocusedNode = useNodeStore((state) => state.setFocusedNode);

  const focusedNode = nodes.find((n) => n.id === focusedNodeId) || {
    x: 0,
    y: 0,
  };

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  useEffect(() => {
    api.start({ x: focusedNode.x, y: focusedNode.y });
  }, [focusedNode]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            isFocused={node.id === focusedNodeId}
            offsetX={x.get()}
            offsetY={y.get()}
            onClick={() => setFocusedNode(node.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
