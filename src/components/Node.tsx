// ✅ Node 컴포넌트 (src/components/Node.tsx)
import { Circle, Text } from "react-konva";
import type { NodeType } from "../state/useNodeStore";

interface NodeProps {
  node: NodeType;
  isFocused: boolean;
  offsetX: number;
  offsetY: number;
  onClick: () => void;
}

export default function Node({
  node,
  isFocused,
  offsetX,
  offsetY,
  onClick,
}: NodeProps) {
  const displayX = window.innerWidth / 2 + node.x - offsetX;
  const displayY = window.innerHeight / 2 + node.y - offsetY;

  return (
    <>
      <Circle
        x={displayX}
        y={displayY}
        radius={isFocused ? 40 : 30}
        fill={isFocused ? "#f06292" : node.id === "me" ? "#4caf50" : "#5f0080"}
        shadowBlur={isFocused ? 20 : 10}
        onClick={onClick}
      />
      <Text
        x={displayX - 20}
        y={displayY + 40}
        text={node.name}
        fontSize={18}
        fill="#333"
      />
    </>
  );
}
