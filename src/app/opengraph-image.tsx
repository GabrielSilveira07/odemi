import { ImageResponse } from "next/og";

export const alt = "Odemi — Presença que transmite critério antes da primeira conversa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0F1B2D",
          color: "#F4F1EA",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <svg width="620" height="620" viewBox="0 0 48 48" style={{ position: "absolute", right: -140, top: 5, opacity: 0.14 }}>
          <circle cx="24" cy="24" r="17" fill="none" stroke="#F4F1EA" strokeWidth="0.15" />
          <line x1="0" y1="24" x2="48" y2="24" stroke="#F4F1EA" strokeWidth="0.15" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="44" height="44" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="17" fill="none" stroke="#9A7B4F" strokeWidth="2" />
            <line x1="2" y1="24" x2="46" y2="24" stroke="#9A7B4F" strokeWidth="2" />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: 8 }}>ODEMI</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 74, lineHeight: 1.05, maxWidth: 900 }}>
            Presença que transmite critério antes da primeira conversa.
          </span>
          <span style={{ fontSize: 20, letterSpacing: 5, color: "#B9B3A7", fontFamily: "Helvetica, Arial, sans-serif" }}>
            IDENTIDADE VISUAL E SITES DE ALTO PADRÃO
          </span>
        </div>
      </div>
    ),
    size,
  );
}
