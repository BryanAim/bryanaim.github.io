# Site Context — isalebryan.dev

This file is loaded by agents to avoid re-deriving site context on every run.

## Owner
- **Name:** Brian Isale
- **Location:** Nakuru, Kenya
- **Portfolio URL:** https://isalebryan.dev
- **GitHub:** https://github.com/BryanAim
- **Behance:** https://behance.net/isalebryan

## About the Work
Brian is a Software Developer and Multimedia Designer with 6+ years experience. His design work spans brand identity, print, digital art (photo manipulation / compositions), and illustration. Clients range from local Kenyan businesses and artists to personal/freelance projects.

## Design Project Schema
File: `src/app/work/designProjects.ts`

```ts
type Category = 'logo' | 'print' | 'composition' | 'illustration'

interface DesignProject {
  slug: string           // kebab-case, unique, e.g. 'nesthub', 'dream-net'
  title: string          // human-readable, e.g. 'NestHub', 'Dream Net'
  category: Category
  tags: string[]         // 2–5 tags from the taxonomy below
  primaryImage: string   // public path, e.g. '/img/projects/design/logos/nesthub-concept-2.jpg'
  images?: ProjectImage[] // optional multi-image gallery
  year: string           // '2018'–'2026'
  client?: string        // client name or 'Personal'
  description: string    // 1–2 sentences, what the project is
  concept: string        // 1 sentence, the creative direction/idea behind it
  tools: string[]        // from the tools list below
  color: string          // hex accent color — pick from image or curated palette
}
```

## Category → Subfolder Mapping
| Category      | Subfolder                                  | Status  |
|---------------|--------------------------------------------|---------|
| logo          | public/img/projects/design/logos/          | core    |
| print         | public/img/projects/design/print/          | core    |
| composition   | public/img/projects/design/compositions/   | core    |
| illustration  | public/img/projects/design/illustrations/  | core    |
| motion        | public/img/projects/design/motion/         | extended|
| ui-ux         | public/img/projects/design/ui-ux/          | extended|
| photography   | public/img/projects/design/photography/    | extended|

## How to Classify an Image
- **logo**: vector mark, wordmark, monogram, brand system, letterhead, business card with logo as hero
- **print**: event poster, flyer, wedding invite, brochure, business card (layout as hero, not logo)
- **composition**: photo manipulation, composite portrait, layered photographic art, album artwork
- **illustration**: digital drawing, character art, hand-drawn style, anime-influenced, vector illustration (not a logo)
- **motion**: motion graphics stills, animation frames, GIF previews, video title cards, After Effects output
- **ui-ux**: app screens, wireframes, high-fidelity mockups, Figma prototypes, web UI design
- **photography**: editorial or fine-art photography with minimal post-processing (no significant compositing)

## Creating New Categories
When the skill encounters work that doesn't fit any category above, it may create a new one — but only if:
1. At least **2 projects** fit it
2. None of the existing categories are a reasonable fit
3. It represents a meaningfully distinct type of work

When a new category is created, the skill automatically:
- Adds the new value to the `Category` type union in `designProjects.ts` with a comment
- Adds label + icon entries to `dgCatLabels` / `dgCatIcons` in both `work/page.tsx` and `about/page.tsx`
- Creates the physical subfolder under `public/img/projects/design/`
- Updates this file (appends to the table and classification guide above)

**Update this table** when a new category is confirmed.

## Tag Taxonomy (use existing tags where possible, add new ones only if genuinely needed)
```
tech, brand-identity, startup, property, entertainment, music, kenya, personal-brand, professional,
stationery, network, monogram, minimal, corporate, sustainability, transport, eco, fitness, gym, sports,
real-estate, tattoo, creative, street, taxi, service, agriculture, farming, system, guidelines,
event, poster, series, marketing, wedding, invitation, print, industrial, brochure, business-card,
portrait, photo-manipulation, composite, process, fashion, art, romantic, personal, storytelling,
celebrity, photography, africa, landscape, dynamic, album-art, beauty, anime, concept-art,
digital-art, illustration, character, seasonal, greeting, motion-graphics, ui-ux, social-media
```

## Tools Used in Brian's Work
- Adobe Illustrator — logos, vector illustrations, print layouts
- Adobe Photoshop — photo manipulations, compositions, retouching
- Lightroom — photo colour grading and processing
- Adobe InDesign — multi-page print layouts
- Adobe After Effects — motion graphics
- Figma — UI/UX design

## Color Palette (for new entries when dominant brand color is unclear)
```
#00ddd7  teal / tech
#b1db00  lime / creative
#ff8c42  orange / energetic
#a78bfa  purple / abstract
#f472b6  pink / fashion/beauty
#4fc3f7  light blue / professional
#f1c40f  gold / premium
#e74c3c  red / bold/sport
#27ae60  green / eco/agriculture
#9b59b6  deep purple / music
#ff5722  deep orange / dynamic
#e91e63  hot pink / romantic
```

## Slug Conventions
- kebab-case of title, lowercase
- No special characters except hyphens
- Must be unique in designProjects.ts
- Examples: `nesthub`, `barbell-syndicate`, `no-sensei-series`, `samuel-teresia-wedding`

## Multi-Image Projects
If a project has multiple images (concept variants, before/after, process shots):
- Use the best/final image as `primaryImage`
- Put all images in the `images[]` array
- Mark the chosen/final one with `isChosen: true`
- Give each image a short `label` (e.g. 'Final Design', 'Dark Version', 'Concept A')

## Year Guidelines
- Check filename for date hints (e.g. `2024`, `jan-2025`)
- If no hint, use the file's approximate context or default to current year (2026)
- Year range: 2018–2026

## Writing Style for description / concept
- **description**: factual, 1–2 sentences. What the project is and who it's for.
  - Good: "Brand identity for a Nakuru-based entertainment company hosting monthly music events."
  - Bad: "This amazing logo was created with passion and dedication."
- **concept**: the creative thinking behind the design, 1 sentence.
  - Good: "Bold lettering with a graphic accent communicates confidence and the vibrant energy of the local scene."
  - Bad: "The concept was to make a nice logo."
