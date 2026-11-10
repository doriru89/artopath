/**
 * ============================================
 * CREATOR/CAST IMAGES & PROFILES
 * Maps creator and cast names to:
 * - Profile photos (TMDB for film, WGA for painters)
 * - Bio snippets (one-line descriptions)
 * - Career phases (Early/Peak/Late/Transitional)
 * - Primary role category
 * ============================================
 * Last updated: 2025-11-29
 */

// ==========================================
// CREATOR PROFILES - Extended Data
// ==========================================
const CREATOR_PROFILES = {
  // ---- CLASSIC PAINTERS ----
  "Johannes Vermeer": {
    image: "https://www.wga.hu/art/v/vermeer/10histor/01procur.jpg",
    bio: "Dutch Golden Age master of intimate domestic scenes",
    bioFull: "Vermeer of Delft (1632-1675) created only 36 known paintings, yet became one of the most revered artists in history for his luminous treatment of light and domestic intimacy.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1632,
    deathYear: 1675,
    nationality: "Dutch"
  },
  "Eugene Delacroix": {
    image: "https://www.wga.hu/art/d/delacroix/1/selfport.jpg",
    bio: "Leader of the French Romantic movement",
    bioFull: "Ferdinand Victor Eugene Delacroix (1798-1863) led French Romanticism with passionate, colorful works that influenced Impressionists and Expressionists.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1798,
    deathYear: 1863,
    nationality: "French"
  },
  "Jacques-Louis David": {
    image: "https://www.wga.hu/art/d/david_j/4/400david.jpg",
    bio: "Neoclassical master and painter to Napoleon",
    bioFull: "Jacques-Louis David (1748-1825) defined Neoclassicism and served as Napoleon's official painter, creating some of history's most famous propaganda art.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1748,
    deathYear: 1825,
    nationality: "French"
  },
  "Jean-Baptiste-Simeon Chardin": {
    image: "https://www.wga.hu/art/c/chardin/3/selfport.jpg",
    bio: "Master of French still life and the poetry of the ordinary",
    bioFull: "Chardin (1699-1779) transformed humble kitchen scenes into profound meditations on mortality and the beauty of everyday life.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1699,
    deathYear: 1779,
    nationality: "French"
  },
  "Claude Monet": {
    image: "https://www.wga.hu/art/m/monet/zzzmonet.jpg",
    bio: "Father of Impressionism, painter of light",
    bioFull: "Oscar-Claude Monet (1840-1926) founded Impressionism and spent his life capturing the ephemeral effects of light and atmosphere in nature.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1840,
    deathYear: 1926,
    nationality: "French"
  },
  "Eugene Boudin": {
    image: "https://www.wga.hu/art/b/boudin/zzzboudin.jpg",
    bio: "Pioneer of plein air painting who mentored Monet",
    bioFull: "Eugene Boudin (1824-1898) pioneered outdoor painting and famously taught the young Claude Monet, launching the Impressionist movement.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1824,
    deathYear: 1898,
    nationality: "French"
  },
  "Paolo Veronese": {
    image: "https://www.wga.hu/art/v/veronese/11self.jpg",
    bio: "Venetian Renaissance master of grand spectacle",
    bioFull: "Paolo Veronese (1528-1588) created the largest paintings of the Renaissance, transforming biblical scenes into Venetian theatrical spectacles.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1528,
    deathYear: 1588,
    nationality: "Italian (Venetian)"
  },
  "Blanche Hoschede Monet": {
    image: "https://www.wga.hu/art/m/monet/05/518monet.jpg",
    bio: "Impressionist painter and stepdaughter of Monet",
    bioFull: "Blanche Hoschede Monet (1865-1947) trained under her stepfather Claude Monet and preserved Giverny for future generations.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1865,
    deathYear: 1947,
    nationality: "French"
  },
  "Vincent van Gogh": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",
    bio: "Post-Impressionist master who transformed modern art",
    bioFull: "Vincent van Gogh (1853-1890) created about 2,100 artworks in just over a decade, including The Starry Night, and became one of the most influential figures in Western art history.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1853,
    deathYear: 1890,
    nationality: "Dutch"
  },
  "Sandro Botticelli": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sandro_Botticelli_083.jpg/440px-Sandro_Botticelli_083.jpg",
    bio: "Renaissance master of mythological beauty",
    bioFull: "Sandro Botticelli (1445-1510) created The Birth of Venus and Primavera, defining the aesthetic ideals of the Florentine Renaissance.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1445,
    deathYear: 1510,
    nationality: "Italian (Florentine)"
  },
  "Leonardo da Vinci": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/440px-Leonardo_self.jpg",
    bio: "Universal genius of the Renaissance",
    bioFull: "Leonardo da Vinci (1452-1519) was painter, sculptor, architect, musician, scientist, mathematician, and inventor—the archetype of the Renaissance man.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1452,
    deathYear: 1519,
    nationality: "Italian (Florentine)"
  },
  "Rembrandt": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/440px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",
    bio: "Dutch Golden Age master of light and shadow",
    bioFull: "Rembrandt van Rijn (1606-1669) created over 300 paintings including The Night Watch, pioneering chiaroscuro technique and psychological portraiture.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1606,
    deathYear: 1669,
    nationality: "Dutch"
  },
  "Diego Velázquez": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Diego_Velazquez_Autorretrato_45_x_38_cm_-_Colección_Real_Academia_de_Bellas_Artes_de_San_Fernand.jpg/440px-Diego_Velazquez_Autorretrato_45_x_38_cm_-_Colección_Real_Academia_de_Bellas_Artes_de_San_Fernand.jpg",
    bio: "Spanish Golden Age court painter",
    bioFull: "Diego Velázquez (1599-1660) served as court painter to Philip IV of Spain and created Las Meninas, considered one of the most analyzed works in Western art.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1599,
    deathYear: 1660,
    nationality: "Spanish"
  },
  "Édouard Manet": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Edouard_Manet_-_Selbstportrait.jpg/440px-Edouard_Manet_-_Selbstportrait.jpg",
    bio: "Pivotal figure bridging Realism and Impressionism",
    bioFull: "Édouard Manet (1832-1883) scandalized Paris with Olympia and Le Déjeuner sur l'herbe, becoming a crucial link between Realism and Impressionism.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1832,
    deathYear: 1883,
    nationality: "French"
  },
  "Pablo Picasso": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pablo_picasso_1.jpg/440px-Pablo_picasso_1.jpg",
    bio: "Co-founder of Cubism and most influential 20th century artist",
    bioFull: "Pablo Picasso (1881-1973) co-founded Cubism, created Guernica, and produced an estimated 50,000 artworks across painting, sculpture, ceramics, and more.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1881,
    deathYear: 1973,
    nationality: "Spanish"
  },
  "Salvador Dalí": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Salvador_Dalí_1939.jpg/440px-Salvador_Dalí_1939.jpg",
    bio: "Surrealist master of dreamscapes",
    bioFull: "Salvador Dalí (1904-1989) became the most famous Surrealist with The Persistence of Memory, known for striking imagery and theatrical public persona.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1904,
    deathYear: 1989,
    nationality: "Spanish"
  },
  "Hieronymus Bosch": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Jheronimus_Bosch_%28cropped%29.jpg/440px-Jheronimus_Bosch_%28cropped%29.jpg",
    bio: "Medieval master of fantastical imagery",
    bioFull: "Hieronymus Bosch (c.1450-1516) created The Garden of Earthly Delights and other triptychs filled with surreal religious imagery and demons.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1450,
    deathYear: 1516,
    nationality: "Dutch (Netherlandish)"
  },
  "John Singer Sargent": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/John_Singer_Sargent_-_Self-portrait_%281906%29%2C_Uffizi.jpg/440px-John_Singer_Sargent_-_Self-portrait_%281906%29%2C_Uffizi.jpg",
    bio: "Leading portrait painter of the Gilded Age",
    bioFull: "John Singer Sargent (1856-1925) was the leading portrait painter of his generation, famous for Madame X and his virtuoso brushwork.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1856,
    deathYear: 1925,
    nationality: "American"
  },
  "Michelangelo": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Miguel_Ángel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg/440px-Miguel_Ángel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg",
    bio: "Sculptor and painter of the Sistine Chapel",
    bioFull: "Michelangelo di Lodovico Buonarroti Simoni (1475-1564) created David, the Pietà, and painted the Sistine Chapel ceiling—pinnacle of Renaissance art.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1475,
    deathYear: 1564,
    nationality: "Italian (Florentine)"
  },
  "Raphael": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Raffaello_Sanzio.jpg/440px-Raffaello_Sanzio.jpg",
    bio: "Renaissance master of grace and harmony",
    bioFull: "Raphael Sanzio (1483-1520) was one of the three great masters of the High Renaissance, known for The School of Athens and his Madonnas.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1483,
    deathYear: 1520,
    nationality: "Italian"
  },
  "Caravaggio": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bild-Ottavio_Leoni%2C_Caravaggio.jpg/440px-Bild-Ottavio_Leoni%2C_Caravaggio.jpg",
    bio: "Revolutionary master of dramatic lighting",
    bioFull: "Michelangelo Merisi da Caravaggio (1571-1610) revolutionized painting with dramatic chiaroscuro lighting and psychological realism.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1571,
    deathYear: 1610,
    nationality: "Italian"
  },
  "Titian": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Titian_-_Self-Portrait_-_WGA22986.jpg/440px-Titian_-_Self-Portrait_-_WGA22986.jpg",
    bio: "Greatest Venetian Renaissance painter",
    bioFull: "Tiziano Vecelli (c.1488-1576) was the leader of the Venetian school, renowned for his mastery of color and revolutionary brushwork.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1488,
    deathYear: 1576,
    nationality: "Italian (Venetian)"
  },
  "Peter Paul Rubens": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg/440px-Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg",
    bio: "Baroque master of dynamic composition",
    bioFull: "Peter Paul Rubens (1577-1640) was the most influential Baroque painter, known for dramatic movement, rich color, and sensuous figures.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1577,
    deathYear: 1640,
    nationality: "Flemish"
  },
  // ---- P2 CLASSIC PAINTERS (Added) ----
  "Pierre-Auguste Renoir": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pierre-Auguste_Renoir_-_autoportrait_-_1875.jpg/440px-Pierre-Auguste_Renoir_-_autoportrait_-_1875.jpg",
    bio: "Impressionist master of joyful color",
    bioFull: "Pierre-Auguste Renoir (1841-1919) painted Dance at Le Moulin de la Galette and Luncheon of the Boating Party, celebrating life's pleasures.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1841,
    deathYear: 1919,
    nationality: "French"
  },
  "Camille Pissarro": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Camille_Pissarro_040.jpg/440px-Camille_Pissarro_040.jpg",
    bio: "Father figure of Impressionism",
    bioFull: "Camille Pissarro (1830-1903) was the only artist to exhibit in all eight Impressionist exhibitions, mentoring both Cézanne and Gauguin.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1830,
    deathYear: 1903,
    nationality: "French (Danish-Portuguese descent)"
  },
  "Paul Cézanne": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Paul_Cézanne_-_Self-portrait_-_Musée_d%27Orsay.jpg/440px-Paul_Cézanne_-_Self-portrait_-_Musée_d%27Orsay.jpg",
    bio: "Father of modern art, bridge to Cubism",
    bioFull: "Paul Cézanne (1839-1906) pioneered the transition from Impressionism to Cubism, directly influencing Picasso and Braque.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1839,
    deathYear: 1906,
    nationality: "French"
  },
  "Henri Matisse": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Henri_Matisse_1933_%28Photography_by_Carl_Van_Vechten%29.jpg/440px-Henri_Matisse_1933_%28Photography_by_Carl_Van_Vechten%29.jpg",
    bio: "Leader of Fauvism, master of color",
    bioFull: "Henri Matisse (1869-1954) led the Fauvist movement and revolutionized color in modern art with works like The Dance and his paper cut-outs.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1869,
    deathYear: 1954,
    nationality: "French"
  },
  "J.M.W. Turner": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Turner_selfportrait.jpg/440px-Turner_selfportrait.jpg",
    bio: "Romantic master of light and atmosphere",
    bioFull: "Joseph Mallord William Turner (1775-1851) pioneered atmospheric effects that prefigured Impressionism and directly influenced Claude Monet.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1775,
    deathYear: 1851,
    nationality: "British"
  },
  "Edward Hopper": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hopperphoto.jpg/440px-Hopperphoto.jpg",
    bio: "Painter of American solitude and light",
    bioFull: "Edward Hopper (1882-1967) depicted urban isolation in works like Nighthawks, influencing film noir and contemporary photography.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1882,
    deathYear: 1967,
    nationality: "American"
  },
  "Mark Rothko": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Rothko-photo.jpg/440px-Rothko-photo.jpg",
    bio: "Abstract Expressionist master of color fields",
    bioFull: "Mark Rothko (1903-1970) created luminous color field paintings designed to evoke profound emotional responses, directly influenced by Monet's Water Lilies.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1903,
    deathYear: 1970,
    nationality: "American (Latvian-born)"
  },
  // ---- P3 OLD MASTERS (Added) ----
  "Carel Fabritius": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Carel_Fabritius_-_Self-Portrait_-_WGA7721.jpg/440px-Carel_Fabritius_-_Self-Portrait_-_WGA7721.jpg",
    bio: "Rembrandt's pupil who taught Vermeer",
    bioFull: "Carel Fabritius (1622-1654) was Rembrandt's most gifted pupil and likely influenced Vermeer before his death in a gunpowder explosion.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1622,
    deathYear: 1654,
    nationality: "Dutch"
  },
  "Giambattista Tiepolo": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Giambattista_Tiepolo_-_Self-portrait_%28detail%29.jpg/440px-Giambattista_Tiepolo_-_Self-portrait_%28detail%29.jpg",
    bio: "Last great painter of the Italian Baroque",
    bioFull: "Giovanni Battista Tiepolo (1696-1770) created luminous frescoes across Europe, culminating the Venetian tradition begun by Veronese.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1696,
    deathYear: 1770,
    nationality: "Italian (Venetian)"
  },
  "Tintoretto": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Jacopo_Tintoretto_-_Self-Portrait_as_a_Young_Man_-_WGA22418.jpg/440px-Jacopo_Tintoretto_-_Self-Portrait_as_a_Young_Man_-_WGA22418.jpg",
    bio: "Venetian Mannerist master of drama",
    bioFull: "Tintoretto (1518-1594) combined Michelangelo's drawing with Titian's color, creating dramatic compositions in the Scuola Grande di San Rocco.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1518,
    deathYear: 1594,
    nationality: "Italian (Venetian)"
  },
  "Nicolas Poussin": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Nicolas_Poussin_078.jpg/440px-Nicolas_Poussin_078.jpg",
    bio: "Father of French Classical painting",
    bioFull: "Nicolas Poussin (1594-1665) established French Classicism and influenced David's Neoclassicism with his philosophical approach to history painting.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1594,
    deathYear: 1665,
    nationality: "French"
  },
  "Théodore Géricault": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Théodore_Géricault_-_Autoportrait.jpg/440px-Théodore_Géricault_-_Autoportrait.jpg",
    bio: "Pioneer of French Romanticism",
    bioFull: "Théodore Géricault (1791-1824) painted The Raft of the Medusa and directly influenced Delacroix before his early death at 32.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1791,
    deathYear: 1824,
    nationality: "French"
  },
  "Jean-Auguste-Dominique Ingres": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Ingres_-_Self-Portrait.jpg/440px-Ingres_-_Self-Portrait.jpg",
    bio: "Neoclassical master of line and form",
    bioFull: "Jean-Auguste-Dominique Ingres (1780-1867) was David's greatest pupil, becoming the champion of Neoclassicism against Delacroix's Romanticism.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1780,
    deathYear: 1867,
    nationality: "French"
  },
  "Giorgio Morandi": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Paolo_Monti_-_Servizio_fotografico_%28Bologna%2C_1953%29_-_BEIC_6361574.jpg/440px-Paolo_Monti_-_Servizio_fotografico_%28Bologna%2C_1953%29_-_BEIC_6361574.jpg",
    bio: "Master of contemplative still life",
    bioFull: "Giorgio Morandi (1890-1964) spent his career painting bottles and vases, creating meditative works that influenced minimalism and conceptual art.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1890,
    deathYear: 1964,
    nationality: "Italian"
  },
  // ---- P4 WRITERS/PHILOSOPHERS (Added) ----
  "Philip K. Dick": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Philip_K._Dick_%281965%29.jpg/440px-Philip_K._Dick_%281965%29.jpg",
    bio: "Visionary science fiction author",
    bioFull: "Philip K. Dick (1928-1982) wrote Do Androids Dream of Electric Sheep? (Blade Runner), The Man in the High Castle, and explored reality and identity.",
    careerPhase: "Peak",
    roleCategory: "writer",
    birthYear: 1928,
    deathYear: 1982,
    nationality: "American"
  },
  "Jorge Luis Borges": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg/440px-Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg",
    bio: "Master of metaphysical fiction",
    bioFull: "Jorge Luis Borges (1899-1986) wrote Ficciones and The Library of Babel, influencing Inception and countless narratives about dreams and infinity.",
    careerPhase: "Peak",
    roleCategory: "writer",
    birthYear: 1899,
    deathYear: 1986,
    nationality: "Argentine"
  },
  "Jean Baudrillard": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jean_Baudrillard_in_1987.jpg/440px-Jean_Baudrillard_in_1987.jpg",
    bio: "Philosopher of simulation and hyperreality",
    bioFull: "Jean Baudrillard (1929-2007) wrote Simulacra and Simulation, the philosophical foundation explicitly referenced in The Matrix.",
    careerPhase: "Peak",
    roleCategory: "philosopher",
    birthYear: 1929,
    deathYear: 2007,
    nationality: "French"
  },
  "M.C. Escher": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Escher.jpg/440px-Escher.jpg",
    bio: "Master of impossible architecture",
    bioFull: "M.C. Escher (1898-1972) created mathematically inspired impossible structures that directly influenced Inception's dream architecture.",
    careerPhase: "Peak",
    roleCategory: "artist",
    birthYear: 1898,
    deathYear: 1972,
    nationality: "Dutch"
  },
  "Philip Glass": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Philip_Glass_1.jpg/440px-Philip_Glass_1.jpg",
    bio: "Minimalist composer who revolutionized film scores",
    bioFull: "Philip Glass (b. 1937) pioneered minimalist composition and influenced film scoring with works like Koyaanisqatsi and The Hours.",
    careerPhase: "Late",
    roleCategory: "composer",
    birthYear: 1937,
    nationality: "American"
  },
  "Tracy Chevalier": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Tracy_Chevalier_at_Humber_Mouth_2014.jpg/440px-Tracy_Chevalier_at_Humber_Mouth_2014.jpg",
    bio: "Author of Girl with a Pearl Earring",
    bioFull: "Tracy Chevalier (b. 1962) wrote the bestselling novel Girl with a Pearl Earring, imagining the story behind Vermeer's famous painting.",
    careerPhase: "Peak",
    roleCategory: "writer",
    birthYear: 1962,
    nationality: "American-British"
  },
  "Richard Avedon": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Richard_Avedon%2C_Photographer.jpg/440px-Richard_Avedon%2C_Photographer.jpg",
    bio: "Revolutionary fashion and portrait photographer",
    bioFull: "Richard Avedon (1923-2004) transformed fashion photography and created iconic portraits, influenced by Vermeer's direct gaze and psychological intimacy.",
    careerPhase: "Peak",
    roleCategory: "photographer",
    birthYear: 1923,
    deathYear: 2004,
    nationality: "American"
  },
  // ---- P5 HARDER TO SOURCE (Added where possible) ----
  "Kenji Miyazawa": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kenji_Miyazawa_in_1918.jpg/440px-Kenji_Miyazawa_in_1918.jpg",
    bio: "Japanese poet and author who inspired Ghibli",
    bioFull: "Kenji Miyazawa (1896-1933) wrote Night on the Galactic Railroad, inspiring Studio Ghibli's philosophical approach to storytelling.",
    careerPhase: "Peak",
    roleCategory: "writer",
    birthYear: 1896,
    deathYear: 1933,
    nationality: "Japanese"
  },

  // ---- ANIME/FILM DIRECTORS ----
  "Hayao Miyazaki": {
    image: "https://image.tmdb.org/t/p/w500/ouhjt9KugzhWtdEyBPipihB3ic8.jpg",
    bio: "Co-founder of Studio Ghibli, master of hand-drawn animation",
    bioFull: "Hayao Miyazaki (b. 1941) revolutionized animated filmmaking with environmental themes and hand-crafted artistry that influenced animation worldwide.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1941,
    nationality: "Japanese"
  },
  "Satoshi Kon": {
    image: "https://image.tmdb.org/t/p/w500/b7Oqg1bjS0e2iEzEjYWnsyVVagt.jpg",
    bio: "Visionary director of reality-bending anime",
    bioFull: "Satoshi Kon (1963-2010) created mind-bending narratives that influenced Hollywood filmmakers including Christopher Nolan and Darren Aronofsky.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1963,
    deathYear: 2010,
    nationality: "Japanese"
  },
  "Mamoru Oshii": {
    image: "https://image.tmdb.org/t/p/w500/2eDakuSsipmgku9MtGcZf244Hv4.jpg",
    bio: "Director of Ghost in the Shell, father of cyberpunk anime",
    bioFull: "Mamoru Oshii (b. 1951) directed the 1995 Ghost in the Shell, directly inspiring The Matrix and modern cyberpunk cinema.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1951,
    nationality: "Japanese"
  },
  "Lana Wachowski & Lilly Wachowski": {
    image: "https://image.tmdb.org/t/p/w500/5KuRHnoH8UkSCFHMKf4YjKOvzOM.jpg",
    bio: "Creators of The Matrix, pioneers of philosophical action cinema",
    bioFull: "The Wachowskis created The Matrix trilogy, blending Hong Kong action cinema with philosophy to revolutionize Hollywood filmmaking.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1965,
    nationality: "American"
  },
  "Quentin Tarantino": {
    image: "https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg",
    bio: "Genre-blending auteur known for dialogue and violence",
    bioFull: "Quentin Tarantino (b. 1963) revitalized independent cinema with his distinctive dialogue, nonlinear storytelling, and genre homages.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1963,
    nationality: "American"
  },
  "Christopher Nolan": {
    image: "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    bio: "Master of cerebral blockbusters and practical effects",
    bioFull: "Christopher Nolan (b. 1970) pioneered a new form of intellectual blockbuster, known for complex narratives and commitment to practical filmmaking.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1970,
    nationality: "British-American"
  },
  "Toshiya Fujita": {
    image: "https://image.tmdb.org/t/p/w500/nDN3vOnBFQfGTLz5rUDHFVLFXmP.jpg",
    bio: "Director of Lady Snowblood, influence on Tarantino",
    bioFull: "Toshiya Fujita (1932-1997) directed Lady Snowblood, the stylish revenge film that directly inspired Kill Bill.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1932,
    deathYear: 1997,
    nationality: "Japanese"
  },
  "McG": {
    image: "https://image.tmdb.org/t/p/w500/1wPMa3uFmRz9Yr3VJJsLFCWPW4x.jpg",
    bio: "Music video director turned blockbuster filmmaker",
    bioFull: "Joseph McGinty Nichol (b. 1968) transitioned from music videos to direct the Charlie's Angels films, bringing Hong Kong action to Hollywood comedy.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1968,
    nationality: "American"
  },
  "Lee Unkrich": {
    image: "https://image.tmdb.org/t/p/w500/6VLbgcVrQPHHgcjqc4iiLm6UZUP.jpg",
    bio: "Pixar director of Toy Story 3 and Coco",
    bioFull: "Lee Unkrich (b. 1967) directed Pixar's Coco, a groundbreaking celebration of Mexican culture that won two Academy Awards.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1967,
    nationality: "American"
  },
  "Adrian Molina": {
    image: "https://image.tmdb.org/t/p/w500/nH6lGEPmPfLjEvzCJ8p7CUrw4xb.jpg",
    bio: "Co-director and writer of Coco",
    bioFull: "Adrian Molina (b. 1985) co-directed Coco and wrote its Oscar-winning screenplay, bringing authentic Mexican representation to Pixar.",
    careerPhase: "Early",
    roleCategory: "director",
    birthYear: 1985,
    nationality: "American (Mexican heritage)"
  },
  "Toshio Suzuki": {
    image: "https://image.tmdb.org/t/p/w500/vM2YLFnXwMJOwnZNnCKsU5lXHey.jpg",
    bio: "Studio Ghibli producer and co-founder",
    bioFull: "Toshio Suzuki (b. 1948) has produced nearly every Studio Ghibli film since 1989, shaping the studio's global success.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1948,
    nationality: "Japanese"
  },
  "Chad Stahelski": {
    image: "https://image.tmdb.org/t/p/w500/xEBFnRJqEyjVXxGJv10h3nJVQjm.jpg",
    bio: "Former stuntman turned director of John Wick",
    bioFull: "Chad Stahelski (b. 1968) worked as Keanu Reeves' stunt double before directing the John Wick franchise, revolutionizing action choreography.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1968,
    nationality: "American"
  },
  "David Leitch": {
    image: "https://image.tmdb.org/t/p/w500/jJeOuwQTrlHjhZYGLNflCi2Odqd.jpg",
    bio: "Co-director of John Wick, action cinema visionary",
    bioFull: "David Leitch (b. 1975) co-directed John Wick and went on to direct Atomic Blonde, Deadpool 2, and Bullet Train.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1975,
    nationality: "American"
  },
  // ---- P1 FILMMAKERS (Added) ----
  "Isao Takahata": {
    image: "https://image.tmdb.org/t/p/w500/qbvnGLByh0N9ni7gZSREIgvO1sM.jpg",
    bio: "Studio Ghibli co-founder, master of emotional realism",
    bioFull: "Isao Takahata (1935-2018) co-founded Studio Ghibli and directed Grave of the Fireflies, The Tale of the Princess Kaguya, and Only Yesterday.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1935,
    deathYear: 2018,
    nationality: "Japanese"
  },
  "Stanley Kubrick": {
    image: "https://image.tmdb.org/t/p/w500/yFT0VyIelI9aegZrsAwOG5iVP4v.jpg",
    bio: "Visionary perfectionist who redefined cinema",
    bioFull: "Stanley Kubrick (1928-1999) directed 2001: A Space Odyssey, A Clockwork Orange, The Shining, and other masterpieces that influenced generations of filmmakers.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1928,
    deathYear: 1999,
    nationality: "American-British"
  },
  "Ridley Scott": {
    image: "https://image.tmdb.org/t/p/w500/zABJmN9opmqD4orWl3KSdCaSo7Q.jpg",
    bio: "Creator of Blade Runner and Alien",
    bioFull: "Ridley Scott (b. 1937) directed Blade Runner and Alien, defining the visual language of science fiction cinema.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1937,
    nationality: "British"
  },
  "John Woo": {
    image: "https://image.tmdb.org/t/p/w500/oRyQ1k5JqSFoZC1CyHeOiuqVnIF.jpg",
    bio: "Master of Hong Kong action cinema",
    bioFull: "John Woo (b. 1946) revolutionized action filmmaking with heroic bloodshed films like The Killer and Hard Boiled, directly influencing The Matrix and Kill Bill.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1946,
    nationality: "Hong Kong Chinese"
  },
  "Sergio Leone": {
    image: "https://image.tmdb.org/t/p/w500/2576qoW8l9Z1nKGM10ar60aIwUu.jpg",
    bio: "Father of the Spaghetti Western",
    bioFull: "Sergio Leone (1929-1989) created the Spaghetti Western genre with The Good, The Bad and The Ugly and Once Upon a Time in the West.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1929,
    deathYear: 1989,
    nationality: "Italian"
  },
  "Brian De Palma": {
    image: "https://image.tmdb.org/t/p/w500/bWjOPDt8HRww5VAtpZ5FiCxpIxu.jpg",
    bio: "Master of suspense and Hitchcockian homage",
    bioFull: "Brian De Palma (b. 1940) directed Scarface, The Untouchables, and Carrie, known for split-screen techniques and stylized violence.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1940,
    nationality: "American"
  },
  "Federico Fellini": {
    image: "https://image.tmdb.org/t/p/w500/r0GTpMWUrxgPRbMmv38mNggOBvA.jpg",
    bio: "Italian maestro of dreamlike cinema",
    bioFull: "Federico Fellini (1920-1993) created 8½, La Dolce Vita, and other dreamlike masterpieces that influenced Satoshi Kon's reality-bending narratives.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1920,
    deathYear: 1993,
    nationality: "Italian"
  },
  "Paul Grimault": {
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Paul_Grimault_en_1961.jpg",
    bio: "French animation pioneer who inspired Miyazaki",
    bioFull: "Paul Grimault (1905-1994) created The King and the Mockingbird, the animated film that directly inspired Hayao Miyazaki's career.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1905,
    deathYear: 1994,
    nationality: "French"
  },
  "Darren Aronofsky": {
    image: "https://image.tmdb.org/t/p/w500/tOjz8mVI2HeQBvU6KNjIExMBsXL.jpg",
    bio: "Visionary director of psychological thrillers",
    bioFull: "Darren Aronofsky (b. 1969) directed Requiem for a Dream, Black Swan, and The Wrestler. Satoshi Kon's Perfect Blue heavily influenced his work.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1969,
    nationality: "American"
  },

  // ---- COMPOSERS ----
  "Joe Hisaishi": {
    image: "https://image.tmdb.org/t/p/w500/dVxq90QHGMKBI3RpZYJlBVM59Nt.jpg",
    bio: "Studio Ghibli's iconic composer",
    bioFull: "Joe Hisaishi (b. 1950) has scored every major Miyazaki film since Nausicaa (1984), creating some of cinema's most beloved themes.",
    careerPhase: "Peak",
    roleCategory: "composer",
    birthYear: 1950,
    nationality: "Japanese"
  },
  "Hans Zimmer": {
    image: "https://image.tmdb.org/t/p/w500/tpQnDeHY15szIXvpnhlprufz4d.jpg",
    bio: "Hollywood's most influential film composer",
    bioFull: "Hans Zimmer (b. 1957) pioneered electronic film scoring and defined blockbuster sound from The Lion King to Inception to Dune.",
    careerPhase: "Peak",
    roleCategory: "composer",
    birthYear: 1957,
    nationality: "German-American"
  },
  "Kenji Kawai": {
    image: "https://image.tmdb.org/t/p/w500/67mWLdRPl4C4YzKjALy7M3uc3qL.jpg",
    bio: "Ghost in the Shell composer, blending tradition and electronics",
    bioFull: "Kenji Kawai (b. 1957) created the haunting choral theme for Ghost in the Shell, mixing ancient Japanese vocals with electronic soundscapes.",
    careerPhase: "Peak",
    roleCategory: "composer",
    birthYear: 1957,
    nationality: "Japanese"
  },
  "Susumu Hirasawa": {
    image: "https://image.tmdb.org/t/p/w500/yH0HWBqKwO0TLwL0UmvDlnVhyse.jpg",
    bio: "Electronic pioneer who scored Paprika",
    bioFull: "Susumu Hirasawa (b. 1954) collaborated with Satoshi Kon on multiple films, creating distinctive electronic scores for Paprika and Millennium Actress.",
    careerPhase: "Peak",
    roleCategory: "composer",
    birthYear: 1954,
    nationality: "Japanese"
  },
  "Michael Giacchino": {
    image: "https://image.tmdb.org/t/p/w500/bLVsQnP8u9HmXFN2sdxQJ2sAL9S.jpg",
    bio: "Oscar-winning Pixar and Marvel composer",
    bioFull: "Michael Giacchino (b. 1967) won the Oscar for Up and has scored everything from Coco to the MCU Spider-Man films.",
    careerPhase: "Peak",
    roleCategory: "composer",
    birthYear: 1967,
    nationality: "American"
  },

  // ---- ACTORS ----
  "Keanu Reeves": {
    image: "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",
    bio: "Action icon from The Matrix to John Wick",
    bioFull: "Keanu Reeves (b. 1964) reinvented himself twice as an action star, first with The Matrix and later with John Wick.",
    careerPhase: "Late",
    roleCategory: "actor",
    birthYear: 1964,
    nationality: "Canadian"
  },
  "Leonardo DiCaprio": {
    image: "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
    bio: "Oscar-winning actor and environmental activist",
    bioFull: "Leonardo DiCaprio (b. 1974) evolved from teen idol to Oscar-winning dramatic actor while championing climate activism.",
    careerPhase: "Peak",
    roleCategory: "actor",
    birthYear: 1974,
    nationality: "American"
  },
  "Uma Thurman": {
    image: "https://image.tmdb.org/t/p/w500/lg04iEqT6TC40H1jz10Z99OFMXx.jpg",
    bio: "Muse of Tarantino, The Bride in Kill Bill",
    bioFull: "Uma Thurman (b. 1970) became an icon of female action cinema through her collaboration with Quentin Tarantino on Pulp Fiction and Kill Bill.",
    careerPhase: "Peak",
    roleCategory: "actor",
    birthYear: 1970,
    nationality: "American"
  },
  "Cameron Diaz": {
    image: "https://image.tmdb.org/t/p/w500/d4f4cQ9EiYuvNMjT1IB2h06KoRx.jpg",
    bio: "Comedy star who led Charlie's Angels",
    bioFull: "Cameron Diaz (b. 1972) transitioned from model to one of Hollywood's highest-paid actresses, known for comedies and action roles.",
    careerPhase: "Retired",
    roleCategory: "actor",
    birthYear: 1972,
    nationality: "American"
  },
  "Drew Barrymore": {
    image: "https://image.tmdb.org/t/p/w500/9xMu2GLC5otUcC11sEWC5aEAERQ.jpg",
    bio: "Child star turned producer and talk show host",
    bioFull: "Drew Barrymore (b. 1975) produced Charlie's Angels and rebuilt her career from child star to Hollywood power player.",
    careerPhase: "Late",
    roleCategory: "actor",
    birthYear: 1975,
    nationality: "American"
  },
  "Lucy Liu": {
    image: "https://image.tmdb.org/t/p/w500/9nbtjqsx3De7hO2XDtrBQ7M9VCH.jpg",
    bio: "Action star from Charlie's Angels to Kill Bill",
    bioFull: "Lucy Liu (b. 1968) broke barriers for Asian-American actresses in Hollywood action cinema with Charlie's Angels and Kill Bill.",
    careerPhase: "Peak",
    roleCategory: "actor",
    birthYear: 1968,
    nationality: "American"
  },
  "Sonny Chiba": {
    image: "https://image.tmdb.org/t/p/w500/e1gZR5W5dz3N2vRrmLfYqtbV5J9.jpg",
    bio: "Legendary Japanese martial arts actor",
    bioFull: "Sonny Chiba (1939-2021) was a martial arts legend who appeared in Kill Bill as the master swordmaker Hattori Hanzo.",
    careerPhase: "Late",
    roleCategory: "actor",
    birthYear: 1939,
    deathYear: 2021,
    nationality: "Japanese"
  },
  "Meiko Kaji": {
    image: "https://image.tmdb.org/t/p/w500/vX5QZ9oyncMWL6zyhhVycepN4tm.jpg",
    bio: "Star of Lady Snowblood, inspiration for Kill Bill",
    bioFull: "Meiko Kaji (b. 1947) starred in Lady Snowblood and Female Prisoner Scorpion, directly inspiring Uma Thurman's character in Kill Bill.",
    careerPhase: "Retired",
    roleCategory: "actor",
    birthYear: 1947,
    nationality: "Japanese"
  },
  "Gael Garcia Bernal": {
    image: "https://image.tmdb.org/t/p/w500/d8xwEYVpvwrU5KIV6G0DRzljV4C.jpg",
    bio: "Mexican actor and voice of Hector in Coco",
    bioFull: "Gael Garcia Bernal (b. 1978) is a leading figure in Mexican cinema who voiced Hector in Pixar's Coco.",
    careerPhase: "Peak",
    roleCategory: "actor",
    birthYear: 1978,
    nationality: "Mexican"
  },
  "Anthony Gonzalez": {
    image: "https://image.tmdb.org/t/p/w500/WF7bn6t0LkxwBWyDMWvomVujn7.jpg",
    bio: "Child actor who voiced Miguel in Coco",
    bioFull: "Anthony Gonzalez (b. 2004) voiced Miguel in Coco at age 12, bringing authentic Mexican-American perspective to the role.",
    careerPhase: "Early",
    roleCategory: "actor",
    birthYear: 2004,
    nationality: "American (Mexican heritage)"
  },

  // ---- MANGA/WRITERS ----
  "Masamune Shirow": {
    image: "https://image.tmdb.org/t/p/w500/tRH09KwtBBWuMTDqK3NhP6pPJAA.jpg",
    bio: "Creator of the Ghost in the Shell manga",
    bioFull: "Masamune Shirow (b. 1961) created the Ghost in the Shell manga that spawned the anime and inspired The Matrix.",
    careerPhase: "Retired",
    roleCategory: "artist",
    birthYear: 1961,
    nationality: "Japanese"
  },
  "Kazuo Koike": {
    image: "https://image.tmdb.org/t/p/w500/yY5OYmhkVdVjK14kBgdXpGwDSWu.jpg",
    bio: "Creator of Lone Wolf and Cub and Lady Snowblood",
    bioFull: "Kazuo Koike (1936-2019) wrote influential manga including Lady Snowblood, which directly inspired Tarantino's Kill Bill.",
    careerPhase: "Late",
    roleCategory: "artist",
    birthYear: 1936,
    deathYear: 2019,
    nationality: "Japanese"
  },
  "Yasutaka Tsutsui": {
    image: "https://image.tmdb.org/t/p/w500/qH1m0YqKTBM7EjwWN7fLVkXYKgB.jpg",
    bio: "Novelist who wrote the original Paprika",
    bioFull: "Yasutaka Tsutsui (b. 1934) pioneered Japanese science fiction and wrote the 1993 novel that Satoshi Kon adapted into Paprika.",
    careerPhase: "Late",
    roleCategory: "artist",
    birthYear: 1934,
    nationality: "Japanese"
  },

  // ---- CHOREOGRAPHERS ----
  "Yuen Woo-ping": {
    image: "https://image.tmdb.org/t/p/w500/nt4PoK0YRdKlLPY3P1EgcWPdXmU.jpg",
    bio: "Legendary martial arts choreographer of The Matrix and Kill Bill",
    bioFull: "Yuen Woo-ping (b. 1945) brought Hong Kong wire-fu to Hollywood, choreographing The Matrix, Crouching Tiger, and Kill Bill.",
    careerPhase: "Late",
    roleCategory: "director",
    birthYear: 1945,
    nationality: "Hong Kong Chinese"
  },
  "Yuen Cheung-Yan": {
    image: "https://image.tmdb.org/t/p/w500/nQD8WqVbvIlrJ47HNPL9c91AZtj.jpg",
    bio: "Martial arts choreographer of Charlie's Angels",
    bioFull: "Yuen Cheung-Yan choreographed Charlie's Angels after his brother Yuen Woo-ping's success with The Matrix.",
    careerPhase: "Peak",
    roleCategory: "director",
    birthYear: 1950,
    nationality: "Hong Kong Chinese"
  },

  // ---- HISTORICAL FIGURES ----
  "Camille Doncieux": {
    image: "https://www.wga.hu/art/m/monet/01/003monet.jpg",
    bio: "Monet's first wife and frequent model",
    bioFull: "Camille Doncieux (1847-1879) was Monet's first wife and favorite model until her death from tuberculosis at age 32.",
    careerPhase: "Peak",
    roleCategory: "other",
    birthYear: 1847,
    deathYear: 1879,
    nationality: "French"
  }
};

