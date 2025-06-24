import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// 원(circle) 배열을 생성하는 함수
const generateCircles = (count: number) => {
  const mid = Math.floor(count / 2); // 중앙 원의 인덱스 계산
  return Array.from({ length: count }, (_, i) => ({
    id: i, // 고유 ID
    color: i === mid ? "#ff6b6b" : `hsl(${Math.random() * 360}, 50%, 80%)`, // 가운데는 빨간색, 나머지는 파스텔톤
    baseSize: 60, // 기본 원 크기
    isCenter: i === mid, // 중앙 여부
  }));
};

export default function Newtest() {
  // 바둑판, 다이아몬드 원 배열 각각 생성 (초기화 시 1회)
  const [gridCircles] = useState(() => generateCircles(30));
  const [diamondCircles] = useState(() => generateCircles(30));

  // 각 폰과 내부 요소 참조용 ref
  const phone1Ref = useRef<HTMLDivElement>(null);
  const phone2Ref = useRef<HTMLDivElement>(null);
  const innerRef1 = useRef<HTMLDivElement>(null);
  const innerRef2 = useRef<HTMLDivElement>(null);

  // 가운데에 가장 가까운 원 인덱스를 상태로 저장
  const [hoveredIndex1, setHoveredIndex1] = useState<number | null>(null);
  const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null);

  // 현재 가운데 마커와 가장 가까운 원을 찾는 함수
  const checkCenterProximity = (
    wrapper: HTMLDivElement | null,
    ref: HTMLDivElement | null,
    setHovered: any
  ) => {
    if (!ref || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const circles = ref.querySelectorAll(".circle");
    let closestId: number | null = null;
    let minDistance = 999999;

    // 각 원과 마커의 거리 계산
    circles.forEach((circle: any, index) => {
      const rect = circle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(cx - centerX, cy - centerY);
      if (dist < 60 && dist < minDistance) {
        closestId = index;
        minDistance = dist;
      }
    });
    setHovered(closestId);
  };

  // 일정 주기로 가운데에 가까운 원 체크
  useEffect(() => {
    const interval = setInterval(() => {
      checkCenterProximity(
        phone1Ref.current,
        innerRef1.current,
        setHoveredIndex1
      );
      checkCenterProximity(
        phone2Ref.current,
        innerRef2.current,
        setHoveredIndex2
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 원 렌더링 함수
  const renderCircles = (circles: any[], hoveredIndex: number | null) => {
    const expandedSize = 1.3; // 선택 시 커지는 비율
    return circles.map((circle, i) => {
      const isHovered = i === hoveredIndex;
      const scale = isHovered ? expandedSize : 1;
      const size = circle.baseSize * scale;
      const margin = isHovered
        ? `${(circle.baseSize * (scale - 1)) / 2}px`
        : "1px";

      return (
        <motion.div
          key={circle.id}
          className="circle"
          style={{
            ...styles.circle,
            backgroundColor: circle.color,
            width: size,
            height: size,
            margin,
            zIndex: isHovered ? 10 : 1,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#333",
            fontWeight: "bold",
          }}
          layout
        >
          {`이름${circle.id}`} {/* 이름 표기 */}
        </motion.div>
      );
    });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      {/* 왼쪽: 바둑판 구조 */}
      <div style={styles.phone} ref={phone1Ref}>
        <div style={styles.centerMarker} />
        <motion.div
          drag
          dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
          style={{ ...styles.innerDraggable, ...styles.centeredPosition }}
          whileDrag={{ scale: 1.05 }}
          ref={innerRef1}
          initial={{ x: -120, y: -200 }} // 시작 위치 조정
        >
          <motion.div style={styles.gridContainer} layout>
            {renderCircles(gridCircles, hoveredIndex1)}
          </motion.div>
        </motion.div>
      </div>

      {/* 오른쪽: 다이아몬드 구조 */}
      <div style={styles.phone} ref={phone2Ref}>
        <div style={styles.centerMarker} />
        <motion.div
          drag
          dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
          style={{
            ...styles.innerDraggable,
            ...styles.diamondWrapper,
            ...styles.centeredPosition,
          }}
          whileDrag={{ scale: 1.05 }}
          ref={innerRef2}
          initial={{ x: -120, y: -200 }}
        >
          <motion.div style={styles.diamondContainer} layout>
            {renderCircles(diamondCircles, hoveredIndex2)}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// 스타일 객체 정의
const styles: { [key: string]: React.CSSProperties } = {
  phone: {
    width: 260,
    height: 500,
    border: "2px solid #ccc",
    borderRadius: 30,
    background: "white",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    touchAction: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  centerMarker: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "3px dashed #aaa",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 5,
  },
  innerDraggable: {
    width: 500,
    height: 800,
    cursor: "grab",
  },
  centeredPosition: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    // 원 간격 최소화: gap, padding 생략
  },
  diamondWrapper: {
    transform: "rotate(45deg)", // 전체 회전
  },
  diamondContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    transform: "rotate(-45deg)", // 자식 요소 되돌리기
  },
  circle: {
    borderRadius: "50%",
    willChange: "transform",
    boxSizing: "border-box",
  },
};
