'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { designProjects, Category } from '../../designProjects'
import Link from 'next/link'

const categoryLabel: Record<Category, string> = {
  logo: 'Logo Design',
  print: 'Brochure & Print',
  composition: 'Photo Composition',
  illustration: 'Digital Illustration',
  motion: 'Motion Graphics',
  'ui-ux': 'UI / UX Design',
  photography: 'Photography',
}
const categoryIcon: Record<Category, string> = {
  logo: 'fas fa-pen-nib',
  print: 'fas fa-file-alt',
  composition: 'fas fa-layer-group',
  illustration: 'fas fa-paint-brush',
  motion: 'fas fa-film',
  'ui-ux': 'fas fa-pen-ruler',
  photography: 'fas fa-camera',
}

export default function DesignProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const project = designProjects.find(p => p.slug === slug)

  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!project) {
    return (
      <main id="work" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h1 className="lg-heading">Project <span className="text-secondary">Not Found</span></h1>
        <Link href="/about" className="btn-light" style={{ marginTop: '2rem', display: 'inline-block' }}>
          ← Back
        </Link>
      </main>
    )
  }

  const allImages = project.images ?? [{ src: project.primaryImage, label: project.title }]
  const currentImage = allImages[activeImg]

  const related = designProjects
    .filter(p => p.slug !== slug && (p.category === project.category || p.tags.some(t => project.tags.includes(t))))
    .slice(0, 3)

  return (
    <main id="work" className="dp-page">
      {/* ── Breadcrumb ── */}
      <motion.div className="dp-breadcrumb" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <button onClick={() => router.back()} className="dp-back-btn">
          <i className="fas fa-arrow-left" /> Back
        </button>
        <span className="dp-breadcrumb-sep">/</span>
        <Link href="/about" className="dp-breadcrumb-link">About</Link>
        <span className="dp-breadcrumb-sep">/</span>
        <span style={{ color: project.color }}>{project.title}</span>
      </motion.div>

      {/* ── Hero Image + Gallery ── */}
      <motion.div className="dp-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Main image */}
        <div
          className="dp-hero-image-wrap"
          style={{ borderColor: project.color, cursor: 'zoom-in' }}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={currentImage.src}
              alt={currentImage.label ?? project.title}
              className="dp-hero-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
          {currentImage.isChosen && (
            <span className="dp-chosen-badge" style={{ background: project.color, color: '#000' }}>
              <i className="fas fa-check-circle" /> Chosen Design
            </span>
          )}
          <span className="dp-zoom-hint"><i className="fas fa-search-plus" /></span>
          <div className="dp-hero-image-overlay" style={{ background: `linear-gradient(to top, ${project.color}22, transparent)` }} />
        </div>

        {/* Thumbnail strip (only if multiple images) */}
        {allImages.length > 1 && (
          <div className="dp-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`dp-thumb ${i === activeImg ? 'active' : ''}`}
                style={i === activeImg ? { borderColor: project.color } : {}}
                onClick={() => setActiveImg(i)}
              >
                <img src={img.src} alt={img.label ?? ''} />
                {img.label && (
                  <span className="dp-thumb-label" style={i === activeImg ? { color: project.color } : {}}>
                    {img.isChosen && <i className="fas fa-check-circle" style={{ marginRight: '0.25rem' }} />}
                    {img.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="dp-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button className="dp-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
            {allImages.length > 1 && (
              <>
                <button className="dp-lightbox-prev" onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + allImages.length) % allImages.length) }}>
                  <i className="fas fa-chevron-left" />
                </button>
                <button className="dp-lightbox-next" onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % allImages.length) }}>
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
            <motion.img
              key={activeImg}
              src={currentImage.src}
              alt={currentImage.label ?? project.title}
              className="dp-lightbox-img"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {currentImage.label && (
              <p className="dp-lightbox-caption">{currentImage.label}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="dp-content">
        {/* Left: Meta */}
        <motion.div className="dp-meta" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="dp-category-badge" style={{ borderColor: project.color, color: project.color }}>
            <i className={categoryIcon[project.category]} />
            {categoryLabel[project.category]}
          </div>

          <h1 className="dp-title" style={{ color: project.color }}>{project.title}</h1>

          <div className="dp-meta-row">
            <div className="dp-meta-item">
              <span className="dp-meta-label">Year</span>
              <span className="dp-meta-value">{project.year}</span>
            </div>
            {project.client && (
              <div className="dp-meta-item">
                <span className="dp-meta-label">Client</span>
                <span className="dp-meta-value">{project.client}</span>
              </div>
            )}
            {allImages.length > 1 && (
              <div className="dp-meta-item">
                <span className="dp-meta-label">Images</span>
                <span className="dp-meta-value">{allImages.length} files</span>
              </div>
            )}
          </div>

          <div className="dp-tools-section">
            <p className="dp-section-label">Tools Used</p>
            <div className="dp-tools-list">
              {project.tools.map(tool => (
                <span key={tool} className="dp-tool-tag" style={{ borderColor: `${project.color}66`, color: project.color }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="dp-tags-section">
            <p className="dp-section-label">Tags</p>
            <div className="dp-tags-list">
              {project.tags.map(tag => (
                <Link key={tag} href={`/about`} className="dp-tag">#{tag}</Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Description */}
        <motion.div className="dp-description" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="dp-desc-block">
            <h2 className="dp-desc-heading" style={{ color: project.color }}>
              <i className="fas fa-info-circle" /> About the Project
            </h2>
            <p className="dp-desc-text">{project.description}</p>
          </div>

          <div className="dp-desc-block" style={{ marginTop: '2rem' }}>
            <h2 className="dp-desc-heading" style={{ color: project.color }}>
              <i className="fas fa-lightbulb" /> The Concept
            </h2>
            <p className="dp-desc-text">{project.concept}</p>
          </div>

          {/* Image notes (if multiple) */}
          {allImages.length > 1 && (
            <div className="dp-concepts-list">
              <h2 className="dp-desc-heading" style={{ color: project.color }}>
                <i className="fas fa-images" /> Files in this Project
              </h2>
              <div className="dp-concepts-items">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`dp-concept-item ${i === activeImg ? 'active' : ''}`}
                    style={i === activeImg ? { borderColor: project.color, background: `${project.color}11` } : {}}
                    onClick={() => setActiveImg(i)}
                  >
                    <span className="dp-concept-num" style={{ color: project.color }}>0{i + 1}</span>
                    <div>
                      <p className="dp-concept-label">
                        {img.isChosen && <i className="fas fa-check-circle" style={{ color: project.color, marginRight: '0.3rem' }} />}
                        {img.label ?? `Image ${i + 1}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <a
            href="https://behance.net/isalebryan"
            target="_blank"
            rel="noopener noreferrer"
            className="dp-behance-cta"
            style={{ '--dp-color': project.color } as React.CSSProperties}
          >
            <i className="fab fa-behance" />
            <span>View Full Portfolio on Behance</span>
            <i className="fas fa-arrow-right dp-cta-arrow" />
          </a>
        </motion.div>
      </div>

      {/* ── Related Projects ── */}
      {related.length > 0 && (
        <motion.section
          className="dp-related"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="dp-related-heading">More <span className="text-secondary">Projects</span></h3>
          <div className="dp-related-grid">
            {related.map((rp, i) => (
              <motion.div key={rp.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Link href={`/work/design/${rp.slug}`} className="dp-related-card">
                  <div className="dp-related-img-wrap" style={{ borderColor: rp.color }}>
                    <img src={rp.primaryImage} alt={rp.title} />
                    {rp.images && rp.images.length > 1 && (
                      <span className="dp-related-multi"><i className="fas fa-images" /> {rp.images.length}</span>
                    )}
                    <div className="dp-related-overlay" style={{ background: `${rp.color}22` }} />
                  </div>
                  <div className="dp-related-info">
                    <span className="dp-related-category" style={{ color: rp.color }}>
                      {categoryLabel[rp.category]}
                    </span>
                    <p className="dp-related-title">{rp.title}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  )
}