// ==========================================
// LEGACY IMAGE MAP - For backward compatibility
// ==========================================
const CREATOR_IMAGES = {
  // ==========================================
  // CLASSIC PAINTERS - Self-Portraits from WGA
  // ==========================================

  // Johannes Vermeer - The Procuress (supposed self-portrait)
  "Johannes Vermeer": "https://www.wga.hu/art/v/vermeer/10histor/01procur.jpg",

  // Eugène Delacroix - Self-Portrait c.1837
  "Eugène Delacroix": "https://www.wga.hu/art/d/delacroix/1/selfport.jpg",

  // Jacques-Louis David - Self-Portrait 1794
  "Jacques-Louis David": "https://www.wga.hu/art/d/david_j/4/400david.jpg",

  // Jean-Baptiste-Siméon Chardin - Self-Portrait with Spectacles 1771
  "Jean-Baptiste-Siméon Chardin": "https://www.wga.hu/art/c/chardin/3/selfport.jpg",

  // Claude Monet - Photo by Nadar 1899
  "Claude Monet": "https://www.wga.hu/art/m/monet/zzzmonet.jpg",

  // Eugène Boudin - Portrait photo
  "Eugène Boudin": "https://www.wga.hu/art/b/boudin/zzzboudin.jpg",

  // Paolo Veronese - Self-Portrait
  "Paolo Veronese": "https://www.wga.hu/art/v/veronese/11self.jpg",

  // Blanche Hoschedé Monet - Use painting of her
  "Blanche Hoschedé Monet": "https://www.wga.hu/art/m/monet/05/518monet.jpg",

  // ==========================================
  // ANIME/FILM DIRECTORS - TMDB
  // ==========================================

  // Hayao Miyazaki
  "Hayao Miyazaki": "https://image.tmdb.org/t/p/w500/ouhjt9KugzhWtdEyBPipihB3ic8.jpg",

  // Satoshi Kon
  "Satoshi Kon": "https://image.tmdb.org/t/p/w500/b7Oqg1bjS0e2iEzEjYWnsyVVagt.jpg",

  // Mamoru Oshii - Ghost in the Shell director
  "Mamoru Oshii": "https://image.tmdb.org/t/p/w500/2eDakuSsipmgku9MtGcZf244Hv4.jpg",

  // Lana Wachowski
  "Lana Wachowski & Lilly Wachowski": "https://image.tmdb.org/t/p/w500/5KuRHnoH8UkSCFHMKf4YjKOvzOM.jpg",

  // Quentin Tarantino
  "Quentin Tarantino": "https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg",

  // Christopher Nolan
  "Christopher Nolan": "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",

  // Toshiya Fujita - Lady Snowblood director
  "Toshiya Fujita": "https://image.tmdb.org/t/p/w500/nDN3vOnBFQfGTLz5rUDHFVLFXmP.jpg",

  // McG - Charlie's Angels director
  "McG": "https://image.tmdb.org/t/p/w500/1wPMa3uFmRz9Yr3VJJsLFCWPW4x.jpg",

  // Lee Unkrich - Coco director
  "Lee Unkrich": "https://image.tmdb.org/t/p/w500/6VLbgcVrQPHHgcjqc4iiLm6UZUP.jpg",

  // Adrian Molina - Coco co-director/writer
  "Adrian Molina": "https://image.tmdb.org/t/p/w500/nH6lGEPmPfLjEvzCJ8p7CUrw4xb.jpg",

  // Toshio Suzuki - Studio Ghibli producer
  "Toshio Suzuki": "https://image.tmdb.org/t/p/w500/vM2YLFnXwMJOwnZNnCKsU5lXHey.jpg",

  // Chad Stahelski - John Wick director
  "Chad Stahelski": "https://image.tmdb.org/t/p/w500/xEBFnRJqEyjVXxGJv10h3nJVQjm.jpg",

  // David Leitch
  "David Leitch": "https://image.tmdb.org/t/p/w500/jJeOuwQTrlHjhZYGLNflCi2Odqd.jpg",

  // ==========================================
  // COMPOSERS - TMDB
  // ==========================================

  // Joe Hisaishi - Studio Ghibli composer
  "Joe Hisaishi": "https://image.tmdb.org/t/p/w500/dVxq90QHGMKBI3RpZYJlBVM59Nt.jpg",

  // Hans Zimmer
  "Hans Zimmer": "https://image.tmdb.org/t/p/w500/tpQnDeHY15szIXvpnhlprufz4d.jpg",

  // Kenji Kawai - Ghost in the Shell composer
  "Kenji Kawai": "https://image.tmdb.org/t/p/w500/67mWLdRPl4C4YzKjALy7M3uc3qL.jpg",

  // Susumu Hirasawa - Paprika composer
  "Susumu Hirasawa": "https://image.tmdb.org/t/p/w500/yH0HWBqKwO0TLwL0UmvDlnVhyse.jpg",

  // Michael Giacchino - Coco composer
  "Michael Giacchino": "https://image.tmdb.org/t/p/w500/bLVsQnP8u9HmXFN2sdxQJ2sAL9S.jpg",

  // ==========================================
  // ACTORS - HOLLYWOOD - TMDB
  // ==========================================

  // Keanu Reeves
  "Keanu Reeves": "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",

  // Leonardo DiCaprio
  "Leonardo DiCaprio": "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",

  // Uma Thurman
  "Uma Thurman": "https://image.tmdb.org/t/p/w500/lg04iEqT6TC40H1jz10Z99OFMXx.jpg",

  // Cameron Diaz
  "Cameron Diaz": "https://image.tmdb.org/t/p/w500/d4f4cQ9EiYuvNMjT1IB2h06KoRx.jpg",

  // Drew Barrymore
  "Drew Barrymore": "https://image.tmdb.org/t/p/w500/9xMu2GLC5otUcC11sEWC5aEAERQ.jpg",

  // Lucy Liu
  "Lucy Liu": "https://image.tmdb.org/t/p/w500/9nbtjqsx3De7hO2XDtrBQ7M9VCH.jpg",

  // Sonny Chiba
  "Sonny Chiba": "https://image.tmdb.org/t/p/w500/e1gZR5W5dz3N2vRrmLfYqtbV5J9.jpg",

  // ==========================================
  // ACTORS - JAPANESE - TMDB
  // ==========================================

  // Meiko Kaji - Lady Snowblood actress
  "Meiko Kaji": "https://image.tmdb.org/t/p/w500/vX5QZ9oyncMWL6zyhhVycepN4tm.jpg",

  // ==========================================
  // ACTORS - LATIN AMERICAN - TMDB
  // ==========================================

  // Gael Garcia Bernal
  "Gael Garcia Bernal": "https://image.tmdb.org/t/p/w500/d8xwEYVpvwrU5KIV6G0DRzljV4C.jpg",

  // Anthony Gonzalez (voice of Miguel in Coco)
  "Anthony Gonzalez": "https://image.tmdb.org/t/p/w500/WF7bn6t0LkxwBWyDMWvomVujn7.jpg",

  // ==========================================
  // MANGA ARTISTS / WRITERS - TMDB
  // ==========================================

  // Masamune Shirow - Ghost in the Shell manga creator
  "Masamune Shirow": "https://image.tmdb.org/t/p/w500/tRH09KwtBBWuMTDqK3NhP6pPJAA.jpg",

  // Kazuo Koike - Lady Snowblood manga writer
  "Kazuo Koike": "https://image.tmdb.org/t/p/w500/yY5OYmhkVdVjK14kBgdXpGwDSWu.jpg",

  // Yasutaka Tsutsui - Paprika novelist
  "Yasutaka Tsutsui": "https://image.tmdb.org/t/p/w500/qH1m0YqKTBM7EjwWN7fLVkXYKgB.jpg",

  // Kazuo Kamimura - Lady Snowblood manga artist
  "Kazuo Kamimura": "https://image.tmdb.org/t/p/w500/kRH09KwtBBWuMTDqK3NhP6pPJAA.jpg",

  // ==========================================
  // ACTION CHOREOGRAPHERS - TMDB
  // ==========================================

  // Yuen Woo-ping - The Matrix choreographer
  "Yuen Woo-ping": "https://image.tmdb.org/t/p/w500/nt4PoK0YRdKlLPY3P1EgcWPdXmU.jpg",

  // Yuen Cheung-Yan
  "Yuen Cheung-Yan": "https://image.tmdb.org/t/p/w500/nQD8WqVbvIlrJ47HNPL9c91AZtj.jpg",

  // ==========================================
  // VISUAL EFFECTS / ARTISTS - TMDB
  // ==========================================

  // John Gaeta - Matrix VFX
  "John Gaeta": "https://image.tmdb.org/t/p/w500/4P9xyA3xHPLW2VmOCFPMsE7g8zP.jpg",

  // Derek Kolstad - John Wick screenwriter
  "Derek Kolstad": "https://image.tmdb.org/t/p/w500/hQ4u3U8BcnP1M4pjd1cFj77lBTz.jpg",

  // Kazuo Oga - Studio Ghibli background artist (no photo available)
  // "Kazuo Oga": null,

  // ==========================================
  // HISTORICAL FIGURES - WGA
  // ==========================================

  // Camille Doncieux - Monet's first wife (use Monet's painting of her)
  "Camille Doncieux": "https://www.wga.hu/art/m/monet/01/003monet.jpg",

  // Georges Clemenceau - French statesman
  "Georges Clemenceau": "https://www.wga.hu/art/m/manet/1/closup5a.jpg",

  // Louis Leroy - Art critic (no period photo available)
  // "Louis Leroy": null,

  // ==========================================
  // CLASSIC PAINTERS (for seeded artworks)
  // ==========================================

  // Vincent van Gogh - Self-Portrait (1889)
  "Vincent van Gogh": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg",

  // Sandro Botticelli - Portrait by Filippino Lippi
  "Sandro Botticelli": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sandro_Botticelli_083.jpg/440px-Sandro_Botticelli_083.jpg",

  // Leonardo da Vinci - Self-Portrait (c. 1512)
  "Leonardo da Vinci": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/440px-Leonardo_self.jpg",

  // Rembrandt van Rijn - Self-Portrait (1669)
  "Rembrandt": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/440px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg",

  // Diego Velázquez - Self-Portrait from Las Meninas
  "Diego Velázquez": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Diego_Velazquez_Autorretrato_45_x_38_cm_-_Colección_Real_Academia_de_Bellas_Artes_de_San_Fernand.jpg/440px-Diego_Velazquez_Autorretrato_45_x_38_cm_-_Colección_Real_Academia_de_Bellas_Artes_de_San_Fernand.jpg",

  // Édouard Manet - Self-Portrait with Palette (1879)
  "Édouard Manet": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Edouard_Manet_-_Selbstportrait.jpg/440px-Edouard_Manet_-_Selbstportrait.jpg",

  // Pablo Picasso - Photo (1908)
  "Pablo Picasso": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pablo_picasso_1.jpg/440px-Pablo_picasso_1.jpg",

  // Salvador Dalí - Photo (1934)
  "Salvador Dalí": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Salvador_Dalí_1939.jpg/440px-Salvador_Dalí_1939.jpg",

  // Hieronymus Bosch - Portrait engraving
  "Hieronymus Bosch": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Jheronimus_Bosch_%28cropped%29.jpg/440px-Jheronimus_Bosch_%28cropped%29.jpg",

  // John Singer Sargent - Self-Portrait (1906)
  "John Singer Sargent": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/John_Singer_Sargent_-_Self-portrait_%281906%29%2C_Uffizi.jpg/440px-John_Singer_Sargent_-_Self-portrait_%281906%29%2C_Uffizi.jpg",

  // Michelangelo - Portrait by Daniele da Volterra
  "Michelangelo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Miguel_Ángel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg/440px-Miguel_Ángel%2C_por_Daniele_da_Volterra_%28detalle%29.jpg",

  // Raphael - Self-Portrait (c. 1504)
  "Raphael": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Raffaello_Sanzio.jpg/440px-Raffaello_Sanzio.jpg",

  // Caravaggio - Self-Portrait as Bacchus
  "Caravaggio": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bild-Ottavio_Leoni%2C_Caravaggio.jpg/440px-Bild-Ottavio_Leoni%2C_Caravaggio.jpg",

  // Titian - Self-Portrait (c. 1567)
  "Titian": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Titian_-_Self-Portrait_-_WGA22986.jpg/440px-Titian_-_Self-Portrait_-_WGA22986.jpg",

  // Peter Paul Rubens - Self-Portrait (1623)
  "Peter Paul Rubens": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg/440px-Peter_Paul_Rubens_-_Self-Portrait_-_WGA20380.jpg",

  // ==========================================
  // P1 FILMMAKERS (Added) - Verified TMDB URLs
  // ==========================================
  "Isao Takahata": "https://image.tmdb.org/t/p/w500/qbvnGLByh0N9ni7gZSREIgvO1sM.jpg",
  "Stanley Kubrick": "https://image.tmdb.org/t/p/w500/yFT0VyIelI9aegZrsAwOG5iVP4v.jpg",
  "Ridley Scott": "https://image.tmdb.org/t/p/w500/zABJmN9opmqD4orWl3KSdCaSo7Q.jpg",
  "John Woo": "https://image.tmdb.org/t/p/w500/oRyQ1k5JqSFoZC1CyHeOiuqVnIF.jpg",
  "Sergio Leone": "https://image.tmdb.org/t/p/w500/2576qoW8l9Z1nKGM10ar60aIwUu.jpg",
  "Brian De Palma": "https://image.tmdb.org/t/p/w500/bWjOPDt8HRww5VAtpZ5FiCxpIxu.jpg",
  "Federico Fellini": "https://image.tmdb.org/t/p/w500/r0GTpMWUrxgPRbMmv38mNggOBvA.jpg",
  "Paul Grimault": "https://upload.wikimedia.org/wikipedia/commons/9/96/Paul_Grimault_en_1961.jpg",
  "Darren Aronofsky": "https://image.tmdb.org/t/p/w500/tOjz8mVI2HeQBvU6KNjIExMBsXL.jpg",

  // ==========================================
  // P2 CLASSIC PAINTERS (Added) - Verified Wikipedia API URLs
  // ==========================================
  "Pierre-Auguste Renoir": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Pierre_Auguste_Renoir%2C_uncropped_image.jpg/500px-Pierre_Auguste_Renoir%2C_uncropped_image.jpg",
  "Camille Pissarro": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pissarro-portrait.jpg/500px-Pissarro-portrait.jpg",
  "Paul Cézanne": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Paul-Cezanne.jpg",
  "Henri Matisse": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Henri_Matisse%2C_1913%2C_photograph_by_Alvin_Langdon_Coburn.jpg/500px-Henri_Matisse%2C_1913%2C_photograph_by_Alvin_Langdon_Coburn.jpg",
  "J.M.W. Turner": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Joseph_Mallord_William_Turner_auto-retrato.jpg/500px-Joseph_Mallord_William_Turner_auto-retrato.jpg",
  "Edward Hopper": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg/500px-Edward_Hopper%2C_New_York_artist_LCCN2016871478_%28cropped%29.jpg",
  "Mark Rothko": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Consuelo_Kanaga%2C_Mark_Rothko%2C_Yorktown_Heights%2C_ca._1949.jpg/500px-Consuelo_Kanaga%2C_Mark_Rothko%2C_Yorktown_Heights%2C_ca._1949.jpg",

  // ==========================================
  // P3 OLD MASTERS (Added) - Verified Wikipedia API URLs
  // ==========================================
  "Carel Fabritius": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Carel_Fabritius_-_Self-Portrait_-_Google_Art_Project.jpg/500px-Carel_Fabritius_-_Self-Portrait_-_Google_Art_Project.jpg",
  "Giambattista Tiepolo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tiepolo%2C_Giovanni_Battista_-_Fresken_Treppenhaus_des_W%C3%BCrzburger_Residenzschlosses%2C_Szenen_zur_Apotheose_des_F%C3%BCrstbischofs%2C_Detail_Giovanni_Battista_Tiepolo_-_1750-1753.jpg/500px-thumbnail.jpg",
  "Tintoretto": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Tintoretto-selfport.jpg/500px-Tintoretto-selfport.jpg",
  "Nicolas Poussin": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Nicolas_Poussin_078.jpg/500px-Nicolas_Poussin_078.jpg",
  "Théodore Géricault": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Horace_Vernet%2C_Jean-Louis-Andr%C3%A9-Th%C3%A9odore_Gericault%2C_probably_1822_or_1823%2C_1998.84%2C_MET.jpg/500px-Horace_Vernet%2C_Jean-Louis-Andr%C3%A9-Th%C3%A9odore_Gericault%2C_probably_1822_or_1823%2C_1998.84%2C_MET.jpg",
  "Jean-Auguste-Dominique Ingres": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Portrait_de_Jean-Auguste-Dominique_Ingres_%281780-1867%29%2C_peintre._PH10351_%28Cropped%29.jpg/500px-Portrait_de_Jean-Auguste-Dominique_Ingres_%281780-1867%29%2C_peintre._PH10351_%28Cropped%29.jpg",
  "Giorgio Morandi": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Giorgio_Morandi%2C_cropped.jpg/500px-Giorgio_Morandi%2C_cropped.jpg",

  // ==========================================
  // P4 WRITERS/PHILOSOPHERS (Added) - Verified Wikipedia API URLs
  // ==========================================
  "Philip K. Dick": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Philip_K_Dick_in_early_1960s_Arthur_Knight_%283x4_cropped%29.jpg/500px-Philip_K_Dick_in_early_1960s_Arthur_Knight_%283x4_cropped%29.jpg",
  "Jorge Luis Borges": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Jorge_Luis_Borges_1951%2C_by_Grete_Stern_%28full%29.jpg/500px-Jorge_Luis_Borges_1951%2C_by_Grete_Stern_%28full%29.jpg",
  "Jean Baudrillard": "https://upload.wikimedia.org/wikipedia/commons/e/ef/WikipediaBaudrillard20040612-cropped.png",
  "M.C. Escher": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Maurits_Cornelis_Escher.jpg/500px-Maurits_Cornelis_Escher.jpg",
  "Philip Glass": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg/500px-Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg",
  "Tracy Chevalier": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Tracy_Chevalier_tree.jpg",
  "Richard Avedon": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Richard_Avedon_2004.jpg/440px-Richard_Avedon_2004.jpg",

  // ==========================================
  // P5 HARDER TO SOURCE (Added) - Verified Wikipedia API URLs
  // ==========================================
  "Kenji Miyazawa": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Miyazawa_Kenji.jpg/500px-Miyazawa_Kenji.jpg"
};

