
"use client";

const hexagons = Array.from({ length: 12 }, (_, i) => i + 1);

export default function HexagonGrid() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}
      >
        {hexagons.map((n, idx) => (
          <div
            key={idx}
            className="relative bg-blue-500 text-white flex items-center justify-center text-lg font-bold"
            style={{
              aspectRatio: "1.1547 / 1", // keeps hexagon proportions
              clipPath:
                "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
