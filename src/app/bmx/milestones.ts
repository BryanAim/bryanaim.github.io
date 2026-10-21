/* Major milestones for the "Latest Updates" row on /bmx.
   Newest first. Dates are DD-MM-YYYY. Add youtubeId to link a video (short: true for Shorts).
   The Monday bmx-weekly-planner task adds entries here; keep the shape exactly as below. */
export type Milestone = {
  date: string
  title: string
  note: string
  youtubeId?: string
  short?: boolean
}

export const milestones: Milestone[] = [
  { date: '20-10-2026', title: 'Manuals into bunny hops', note: 'Linking manuals straight into bunny hops, and it is getting better.', youtubeId: 'a2DIaueou_Q' },
  { date: '18-10-2026', title: 'Day 1 on half cabs', note: 'First day trying half cabs, building on the fakies.', youtubeId: '66zpMRlnmco', short: true },
  { date: '14-10-2026', title: '100 fakies for 100 subs', note: 'Landed 43 fakies before the rain ended the challenge.', youtubeId: 'HISQFe-Wi9s', short: true },
  { date: '11-10-2026', title: 'First tailwhip attempts', note: 'The sticking point is staying over the front tyre as the bike comes around.', youtubeId: 'lF50SDIzwgw', short: true },
  { date: '10-10-2026', title: 'Fixed the dancing back wheel', note: 'Swapped out a bent rear axle myself to stop the back wheel wobbling.', youtubeId: 'KNxqW12cEQU' },
  { date: '04-10-2026', title: 'Got my first custom BMX', note: 'Picked up a used Radio Darko custom build, checked it over for play and cracks, and retired the Redline.', youtubeId: 'PdB14iTXT-s', short: true },
  { date: '20-09-2026', title: 'Found a better fakie spot', note: 'A slope with an edge to tap made the backward roll and the carve far easier than the flat spot.' },
]