// ==========================================
// ALIASES - For DNA graph compatibility
// Maps simplified names to canonical names
// ==========================================
const CREATOR_ALIASES = {
  // Painters (simplified -> canonical)
  "Eugene Delacroix": "Eugène Delacroix",
  "Eugene Boudin": "Eugène Boudin",
  "Jean-Simeon Chardin": "Jean-Baptiste-Siméon Chardin",
  "Blanche Hoschede Monet": "Blanche Hoschedé Monet",
  "Edouard Manet": "Édouard Manet",
  "Van Gogh": "Vincent van Gogh",
  "Rembrandt van Rijn": "Rembrandt",
  "Velazquez": "Diego Velázquez",
  "Salvador Dali": "Salvador Dalí",
  "Da Vinci": "Leonardo da Vinci",
  "Paul Cezanne": "Paul Cézanne",
  "Theodore Gericault": "Théodore Géricault",
  "Turner": "J.M.W. Turner",
  "Tiepolo": "Giambattista Tiepolo",

  // Directors
  "The Wachowskis": "Lana Wachowski & Lilly Wachowski",
  "Wachowskis": "Lana Wachowski & Lilly Wachowski",

  // Known gaps - no public photo available
  "Kazuo Oga": null,  // Studio Ghibli background artist
  "Louis Leroy": null  // 19th century art critic
};

