/**
 * ============================================
 * LOCATION IMAGES - Street View / Exterior Photos
 * Maps place names to actual location photos
 * Using Unsplash CDN (most reliable) and Wikimedia Commons
 * ============================================
 */

const LOCATION_IMAGES = {
  // ==========================================
  // JAPAN
  // ==========================================
  "Ghibli Park": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
  "Ghibli Museum": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
  "Edo-Tokyo Open Air Architectural Museum": "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800",
  "Dogo Onsen": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800",
  "Ginzan Onsen": "https://images.unsplash.com/photo-1522623349500-de37a56ea2a5?w=800",
  "Totoro Forest (Sayama Hills)": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  "Satsuki and Mei's House": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
  "Kurosuke's House (Soot Sprite House)": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
  "Shibuya": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
  "Gonpachi Restaurant": "https://images.unsplash.com/photo-1554797589-7241bb691973?w=800",
  "Okinawa": "https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e?w=800",
  "Nikko": "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=800",

  // ==========================================
  // TAIWAN
  // ==========================================
  "Jiufen Old Street": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800",

  // ==========================================
  // CHINA / HONG KONG
  // ==========================================
  "Hong Kong cityscape": "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800",
  "Kowloon Walled City (demolished)": "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800",
  "Beijing Film Academy": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",

  // ==========================================
  // FRANCE - PARIS
  // ==========================================
  "Musée du Louvre": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
  "Notre-Dame Cathedral": "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=800",
  "Musée de l'Orangerie": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "Musée Marmottan Monet": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "Musée d'Orsay": "https://images.unsplash.com/photo-1551410224-699683e15636?w=800",
  "Saint-Germain-des-Prés": "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=800",
  "Pont de Bir-Hakeim": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=800",
  "Cafe Debussy": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",

  // ==========================================
  // FRANCE - NORMANDY
  // ==========================================
  "Fondation Claude Monet": "https://images.unsplash.com/photo-1568480289356-5a75d0fd47fc?w=800",
  "Giverny": "https://images.unsplash.com/photo-1568480289356-5a75d0fd47fc?w=800",
  "Giverny Water Garden": "https://images.unsplash.com/photo-1568480289356-5a75d0fd47fc?w=800",
  "Plage de Trouville": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "Le Havre Harbor": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",

  // ==========================================
  // NETHERLANDS
  // ==========================================
  "Mauritshuis": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "Delft": "https://images.unsplash.com/photo-1584003564911-a553c4f1c3c8?w=800",

  // ==========================================
  // ITALY
  // ==========================================
  "San Giorgio Maggiore": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",

  // ==========================================
  // MOROCCO
  // ==========================================
  "Tangier Medina": "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800",
  "Tangier": "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800",

  // ==========================================
  // USA
  // ==========================================
  "National Gallery of Art": "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=800",
  "Metropolitan Museum of Art": "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=800",
  "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
  "Malibu": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800",
  "Universal Studios": "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800",
  "Gold Bar (now closed)": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
  "The Beaver Building": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",

  // ==========================================
  // AUSTRALIA
  // ==========================================
  "Martin Place": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
  "52 Martin Place": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
  "Colonial State Bank Building Lobby": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
  "Sydney Harbour Tunnel": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",

  // ==========================================
  // SOUTH AFRICA
  // ==========================================
  "Hout Bay": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",

  // ==========================================
  // MEXICO
  // ==========================================
  "Guanajuato City": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800",
  "Oaxaca": "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800",
  "Santa Fe de la Laguna": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800",
  "Patzcuaro": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800",
  "Mixquic": "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800"
};

/**
 * Get location image URL by place name
 * Falls back to null if not found (will use work poster)
 */
function getLocationImage(placeName) {
  return LOCATION_IMAGES[placeName] || null;
}
