'use client'

import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import styles from './custom.module.css'
import {
  TSHIRT_COLORS, TSHIRT_SIZES, calcStickerPrice,
  loadCart, saveCart, CartItem, TshirtColor,
} from '@/lib/shopTypes'

// 1 cm at 96 DPI ≈ 37.8 px — used for the size visualizer
const PX_PER_CM = 37.8
// Cap the visualizer box so it fits on screen
const MAX_VIZ_PX = 220

type CustomType = 'custom_sticker' | 'custom_tshirt'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

/** Resize image to a small thumbnail via canvas for storing in localStorage */
async function makeThumbnail(file: File, size = 80): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      // Crop to square from center
      const s = Math.min(img.naturalWidth, img.naturalHeight)
      const sx = (img.naturalWidth - s) / 2
      const sy = (img.naturalHeight - s) / 2
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size)
      resolve(canvas.toDataURL('image/jpeg', 0.72))
      URL.revokeObjectURL(url)
    }
    img.onerror = reject
    img.src = url
  })
}

export default function CustomOrderPage() {
  const [type, setType] = useState<CustomType>('custom_sticker')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [fileError, setFileError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  // Sticker size
  const [width, setWidth] = useState(5)
  const [height, setHeight] = useState(5)

  // T-shirt options
  const [color, setColor] = useState<TshirtColor>(TSHIRT_COLORS[0])
  const [size, setSize] = useState('')

  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [added, setAdded] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Reset on type change
  useEffect(() => {
    setFile(null); setPreview(''); setFileError('')
    setWidth(5); setHeight(5)
    setColor(TSHIRT_COLORS[0]); setSize('')
    setQty(1); setNotes(''); setAdded(false)
  }, [type])

  const validateAndSetFile = useCallback((f: File) => {
    setFileError('')
    if (!ALLOWED_MIME.has(f.type)) {
      setFileError('Unsupported file type. Use JPG, PNG, WEBP, or GIF.')
      return
    }
    if (f.size > MAX_FILE_BYTES) {
      setFileError('File is too large. Max 5 MB.')
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) validateAndSetFile(f)
    e.target.value = '' // allow re-selecting same file
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSetFile(f)
  }

  const clearFile = () => {
    setFile(null)
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview('')
    setFileError('')
  }

  // Pricing
  const stickerPrice = calcStickerPrice(width, height)
  const tshirtPrice = 1000
  const unitPrice = type === 'custom_sticker' ? stickerPrice : tshirtPrice
  const totalPrice = unitPrice * qty

  // Size visualizer scale
  const rawW = width * PX_PER_CM
  const rawH = height * PX_PER_CM
  const scale = Math.min(1, MAX_VIZ_PX / Math.max(rawW, rawH))
  const vizW = Math.round(rawW * scale)
  const vizH = Math.round(rawH * scale)

  // Can submit
  const canAdd =
    !!file &&
    !fileError &&
    (type === 'custom_sticker' || !!size)

  const handleAddToCart = async () => {
    if (!canAdd || !file) return
    setUploading(true)
    setAdded(false)

    try {
      // 1. Upload design to server
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }))
        setFileError(err.error ?? 'Upload failed — please try again')
        setUploading(false)
        return
      }

      const { designId } = await res.json()

      // 2. Generate thumbnail for cart display (≈ 2 KB)
      const thumbnail = await makeThumbnail(file)

      // 3. Build cart item
      const cartId = type === 'custom_sticker'
        ? `${type}-${designId}-${width}x${height}`
        : `${type}-${designId}-${color.name}-${size}`

      const item: CartItem = {
        cartId,
        productId: `custom-${designId}`,
        name: type === 'custom_sticker'
          ? `Custom Sticker ${width}×${height} cm`
          : `Custom T-Shirt — ${color.label} / ${size}`,
        price: unitPrice,
        image: thumbnail,
        quantity: qty,
        type,
        designId,
        notes: notes.trim() || undefined,
        ...(type === 'custom_tshirt' && { color, size }),
        ...(type === 'custom_sticker' && { widthCm: width, heightCm: height }),
      }

      // 4. Merge into existing cart
      const existing = loadCart()
      const idx = existing.findIndex(i => i.cartId === cartId)
      const updated = idx >= 0
        ? existing.map((i, n) => n === idx ? { ...i, quantity: i.quantity + qty } : i)
        : [...existing, item]

      saveCart(updated)
      setAdded(true)
      setTimeout(() => { window.location.href = '/shop' }, 1500)
    } catch {
      setFileError('Something went wrong — please try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main id="shop">
      <nav className="mb-4">
        <Link href="/shop" className="text-[#888] text-[0.85rem] no-underline transition-colors duration-150 hover:text-lime">← Back to Shop</Link>
      </nav>
      <h1 className="text-[clamp(3rem,10vw,7rem)] mb-[0.2rem] text-center font-semibold max-sm:leading-none max-sm:mb-4">
        Custom <span className="text-lime">Order</span>
      </h1>
      <h2 className="mb-12 py-[0.2rem] px-4 bg-[rgba(73,73,73,0.5)] text-center font-semibold">
        Upload your design — we print &amp; deliver in Nakuru
      </h2>

      {/* Type selector */}
      <div className={styles.typeGrid}>
        <button
          className={`${styles.typeCard} ${type === 'custom_sticker' ? styles.typeCardActive : ''}`}
          onClick={() => setType('custom_sticker')}
        >
          <div className={styles.typeIcon}>🏷️</div>
          <p className={styles.typeName}>Custom Sticker</p>
          <p className={styles.typeDesc}>From 3×3 cm to 15×15 cm<br />From KES 30</p>
        </button>
        <button
          className={`${styles.typeCard} ${type === 'custom_tshirt' ? styles.typeCardActive : ''}`}
          onClick={() => setType('custom_tshirt')}
        >
          <div className={styles.typeIcon}>👕</div>
          <p className={styles.typeName}>Custom T-Shirt</p>
          <p className={styles.typeDesc}>5 colours · XS–XXL · Adult sizes<br />KES 1,000</p>
        </button>
      </div>

      <div className={styles.builder}>
        {/* Left: upload */}
        <div>
          <p className={styles.fieldLabel}>Your Design</p>
          <div
            className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDrag : ''} ${file ? styles.uploadZoneHasFile : ''}`}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={styles.uploadInput}
              onChange={handleFileChange}
              aria-label="Upload your design"
            />
            {!file ? (
              <div className={styles.uploadPrompt}>
                <span className={styles.uploadIcon}>📎</span>
                <strong>Drag &amp; drop or click to upload</strong>
                <p>JPG, PNG, WEBP, GIF · Max 5 MB</p>
                <p>Use high resolution for best print quality (300 DPI recommended)</p>
              </div>
            ) : (
              <>
                <img src={preview} alt="Design preview" className={styles.uploadPreview} />
                <div className={styles.uploadMeta}>
                  <span className={styles.uploadFileName}>{file.name}</span>
                  <button className={styles.uploadClear} onClick={e => { e.stopPropagation(); clearFile() }}>
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
          {fileError && <p className={styles.uploadError}>{fileError}</p>}

          {/* Pricing guide — sticker only */}
          {type === 'custom_sticker' && (
            <div className={styles.pricingGuide} style={{ marginTop: '1rem' }}>
              <h4>Sticker Pricing Guide</h4>
              {[
                ['3 × 3 cm (min)', 30],
                ['5 × 5 cm (standard)', 50],
                ['7 × 7 cm', 98],
                ['10 × 10 cm', 200],
                ['15 × 15 cm (max)', 450],
              ].map(([label, price]) => (
                <div key={String(label)} className={styles.pricingRow}>
                  <span>{label}</span>
                  <strong>KES {price}</strong>
                </div>
              ))}
              <div className={styles.pricingRow} style={{ marginTop: '0.5rem', borderTop: '1px solid #555' }}>
                <span style={{ color: '#aaa', fontSize: '0.73rem' }}>Price = max(30, round(W × H × 2))</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: controls */}
        <div className={styles.controls}>

          {/* Sticker: dimension sliders */}
          {type === 'custom_sticker' && (
            <>
              <div>
                <p className={styles.fieldLabel}>Width</p>
                <div className={styles.sliderRow}>
                  <input
                    type="range" min={3} max={15} step={0.5} value={width}
                    onChange={e => setWidth(Number(e.target.value))}
                    className={styles.slider}
                    aria-label="Sticker width in cm"
                  />
                  <span className={styles.sliderVal}>{width} cm</span>
                </div>
              </div>
              <div>
                <p className={styles.fieldLabel}>Height</p>
                <div className={styles.sliderRow}>
                  <input
                    type="range" min={3} max={15} step={0.5} value={height}
                    onChange={e => setHeight(Number(e.target.value))}
                    className={styles.slider}
                    aria-label="Sticker height in cm"
                  />
                  <span className={styles.sliderVal}>{height} cm</span>
                </div>
              </div>

              {/* Actual-size visualizer */}
              <div className={styles.sizeViz}>
                <p className={styles.sizeVizLabel}>
                  Approximate actual size on screen{scale < 1 ? ' (scaled to fit)' : ''}
                </p>
                <div className={styles.sizeVizArea}>
                  <div
                    className={styles.sizeVizBox}
                    style={{ width: vizW, height: vizH }}
                  >
                    {preview
                      ? <img src={preview} alt="size preview" className={styles.sizeVizImg} />
                      : <span className={styles.sizeVizPlaceholder}>your<br />design</span>
                    }
                  </div>
                  <div className={styles.sizeVizDims}>
                    <p style={{ margin: '0 0 0.25rem' }}><strong>{width} cm</strong> wide</p>
                    <p style={{ margin: 0 }}><strong>{height} cm</strong> tall</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* T-shirt: color + size */}
          {type === 'custom_tshirt' && (
            <>
              <div>
                <p className={styles.fieldLabel}>
                  Colour <span className={styles.colorName}>— {color.label}</span>
                </p>
                <div className={styles.colorPicker}>
                  {TSHIRT_COLORS.map(c => (
                    <button
                      key={c.name}
                      className={`${styles.colorSwatch} ${color.name === c.name ? styles.colorSwatchActive : ''}`}
                      style={{ background: c.hex, borderColor: c.name === 'white' ? '#888' : 'transparent' }}
                      title={c.label}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className={styles.fieldLabel}>
                  Size {!size && <span style={{ color: '#ff6b6b' }}>— required</span>}
                </p>
                <div className={styles.sizePicker}>
                  {TSHIRT_SIZES.map(s => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${size === s ? styles.sizeBtnActive : ''}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Quantity */}
          <div>
            <p className={styles.fieldLabel}>Quantity</p>
            <div className={styles.qtyRow}>
              <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span className={styles.qtyNum}>{qty}</span>
              <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(50, q + 1))} aria-label="Increase quantity">+</button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className={styles.fieldLabel}>Notes for printer (optional)</p>
            <textarea
              className={styles.textarea}
              placeholder="e.g. Keep background transparent, use original colours, any special instructions…"
              value={notes}
              onChange={e => setNotes(e.target.value.slice(0, 300))}
              aria-label="Printer notes"
            />
            <p className={styles.charCount}>{notes.length}/300</p>
          </div>

          {/* Price summary */}
          <div className={styles.priceBox}>
            <div>
              <p className={styles.priceLabel}>
                {qty > 1 ? `${qty} × KES ${unitPrice.toLocaleString()} =` : 'Price'}
              </p>
              <p className={styles.priceSubtext}>
                {type === 'custom_sticker'
                  ? `${width} × ${height} cm sticker`
                  : `Custom T-Shirt · ${color.label}${size ? ` · ${size}` : ''}`
                }
              </p>
            </div>
            <span className={styles.priceVal}>KES {totalPrice.toLocaleString()}</span>
          </div>

          {/* CTA */}
          {added ? (
            <p className={styles.successMsg}>Added to cart! Taking you to shop…</p>
          ) : uploading ? (
            <p className={styles.uploadingMsg}>
              Uploading design<span className={styles.dot}>.</span><span className={styles.dot}>.</span><span className={styles.dot}>.</span>
            </p>
          ) : (
            <button
              className={styles.addBtn}
              onClick={handleAddToCart}
              disabled={!canAdd}
              aria-disabled={!canAdd}
            >
              {!file
                ? 'Upload a design first'
                : type === 'custom_tshirt' && !size
                  ? 'Select a size first'
                  : `Add to Cart — KES ${totalPrice.toLocaleString()}`
              }
            </button>
          )}

          <p style={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
            Your design is stored securely and only used to fulfil your order.
            We will contact you to confirm details before printing.
          </p>
        </div>
      </div>
    </main>
  )
}
