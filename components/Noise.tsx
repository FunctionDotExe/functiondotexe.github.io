"use client";

import { useEffect, useState } from "react";

export function Noise() {
  const [texture, setTexture] = useState<string>("");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 180;
    const height = 180;

    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = 145 + Math.random() * 65;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 16;
    }

    ctx.putImageData(imageData, 0, 0);
    setTexture(canvas.toDataURL("image/png"));
  }, []);

  if (!texture) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.28] mix-blend-multiply"
      style={{
        backgroundImage: `url(${texture})`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
      }}
    />
  );
}
