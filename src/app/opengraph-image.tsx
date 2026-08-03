import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_NAME, CONTACT } from "@/lib/site";

/**
 * Open Graph kép (1200×630) – ez jelenik meg, ha valaki megosztja az oldalt
 * Facebookon, Messengerben, WhatsAppon vagy Viberen.
 *
 * A háttér a nyaraló valódi fotója (`og-hatter.jpg`), amit a galéria
 * `img_1981.jpg` képéből vágtunk 1200×630-ra. Szálláshelynél a fotó lényegesen
 * többet ad el, mint egy feliratos kártya. A sötét átmenet csak annyira erős,
 * hogy a szöveg biztosan olvasható maradjon a világos égen és a füvön is.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} – ${CONTACT.city}`;

// Build időben olvassuk be; a Satori csak beágyazott (data URI) képet fogad el.
const hatter = readFileSync(join(process.cwd(), "src/app/og-hatter.jpg"));
const HATTER_URI = `data:image/jpeg;base64,${hatter.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HATTER_URI}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />

        {/*
          Sötét átmenet, hogy a felirat a világos égen és füvön is olvasható
          maradjon. FONTOS: a Satori nem támogatja az `inset` rövidítést –
          explicit width/height kell, különben a réteg némán kimarad.
        */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${size.width}px`,
            height: `${size.height}px`,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(6,10,8,0.10) 0%, rgba(6,10,8,0.10) 30%, rgba(6,10,8,0.72) 62%, rgba(6,10,8,0.95) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 62,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
              <path
                d="M24 86 V44 L50 22 L76 44"
                stroke="#38cf7d"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 86 H72"
                stroke="#38cf7d"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M39 86 V58"
                stroke="#38cf7d"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                fontSize: 27,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "#5ae09a",
                marginLeft: 18,
              }}
            >
              {CONTACT.city}
            </div>
          </div>

          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.02,
            }}
          >
            {SITE_NAME}
          </div>

          <div style={{ fontSize: 32, color: "#dfe7e1", marginTop: 20 }}>
            Jakuzzi · medence · saját stég a Körös-holtágon
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
