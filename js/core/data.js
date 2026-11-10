/**
 * ============================================
 * DATA.JS - Artwork Data for Early POC
 * 10 Artworks in CANONICAL shape (ADR-018)
 * Structure based on CANONICAL_WORK_SHAPE.md
 * ============================================
 */

const WORKS = [
  // ============================================
  // ARTWORKS - Second Art Brain Entries
  // ============================================

  // ============================================
  // GIRL WITH A PEARL EARRING (c. 1665)
  // ============================================
  {
    id: "aw1",
    work_type: "painting",
    title_display: "Girl with a Pearl Earring",
    title_original: "Meisje met de parel",
    title_original_lang: "Dutch",
    external_ids: {
      wikidata: "Q3140774",
      rkd: "31tried-1",
      mauritshuis: "670"
    },
    work_form: "Oil on canvas / Tronie",
    date_created_year: 1665,
    country_of_origin: "Netherlands",
    medium: "Oil on canvas",
    dimensions: "44.5 x 39 cm",
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "mystery of identity" },
      { tag_type: "theme", tag_label: "the gaze" },
      { tag_type: "theme", tag_label: "Dutch Golden Age" },
      { tag_type: "theme", tag_label: "beauty in ordinary moments" },
      { tag_type: "emotion", tag_label: "intimate" },
      { tag_type: "emotion", tag_label: "haunting" },
      { tag_type: "emotion", tag_label: "tender" },
      { tag_type: "emotion", tag_label: "quietly magnetic" },
      { tag_type: "geo", tag_label: "Netherlands" },
      { tag_type: "geo", tag_label: "Delft" },
      { tag_type: "geo", tag_label: "The Hague" }
    ],

    glance: "A young woman turns toward us from darkness, her gaze intimate and unreadable, a single pearl catching light like a tear-or a secret kept for centuries.",
    story: {
      cultural_context: "Created during the Dutch Golden Age-a period of unprecedented wealth, scientific inquiry, and artistic flowering in the Netherlands. Vermeer worked in Delft, a city known for ceramics and optics. The painting emerged from a culture fascinated by light, lenses, and the mechanics of seeing.",
      surface_layer: "A young woman in three-quarter profile turns toward us, caught mid-glance. She wears a blue and yellow turban and a single luminous pearl earring. Her parted lips suggest she's about to speak-or has just stopped. The face emerges from absolute darkness, with soft light illuminating her skin and catching the pearl in two masterful strokes of white paint.",
      type_aesthetic: "Tronie (character study) with Caravaggesque lighting. Simple composition-figure emerging from pure black background. Restrained palette of ultramarine blue (lapis lazuli), ochre yellow, soft flesh tones.",
      core_philosophy: "What does it mean to truly see another person-and to be seen? The girl's gaze creates an impossible intimacy across centuries, yet she remains fundamentally unknowable.",
      receipt: "Arthur K. Wheelock Jr.: 'captures a sense of human-ness in her expression, in her expectancy...the painting speaks to human desire to connect across time, space, and circumstance.'",
      observation_details: [
        { label: "The Gaze", value: "Direct eye contact with the viewer, unusual for the era" },
        { label: "The Pearl", value: "Too large to be real-painted with just two strokes of white" },
        { label: "Lighting", value: "Single light source from upper left, Caravaggesque tenebrism" },
        { label: "The Lips", value: "Slightly parted, creating anticipation of speech" }
      ]
    },
    deep_dive: {
      overview: "Often called the 'Mona Lisa of the North,' this tronie has become one of art history's most recognized images. Only 36 paintings are attributed to Vermeer's lifetime.",
      production: "Vermeer worked slowly with expensive pigments (ultramarine from lapis lazuli). The pearl itself may be fiction-too large and perfect to be real, it catches light with two strokes of white paint.",
      themes: "The exotic turban suggests Ottoman/Oriental influence and Dutch global trade. The parted lips-speech about to begin, or just ended-create perpetual anticipation."
    },

    person_roles: [
      {
        person: {
          id: "ap1",
          name_display: "Johannes Vermeer",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "Born and died in Delft (1632-1675). Worked slowly, possibly using a camera obscura. Only 36 paintings attributed to him.",
        source_type: "primary"
      }
    ],

    work_relations: [
      // Influenced by
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Caravaggio's chiaroscuro" }, confidence: "verified", source_type: "secondary", note: "Revolutionary tenebrism - single-source dramatic lighting" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Leonardo da Vinci's Mona Lisa" }, confidence: "corroborated", source_type: "secondary", note: "Three-quarter pose, enigmatic gaze" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Raphael's portraits" }, confidence: "corroborated", source_type: "secondary", note: "Renaissance idealized beauty" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Utrecht Caravaggisti" }, confidence: "verified", source_type: "secondary", note: "Terbrugghen & Honthorst brought Caravaggio's style north 1610s-1620s" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Rembrandt van Rijn" }, confidence: "verified", source_type: "secondary", note: "Psychological penetration, dramatic light-dark contrasts" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Carel Fabritius" }, confidence: "verified", source_type: "secondary", note: "Delft predecessor - light-infused interiors, died 1654" },
      { relation_type: "reinterpretation_of", to_work: { id: null, title_display: "Camera obscura technology" }, confidence: "corroborated", source_type: "secondary", note: "Optical device - explains precise perspective" },
      { relation_type: "reinterpretation_of", to_work: { id: null, title_display: "Tronie painting tradition" }, confidence: "verified", source_type: "secondary", note: "Character study, not formal portrait" },
      { relation_type: "reinterpretation_of", to_work: { id: null, title_display: "Dutch global trade" }, confidence: "verified", source_type: "secondary", note: "Ultramarine pigment, Oriental turban fabric" },
      // Influences
      { relation_type: "influenced", to_work: { id: null, title_display: "Claude Monet" }, confidence: "verified", source_type: "secondary", note: "Called Vermeer 'Sphinx of Delft' - studied his light" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Camille Pissarro" }, confidence: "verified", source_type: "secondary", note: "Impressionist light techniques owe debt to Vermeer" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Pierre-Auguste Renoir" }, confidence: "corroborated", source_type: "secondary", note: "Soft focus, glowing skin tones" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Vermeer revival (1866)" }, confidence: "verified", source_type: "secondary", note: "Critic Theophile Thore rediscovered after 200 years" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Pictorialist photography" }, confidence: "verified", source_type: "secondary", note: "1890s-1920s photographers emulated his light" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Richard Avedon" }, confidence: "corroborated", source_type: "secondary", note: "Direct gaze, psychological intimacy in photography" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Pre-Raphaelites" }, confidence: "corroborated", source_type: "secondary", note: "Admired meticulous technique, frozen moment quality" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Edward Hopper" }, confidence: "corroborated", source_type: "secondary", note: "Quiet moments, solitary figures, light as emotion" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Contemporary hyperrealism" }, confidence: "corroborated", source_type: "secondary", note: "Gerhard Richter, Chuck Close - photographic gaze" },
      { relation_type: "echoed_in", to_work: { id: null, title_display: "Steve McCurry's 'Afghan Girl'" }, confidence: "verified", source_type: "secondary", note: "Nat Geo 1984 - piercing gaze, exotic headwear" },
      { relation_type: "echoed_in", to_work: { id: null, title_display: "Tracy Chevalier's novel (1999)" }, confidence: "verified", source_type: "secondary", note: "Bestseller imagining sitter as servant Griet" },
      { relation_type: "echoed_in", to_work: { id: null, title_display: "Film adaptation (2003)" }, confidence: "verified", source_type: "secondary", note: "Scarlett Johansson - every frame mimics Vermeer lighting" },
      { relation_type: "echoed_in", to_work: { id: null, title_display: "'Mona Lisa of the North'" }, confidence: "verified", source_type: "secondary", note: "Netherlands' most recognized painting globally" }
    ],

    voices: {
      expert: [
        {
          source: "Arthur K. Wheelock Jr.",
          quote: "The painting speaks to human desire to connect across time, space, and circumstance.",
          translation: "We keep looking because we feel like she's looking back-really looking."
        }
      ],
      community: [
        {
          quote: "She really does seem to be looking at *you*. I stood there for fifteen minutes and couldn't leave.",
          context: "Museum visitor"
        },
        {
          quote: "The mystery isn't who she is-it's what she's thinking. And we'll never know.",
          context: "Art student"
        }
      ]
    },

    places: [
      {
        id: "pl1",
        name_display: "Mauritshuis",
        city: "The Hague",
        country: "Netherlands",
        latitude: 52.08039,
        longitude: 4.31431,
        connection: "Permanent home since 1902",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl2",
        name_display: "Delft",
        city: "Delft",
        country: "Netherlands",
        latitude: 52.0067,
        longitude: 4.3556,
        connection: "City where Vermeer lived his entire life",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // THE LION HUNT (1855)
  // ============================================
  {
    id: "aw2",
    work_type: "painting",
    title_display: "The Lion Hunt",
    title_original: "La Chasse aux lions",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q2633896",
      artic: "16487"
    },
    work_form: "Oil on canvas / Romantic History Painting",
    date_created_year: 1855,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "86 x 115 cm",
    primary_image_url: "https://www.artic.edu/iiif/2/3f0cd83f-84db-23e9-fb41-286de4bdae62/full/1686,/0/default.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "man vs nature" },
      { tag_type: "theme", tag_label: "Orientalism" },
      { tag_type: "theme", tag_label: "violence as sublime" },
      { tag_type: "theme", tag_label: "Romantic heroism" },
      { tag_type: "emotion", tag_label: "visceral intensity" },
      { tag_type: "emotion", tag_label: "awe" },
      { tag_type: "emotion", tag_label: "terror-beauty" },
      { tag_type: "emotion", tag_label: "kinetic chaos" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Morocco" },
      { tag_type: "geo", tag_label: "North Africa" },
      { tag_type: "geo", tag_label: "Paris" }
    ],

    glance: "A violent, swirling confrontation between Arab hunters and lions explodes across the canvas in a chromatic storm of Romantic passion, Oriental fantasy, and primal energy.",
    story: {
      cultural_context: "Painted during French colonial expansion in North Africa. Delacroix had visited Morocco in 1832, an experience that transformed his art. By 1855, he was France's leading Romantic painter, and the Exposition Universelle offered a stage for national triumph.",
      surface_layer: "A violent melee of Arab horsemen and lions explodes across a diagonal composition. At center, a rearing white horse throws its rider backward as a lion attacks from below. To the left, another lion has brought down a horse and rider in a tangle of limbs. On the right, a mounted hunter drives a spear downward. Turbans, flowing robes, and animal manes blur together in a whirlwind of crimson, gold, ochre, and emerald against a stormy sky.",
      type_aesthetic: "Romantic History Painting with Rubensian composition-diagonal thrust, interlocking bodies. Venetian color (Titian, Veronese). Loose brushwork anticipating Impressionism.",
      core_philosophy: "The Romantic sublime-that moment where beauty and terror merge, where human courage confronts nature's raw power, and violence becomes aesthetic contemplation.",
      receipt: "Delacroix's Journal: 'Movement and life above all else... Rubens's hunt scenes are one of the finest spectacles painting has produced.'",
      observation_details: [
        { type: "composition", detail: "Follow the diagonal thrust from lower left to upper right-Delacroix borrowed this from Rubens to create maximum dynamism and instability." },
        { type: "color", detail: "Notice how red appears in scattered spots across the canvas-blood, fabric, horse trappings-creating visual rhythm that your eye follows through the chaos." },
        { type: "brushwork", detail: "Step close to see how loosely the paint is applied. Individual strokes remain visible, especially in the manes and robes-anticipating Impressionism by decades." },
        { type: "anatomy", detail: "Despite the frenzy, every muscle is anatomically precise. Delacroix studied both human and animal anatomy obsessively for these hunting scenes." }
      ]
    },
    deep_dive: {
      overview: "This is a preparatory sketch for a monumental version (5.73m x 3.59m) destroyed by fire in 1870. The Musee d'Orsay version thus preserves Delacroix's most complete surviving vision.",
      production: "Based on hundreds of sketches from Delacroix's 1832 Morocco/Algeria diplomatic mission. He never witnessed an actual lion hunt-this is constructed imagination fed by authentic observation.",
      themes: "The painting stages civilization vs. nature without resolution. The hunters aren't clearly triumphant; the lions aren't merely victims. The composition denies stable hierarchy."
    },

    person_roles: [
      {
        person: {
          id: "ap2",
          name_display: "Eugene Delacroix",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1798-1863. Leader of French Romantic movement. His 1832 Morocco trip provided a lifetime of visual material.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Rubens's Lion Hunt" }, confidence: "verified", source_type: "secondary", note: "Direct compositional model" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Venetian Colorists" }, confidence: "verified", source_type: "secondary", note: "Titian, Veronese-saturated palette" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "1832 Morocco Journey" }, confidence: "verified", source_type: "primary", note: "Direct observation of North Africa" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Impressionist color theory" }, confidence: "verified", source_type: "secondary", note: "Complementary colors in shadows" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Van Gogh" }, confidence: "verified", source_type: "secondary", note: "Called Delacroix's palette 'the finest in France'" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Fauvism" }, confidence: "corroborated", source_type: "secondary", note: "Matisse's expressive color owes much to Delacroix" }
    ],

    voices: {
      expert: [
        {
          source: "Charles Baudelaire",
          quote: "Delacroix is the most suggestive of all painters, the one whose works make you think most.",
          translation: "His paintings don't just show-they provoke thought and feeling."
        }
      ],
      community: [
        {
          quote: "You can feel the chaos. It's not about the hunt-it's about being alive in that terrifying moment.",
          context: "Museum visitor"
        }
      ]
    },

    places: [
      {
        id: "pl3",
        name_display: "Musee d'Orsay",
        city: "Paris",
        country: "France",
        latitude: 48.859962,
        longitude: 2.326561,
        connection: "Current permanent home",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl4",
        name_display: "Tangier Medina",
        city: "Tangier",
        country: "Morocco",
        latitude: 35.78530,
        longitude: -5.81340,
        connection: "Delacroix visited in 1832-inspired the painting's atmosphere",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // THE WEDDING FEAST AT CANA (1563)
  // ============================================
  {
    id: "aw3",
    work_type: "painting",
    title_display: "The Wedding Feast at Cana",
    title_original: "Le Nozze di Cana",
    title_original_lang: "Italian",
    external_ids: {
      wikidata: "Q1478395",
      louvre: "INV_142"
    },
    work_form: "Oil on canvas / Religious History Painting",
    date_created_year: 1563,
    country_of_origin: "Venice (Italian States)",
    medium: "Oil on canvas",
    dimensions: "677 x 994 cm",
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paolo_Veronese_008.jpg/1280px-Paolo_Veronese_008.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "biblical narrative" },
      { tag_type: "theme", tag_label: "Renaissance splendor" },
      { tag_type: "theme", tag_label: "Venetian magnificence" },
      { tag_type: "theme", tag_label: "sacred and secular" },
      { tag_type: "emotion", tag_label: "overwhelming grandeur" },
      { tag_type: "emotion", tag_label: "festive opulence" },
      { tag_type: "emotion", tag_label: "subtle reverence" },
      { tag_type: "geo", tag_label: "Venice" },
      { tag_type: "geo", tag_label: "Paris" },
      { tag_type: "geo", tag_label: "Biblical Galilee" }
    ],

    glance: "A massive Renaissance feast depicting Christ's first miracle-over 130 figures in Venetian costume celebrating around a table where water has become wine-hangs opposite the Mona Lisa but dwarfs it in scale.",
    story: {
      cultural_context: "Commissioned for the Benedictine refectory of San Giorgio Maggiore, Venice. The monks ate beneath this enormous canvas daily. Napoleon seized it in 1797; it has hung in the Louvre since.",
      surface_layer: "An enormous banquet scene stretches nearly ten meters wide, framed by classical Palladian columns and a balustrade against a luminous blue sky. Over 130 figures crowd around a U-shaped table laden with food and drink. At the precise center sits Christ in red and blue robes, flanked by Mary and the disciples. In the foreground, musicians play instruments while servants pour wine from large amphorae. Dogs wander beneath the table, guests lean and gesture, and servants bustle on a balcony above.",
      type_aesthetic: "Venetian Renaissance at its most theatrical. Rich color, elaborate architecture, contemporary costumes on biblical figures. Veronese and Palladio collaborated on integrating painting with architecture.",
      core_philosophy: "The sacred inhabits the everyday. Christ performs his first miracle not in a temple but at a party. Veronese makes the divine accessible through Venetian luxury.",
      receipt: "The largest painting in the Louvre-yet often overlooked because visitors rush to the smaller Mona Lisa directly opposite.",
      observation_details: [
        { type: "composition", detail: "Christ sits at the exact center, where the architectural perspective lines converge. Despite the crowd, your eye finds him-Veronese hides the sacred in plain sight." },
        { type: "portraits", detail: "The musicians in the foreground are portraits of famous Venetian painters: Titian on the viola da gamba, Tintoretto, Bassano, and Veronese himself in white, playing the viol." },
        { type: "color", detail: "Notice the brilliant Venetian palette-ultramarine blues, vermilion reds, cloth-of-gold yellows. The color alone cost a fortune in 16th-century pigments." },
        { type: "scale", detail: "Stand back to take in the 70 square meters of canvas. This painting was designed to fill an entire wall-the monks ate their meals beneath this spectacle daily." }
      ]
    },
    deep_dive: {
      overview: "Completed in 15 months for a Palladian refectory. At 70 square meters, it's the largest canvas in the Louvre and one of the largest Old Master paintings in existence.",
      production: "Veronese included contemporary musicians as the wedding band-Titian, Tintoretto, Bassano, and himself playing instruments. Christ sits serenely at center while chaos swirls.",
      themes: "The painting sparked Inquisition attention for its 'irreverent' treatment of sacred subjects. Veronese's later 'Feast in the House of Levi' was formally interrogated by the Inquisition."
    },

    person_roles: [
      {
        person: {
          id: "ap3",
          name_display: "Paolo Veronese",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "Paolo Caliari (1528-1588), called Veronese after his birthplace. Master of Venetian decorative painting.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Titian's color" }, confidence: "verified", source_type: "secondary", note: "Venetian colorism" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Palladian architecture" }, confidence: "verified", source_type: "primary", note: "Designed for a Palladio refectory" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Baroque feast paintings" }, confidence: "verified", source_type: "secondary", note: "Theatrical religious scenes" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Questions of cultural patrimony" }, confidence: "verified", source_type: "secondary", note: "Italy still debates repatriation" }
    ],

    voices: {
      expert: [
        {
          source: "Art historians",
          quote: "The painting Christ is almost lost in-yet visually centers-the chaos of celebration.",
          translation: "Veronese hides the miracle in plain sight."
        }
      ],
      community: [
        {
          quote: "Everyone crowds around the Mona Lisa, but turn around and there's THIS. It took my breath away.",
          context: "Louvre visitor"
        }
      ]
    },

    places: [
      {
        id: "pl5",
        name_display: "Musee du Louvre",
        city: "Paris",
        country: "France",
        latitude: 48.8606,
        longitude: 2.3376,
        connection: "Current home since 1797-hangs opposite Mona Lisa",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl6",
        name_display: "San Giorgio Maggiore",
        city: "Venice",
        country: "Italy",
        latitude: 45.4294,
        longitude: 12.3433,
        connection: "Original location 1563-1797-reproduction now hangs here",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // THE CORONATION OF NAPOLEON (1807)
  // ============================================
  {
    id: "aw4",
    work_type: "painting",
    title_display: "The Coronation of Napoleon",
    title_original: "Le Sacre de Napoleon",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q1231009",
      louvre: "INV_3699"
    },
    work_form: "Oil on canvas / Neoclassical History Painting",
    date_created_year: 1807,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "621 x 979 cm",
    primary_image_url: "https://www.wga.hu/art/d/david_j/4/405david.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "political propaganda" },
      { tag_type: "theme", tag_label: "imperial power" },
      { tag_type: "theme", tag_label: "Neoclassicism" },
      { tag_type: "theme", tag_label: "historical documentation" },
      { tag_type: "emotion", tag_label: "awe" },
      { tag_type: "emotion", tag_label: "grandeur" },
      { tag_type: "emotion", tag_label: "ceremony" },
      { tag_type: "emotion", tag_label: "calculated majesty" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Paris" },
      { tag_type: "geo", tag_label: "Notre-Dame" }
    ],

    glance: "Napoleon crowns Josephine empress in Notre-Dame cathedral-a massive propaganda painting capturing the moment he took power from the Pope's hands and placed it on his own head.",
    story: {
      cultural_context: "Napoleon commissioned this to legitimize his rule. The actual ceremony (December 2, 1804) saw Napoleon crown himself, taking the crown from Pope Pius VII. David chose to depict him crowning Josephine-more visually dramatic and less provocative.",
      surface_layer: "Inside the vast Gothic interior of Notre-Dame, Napoleon stands in imperial robes of crimson velvet and ermine, holding a golden crown aloft. Kneeling before him in white satin and diamonds, Josephine bows her head to receive it. Behind Napoleon, Pope Pius VII sits passively, hand raised in blessing. The scene is crowded with over 150 figures in ceremonial dress: marshals in gold-embroidered uniforms, ladies-in-waiting in white, clergy in vestments, and family members in the galleries above. Candelabras illuminate the scene against deep shadows.",
      type_aesthetic: "Neoclassical History Painting at monumental scale. Every face is a portrait (David sketched 150 attendees). Deliberate departures from fact: Napoleon's mother appears though she boycotted the event.",
      core_philosophy: "Art as state propaganda. David served the Revolution, then Napoleon, using his brush as a political weapon. The painting creates the event it claims to document.",
      receipt: "One of the largest paintings in the Louvre at 621 x 979 cm-nearly 10 meters wide.",
      observation_details: [
        { type: "propaganda", detail: "Find Napoleon's mother Letizia in the upper gallery, seated in honor. She actually boycotted the ceremony-David painted her in at Napoleon's request to rewrite history." },
        { type: "portraits", detail: "Every face is an individual portrait. David conducted 150 separate sittings. Look for Napoleon's sisters and marshals-each rendered with documentary precision." },
        { type: "gesture", detail: "Note the Pope's passive posture-hand raised but not crowning. Napoleon has already crowned himself; the Pope merely witnesses. A profound statement of secular power over religious authority." },
        { type: "lighting", detail: "The golden light falls on Napoleon and Josephine while the Pope recedes into shadow. David uses light as political commentary-the future belongs to the Emperor, not the Church." }
      ]
    },
    deep_dive: {
      overview: "David was Napoleon's official painter. This took three years to complete (1805-1807). A near-identical replica hangs at Versailles.",
      production: "David arranged 150 sittings for individual portraits. Napoleon visited the studio and reportedly said: 'David, I salute you.' The Pope's passive presence was diplomatically controversial.",
      themes: "Napoleon bypassed church authority by crowning himself. The painting diplomatically shows him crowning Josephine, but everyone knew what really happened."
    },

    person_roles: [
      {
        person: {
          id: "ap4",
          name_display: "Jacques-Louis David",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1748-1825. Leader of French Neoclassicism. Served Revolution, then Napoleon. Exiled to Brussels after Waterloo.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Rubens's Marie de' Medici cycle" }, confidence: "verified", source_type: "secondary", note: "Royal propaganda painting" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Classical Roman triumphs" }, confidence: "verified", source_type: "secondary", note: "Imperial iconography" },
      { relation_type: "influenced", to_work: { id: null, title_display: "19th century history painting" }, confidence: "verified", source_type: "secondary", note: "Monumental state art" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Political propaganda art" }, confidence: "verified", source_type: "secondary", note: "Art as state message" }
    ],

    voices: {
      expert: [
        {
          source: "Napoleon Bonaparte",
          quote: "David, I salute you.",
          translation: "Even the emperor bowed to his image-maker."
        }
      ],
      community: [
        {
          quote: "It's not a painting of what happened-it's a painting of what Napoleon wanted you to believe happened.",
          context: "Art history student"
        }
      ]
    },

    places: [
      {
        id: "pl7",
        name_display: "Musee du Louvre",
        city: "Paris",
        country: "France",
        latitude: 48.860294,
        longitude: 2.338629,
        connection: "Primary viewing location-Denon Wing, Room 702",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl8",
        name_display: "Notre-Dame Cathedral",
        city: "Paris",
        country: "France",
        latitude: 48.852966,
        longitude: 2.349902,
        connection: "Actual site of Napoleon's coronation (December 2, 1804)",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // THE RAY (LA RAIE) (1728)
  // ============================================
  {
    id: "aw5",
    work_type: "painting",
    title_display: "The Ray",
    title_original: "La Raie",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q3210285",
      louvre: "INV_3197"
    },
    work_form: "Oil on canvas / Still Life",
    date_created_year: 1728,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "114 x 146 cm",
    primary_image_url: "https://www.wga.hu/art/c/chardin/1/01ray.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "still life" },
      { tag_type: "theme", tag_label: "mortality" },
      { tag_type: "theme", tag_label: "domestic life" },
      { tag_type: "theme", tag_label: "the ordinary as profound" },
      { tag_type: "emotion", tag_label: "visceral" },
      { tag_type: "emotion", tag_label: "contemplative" },
      { tag_type: "emotion", tag_label: "quietly unsettling" },
      { tag_type: "emotion", tag_label: "strangely alive" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Paris" },
      { tag_type: "geo", tag_label: "18th century French cuisine" }
    ],

    glance: "A gutted ray hangs from a hook, its face eerily human in expression, surrounded by kitchen implements and a curious cat-transforming a mundane fish into philosophical meditation.",
    story: {
      cultural_context: "Chardin lived his entire life in the Saint-Germain-des-Pres neighborhood of Paris. He never traveled, drawing inspiration from the markets and kitchens around him. This painting gained him admission to the Academie Royale in 1728.",
      surface_layer: "A large gutted skate hangs from a hook against a shadowy kitchen wall, its pale underside split open to reveal glistening pink viscera. The fish's underside forms an uncanny face-like shape with two dark spots resembling eyes and a slit suggesting a grimacing mouth. To the left, a striped cat with arched back hisses at the dangling fish, its fur bristling. Scattered on the stone ledge below are oysters with pearlescent shells, a brass pot with a long handle, kitchen knives, and white linen. The composition is arranged against a muted brown-grey background with soft, diffused light from the left.",
      type_aesthetic: "French still life influenced by Dutch and Spanish bodegon traditions. Quiet, contemplative compositions of everyday objects rendered with unprecedented attention to texture and light.",
      core_philosophy: "The mundane contains the profound. A gutted fish becomes a meditation on mortality, consumption, and the strange beauty of ordinary life.",
      receipt: "Diderot praised Chardin: 'This magic defies understanding.' The painting's almost-human expression on the ray has disturbed and fascinated viewers for three centuries.",
      observation_details: [
        { type: "uncanny_face", detail: "The ray's underside creates a disturbing face-like visage with 'eyes' (gill slits) and a 'mouth' (body opening) - step back 2 meters to see the effect clearly" },
        { type: "texture_mastery", detail: "Compare the slick wet sheen of the fish's skin to the soft fur of the cat and the metallic glint of the copper pot - each surface rendered with different brushwork" },
        { type: "cat_tension", detail: "The cat's arched back and focused stare create the only living tension in the scene - note how its alertness contrasts with the stillness of death" },
        { type: "light_source", detail: "Soft light from upper left catches the ray's belly and the oyster shells while leaving the background in shadow - typical Chardin illumination that focuses attention" }
      ]
    },
    deep_dive: {
      overview: "Chardin's reception piece for the Academie Royale de Peinture et de Sculpture. The ray's face appears to grimace, creating an uncanny effect that anticipates Surrealism.",
      production: "Chardin worked slowly, building up layers of paint to achieve remarkable textures-the slick wetness of the ray, the fur of the cat, the glint of metal utensils.",
      themes: "Still life as vanitas-the arranged objects remind us of mortality, consumption, and the transience of life. The cat adds living presence, completing the cycle from death (fish) to life (cat who will eat it)."
    },

    person_roles: [
      {
        person: {
          id: "ap5",
          name_display: "Jean-Baptiste-Simeon Chardin",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1699-1779. Master of French still life. Spent entire life in Paris. Known for quiet, contemplative compositions of everyday objects.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Dutch vanitas painting" }, confidence: "verified", source_type: "secondary", note: "Mortality themes, careful rendering" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Spanish bodegon" }, confidence: "verified", source_type: "secondary", note: "Kitchen scenes, humble subjects" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Cezanne's still lifes" }, confidence: "verified", source_type: "secondary", note: "Serious treatment of humble subjects" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Modern still life photography" }, confidence: "corroborated", source_type: "secondary", note: "Dramatic lighting, careful composition" }
    ],

    voices: {
      expert: [
        {
          source: "Denis Diderot",
          quote: "O Chardin! It is not white, red, or black you mix on your palette: it is the very substance of objects.",
          translation: "He doesn't paint things-he makes them exist."
        }
      ],
      community: [
        {
          quote: "That fish is looking at me. I can't decide if it's horrifying or beautiful.",
          context: "Museum visitor"
        }
      ]
    },

    places: [
      {
        id: "pl9",
        name_display: "Musee du Louvre",
        city: "Paris",
        country: "France",
        latitude: 48.860294,
        longitude: 2.338629,
        connection: "Permanent home-Richelieu Wing, Room 921",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl10",
        name_display: "Saint-Germain-des-Pres",
        city: "Paris",
        country: "France",
        latitude: 48.853867,
        longitude: 2.334723,
        connection: "Neighborhood where Chardin lived and worked his entire life",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // WOMAN WITH A PARASOL (1875)
  // ============================================
  {
    id: "aw6",
    work_type: "painting",
    title_display: "Woman with a Parasol - Madame Monet and Her Son",
    title_original: "La Promenade",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q432253",
      nga: "61379"
    },
    work_form: "Oil on canvas / Impressionist Figure",
    date_created_year: 1875,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "100 x 81 cm",
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg/800px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "fleeting moment" },
      { tag_type: "theme", tag_label: "domestic intimacy" },
      { tag_type: "theme", tag_label: "plein air" },
      { tag_type: "theme", tag_label: "light and atmosphere" },
      { tag_type: "emotion", tag_label: "breezy" },
      { tag_type: "emotion", tag_label: "nostalgic" },
      { tag_type: "emotion", tag_label: "tender" },
      { tag_type: "emotion", tag_label: "luminous joy" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Argenteuil" },
      { tag_type: "geo", tag_label: "Normandy" },
      { tag_type: "geo", tag_label: "Washington D.C." }
    ],

    glance: "Camille Monet turns on a hillside, parasol catching the wind, their son Jean beside her-a fleeting moment of summer light and domestic happiness captured with revolutionary brushwork.",
    story: {
      cultural_context: "Painted during Monet's happiest years at Argenteuil (1871-1878), before financial troubles and Camille's illness. The suburban town on the Seine was where the Impressionists gathered and painted together. By 1875, Monet had fully embraced the plein air method Eugene Boudin taught him as a teenager, and was moving beyond the sketch-like approach of 'Impression, Sunrise' (1872) toward fuller, more ambitious outdoor figure painting.",
      surface_layer: "A woman in a white dress stands atop a grassy hillside, her body turned three-quarters toward us while her face gazes down. She holds a pale green parasol tilted against the wind, its fabric billowing. Her white dress and blue-ribboned veil stream dramatically to the right, caught by an invisible breeze. The sky behind her is filled with rapidly brushed white clouds against brilliant blue. In the lower right, a small boy in a dark jacket and straw hat stands partially hidden by tall grass, looking toward the viewer. The entire scene is painted from a low vantage point, looking upward, with loose brushstrokes of green, yellow, and ochre rendering the windswept meadow.",
      type_aesthetic: "Impressionist plein air painting. Bold, visible brushstrokes capture movement of grass, clouds, fabric. The figure is sketched, not detailed-sensation over precision.",
      core_philosophy: "Capture the moment, not the permanent. Monet painted what he saw in an instant-the wind, the light, the turn of a head. This is painting as lived experience.",
      receipt: "One of the most beloved Impressionist paintings. The low vantage point places us in the grass looking up, participating in the summer day.",
      observation_details: [
        { type: "wind_direction", detail: "Every element moves right - the dress, veil, parasol, and grass all bend in unison, creating a unified sense of motion frozen in time" },
        { type: "vantage_point", detail: "Monet painted from below, lying or sitting in the grass - the low angle silhouettes Camille against the sky and draws us into the scene as participants" },
        { type: "brushwork_sky", detail: "The clouds are built from thick, rapid horizontal strokes of white and pale blue - step close to see how abstract they become, then step back to see them coalesce" },
        { type: "shadow_on_face", detail: "The parasol casts a cool blue-green shadow across Camille's face, demonstrating Impressionist color theory - shadows contain color, not just darkness" }
      ]
    },
    deep_dive: {
      overview: "Monet's first wife Camille died in 1879 at age 32. This painting captures her during their brief years of happiness. Monet painted two later versions with different models after her death-attempts to recapture what was lost.",
      production: "Painted outdoors in one or two sessions. The spontaneity is the point-Monet didn't want polish, he wanted the feeling of being there.",
      themes: "The painting embodies Impressionism's core claim: that the fleeting moment has more truth than the composed scene. Memory and light intertwine."
    },

    person_roles: [
      {
        person: {
          id: "ap6",
          name_display: "Claude Monet",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1840-1926. Leader of Impressionism. This painting captures his first wife Camille and son Jean during happy years at Argenteuil.",
        source_type: "primary"
      },
      {
        person: {
          id: "ap7",
          name_display: "Camille Doncieux",
          name_native: null,
          image_url: null
        },
        role_type: "subject",
        role_display: "Subject / Wife",
        bio: "1847-1879. Monet's first wife and frequent model. Died of tuberculosis at 32. Monet painted her on her deathbed.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: "aw7", title_display: "On the Beach at Trouville" }, confidence: "verified", source_type: "secondary", note: "Boudin taught Monet plein air painting as a teenager" },
      { relation_type: "inspired_by", to_work: { id: "aw9", title_display: "Impression, Sunrise" }, confidence: "verified", source_type: "secondary", note: "Three years earlier-same artist, growing ambition" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Japanese woodblock prints" }, confidence: "verified", source_type: "secondary", note: "Asymmetry, cropping, flat compositional areas" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "J.M.W. Turner" }, confidence: "verified", source_type: "secondary", note: "Atmospheric effects, light dissolving form" },
      { relation_type: "influenced", to_work: { id: "aw8", title_display: "Water Lilies (Grandes Decorations)" }, confidence: "verified", source_type: "secondary", note: "Monet's late work-same commitment to capturing light, pushed toward abstraction" },
      { relation_type: "influenced", to_work: { id: "aw10", title_display: "The Harvest" }, confidence: "verified", source_type: "secondary", note: "Blanche Hoschede Monet learned this plein air approach directly from her stepfather" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Pointillism (Seurat, Signac)" }, confidence: "verified", source_type: "secondary", note: "Monet's broken brushwork inspired the Neo-Impressionists" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Photography's 'decisive moment'" }, confidence: "corroborated", source_type: "secondary", note: "Capturing fleeting instants-Cartier-Bresson acknowledged Impressionism's influence" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Abstract Expressionism" }, confidence: "corroborated", source_type: "secondary", note: "Gesture and spontaneity in de Kooning, Pollock" }
    ],

    voices: {
      expert: [
        {
          source: "Art historians",
          quote: "This is Impressionism's perfect statement: light, movement, and a moment that will never come again.",
          translation: "Everything the movement stood for is in this one canvas."
        }
      ],
      community: [
        {
          quote: "You can feel the wind. You can feel that it's summer. You want to be there.",
          context: "Gallery visitor"
        }
      ]
    },

    places: [
      {
        id: "pl11",
        name_display: "National Gallery of Art",
        city: "Washington, D.C.",
        country: "USA",
        latitude: 38.8913,
        longitude: -77.0200,
        connection: "Current home-West Building, Gallery 85",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl12",
        name_display: "Fondation Claude Monet",
        city: "Giverny",
        country: "France",
        latitude: 49.0758,
        longitude: 1.5339,
        connection: "Monet's home 1883-1926 with famous water lily gardens",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // ON THE BEACH AT TROUVILLE (1863)
  // ============================================
  {
    id: "aw7",
    work_type: "painting",
    title_display: "On the Beach at Trouville",
    title_original: "Sur la plage de Trouville",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q20188095",
      met: "436449"
    },
    work_form: "Oil on panel / Pre-Impressionist",
    date_created_year: 1863,
    country_of_origin: "France",
    medium: "Oil on wood panel",
    dimensions: "26 x 48 cm",
    primary_image_url: "https://images.metmuseum.org/CRDImages/ep/original/DT1032.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "modern leisure" },
      { tag_type: "theme", tag_label: "bourgeois society" },
      { tag_type: "theme", tag_label: "plein air" },
      { tag_type: "theme", tag_label: "the beach as theater" },
      { tag_type: "emotion", tag_label: "breezy" },
      { tag_type: "emotion", tag_label: "social observation" },
      { tag_type: "emotion", tag_label: "nostalgic charm" },
      { tag_type: "emotion", tag_label: "luminous" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Normandy" },
      { tag_type: "geo", tag_label: "Trouville" },
      { tag_type: "geo", tag_label: "New York" }
    ],

    glance: "Fashionable Parisians populate a Normandy beach, their crinolines and parasols catching the sea breeze-a snapshot of Second Empire leisure that launched the Impressionist obsession with modern life.",
    story: {
      cultural_context: "The railway brought Parisian tourists to Norman beaches. Trouville became the 'Queen Beach' for fashionable society. Boudin, born in nearby Honfleur, became the painter of this new phenomenon-bourgeois leisure. As proto-Impressionist, Boudin pioneered plein air painting of contemporary life years before the movement had a name. In 1858, he convinced a teenage Claude Monet in Le Havre to abandon caricature and paint nature outdoors-arguably the single most consequential mentorship in art history.",
      surface_layer: "Groups of fashionably dressed figures cluster on a sandy beach beneath a vast, cloud-filled sky. Women in voluminous crinolines and bonnets sit in wooden chairs or stand in small social gatherings, their dark dresses and white parasols creating rhythmic patterns against the pale sand. Men in top hats and frock coats accompany them. The beach stretches horizontally across the lower third of the composition, while the sky-rendered in soft grays, creams, and pale blues-dominates the upper two-thirds. In the distance, the sea appears as a thin blue-gray line. The figures are painted with quick, abbreviated strokes, their faces mere suggestions rather than portraits.",
      type_aesthetic: "Pre-Impressionist plein air painting. Loose brushwork, atmospheric light, contemporary subject matter. Boudin taught the young Claude Monet to paint outdoors.",
      core_philosophy: "Paint what you see, where you see it. Boudin rejected studio painting for direct observation of light, weather, and modern life as it happened.",
      receipt: "Monet later said: 'If I became a painter, I owe it to Eugene Boudin.'",
      observation_details: [
        { type: "sky_proportion", detail: "Notice how the sky occupies two-thirds of the canvas - Boudin was called 'King of Skies' for his cloud studies, and the figures below are almost incidental" },
        { type: "social_staging", detail: "The beach functions as an outdoor salon - figures face each other in conversation clusters, not the sea, revealing this as social theater" },
        { type: "costume_precision", detail: "Despite loose brushwork, Boudin precisely captures 1860s fashion - the bell-shaped crinolines, top hats, parasols mark these as Parisian bourgeoisie" },
        { type: "plein_air_evidence", detail: "The painting's small size (26 x 48 cm) and wooden panel support show this was painted on location - Boudin carried portable equipment to the beach" }
      ]
    },
    deep_dive: {
      overview: "Boudin painted hundreds of beach scenes over his career. This painting type-fashionable figures on beaches-was his signature contribution to art history.",
      production: "Painted quickly on location, capturing specific weather and light conditions. Boudin kept detailed records of painting times and weather in his notebooks.",
      themes: "The beach as social theater-these aren't bathers but promenaders, seeing and being seen. Class, fashion, and leisure intersect in the bright Norman light."
    },

    person_roles: [
      {
        person: {
          id: "ap8",
          name_display: "Eugene Boudin",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1824-1898. Born in Honfleur. 'King of the Skies' for his cloud studies. Convinced teenage Monet to paint outdoors.",
        source_type: "primary"
      },
      {
        person: {
          id: "ap6",
          name_display: "Claude Monet",
          name_native: null,
          image_url: null
        },
        role_type: "student",
        role_display: "Student / Protege",
        bio: "Met Boudin in Le Havre as a teenager. Boudin convinced him to paint outdoors-launching Impressionism.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Dutch marine painting (van de Velde, van Goyen)" }, confidence: "verified", source_type: "secondary", note: "Seascapes, cloud studies, atmospheric effects" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "English watercolorists (Bonington, Constable)" }, confidence: "verified", source_type: "secondary", note: "Quick outdoor studies, natural light observation" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Corot and Barbizon School" }, confidence: "verified", source_type: "secondary", note: "Plein air landscape painting movement" },
      { relation_type: "influenced", to_work: { id: "aw9", title_display: "Impression, Sunrise" }, confidence: "verified", source_type: "secondary", note: "Boudin taught Monet to paint outdoors in 1858-without that moment, no Impressionism" },
      { relation_type: "influenced", to_work: { id: "aw6", title_display: "Woman with a Parasol" }, confidence: "verified", source_type: "secondary", note: "Monet's plein air figure paintings owe everything to Boudin's mentorship" },
      { relation_type: "influenced", to_work: { id: "aw8", title_display: "Water Lilies (Grandes Decorations)" }, confidence: "verified", source_type: "secondary", note: "Monet's lifelong outdoor observation practice began with Boudin" },
      { relation_type: "influenced", to_work: { id: "aw10", title_display: "The Harvest" }, confidence: "corroborated", source_type: "secondary", note: "Blanche Hoschede Monet learned from Monet, who learned from Boudin-direct lineage" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Entire Impressionist movement" }, confidence: "verified", source_type: "secondary", note: "Contemporary subjects, plein air method, atmospheric light" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Modern beach/leisure painting" }, confidence: "verified", source_type: "secondary", note: "Invented the genre of bourgeois seaside tourism as art subject" }
    ],

    voices: {
      expert: [
        {
          source: "Claude Monet",
          quote: "If I became a painter, I owe it to Eugene Boudin.",
          translation: "Boudin didn't just influence Monet-he created him."
        }
      ],
      community: [
        {
          quote: "It looks like a photograph from the 1860s come to life. You can almost hear the conversations.",
          context: "Museum visitor"
        }
      ]
    },

    places: [
      {
        id: "pl13",
        name_display: "Metropolitan Museum of Art",
        city: "New York",
        country: "USA",
        latitude: 40.7794,
        longitude: -73.9634,
        connection: "Home of the 1863 canonical version",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl14",
        name_display: "Plage de Trouville",
        city: "Trouville-sur-Mer",
        country: "France",
        latitude: 49.3709,
        longitude: 0.0810,
        connection: "The exact beach depicted in the painting",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // WATER LILIES (GRANDES DECORATIONS) (1920-1926)
  // ============================================
  {
    id: "aw8",
    work_type: "painting",
    title_display: "Water Lilies (Grandes Decorations)",
    title_original: "Les Nympheas",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q155896",
      orangerie: "grandes-decorations"
    },
    work_form: "Oil on canvas / Installation",
    date_created_year: 1926,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "Various panels, 2m x 12-17m each",
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "nature as meditation" },
      { tag_type: "theme", tag_label: "perception" },
      { tag_type: "theme", tag_label: "the infinite" },
      { tag_type: "theme", tag_label: "abstraction" },
      { tag_type: "emotion", tag_label: "transcendent" },
      { tag_type: "emotion", tag_label: "contemplative" },
      { tag_type: "emotion", tag_label: "peaceful" },
      { tag_type: "emotion", tag_label: "enveloping" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Giverny" },
      { tag_type: "geo", tag_label: "Paris" },
      { tag_type: "geo", tag_label: "Normandy" }
    ],

    glance: "Eight monumental canvases wrap two oval rooms in an endless pond surface-no horizon, no sky, just water, lilies, and light dissolving into pure sensation. Art as environment, not object.",
    story: {
      cultural_context: "Monet donated these panels to France as a 'monument to peace' after WWI. His friend Georges Clemenceau, wartime Prime Minister, negotiated the gift. The Orangerie was modified to Monet's specifications. These represent Monet's final statement-a half-century after 'Impression, Sunrise' named the movement, he pushed Impressionism to the threshold of abstraction. What began as capturing a fleeting moment on Le Havre harbor evolved into creating an infinite, timeless environment where object and atmosphere merge completely.",
      type_aesthetic: "Late Impressionism pushed toward abstraction. No horizon line, no fixed viewpoint. The water surface becomes infinite space. Color applied in visible strokes that dissolve up close.",
      surface_layer: "Eight monumental canvases line two oval rooms, depicting a continuous pond surface with floating water lily pads in clusters of green, pink, and white. Weeping willow branches drape from above in some panels. The water reflects sky, clouds, and surrounding foliage in shifting blues, greens, violets, and golds. There is no horizon line, no sky, no bank-only the water's surface extending to the canvas edges in every direction.",
      core_philosophy: "To stand inside these rooms is to exist inside a painting. Monet wanted to give 'the illusion of an endless whole, of water without horizon or bank.' Vision becomes meditation.",
      receipt: "Monet to Clemenceau: 'I want to produce the illusion of an endless whole... of a wave with no horizon and no shore.'",
      observation_details: [
        { type: "immersion", detail: "Stand at the center of either oval room. The curved walls eliminate corners and frames, creating the sensation of being surrounded by water rather than viewing a painting." },
        { type: "light", detail: "Natural light enters from skylights above, changing throughout the day. Morning light reveals cooler blues and violets; afternoon brings warmer golden tones-just as Monet intended." },
        { type: "brushwork", detail: "Step close to see the paint texture: thick impasto strokes of pure color laid side by side. Step back and they merge into shimmering water. This oscillation between abstraction and representation is the experience." },
        { type: "scale", detail: "Each panel is approximately 2 meters high and 6-17 meters wide. The human-scale height places you at the pond's edge; the horizontal expanse stretches beyond peripheral vision." }
      ]
    },
    deep_dive: {
      overview: "Monet worked on these panels for over a decade, despite failing eyesight from cataracts. He destroyed many versions, obsessively reworking until his death in 1926.",
      production: "The panels were installed after Monet's death according to his specifications. He designed the oval rooms to create an enveloping experience. The natural light from above changes throughout the day.",
      themes: "The progression from object (lily pad) to pure perception (color, light) prefigures Abstract Expressionism. Mark Rothko explicitly drew on Monet for his own contemplative installations."
    },

    person_roles: [
      {
        person: {
          id: "ap6",
          name_display: "Claude Monet",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1840-1926. Created these in his final years at Giverny, painting despite cataracts. The water lily pond was his obsession for three decades.",
        source_type: "primary"
      },
      {
        person: {
          id: "ap9",
          name_display: "Georges Clemenceau",
          name_native: null,
          image_url: null
        },
        role_type: "patron",
        role_display: "Friend / Patron",
        bio: "1841-1929. French Prime Minister during WWI. Lifelong friend of Monet. Negotiated the donation of the Nympheas to France.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: "aw7", title_display: "On the Beach at Trouville" }, confidence: "verified", source_type: "secondary", note: "Boudin's plein air method-63 years of practice from student to master" },
      { relation_type: "inspired_by", to_work: { id: "aw9", title_display: "Impression, Sunrise" }, confidence: "verified", source_type: "secondary", note: "Same artist, 54 years later-from naming a movement to transcending it" },
      { relation_type: "inspired_by", to_work: { id: "aw6", title_display: "Woman with a Parasol" }, confidence: "verified", source_type: "secondary", note: "From capturing a moment to creating timeless immersion-Monet's arc" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Japanese gardens and prints (Hiroshige, Hokusai)" }, confidence: "verified", source_type: "secondary", note: "The pond itself was Japanese-inspired; flat space, no horizon" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Turner's late paintings" }, confidence: "verified", source_type: "secondary", note: "Form dissolving into pure light and color-The Fighting Temeraire, Rain, Steam and Speed" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Eastern philosophy (Zen Buddhism)" }, confidence: "corroborated", source_type: "secondary", note: "Meditation through observation; the infinite in the particular" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Abstract Expressionism" }, confidence: "verified", source_type: "secondary", note: "Rothko's Chapel, de Kooning's abstractions, Pollock's all-over composition-all cite Monet's Nympheas" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Color Field Painting" }, confidence: "verified", source_type: "secondary", note: "Ellsworth Kelly, Helen Frankenthaler acknowledged studying these panels" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Installation art" }, confidence: "verified", source_type: "secondary", note: "Art as immersive environment, not object-Turrell, Eliasson owe a debt" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Minimalism" }, confidence: "corroborated", source_type: "secondary", note: "The 'less is more' reduction to essential sensation" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Contemporary contemplative art" }, confidence: "corroborated", source_type: "secondary", note: "Meditation spaces in museums worldwide reference Monet's oval rooms" }
    ],

    voices: {
      expert: [
        {
          source: "Andre Masson",
          quote: "This is the Sistine Chapel of Impressionism.",
          translation: "A culminating masterwork that defines its era."
        }
      ],
      community: [
        {
          quote: "I sat there for two hours and cried. Not sad crying-just overwhelmed crying. It's not a painting, it's a place.",
          context: "Museum visitor"
        }
      ]
    },

    places: [
      {
        id: "pl15",
        name_display: "Musee de l'Orangerie",
        city: "Paris",
        country: "France",
        latitude: 48.863611,
        longitude: 2.322778,
        connection: "Permanent home since 1927-two oval rooms designed by Monet",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl16",
        name_display: "Giverny Water Garden",
        city: "Giverny",
        country: "France",
        latitude: 49.075556,
        longitude: 1.533889,
        connection: "The exact pond Monet painted for 30 years",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // IMPRESSION, SUNRISE (1872)
  // ============================================
  {
    id: "aw9",
    work_type: "painting",
    title_display: "Impression, Sunrise",
    title_original: "Impression, soleil levant",
    title_original_lang: "French",
    external_ids: {
      wikidata: "Q188716",
      marmottan: "4014"
    },
    work_form: "Oil on canvas / Proto-Impressionist",
    date_created_year: 1872,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "48 x 63 cm",
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",

    tag_relations: [
      { tag_type: "theme", tag_label: "fleeting light" },
      { tag_type: "theme", tag_label: "birth of a movement" },
      { tag_type: "theme", tag_label: "perception over precision" },
      { tag_type: "theme", tag_label: "modern industry" },
      { tag_type: "emotion", tag_label: "transient" },
      { tag_type: "emotion", tag_label: "quietly revolutionary" },
      { tag_type: "emotion", tag_label: "atmospheric" },
      { tag_type: "emotion", tag_label: "meditative" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Le Havre" },
      { tag_type: "geo", tag_label: "Normandy" },
      { tag_type: "geo", tag_label: "Paris" }
    ],

    glance: "A hazy dawn over Le Havre harbor-industrial masts, small boats, and a blazing orange sun reflected on grey-blue water-painted with radical looseness that launched a revolution and gave Impressionism its name.",
    story: {
      cultural_context: "France was recovering from the Franco-Prussian War. Monet, returned from wartime refuge in London, painted his childhood port wrapped in morning mist. The official Salon rejected such 'unfinished' work. By 1872, Monet had absorbed Boudin's plein air lessons from 14 years earlier and witnessed Turner's atmospheric effects in London during the war. This painting synthesized those influences into something new-a manifesto painted in mist. When exhibited at the first Impressionist exhibition (1874), critic Louis Leroy's mocking review inadvertently named the movement that would transform modern art.",
      type_aesthetic: "Rapid, sketch-like brushwork. The sun is the only pure color; everything else dissolves into atmospheric grey-blue. The painting captures how we actually see-not objects, but light hitting our eyes.",
      surface_layer: "A hazy harbor scene at dawn. The sky and water merge into a uniform grey-blue atmospheric haze. In the center floats a brilliant orange-red sun, its reflection broken into short horizontal dabs on the rippling water below. Dark silhouettes of ship masts and industrial smokestacks punctuate the middle distance, barely distinguishable from one another. In the foreground, two small rowboats with indistinct figures float on the grey water. The entire scene is rendered with visible, rapid brushstrokes-the forms suggested rather than defined.",
      core_philosophy: "What if art captured sensation over documentation? Monet privileged the fleeting impression over academic finish, arguing that a sketch of light can be truer than a polished illusion.",
      receipt: "Critic Louis Leroy, mocking the title in 1874: 'Impression-I was certain of it.' The insult became the movement's name.",
      observation_details: [
        { type: "the_sun", detail: "The orange-red sun is the only pure, saturated color in the entire painting. Its reflection on the water uses the same orange but broken into horizontal dashes-this contrast is the painting's visual anchor." },
        { type: "color_temperature", detail: "Notice how the cool blue-grey atmosphere makes the warm orange sun appear even more intense. This complementary color relationship was revolutionary for 1872." },
        { type: "brushwork", detail: "Step close to see how few strokes define each element. The boats are 3-4 strokes each. The smokestacks are single vertical marks. Monet painted what the eye registers in a glance, not what the mind knows is there." },
        { type: "atmospheric_perspective", detail: "Objects become hazier and less defined as they recede. The foreground boats have slightly more detail than the distant ships-Monet observed how mist actually behaves." }
      ]
    },
    deep_dive: {
      overview: "Astronomical research (2014) determined the exact date and time: November 13, 1872, 7:35 AM. Monet painted from a hotel window overlooking Le Havre harbor.",
      production: "Painted quickly to capture specific atmospheric conditions. When asked to title it, Monet said: 'It really can't pass as a view of Le Havre. Put Impression.'",
      themes: "Industry and nature coexist without commentary-smokestacks and boats are just more shapes in the mist. The painting doesn't critique modernity; it accepts it as a valid subject for beauty."
    },

    person_roles: [
      {
        person: {
          id: "ap6",
          name_display: "Claude Monet",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1840-1926. Painted this in his childhood port of Le Havre. The mocking response to its title gave Impressionism its name.",
        source_type: "primary"
      },
      {
        person: {
          id: "ap10",
          name_display: "Louis Leroy",
          name_native: null,
          image_url: null
        },
        role_type: "critic",
        role_display: "Critic (inadvertent namer)",
        bio: "Art critic who mockingly used the title 'Impression' in his 1874 review, inadvertently naming the most important art movement of the 19th century.",
        source_type: "secondary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: "aw7", title_display: "On the Beach at Trouville" }, confidence: "verified", source_type: "secondary", note: "Boudin taught Monet plein air painting 14 years earlier-this is the student surpassing the teacher" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Turner's atmospheric paintings" }, confidence: "verified", source_type: "secondary", note: "Monet saw Turner's work in London (1870-71)-form dissolving into light and mist" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Japanese prints (Hokusai, Hiroshige)" }, confidence: "verified", source_type: "secondary", note: "Flat composition, minimal detail, atmospheric effects" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Photography" }, confidence: "corroborated", source_type: "secondary", note: "If cameras capture detail, what should painting do? Monet's answer: capture sensation" },
      { relation_type: "influenced", to_work: { id: "aw6", title_display: "Woman with a Parasol" }, confidence: "verified", source_type: "secondary", note: "Three years later-Monet applies same principles to figure painting" },
      { relation_type: "influenced", to_work: { id: "aw8", title_display: "Water Lilies (Grandes Decorations)" }, confidence: "verified", source_type: "secondary", note: "54 years later-same artist pushes atmospheric dissolution to complete abstraction" },
      { relation_type: "influenced", to_work: { id: "aw10", title_display: "The Harvest" }, confidence: "corroborated", source_type: "secondary", note: "Blanche Hoschede learned from the artist who painted this revolutionary work" },
      { relation_type: "influenced", to_work: { id: null, title_display: "The Impressionist movement" }, confidence: "verified", source_type: "secondary", note: "Critic Louis Leroy's 1874 mockery of the title gave the movement its name" },
      { relation_type: "influenced", to_work: { id: null, title_display: "All Impressionist paintings" }, confidence: "verified", source_type: "secondary", note: "Proved 'unfinished' sensation could be art's subject" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Post-Impressionism (Cezanne, van Gogh, Seurat)" }, confidence: "verified", source_type: "secondary", note: "Broke academic rules so others could break them further" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Abstract art" }, confidence: "verified", source_type: "secondary", note: "Subject subordinated to light, atmosphere, sensation" }
    ],

    voices: {
      expert: [
        {
          source: "Louis Leroy (1874)",
          quote: "Impression-I was certain of it. Since I was impressed, there had to be some impression in it.",
          translation: "An insult that became a badge of honor."
        }
      ],
      community: [
        {
          quote: "This small painting changed everything. Every museum of modern art exists because of it.",
          context: "Art historian"
        }
      ]
    },

    places: [
      {
        id: "pl17",
        name_display: "Musee Marmottan Monet",
        city: "Paris",
        country: "France",
        latitude: 48.8587,
        longitude: 2.2672,
        connection: "Permanent home since 1940-world's largest Monet collection",
        place_type: "museum",
        is_visitable: true
      },
      {
        id: "pl18",
        name_display: "Le Havre Harbor",
        city: "Le Havre",
        country: "France",
        latitude: 49.4897,
        longitude: 0.1077,
        connection: "The exact location depicted-November 13, 1872, 7:35 AM",
        place_type: "inspiration",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // THE HARVEST (Blanche Hoschede Monet)
  // ============================================
  {
    id: "aw10",
    work_type: "painting",
    title_display: "The Harvest",
    title_original: "La Moisson",
    title_original_lang: "French",
    external_ids: {
      // Note: Blanche Hoschede Monet works are less cataloged in major databases
      // Wikidata ID for the artist: Q437648
    },
    work_form: "Oil on canvas / Impressionist Landscape",
    date_created_year: 1890,
    country_of_origin: "France",
    medium: "Oil on canvas",
    dimensions: "Approximately 50 x 65 cm",
    primary_image_url: "https://d7hftxdivxxvm.cloudfront.net/?height=603&quality=50&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F8ey2uiurfigI0kXmkEfX-w%2Fmain.jpg&width=800",

    tag_relations: [
      { tag_type: "theme", tag_label: "women artists" },
      { tag_type: "theme", tag_label: "Impressionist legacy" },
      { tag_type: "theme", tag_label: "rural labor" },
      { tag_type: "theme", tag_label: "Norman landscape" },
      { tag_type: "emotion", tag_label: "golden warmth" },
      { tag_type: "emotion", tag_label: "quiet dignity" },
      { tag_type: "emotion", tag_label: "harvest abundance" },
      { tag_type: "emotion", tag_label: "gentle nostalgia" },
      { tag_type: "geo", tag_label: "France" },
      { tag_type: "geo", tag_label: "Giverny" },
      { tag_type: "geo", tag_label: "Normandy" },
      { tag_type: "geo", tag_label: "Seine Valley" }
    ],

    glance: "Golden wheat fields under a Norman sky-painted by Monet's stepdaughter who became his artistic heir, preserving his home and gardens for future generations while creating her own body of work.",
    story: {
      cultural_context: "Blanche Hoschede (1865-1947) was the daughter of Alice Hoschede, who became Monet's second wife. Growing up in the Monet household at Giverny, Blanche trained directly under the master. She painted alongside him for decades. As second-generation Impressionist, she represents the movement's transmission within families-living proof that Impressionism wasn't just a style but a practice, a way of seeing passed from Boudin to Monet to Blanche across three generations. She painted during Impressionism's shift from radical innovation (1870s-80s) to established tradition (1890s onward).",
      type_aesthetic: "Impressionist landscape in the tradition of her stepfather, but with her own sensibility-softer colors, more horizontal compositions, attention to agricultural labor rather than pure landscape.",
      surface_layer: "A wide Norman wheat field stretches horizontally across the canvas, the grain rendered in warm golds, ochres, and touches of green where stalks remain unripe. The field occupies roughly two-thirds of the composition, with a pale blue sky above dotted with soft white clouds. In the middle distance, small figures of farmworkers bend among the grain, their forms suggested with a few deft brushstrokes. A line of trees marks the horizon. The paint is applied in short, directional strokes that follow the lay of the wheat, creating a sense of the grain's texture and movement in the breeze.",
      core_philosophy: "Art making as a way of life. Blanche painted not for fame but for the practice itself-the daily discipline of seeing and recording the world around Giverny.",
      receipt: "The Musee des Impressionnismes Giverny: 'Blanche Hoschede Monet was not merely Monet's assistant or imitator. Her paintings reveal a distinct sensibility.'",
      observation_details: [
        { type: "palette", detail: "Notice the warm, golden palette dominated by yellows and ochres. Compared to Monet's more varied color experiments, Blanche favored harmonious, naturalistic tones that evoke late summer warmth." },
        { type: "composition", detail: "The horizontal format and low horizon line emphasize the expansive fields-a compositional choice that differs from Monet's more varied framings. This horizontality gives her harvest scenes a calm, contemplative quality." },
        { type: "brushwork", detail: "Her brushstrokes are smaller and more uniform than Monet's dramatic gestures. Look for the patient, methodical application that builds up the wheat field stroke by stroke-evidence of her disciplined approach." },
        { type: "human_presence", detail: "Unlike pure landscape, the small figures of workers connect the painting to rural labor and community. This attention to agricultural life distinguishes her work from Monet's more abstracted nature studies." }
      ]
    },
    deep_dive: {
      overview: "Blanche married Claude Monet's son Jean in 1897, becoming both stepdaughter and daughter-in-law to the master. After Jean's death (1914) and Monet's (1926), she remained at Giverny as guardian of his legacy.",
      production: "Painted en plein air in the fields around Giverny, capturing the annual rhythm of rural Norman life-planting, growth, harvest, rest.",
      themes: "The overlooked story of women artists in the Impressionist circle. Blanche sacrificed much of her own career to care for Monet and preserve his estate-yet her paintings stand on their own merit."
    },

    person_roles: [
      {
        person: {
          id: "ap11",
          name_display: "Blanche Hoschede Monet",
          name_native: null,
          image_url: null
        },
        role_type: "artist",
        role_display: "Artist",
        bio: "1865-1947. Monet's stepdaughter and daughter-in-law. Trained under him, then preserved Giverny after his death. Her own paintings are now being reassessed.",
        source_type: "primary"
      },
      {
        person: {
          id: "ap6",
          name_display: "Claude Monet",
          name_native: null,
          image_url: null
        },
        role_type: "mentor",
        role_display: "Stepfather / Teacher",
        bio: "Trained Blanche from childhood. She was his most devoted student and later his caretaker during his final years of failing eyesight.",
        source_type: "primary"
      }
    ],

    work_relations: [
      { relation_type: "inspired_by", to_work: { id: "aw6", title_display: "Woman with a Parasol" }, confidence: "verified", source_type: "secondary", note: "Monet painted this 10 years before training Blanche-she learned his plein air method firsthand" },
      { relation_type: "inspired_by", to_work: { id: "aw8", title_display: "Water Lilies (Grandes Decorations)" }, confidence: "verified", source_type: "secondary", note: "She assisted Monet and watched him create these panels in his final years" },
      { relation_type: "inspired_by", to_work: { id: "aw9", title_display: "Impression, Sunrise" }, confidence: "verified", source_type: "secondary", note: "Grew up with Monet's revolutionary works as her daily environment" },
      { relation_type: "inspired_by", to_work: { id: "aw7", title_display: "On the Beach at Trouville" }, confidence: "corroborated", source_type: "secondary", note: "Boudin -> Monet -> Blanche: three-generation transmission of plein air practice" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Impressionist movement (Renoir, Pissarro, Sisley)" }, confidence: "verified", source_type: "secondary", note: "Second-generation practitioner who knew the founders personally" },
      { relation_type: "inspired_by", to_work: { id: null, title_display: "Women Impressionists (Morisot, Cassatt, Bracquemond)" }, confidence: "verified", source_type: "secondary", note: "Part of overlooked generation of women artists" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Preservation of Giverny and Water Lily Gardens" }, confidence: "verified", source_type: "secondary", note: "Without her stewardship (1926-1947), Monet's home and the famous pond might have been lost" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Recovery of women artists movement" }, confidence: "verified", source_type: "secondary", note: "21st century scholarship reassessing overlooked women in Impressionist circles" },
      { relation_type: "influenced", to_work: { id: null, title_display: "Artist-family studies" }, confidence: "corroborated", source_type: "secondary", note: "Her life illuminates how art movements transmit across generations" }
    ],

    voices: {
      expert: [
        {
          source: "Musee des Impressionnismes Giverny",
          quote: "Her paintings reveal a distinct sensibility that marks her as a genuine artist in her own right.",
          translation: "Not just Monet's helper-an artist who deserves recognition."
        }
      ],
      community: [
        {
          quote: "She gave up her own career to protect his legacy. But when you see her paintings, you realize what art lost.",
          context: "Art student at Giverny"
        }
      ]
    },

    places: [
      {
        id: "pl19",
        name_display: "Giverny",
        city: "Giverny",
        country: "France",
        latitude: 49.0759,
        longitude: 1.5337,
        connection: "Where Blanche lived 1883-1947-painted harvest fields here",
        place_type: "inspiration",
        is_visitable: true
      },
      {
        id: "pl20",
        name_display: "Fondation Claude Monet",
        city: "Giverny",
        country: "France",
        latitude: 49.0754,
        longitude: 1.5337,
        connection: "House and gardens Blanche preserved after Monet's death",
        place_type: "museum",
        is_visitable: true
      }
    ]
  },

  // ============================================
  // ADDITIONAL ARTWORKS (Added 2025-12-07)
  // ============================================

  {
    id: "aw33",
    work_type: "painting",
    title_display: "The Birth of Venus",
    title_original: "La nascita di Venere",
    date_created_year: 1485,
    country_of_origin: "Italy",
    external_ids: { wikidata: "Q182329" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "mythology" },
      { tag_type: "theme", tag_label: "beauty" },
      { tag_type: "emotion", tag_label: "serene" },
      { tag_type: "genre", tag_label: "renaissance" }
    ],
    work_relations: [
      { relation_type: "inspired_by", to_work: { title_display: "Classical Greek sculpture (Venus Pudica)" } }
    ],
    places: [{ name_display: "Uffizi Gallery, Florence", latitude: 43.7687, longitude: 11.2559, connection: "Current location", place_type: "museum", is_visitable: true }],
    person_roles: [{ person: { id: "ap33", name_display: "Sandro Botticelli" }, role_type: "artist", source_type: "primary" }],
    glance: "Botticelli's iconic depiction of the goddess Venus emerging fully grown from the sea on a giant scallop shell, embodying Renaissance ideals of divine beauty and classical mythology.",
    story: {
      cultural_context: "Created for Lorenzo di Pierfrancesco de' Medici, cousin of Lorenzo the Magnificent, during the height of Florentine Neoplatonism. The Medici court was captivated by the idea that classical mythology could express Christian truths-that Venus could embody divine love. Painted on canvas rather than wood panel, suggesting it was intended as a decorative furnishing, possibly a wedding gift.",
      surface_layer: "Venus stands at center on a giant scallop shell, blown toward shore by the entwined wind gods Zephyr and Chloris on the left. On the right, a nymph (often identified as one of the Horae, goddesses of the seasons) rushes forward with a flowered cloak to cover her nakedness. Venus herself assumes the pose of the ancient Venus Pudica (modest Venus), one hand covering her breast, the other her groin. Her impossibly long neck, sloping shoulders, and elongated proportions create an otherworldly beauty.",
      type_aesthetic: "Early Renaissance mythological painting with Byzantine influences. Linear elegance over naturalistic anatomy. Pale, luminous palette with extensive use of gold leaf. The flattened spatial composition and decorative treatment of waves and foliage recall medieval manuscript illumination.",
      core_philosophy: "Beauty as a pathway to the divine. Neoplatonist philosopher Marsilio Ficino taught that earthly beauty was a reflection of heavenly perfection. Venus here represents not carnal desire but the spiritual beauty that elevates the soul toward God.",
      receipt: "Giorgio Vasari, 1550: 'In this painting grace is expressed in the face of a most beautiful girl, denoting modesty and beauty.' The work hung in the Medici Villa di Castello for over a century before entering the Uffizi.",
      observation_details: [
        { label: "The Pose", value: "Based on the ancient Capitoline Venus and other Venus Pudica sculptures, reversing the gesture" },
        { label: "Anatomical Liberties", value: "Her left shoulder is impossibly dropped; her neck elongated. Botticelli prioritized grace over accuracy" },
        { label: "The Shell", value: "A giant scallop, associated with both Venus's birth and Christian baptism-the goddess arrives like a soul entering the world" },
        { label: "Wind and Flowers", value: "Roses scatter from Zephyr's breath-flowers were said to spring up wherever Venus stepped on land" }
      ]
    }
  },

  {
    id: "aw34",
    work_type: "mural",
    title_display: "The Last Supper",
    title_original: "L'Ultima Cena",
    date_created_year: 1498,
    country_of_origin: "Italy",
    external_ids: { wikidata: "Q128910" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg/1280px-The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "religion" },
      { tag_type: "theme", tag_label: "betrayal" },
      { tag_type: "emotion", tag_label: "dramatic" },
      { tag_type: "genre", tag_label: "high-renaissance" }
    ],
    work_relations: [],
    places: [{ name_display: "Santa Maria delle Grazie, Milan", latitude: 45.4659, longitude: 9.1711, connection: "Original location (UNESCO World Heritage Site)", place_type: "church", is_visitable: true }],
    person_roles: [{ person: { id: "ap34", name_display: "Leonardo da Vinci" }, role_type: "artist", source_type: "primary" }],
    glance: "Leonardo's monumental mural captures the dramatic moment when Jesus announces one of his apostles will betray him. Its revolutionary use of perspective and psychological depth inaugurated the High Renaissance.",
    story: {
      cultural_context: "Commissioned by Duke Ludovico Sforza for the Dominican refectory of Santa Maria delle Grazie in Milan. The monks would eat their meals beneath this scene of Christ's final meal-a deliberate theological parallel. Leonardo worked on it from 1495-1498, often standing before it for hours without touching his brush, 'composing in his mind,' to the prior's frustration.",
      surface_layer: "Christ sits at center of a long table, his arms spread in a gesture of resignation after announcing 'One of you will betray me.' The twelve apostles react in clusters of three, their bodies forming a wave of shock radiating outward from Christ's calm center. Judas, third from left, recoils backward clutching his money bag, his face in shadow. The architectural perspective converges precisely on Christ's head, making him the geometric and spiritual focal point. Through the windows behind, a luminous landscape recedes into sfumato haze.",
      type_aesthetic: "High Renaissance mural using experimental oil-and-tempera technique on dry plaster (not true fresco). One-point perspective with mathematical precision. Pioneering use of psychological portraiture-each apostle shows a distinct emotional response.",
      core_philosophy: "The moment before action reveals character. Leonardo chose not to depict the institution of the Eucharist or the identification of Judas, but the suspended instant when each man must confront his own capacity for betrayal.",
      receipt: "Leonardo's contemporary, mathematician Luca Pacioli: 'It is impossible to imagine the apostles more vividly reacting to the words of the master.' Vasari later noted that Leonardo left Christ's face unfinished, 'not believing it possible to give it the celestial divinity required.'",
      observation_details: [
        { label: "The Perspective", value: "All perspective lines converge on Christ's right temple. The room extends the actual refectory's architecture, creating an illusion that Christ dines with the monks" },
        { label: "Judas", value: "Uniquely placed on the same side as Christ and apostles (unlike tradition), but his face falls into shadow and he clutches his payment" },
        { label: "The Hands", value: "Leonardo choreographed each hand gesture to reveal psychology-Peter's knife, Thomas's pointed finger, John's folded resignation" },
        { label: "Deterioration", value: "Leonardo's experimental technique began failing within decades. The painting has been restored multiple times and represents perhaps 20% original paint" }
      ]
    }
  },

  {
    id: "aw35",
    work_type: "fresco",
    title_display: "The School of Athens",
    title_original: "Scuola di Atene",
    date_created_year: 1511,
    country_of_origin: "Italy",
    external_ids: { wikidata: "Q175036" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "philosophy" },
      { tag_type: "theme", tag_label: "knowledge" },
      { tag_type: "emotion", tag_label: "contemplative" },
      { tag_type: "genre", tag_label: "high-renaissance" }
    ],
    work_relations: [],
    places: [{ name_display: "Apostolic Palace, Vatican City", latitude: 41.9029, longitude: 12.4545, connection: "Original location (Stanza della Segnatura)", place_type: "museum", is_visitable: true }],
    person_roles: [{ person: { id: "ap35", name_display: "Raphael" }, role_type: "artist", source_type: "primary" }],
    glance: "Raphael's masterpiece depicts ancient Greek philosophers led by Plato and Aristotle in an imagined gathering celebrating rational thought. It includes hidden portraits of Renaissance artists including Michelangelo as Heraclitus.",
    story: {
      cultural_context: "Commissioned by Pope Julius II for his private library (the Stanza della Segnatura), representing Philosophy-one of four branches of knowledge along with Theology, Poetry, and Law depicted in the room. Raphael was only 27 when he began this fresco in 1509, working while Michelangelo painted the Sistine Chapel ceiling nearby. The two never acknowledged each other's work, but Raphael added Michelangelo's portrait after seeing the Sistine unveiling.",
      surface_layer: "Beneath a vast barrel-vaulted hall inspired by Bramante's designs for the new St. Peter's Basilica, over fifty ancient philosophers, mathematicians, and scientists gather in discourse. At center, Plato (pointing upward toward the realm of Forms) and Aristotle (gesturing outward toward empirical reality) embody the fundamental divide in Western philosophy. Around them, identifiable figures include Socrates (debating with soldiers), Pythagoras (writing in a book), Euclid (demonstrating geometry with a compass), and the brooding Heraclitus (seated on the steps, added later as a portrait of Michelangelo).",
      type_aesthetic: "High Renaissance fresco at the peak of classical idealism. Perfect one-point perspective creates an architectural stage. Harmonious groupings, idealized figures, balanced composition. The painted architecture extends the room's actual architecture, creating illusionistic depth.",
      core_philosophy: "The reconciliation of ancient wisdom with Christian faith. Pope Julius II commissioned a celebration of pagan philosophy for his private chambers-the Renaissance belief that Greek thought was a precursor to Christian revelation, not its enemy.",
      receipt: "Vasari, 1550: 'The truth is that while the other masters made paintings, Raphael made living things.' The fresco contains portraits of contemporaries: Plato resembles Leonardo da Vinci; Heraclitus is Michelangelo; Euclid is Bramante; Raphael himself appears at far right.",
      observation_details: [
        { label: "Plato and Aristotle", value: "Their gestures embody their philosophies-Plato points to heaven (the ideal Forms), Aristotle's palm faces earth (empirical observation)" },
        { label: "Hidden Portraits", value: "Plato = Leonardo da Vinci. Heraclitus (added later) = Michelangelo. Euclid = architect Bramante. Raphael stands at far right in dark cap" },
        { label: "The Architecture", value: "Based on Bramante's plans for St. Peter's, which was under construction. The painted space extends the real room's architecture" },
        { label: "The Michelangelo Addition", value: "Heraclitus's brooding figure was painted over the finished floor after Raphael saw Michelangelo's Sistine prophets-a secret homage" }
      ]
    }
  },

  {
    id: "aw36",
    work_type: "painting",
    title_display: "The Starry Night",
    title_original: "De sterrennacht",
    date_created_year: 1889,
    country_of_origin: "France",
    external_ids: { wikidata: "Q45585" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "nature" },
      { tag_type: "theme", tag_label: "night-sky" },
      { tag_type: "emotion", tag_label: "turbulent" },
      { tag_type: "emotion", tag_label: "wonder" },
      { tag_type: "genre", tag_label: "post-impressionism" }
    ],
    work_relations: [],
    places: [
      { name_display: "Museum of Modern Art, New York", latitude: 40.7614, longitude: -73.9776, connection: "Current location (since 1941)", place_type: "museum", is_visitable: true },
      { name_display: "Saint-Paul-de-Mausole, Saint-Remy-de-Provence", latitude: 43.7892, longitude: 4.8317, connection: "Depicted location (view from asylum window)", place_type: "inspiration", is_visitable: true }
    ],
    person_roles: [{ person: { id: "ap36", name_display: "Vincent van Gogh" }, role_type: "artist", source_type: "primary" }],
    glance: "Painted during Van Gogh's stay at a psychiatric asylum, this swirling night sky over an imaginary village became a touchstone of Expressionism. Van Gogh himself considered it merely a 'night study.'",
    story: {
      cultural_context: "Painted in June 1889 during Van Gogh's voluntary stay at the Saint-Paul-de-Mausole asylum in Saint-Remy-de-Provence, following his breakdown in Arles. The asylum allowed him to paint, and he produced 150 works during his year there. This was painted from memory and imagination during the day-the view from his barred window faced east, and the painting depicts the pre-dawn sky looking north.",
      surface_layer: "A vast night sky dominates the canvas, filled with swirling, spiraling patterns of blue, white, and yellow. Eleven stars blaze with halos of light, and a crescent moon glows orange-yellow in the upper right. A dark cypress tree flames upward like green fire in the left foreground, connecting earth to sky. Below, a peaceful village with a prominent church steeple sleeps in the valley-an imagined Dutch village, not the actual Provencal landscape. Rolling hills in blue-green undulate toward the horizon.",
      type_aesthetic: "Post-Impressionism moving toward Expressionism. Impasto brushwork with visible, rhythmic strokes that follow the energy of each form-swirling for sky, vertical for cypress, horizontal for village. Color is emotional rather than observational: the night is not black but alive with blues, greens, and yellows.",
      core_philosophy: "The night sky as spiritual experience. Van Gogh wrote to his brother Theo: 'Looking at the stars always makes me dream... Why, I ask myself, shouldn't the shining dots of the sky be as accessible as the black dots on the map of France?' The stars offered hope of an afterlife, of meaning beyond earthly suffering.",
      receipt: "Van Gogh to Theo, June 1889: 'This morning I saw the country from my window a long time before sunrise, with nothing but the morning star, which looked very big.' He considered the painting a failure, a 'study' rather than a finished work. It was sold for 400 francs shortly after his death.",
      observation_details: [
        { label: "The Cypress", value: "Van Gogh called cypresses 'beautiful as an Egyptian obelisk.' This one connects earth to heaven like a dark flame" },
        { label: "The Village", value: "An imagined Dutch village, not the actual view. The church steeple echoes those from Van Gogh's Dutch homeland" },
        { label: "The Spiral Motion", value: "Modern scientists have noted the sky's turbulence patterns match mathematical models of fluid dynamics-possibly observed from real atmospheric phenomena" },
        { label: "Day Painting", value: "Despite depicting night, this was painted during the day from memory-Van Gogh was not allowed outside after dark" }
      ]
    }
  },

  {
    id: "aw37",
    work_type: "painting",
    title_display: "Guernica",
    title_original: "Guernica",
    date_created_year: 1937,
    country_of_origin: "Spain",
    external_ids: { wikidata: "Q175036" },
    primary_image_url: "https://guernica.museoreinasofia.es/themes/custom/guernica/dist/images/share-image.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "war" },
      { tag_type: "theme", tag_label: "suffering" },
      { tag_type: "emotion", tag_label: "anguish" },
      { tag_type: "emotion", tag_label: "horror" },
      { tag_type: "genre", tag_label: "cubism" }
    ],
    work_relations: [],
    places: [
      { name_display: "Museo Reina Sofia, Madrid", latitude: 40.4086, longitude: -3.6943, connection: "Current location (since 1992)", place_type: "museum", is_visitable: true },
      { name_display: "Guernica, Basque Country", latitude: 43.3143, longitude: -2.5679, connection: "Depicted event (1937 bombing)", place_type: "historical", is_visitable: true }
    ],
    person_roles: [{ person: { id: "ap37", name_display: "Pablo Picasso" }, role_type: "artist", source_type: "primary" }],
    glance: "Picasso's monumental anti-war painting responds to the Nazi bombing of the Basque town of Guernica during the Spanish Civil War. Painted in six weeks for the 1937 Paris World's Fair.",
    story: {
      cultural_context: "On April 26, 1937, Nazi German bombers supporting Franco's Nationalist forces attacked the Basque town of Guernica during a busy market day, killing hundreds of civilians in history's first aerial saturation bombing of a civilian population. The Spanish Republic commissioned Picasso for its pavilion at the Paris World's Fair. Initially at a loss for subject matter, Picasso read the news from Guernica on May 1st and began working immediately, completing the monumental canvas in just over five weeks.",
      surface_layer: "A chaotic scene of suffering unfolds in stark black, white, and grey. At left, a screaming woman holds her dead child beneath a roaring bull. A dismembered soldier lies below, his broken sword still clutched in his severed hand, a flower growing beside it. At center, a wounded horse screams, its body pierced by a spear. Above, a bare lightbulb in the shape of an eye blazes like an exploding bomb. At right, figures fall from a burning building. A woman with an outstretched lamp leans in from a window, illuminating the carnage.",
      type_aesthetic: "Cubist-Expressionist synthesis on monumental scale (3.49 x 7.77 meters). Deliberate rejection of color-the grey tones recall newspaper photography and newsreel footage. Flat, fragmented forms derived from Analytical Cubism create visual chaos that mirrors psychological trauma. The composition reads like a classical frieze or triptych.",
      core_philosophy: "Art as moral witness. Picasso weaponized his fame and talent to create what became the twentieth century's most powerful anti-war statement. When a German officer reportedly asked him 'Did you do this?', Picasso replied: 'No, you did.'",
      receipt: "Picasso, 1937: 'The Spanish struggle is the fight of reaction against the people, against freedom. My whole life as an artist has been nothing more than a continuous struggle against reaction and the death of art.' He stipulated the painting could not return to Spain until democracy was restored-it hung at MoMA until 1981.",
      observation_details: [
        { label: "The Bull", value: "Ambiguous symbol-Spanish strength? Brutality? Picasso refused to explain: 'The bull is a bull... Let the public find what they want'" },
        { label: "The Horse", value: "The people of the Republic, suffering and screaming. Its body contains a hidden skull visible from certain angles" },
        { label: "The Lightbulb", value: "A pun in Spanish-'bombilla' (lightbulb) echoes 'bomba' (bomb). The eye-shaped bulb suggests both witness and perpetrator" },
        { label: "The Flower", value: "Growing beside the dead soldier's broken sword-a fragile symbol of hope and regeneration amid destruction" }
      ]
    }
  },

  {
    id: "aw38",
    work_type: "painting",
    title_display: "The Persistence of Memory",
    title_original: "La persistencia de la memoria",
    date_created_year: 1931,
    country_of_origin: "Spain",
    external_ids: { wikidata: "Q764702" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "time" },
      { tag_type: "theme", tag_label: "dreams" },
      { tag_type: "emotion", tag_label: "uncanny" },
      { tag_type: "genre", tag_label: "surrealism" }
    ],
    work_relations: [],
    places: [
      { name_display: "Museum of Modern Art, New York", latitude: 40.7614, longitude: -73.9776, connection: "Current location (since 1934)", place_type: "museum", is_visitable: true },
      { name_display: "Cap de Creus, Catalonia", latitude: 42.3189, longitude: 3.3164, connection: "Depicted location (rocky landscape)", place_type: "inspiration", is_visitable: true }
    ],
    person_roles: [{ person: { id: "ap38", name_display: "Salvador Dali" }, role_type: "artist", source_type: "primary" }],
    glance: "Dali's iconic melting clocks epitomize Surrealism's exploration of dreams and the subconscious. When asked if inspired by Einstein's relativity, Dali replied they came from his perception of 'a Camembert melting in the sun.'",
    story: {
      cultural_context: "Painted in 1931 when Dali was at the height of his involvement with the Surrealist movement in Paris. The Surrealists, led by Andre Breton, sought to access the unconscious mind through automatism, dreams, and Freudian psychoanalysis. Dali developed what he called the 'paranoiac-critical method'-inducing hallucinatory states to generate imagery. The painting was completed in one afternoon while Gala, his wife and muse, was at the cinema.",
      surface_layer: "A barren landscape stretches under a golden twilight sky, recognizable as the cliffs of Cap de Creus near Dali's home in Catalonia. Three 'soft watches' drape limply over various surfaces-one melts over a rectangular form, another hangs from a dead tree branch, a third drapes over a fleshy, amorphous creature at center (resembling Dali's profile). A fourth watch, face-down on the left, is covered in ants. In the distance, the Mediterranean sea and familiar rocks create an uncanny juxtaposition of photographic realism and impossible softness.",
      type_aesthetic: "Surrealist 'hand-painted dream photograph'-Dali's term for his meticulous, academic technique applied to irrational subject matter. The hard, precise rendering of impossible objects creates cognitive dissonance. Small scale (24 x 33 cm) intensifies the jewel-like precision.",
      core_philosophy: "The unreliability of time and perception. Hard watches become soft; the rigid becomes fluid. Dali offers no allegory of Einstein's relativity but something more personal-time as we experience it in dreams, memory, and desire, where hours can pass in moments or moments stretch to eternity.",
      receipt: "Dali, 1931: 'Be persuaded that Salvador Dali's famous limp watches are nothing more than the tender, extravagant, solitary, paranoiac-critical Camembert of time and space.' When Gala returned from the cinema and saw the painting, she reportedly said: 'No one can forget it once he has seen it.'",
      observation_details: [
        { label: "The Soft Watches", value: "Dali insisted their origin was a melting Camembert cheese, not theoretical physics. The softness represents psychological time versus mechanical time" },
        { label: "The Ants", value: "Dali's recurring symbol of decay and mortality-they consume the only rigid watch in the painting" },
        { label: "The Fetal Figure", value: "A soft self-portrait in profile, with exaggerated eyelashes-Dali often painted himself as vulnerable, asleep, or dissolved" },
        { label: "The Landscape", value: "The cliffs of Cap de Creus, which Dali called 'the geological delirium'-their eroded forms suggested paranoiac visions" }
      ]
    }
  },

  {
    id: "aw39",
    work_type: "print",
    title_display: "The Great Wave off Kanagawa",
    title_original: "Kanagawa-oki Nami Ura",
    date_created_year: 1831,
    country_of_origin: "Japan",
    external_ids: { wikidata: "Q312828" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "nature" },
      { tag_type: "theme", tag_label: "ocean" },
      { tag_type: "emotion", tag_label: "sublime" },
      { tag_type: "emotion", tag_label: "power" },
      { tag_type: "genre", tag_label: "ukiyo-e" }
    ],
    work_relations: [
      { relation_type: "influenced", to_work: { title_display: "Impressionist movement" } }
    ],
    places: [
      { name_display: "Metropolitan Museum of Art, New York", latitude: 40.7794, longitude: -73.9632, connection: "Notable impression", place_type: "museum", is_visitable: true },
      { name_display: "British Museum, London", latitude: 51.5194, longitude: -0.1270, connection: "Notable impression", place_type: "museum", is_visitable: true }
    ],
    person_roles: [{ person: { id: "ap39", name_display: "Katsushika Hokusai" }, role_type: "artist", source_type: "primary" }],
    glance: "Possibly the most reproduced image in art history, this woodblock print shows boats battling a rogue wave with Mount Fuji in the background. Originally sold for the price of two bowls of noodles, it influenced Van Gogh, Monet, and Debussy.",
    story: {
      cultural_context: "Created around 1831 when Hokusai was approximately 70 years old, as part of the series 'Thirty-six Views of Mount Fuji' (actually 46 prints). Japan's Tokugawa shogunate enforced sakoku (closed country) policy, but Dutch trade at Nagasaki brought Prussian blue pigment (Berlin blue), enabling the deep blues that define this print. The series capitalized on a Fuji pilgrimage boom and a new middle-class tourism culture.",
      surface_layer: "A massive wave crests in the foreground, its foam clawing like white fingers at the sky. Three oshiokuri-bune (fast cargo boats) full of fishermen navigate the trough, their passengers clinging low. In the distance, rendered impossibly small by the wave's scale, Mount Fuji sits serene beneath a clear sky, its snow-capped peak echoing the wave's white foam. The composition creates a visual rhyme: the great wave mirrors Fuji's cone, the foam echoes its snow.",
      type_aesthetic: "Ukiyo-e woodblock print using revolutionary imported Prussian blue pigment alongside traditional organic indigo. Western-influenced single-point perspective (learned from Dutch prints at Nagasaki) combined with Japanese compositional asymmetry. Multiple wood blocks carved for different colors, printed in edition of approximately 5,000-8,000 impressions.",
      core_philosophy: "The sublime contrast between human vulnerability and natural forces-and the persistence of the sacred amid chaos. Fuji represents permanence, the wave represents flux. The fishermen, nearly invisible, represent humanity caught between. Hokusai signed it 'Hokusai, the old man mad about painting.'",
      receipt: "Hokusai at age 75: 'From the age of six I had a mania for drawing... At seventy-three I finally learned something about the true nature of things. When I am a hundred and ten, everything I draw, a dot or a line, will be alive.' The print sold for 20 mon-about the price of two bowls of noodle soup.",
      observation_details: [
        { label: "The Wave's Claw", value: "The foam fingers reaching downward were a Hokusai innovation-they give the wave predatory menace and may have influenced European Art Nouveau" },
        { label: "Mount Fuji", value: "Tiny but stable at center, Fuji is both a compositional anchor and spiritual symbol-the eternal amid the transient" },
        { label: "The Boats", value: "Oshiokuri-bune were fast boats that delivered fresh fish to Edo. The crew (about 8 per boat) crouch low, showing practiced survival technique" },
        { label: "Prussian Blue", value: "Imported from Europe via Dutch traders, this synthetic pigment enabled the deep blues impossible with traditional plant-based indigo" }
      ]
    }
  },

  {
    id: "aw40",
    work_type: "painting",
    title_display: "The Scream",
    title_original: "Skrik",
    date_created_year: 1893,
    country_of_origin: "Norway",
    external_ids: { wikidata: "Q18891156" },
    primary_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
    tag_relations: [
      { tag_type: "theme", tag_label: "anxiety" },
      { tag_type: "theme", tag_label: "existentialism" },
      { tag_type: "emotion", tag_label: "dread" },
      { tag_type: "emotion", tag_label: "anguish" },
      { tag_type: "genre", tag_label: "expressionism" }
    ],
    work_relations: [],
    places: [
      { name_display: "National Museum of Norway, Oslo", latitude: 59.9167, longitude: 10.7375, connection: "Current location (1893 version)", place_type: "museum", is_visitable: true },
      { name_display: "Ekeberg, Oslo", latitude: 59.8997, longitude: 10.7653, connection: "Depicted location (fjord path)", place_type: "inspiration", is_visitable: true }
    ],
    person_roles: [{ person: { id: "ap40", name_display: "Edvard Munch" }, role_type: "artist", source_type: "primary" }],
    glance: "Munch created four versions of this iconic image after experiencing an 'infinite scream passing through nature' during a sunset walk. The agonized face became an icon of existential dread and inspired its own emoji.",
    story: {
      cultural_context: "Created in 1893 during the Symbolist movement, when artists across Europe rejected naturalism to explore psychology, spirituality, and inner experience. Munch was haunted by death-his mother died when he was five, his sister Sophie at fifteen. He later wrote: 'Illness, insanity, and death were the black angels that kept watch over my cradle.' The painting emerged from a period of intense psychological crisis in Berlin and Kristiania (Oslo).",
      surface_layer: "A figure stands on a boardwalk at the edge of a fjord, hands pressed to its skull-like face, mouth and eyes wide in horror. The figure's body undulates like the landscape behind it-both seem to vibrate with the same unseen force. Orange and red clouds streak across the sky like blood, reflecting in the blue-black water below. Two figures walk away in the background, oblivious. A railing leads the eye into the depth, toward a distant cityscape.",
      type_aesthetic: "Symbolist-Expressionist painting using tempera and pastel on cardboard (in the 1893 version). Wavy, sinuous lines derived from Art Nouveau create visual anxiety. The landscape echoes the figure's emotional state-external nature made internal. Palette of complementary oranges and blues creates maximum chromatic tension.",
      core_philosophy: "Anxiety as universal experience. The figure does not scream but receives a scream-nature itself screams through this hollow vessel. Munch transforms personal terror into an image of modern alienation that resonates across cultures and centuries.",
      receipt: "Munch's journal, January 22, 1892: 'I was walking along the road with two friends-the sun was setting-suddenly the sky turned blood red-I paused, feeling exhausted, and leaned on the fence-there was blood and tongues of fire above the blue-black fjord and the city-my friends walked on, and I stood there trembling with anxiety-and I sensed an infinite scream passing through nature.'",
      observation_details: [
        { label: "The Figure", value: "Genderless, almost fetal-Munch removes individual identity to create universal symbol. The face echoes a Peruvian mummy Munch saw at the Paris Exposition" },
        { label: "The Sky", value: "The blood-red clouds may depict volcanic sunsets following Krakatoa's 1883 eruption, visible in Norway through 1884" },
        { label: "The Location", value: "Ekeberg hill overlooking Kristiania (Oslo), near both a slaughterhouse (screams of animals) and an asylum where Munch's sister was confined" },
        { label: "Four Versions", value: "Munch created four versions: two pastels (1893, 1895), one tempera (1893, at National Museum), one tempera (1910, at Munch Museum)" }
      ]
    }
  }
];

// ============================================
// HELPER FUNCTIONS (Updated for Canonical Shape)
// ============================================

/**
 * Get a work by its ID
 * @param {string} id - Work ID (e.g., "aw1")
 * @returns {Object|undefined} Work object or undefined
 */
function getWorkById(id) {
  return WORKS.find(function(w) { return w.id === id; });
}

/**
 * Get works by type category
 * USE CASE: Filter vault by artwork/movie
 * INTENTION: Work with canonical work_type field
 * @param {string} typeCategory - 'artwork', 'movie', or specific type
 * @returns {Object[]} Array of matching works
 */
function getWorksByType(typeCategory) {
  var typeCategoryLower = typeCategory.toLowerCase();
  var artworkTypes = ['painting', 'sculpture', 'photograph', 'drawing', 'print', 'artwork', 'installation'];
  var movieTypes = ['film', 'animation', 'movie', 'documentary', 'short_film', 'tv_series', 'tv'];

  return WORKS.filter(function(w) {
    var workType = (w.work_type || '').toLowerCase();
    if (typeCategoryLower === 'artwork') {
      return artworkTypes.indexOf(workType) !== -1;
    }
    if (typeCategoryLower === 'movie') {
      return movieTypes.indexOf(workType) !== -1;
    }
    return workType === typeCategoryLower;
  });
}

/**
 * Get all works
 * @returns {Object[]} All works in canonical shape
 */
function getAllWorks() {
  return WORKS;
}

/**
 * ============================================
 * GENERATE DNA GRAPH DATA FROM WORKS
 * Pre-calculates all nodes and edges for DNA visualization
 * Updated for canonical data shape (ADR-018)
 * ============================================
 */
function generateDNAGraphData() {
  var nodes = [];
  var edges = [];
  var nodeIds = new Set();
  var edgeIds = new Set();

  // Helper to create unique IDs
  var slugify = function(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  var addNode = function(node) {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      nodes.push(node);
    }
  };

  var addEdge = function(edge) {
    var edgeKey = edge.source + '|' + edge.target + '|' + edge.relation;
    if (!edgeIds.has(edgeKey)) {
      edgeIds.add(edgeKey);
      edges.push(edge);
    }
  };

  // Process each work
  WORKS.forEach(function(work) {

    // === WORK NODE ===
    var workNodeId = 'work_' + slugify(work.id);
    addNode({
      id: workNodeId,
      type: 'work',
      label: work.title_display || work.title,
      year: work.date_created_year || work.year,
      workId: work.id,
      image: work.primary_image_url || work.image,
      data: { glance: work.glance || '' }
    });

    // === TAGS (from tag_relations) ===
    if (work.tag_relations && Array.isArray(work.tag_relations)) {
      work.tag_relations.forEach(function(tr) {
        var tagId = 'tag_' + tr.tag_type + '_' + slugify(tr.tag_label);
        addNode({ id: tagId, type: 'tag_' + tr.tag_type, label: tr.tag_label, data: {} });
        addEdge({ source: workNodeId, target: tagId, relation: 'has_' + tr.tag_type });
      });
    }

    // === PEOPLE (from person_roles) ===
    if (work.person_roles && Array.isArray(work.person_roles)) {
      work.person_roles.forEach(function(pr) {
        var personName = pr.person?.name_display || pr.person?.name;
        if (!personName) return;

        var personId = 'person_' + slugify(personName);
        var personImage = pr.person?.image_url || (typeof getCreatorImage === 'function' ? getCreatorImage(personName) : null);

        addNode({
          id: personId,
          type: 'person',
          label: personName,
          role: pr.role_display || pr.role_type,
          image: personImage,
          data: { bio: pr.bio }
        });

        // Person created work - determine relation label based on role
        var roleType = pr.role_type || 'artist';
        var relationLabel = 'created';
        if (roleType === 'artist' || roleType === 'painter') relationLabel = 'painted';
        else if (roleType === 'director') relationLabel = 'directed';
        else if (roleType === 'composer') relationLabel = 'composed';
        else if (roleType === 'writer') relationLabel = 'wrote';

        addEdge({ source: personId, target: workNodeId, relation: 'created', label: relationLabel });
      });
    }

    // === PLACES ===
    if (work.places && Array.isArray(work.places)) {
      work.places.forEach(function(place) {
        var placeName = place.name_display || place.name;
        if (!placeName) return;

        var placeId = 'place_' + slugify(placeName);
        var lat = place.latitude !== undefined ? place.latitude : place.lat;
        var lng = place.longitude !== undefined ? place.longitude : place.lng;

        addNode({
          id: placeId,
          type: 'place',
          label: placeName,
          data: { city: place.city, country: place.country, lat: lat, lng: lng }
        });

        var connectionLower = (place.connection || '').toLowerCase();
        var relation = 'exhibited_at';
        if (connectionLower.includes('permanent') || connectionLower.includes('home')) relation = 'exhibited_at';
        else if (connectionLower.includes('inspir')) relation = 'inspired_by_place';
        else if (connectionLower.includes('painted') || connectionLower.includes('depicted')) relation = 'set_in';

        addEdge({
          source: workNodeId,
          target: placeId,
          relation: relation,
          label: place.connection ? place.connection.slice(0, 20) : 'connected'
        });
      });
    }

    // === WORK RELATIONS (Lineage) ===
    if (work.work_relations && Array.isArray(work.work_relations)) {
      work.work_relations.forEach(function(wr) {
        var toWorkTitle = wr.to_work?.title_display || wr.to_work?.title;
        if (!toWorkTitle) return;

        var toWorkId = wr.to_work?.id;
        var isInternalWork = false;

        // Check if this references an internal work
        if (toWorkId) {
          var internalWork = WORKS.find(function(w) { return w.id === toWorkId; });
          if (internalWork) {
            isInternalWork = true;
          }
        }

        // Also try to find by title
        if (!isInternalWork) {
          var workByTitle = WORKS.find(function(w) {
            return (w.title_display || w.title || '').toLowerCase() === toWorkTitle.toLowerCase();
          });
          if (workByTitle) {
            toWorkId = workByTitle.id;
            isInternalWork = true;
          }
        }

        var targetNodeId;
        if (isInternalWork && toWorkId) {
          targetNodeId = 'work_' + slugify(toWorkId);
        } else {
          // Create phantom node for external work
          targetNodeId = 'work_' + slugify(toWorkTitle);
          if (!nodeIds.has(targetNodeId)) {
            var phantomData = typeof getPhantomWorkData === 'function' ? getPhantomWorkData(toWorkTitle) : null;
            addNode({
              id: targetNodeId,
              label: toWorkTitle,
              type: 'work',
              year: phantomData?.year,
              isPhantom: true
            });

            // Add phantom work creators
            if (phantomData?.people) {
              phantomData.people.forEach(function(person) {
                var phantomPersonId = 'person_' + slugify(person.name);
                var phantomPersonImage = typeof getCreatorImage === 'function' ? getCreatorImage(person.name) : null;
                addNode({
                  id: phantomPersonId,
                  type: 'person',
                  label: person.name,
                  role: person.role,
                  image: phantomPersonImage,
                  data: { bio: person.bio },
                  isPhantomCreator: true
                });
                addEdge({ source: phantomPersonId, target: targetNodeId, relation: 'created', label: (person.role || 'created').toLowerCase() });
              });
            }
          }
        }

        // Determine edge direction based on relation type
        var relationType = wr.relation_type || 'inspired_by';
        if (relationType === 'inspired_by' || relationType === 'influenced_by' || relationType === 'reinterpretation_of') {
          // This work was inspired by target
          addEdge({
            source: workNodeId,
            target: targetNodeId,
            relation: 'inspired_by',
            label: relationType.replace(/_/g, ' '),
            isInternalWork: isInternalWork
          });
        } else if (relationType === 'influenced' || relationType === 'echoed_in') {
          // This work influenced target
          addEdge({
            source: workNodeId,
            target: targetNodeId,
            relation: 'inspired',
            label: relationType.replace(/_/g, ' '),
            isInternalWork: isInternalWork
          });
        }
      });
    }
  });

  return { nodes: nodes, edges: edges };
}

// Lazy initialization for DNA graph data (avoids blocking page load)
var _dnaGraphDataCache = null;
function getDNAGraphData() {
  if (!_dnaGraphDataCache) {
    _dnaGraphDataCache = generateDNAGraphData();
  }
  return _dnaGraphDataCache;
}

// For backwards compatibility, define as getter
Object.defineProperty(window, 'DNA_GRAPH_DATA', {
  get: function() { return getDNAGraphData(); },
  configurable: true
});

// Export for browser (window namespace)
window.WORKS = WORKS;
window.getWorkById = getWorkById;
window.getWorksByType = getWorksByType;
window.getAllWorks = getAllWorks;
window.generateDNAGraphData = generateDNAGraphData;
window.getDNAGraphData = getDNAGraphData;
