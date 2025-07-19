// frontend/components/ImageSlider.tsx
import { useState, useEffect } from "react";

const images = [
  "/samuel-schroth-hyPt63Df3Dw-unsplash.jpg",
  "/pexels-karolina-grabowska-4386226.jpg",
  "/pexels-dropshado-12244683.jpg",
  "/Las Vegas FO.png",
  "/2.jpg"
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500); // change toutes les 3.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`slide-${i}`}
          className={`slide${i === index ? " active" : ""}`}
          style={{ objectFit: "cover" }}
        />
      ))}
    </div>
  );
}
