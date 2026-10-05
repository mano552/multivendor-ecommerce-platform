// Generates a self-contained SVG placeholder as a data URI — no network request needed,
// so it never fails to load even if an external placeholder service is blocked/unreachable.

const palette = ["#4338ca", "#0891b2", "#16a34a", "#ea580c", "#db2777", "#7c3aed", "#0d9488", "#ca8a04"];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getPlaceholderImage = (label = "Product", size = 400) => {
  const color = palette[hashString(label) % palette.length];
  const initial = (label.trim().charAt(0) || "P").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="100%" height="100%" fill="${color}" opacity="0.12"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3.2}" fill="${color}" opacity="0.9"/>
      <text x="50%" y="52%" font-family="Segoe UI, Arial, sans-serif" font-size="${size / 3.5}"
            fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initial}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
