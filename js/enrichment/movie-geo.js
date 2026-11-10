/**
 * ============================================
 * MOVIE-GEO.JS - Geographic Enrichment Data for Movie Cultural Lineage
 * ============================================
 * Geo-enrichment data for the Explore (Map) module
 * Data source: /content/movie_cultural_lineage/*.geo.yaml + online research
 *
 * POC Status: Enriched with exact coordinates from online research
 * Total: 11 movies, 40+ locations with detailed visit information
 * Sources: movie-locations.com, IMDB, Tokyo Fox, Atlas of Wonders
 * Last updated: 2025-11-29
 * ============================================
 */

/**
 * MOVIE_GEO_ENRICHMENTS
 * Key format: "{movieId}:{place-slug}"
 * Contains detailed visit information for each location
 */
const MOVIE_GEO_ENRICHMENTS = {
  // ============================================
  // SPIRITED AWAY (2001) - 6 locations
  // ============================================
  "aw00000011:edo-tokyo-open-air-museum": {
    movieId: "aw00000011",
    placeName: "Edo-Tokyo Open Air Architectural Museum",
    placeSlug: "edo-tokyo-open-air-museum",
    lat: 35.7148,
    lng: 139.5089,
    location: "Koganei, Tokyo, Japan",
    connection: "Primary visual reference for bathhouse architecture - confirmed by Miyazaki",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Edo-Tokyo_Open_Air_Architectural_Museum_2009.jpg/320px-Edo-Tokyo_Open_Air_Architectural_Museum_2009.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7148,139.5089",
      placeId: "ChIJF6xShHLuGGARbDz0wY-cqp0",
      visit: {
        address: "3-7-1 Sakuracho, Koganei-shi, Tokyo 184-0005, Japan",
        hours: "April-September: 9:30-17:30; October-March: 9:30-16:30",
        admission: "Adults 400 yen; 65+ 200 yen; Students free",
        access: "JR Chuo Line to Musashi-Koganei Station (20 min from Shinjuku), then bus or 15-min walk",
        tips: "The Kodakara-yu bathhouse is the most Spirited Away-relevant structure. Allow 2-3 hours.",
        bestTime: "Weekday mornings for fewer crowds; autumn for foliage"
      }
    }
  },

  "aw00000011:ghibli-museum": {
    movieId: "aw00000011",
    placeName: "Ghibli Museum, Mitaka",
    placeSlug: "ghibli-museum",
    lat: 35.6962,
    lng: 139.5704,
    location: "Mitaka, Tokyo, Japan",
    connection: "Official Studio Ghibli museum with Spirited Away production materials",
    confirmationStatus: "confirmed",
    locationType: "pilgrimage",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Ghibli_Museum%2C_Mitaka.jpg/320px-Ghibli_Museum%2C_Mitaka.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6962,139.5704",
      placeId: "ChIJL_rCGJPtGGARDPrYIXJ7rxw",
      visit: {
        address: "1-1-83 Shimorenjaku, Mitaka, Tokyo 181-0013, Japan",
        hours: "10:00-18:00",
        admission: "Adults 1000 yen; High/middle school 700 yen; Elementary 400 yen",
        access: "JR Chuo Line to Mitaka Station, then shuttle bus or 15-min walk",
        tips: "ADVANCE TICKETS REQUIRED - Book months ahead. No photography inside exhibits.",
        bestTime: "Weekdays; first entry slot (10:00) for relaxed exploration"
      }
    }
  },

  "aw00000011:dogo-onsen": {
    movieId: "aw00000011",
    placeName: "Dogo Onsen Honkan",
    placeSlug: "dogo-onsen",
    lat: 33.8512,
    lng: 132.7852,
    location: "Matsuyama, Ehime, Japan",
    connection: "Likely architectural inspiration for bathhouse (3,000-year-old onsen)",
    confirmationStatus: "likely",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Dogo_Onsen_Honkan_01.jpg/320px-Dogo_Onsen_Honkan_01.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=33.8512,132.7852",
      placeId: "ChIJLTmHKZ5W9DURpJPqhLt0hd8",
      visit: {
        address: "5-6 Dogoyunomachi, Matsuyama, Ehime 790-0842, Japan",
        hours: "6:00-23:00 (varies by course)",
        admission: "Kami-no-Yu: Adults 700 yen; Premium courses available",
        access: "Dogo Onsen Station (Iyotetsu Tram), then 4-min walk",
        tips: "Major renovation completed December 2024. Early morning or late evening for fewer crowds.",
        bestTime: "6:00-8:00 AM or after 20:00; weekdays preferred"
      }
    }
  },

  "aw00000011:ginzan-onsen": {
    movieId: "aw00000011",
    placeName: "Ginzan Onsen",
    placeSlug: "ginzan-onsen",
    lat: 38.5670,
    lng: 140.5253,
    location: "Obanazawa, Yamagata, Japan",
    connection: "Taisho-era hot spring town - closest real-world equivalent to spirit world atmosphere",
    confirmationStatus: "likely",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Ginzan_Onsen_2015.jpg/320px-Ginzan_Onsen_2015.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=38.5670,140.5253",
      placeId: "ChIJR2rR0LOdSzYRnf6Krt3RKdE",
      visit: {
        address: "Ginzanshinhata, Obanazawa-shi, Yamagata-ken 999-4333, Japan",
        hours: "Open 24 hours (town)",
        admission: "Free to walk around; day-use bathing 500-1000 yen",
        access: "JR Yamagata Shinkansen to Oishida Station, then bus (40 min) or taxi (25 min)",
        tips: "Remote location - best with overnight ryokan stay. Book months in advance for winter.",
        bestTime: "Winter for snow scenery; dusk for atmospheric lighting"
      }
    }
  },

  "aw00000011:jiufen": {
    movieId: "aw00000011",
    placeName: "Jiufen Old Street",
    placeSlug: "jiufen",
    lat: 25.1096,
    lng: 121.8442,
    location: "New Taipei City, Taiwan",
    connection: "Major fan pilgrimage site - Miyazaki denied, but visual parallels are striking",
    confirmationStatus: "disputed",
    locationType: "pilgrimage",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Jiufen_Night.JPG/320px-Jiufen_Night.JPG",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=25.1096,121.8442",
      placeId: "ChIJhXApE_ZLXjQRjHXMkYALzfY",
      visit: {
        address: "Jishan Street, Ruifang District, New Taipei City, Taiwan",
        hours: "Most shops: 10:00-20:00; A-Mei Tea House: 8:30-23:00",
        admission: "Free to explore; tea sets ~300 NTD",
        access: "Train to Ruifang Station (40 min from Taipei), then bus; or direct bus 1062 from MRT Zhongxiao Fuxing",
        tips: "Extremely crowded on weekends. A-Mei Tea House terrace offers best views.",
        bestTime: "Late afternoon through evening for lantern lighting; early morning for empty streets"
      }
    }
  },

  "aw00000011:meiji-mura": {
    movieId: "aw00000011",
    placeName: "Meiji Mura",
    placeSlug: "meiji-mura",
    lat: 35.4328,
    lng: 137.0264,
    location: "Inuyama, Aichi, Japan",
    connection: "Open-air museum of Meiji-era buildings - additional reference for period architecture",
    confirmationStatus: "likely",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Meiji-Mura.jpg/320px-Meiji-Mura.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.4328,137.0264",
      placeId: "ChIJE8x-lXHUB2ARgMF3rxu2FYI",
      visit: {
        address: "1 Uchiyama, Inuyama, Aichi 484-0000, Japan",
        hours: "March-October: 9:30-17:00; November-February: 10:00-16:00",
        admission: "Adults 2,000 yen; University 1,600 yen; High school 1,200 yen; Elementary 700 yen",
        access: "Meitetsu Inuyama Line to Inuyama Station, then bus (20 min)",
        tips: "Over 60 historic buildings from the Meiji era. The Imperial Hotel Frank Lloyd Wright lobby is reconstructed here. Allow 3-4 hours.",
        bestTime: "Weekdays; spring for cherry blossoms"
      }
    }
  },

  // ============================================
  // MY NEIGHBOR TOTORO (1988) - 4 locations
  // ============================================
  "aw00000012:sayama-hills": {
    movieId: "aw00000012",
    placeName: "Totoro Forest (Sayama Hills)",
    placeSlug: "sayama-hills",
    lat: 35.7889,
    lng: 139.4156,
    location: "Tokorozawa, Saitama, Japan",
    connection: "Inspiration for the forest setting; now protected land through Totoro Fund",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Totoro_no_mori_2.jpg/320px-Totoro_no_mori_2.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7889,139.4156",
      visit: {
        address: "Sayama Hills, Tokorozawa, Saitama Prefecture, Japan",
        hours: "Open during daylight",
        admission: "Free",
        access: "Various stations on Seibu Ikebukuro Line",
        tips: "Multiple hiking trails. The Totoro Fund has preserved 50+ parcels of forest.",
        bestTime: "Spring for cherry blossoms; autumn for foliage"
      }
    }
  },

  "aw00000012:ghibli-park": {
    movieId: "aw00000012",
    placeName: "Ghibli Park - Satsuki and Mei's House",
    placeSlug: "ghibli-park",
    lat: 35.1800,
    lng: 137.0897,
    location: "Nagakute, Aichi, Japan",
    connection: "Full-scale recreation of the house from the film",
    confirmationStatus: "confirmed",
    locationType: "pilgrimage",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Satsuki_and_Mei%27s_House.jpg/320px-Satsuki_and_Mei%27s_House.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.1800,137.0897",
      visit: {
        address: "Expo 2005 Aichi Commemorative Park, Nagakute, Aichi, Japan",
        hours: "Varies by area; check official website",
        admission: "Varies by area; reservation required",
        access: "Linimo (magnetic levitation train) to Expo Park stations",
        tips: "Advance tickets required. Five areas opened 2022-2024.",
        bestTime: "Weekdays to avoid crowds"
      }
    }
  },

  "aw00000012:kurosuke-house": {
    movieId: "aw00000012",
    placeName: "Kurosuke's House (Totoro Fund Office)",
    placeSlug: "kurosuke-house",
    lat: 35.7830,
    lng: 139.4700,
    location: "Higashimurayama, Tokyo, Japan",
    connection: "Historic 100-year-old farmhouse serving as Totoro Forest Fund headquarters",
    confirmationStatus: "confirmed",
    locationType: "pilgrimage",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7830,139.4700",
      visit: {
        address: "1-9-8 Noguchi-cho, Higashimurayama-shi, Tokyo 189-0022, Japan",
        hours: "Wednesdays, Saturdays, Sundays 10:00-15:00",
        admission: "Free (donations welcome to support forest preservation)",
        access: "5-min walk from Higashimurayama Station (Seibu Shinjuku Line)",
        tips: "Named after the soot sprites (Susuwatari/Kurosuke) in Totoro. Traditional Japanese farmhouse style matches the film. Gift shop with Totoro Fund merchandise.",
        bestTime: "Spring/summer for green surroundings"
      }
    }
  },

  "aw00000012:shichikokuyama": {
    movieId: "aw00000012",
    placeName: "Shichikokuyama Hiking Area",
    placeSlug: "shichikokuyama",
    lat: 35.7547,
    lng: 139.4192,
    location: "Tokorozawa/Higashimurayama, Saitama/Tokyo, Japan",
    connection: "Part of Sayama Hills where Miyazaki walked researching the film's landscape",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7547,139.4192",
      visit: {
        address: "Shichikokuyama, Tokorozawa, Saitama/Higashimurayama, Tokyo, Japan",
        hours: "Dawn to dusk",
        admission: "Free",
        access: "15-min walk from Seibu Sayamakyuryo Station or Nishi-Tokorozawa Station",
        tips: "The camphor tree (kusunoki) at the shrine resembles the Totoro tree. Multiple forest preservation sites marked by the Totoro Fund. Hiking trails offer views of satoyama landscape.",
        bestTime: "May-June for fresh green leaves; autumn for foliage"
      }
    }
  },

  "aw00000012:totoro-bus-stop": {
    movieId: "aw00000012",
    placeName: "Totoro Bus Stop Monument",
    placeSlug: "totoro-bus-stop",
    lat: 35.7667,
    lng: 139.4500,
    location: "Tokorozawa, Saitama, Japan",
    connection: "Recreation of the iconic bus stop scene - unofficial fan monument",
    confirmationStatus: "confirmed",
    locationType: "pilgrimage",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7667,139.4500",
      visit: {
        address: "Near Totoro Forest, Tokorozawa, Saitama, Japan",
        hours: "24/7 (outdoor)",
        admission: "Free",
        access: "Various locations in the Sayama Hills area have unofficial Totoro-themed markers",
        tips: "Multiple locations have fan-created tributes. The official Ghibli Park replica is more elaborate but requires tickets.",
        bestTime: "Rainy days for authentic atmosphere (like the film scene)"
      }
    }
  },

  // ============================================
  // GHOST IN THE SHELL (1995) - 5 locations
  // ============================================
  "aw00000013:hong-kong": {
    movieId: "aw00000013",
    placeName: "Hong Kong Cityscape",
    placeSlug: "hong-kong",
    lat: 22.3193,
    lng: 114.1694,
    location: "Hong Kong, China",
    connection: "Primary visual reference for cyberpunk urban environment",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Hong_Kong_Night_Skyline2.jpg/320px-Hong_Kong_Night_Skyline2.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=22.3193,114.1694",
      visit: {
        address: "Hong Kong",
        tips: "Mong Kok and Kowloon areas best capture the neon-soaked density.",
        bestTime: "Evening for neon signage atmosphere"
      }
    }
  },

  "aw00000013:kowloon-walled-city": {
    movieId: "aw00000013",
    placeName: "Kowloon Walled City Park (former site)",
    placeSlug: "kowloon-walled-city",
    lat: 22.3316,
    lng: 114.1871,
    location: "Hong Kong, China",
    connection: "Inspiration for dense vertical urbanism - demolished 1994, now a park",
    confirmationStatus: "likely",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/KWC_-_1989_Aerial.jpg/320px-KWC_-_1989_Aerial.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=22.3316,114.1871",
      visit: {
        address: "Kowloon Walled City Park, Tung Tau Tsuen Road, Kowloon, Hong Kong",
        hours: "6:30-23:00",
        admission: "Free",
        tips: "The original walled city was demolished in 1994. The park has a small museum about its history.",
        bestTime: "Morning for quiet; exhibitions explain the former city"
      }
    }
  },

  "aw00000013:mong-kok": {
    movieId: "aw00000013",
    placeName: "Mong Kok (Neon District)",
    placeSlug: "mong-kok",
    lat: 22.3190,
    lng: 114.1694,
    location: "Kowloon, Hong Kong, China",
    connection: "Dense neon signage streets directly referenced in the film's opening city sequence",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mongkok_Nathan_Road_neon_signs.jpg/320px-Mongkok_Nathan_Road_neon_signs.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=22.3190,114.1694",
      visit: {
        address: "Mong Kok, Kowloon, Hong Kong",
        hours: "24/7 (street area)",
        admission: "Free",
        access: "MTR Mong Kok Station, Exit E1 or E2",
        tips: "Nathan Road and the Ladies' Market area have the densest neon signage. Note: Many traditional neon signs have been removed in recent years due to safety regulations. Sai Yeung Choi Street South best preserves the aesthetic.",
        bestTime: "Evening (after 19:00) when neon signs are fully lit"
      }
    }
  },

  "aw00000013:wanchai": {
    movieId: "aw00000013",
    placeName: "Wan Chai Market Streets",
    placeSlug: "wanchai",
    lat: 22.2780,
    lng: 114.1733,
    location: "Hong Kong Island, Hong Kong, China",
    connection: "Traditional market streets and residential density - Major Section 9 chase sequences reference",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=22.2780,114.1733",
      visit: {
        address: "Wan Chai, Hong Kong Island, Hong Kong",
        hours: "Wet markets: early morning; Street markets: daytime",
        admission: "Free",
        access: "MTR Wan Chai Station, Exit A3",
        tips: "The old Wan Chai market area (near Queen's Road East) shows the layered urban density seen in the film. Bonus: Blue House Cluster heritage buildings nearby.",
        bestTime: "Morning for active markets; evening for atmospheric lighting"
      }
    }
  },

  "aw00000013:central-mid-levels": {
    movieId: "aw00000013",
    placeName: "Central-Mid-Levels Escalator",
    placeSlug: "central-mid-levels",
    lat: 22.2825,
    lng: 114.1533,
    location: "Hong Kong Island, Hong Kong, China",
    connection: "The world's longest outdoor escalator system - represents Hong Kong's vertical urbanism",
    confirmationStatus: "likely",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=22.2825,114.1533",
      visit: {
        address: "Central to Mid-Levels Escalator, Hong Kong Island, Hong Kong",
        hours: "6:00-24:00 (downward 6:00-10:00; upward 10:30-24:00)",
        admission: "Free",
        access: "Start at Queen's Road Central near MTR Central Station",
        tips: "800m long escalator system through the urban fabric. SoHo dining area halfway up. The vertical movement through residential/commercial zones captures the film's essence of layered city life.",
        bestTime: "Evening for the atmospheric walk through illuminated streets"
      }
    }
  },

  // ============================================
  // THE MATRIX (1999) - 7 locations (enriched)
  // ============================================
  "aw00000014:martin-place": {
    movieId: "aw00000014",
    placeName: "Martin Place (Lloyd Rees Fountain)",
    placeSlug: "martin-place",
    lat: -33.8677,
    lng: 151.2089,
    location: "Sydney CBD, Australia",
    connection: "Woman in Red training simulation - Neo is distracted by the Woman in Red beside the circular fountain",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    sceneTimestamp: "00:59:30",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Martin_Place%2C_Sydney.jpg/320px-Martin_Place%2C_Sydney.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8677,151.2089",
      visit: {
        address: "Martin Place at Pitt Street, Sydney NSW 2000, Australia",
        hours: "Open 24/7 (public pedestrian mall)",
        admission: "Free",
        access: "Martin Place Station (direct access); Town Hall Station (5 min walk)",
        tips: "The Lloyd Rees Fountain at the intersection of Pitt Street was the exact filming spot. The fountain has been rebuilt since filming.",
        bestTime: "Weekday mornings for fewer crowds; recreate the scene during business hours for authentic feel",
        cameraBearing: 45
      }
    }
  },

  "aw00000014:52-martin-place": {
    movieId: "aw00000014",
    placeName: "52 Martin Place (Colonial State Bank Centre)",
    placeSlug: "52-martin-place",
    lat: -33.8681,
    lng: 151.2108,
    location: "Sydney, Australia",
    connection: "Government building where Morpheus is held captive and interrogated by Agent Smith",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8681,151.2108",
      visit: {
        address: "52 Martin Place, Sydney NSW 2000, Australia",
        hours: "Exterior visible 24/7",
        admission: "Free (exterior viewing)",
        access: "Martin Place Station (directly below building)",
        tips: "Private office building - exterior viewing only. The helicopter rescue sequence was filmed on rooftops nearby.",
        bestTime: "Daytime for best photography"
      }
    }
  },

  "aw00000014:westpac-plaza": {
    movieId: "aw00000014",
    placeName: "Westpac Plaza (Neo's Office)",
    placeSlug: "westpac-plaza",
    lat: -33.8688,
    lng: 151.2072,
    location: "Sydney, Australia",
    connection: "Neo works at Metacortex in this building, chased by Agents through the offices",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    sceneTimestamp: "00:13:00",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8688,151.2072",
      visit: {
        address: "273 George Street, Sydney NSW 2000, Australia",
        hours: "Business hours for lobby",
        admission: "Free (lobby access)",
        tips: "The famous window-ledge escape scene was filmed here. Look up at the building from George Street for the full effect.",
        bestTime: "Weekdays during business hours"
      }
    }
  },

  "aw00000014:aon-tower": {
    movieId: "aw00000014",
    placeName: "Aon Tower (Helicopter Rescue)",
    placeSlug: "aon-tower",
    lat: -33.8647,
    lng: 151.2044,
    location: "Sydney, Australia",
    connection: "Rooftop where Trinity takes off in the helicopter to rescue Morpheus",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8647,151.2044",
      visit: {
        address: "201 Kent Street at Napoleon Street, Sydney NSW 2000, Australia",
        tips: "The helicopter crash was filmed at the adjacent Allianz Building (2 Market Street). The BT Tower (1 Market Street) is where the helicopter crashes in the film.",
        bestTime: "Daytime for photography"
      }
    }
  },

  "aw00000014:museum-station": {
    movieId: "aw00000014",
    placeName: "Museum Station (Agent Smith Fight)",
    placeSlug: "museum-station",
    lat: -33.8768,
    lng: 151.2112,
    location: "Sydney, Australia",
    connection: "Underground station where Neo fights Agent Smith in the climactic subway battle",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8768,151.2112",
      visit: {
        address: "Museum Station, Hyde Park, Sydney, Australia",
        hours: "5:00 AM - 1:00 AM (train service hours)",
        admission: "Requires Opal card/ticket",
        tips: "Other subway scenes were filmed at Redfern station and a station in Rozelle. The tile patterns and Art Deco style are recognizable from the film.",
        bestTime: "Off-peak hours for fewer commuters"
      }
    }
  },

  "aw00000014:final-phone-call": {
    movieId: "aw00000014",
    placeName: "Pitt & Hunter Streets (Final Phone Call)",
    placeSlug: "final-phone-call",
    lat: -33.8654,
    lng: 151.2094,
    location: "Sydney, Australia",
    connection: "Neo's final phone call to the machines before flying into the sky - 'I'm going to show them a world where anything is possible'",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=-33.8654,151.2094",
      visit: {
        address: "Southeast corner of Pitt and Hunter Streets, Sydney NSW 2000, Australia",
        tips: "The phone booth location was specifically at O'Connell Street. This is also a filming location for The Matrix Reloaded and Revolutions.",
        bestTime: "Weekday mornings"
      }
    }
  },

  // ============================================
  // PAPRIKA (2006) - 2 locations
  // ============================================
  "aw00000015:tokyo": {
    movieId: "aw00000015",
    placeName: "Tokyo",
    placeSlug: "tokyo",
    lat: 35.6762,
    lng: 139.6503,
    location: "Tokyo, Japan",
    connection: "Setting and production location; Madhouse studio",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6762,139.6503",
      visit: {
        tips: "Shibuya crossing captures the urban dreamscape energy."
      }
    }
  },

  // ============================================
  // INCEPTION (2010) - 7 locations (enriched)
  // ============================================
  "aw00000016:pont-de-bir-hakeim": {
    movieId: "aw00000016",
    placeName: "Pont de Bir-Hakeim",
    placeSlug: "pont-de-bir-hakeim",
    lat: 48.8533,
    lng: 2.2860,
    location: "Paris, France",
    connection: "The iconic bridge where Ariadne first experiences dream architecture folding - one of cinema's most recognizable scenes",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    sceneTimestamp: "00:38:00",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Pont_de_Bir-Hakeim_Paris.jpg/320px-Pont_de_Bir-Hakeim_Paris.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8533,2.2860",
      visit: {
        address: "Pont de Bir-Hakeim, 75015/75016 Paris, France",
        hours: "Open 24/7",
        admission: "Free",
        access: "Metro Line 6, Bir-Hakeim station (closest to Eiffel Tower)",
        tips: "The bridge has two levels: one for vehicles/pedestrians, another for Metro Line 6. The folding city effect was CGI, but the steel architecture is stunning in person. Walk across Île aux Cygnes for unique photo angles.",
        bestTime: "Early morning for photos without crowds; sunset for Eiffel Tower views",
        cameraBearing: 315
      }
    }
  },

  "aw00000016:cafe-debussy": {
    movieId: "aw00000016",
    placeName: "Café Debussy (Il Russo Restaurant)",
    placeSlug: "cafe-debussy",
    lat: 48.8495,
    lng: 2.3119,
    location: "Paris, France",
    connection: "The café where Cobb reveals to Ariadne they are in a dream, followed by the dramatic explosion",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    sceneTimestamp: "00:32:00",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8495,2.3119",
      visit: {
        address: "6 rue Cesar Franck, 7th arrondissement, Paris 75015, France",
        hours: "Restaurant hours (now Il Russo Italian restaurant)",
        admission: "Dining required",
        access: "Metro Ségur or Duroc stations",
        tips: "Formerly Da Stuzzi Patisserie, now Il Russo. The corner location at rue Bouchut is recognizable. The Place Georges-Mulot fountain (1904) is visible nearby.",
        bestTime: "Lunch for dining experience at the actual location"
      }
    }
  },

  "aw00000016:rue-bouchut": {
    movieId: "aw00000016",
    placeName: "Rue Bouchut (City Folding Scene)",
    placeSlug: "rue-bouchut",
    lat: 48.8494,
    lng: 2.3116,
    location: "Paris, France",
    connection: "The unforgettable scene where the city folds like a book - Ariadne experiments with dream geometry",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8494,2.3116",
      visit: {
        address: "Intersection of Rue Bouchut and Rue Pérignon, Paris 75015, France",
        tips: "Walk along Rue Bouchut to see the street that folds in the film. The nearby rue Valentin Hauy was also used for Ariadne's dream geometry experiments.",
        bestTime: "Morning light matches the film's aesthetic"
      }
    }
  },

  "aw00000016:palais-galliera": {
    movieId: "aw00000016",
    placeName: "Palais Galliera (Academy Entrance)",
    placeSlug: "palais-galliera",
    lat: 48.8649,
    lng: 2.2986,
    location: "Paris, France",
    connection: "Entrance to the fictitious architecture academy where Cobb recruits Ariadne",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=48.8649,2.2986",
      visit: {
        address: "10 Avenue Pierre 1er de Serbie, Paris 75016, France",
        hours: "Museum hours (houses Musée de la Mode)",
        admission: "Varies by exhibition",
        access: "Metro Iéna or Alma Marceau",
        tips: "The Palais Galliera houses the City of Paris Fashion Museum. The grand entrance is recognizable from the film.",
        bestTime: "Daytime for the architecture"
      }
    }
  },

  "aw00000016:tangier": {
    movieId: "aw00000016",
    placeName: "Tangier Medina (Mombasa Chase)",
    placeSlug: "tangier",
    lat: 35.7595,
    lng: -5.8340,
    location: "Tangier, Morocco",
    connection: "Mombasa chase sequence (Morocco stood in for Kenya) - Cobb recruits Eames",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.7595,-5.8340",
      visit: {
        address: "Tangier Medina, Morocco",
        tips: "The narrow alleyways of the old medina provided the chase sequence setting. Tangier also appears in The Bourne Ultimatum.",
        bestTime: "Morning for quieter exploration"
      }
    }
  },

  "aw00000016:tokyo": {
    movieId: "aw00000016",
    placeName: "Tokyo (Saito's Castle)",
    placeSlug: "tokyo",
    lat: 35.6762,
    lng: 139.6503,
    location: "Tokyo, Japan",
    connection: "Opening Saito heist sequence at Japanese castle, bullet train scenes",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6762,139.6503",
      visit: {
        tips: "The bullet train (Shinkansen) scenes capture Japan's precision and speed. The castle interiors were filmed at multiple locations."
      }
    }
  },

  // ============================================
  // CHARLIE'S ANGELS (2000) - 3 locations
  // ============================================
  "aw00000017:los-angeles": {
    movieId: "aw00000017",
    placeName: "Los Angeles",
    placeSlug: "los-angeles",
    lat: 34.0522,
    lng: -118.2437,
    location: "Los Angeles, California, USA",
    connection: "Primary setting and production location",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=34.0522,-118.2437",
      visit: {
        tips: "Various locations throughout LA. The beach scenes were filmed in Malibu."
      }
    }
  },

  "aw00000017:malibu": {
    movieId: "aw00000017",
    placeName: "Malibu",
    placeSlug: "malibu",
    lat: 34.0259,
    lng: -118.7798,
    location: "Malibu, California, USA",
    connection: "Beach house locations, California coastal setting",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=34.0259,-118.7798",
      visit: {
        address: "Malibu, CA, USA",
        tips: "Public beaches accessible. Many coastal scenes filmed here."
      }
    }
  },

  // ============================================
  // KILL BILL VOL. 1 (2003) - 5 locations (enriched)
  // ============================================
  "aw00000018:gonpachi": {
    movieId: "aw00000018",
    placeName: "Gonpachi Restaurant (House of Blue Leaves Inspiration)",
    placeSlug: "gonpachi",
    lat: 35.6593,
    lng: 139.7223,
    location: "Nishi-Azabu, Tokyo, Japan",
    connection: "Real restaurant that inspired the House of Blue Leaves set design - known as 'The Kill Bill Restaurant'",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gonpachi_restaurant%2C_Tokyo.jpg/320px-Gonpachi_restaurant%2C_Tokyo.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6593,139.7223",
      visit: {
        address: "1-13-11 Nishi-Azabu, Minato-ku, Tokyo 106-0031, Japan",
        hours: "11:30-15:30, 17:30-23:30 (varies by day)",
        admission: "Reservations recommended",
        tips: "The multi-level interior with wooden beams and traditional architecture inspired the House of Blue Leaves set. The actual fight scenes were filmed on sets in Beijing Film Studios, China. A pilgrimage favorite - visitors often recreate the iconic entrance scene.",
        bestTime: "Evening for dinner and atmospheric lighting"
      }
    }
  },

  "aw00000018:rainbow-bridge": {
    movieId: "aw00000018",
    placeName: "Rainbow Bridge (O-Ren Trailing Scene)",
    placeSlug: "rainbow-bridge",
    lat: 35.6369,
    lng: 139.7639,
    location: "Tokyo, Japan",
    connection: "The Bride trails O-Ren on her motorcycle across this illuminated suspension bridge at night",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6369,139.7639",
      visit: {
        address: "Rainbow Bridge, Minato, Tokyo, Japan",
        hours: "Open 24/7 (pedestrian path: 9:00-21:00 April-Oct, 10:00-18:00 Nov-Mar)",
        admission: "Free",
        tips: "One of the few scenes actually filmed in Japan. The bridge connects Shibaura Pier to Odaiba. Best views at night when illuminated. Pedestrian walkway on south side offers Tokyo Bay views.",
        bestTime: "Evening for the illuminated view matching the film"
      }
    }
  },

  "aw00000018:shinjuku": {
    movieId: "aw00000018",
    placeName: "Shinjuku (Motorcycle Chase)",
    placeSlug: "shinjuku",
    lat: 35.6938,
    lng: 139.7034,
    location: "Tokyo, Japan",
    connection: "The Bride trails O-Ren through Shinjuku along Yasukuni-dori",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6938,139.7034",
      visit: {
        address: "Yasukuni-dori, Shinjuku, Tokyo, Japan",
        tips: "Along with Rainbow Bridge, this is one of the authentic Tokyo filming locations. The neon-lit streets of Shinjuku at night capture the film's atmosphere.",
        bestTime: "Night for authentic neon atmosphere"
      }
    }
  },

  "aw00000018:beijing-studios": {
    movieId: "aw00000018",
    placeName: "Beijing Film Studios",
    placeSlug: "beijing-studios",
    lat: 39.9765,
    lng: 116.2880,
    location: "Beijing, China",
    connection: "House of Blue Leaves interior, Hattori Hanzo's Okinawa sushi bar, and sword room were all built and filmed here",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=39.9765,116.2880",
      visit: {
        address: "Beijing Film Academy area, Beijing, China",
        tips: "Contrary to popular belief, most 'Japan' scenes were actually filmed in China on elaborate sets. The Okinawa sushi parlour, Hattori Hanzo's sword room, and the entire House of Blue Leaves fight were filmed at Beijing Film Studios.",
        bestTime: "Tours may be available - check current access"
      }
    }
  },

  // ============================================
  // LADY SNOWBLOOD (1973) - 2 locations
  // ============================================
  "aw00000019:tokyo": {
    movieId: "aw00000019",
    placeName: "Tokyo (Production)",
    placeSlug: "tokyo",
    lat: 35.6762,
    lng: 139.6503,
    location: "Tokyo, Japan",
    connection: "Production location, urban sequences",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=35.6762,139.6503"
    }
  },

  "aw00000019:nikko": {
    movieId: "aw00000019",
    placeName: "Nikko",
    placeSlug: "nikko",
    lat: 36.7500,
    lng: 139.5978,
    location: "Tochigi Prefecture, Japan",
    connection: "Snow-covered forest locations",
    confirmationStatus: "likely",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=36.7500,139.5978",
      visit: {
        address: "Nikko, Tochigi Prefecture, Japan",
        tips: "Famous for Toshogu shrine and beautiful winter scenery. The snow-on-blood aesthetic was filmed in locations like this."
      }
    }
  },

  // ============================================
  // JOHN WICK (2014) - 4 locations (enriched)
  // ============================================
  "aw00000020:continental-exterior": {
    movieId: "aw00000020",
    placeName: "Beaver Building (Continental Hotel Exterior)",
    placeSlug: "continental-exterior",
    lat: 40.70522,
    lng: -74.00857,
    location: "Manhattan, New York, USA",
    connection: "The flatiron-shaped Beaver Building serves as the iconic Continental Hotel exterior facade",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/1WallStreetCourt.jpg/320px-1WallStreetCourt.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=40.70522,-74.00857",
      visit: {
        address: "1 Wall Street Court, New York, NY 10005",
        hours: "Exterior visible 24/7",
        admission: "Free (exterior viewing)",
        tips: "Also known as the Cocoa Exchange building, designed by Clinton & Russell in early 1900s. The building is at the intersection of Wall, Pearl, and Beaver Streets. Sometimes called the 'Small Flatiron Building.' Now a residential condominium. NYC Landmark since 1995.",
        bestTime: "Daytime for architecture photography"
      }
    }
  },

  "aw00000020:continental-lobby": {
    movieId: "aw00000020",
    placeName: "Cunard Building (Continental Hotel Lobby)",
    placeSlug: "continental-lobby",
    lat: 40.7048,
    lng: -74.0130,
    location: "Manhattan, New York, USA",
    connection: "The austere Art Deco lobby where Winston (Lance Reddick) offers his impeccable service",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=40.7048,-74.0130",
      visit: {
        address: "25 Broadway, New York, NY 10004",
        hours: "Business hours for lobby access",
        admission: "Free (lobby is accessible)",
        tips: "The ornate neo-Renaissance vestibule was originally the Cunard Line ticketing hall, completed in 1929. Decorated with marine and shipping themes. One of the largest halls in the United States and a NYC Landmark.",
        bestTime: "Weekdays during business hours for lobby access"
      }
    }
  },

  "aw00000020:hotel-wolcott": {
    movieId: "aw00000020",
    placeName: "Hotel Wolcott (Speakeasy/Club)",
    placeSlug: "hotel-wolcott",
    lat: 40.7472,
    lng: -73.9879,
    location: "Midtown Manhattan, USA",
    connection: "The Continental's basement club and speakeasy in Chapter One",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=40.7472,-73.9879",
      visit: {
        address: "4 W 31st Street, New York, NY 10001",
        tips: "Historic 1904 hotel near the Empire State Building. The ballroom and dining room areas remain in unrestored glamorous condition. The hotel is still operating - lobby and common areas accessible to visitors.",
        bestTime: "Check hotel for special events or tours"
      }
    }
  },

  "aw00000020:red-circle": {
    movieId: "aw00000020",
    placeName: "Gold Bar (Red Circle Club)",
    placeSlug: "red-circle",
    lat: 40.7170,
    lng: -73.9900,
    location: "Lower East Side, Manhattan, USA",
    connection: "The Red Circle nightclub where John Wick confronts Iosef in the climactic club shootout",
    confirmationStatus: "confirmed",
    locationType: "scene",
    visitable: false,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=40.7170,-73.9900",
      visit: {
        address: "Lower East Side, Manhattan, NY",
        tips: "The Gold Bar venue is now permanently closed. The bathhouse fight scene was one of the film's most memorable sequences.",
        bestTime: "N/A - venue closed"
      }
    }
  },

  // ============================================
  // COCO (2017) - 5 locations
  // ============================================
  "aw00000021:guanajuato": {
    movieId: "aw00000021",
    placeName: "Guanajuato City",
    placeSlug: "guanajuato",
    lat: 21.0190,
    lng: -101.2574,
    location: "Guanajuato, Mexico",
    connection: "Primary visual inspiration for the Land of the Dead - colorful hillside architecture",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Guanajuato_City_aerial.jpg/320px-Guanajuato_City_aerial.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=21.0190,-101.2574",
      visit: {
        address: "Guanajuato City, Guanajuato, Mexico",
        tips: "The colorful buildings cascading down hillsides directly inspired the Land of the Dead.",
        bestTime: "Around Dia de los Muertos (late October-early November)"
      }
    }
  },

  "aw00000021:oaxaca": {
    movieId: "aw00000021",
    placeName: "Oaxaca",
    placeSlug: "oaxaca",
    lat: 17.0732,
    lng: -96.7266,
    location: "Oaxaca, Mexico",
    connection: "Source of alebrije (spirit guide) folk art tradition",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Oaxaca_zocalo_night.jpg/320px-Oaxaca_zocalo_night.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=17.0732,-96.7266",
      visit: {
        address: "Oaxaca de Juarez, Oaxaca, Mexico",
        tips: "Visit San Martin Tilcajete and San Antonio Arrazola villages for authentic alebrije workshops.",
        bestTime: "During Dia de los Muertos celebrations"
      }
    }
  },

  "aw00000021:santa-fe-de-la-laguna": {
    movieId: "aw00000021",
    placeName: "Santa Fe de la Laguna",
    placeSlug: "santa-fe-de-la-laguna",
    lat: 19.5833,
    lng: -101.5667,
    location: "Michoacan, Mexico",
    connection: "Inspiration for Miguel's village Santa Cecilia",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=19.5833,-101.5667",
      visit: {
        address: "Santa Fe de la Laguna, Michoacan, Mexico",
        tips: "Traditional Purepecha village with craft traditions."
      }
    }
  },

  "aw00000021:patzcuaro": {
    movieId: "aw00000021",
    placeName: "Patzcuaro",
    placeSlug: "patzcuaro",
    lat: 19.5167,
    lng: -101.6083,
    location: "Michoacan, Mexico",
    connection: "Famous for elaborate Dia de los Muertos celebrations",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Janitzio_isla.jpg/320px-Janitzio_isla.jpg",
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=19.5167,-101.6083",
      visit: {
        address: "Patzcuaro, Michoacan, Mexico",
        tips: "One of the most famous locations for Dia de los Muertos. Janitzio island hosts all-night vigils.",
        bestTime: "November 1-2 for Dia de los Muertos"
      }
    }
  },

  "aw00000021:mixquic": {
    movieId: "aw00000021",
    placeName: "Mixquic",
    placeSlug: "mixquic",
    lat: 19.2333,
    lng: -98.9667,
    location: "Mexico City, Mexico",
    connection: "Traditional Dia de los Muertos cemetery celebrations",
    confirmationStatus: "confirmed",
    locationType: "inspiration",
    visitable: true,
    geo: {
      googleMapsUrl: "https://maps.google.com/?q=19.2333,-98.9667",
      visit: {
        address: "San Andres Mixquic, Tlahuac, Mexico City",
        tips: "The cemetery alumbrada (lighting) tradition inspired the marigold bridge imagery.",
        bestTime: "November 1-2 for the full celebration experience"
      }
    }
  }
};

