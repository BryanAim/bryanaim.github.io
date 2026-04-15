#!/usr/bin/env node
/**
 * compress-images.mjs
 *
 * Compresses a single image file to WebP if it exceeds the size threshold.
 * Used by the /update-design-projects skill.
 *
 * Usage:
 *   node agents/compress-images.mjs <path> [--quality 85] [--max-kb 300]
 *
 * Output:
 *   Prints the final public path (relative to project root) to stdout.
 *   - If compressed:  prints the new .webp path
 *   - If small enough: prints the original path unchanged
 *
 * The input path should be relative to the project root, e.g.:
 *   public/img/projects/design/logos/barbell-syndicate.jpg
 */

import sharp from 'sharp'
import { statSync, existsSync, unlinkSync } from 'fs'
import { resolve, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')

// ── Parse args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
if (!args.length || args[0].startsWith('--')) {
  console.error('Usage: node compress-images.mjs <path> [--quality 85] [--max-kb 300]')
  process.exit(1)
}

const inputRelative = args[0]
const qualityFlag = args.indexOf('--quality')
const maxKbFlag = args.indexOf('--max-kb')
const quality = qualityFlag !== -1 ? parseInt(args[qualityFlag + 1], 10) : 85
const maxKb = maxKbFlag !== -1 ? parseInt(args[maxKbFlag + 1], 10) : 300

const inputAbsolute = resolve(PROJECT_ROOT, inputRelative)

if (!existsSync(inputAbsolute)) {
  console.error(`File not found: ${inputAbsolute}`)
  process.exit(1)
}

// ── Check size ───────────────────────────────────────────────────────────────
const { size } = statSync(inputAbsolute)
const sizeKb = size / 1024

if (sizeKb <= maxKb) {
  // Already small enough — return original path unchanged
  // Normalise to forward slashes and ensure it starts with /img/...
  const publicPath = inputRelative.replace(/\\/g, '/').replace(/^public\//, '/')
  process.stdout.write(publicPath)
  process.exit(0)
}

// ── Compress to WebP ─────────────────────────────────────────────────────────
const ext = extname(inputAbsolute)
const outputAbsolute = inputAbsolute.replace(new RegExp(`\\${ext}$`), '.webp')
const outputRelative = inputRelative.replace(new RegExp(`\\${ext}$`), '.webp')

try {
  await sharp(inputAbsolute)
    .webp({ quality })
    .toFile(outputAbsolute)

  const newSize = statSync(outputAbsolute).size / 1024
  console.error(`Compressed: ${basename(inputAbsolute)} ${Math.round(sizeKb)}KB → ${Math.round(newSize)}KB (WebP q${quality})`)

  // Delete the original — WebP is the new source of truth
  unlinkSync(inputAbsolute)

  const publicPath = outputRelative.replace(/\\/g, '/').replace(/^public\//, '/')
  process.stdout.write(publicPath)
  process.exit(0)
} catch (err) {
  console.error(`Compression failed for ${inputRelative}:`, err.message)
  // Fall back to original path on error
  const publicPath = inputRelative.replace(/\\/g, '/').replace(/^public\//, '/')
  process.stdout.write(publicPath)
  process.exit(0)
}
