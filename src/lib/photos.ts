/**
 * Holiday Vendégház – fotókatalógus (GENERÁLT FÁJL).
 *
 * A valódi fotók a `public/images/gallery/` mappában találhatók (optimalizált
 * JPEG). Ez a modul a főoldal és a galéria oldal képkiosztását tartalmazza:
 * a hero háttérkép, a bemutatkozó képek, a főoldali galéria-előnézet csempéi és
 * a teljes galéria sorrendje. A méret- és blur-adatokat a képfeldolgozó
 * pipeline állította elő.
 *
 * A képek automatikus válogatással és sorrendezéssel kerültek ide; a feliratok
 * (alt/caption) szükség esetén szabadon finomíthatók.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Pici, base64 elmosott előnézet (csak a kiemelt, hajtás feletti képeknél). */
  blur?: string;
};

/** Hero háttérkép (a főoldal nyitóképe). */
export const HERO: Photo = { src: "/images/gallery/dji_0766.jpg", width: 2000, height: 1411, alt: "Légifotó a vendégházról a víz partján", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwT/xAAgEAABBAICAwEAAAAAAAAAAAABAgMEEQAhEiIxMnGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AIIy3nSWuw5dAVk/uG+ypBctNqTr2ut+bwYs2TsF5R+7wnZkhwcVuqIBNZFNf//Z" };

/** Bemutatkozás szekció képei (álló, 3:4 kivágásban jelennek meg). */
export const ABOUT: Photo[] = [
  { src: "/images/gallery/img_2087.jpg", width: 2000, height: 1334, alt: "Kilátás a Körösre a teraszról", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQAD/8QAHxAAAgICAQUAAAAAAAAAAAAAAQIDEQAEIQUTIzFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABYRAQEBAAAAAAAAAAAAAAAAAAAREv/aAAwDAQACEQMRAD8APSfdMvjmci+LOaifqlkd2QH5iOvDGiKyoAaq8n1IGYEpyvo2eMFp5f/Z" },
  { src: "/images/gallery/img_2088.jpg", width: 2000, height: 1334, alt: "Kerti pavilon a víz közelében", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQF/8QAHxAAAgMBAAEFAAAAAAAAAAAAAQIDBBEAEwUUITFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABcRAQEBAQAAAAAAAAAAAAAAAAEAAiH/2gAMAwEAAhEDEQA/ABqy2acmQgkAZhH3yy2rc9iIW42VFbFJXNJ7PuWZvKU8jBfwfHV+oO3ts04oGDgFSTPW/9k=" },
];

/** Főoldali galéria-előnézet (bento rács). Az első csempe a nagy, 2×2-es. */
export const GALLERY_PREVIEW: { photo: Photo; label: string }[] = [
  { photo: { src: "/images/gallery/dji_0767.jpg", width: 2000, height: 1235, alt: "Terasz és stég", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBf/EAB4QAQEAAQQDAQAAAAAAAAAAAAECAwAEEUEhIjHR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQP/xAAVEQEBAAAAAAAAAAAAAAAAAAAAMf/aAAwDAQACEQMRAD8Ak2OCY4py4skNLUnnr5obnb4pMtyyQCetLR+ay9vdRyzTLx08aTLTVrSq9upwv//Z" }, label: "Terasz és stég" },
  { photo: { src: "/images/gallery/img_2005.jpg", width: 2000, height: 1334, alt: "Nappali", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgME/8QAIhABAAEEAQMFAAAAAAAAAAAAAQIAAxESBBMUISJRYWJx/8QAFAEBAAAAAAAAAAAAAAAAAAAAA//EABYRAQEBAAAAAAAAAAAAAAAAAAEAIf/aAAwDAQACEQMRAD8APHLTantOQwcPgRrHO9nYg69McmoflHiL2t37Jn5qcQbLBPT7UbjKaX//2Q==" }, label: "Nappali" },
  { photo: { src: "/images/gallery/img_1948.jpg", width: 2000, height: 1334, alt: "Stég", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAHxAAAwACAgIDAAAAAAAAAAAAAQIDACEEEhExFFFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAXEQEAAwAAAAAAAAAAAAAAAAAAARFB/9oADAMBAAIRAxEAPwCV43xqs6RtUfaL5w3edBtSm/R94/n2pHhs83KsOux+5htWlGLu5Zjsk5O8KX//2Q==" }, label: "Stég" },
  { photo: { src: "/images/gallery/img_1958.jpg", width: 2000, height: 1334, alt: "Bográcsozó", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwEC/8QAIRAAAgEDAwUAAAAAAAAAAAAAAQIDAAQRFDFxBRIhI4H/xAAUAQEAAAAAAAAAAAAAAAAAAAAD/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAESIUH/2gAMAwEAAhEDEQA/AMG30iPIZ5lIySFOxG9IIbl0TS3RIKB8OcnB5pmRZOoP3jPrI+VbFFSSYKMeQeMiiyhIo//Z" }, label: "Bográcsozó" },
  { photo: { src: "/images/gallery/img_1981.jpg", width: 2000, height: 1334, alt: "Vendégház", blur: "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAEF/8QAIRAAAgEDAwUAAAAAAAAAAAAAAQIAAwQREiExE0JRcZH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAGREAAgMBAAAAAAAAAAAAAAAAAAIBA0EE/9oADAMBAAIRAxEAPwAbNRcFujVGN+JVFtUGVBQDYliOfU0LhVt0V6SgOe4jJ+mELFjqJyfMM9LxoWqRcP/Z" }, label: "Vendégház" },
];

/** Teljes galéria (Galéria aloldal) – rendezett sorrend. */
export const GALLERY: { photo: Photo; caption: string; category: string }[] = [
  { photo: { src: "/images/gallery/dji_0766.jpg", width: 2000, height: 1411, alt: "Légifotó a vendégházról a víz partján" }, caption: "Légifotó a vendégházról a víz partján", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0767.jpg", width: 2000, height: 1235, alt: "Terasz és stég madártávlatból" }, caption: "Terasz és stég madártávlatból", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0763.jpg", width: 2000, height: 1326, alt: "Stég és csónak felülről" }, caption: "Stég és csónak felülről", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0780.jpg", width: 2000, height: 1252, alt: "A telek a holtág partján" }, caption: "A telek a holtág partján", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0770.jpg", width: 2000, height: 1186, alt: "Ház és medence a kertben" }, caption: "Ház és medence a kertben", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0768.jpg", width: 2000, height: 1238, alt: "Napozóterasz a fák között" }, caption: "Napozóterasz a fák között", category: "aerial" },
  { photo: { src: "/images/gallery/dji_0769.jpg", width: 2000, height: 1123, alt: "Kert és medence légifotón" }, caption: "Kert és medence légifotón", category: "aerial" },
  { photo: { src: "/images/gallery/img_1981.jpg", width: 2000, height: 1334, alt: "A vendégház és a kert" }, caption: "A vendégház és a kert", category: "exterior" },
  { photo: { src: "/images/gallery/img_1960.jpg", width: 2000, height: 1334, alt: "A ház fedett teraszával és medencével" }, caption: "A ház fedett teraszával és medencével", category: "exterior" },
  { photo: { src: "/images/gallery/img_1977.jpg", width: 2000, height: 1334, alt: "Vendégház medencével a napsütésben" }, caption: "Vendégház medencével a napsütésben", category: "exterior" },
  { photo: { src: "/images/gallery/img_1989.jpg", width: 2000, height: 1334, alt: "Ház és játszótér a kertben" }, caption: "Ház és játszótér a kertben", category: "exterior" },
  { photo: { src: "/images/gallery/img_1985.jpg", width: 2000, height: 1334, alt: "Fedett terasz a víz felé" }, caption: "Fedett terasz a víz felé", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1982.jpg", width: 2000, height: 1334, alt: "Pergolás terasz étkezőasztallal" }, caption: "Pergolás terasz étkezőasztallal", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1944.jpg", width: 2000, height: 1334, alt: "Fedett terasz jakuzzival" }, caption: "Fedett terasz jakuzzival", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1961.jpg", width: 2000, height: 1334, alt: "Kerti pavilon a víznél" }, caption: "Kerti pavilon a víznél", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_2088.jpg", width: 2000, height: 1334, alt: "Pavilon a víz közelében, délutáni fényben" }, caption: "Pavilon a víz közelében, délutáni fényben", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1953.jpg", width: 2000, height: 1334, alt: "Napernyős terasz a vízparton" }, caption: "Napernyős terasz a vízparton", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1958.jpg", width: 2000, height: 1334, alt: "Bográcsozó a parton" }, caption: "Bográcsozó a parton", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1957.jpg", width: 2000, height: 1334, alt: "Tűzrakóhely a víz mellett" }, caption: "Tűzrakóhely a víz mellett", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1955.jpg", width: 2000, height: 1334, alt: "Bográcsozó a kerti pavilonban" }, caption: "Bográcsozó a kerti pavilonban", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1971.jpg", width: 2000, height: 1334, alt: "Medence a víz partján" }, caption: "Medence a víz partján", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1968.jpg", width: 2000, height: 1334, alt: "Medence a kertben" }, caption: "Medence a kertben", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1965.jpg", width: 2000, height: 1334, alt: "Jakuzzi a fedett teraszon" }, caption: "Jakuzzi a fedett teraszon", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_1987.jpg", width: 2000, height: 1334, alt: "Játszótér a gyerekeknek" }, caption: "Játszótér a gyerekeknek", category: "garden_terrace" },
  { photo: { src: "/images/gallery/img_2078.jpg", width: 2000, height: 1334, alt: "Nappali és konyha egy térben" }, caption: "Nappali és konyha egy térben", category: "living_room" },
  { photo: { src: "/images/gallery/img_2006.jpg", width: 2000, height: 1334, alt: "Nappali a kényelmes kanapéval" }, caption: "Nappali a kényelmes kanapéval", category: "living_room" },
  { photo: { src: "/images/gallery/img_2005.jpg", width: 2000, height: 1334, alt: "Nappali és étkező a galérialépcsővel" }, caption: "Nappali és étkező a galérialépcsővel", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2009.jpg", width: 2000, height: 1334, alt: "Nyitott nappali-étkező" }, caption: "Nyitott nappali-étkező", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2034.jpg", width: 2000, height: 1334, alt: "Étkező és nappali" }, caption: "Étkező és nappali", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2014.jpg", width: 2000, height: 1334, alt: "Konyha és étkező" }, caption: "Konyha és étkező", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2010.jpg", width: 2000, height: 1334, alt: "Étkező és konyhapult" }, caption: "Étkező és konyhapult", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2011.jpg", width: 2000, height: 1334, alt: "Konyhapult bárszékekkel" }, caption: "Konyhapult bárszékekkel", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2003.jpg", width: 2000, height: 1334, alt: "Világos konyha terasz kijárattal" }, caption: "Világos konyha terasz kijárattal", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2083.jpg", width: 2000, height: 1334, alt: "Tágas étkező nyolc székkel" }, caption: "Tágas étkező nyolc székkel", category: "dining_kitchen" },
  { photo: { src: "/images/gallery/img_2068.jpg", width: 2000, height: 1334, alt: "Világos tetőtéri hálószoba" }, caption: "Világos tetőtéri hálószoba", category: "bedroom" },
  { photo: { src: "/images/gallery/img_2061.jpg", width: 2000, height: 1334, alt: "Hálószoba franciaággyal" }, caption: "Hálószoba franciaággyal", category: "bedroom" },
  { photo: { src: "/images/gallery/img_2054.jpg", width: 2000, height: 1334, alt: "Tetőtéri hálószoba" }, caption: "Tetőtéri hálószoba", category: "bedroom" },
  { photo: { src: "/images/gallery/img_2051.jpg", width: 2000, height: 1334, alt: "Napfényes tetőtéri hálószoba" }, caption: "Napfényes tetőtéri hálószoba", category: "bedroom" },
  { photo: { src: "/images/gallery/img_2042.jpg", width: 1334, height: 2000, alt: "Zuhanyzó esőztető fejjel" }, caption: "Zuhanyzó esőztető fejjel", category: "bathroom" },
  { photo: { src: "/images/gallery/img_2038.jpg", width: 1334, height: 2000, alt: "Fürdőszoba mosdóval" }, caption: "Fürdőszoba mosdóval", category: "bathroom" },
  { photo: { src: "/images/gallery/img_2087.jpg", width: 2000, height: 1334, alt: "Kilátás a Körösre a teraszról" }, caption: "Kilátás a Körösre a teraszról", category: "waterfront" },
  { photo: { src: "/images/gallery/img_1948.jpg", width: 2000, height: 1334, alt: "Stég a vízparton" }, caption: "Stég a vízparton", category: "waterfront" },
  { photo: { src: "/images/gallery/img_1949.jpg", width: 2000, height: 1334, alt: "Csónak a stégnél" }, caption: "Csónak a stégnél", category: "waterfront" },
  { photo: { src: "/images/gallery/img_2116.jpg", width: 2000, height: 1334, alt: "Kert és sétaút a házak felé" }, caption: "Kert és sétaút a házak felé", category: "surroundings" },
  { photo: { src: "/images/gallery/img_1956.jpg", width: 1334, height: 2000, alt: "Bogrács a tűz fölött" }, caption: "Bogrács a tűz fölött", category: "detail" },
];