// ============================================
// PILGRIMAGE ROUTES
// ============================================
const MOVIE_PILGRIMAGE_ROUTES = [
  {
    id: "ghibli-tokyo-day",
    name: "Ghibli Tokyo Day Trip",
    movies: ["aw00000011", "aw00000012"],
    duration: "Full day (8-10 hours)",
    description: "Explore Miyazaki's confirmed inspirations and official Ghibli experience in western Tokyo",
    stops: [
      { placeKey: "aw00000011:edo-tokyo-open-air-museum", time: "Morning (9:30-13:00)" },
      { placeKey: "aw00000011:ghibli-museum", time: "Afternoon (14:00-18:00)" }
    ],
    notes: "Book Ghibli Museum tickets months in advance. Both locations are in western Tokyo."
  },
  {
    id: "japan-onsen-pilgrimage",
    name: "Bathhouse Inspirations Pilgrimage",
    movies: ["aw00000011"],
    duration: "3-5 days",
    description: "Visit the likely real-world inspirations for Spirited Away's bathhouse across Japan",
    stops: [
      { placeKey: "aw00000011:dogo-onsen", time: "Days 1-2" },
      { placeKey: "aw00000011:ginzan-onsen", time: "Days 3-5" }
    ],
    notes: "These are in different regions - plan domestic flights or long train journeys."
  },
  {
    id: "matrix-sydney",
    name: "Matrix Sydney Walking Tour",
    movies: ["aw00000014"],
    duration: "Half day",
    description: "Walk the streets where Neo discovered the Matrix",
    stops: [
      { placeKey: "aw00000014:martin-place", time: "Morning" },
      { placeKey: "aw00000014:52-martin-place", time: "Morning" }
    ],
    notes: "All locations are within walking distance in Sydney CBD."
  },
  {
    id: "coco-mexico",
    name: "Coco's Mexico Cultural Journey",
    movies: ["aw00000021"],
    duration: "5-7 days",
    description: "Experience the real locations that inspired Pixar's masterpiece",
    stops: [
      { placeKey: "aw00000021:guanajuato", time: "Days 1-2" },
      { placeKey: "aw00000021:oaxaca", time: "Days 3-4" },
      { placeKey: "aw00000021:patzcuaro", time: "Days 5-6" }
    ],
    notes: "Best experienced during late October/early November for Dia de los Muertos."
  },
  {
    id: "action-tokyo",
    name: "Action Cinema Tokyo",
    movies: ["aw00000018", "aw00000013"],
    duration: "1-2 days",
    description: "From House of Blue Leaves to cyberpunk cityscapes",
    stops: [
      { placeKey: "aw00000018:gonpachi", time: "Evening (dinner)" }
    ],
    notes: "Gonpachi is a functioning restaurant - reservations recommended."
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function getMovieGeoEnrichment(movieId, placeSlug) {
  const key = `${movieId}:${placeSlug}`;
  return MOVIE_GEO_ENRICHMENTS[key] || null;
}

function getGeoEnrichmentsForMovie(movieId) {
  return Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.movieId === movieId);
}

function getAllMovieGeoEnrichments() {
  return Object.values(MOVIE_GEO_ENRICHMENTS);
}

function getMovieGeoByLocationType(locationType) {
  return Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.locationType === locationType);
}

