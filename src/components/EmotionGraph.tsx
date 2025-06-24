// src/components/EmotionGraph.tsx
import React, { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function EmotionGraph() {
  const fgRef = useRef<any>(null); // 또는 위에 설명한 ForceGraphInstance

  // ✅ 그래프 데이터 정의
  const graphData = {
    nodes: [
      { id: "나", fx: 0, fy: 0, size: 14, color: "#F04F4F" }, // 중앙 고정
      { id: "진영", size: 10, color: "#FFA07A" },
      { id: "하린", size: 6, color: "#8AC6D1" },
      { id: "채민", size: 8, color: "#FFD700" },
      { id: "구철", size: 8, color: "#B19CD9" },
      { id: "도영", size: 12, color: "#FFB6C1" },
      { id: "도연", size: 8, color: "#87CEFA" },
      { id: "우현", size: 10, color: "#90EE90" },
      { id: "윤석", size: 8, color: "#FFDAB9" },
      { id: "은범", size: 12, color: "#D8BFD8" },
    ],
    links: [
      { source: "나", target: "진영" },
      { source: "나", target: "하린" },
      { source: "나", target: "채민" },
      { source: "나", target: "구철" },
      { source: "나", target: "도영" },
      { source: "나", target: "도연" },
      { source: "나", target: "우현" },
      { source: "나", target: "윤석" },
      { source: "나", target: "은범" },
    ],
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={1}
        enableNodeDrag={false}
        cooldownTicks={0}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        nodeCanvasObject={(node, ctx) => {
          const label = node.id as string;
          const fontSize = (node as any).size || 10;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, fontSize * 1.4, 0, 2 * Math.PI);
          ctx.fillStyle = (node as any).color || "#888";
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.fillText(label, node.x!, node.y!);
        }}
        linkColor={() => "transparent"}
        onNodeClick={(node) => {
          fgRef.current?.centerAt(node.x!, node.y!, 1000);
          fgRef.current?.zoom(2, 1000);
        }}
      />
    </div>
  );
}