/**
 * Get creator/cast image URL by name
 * Falls back to null if not found
 * Supports aliases for simplified names
 */
function getCreatorImage(name) {
  // Try CREATOR_PROFILES first (new format)
  if (CREATOR_PROFILES[name]) {
    return CREATOR_PROFILES[name].image;
  }

  // Try direct CREATOR_IMAGES lookup (legacy format)
  if (CREATOR_IMAGES[name]) {
    return CREATOR_IMAGES[name];
  }

  // Try alias lookup
  const aliasName = CREATOR_ALIASES[name];
  if (aliasName) {
    if (CREATOR_PROFILES[aliasName]) {
      return CREATOR_PROFILES[aliasName].image;
    }
    if (CREATOR_IMAGES[aliasName]) {
      return CREATOR_IMAGES[aliasName];
    }
  }

  return null;
}

/**
 * Get full creator profile by name
 * Returns { image, bio, bioFull, careerPhase, roleCategory, ... }
 */
function getCreatorProfile(name) {
  // Try direct lookup
  if (CREATOR_PROFILES[name]) {
    return CREATOR_PROFILES[name];
  }

  // Try alias lookup
  const aliasName = CREATOR_ALIASES[name];
  if (aliasName && CREATOR_PROFILES[aliasName]) {
    return CREATOR_PROFILES[aliasName];
  }

  // Fallback: construct minimal profile from legacy data
  const image = getCreatorImage(name);
  if (image) {
    return {
      image: image,
      bio: null,
      bioFull: null,
      careerPhase: null,
      roleCategory: null
    };
  }

  return null;
}

