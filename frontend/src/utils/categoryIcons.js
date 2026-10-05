// Maps a category name to a representative emoji. Falls back to a generic tag
// icon for any category not explicitly listed (e.g. one an admin adds later).
const emojiMap = {
  "computers & laptops": "💻",
  "cosmetics & body care": "💄",
  "accessories": "👜",
  "clothes": "👕",
  "shoes": "👟",
  "gifts": "🎁",
  "pet care": "🐾",
  "mobile & tablets": "📱",
  "music & gaming": "🎮",
  "others": "🛍️",
};

export const getCategoryEmoji = (name = "") => emojiMap[name.trim().toLowerCase()] || "🏷️";