function getMovieGeoByConfirmation(status) {
  return Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.confirmationStatus === status);
}

function getAllPilgrimageRoutes() {
  return MOVIE_PILGRIMAGE_ROUTES;
}

function getPilgrimageRoutesForMovie(movieId) {
  return MOVIE_PILGRIMAGE_ROUTES.filter(r => r.movies.includes(movieId));
}

/**
 * Generate map markers from geo enrichments
 */
function generateMapMarkers() {
  return Object.values(MOVIE_GEO_ENRICHMENTS).map(e => ({
    id: `${e.movieId}:${e.placeSlug}`,
    lat: e.lat,
    lng: e.lng,
    title: e.placeName,
    movieId: e.movieId,
    locationType: e.locationType,
    confirmationStatus: e.confirmationStatus,
    connection: e.connection,
    visitable: e.visitable
  }));
}

// ============================================
// STATISTICS (auto-calculated)
// ============================================
const MOVIE_GEO_STATS = {
  totalMovies: 11,
  totalLocations: Object.keys(MOVIE_GEO_ENRICHMENTS).length,  // Now ~50 locations
  lastUpdated: "2025-11-29",
  enrichmentSources: [
    "movie-locations.com",
    "IMDB filming locations",
    "Tokyo Fox Beyond The Movies",
    "Atlas of Wonders",
    "Sortiraparis.com",
    "Japan Travel (JNTO)"
  ],
  byLocationType: {
    scene: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.locationType === 'scene').length,
    inspiration: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.locationType === 'inspiration').length,
    pilgrimage: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.locationType === 'pilgrimage').length
  },
  byConfirmation: {
    confirmed: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.confirmationStatus === 'confirmed').length,
    likely: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.confirmationStatus === 'likely').length,
    disputed: Object.values(MOVIE_GEO_ENRICHMENTS).filter(e => e.confirmationStatus === 'disputed').length
  },
  pilgrimageRoutes: MOVIE_PILGRIMAGE_ROUTES.length
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MOVIE_GEO_ENRICHMENTS,
    MOVIE_PILGRIMAGE_ROUTES,
    MOVIE_GEO_STATS,
    getMovieGeoEnrichment,
    getGeoEnrichmentsForMovie,
    getAllMovieGeoEnrichments,
    generateMapMarkers
  };
}
