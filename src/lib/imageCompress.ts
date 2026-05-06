/**
 * Compress an image file client-side using the Canvas API.
 * Resizes to maxPx on the longest side, converts to JPEG at given quality.
 * Typical output: 80–200 KB for a 12 MP phone photo.
 */
export function compressImage(file: File, maxPx = 1000, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const { naturalWidth: w, naturalHeight: h } = img
      const scale = Math.min(1, maxPx / Math.max(w, h))
      const cw = Math.round(w * scale)
      const ch = Math.round(h * scale)

      const canvas = document.createElement('canvas')
      canvas.width = cw
      canvas.height = ch
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0, cw, ch)

      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('Compression failed')); return }
        const outName = file.name.replace(/\.[^.]+$/, '.jpg')
        resolve(new File([blob], outName, { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Image load failed')) }
    img.src = objectUrl
  })
}
