import React from "react";
import { useDWA } from "../DWAContext";

// ââ LOADING SKELETON COMPONENTS ââ
const SkeletonCard = ({ lines = 3, avatar = false }) => {
  const { card } = useDWA();
  return (
    <div style={{ ...card({ padding: "16px 14px", marginBottom: 12 }), display: "flex", gap: 12, alignItems: "flex-start" }}>
      {avatar && <div className="skeleton-circle" style={{ width: 38, height: 38, flexShrink: 0 }} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton-line" style={{ width: "60%", height: 16 }} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: i === lines - 2 ? "40%" : "90%", height: 12 }} />
        ))}
      </div>
    </div>
  );
};

const SkeletonList = ({ count = 4, avatar = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} lines={i % 2 === 0 ? 3 : 2} avatar={avatar} />
    ))}
  </div>
);

const SkeletonGrid = ({ count = 6 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-rect" style={{ height: 90 }} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonList, SkeletonGrid };
