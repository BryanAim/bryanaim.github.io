'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { designProjects as allDesignProjects, Category } from '../work/designProjects'

/* ─── Shared constants ─── */
export const dgCatLabels: Record<Category | 'all', string> = {
  all: 'All',
  logo: 'Logos',
  print: 'Print',
  composition: 'Compositions',
  illustration: 'Illustrations',
  motion: 'Motion',
  'ui-ux': 'UI / UX',
  photography: 'Photography',
}
export const dgCatIcons: Record<Category | 'all', string> = {
  all: 'fas fa-th',
  logo: 'fas fa-pen-nib',
  print: 'fas fa-file-alt',
  composition: 'fas fa-layer-group',
  illustration: 'fas fa-paint-brush',
  motion: 'fas fa-film',
  'ui-ux': 'fas fa-pen-ruler',
  photography: 'fas fa-camera',
}
export const dgCatColors: Record<Category | 'all', string> = {
  all: '#b1db00',
  logo: '#b1db00',
  print: '#ff8c42',
  composition: '#e91e63',
  illustration: '#a78bfa',
  motion: '#ff5722',
  'ui-ux': '#4fc3f7',
  photography: '#27ae60',
}

const PAGE_SIZE = 9
const TAGS_VISIBLE = 16

/* ─── Component ─── */
export default function DesignGallery({
  shuffleSeed,
  initialTag = '',
  backSlug,
}: {
  shuffleSeed: number
  initialTag?: string
  backSlug?: string
}) {
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const [activeTag, setActiveTag] = useState(initialTag)
  const [page, setPage] = useState(0)
  const [showAllTags, setShowAllTags] = useState(false)

  const backProject = backSlug ? allDesignProjects.find(p => p.slug === backSlug) : null

  // seed=0 returns original order (SSR); any other seed shuffles randomly
  const shuffledProjects = useMemo(
    () => shuffleSeed === 0 ? [...allDesignProjects] : [...allDesignProjects].sort(() => Math.random() - 0.5),
    [shuffleSeed],
  )

  const allTags = useMemo(
    () => Array.from(new Set(allDesignProjects.flatMap(p => p.tags))).sort(),
    [],
  )

  const filtered = shuffledProjects.filter(p => {
    const catOk = activeCat === 'all' || p.category === activeCat
    const tagOk = !activeTag || p.tags.includes(activeTag)
    return catOk && tagOk
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleCat = (cat: Category | 'all') => { setActiveCat(cat); setActiveTag(''); setPage(0) }
  const handleTag = (tag: string) => { setActiveTag(activeTag === tag ? '' : tag); setPage(0) }

  const accentColor = dgCatColors[activeCat]
  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAGS_VISIBLE)
  const hiddenCount = allTags.length - TAGS_VISIBLE

  const pageBtnClass =
    'flex items-center gap-[0.4rem] bg-white/[0.04] border border-white/10 rounded-md text-white/60 cursor-pointer transition-all duration-200 enabled:hover:border-white/30 enabled:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-col gap-[0.85rem] mt-6">
      {/* ── Back link ── */}
      {backProject && (
        <Link
          href={`/work/design/${backProject.slug}`}
          className="inline-flex items-center gap-[0.45rem] text-[0.82rem] font-semibold text-lime border border-lime/30 bg-lime/[0.07] px-[0.9rem] py-[0.4rem] rounded-full no-underline self-start transition-[background,border-color] duration-200 hover:bg-lime/15 hover:border-lime/60"
        >
          <i className="fas fa-arrow-left" /> Back to {backProject.title}
        </Link>
      )}

      {/* ── Category tabs ── */}
      <div className="flex flex-wrap gap-[0.4rem]">
        {(Object.keys(dgCatLabels) as (Category | 'all')[]).map(cat => {
          const color = dgCatColors[cat]
          const isActive = activeCat === cat
          const count = cat === 'all'
            ? allDesignProjects.length
            : allDesignProjects.filter(p => p.category === cat).length
          return (
            <button
              key={cat}
              className="flex items-center gap-[0.4rem] px-[0.85rem] py-[0.4rem] bg-white/[0.04] border border-white/10 rounded-full text-white/50 text-[0.74rem] font-semibold cursor-pointer transition-all duration-200 uppercase tracking-[0.3px] whitespace-nowrap hover:text-white hover:border-white/25 max-sm:text-[0.68rem] max-sm:px-[0.65rem] max-sm:py-[0.35rem]"
              style={isActive ? { borderColor: color, color, background: `${color}14` } : {}}
              onClick={() => handleCat(cat)}
            >
              <i className={dgCatIcons[cat]} style={isActive ? { color } : {}} />
              {dgCatLabels[cat]}
              <span
                className="bg-white/10 px-[0.4rem] py-[0.05rem] rounded-lg text-[0.65rem] max-sm:hidden"
                style={isActive ? { background: `${color}28`, color } : {}}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Tag filter ── */}
      <div className="flex flex-col gap-2 px-[0.85rem] py-[0.65rem] bg-white/[0.025] border border-white/[0.07] rounded-lg">
        <span className="shrink-0 text-[0.63rem] uppercase tracking-[0.6px] text-white/25">
          <i className="fas fa-tag" /> Tags
        </span>
        <div className="flex flex-wrap gap-[0.35rem]">
          {visibleTags.map(tag => (
            <button
              key={tag}
              className="px-[0.55rem] py-[0.2rem] bg-transparent border border-white/[0.09] rounded text-white/40 text-[0.68rem] cursor-pointer transition-all duration-[180ms] hover:border-white/[0.28] hover:text-white/70"
              style={activeTag === tag ? { borderColor: accentColor, color: accentColor, background: `${accentColor}12` } : {}}
              onClick={() => handleTag(tag)}
            >
              #{tag}
            </button>
          ))}
          {!showAllTags && hiddenCount > 0 && (
            <button
              className="px-[0.55rem] py-[0.2rem] bg-transparent border border-dashed border-white/[0.18] rounded text-white/35 text-[0.68rem] cursor-pointer transition-all duration-[180ms] hover:border-white/35 hover:text-white/60"
              onClick={() => setShowAllTags(true)}
            >
              +{hiddenCount} more
            </button>
          )}
          {showAllTags && (
            <button
              className="px-[0.55rem] py-[0.2rem] bg-transparent border border-dashed border-white/[0.18] rounded text-white/35 text-[0.68rem] cursor-pointer transition-all duration-[180ms] hover:border-white/35 hover:text-white/60"
              onClick={() => setShowAllTags(false)}
            >
              show less
            </button>
          )}
        </div>
      </div>

      {/* ── Results bar + top pagination ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-[0.72rem] text-white/40 m-0 flex items-center gap-[0.6rem]">
          {filtered.length === 0
            ? 'No projects'
            : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          {(activeCat !== 'all' || activeTag) && (
            <button
              className="bg-transparent border-none text-[0.68rem] text-white/40 cursor-pointer p-0 underline hover:text-white/70"
              onClick={() => { handleCat('all'); setShowAllTags(false) }}
            >
              ✕ clear
            </button>
          )}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-[0.4rem]">
            <button
              className={`${pageBtnClass} px-2 py-[0.25rem] text-[0.7rem]`}
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <span className="text-[0.72rem] min-w-[2.5rem] text-center" style={{ color: accentColor }}>
              {page + 1} <span className="text-white/20 mx-[0.15rem]">/</span> {totalPages}
            </span>
            <button
              className={`${pageBtnClass} px-2 py-[0.25rem] text-[0.7rem]`}
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-[0.7rem] max-sm:grid-cols-2 max-[400px]:grid-cols-1">
          {pageItems.map(project => (
            <Link
              key={project.slug}
              href={`/work/design/${project.slug}`}
              className="dgm-card no-underline text-inherit block rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.07] transition-[transform,box-shadow] duration-[250ms] ease-[ease]"
              style={{ '--dgm-color': project.color } as React.CSSProperties}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img src={project.primaryImage} alt={project.title} className="dgm-img w-full h-full object-cover" />
                {project.images && project.images.length > 1 && (
                  <span className="absolute top-[0.4rem] right-[0.4rem] bg-black/70 text-white/80 text-[0.6rem] px-[0.45rem] py-[0.15rem] rounded flex items-center gap-[0.25rem] backdrop-blur-sm">
                    <i className="fas fa-images" /> {project.images.length}
                  </span>
                )}
                <div className="dgm-overlay absolute inset-0 bg-black/[0.72] opacity-0 flex flex-col items-center justify-center gap-[0.3rem] p-2 text-center">
                  <span
                    className="inline-flex items-center gap-[0.3rem] px-[0.55rem] py-[0.2rem] rounded-full text-[0.62rem] font-bold uppercase"
                    style={{ background: project.color, color: '#000' }}
                  >
                    <i className={dgCatIcons[project.category]} />
                    {dgCatLabels[project.category]}
                  </span>
                  <p className="text-[0.78rem] font-bold text-white m-0">{project.title}</p>
                  <p className="text-[0.65rem] text-white/50 m-0"><i className="fas fa-expand-alt" /> Explore</p>
                </div>
              </div>
              <div
                className="flex items-center justify-between px-[0.65rem] py-[0.5rem] border-t border-solid max-sm:py-[0.4rem] max-sm:px-[0.5rem]"
                style={{ borderColor: `${project.color}44` }}
              >
                <span className="text-[0.72rem] font-semibold text-white/75 max-sm:text-[0.67rem]">{project.title}</span>
                <span className="text-[0.65rem] font-semibold" style={{ color: project.color }}>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-white/30">
          <i className="fas fa-search text-[1.5rem] block mb-[0.4rem]" />
          <p className="m-0 text-[0.82rem]">No projects match this filter</p>
        </div>
      )}

      {/* ── Bottom pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-[0.8rem] border-t border-white/[0.07] gap-[0.6rem]">
          <button
            className={`${pageBtnClass} px-[0.9rem] py-[0.4rem] text-[0.75rem]`}
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            <i className="fas fa-chevron-left" /> Prev
          </button>
          <div className="flex gap-[0.35rem] items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`h-[7px] bg-white/20 border-none cursor-pointer transition-all duration-200 p-0 hover:bg-white/40 ${i === page ? 'w-[18px] rounded-[4px]' : 'w-[7px] rounded-full'}`}
                style={i === page ? { background: accentColor } : {}}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
          <button
            className={`${pageBtnClass} px-[0.9rem] py-[0.4rem] text-[0.75rem]`}
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  )
}
