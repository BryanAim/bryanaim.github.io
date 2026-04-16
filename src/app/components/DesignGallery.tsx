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

  const shuffledProjects = useMemo(
    () => [...allDesignProjects].sort(() => Math.random() - 0.5),
    [shuffleSeed], // eslint-disable-line react-hooks/exhaustive-deps
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

  return (
    <div className="wk-design-wrap">
      {/* ── Back link (when arriving via a tag from a project page) ── */}
      {backProject && (
        <Link href={`/work/design/${backProject.slug}`} className="dgm-back-link">
          <i className="fas fa-arrow-left" /> Back to {backProject.title}
        </Link>
      )}

      {/* ── Category tabs ── */}
      <div className="dgm-tabs">
        {(Object.keys(dgCatLabels) as (Category | 'all')[]).map(cat => {
          const color = dgCatColors[cat]
          const isActive = activeCat === cat
          const count = cat === 'all'
            ? allDesignProjects.length
            : allDesignProjects.filter(p => p.category === cat).length
          return (
            <button
              key={cat}
              className={`dgm-tab ${isActive ? 'active' : ''}`}
              style={isActive ? { borderColor: color, color, background: `${color}14` } : {}}
              onClick={() => handleCat(cat)}
            >
              <i className={dgCatIcons[cat]} style={isActive ? { color } : {}} />
              {dgCatLabels[cat]}
              <span className="dgm-tab-count" style={isActive ? { background: `${color}28`, color } : {}}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Tag filter ── */}
      <div className="dgm-tags-section">
        <span className="dgm-tags-label"><i className="fas fa-tag" /> Tags</span>
        <div className="dgm-tags">
          {visibleTags.map(tag => (
            <button
              key={tag}
              className={`dgm-tag ${activeTag === tag ? 'active' : ''}`}
              style={activeTag === tag ? { borderColor: accentColor, color: accentColor, background: `${accentColor}12` } : {}}
              onClick={() => handleTag(tag)}
            >
              #{tag}
            </button>
          ))}
          {!showAllTags && hiddenCount > 0 && (
            <button className="dgm-tags-toggle" onClick={() => setShowAllTags(true)}>
              +{hiddenCount} more
            </button>
          )}
          {showAllTags && (
            <button className="dgm-tags-toggle" onClick={() => setShowAllTags(false)}>
              show less
            </button>
          )}
        </div>
      </div>

      {/* ── Results bar + top pagination ── */}
      <div className="dgm-results-bar">
        <p className="dgm-results-count">
          {filtered.length === 0
            ? 'No projects'
            : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          {(activeCat !== 'all' || activeTag) && (
            <button className="dgm-clear-filters" onClick={() => { handleCat('all'); setShowAllTags(false) }}>
              ✕ clear
            </button>
          )}
        </p>
        {totalPages > 1 && (
          <div className="dgm-pagination-top">
            <button className="dgm-page-btn dgm-page-btn--sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <i className="fas fa-chevron-left" />
            </button>
            <span className="dgm-page-label" style={{ color: accentColor }}>
              {page + 1} <span>/</span> {totalPages}
            </span>
            <button className="dgm-page-btn dgm-page-btn--sm" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="dgm-grid">
          {pageItems.map(project => (
            <Link
              key={project.slug}
              href={`/work/design/${project.slug}`}
              className="dgm-card"
              style={{ '--dgm-color': project.color } as React.CSSProperties}
            >
              <div className="dgm-img-wrap">
                <img src={project.primaryImage} alt={project.title} className="dgm-img" />
                {project.images && project.images.length > 1 && (
                  <span className="dgm-multi-badge">
                    <i className="fas fa-images" /> {project.images.length}
                  </span>
                )}
                <div className="dgm-overlay">
                  <span className="dgm-overlay-cat" style={{ background: project.color, color: '#000' }}>
                    <i className={dgCatIcons[project.category]} />
                    {dgCatLabels[project.category]}
                  </span>
                  <p className="dgm-overlay-title">{project.title}</p>
                  <p className="dgm-overlay-hint"><i className="fas fa-expand-alt" /> Explore</p>
                </div>
              </div>
              <div className="dgm-footer" style={{ borderColor: `${project.color}44` }}>
                <span className="dgm-footer-title">{project.title}</span>
                <span className="dgm-footer-year" style={{ color: project.color }}>{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="dgm-empty">
          <i className="fas fa-search" />
          <p>No projects match this filter</p>
        </div>
      )}

      {/* ── Bottom pagination ── */}
      {totalPages > 1 && (
        <div className="dgm-pagination">
          <button className="dgm-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <i className="fas fa-chevron-left" /> Prev
          </button>
          <div className="dgm-page-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`dgm-dot ${i === page ? 'active' : ''}`}
                style={i === page ? { background: accentColor } : {}}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
          <button className="dgm-page-btn" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
            Next <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  )
}
