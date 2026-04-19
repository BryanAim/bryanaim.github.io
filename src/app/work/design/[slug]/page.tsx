'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const VIDEO_EXTS = /\.(mp4|mov|webm)$/i
const isVideo = (src: string) => VIDEO_EXTS.test(src)
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

  const currentIndex = designProjects.findIndex(p => p.slug === slug)
  const prevProject = currentIndex > 0 ? designProjects[currentIndex - 1] : null
  const nextProject = currentIndex < designProjects.length - 1 ? designProjects[currentIndex + 1] : null

  if (!project) {
    return (
      <main id="work" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h1 className="lg-heading">Project <span className="text-secondary">Not Found</span></h1>
        <Link href="/work" className="btn-light" style={{ marginTop: '2rem', display: 'inline-block' }}>
          ← Back to Work
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
    <main id="work" className="pb-20">
      {/* ── Breadcrumb + Top pagination ── */}
      <motion.div
        className="flex items-center gap-2 text-[0.82rem] text-white/40 mb-8 flex-wrap"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => router.back()}
          className="bg-transparent border border-white/15 text-white/60 px-[0.8rem] py-[0.3rem] rounded-[6px] cursor-pointer text-[0.8rem] transition-all duration-200 flex items-center gap-[0.4rem] hover:border-[#00ddd7] hover:text-[#00ddd7]"
        >
          <i className="fas fa-arrow-left" /> Back
        </button>
        <span className="text-white/20">/</span>
        <Link href="/work?tab=design" className="text-white/50 no-underline hover:text-[#00ddd7] transition-colors duration-200">
          Work
        </Link>
        <span className="text-white/20">/</span>
        <span style={{ color: project.color }}>{project.title}</span>

        {/* Top pagination */}
        <div className="flex items-center gap-2 ml-auto max-sm:hidden">
          {prevProject ? (
            <Link
              href={`/work/design/${prevProject.slug}`}
              className="flex items-center gap-[0.4rem] px-[0.6rem] py-[0.3rem] rounded-[6px] border border-white/[0.12] text-white/55 no-underline text-[0.72rem] transition-[border-color,color,background] duration-200 whitespace-nowrap max-w-[160px] overflow-hidden hover:border-[#00ddd7] hover:text-[#00ddd7] hover:bg-[rgba(0,221,215,0.06)]"
            >
              <i className="fas fa-chevron-left" />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{prevProject.title}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-[0.4rem] px-[0.6rem] py-[0.3rem] rounded-[6px] border border-white/[0.12] text-white/55 text-[0.72rem] whitespace-nowrap max-w-[160px] overflow-hidden opacity-20 cursor-default pointer-events-none">
              <i className="fas fa-chevron-left" />
            </span>
          )}
          <span className="text-[0.68rem] text-white/30 whitespace-nowrap px-1">
            {currentIndex + 1} <span className="mx-[0.15rem]">/</span> {designProjects.length}
          </span>
          {nextProject ? (
            <Link
              href={`/work/design/${nextProject.slug}`}
              className="flex items-center gap-[0.4rem] px-[0.6rem] py-[0.3rem] rounded-[6px] border border-white/[0.12] text-white/55 no-underline text-[0.72rem] transition-[border-color,color,background] duration-200 whitespace-nowrap max-w-[160px] overflow-hidden hover:border-[#00ddd7] hover:text-[#00ddd7] hover:bg-[rgba(0,221,215,0.06)]"
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{nextProject.title}</span>
              <i className="fas fa-chevron-right" />
            </Link>
          ) : (
            <span className="flex items-center gap-[0.4rem] px-[0.6rem] py-[0.3rem] rounded-[6px] border border-white/[0.12] text-white/55 text-[0.72rem] whitespace-nowrap max-w-[160px] overflow-hidden opacity-20 cursor-default pointer-events-none">
              <i className="fas fa-chevron-right" />
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Hero Image + Gallery ── */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main image / video */}
        <div
          className="relative border-2 rounded-[14px] overflow-hidden max-h-[520px]"
          style={{ borderColor: project.color, cursor: isVideo(currentImage.src) ? 'default' : 'zoom-in' }}
          onClick={() => { if (!isVideo(currentImage.src)) setLightbox(true) }}
        >
          <AnimatePresence mode="wait">
            {isVideo(currentImage.src) ? (
              <motion.video
                key={activeImg}
                src={currentImage.src}
                className="w-full h-full object-contain bg-black/40 block max-h-[520px]"
                controls
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            ) : (
              <motion.img
                key={activeImg}
                src={currentImage.src}
                alt={currentImage.label ?? project.title}
                className="w-full h-full object-contain bg-black/40 block max-h-[520px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
          {currentImage.isChosen && (
            <span
              className="absolute top-[0.7rem] left-[0.7rem] px-[0.8rem] py-[0.3rem] rounded-full text-[0.7rem] font-bold flex items-center gap-[0.35rem] z-[2]"
              style={{ background: project.color, color: '#000' }}
            >
              <i className="fas fa-check-circle" /> Chosen Design
            </span>
          )}
          {!isVideo(currentImage.src) && (
            <span className="absolute bottom-[0.7rem] right-[0.7rem] bg-black/55 text-white/70 w-8 h-8 rounded-full flex items-center justify-center text-[0.8rem] pointer-events-none backdrop-blur-sm">
              <i className="fas fa-search-plus" />
            </span>
          )}
          <div
            className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
            style={{ background: `linear-gradient(to top, ${project.color}22, transparent)` }}
          />
        </div>

        {/* Thumbnail strip (only if multiple images) — CSS classes kept for runtime CSS var */}
        {allImages.length > 1 && (
          <div className="dp-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                className={`dp-thumb${i === activeImg ? ' active' : ''}`}
                style={i === activeImg ? { borderColor: project.color } : {}}
                onClick={() => setActiveImg(i)}
              >
                {isVideo(img.src) ? (
                  <div className="dp-thumb-video-placeholder">
                    <i className="fas fa-play-circle" style={{ color: project.color }} />
                  </div>
                ) : (
                  <img src={img.src} alt={img.label ?? ''} />
                )}
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
            className="fixed inset-0 bg-black/[0.93] z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-[1.2rem] bg-white/10 border-none text-white w-10 h-10 rounded-full text-[1.1rem] cursor-pointer transition-[background] duration-200 hover:bg-white/20"
              onClick={() => setLightbox(false)}
            >
              ✕
            </button>
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/10 border-none text-white w-11 h-11 rounded-full text-[1rem] cursor-pointer transition-[background] duration-200 hover:bg-white/20"
                  onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + allImages.length) % allImages.length) }}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/10 border-none text-white w-11 h-11 rounded-full text-[1rem] cursor-pointer transition-[background] duration-200 hover:bg-white/20"
                  onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % allImages.length) }}
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
            {isVideo(currentImage.src) ? (
              <motion.video
                key={activeImg}
                src={currentImage.src}
                className="max-w-[90vw] max-h-[88vh] object-contain rounded-[6px] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                controls
                autoPlay
                playsInline
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.img
                key={activeImg}
                src={currentImage.src}
                alt={currentImage.label ?? project.title}
                className="max-w-[90vw] max-h-[88vh] object-contain rounded-[6px] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
            {currentImage.label && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 px-4 py-[0.4rem] rounded-[20px] text-[0.78rem] whitespace-nowrap backdrop-blur-sm">
                {currentImage.label}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="grid grid-cols-[280px_1fr] gap-12 mb-16 max-[900px]:grid-cols-1">
        {/* Left: Meta */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="inline-flex items-center gap-2 border rounded-full px-[0.9rem] py-[0.35rem] text-[0.75rem] font-bold uppercase tracking-[0.5px] mb-4"
            style={{ borderColor: project.color, color: project.color }}
          >
            <i className={categoryIcon[project.category]} />
            {categoryLabel[project.category]}
          </div>

          <h1
            className="text-[1.7rem] max-sm:text-[1.3rem] font-extrabold mt-0 mb-6 leading-[1.2]"
            style={{ color: project.color }}
          >
            {project.title}
          </h1>

          <div className="flex flex-col gap-[0.7rem] mb-6">
            <div className="flex flex-col gap-[0.1rem]">
              <span className="text-[0.7rem] uppercase tracking-[0.5px] text-white/35">Year</span>
              <span className="text-[0.88rem] text-white/80">{project.year}</span>
            </div>
            {project.client && (
              <div className="flex flex-col gap-[0.1rem]">
                <span className="text-[0.7rem] uppercase tracking-[0.5px] text-white/35">Client</span>
                <span className="text-[0.88rem] text-white/80">{project.client}</span>
              </div>
            )}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-[0.1rem]">
                <span className="text-[0.7rem] uppercase tracking-[0.5px] text-white/35">Images</span>
                <span className="text-[0.88rem] text-white/80">{allImages.length} files</span>
              </div>
            )}
          </div>

          <div className="mb-[1.2rem]">
            <p className="text-[0.7rem] uppercase tracking-[0.5px] text-white/35 mt-0 mb-2">Tools Used</p>
            <div className="flex flex-wrap gap-[0.4rem]">
              {project.tools.map(tool => (
                <span
                  key={tool}
                  className="px-[0.65rem] py-[0.25rem] border rounded-[6px] text-[0.73rem] bg-white/[0.03]"
                  style={{ borderColor: `${project.color}66`, color: project.color }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-[1.2rem]">
            <p className="text-[0.7rem] uppercase tracking-[0.5px] text-white/35 mt-0 mb-2">Tags</p>
            <div className="flex flex-wrap gap-[0.4rem]">
              {project.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/work?tab=design&tag=${tag}&from=${project.slug}`}
                  className="text-[0.73rem] text-white/40 no-underline transition-colors duration-200 hover:text-[#b1db00]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Description */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6">
            <h2
              className="text-[1rem] font-bold uppercase tracking-[0.5px] mt-0 mb-[0.7rem] flex items-center gap-2"
              style={{ color: project.color }}
            >
              <i className="fas fa-info-circle" /> About the Project
            </h2>
            <p className="text-white/65 leading-[1.75] text-[0.92rem] m-0">{project.description}</p>
          </div>

          <div className="mt-8 mb-6">
            <h2
              className="text-[1rem] font-bold uppercase tracking-[0.5px] mt-0 mb-[0.7rem] flex items-center gap-2"
              style={{ color: project.color }}
            >
              <i className="fas fa-lightbulb" /> The Concept
            </h2>
            <p className="text-white/65 leading-[1.75] text-[0.92rem] m-0">{project.concept}</p>
          </div>

          {/* Image notes (if multiple) */}
          {allImages.length > 1 && (
            <div className="mt-8 mb-6">
              <h2
                className="text-[1rem] font-bold uppercase tracking-[0.5px] mt-0 mb-[0.7rem] flex items-center gap-2"
                style={{ color: project.color }}
              >
                <i className="fas fa-images" /> Files in this Project
              </h2>
              <div className="flex flex-col gap-2 mt-[0.6rem]">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`flex items-center gap-[0.8rem] px-[0.9rem] py-[0.6rem] bg-white/[0.03] border border-white/[0.07] rounded-[8px] cursor-pointer transition-all duration-200 text-left hover:bg-white/[0.06]${i === activeImg ? ' !border-current' : ''}`}
                    style={i === activeImg ? { borderColor: project.color, background: `${project.color}11` } : {}}
                    onClick={() => setActiveImg(i)}
                  >
                    <span className="text-[1.1rem] font-extrabold opacity-50" style={{ color: project.color }}>
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-[0.83rem] text-white/75 m-0 font-medium">
                        {img.isChosen && <i className="fas fa-check-circle" style={{ color: project.color, marginRight: '0.3rem' }} />}
                        {img.label ?? `Image ${i + 1}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Behance CTA — CSS class kept: .dp-behance-cta:hover uses --dp-color runtime var */}
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

      {/* ── Bottom Pagination ── */}
      <motion.div
        className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 my-12 pt-10 border-t border-white/[0.07]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        {prevProject ? (
          <Link
            href={`/work/design/${prevProject.slug}`}
            className="flex items-center gap-[0.9rem] p-[0.9rem] rounded-[10px] border border-white/[0.08] no-underline transition-[border-color,background,transform] duration-[250ms] overflow-hidden hover:border-white/25 hover:bg-white/[0.04] hover:-translate-y-0.5"
          >
            <div className="shrink-0 w-16 h-16 rounded-[6px] overflow-hidden">
              <img src={prevProject.primaryImage} alt={prevProject.title} className="w-full h-full object-cover block" />
            </div>
            <div className="min-w-0 flex flex-col gap-[0.2rem]">
              <span className="text-[0.65rem] uppercase tracking-[0.6px] text-white/30">
                <i className="fas fa-arrow-left" /> Previous
              </span>
              <p className="text-[0.88rem] font-bold m-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: prevProject.color }}>
                {prevProject.title}
              </p>
              <span className="text-[0.65rem] text-white/30">{categoryLabel[prevProject.category]}</span>
            </div>
          </Link>
        ) : <div />}
        {nextProject ? (
          <Link
            href={`/work/design/${nextProject.slug}`}
            className="flex flex-row-reverse max-sm:flex-row items-center gap-[0.9rem] p-[0.9rem] rounded-[10px] border border-white/[0.08] no-underline transition-[border-color,background,transform] duration-[250ms] overflow-hidden text-right max-sm:text-left hover:border-white/25 hover:bg-white/[0.04] hover:-translate-y-0.5"
          >
            <div className="shrink-0 w-16 h-16 rounded-[6px] overflow-hidden">
              <img src={nextProject.primaryImage} alt={nextProject.title} className="w-full h-full object-cover block" />
            </div>
            <div className="min-w-0 flex flex-col gap-[0.2rem] items-end max-sm:items-start">
              <span className="text-[0.65rem] uppercase tracking-[0.6px] text-white/30">
                Next <i className="fas fa-arrow-right" />
              </span>
              <p className="text-[0.88rem] font-bold m-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: nextProject.color }}>
                {nextProject.title}
              </p>
              <span className="text-[0.65rem] text-white/30">{categoryLabel[nextProject.category]}</span>
            </div>
          </Link>
        ) : <div />}
      </motion.div>

      {/* ── Related Projects ── */}
      {related.length > 0 && (
        <motion.section
          className="pt-12 border-t border-white/[0.07]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-[1.5rem] font-bold mb-6 uppercase tracking-[0.5px]">
            More <span className="text-secondary">Projects</span>
          </h3>
          {/* dp-related-card, dp-related-img-wrap, dp-related-overlay kept in CSS:
              child image scale + overlay opacity are triggered by parent hover —
              WebKit corner-bleed concern with scale inside overflow:hidden + rounded */}
          <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-sm:grid-cols-1 gap-[1.2rem]">
            {related.map((rp, i) => (
              <motion.div
                key={rp.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/work/design/${rp.slug}`} className="dp-related-card">
                  <div className="dp-related-img-wrap" style={{ borderColor: rp.color }}>
                    <img src={rp.primaryImage} alt={rp.title} />
                    {rp.images && rp.images.length > 1 && (
                      <span className="absolute top-[0.4rem] right-[0.4rem] bg-black/65 text-white/75 text-[0.6rem] px-[0.4rem] py-[0.15rem] rounded-[4px] backdrop-blur-sm">
                        <i className="fas fa-images" /> {rp.images.length}
                      </span>
                    )}
                    <div className="dp-related-overlay" style={{ background: `${rp.color}22` }} />
                  </div>
                  <div className="px-[0.9rem] py-[0.75rem]">
                    <span
                      className="text-[0.68rem] uppercase tracking-[0.5px] font-semibold"
                      style={{ color: rp.color }}
                    >
                      {categoryLabel[rp.category]}
                    </span>
                    <p className="text-[0.85rem] text-white/80 mt-[0.2rem] mb-0 font-semibold">{rp.title}</p>
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
