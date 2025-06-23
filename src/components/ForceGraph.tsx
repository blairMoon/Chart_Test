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
        children: Object.entries(nodeDistanceMap).map(([name, distance]) => ({
          name,
          value: Math.floor(Math.random() * 400 + 100), // 임의 value
          distance,
        })),
      },
    ];

    // ✅ 필드 설정
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";

    // ✅ 거리 adapter
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

    // ✅ 노드 스타일
    const nodeTemplate = networkSeries.nodes.template;
    nodeTemplate.tooltipText = "{name}";
    nodeTemplate.fillOpacity = 1;
    nodeTemplate.label.text = "{name}";
    nodeTemplate.label.fontSize = 10;
    nodeTemplate.label.fill = am4core.color("#ffffff");
    nodeTemplate.label.background.fillOpacity = 0;
    nodeTemplate.label.padding(0, 0, 0, 0);

    nodeTemplate.circle.strokeWidth = 0;
    nodeTemplate.circle.strokeOpacity = 0;
    nodeTemplate.circle.stroke = am4core.color("transparent");
    nodeTemplate.filters.clear();
    nodeTemplate.outerCircle.disabled = true;
    nodeTemplate.outerCircle.strokeOpacity = 0;
    nodeTemplate.outerCircle.fillOpacity = 0;
    nodeTemplate.outerCircle.filters.clear();
    nodeTemplate.outerCircle.adapter.add("radius", () => 0);

    networkSeries.maxLevels = 2;
    networkSeries.maxRadius = am4core.percent(10);
    networkSeries.manyBodyStrength = -8;
    networkSeries.links.template.disabled = false;
    networkSeries.minRadius = 20;
    networkSeries.maxRadius = 40;
    networkSeries.linkWithStrength = 0.7; // default는 1, 0.5~1로 조정해보세요
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
