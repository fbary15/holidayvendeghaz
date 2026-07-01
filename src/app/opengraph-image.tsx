import { ImageResponse } from "next/og";
import { SITE_NAME, CONTACT } from "@/lib/site";

// Dinamikusan generált Open Graph kép (1200×630 PNG) – matt fekete + zöld.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Holiday Vendégház – Békésszentandrás";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 120% at 15% 10%, #0f4a31 0%, #08090a 55%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* House mark */}
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path
            d="M24 86 V44 L50 22 L76 44"
            stroke="#38cf7d"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 86 H72"
            stroke="#38cf7d"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39 86 V58"
            stroke="#38cf7d"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#38cf7d",
              marginBottom: 18,
            }}
          >
            {CONTACT.city}
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#eef4ef",
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 34, color: "#c3ccc5", marginTop: 24 }}>
            {CONTACT.addressShort}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
