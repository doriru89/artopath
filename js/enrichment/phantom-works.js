/**
 * ============================================
 * PHANTOM-WORKS.JS - Enrichment Data for External/Phantom Works
 * ============================================
 *
 * PURPOSE: Provide basic people/creator data for works referenced in lineage
 * but not fully present in the vault. This allows phantom nodes in DNA to show
 * their creators, making the graph more informative.
 *
 * USAGE: When creating a phantom node for a work like "Alice in Wonderland",
 * look up PHANTOM_WORK_DATA[normalizedTitle] to get creator information.
 *
 * MAINTENANCE: Add entries for works frequently referenced in lineage sections.
 * ============================================
 */

const PHANTOM_WORK_DATA = {
  // ============================================
  // CLASSIC LITERATURE ADAPTATIONS
  // ============================================
  "alice in wonderland": {
    title: "Alice in Wonderland",
    year: 1951,
    type: "movie",
    people: [
      { name: "Lewis Carroll", role: "Original Author", bio: "Wrote Alice's Adventures in Wonderland (1865)" },
      { name: "Walt Disney", role: "Producer", bio: "Disney's animated adaptation brought Alice to global audiences" }
    ]
  },
  "the wizard of oz": {
    title: "The Wizard of Oz",
    year: 1939,
    type: "movie",
    people: [
      { name: "Victor Fleming", role: "Director", bio: "Also directed Gone with the Wind (1939)" },
      { name: "L. Frank Baum", role: "Original Author", bio: "Wrote The Wonderful Wizard of Oz (1900)" },
      { name: "Judy Garland", role: "Lead Actress", bio: "Iconic performance as Dorothy at age 16" }
    ]
  },

  // ============================================
  // CYBERPUNK / SCI-FI FOUNDATIONS
  // ============================================
  "blade runner": {
    title: "Blade Runner",
    year: 1982,
    type: "movie",
    people: [
      { name: "Ridley Scott", role: "Director", bio: "Master of sci-fi worldbuilding (Alien, Blade Runner)" },
      { name: "Philip K. Dick", role: "Original Author", bio: "Wrote 'Do Androids Dream of Electric Sheep?'" },
      { name: "Harrison Ford", role: "Lead Actor", bio: "Rick Deckard, the blade runner" },
      { name: "Vangelis", role: "Composer", bio: "Created the iconic synthesizer score" }
    ]
  },
  "akira": {
    title: "Akira",
    year: 1988,
    type: "movie",
    people: [
      { name: "Katsuhiro Otomo", role: "Director & Creator", bio: "Created the manga and directed the groundbreaking film" }
    ]
  },
  "neuromancer": {
    title: "Neuromancer",
    year: 1984,
    type: "novel",
    people: [
      { name: "William Gibson", role: "Author", bio: "Father of cyberpunk fiction" }
    ]
  },

  // ============================================
  // MARTIAL ARTS / ACTION CINEMA
  // ============================================
  "the killer": {
    title: "The Killer",
    year: 1989,
    type: "movie",
    people: [
      { name: "John Woo", role: "Director", bio: "Pioneer of heroic bloodshed genre" },
      { name: "Chow Yun-fat", role: "Lead Actor", bio: "Iconic dual-pistol action star" }
    ]
  },
  "hard boiled": {
    title: "Hard Boiled",
    year: 1992,
    type: "movie",
    people: [
      { name: "John Woo", role: "Director", bio: "Pioneer of heroic bloodshed genre" },
      { name: "Chow Yun-fat", role: "Lead Actor", bio: "Iconic dual-pistol action star" }
    ]
  },
  "le samourai": {
    title: "Le Samourai",
    year: 1967,
    type: "movie",
    people: [
      { name: "Jean-Pierre Melville", role: "Director", bio: "French master of minimalist crime cinema" },
      { name: "Alain Delon", role: "Lead Actor", bio: "Stoic hitman Jef Costello" }
    ]
  },

  // ============================================
  // ANIME INFLUENCES
  // ============================================
  "perfect blue": {
    title: "Perfect Blue",
    year: 1997,
    type: "movie",
    people: [
      { name: "Satoshi Kon", role: "Director", bio: "Master of psychological anime, died 2010" }
    ]
  },
  "tokyo godfathers": {
    title: "Tokyo Godfathers",
    year: 2003,
    type: "movie",
    people: [
      { name: "Satoshi Kon", role: "Director", bio: "Master of psychological anime" }
    ]
  },
  "millennium actress": {
    title: "Millennium Actress",
    year: 2001,
    type: "movie",
    people: [
      { name: "Satoshi Kon", role: "Director", bio: "Master of psychological anime" }
    ]
  },
  "princess mononoke": {
    title: "Princess Mononoke",
    year: 1997,
    type: "movie",
    people: [
      { name: "Hayao Miyazaki", role: "Director", bio: "Studio Ghibli co-founder" },
      { name: "Joe Hisaishi", role: "Composer", bio: "Long-time Miyazaki collaborator" }
    ]
  },
  "nausicaa of the valley of the wind": {
    title: "Nausicaa of the Valley of the Wind",
    year: 1984,
    type: "movie",
    people: [
      { name: "Hayao Miyazaki", role: "Director & Creator", bio: "Led to founding of Studio Ghibli" },
      { name: "Joe Hisaishi", role: "Composer", bio: "First collaboration with Miyazaki" }
    ]
  },
  "howl's moving castle": {
    title: "Howl's Moving Castle",
    year: 2004,
    type: "movie",
    people: [
      { name: "Hayao Miyazaki", role: "Director", bio: "Studio Ghibli co-founder" },
      { name: "Diana Wynne Jones", role: "Original Author", bio: "Wrote the 1986 fantasy novel" },
      { name: "Joe Hisaishi", role: "Composer", bio: "Long-time Miyazaki collaborator" }
    ]
  },

  // ============================================
  // CLASSIC DIRECTORS
  // ============================================
  "8 1/2": {
    title: "8 1/2",
    year: 1963,
    type: "movie",
    people: [
      { name: "Federico Fellini", role: "Director", bio: "Italian master of surrealist cinema" },
      { name: "Marcello Mastroianni", role: "Lead Actor", bio: "Fellini's frequent collaborator" }
    ]
  },
  "vertigo": {
    title: "Vertigo",
    year: 1958,
    type: "movie",
    people: [
      { name: "Alfred Hitchcock", role: "Director", bio: "Master of suspense" },
      { name: "James Stewart", role: "Lead Actor", bio: "Scottie Ferguson" },
      { name: "Kim Novak", role: "Lead Actress", bio: "Dual role as Madeleine/Judy" }
    ]
  },
  "psycho": {
    title: "Psycho",
    year: 1960,
    type: "movie",
    people: [
      { name: "Alfred Hitchcock", role: "Director", bio: "Master of suspense" },
      { name: "Anthony Perkins", role: "Lead Actor", bio: "Norman Bates" },
      { name: "Bernard Herrmann", role: "Composer", bio: "Iconic shower scene score" }
    ]
  },

  // ============================================
  // CARAVAGGIO & OLD MASTERS
  // ============================================
  "caravaggio's chiaroscuro": {
    title: "Caravaggio's Chiaroscuro",
    year: 1600,
    type: "technique",
    people: [
      { name: "Caravaggio", role: "Artist", bio: "Revolutionary tenebrism lighting technique" }
    ]
  },
  "leonardo da vinci's mona lisa": {
    title: "Mona Lisa",
    year: 1503,
    type: "artwork",
    people: [
      { name: "Leonardo da Vinci", role: "Artist", bio: "Renaissance polymath, sfumato master" }
    ]
  },
  "rubens's lion hunt": {
    title: "Rubens's Lion Hunt",
    year: 1621,
    type: "artwork",
    people: [
      { name: "Peter Paul Rubens", role: "Artist", bio: "Baroque master of dynamic composition" }
    ]
  },

  // ============================================
  // MODERN ANIMATION INFLUENCES
  // ============================================
  "over the garden wall": {
    title: "Over the Garden Wall",
    year: 2014,
    type: "series",
    people: [
      { name: "Patrick McHale", role: "Creator & Director", bio: "Former Adventure Time writer" }
    ]
  },
  "avatar: the last airbender": {
    title: "Avatar: The Last Airbender",
    year: 2005,
    type: "series",
    people: [
      { name: "Michael Dante DiMartino", role: "Co-Creator", bio: "Created with Bryan Konietzko" },
      { name: "Bryan Konietzko", role: "Co-Creator", bio: "Created with Michael DiMartino" }
    ]
  },

  // ============================================
  // PHILOSOPHERS & THINKERS
  // ============================================
  "simulacra and simulation": {
    title: "Simulacra and Simulation",
    year: 1981,
    type: "philosophy",
    people: [
      { name: "Jean Baudrillard", role: "Author", bio: "French philosopher and cultural theorist" }
    ]
  },
  "plato's allegory of the cave": {
    title: "Allegory of the Cave",
    year: -380,
    type: "philosophy",
    people: [
      { name: "Plato", role: "Philosopher", bio: "Ancient Greek philosopher" }
    ]
  }
};

/**
 * Look up enrichment data for a phantom work by title
 * @param {string} title - The work title to look up
 * @returns {Object|null} - Enrichment data or null if not found
 */
function getPhantomWorkData(title) {
  if (!title) return null;
  const normalizedTitle = title.toLowerCase().trim();
  return PHANTOM_WORK_DATA[normalizedTitle] || null;
}

/**
 * Get people/creators for a phantom work
 * @param {string} title - The work title to look up
 * @returns {Array} - Array of person objects with name, role, bio
 */
function getPhantomWorkPeople(title) {
  const data = getPhantomWorkData(title);
  return data?.people || [];
}

// Export for use in other modules
window.PHANTOM_WORK_DATA = PHANTOM_WORK_DATA;
window.getPhantomWorkData = getPhantomWorkData;
window.getPhantomWorkPeople = getPhantomWorkPeople;
