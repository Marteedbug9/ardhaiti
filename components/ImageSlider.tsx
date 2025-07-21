import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/samuel-schroth-hyPt63Df3Dw-unsplash.jpg",
  "/pexels-karolina-grabowska-4386226.jpg",
  "/pexels-dropshado-12244683.jpg",
  "/Las Vegas FO.png",
  "/2.jpg"
];

// Spécifie la largeur et la hauteur en pixels selon tes besoins !
const IMAGE_WIDTH = 960;
const IMAGE_HEIGHT = 400;

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500); // change toutes les 3.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container" style={{ position: "relative", width: IMAGE_WIDTH, height: IMAGE_HEIGHT, overflow: "hidden" }}>
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            display: i === index ? "block" : "none",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            transition: "opacity .5s"
          }}
        >
          <Image
            src={src}
            alt={`slide-${i}`}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%"
            }}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
