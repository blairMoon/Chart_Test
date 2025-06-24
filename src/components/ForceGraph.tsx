// src/components/ForceGraph.tsx
import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default function ForceGraph() {
  const chartRef = useRef<am4core.Container | null>(null);

  useEffect(() => {
    const chart = am4core.create(
      "chartdiv",
      am4plugins_forceDirected.ForceDirectedTree
    );

    const networkSeries = chart.series.push(
      new am4plugins_forceDirected.ForceDirectedSeries()
    );

    // ✅ 거리값 매핑
    const nodeDistanceMap: Record<string, number> = {
      진영: 100,
      하린: 1000,
      채민: 160,
      구철: 160,
      도영: 80,
      도연: 160,
      우현: 100,
      윤석: 160,
      은범: 80,
    };

    // ✅ 데이터 정의
    networkSeries.data = [
      {
        name: "나",
        value: 500, // tooltip이 뜨게 하려면 value를 지정해주는 것이 좋음
        children: Object.entries(nodeDistanceMap).map(([name, distance]) => ({
          name,
          value: Math.floor(Math.random() * 200 + 100),
          distance,
        })),
      },
    ];

    // ✅ 필드 매핑
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";

    // ✅ 거리 adapter (노드별 연결 거리 조절)
    networkSeries.links.template.adapter.add(
      "distance",
      (defaultDistance, target) => {
        const toName = target.dataItem?.to?.dataContext?.name;
        if (toName && toName in nodeDistanceMap) {
          return nodeDistanceMap[toName];
        }
        return defaultDistance;
      }
    );

    // ✅ 노드 스타일링
    const nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}"; // 모든 노드 툴팁 적용
    nodeTemplate.label.text = "{name}";
    nodeTemplate.label.fontSize = 10;
    nodeTemplate.label.fill = am4core.color("#ffffff");

    // ✅ 노드 테두리 등 제거
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.circle.strokeWidth = 0;
    nodeTemplate.circle.strokeOpacity = 0;
    nodeTemplate.circle.stroke = am4core.color("transparent");
    nodeTemplate.filters.clear();
    nodeTemplate.outerCircle.disabled = true;
    nodeTemplate.outerCircle.strokeOpacity = 0;
    nodeTemplate.outerCircle.fillOpacity = 0;
    nodeTemplate.outerCircle.filters.clear();
    nodeTemplate.outerCircle.adapter.add("radius", () => 0);

    // ✅ 기타 그래프 설정
    networkSeries.maxLevels = 2;
    networkSeries.maxRadius = am4core.percent(10);
    networkSeries.minRadius = 20;
    networkSeries.manyBodyStrength = -8;
    networkSeries.links.template.disabled = true;

    chartRef.current = chart;
    return () => chart.dispose();
  }, []);

  return (
    <div
      id="chartdiv"
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "visible",
      }}
    />
  );
}
