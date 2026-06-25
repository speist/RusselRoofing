// Convert each post's Elementor-wrapped bodyHtml -> clean Portable Text.
// - Text/headings/lists/links  -> Portable Text blocks
// - Distinct inline images      -> image blocks (via _sanityAsset, importer fetches them)
// - Inline image == featured    -> dropped (it's just the hero repeated)
// - "missing-image.png" etc     -> dropped (broken placeholders)
// Input/Output: ../sanity-blog-import.ndjson  (recomputes `body` from bodyHtml each run)
import {htmlToBlocks} from '@sanity/block-tools'
import {Schema} from '@sanity/schema'
import {JSDOM} from 'jsdom'
import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import {fileURLToPath} from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const NDJSON = path.join(HERE, '..', 'sanity-blog-import.ndjson')
const IMG_DIR = path.join(HERE, '..', 'images')

const schema = Schema.compile({
  name: 'default',
  types: [{
    name: 'post', type: 'document',
    fields: [{name: 'body', type: 'array', of: [{type: 'block'}, {type: 'image'}]}],
  }],
})
const blockType = schema.get('post').fields.find(f => f.name === 'body').type

const baseName = u => (u || '').split('?')[0].split('/').pop().toLowerCase()
const isBroken = u => /missing-image|placeholder|spacer\.gif/i.test(u || '')

let k = 0
const key = () => `k${(k++).toString(36)}`
function withKeys(blocks) {
  return blocks.map(b => {
    const nb = {...b, _key: b._key || key()}
    if (Array.isArray(nb.children)) nb.children = nb.children.map(c => ({...c, _key: c._key || key()}))
    if (Array.isArray(nb.markDefs)) nb.markDefs = nb.markDefs.map(m => ({...m, _key: m._key || key()}))
    return nb
  })
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest)
    https.get(url, {headers: {'User-Agent': UA}}, res => {
      if (res.statusCode !== 200) { file.close(); fs.rmSync(dest, {force: true}); return resolve(false) }
      res.pipe(file); file.on('finish', () => file.close(() => resolve(true)))
    }).on('error', () => { file.close(); fs.rmSync(dest, {force: true}); resolve(false) })
  })
}

function clean(html) {
  const doc = new JSDOM(html).window.document
  doc.querySelectorAll('script, style, link, noscript').forEach(n => n.remove())
  return doc.body.innerHTML
}

const lines = fs.readFileSync(NDJSON, 'utf8').split('\n').filter(Boolean)
let converted = 0, emptyBody = 0, totalBlocks = 0, embeddedImgs = 0, droppedDup = 0, droppedBroken = 0
const inlineToDownload = []

const out = lines.map(line => {
  const doc = JSON.parse(line)
  const featBase = baseName(doc.mainImage?._sanityAsset?.replace('image@', '') || doc.originalUrl)
  const slug = doc.slug.current

  // Custom rule: turn <img> into either an image block (_sanityAsset) or drop it
  const rules = [{
    deserialize(el, next, block) {
      if (el.tagName?.toLowerCase() !== 'img') return undefined
      const src = el.getAttribute('src') || ''
      if (!src || isBroken(src)) { droppedBroken++; return block({_type: '__skip'}) }
      if (baseName(src) === featBase) { droppedDup++; return block({_type: '__skip'}) }
      embeddedImgs++
      const ext = (baseName(src).match(/\.[a-z0-9]+$/i) || ['.jpg'])[0]
      const fname = `inline-${slug}-${embeddedImgs}${ext}`
      inlineToDownload.push([src, path.join(IMG_DIR, fname)])
      return block({_type: 'image', _sanityAsset: `image@${src}`, _localBackup: `images/${fname}`})
    },
  }]

  const blocks = withKeys(
    htmlToBlocks(clean(doc.bodyHtml || ''), blockType, {
      parseHtml: h => new JSDOM(h).window.document,
      rules,
    }).filter(b => b._type !== '__skip')
  )
  if (!blocks.length) emptyBody++
  totalBlocks += blocks.length
  converted++
  return JSON.stringify({...doc, body: blocks})
})

fs.writeFileSync(NDJSON, out.join('\n') + '\n')

// Download the distinct inline images for local backup
let dlOk = 0
for (const [url, dest] of inlineToDownload) { if (await download(url, dest)) dlOk++ }

console.log(`Converted: ${converted} posts, ${totalBlocks} blocks, ${emptyBody} empty`)
console.log(`Inline images embedded as image blocks: ${embeddedImgs} (downloaded ${dlOk} locally)`)
console.log(`Inline images dropped: ${droppedDup} hero-duplicates, ${droppedBroken} broken/placeholder`)
