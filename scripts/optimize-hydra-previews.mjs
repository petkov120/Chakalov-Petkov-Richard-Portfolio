import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'

const directory = 'public/images/playground/cars'
let before = 0, after = 0
for (const file of await readdir(directory)) {
  if (!file.endsWith('.png')) continue
  const source = directory + '/' + file
  const output = source.replace(/\.png$/, '.webp')
  await sharp(source).resize({ width: 768, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output)
  before += (await stat(source)).size
  after += (await stat(output)).size
}
console.log({ sourceBytes: before, previewBytes: after })
