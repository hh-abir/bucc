"use client";

import React from "react";
import Spline from "@splinetool/react-spline";

interface SplineModelProps {
  scene: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function SplineModel({ scene, onLoad, onError }: SplineModelProps) {
  return (
    <div className="w-full h-full relative">
      <Spline 
        scene={scene} 
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}
