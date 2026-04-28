// Core categories — agent may extend this union when genuinely new work types are encountered.
// When adding a new value: also update dgCatLabels + dgCatIcons in work/page.tsx AND about/page.tsx,
// and create the matching subfolder under public/img/projects/design/.
export type Category =
  | 'logo'
  | 'print'
  | 'composition'
  | 'illustration'
  | 'motion'       // motion graphics, animated content
  | 'ui-ux'        // app/web interface mockups, wireframes, prototypes
  | 'photography'  // photo series, editorial photography (no significant manipulation)

export interface ProjectImage {
  src: string
  label?: string          // e.g. "Chosen Concept", "Dark Version", "Process"
  isChosen?: boolean      // marks the selected/final concept
  caption?: string
}

export interface DesignProject {
  slug: string
  title: string
  category: Category
  tags: string[]
  primaryImage: string   // thumbnail used in the grid
  images?: ProjectImage[] // multi-image gallery on detail page
  year: string
  client?: string
  description: string
  concept: string
  tools: string[]
  color: string
}

/* ─────────────────────────────────────────
   LOGOS
───────────────────────────────────────── */
export const designProjects: DesignProject[] = [
  {
    slug: 'nesthub',
    title: 'NestHub',
    category: 'logo',
    tags: ['tech', 'brand-identity', 'startup', 'property'],
    primaryImage: '/img/projects/design/logos/nesthub-concept-2.jpg',
    images: [
      { src: '/img/projects/design/logos/nesthub-concept-1.jpg', label: 'Chosen Concept', isChosen: true },
      { src: '/img/projects/design/logos/nesthub-concept-2.jpg', label: 'Alternate Concept' },
    ],
    year: '2024',
    client: 'NestHub',
    description:
      'Brand identity for NestHub, a property-tech platform connecting homeowners and renters. Two distinct concepts were developed before landing on the final direction.',
    concept:
      'Concept 1 explored a geometric nest form suggesting shelter and connectivity. Concept 2 (the chosen design) took a cleaner approach: a minimal roof mark paired with a modern typeface, projecting trust and simplicity. Both are included to show the decision-making process.',
    tools: ['Adobe Illustrator'],
    color: '#4fc3f7',
  },
  {
    slug: 'starehe-entertainment',
    title: 'Starehe Entertainment',
    category: 'logo',
    tags: ['entertainment', 'music', 'brand-identity', 'kenya'],
    primaryImage: '/img/projects/design/logos/starehe-black.jpg',
    images: [
      { src: '/img/projects/design/logos/starehe-black.jpg', label: 'Dark Version', isChosen: true },
      { src: '/img/projects/design/logos/starehe-white.jpg', label: 'Light Version' },
    ],
    year: '2024',
    client: 'Oldies and Soul / Starehe Entertainment',
    description:
      'Logo for Starehe Entertainment, a Nakuru-based entertainment brand hosting the famous Oldies and Soul events and managing talent. Delivered in both dark and light versions for versatility across digital and print contexts.',
    concept:
      'The mark draws on the energy and vibrancy of Nakuru\'s entertainment scene. Bold lettering with a graphic accent communicates confidence and culture. The two colourways ensure the identity works on stage screens, merchandise, and social media alike.',
    tools: ['Adobe Illustrator'],
    color: '#ffd700',
  },
  {
    slug: 'elaine-mukoya',
    title: 'Elaine Mukoya',
    category: 'logo',
    tags: ['personal-brand', 'professional', 'brand-identity', 'stationery'],
    primaryImage: '/img/projects/design/logos/elaine-mukoya-logo.jpg',
    images: [
      { src: '/img/projects/design/logos/elaine-mukoya-logo.jpg', label: 'Primary Logo', isChosen: true },
      { src: '/img/projects/design/logos/elaine-mukoya-letterhead.jpg', label: 'Letterhead' },
    ],
    year: '2025',
    client: 'Elaine Mukoya',
    description:
      'Personal brand identity system for Elaine Mukoya, including the primary logo mark and a full letterhead design. Built to project professionalism across digital and physical correspondence.',
    concept:
      'The monogram is built on refined geometry: elegant yet approachable. Thin stroke letterforms mirror the precision and care Elaine brings to her work. The letterhead extends this language with careful typographic hierarchy and restrained use of the brand colour.',
    tools: ['Adobe Illustrator'],
    color: '#c9a96e',
  },
  {
    slug: 'dream-net',
    title: 'Dream Net',
    category: 'logo',
    tags: ['tech', 'network', 'brand-identity', 'startup'],
    primaryImage: '/img/projects/design/logos/dream-net-2.jpg',
    images: [
      { src: '/img/projects/design/logos/dream-net-1.jpg', label: 'Chosen Concept', isChosen: true },
      { src: '/img/projects/design/logos/dream-net-2.jpg', label: 'Logo Usage Concept' },
    ],
    year: '2024',
    client: 'Dream Net Innovation',
    description:
      'Logo concepts for a networking/tech startup. Two directions were explored: one more abstract and network-node inspired, the other more typographically grounded.',
    concept:
      'The chosen concept translates "dream" and "net" into a single connected mark: nodes and pathways forming a symbol that is both human and technical. The alternate concept leaned on typographic treatment alone, exploring how letterforms could carry the connectivity metaphor.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#7c4dff',
  },
  {
    slug: 'dwb-logo',
    title: 'DWB',
    category: 'logo',
    tags: ['brand-identity', 'monogram', 'minimal'],
    primaryImage: '/img/projects/design/logos/dwb-logo.jpg',
    year: '2024',
    client: 'DWB',
    description:
      'Clean, minimal logo mark for DWB. The brief prioritised timelessness and versatility: something that would work at any scale and across diverse contexts.',
    concept:
      'The three letterforms are interlocked in a way that creates visual tension and cohesion simultaneously. Every angle and weight was deliberate. The mark reads instantly at both icon-size and billboard scale.',
    tools: ['Adobe Illustrator'],
    color: '#00ddd7',
  },
  {
    slug: 'green-drive',
    title: 'Green Drive',
    category: 'logo',
    tags: ['sustainability', 'transport', 'eco', 'brand-identity'],
    primaryImage: '/img/projects/design/logos/green-drive-logo.jpg',
    year: '2024',
    client: 'Green Drive',
    description:
      'Brand identity for a green mobility / eco-transport initiative. The challenge: make sustainability feel modern and aspirational rather than preachy.',
    concept:
      'Motion and nature fused: a leaf form integrated with a forward-pointing speed element. The green palette is deliberate without being clichéd; the mark reads as both environmental and energetic.',
    tools: ['Adobe Illustrator'],
    color: '#4caf50',
  },
  {
    slug: 'barbell-syndicate',
    title: 'Barbell Syndicate',
    category: 'logo',
    tags: ['fitness', 'gym', 'brand-identity', 'sports'],
    primaryImage: '/img/projects/design/logos/barbell-syndicate.jpg',
    images: [
      { src: '/img/projects/design/logos/barbell-syndicate.jpg', label: 'Light Version', isChosen: true },
      { src: '/img/projects/design/logos/barbell-syndicate-black.webp', label: 'Dark Version' },
    ],
    year: '2026',
    client: 'Barbell Syndicate',
    description:
      'Bold brand identity for a powerlifting and strength-training community. The mark needed to project raw power while staying clean enough for apparel and digital use.',
    concept:
      'The barbell itself is the symbol of discipline. The letterforms were custom-weighted to mirror the heaviness and balance of the equipment: grounded, immovable, committed.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#ff4444',
  },
  {
    slug: 'rn-records',
    title: 'RN Records',
    category: 'logo',
    tags: ['music', 'label', 'brand-identity', 'entertainment'],
    primaryImage: '/img/projects/design/logos/rn-records.jpg',
    year: '2020',
    client: 'RN Records',
    description:
      'Logo and brand identity for an independent music label. The mark needed to feel professional enough for industry stakeholders yet authentic enough to resonate with artists.',
    concept:
      'Sound waves and the initial letterforms were fused, rhythm expressed typographically. High-contrast palette allows the logo to work across vinyl, streaming art, and merchandise.',
    tools: ['Adobe Illustrator'],
    color: '#9b59b6',
  },
  {
    slug: 'tm-brand',
    title: 'TM Brand',
    category: 'logo',
    tags: ['brand-identity', 'minimal', 'corporate', 'monogram'],
    primaryImage: '/img/projects/design/logos/tm-logo.jpg',
    year: '2019',
    client: 'TM',
    description:
      'Minimal monogram logo for a corporate client. Clean geometry paired with deliberate negative space: scales from business card to billboard.',
    concept:
      'Two letters, one mark. The geometric grid locks the letters together, implying partnership and structure while remaining elegantly simple.',
    tools: ['Adobe Illustrator'],
    color: '#3498db',
  },
  {
    slug: 'credible-realtors',
    title: 'Credible Realtors',
    category: 'logo',
    tags: ['real-estate', 'professional', 'brand-identity', 'property'],
    primaryImage: '/img/projects/design/logos/credible-realtors.jpg',
    year: '2020',
    client: 'Credible Realtors',
    description:
      'Professional brand identity for a real estate agency, conveying trust, stability, and approachability across all property-sector touchpoints.',
    concept:
      'Architecture meets typography. A roofline motif integrated into the wordmark makes the brand instantly recognisable within the sector, while a clean sans-serif ensures modernity.',
    tools: ['Adobe Illustrator'],
    color: '#2ecc71',
  },
  {
    slug: 'plug-ink',
    title: 'Plug Ink',
    category: 'logo',
    tags: ['tattoo', 'creative', 'brand-identity', 'street'],
    primaryImage: '/img/projects/design/logos/plug-ink.jpg',
    year: '2021',
    client: 'Plug Ink Studio',
    description:
      'Raw, bold logo for a tattoo and ink studio, living authentically in street culture while projecting professional artistry.',
    concept:
      'Inspired by flash-sheet aesthetics and the electricity metaphor of "the plug." Hand-drawn elements were digitised to retain organic authenticity.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#e74c3c',
  },
  {
    slug: 'zu-cabs',
    title: 'Zu Cabs',
    category: 'logo',
    tags: ['transport', 'taxi', 'brand-identity', 'service'],
    primaryImage: '/img/projects/design/logos/zucabs.jpg',
    year: '2019',
    client: 'Zu Cabs',
    description:
      'Friendly yet professional logo for a cab service. Speed, reliability, and safety were the three pillars the brand needed to communicate.',
    concept:
      'Motion and direction are embedded in the letterforms: subtle diagonal tension suggests speed. Rounded corners keep the brand approachable for everyday passengers.',
    tools: ['Adobe Illustrator'],
    color: '#f39c12',
  },
  {
    slug: 'mnt-brand',
    title: 'MNT Brand',
    category: 'logo',
    tags: ['brand-identity', 'minimal', 'monogram'],
    primaryImage: '/img/projects/design/logos/mnt.jpg',
    year: '2020',
    client: 'MNT',
    description:
      'Minimalist monogram exploring the intersection of three strong letterforms, designed for versatility across physical and digital contexts.',
    concept:
      'Three letters interlocked: a puzzle of form and counter-form. Reads clearly at any scale: embossed, stitched, or on screen.',
    tools: ['Adobe Illustrator'],
    color: '#b1db00',
  },
  {
    slug: 'big-farmer',
    title: 'Big Farmer',
    category: 'logo',
    tags: ['agriculture', 'brand-identity', 'farming', 'kenya'],
    primaryImage: '/img/projects/design/logos/big-farmer.jpg',
    year: '2021',
    client: 'Big Farmer',
    description:
      'Brand identity for an agribusiness connecting farmers with markets, rooted in the land, pointing toward scale and tech-enabled ambition.',
    concept:
      'Earth tones meet clean geometry. A bold wordmark that honours the soil while projecting the scale of a platform that can change agriculture.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#27ae60',
  },
  {
    slug: 'brand-identity',
    title: 'Brand Identity System',
    category: 'logo',
    tags: ['brand-identity', 'system', 'guidelines', 'corporate'],
    primaryImage: '/img/projects/design/logos/brand-identity.jpg',
    year: '2021',
    client: 'Confidential',
    description:
      'A complete brand identity system: logo, colour palette, typography, and usage guidelines. Built to scale consistently across all touchpoints.',
    concept:
      'Rooted in clarity and progress. Every element in the system derives from the primary shape, ensuring visual coherence whether on a screen, a shirt, or a signboard.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#00ddd7',
  },

  /* ─────────────────────────────────────────
     PRINT
  ───────────────────────────────────────── */
  {
    slug: 'cmn-posters',
    title: 'CMN Event Posters',
    category: 'print',
    tags: ['event', 'poster', 'series', 'marketing'],
    primaryImage: '/img/projects/design/print/cmn-jan-poster.jpg',
    images: [
      { src: '/img/projects/design/print/cmn-jan-poster.jpg', label: 'January Edition', isChosen: true },
      { src: '/img/projects/design/print/cmn-feb-poster.jpg', label: 'February Edition' },
    ],
    year: '2024',
    client: 'CMN',
    description:
      'Monthly event poster series for Critical Mass Nakuru: January and February editions. The challenge was creating a consistent visual language across editions while keeping each poster feeling fresh and date-specific.',
    concept:
      'A core layout template holds the series together: same grid, same typographic hierarchy, same colour accent system. What changes per edition is the featured imagery and supporting colour, giving each poster its own personality within a recognisable family.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    color: '#ff8c42',
  },
  {
    slug: 'samuel-teresia-wedding',
    title: 'Samuel & Teresia Wedding Invite',
    category: 'print',
    tags: ['wedding', 'invitation', 'print', 'stationery'],
    primaryImage: '/img/projects/design/print/samuel-teresia-wedding-invite.jpg',
    year: '2024',
    client: 'Samuel & Teresia',
    description:
      'Wedding invitation suite for Samuel and Teresia, a keepsake-quality piece that sets the tone for the celebration and gives guests all the information they need in one beautiful layout.',
    concept:
      'Elegant and warm. The design balances tradition and modernity: ornamental flourishes ground it in the sentiment of the occasion, while clean typography keeps it readable and contemporary. The layout guides the eye through event details without ever feeling like a list.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#d4a57a',
  },
  {
    slug: 'tarpo-print',
    title: 'Tarpo Industries',
    category: 'print',
    tags: ['industrial', 'marketing', 'brochure', 'print'],
    primaryImage: '/img/projects/design/print/tarpo.jpg',
    year: '2020',
    client: 'Tarpo Industries',
    description:
      'Marketing collateral for Tarpo Industries, one of East Africa\'s leading tent and tarpaulin manufacturers. Print design for a trade show campaign.',
    concept:
      'Industrial strength communicated through bold typography and structured layouts. The grid echoes the precision engineering of Tarpo\'s products.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'],
    color: '#e67e22',
  },
  {
    slug: 'tm-business-card',
    title: 'TM Business Card',
    category: 'print',
    tags: ['business-card', 'stationery', 'corporate', 'print'],
    primaryImage: '/img/projects/design/print/tm-business-card.jpg',
    year: '2019',
    client: 'TM',
    description:
      'Business card design for the TM brand, the physical extension of the broader identity system. Every detail from type sizing to colour blocks was considered.',
    concept:
      'A card that commands attention face-down. The reverse side uses the full brand colour block, making it memorable the moment it hits the table.',
    tools: ['Adobe Illustrator'],
    color: '#3498db',
  },

  /* ─────────────────────────────────────────
     COMPOSITIONS
  ───────────────────────────────────────── */
  {
    slug: 'jim',
    title: 'Jim',
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'composite', 'process'],
    primaryImage: '/img/projects/design/compositions/jim-composition.jpg',
    images: [
      { src: '/img/projects/design/compositions/jim-composition.jpg', label: 'Final Composition', isChosen: true },
      { src: '/img/projects/design/compositions/jim-portrait.png', label: 'Portrait Source' },
      { src: '/img/projects/design/compositions/jim-bike.png', label: 'Bike Element' },
    ],
    year: '2025',
    client: 'Personal / Commission',
    description:
      'A composite portrait series for Jim, combining a clean portrait shot with a stylised bike element to create a single high-energy scene. Three files document the full process: the source portrait, the isolated bike, and the final merged composition.',
    concept:
      'Man and machine as one visual statement. The bike is not just a prop. It defines Jim\'s identity within the frame. Careful masking and lighting consistency sell the illusion, while the tonal treatment unifies the two source elements into a single cinematic image.',
    tools: ['Adobe Photoshop'],
    color: '#ff5722',
  },
  {
    slug: 'stacey',
    title: 'Stacey',
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'fashion'],
    primaryImage: '/img/projects/design/compositions/leillah-1.jpg',
    images: [
      { src: '/img/projects/design/compositions/leillah-1.jpg', label: 'Version 1', isChosen: true },
      { src: '/img/projects/design/compositions/leillah-2.jpg', label: 'Version 2' },
    ],
    year: '2024',
    client: 'Stacey',
    description:
      'Portrait composition series for Stacey: two treatments exploring different moods and colour stories from the same session.',
    concept:
      'Each version interprets the same subject differently: one leans warmer and editorial, the other cooler and more dramatic. Presenting both lets the subject choose the energy that best represents them, or use them across different contexts.',
    tools: ['Adobe Photoshop', 'Lightroom'],
    color: '#e91e63',
  },
  {
    slug: 'because-its-you',
    title: "Because It's You",
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'art', 'romantic'],
    primaryImage: '/img/projects/design/compositions/because-its-you.jpg',
    year: '2025',
    client: 'Personal',
    description:
      'An intimate photo composition built around connection and emotion. The title drives the visual narrative: everything in the frame points toward one subject.',
    concept:
      'Selective focus, deliberate framing, and a warm tonal grade create a sense of presence and significance. The composition makes the viewer feel they are looking at something deeply personal, as if glimpsed rather than staged.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    color: '#f06292',
  },
  {
    slug: 'brian-triplets',
    title: 'Brian Triplets',
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'creative', 'personal'],
    primaryImage: '/img/projects/design/compositions/brian-triplets.jpg',
    year: '2024',
    client: 'Personal',
    description:
      'A multi-exposure self-portrait composition featuring three instances of the same subject in a single frame, exploring identity, duality, and self-perception.',
    concept:
      'Three selves, one truth. Each instance occupies a distinct visual zone with its own lighting and expression, yet they coexist in the same spatial reality. The result is both technically demanding and psychologically intriguing.',
    tools: ['Adobe Photoshop'],
    color: '#00ddd7',
  },
  {
    slug: 'moshe',
    title: 'Moshe — Where Are You?',
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'art', 'storytelling'],
    primaryImage: '/img/projects/design/compositions/moshe.jpg',
    year: '2024',
    client: 'Personal / Commission',
    description:
      'A narrative photo composition titled "Where Are You?", a piece with emotional depth and visual symbolism built around a single question.',
    concept:
      'The frame is deliberately sparse. A lone figure against an expansive, ambiguous environment creates tension between presence and absence. The question in the title reframes what the viewer sees: from a portrait into a story.',
    tools: ['Adobe Photoshop', 'Lightroom'],
    color: '#78909c',
  },
  {
    slug: 'avril-music',
    title: 'Avril — Music Campaign',
    category: 'composition',
    tags: ['music', 'photo-manipulation', 'art', 'celebrity', 'kenya'],
    primaryImage: '/img/projects/design/compositions/avril-music.jpg',
    year: '2019',
    client: 'Personal / Fan Art',
    description:
      'A tribute photo-manipulation inspired by Avril\'s Kenyan music catalogue: layered textures, light leaks, and typographic overlays creating a visual world that matches the mood of the music.',
    concept:
      'Music is emotional and spatial. The composition places the artist inside a "sound space" built from light, texture, and colour grading that reflects the song\'s energy.',
    tools: ['Adobe Photoshop'],
    color: '#e91e63',
  },
  {
    slug: 'kenya-composition',
    title: 'Kenya — A Visual Ode',
    category: 'composition',
    tags: ['photography', 'art', 'africa', 'kenya', 'landscape'],
    primaryImage: '/img/projects/design/compositions/kenya.jpg',
    year: '2020',
    client: 'Personal',
    description:
      'A photographic composition celebrating the landscapes, culture, and spirit of Kenya. Part of a personal project exploring what "home" means visually.',
    concept:
      'Multiple layers of Kenyan imagery (savanna, city lights, cultural motifs) blended into a single frame that tells a complex national story.',
    tools: ['Adobe Photoshop', 'Lightroom'],
    color: '#009900',
  },
  {
    slug: 'king-isale',
    title: 'King Isale',
    category: 'composition',
    tags: ['personal', 'photo-manipulation', 'art', 'portrait', 'personal-brand'],
    primaryImage: '/img/projects/design/compositions/king-isale.png',
    year: '2019',
    client: 'Personal',
    description:
      'A personal artistic self-portrait series exploring identity, ambition, and creative expression. The "King" motif represents mastery of craft.',
    concept:
      'Crown imagery, light diffusion, and custom colour channels build a visual persona that is larger than life but deeply personal.',
    tools: ['Adobe Photoshop'],
    color: '#f1c40f',
  },
  {
    slug: 'lovers',
    title: 'Lovers',
    category: 'composition',
    tags: ['photo-manipulation', 'art', 'romance', 'portrait'],
    primaryImage: '/img/projects/design/compositions/lovers.jpg',
    year: '2020',
    client: 'Personal',
    description:
      'A romantic photo manipulation exploring connection, warmth, and intimacy through light and texture. Created as a gift piece for a couple.',
    concept:
      'Two subjects brought together through a shared light source, as if the world around them disappears. Warm tones and soft bokeh reinforce closeness.',
    tools: ['Adobe Photoshop', 'Lightroom'],
    color: '#e91e63',
  },
  {
    slug: 'mike-explode',
    title: 'Mike — Explode',
    category: 'composition',
    tags: ['photo-manipulation', 'art', 'dynamic', 'portrait'],
    primaryImage: '/img/projects/design/compositions/mike-explode.jpg',
    year: '2020',
    client: 'Personal / Commission',
    description:
      'A high-energy photo manipulation from the "Explode" series: particle dispersion, double exposure, and directional light radiating from a single focal point.',
    concept:
      'The "explosion" is a metaphor for creative potential. Each particle strand is manually placed to give the impression of energy erupting outward from the subject\'s mind.',
    tools: ['Adobe Photoshop'],
    color: '#ff5722',
  },
  {
    slug: 'enjoy-music',
    title: 'Enjoy Music',
    category: 'composition',
    tags: ['music', 'photo-manipulation', 'artwork', 'album-art'],
    primaryImage: '/img/projects/design/compositions/enjoy-music.jpg',
    year: '2019',
    client: 'Music Artist',
    description:
      'Album artwork and promotional composition: "make it feel like the music looks." Maximum creative freedom, maximum intent.',
    concept:
      'Sound made visible. Frequency wave distortions, prismatic light breaks, and music iconography layered over a strong portrait.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    color: '#9b59b6',
  },
  {
    slug: 'makeup-art',
    title: 'Makeup Art',
    category: 'composition',
    tags: ['beauty', 'fashion', 'photo-manipulation', 'portrait'],
    primaryImage: '/img/projects/design/compositions/makeup.png',
    year: '2021',
    client: 'Beauty Brand',
    description:
      'A fashion and beauty photo composition blending product photography with fine-art portraiture, designed for social media and lookbook use.',
    concept:
      'The face as canvas. Colour blocking, texture overlays, and editorial lighting elevate the subject into an art statement.',
    tools: ['Adobe Photoshop', 'Lightroom'],
    color: '#e91e63',
  },

  /* ─────────────────────────────────────────
     DIGITAL ART & ILLUSTRATION
  ───────────────────────────────────────── */
  {
    slug: 'no-sensei-series',
    title: 'No Sensei — Series',
    category: 'illustration',
    tags: ['digital-art', 'illustration', 'series', 'anime', 'concept-art'],
    primaryImage: '/img/projects/design/illustrations/sensei-red-pill.jpg',
    images: [
      { src: '/img/projects/design/illustrations/sensei-red-pill.jpg', label: 'Red Pill', isChosen: true },
      { src: '/img/projects/design/illustrations/sensei-no-pills.jpg', label: 'No Pills' },
      { src: '/img/projects/design/illustrations/ying-yang-no-sensei.jpg', label: 'Ying Yang' },
    ],
    year: '2024',
    client: 'Personal',
    description:
      'A three-part digital illustration series exploring themes of choice, duality, and wisdom. Each piece stands alone but together they form a coherent philosophical narrative.',
    concept:
      'Drawing on the iconic "red pill / blue pill" archetype and the yin-yang symbol of balance, the series places a sensei figure at the centre of each dilemma. The art style fuses anime-influenced line work with flat graphic elements, accessible yet layered with meaning.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#ef5350',
  },
  {
    slug: 'charlie',
    title: 'Charlie',
    category: 'illustration',
    tags: ['portrait', 'digital-art', 'art'],
    primaryImage: '/img/projects/design/illustrations/charlie.jpg',
    year: '2023',
    client: 'Personal / Commission',
    description:
      'A stylised portrait composition for Charlie, blending photography with graphic design elements to create a distinct personal visual statement.',
    concept:
      'The treatment is bold yet personal. Graphic overlays and textured backgrounds frame the subject without overwhelming them, creating a piece that works as both a portrait and a designed artefact.',
    tools: ['Adobe Photoshop'],
    color: '#ab47bc',
  },
  {
    slug: 'jannies',
    title: 'Jannies',
    category: 'illustration',
    tags: ['portrait', 'digital-art', 'fashion'],
    primaryImage: '/img/projects/design/illustrations/jannies.jpg',
    year: '2024',
    client: 'Commission',
    description:
      'A portrait digital art for Jannies: clean, editorial, and designed to live across social media and print contexts.',
    concept:
      'Strong posing meets deliberate post-production. The background was carefully constructed to complement without competing, giving the subject maximum visual weight while the environment adds story.',
    tools: ['Adobe Illustrator'],
    color: '#ff9800',
  },
  {
    slug: 'world-of-perps',
    title: 'World of Perps',
    category: 'illustration',
    tags: ['digital-art', 'illustration', 'character', 'concept-art'],
    primaryImage: '/img/projects/design/illustrations/world-of-perps.jpg',
    year: '2024',
    client: 'Personal',
    description:
      'A digital illustration building a "world" populated by characters known as Perps, each with distinct personalities and visual identities.',
    concept:
      'World-building through character design. Each Perp is a visual archetype: recognisable yet original, drawn in a consistent style that lets them coexist in the same universe. The piece works as both standalone art and a springboard for a larger illustrated universe.',
    tools: ['Adobe Illustrator'],
    color: '#5c6bc0',
  },
  {
    slug: 'christmas-2024',
    title: 'Christmas 2024',
    category: 'illustration',
    tags: ['digital-art', 'illustration', 'seasonal', 'greeting'],
    primaryImage: '/img/projects/design/illustrations/christmas-2024.jpg',
    year: '2024',
    client: 'Personal',
    description:
      'Original Christmas illustration for 2024, a festive digital artwork created as a holiday greeting and personal creative milestone.',
    concept:
      'Warmth, colour, and storytelling. The composition uses rich seasonal palettes and carefully placed characters to evoke the feeling of the holidays without relying on clichés.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    color: '#e53935',
  },

  /* ─────────────────────────────────────────
     NEW LOGOS
  ───────────────────────────────────────── */
  {
    slug: 'koilas-creatives',
    title: 'Koilas Creatives',
    category: 'logo',
    tags: ['brand-identity', 'creative', 'street', 'kenya'],
    primaryImage: '/img/projects/design/logos/koilas-creatives-yellow.png',
    images: [
      { src: '/img/projects/design/logos/koilas-creatives-yellow.png', label: 'Yellow Highlights', isChosen: true },
      { src: '/img/projects/design/logos/koilas-creatives-white.png', label: 'White Highlights' },
      { src: '/img/projects/design/logos/koilas-creatives-bag-mockup.webp', label: 'Shopping Bag Mockup' },
      { src: '/img/projects/design/logos/koilas-creatives-snapback-front.webp', label: 'Snapback Front' },
      { src: '/img/projects/design/logos/koilas-creatives-snapback-back.webp', label: 'Snapback Back' },
      { src: '/img/projects/design/logos/koilas-creatives-tshirts.webp', label: 'T-Shirts Mockup' },
    ],
    year: '2024',
    client: 'Koilas Creatives',
    description:
      'Full brand identity for Koilas Creatives, a Kenyan streetwear and creative lifestyle brand. Delivered in two colourways with a complete merchandise mockup suite.',
    concept:
      'A bold wordmark built around a stylised face icon communicates personality and street credibility. The yellow-on-dark and white-on-dark variants ensure the mark pops across merch, social media, and retail contexts.',
    tools: ['Adobe Illustrator'],
    color: '#8b5cf6',
  },
  {
    slug: 'infinite-talent',
    title: 'Infinite Talent Limited',
    category: 'logo',
    tags: ['brand-identity', 'corporate', 'professional', 'kenya'],
    primaryImage: '/img/projects/design/logos/infinite-talent-limited.webp',
    images: [
      { src: '/img/projects/design/logos/infinite-talent-limited.webp', label: 'Landscape Logo', isChosen: true },
      { src: '/img/projects/design/logos/infinite-talent-limited-square.webp', label: 'Square Version' },
    ],
    year: '2024',
    client: 'Infinite Talent Limited',
    description:
      'Brand identity for Infinite Talent Limited, a recruitment and talent management agency. The mark had to communicate ambition, human potential, and professional credibility.',
    concept:
      'A dynamic figure in motion forms the core of the mark, wrapped in an infinity loop, visualising limitless potential. The pink and blue palette breaks from traditional corporate tones, giving the brand a modern, people-first energy.',
    tools: ['Adobe Illustrator'],
    color: '#e91e63',
  },
  {
    slug: 'nalepo-agrosupplies',
    title: 'Nalepo Agrosupplies',
    category: 'logo',
    tags: ['agriculture', 'farming', 'brand-identity', 'kenya', 'stationery'],
    primaryImage: '/img/projects/design/logos/nalepo-agrosupplies-logo.png',
    images: [
      { src: '/img/projects/design/logos/nalepo-agrosupplies-logo.png', label: 'Logo on White', isChosen: true },
      { src: '/img/projects/design/logos/nalepo-agrosupplies-logo-black.png', label: 'Logo on Black' },
      { src: '/img/projects/design/logos/nalepo-agrosupplies-business-card.jpg', label: 'Business Card' },
    ],
    year: '2024',
    client: 'Nalepo Agrosupplies (The JACSU Group)',
    description:
      'Brand identity and business card design for Nalepo Agrosupplies, an agri-supplies business based in Mau-Narok under The JACSU Group. The system covers logo on light and dark backgrounds plus print-ready stationery.',
    concept:
      'A green leaf mark enclosed in a circle signals growth and nature. The bold yellow wordmark on the business card commands attention while the dynamic diagonal band layout adds energy, grounding the brand in both agriculture and ambition.',
    tools: ['Adobe Illustrator'],
    color: '#f5a000',
  },
  {
    slug: 'game-park-hyenas',
    title: 'Game Park Hyenas',
    category: 'logo',
    tags: ['sports', 'brand-identity', 'kenya', 'system'],
    primaryImage: '/img/projects/design/logos/game-park-hyenas-design2.webp',
    images: [
      { src: '/img/projects/design/logos/game-park-hyenas-design2.webp', label: 'Final Design', isChosen: true },
      { src: '/img/projects/design/logos/game-park-hyenas-design1.webp', label: 'Initial Concept' },
    ],
    year: '2024',
    client: 'Game Park Hyenas',
    description:
      'Sports team logo for Game Park Hyenas, a basketball team. Two design directions were explored before landing on a refined, mascot-forward badge.',
    concept:
      'The hyena mascot is embedded within a basketball graphic, framed by bold arched lettering. The blue and orange colour palette is classic sportswear, ensuring the mark works on jerseys, court graphics, and social media.',
    tools: ['Adobe Illustrator'],
    color: '#1976d2',
  },

  /* ─────────────────────────────────────────
     NEW PRINT
  ───────────────────────────────────────── */
  {
    slug: 'football-clinic-2021',
    title: 'Football Clinic 2021',
    category: 'print',
    tags: ['event', 'poster', 'sports', 'kenya'],
    primaryImage: '/img/projects/design/print/football-clinic-2021-poster.webp',
    year: '2021',
    client: 'Football Clinic Nakuru',
    description:
      'Event poster for the Football Clinic 2021 in Nakuru, featuring professional players including Boniface Ambani. Designed to drive attendance and communicate the prestige of the event.',
    concept:
      'High-contrast orange and black with bold action photography creates immediate visual impact. The layout hierarchy prioritises the celebrity appeal up front, while all event logistics are clearly structured below.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    color: '#ff8c42',
  },
  {
    slug: 'hadija-sheban',
    title: 'Hadija Sheban — Channel Art',
    category: 'print',
    tags: ['social-media', 'personal-brand', 'marketing', 'print'],
    primaryImage: '/img/projects/design/print/hadija-sheban-youtube-banner.webp',
    year: '2024',
    client: 'Hadija Sheban',
    description:
      'YouTube channel art for Hadija Sheban, a Kenyan travel vlogger covering food, culture, and new destinations. The banner establishes her brand across the channel and links to all her social platforms.',
    concept:
      'A teal palette references both travel and the vlogger\'s signature warmth. A mosque skyline silhouette hints at cultural exploration, while a clean two-column layout balances the "Travel Vlogger" headline against a confident portrait photo and social media handles.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    color: '#00bcd4',
  },

  /* ─────────────────────────────────────────
     NEW ILLUSTRATIONS
  ───────────────────────────────────────── */
  {
    slug: 'fuumbuum',
    title: 'FuumBuum',
    category: 'illustration',
    tags: ['digital-art', 'illustration', 'portrait', 'personal-brand'],
    primaryImage: '/img/projects/design/illustrations/fuumbuum-blue.webp',
    images: [
      { src: '/img/projects/design/illustrations/fuumbuum-blue.webp', label: 'Blue Background', isChosen: true },
      { src: '/img/projects/design/illustrations/fuumbuum-star.webp', label: 'Star Background' },
    ],
    year: '2024',
    client: 'FuumBuum',
    description:
      'Vector portrait illustration for FuumBuum, a personal brand identity piece rendered in two background variants. The illustration captures character and swagger as a digital avatar.',
    concept:
      'A clean vector portrait with bold flat colours and signature sunglasses projects confidence and personality. The star motif in the alternate version adds a layer of aspiration and visual flair.',
    tools: ['Adobe Illustrator'],
    color: '#1565c0',
  },
  {
    slug: 'liz-obuya',
    title: 'Liz Obuya',
    category: 'illustration',
    tags: ['digital-art', 'illustration', 'portrait', 'africa', 'beauty'],
    primaryImage: '/img/projects/design/illustrations/liz-obuya.webp',
    year: '2024',
    client: 'Liz Obuya',
    description:
      'A digital illustration portrait for Liz Obuya: the subject\'s silhouette merges with the shape of the African continent, filled with vibrant traditional fabric patterns against a pink background.',
    concept:
      'Africa as identity. By forming the continent\'s outline from the subject\'s natural hair and head wrap, the piece celebrates African womanhood, heritage, and pride in a single bold visual statement.',
    tools: ['Adobe Illustrator'],
    color: '#e91e63',
  },

  /* ─────────────────────────────────────────
     NEW COMPOSITIONS
  ───────────────────────────────────────── */
  {
    slug: 'triple-portrait',
    title: 'Triple Portrait',
    category: 'composition',
    tags: ['portrait', 'photo-manipulation', 'composite', 'creative'],
    primaryImage: '/img/projects/design/compositions/design1.jpg',
    year: '2024',
    client: 'Personal / Commission',
    description:
      'A photo composite featuring the same subject in three simultaneous poses within a single frame, exploring presence, movement, and spatial identity.',
    concept:
      'Three versions of one person coexist in the same corridor, each occupying a distinct emotional state. Precise masking and matched lighting make the impossible feel documentary.',
    tools: ['Adobe Photoshop'],
    color: '#4fc3f7',
  },
]
