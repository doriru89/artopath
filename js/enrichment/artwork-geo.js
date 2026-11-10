/**
 * ============================================
 * GEO.JS - Geographic Enrichment Data
 * ============================================
 *
 * Purpose: Stores rich location data for places referenced in artwork entries
 * including coordinates, Google Maps URLs, images, and visitor reviews.
 *
 * Structure:
 * - Keys follow format: {workId}:{place-name-slugified}
 * - Example: "girl-with-a-pearl-earring:mauritshuis"
 *
 * Usage:
 * - Import this file after data.js
 * - Use helper functions to lookup enrichments
 * - Enrichments enhance basic places[] data from artwork entries
 *
 * Data Sources:
 * - Content entries from /content/artwork-cultural-lineage/*.md
 * - Google Places API enrichment via artopath-geo-enrichment agent
 *
 * ============================================
 */

const GEO_ENRICHMENTS = {
  // ============================================
  // SAMPLE STRUCTURE (Reference)
  // ============================================
  // "work-id:place-slug": {
  //   workId: "work-id",
  //   placeName: "Place Name",
  //   placeSlug: "place-slug",
  //   lat: 52.0000,
  //   lng: 4.0000,
  //   location: "City, Country",
  //   connection: "Why this place matters to the work",
  //   visitable: true,
  //   geo: {
  //     googleMapsUrl: "https://maps.google.com/?q=...",
  //     placeId: "ChIJ...",  // Google Places ID
  //     images: [
  //       { url: "...", alt: "Description", source: "Source", license: "CC BY-SA 4.0" }
  //     ],
  //     reviews: [
  //       { snippet: "Review excerpt", source: "Google Reviews", sentiment: "positive" }
  //     ],
  //     visit: {
  //       hours: "Tue-Sun 10:00-18:00",
  //       admission: "Adults €18, Under 18 free",
  //       tips: "Book online to skip queues"
  //     }
  //   }
  // },

  // ============================================
  // GIRL WITH A PEARL EARRING - Johannes Vermeer
  // ============================================
  "girl-with-a-pearl-earring:mauritshuis": {
    workId: "girl-with-a-pearl-earring",
    placeName: "Mauritshuis",
    placeSlug: "mauritshuis",
    locationType: "museum",  // Current display location
    lat: 52.08039,
    lng: 4.31431,
    location: "The Hague, Netherlands",
    connection: "Permanent home of the painting since 1902",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=52.08039,4.31431",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Tuesday-Sunday 10:00-18:00; Monday 13:00-18:00",
        admission: "Paid admission required",
        tips: "Located 10 minutes walk from Den Haag Central station"
      }
    }
  },
  "girl-with-a-pearl-earring:delft": {
    workId: "girl-with-a-pearl-earring",
    placeName: "Delft",
    placeSlug: "delft",
    locationType: "artist",  // Where Vermeer lived/worked
    lat: 52.0067,
    lng: 4.3556,
    location: "South Holland, Netherlands",
    connection: "City where Vermeer was born and lived his entire life",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=52.0067,4.3556",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "City accessible anytime",
        admission: "Free",
        tips: "Visit Vermeer Centrum Delft and Oude Kerk where Vermeer is buried"
      }
    }
  },

  // ============================================
  // THE LION HUNT - Eugene Delacroix
  // ============================================
  "the-lion-hunt:musee-dorsay": {
    workId: "the-lion-hunt",
    placeName: "Musee d'Orsay",
    placeSlug: "musee-dorsay",
    locationType: "museum",  // Current display location
    lat: 48.859962,
    lng: 2.326561,
    location: "Paris, France",
    connection: "Current permanent home of The Lion Hunt (1855)",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.859962,2.326561",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Tuesday-Sunday 9:30am-6pm (Thursday until 9:45pm)",
        admission: "14 EUR general admission",
        tips: "Visit on Thursday evenings for extended hours and fewer crowds"
      }
    }
  },
  "the-lion-hunt:tangier": {
    workId: "the-lion-hunt",
    placeName: "Tangier Medina",
    placeSlug: "tangier",
    locationType: "inspiration",  // Visual reference/inspiration for design
    lat: 35.78530,
    lng: -5.81340,
    location: "Tangier, Morocco",
    connection: "Delacroix visited in 1832 - inspired the painting's atmosphere",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.78530,-5.81340",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Accessible 24/7",
        admission: "Free to wander",
        tips: "Visit the Kasbah Museum for the atmosphere Delacroix experienced"
      }
    }
  },

  // ============================================
  // THE WEDDING FEAST AT CANA - Paolo Veronese
  // ============================================
  "the-wedding-feast-at-cana:musee-du-louvre": {
    workId: "the-wedding-feast-at-cana",
    placeName: "Musee du Louvre",
    placeSlug: "musee-du-louvre",
    locationType: "museum",  // Current display location
    lat: 48.8606,
    lng: 2.3376,
    location: "Paris, France",
    connection: "Current location since 1797 - hangs opposite Mona Lisa",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8606,2.3376",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Daily except Tuesday, 9:00-18:00",
        admission: "17 EUR general admission",
        tips: "Often overlooked - the largest painting in the museum"
      }
    }
  },
  "the-wedding-feast-at-cana:san-giorgio-maggiore": {
    workId: "the-wedding-feast-at-cana",
    placeName: "San Giorgio Maggiore",
    placeSlug: "san-giorgio-maggiore",
    locationType: "subject",  // Original historic location, memorial site
    lat: 45.4294,
    lng: 12.3433,
    location: "Venice, Italy",
    connection: "Original location 1563-1797 - reproduction now hangs here",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=45.4294,12.3433",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Church: 9:00-19:00 daily",
        admission: "Church free; bell tower 6 EUR",
        tips: "Take vaporetto line 2 from San Zaccaria"
      }
    }
  },

  // ============================================
  // THE CORONATION OF NAPOLEON - Jacques-Louis David
  // ============================================
  "the-coronation-of-napoleon:notre-dame": {
    workId: "the-coronation-of-napoleon",
    placeName: "Notre-Dame Cathedral",
    placeSlug: "notre-dame",
    locationType: "depicted",  // The actual scene shown in the painting
    lat: 48.852966,
    lng: 2.349902,
    location: "Paris, France",
    connection: "The actual site of Napoleon's coronation (Dec 2, 1804)",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.852966,2.349902",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Reopened late 2024 after 2019 fire restoration",
        admission: "Free entry to cathedral",
        tips: "Interior differs from painting due to restoration"
      }
    }
  },
  "the-coronation-of-napoleon:louvre": {
    workId: "the-coronation-of-napoleon",
    placeName: "Musee du Louvre",
    placeSlug: "louvre",
    locationType: "museum",  // Current display location
    lat: 48.860294,
    lng: 2.338629,
    location: "Paris, France",
    connection: "Primary viewing location - Denon Wing, Room 702",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.860294,2.338629",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Wednesday-Monday 9am-6pm",
        admission: "17 EUR general admission",
        tips: "One of the largest paintings in the Louvre (621 x 979 cm)"
      }
    }
  },

  // ============================================
  // THE RAY (LA RAIE) - Jean-Baptiste-Simeon Chardin
  // ============================================
  "the-ray-la-raie:louvre": {
    workId: "the-ray-la-raie",
    placeName: "Musee du Louvre",
    placeSlug: "louvre",
    locationType: "museum",  // Current display location
    lat: 48.860294,
    lng: 2.338629,
    location: "Paris, France",
    connection: "Permanent home - Richelieu Wing, Room 921",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.860294,2.338629",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "9am-6pm daily (Wed, Fri until 9:45pm); closed Tuesdays",
        admission: "17 EUR general admission",
        tips: "Room 921 is less crowded - allows contemplative viewing"
      }
    }
  },
  "the-ray-la-raie:saint-germain-des-pres": {
    workId: "the-ray-la-raie",
    placeName: "Saint-Germain-des-Pres",
    placeSlug: "saint-germain-des-pres",
    locationType: "artist",  // Where Chardin lived/worked
    lat: 48.853867,
    lng: 2.334723,
    location: "Paris, France",
    connection: "Neighborhood where Chardin lived and worked his entire life",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.853867,2.334723",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Church open daily 8am-7:45pm",
        admission: "Free",
        tips: "Walk the streets imagining 18th-century artistic life"
      }
    }
  },

  // ============================================
  // WOMAN WITH A PARASOL - Claude Monet
  // ============================================
  "woman-with-a-parasol:national-gallery-of-art": {
    workId: "woman-with-a-parasol",
    placeName: "National Gallery of Art",
    placeSlug: "national-gallery-of-art",
    locationType: "museum",  // Current display location
    lat: 38.8913,
    lng: -77.0200,
    location: "Washington, D.C., USA",
    connection: "Current home - West Building, Gallery 85",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=38.8913,-77.0200",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "10am-5pm daily",
        admission: "Free",
        tips: "Metro: Archives-Navy Memorial station"
      }
    }
  },
  "woman-with-a-parasol:giverny": {
    workId: "woman-with-a-parasol",
    placeName: "Fondation Claude Monet",
    placeSlug: "giverny",
    locationType: "artist",  // Monet's home and studio
    lat: 49.0758,
    lng: 1.5339,
    location: "Giverny, Normandy, France",
    connection: "Monet's home 1883-1926 with famous water lily gardens",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.0758,1.5339",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "9:30am-6pm (April to November)",
        admission: "Approximately 13 EUR",
        tips: "Peak bloom: late April-June for wisteria and irises"
      }
    }
  },

  // ============================================
  // ON THE BEACH AT TROUVILLE - Eugene Boudin
  // ============================================
  "on-the-beach-at-trouville:metropolitan-museum": {
    workId: "on-the-beach-at-trouville",
    placeName: "Metropolitan Museum of Art",
    placeSlug: "metropolitan-museum",
    locationType: "museum",  // Current display location
    lat: 40.7794,
    lng: -73.9634,
    location: "New York, NY, USA",
    connection: "Home of the 1863 canonical version",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=40.7794,-73.9634",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Sun-Tue, Thu: 10am-5pm; Fri-Sat: 10am-9pm",
        admission: "Pay-what-you-wish for NY residents",
        tips: "19th-century European Paintings galleries"
      }
    }
  },
  "on-the-beach-at-trouville:trouville-beach": {
    workId: "on-the-beach-at-trouville",
    placeName: "Plage de Trouville",
    placeSlug: "trouville-beach",
    locationType: "depicted",  // The actual scene shown in the painting
    lat: 49.3709,
    lng: 0.0810,
    location: "Trouville-sur-Mer, Normandy, France",
    connection: "The exact beach depicted in the painting",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.3709,0.0810",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Open 24 hours (public beach)",
        admission: "Free",
        tips: "Visit late morning for the luminous Norman light Boudin captured"
      }
    }
  },

  // ============================================
  // WATER LILIES (GRANDES DECORATIONS) - Claude Monet
  // ============================================
  "water-lilies-grandes-decorations:musee-orangerie": {
    workId: "water-lilies-grandes-decorations",
    placeName: "Musee de l'Orangerie",
    placeSlug: "musee-orangerie",
    locationType: "museum",  // Current display location
    lat: 48.863611,
    lng: 2.322778,
    location: "Paris, France",
    connection: "Permanent home since 1927 - two oval rooms designed by Monet",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.863611,2.322778",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "9am-6pm, closed Tuesdays",
        admission: "12.50 EUR",
        tips: "Sit on benches; stay 30 minutes per room for full meditative effect"
      }
    }
  },
  "water-lilies-grandes-decorations:giverny-water-garden": {
    workId: "water-lilies-grandes-decorations",
    placeName: "Giverny Water Garden",
    placeSlug: "giverny-water-garden",
    locationType: "depicted",  // The actual scene shown in the painting
    lat: 49.075556,
    lng: 1.533889,
    location: "Giverny, Normandy, France",
    connection: "The exact pond Monet painted for 30 years",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.075556,1.533889",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "April-October, 9:30am-6pm daily",
        admission: "13 EUR adults",
        tips: "Visit May-June for water lilies in bloom; arrive at opening"
      }
    }
  },

  // ============================================
  // IMPRESSION, SUNRISE - Claude Monet
  // ============================================
  "impression-sunrise:musee-marmottan-monet": {
    workId: "impression-sunrise",
    placeName: "Musee Marmottan Monet",
    placeSlug: "musee-marmottan-monet",
    locationType: "museum",  // Current display location
    lat: 48.8587,
    lng: 2.2672,
    location: "Paris, France",
    connection: "Permanent home since 1940 - world's largest Monet collection",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8587,2.2672",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Tuesday-Sunday 10:00-18:00, Thursday until 21:00",
        admission: "14 EUR",
        tips: "Smaller and less crowded than Musee d'Orsay"
      }
    }
  },
  "impression-sunrise:le-havre-harbor": {
    workId: "impression-sunrise",
    placeName: "Le Havre Harbor",
    placeSlug: "le-havre-harbor",
    locationType: "depicted",  // The actual scene shown in the painting
    lat: 49.4897,
    lng: 0.1077,
    location: "Le Havre, Normandy, France",
    connection: "The exact location depicted - November 13, 1872, 7:35 AM",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.4897,0.1077",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Open 24 hours (outdoor harbor)",
        admission: "Free",
        tips: "Visit early morning in November to approximate the painting's conditions"
      }
    }
  },

  // ============================================
  // THE HARVEST - Blanche Hoschede Monet
  // ============================================
  "the-harvest-blanche-hoschede-monet:giverny": {
    workId: "the-harvest-blanche-hoschede-monet",
    placeName: "Giverny",
    placeSlug: "giverny",
    locationType: "depicted",  // Location painted in the work
    lat: 49.0759,
    lng: 1.5337,
    location: "Giverny, Normandy, France",
    connection: "Where Blanche lived 1883-1947 - painted harvest fields here",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.0759,1.5337",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "Village accessible year-round",
        admission: "Free",
        tips: "Late summer/autumn for harvest season scenery similar to her paintings"
      }
    }
  },
  "the-harvest-blanche-hoschede-monet:fondation-claude-monet": {
    workId: "the-harvest-blanche-hoschede-monet",
    placeName: "Fondation Claude Monet",
    placeSlug: "fondation-claude-monet",
    locationType: "artist",  // Where the artist lived/worked
    lat: 49.0754,
    lng: 1.5337,
    location: "84 Rue Claude Monet, 27620 Giverny, France",
    connection: "House/gardens where Blanche trained under Monet and preserved his legacy",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=49.0754,1.5337",
      placeId: null,
      images: [],
      reviews: [],
      visit: {
        hours: "April 1 - November 1, 9:30 AM - 6:00 PM",
        admission: "Approximately 13 EUR",
        tips: "Second most visited site in Normandy - book in advance"
      }
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get geo enrichment for a specific place
 * @param {string} workId - The work ID (e.g., "aw00000011")
 * @param {string} placeName - The place name to slugify and lookup
 * @returns {object|null} Geo enrichment data or null if not found
 */
function getGeoEnrichment(workId, placeName) {
  const slug = slugify(placeName);
  const key = `${workId}:${slug}`;
  return GEO_ENRICHMENTS[key] || null;
}

/**
 * Get all geo enrichments for a work
 * @param {string} workId - The work ID
 * @returns {array} Array of geo enrichment objects
 */
function getGeoEnrichmentsForWork(workId) {
  return Object.entries(GEO_ENRICHMENTS)
    .filter(([key]) => key.startsWith(`${workId}:`))
    .map(([key, data]) => data);
}

/**
 * Get all geo enrichments (for map display)
 * @returns {array} Array of all geo enrichment objects
 */
function getAllGeoEnrichments() {
  return Object.values(GEO_ENRICHMENTS);
}

/**
 * Check if a place has geo enrichment
 * @param {string} workId - The work ID
 * @param {string} placeName - The place name
 * @returns {boolean} True if enrichment exists
 */
function hasGeoEnrichment(workId, placeName) {
  return getGeoEnrichment(workId, placeName) !== null;
}

/**
 * Slugify a string for use as key
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')           // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-')    // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
}

/**
 * Merge enrichment data with basic place data
 * @param {object} place - Basic place object from work.places[]
 * @param {string} workId - The work ID
 * @returns {object} Merged place object with enrichment
 */
function enrichPlace(place, workId) {
  const enrichment = getGeoEnrichment(workId, place.name);
  if (!enrichment) return place;

  return {
    ...place,
    ...enrichment,
    // Preserve original lat/lng if enrichment doesn't have them
    lat: enrichment.lat || place.lat,
    lng: enrichment.lng || place.lng
  };
}

/**
 * Get enriched places for a work
 * @param {object} work - Work object with places array
 * @returns {array} Array of enriched place objects
 */
function getEnrichedPlaces(work) {
  if (!work.places) return [];
  return work.places.map(place => enrichPlace(place, work.id));
}
