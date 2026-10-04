import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { draco, prune } from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import sharp from 'sharp'

// Only CC0 graphical assets are used; no MakeHuman application code is bundled.
const revision = 'a8bc2d54ff0ac92e78ff71431b1023eda42bf482'
const source = `https://raw.githubusercontent.com/makehumancommunity/makehuman/${revision}/makehuman/data/`
const cache = join(tmpdir(), 'efootball-model-source')
await mkdir(cache, { recursive: true })
async function asset(path) {
  const file = join(cache, path.replaceAll('/', '_'))
  try { return await readFile(file, 'utf8') } catch {
    execFileSync('curl', ['--fail', '--location', '--silent', '--max-time', '60', source + path, '-o', file])
    return readFile(file, 'utf8')
  }
}

const vertices = [], faces = []
let group = ''
// Preserve original OBJ vertex IDs, which the supplied morphs and weights address.
for (const line of (await asset('3dobjs/base.obj')).split('\n')) {
  const [tag, ...values] = line.trim().split(/\s+/)
  if (tag === 'v') vertices.push(values.map(Number))
  if (tag === 'g') group = values[0]
  if (tag === 'f') {
    const ids = values.map(value => Number(value.split('/')[0]) - 1)
    for (let i = 1; i < ids.length - 1; i++) faces.push({ ids: [ids[0], ids[i], ids[i + 1]], group })
  }
}
for (const [path, influence] of [
  ['macrodetails/caucasian-male-young.target', 1],
  ['macrodetails/universal-male-young-maxmuscle-averageweight.target', 0.42],
]) {
  for (const line of (await asset(`targets/${path}`)).split('\n')) {
    if (!/^\d/.test(line)) continue
    const [id, ...delta] = line.split(/\s+/).map(Number)
    delta.forEach((value, axis) => { vertices[id][axis] += value * influence })
  }
}
const ground = Math.min(...vertices.slice(0, 13380).map(v => v[1]))
vertices.forEach(v => { v[0] *= 0.1; v[1] = (v[1] - ground) * 0.1; v[2] *= 0.1 })
const rig = JSON.parse(await asset('rigs/default.mhskel'))
const weights = JSON.parse(await asset('rigs/default_weights.mhw')).weights
const definitions = [
  ['Hips', 'root', null], ['Spine', 'spine03', 'Hips'], ['Chest', 'spine01', 'Spine'],
  ['Neck', 'neck01', 'Chest'], ['Head', 'head', 'Neck'],
  ...['L', 'R'].flatMap(side => [
    [`UpperArm_${side}`, `upperarm01.${side}`, 'Chest'],
    [`ForeArm_${side}`, `lowerarm01.${side}`, `UpperArm_${side}`],
    [`Hand_${side}`, `wrist.${side}`, `ForeArm_${side}`],
    [`Thigh_${side}`, `upperleg01.${side}`, 'Hips'],
    [`Shin_${side}`, `lowerleg01.${side}`, `Thigh_${side}`],
    [`Foot_${side}`, `foot.${side}`, `Shin_${side}`],
  ]),
]
const average = ids => ids.reduce((sum, id) => sum.add(new THREE.Vector3(...vertices[id])), new THREE.Vector3()).divideScalar(ids.length)
const locations = Object.fromEntries(definitions.map(([name, original]) => [name, average(rig.joints[rig.bones[original].head])]))
function mappedBone(name) {
  const side = name.endsWith('.L') ? 'L' : 'R'
  if (name.startsWith('upperarm')) return `UpperArm_${side}`
  if (name.startsWith('lowerarm')) return `ForeArm_${side}`
  if (/wrist|finger|metacarpal/.test(name)) return `Hand_${side}`
  if (name.startsWith('upperleg')) return `Thigh_${side}`
  if (name.startsWith('lowerleg')) return `Shin_${side}`
  if (/foot|toe/.test(name)) return `Foot_${side}`
  if (name.startsWith('neck')) return 'Neck'
  if (/spine0[12]|shoulder|clavicle|scapula|breast/.test(name)) return 'Chest'
  if (/spine/.test(name)) return 'Spine'
  if (/root|pelvis/.test(name)) return 'Hips'
  return 'Head'
}
const influences = vertices.map(() => new Map())
for (const [name, values] of Object.entries(weights)) {
  const bone = definitions.findIndex(([id]) => id === mappedBone(name))
  for (const [id, weight] of values) influences[id].set(bone, (influences[id].get(bone) || 0) + weight)
}
const vertexWeights = influences.map(map => {
  const sorted = [...map].sort((a, b) => b[1] - a[1]).slice(0, 4)
  if (!sorted.length) sorted.push([0, 1])
  const sum = sorted.reduce((s, [, value]) => s + value, 0)
  return { ids: Array.from({ length: 4 }, (_, i) => sorted[i]?.[0] || 0), values: Array.from({ length: 4 }, (_, i) => (sorted[i]?.[1] || 0) / sum) }
})
const normals = vertices.map(() => new THREE.Vector3())
for (const face of faces.filter(f => ['body', 'helper-tights'].includes(f.group))) {
  const [a, b, c] = face.ids.map(i => new THREE.Vector3(...vertices[i]))
  const normal = b.sub(a).cross(c.sub(a))
  face.ids.forEach(i => normals[i].add(normal))
}
normals.forEach(n => n.normalize())

const doc = new Document()
const buffer = doc.createBuffer()
const scene = doc.createScene('Football training player')
const root = doc.createNode('CoverForward').setExtras({ height: 1.78, source: 'MakeHuman CC0 base; custom football kit, hair, beard and rig' })
scene.addChild(root)
const boneNodes = Object.fromEntries(definitions.map(([name]) => [name, doc.createNode(name)]))
for (const [name, , parent] of definitions) {
  boneNodes[name].setTranslation(locations[name].clone().sub(parent ? locations[parent] : new THREE.Vector3()).toArray())
  ;(parent ? boneNodes[parent] : root).addChild(boneNodes[name])
}
function accessor(name, type, array) { return doc.createAccessor(name).setType(type).setArray(array).setBuffer(buffer) }
const skin = doc.createSkin('FootballerRig').setSkeleton(boneNodes.Hips)
definitions.forEach(([name]) => skin.addJoint(boneNodes[name]))
skin.setInverseBindMatrices(accessor('BindPose', 'MAT4', new Float32Array(definitions.flatMap(([name]) => new THREE.Matrix4().makeTranslation(...locations[name].clone().negate().toArray()).toArray()))))

const color = value => new THREE.Color(value)
function material(name, hex, roughness = 0.8) {
  return doc.createMaterial(name).setBaseColorFactor([...color(hex).toArray(), 1]).setMetallicFactor(0).setRoughnessFactor(roughness)
}
const skinMat = material('Skin', '#ffffff', 0.66)
const hairMat = material('Hair', '#ffffff', 0.86)
const shirtMat = material('Jersey', '#ffffff', 0.93)
const shortsMat = material('Shorts', '#12345b', 0.94)
const sockMat = material('Socks', '#173c63', 0.96)
const bootMat = material('Boots', '#f2e8b0', 0.5)
const soleMat = material('Soles', '#34373a', 0.78)
const whiteMat = material('Eye whites', '#dcd4c7', 0.28)
const irisMat = material('Iris', '#4b3520', 0.3)
const blackMat = material('Pupil', '#121210', 0.24)
const kit = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
<defs><pattern id="fabric" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0h6M0 3h6" stroke="#fff" stroke-opacity=".025"/></pattern></defs>
<path fill="#153755" d="M0 0h1024v1024H0z"/><path fill="#c42a45" d="M205 0h102v1024H205z"/><path fill="#e6d8c1" d="M199 0h5v1024h-5zM308 0h5v1024h-5z"/>
<path fill="url(#fabric)" d="M0 0h1024v1024H0z"/>
<circle cx="357" cy="225" r="30" fill="#102a46" stroke="#dcd5b7" stroke-width="3"/><path d="m357 204-15 36h30z" fill="#e15363"/>
<text x="256" y="505" text-anchor="middle" font-family="sans-serif" font-size="47" fill="#eee4c9">PARIS</text>
<text x="768" y="252" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="51" fill="#f3eee2">MESSI</text>
<text x="768" y="672" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="360" fill="#f3eee2">10</text>
</svg>`)).png().toBuffer()
shirtMat.setBaseColorTexture(doc.createTexture('Navy red football kit').setImage(kit).setMimeType('image/png'))

const buckets = new Map()
function bucket(mat) {
  if (!buckets.has(mat)) buckets.set(mat, { position: [], normal: [], color: [], uv: [], skinIndex: [], skinWeight: [] })
  return buckets.get(mat)
}
function vertex(mat, point, normal, tint, influence, uv = [0, 0]) {
  const b = bucket(mat)
  b.position.push(...point); b.normal.push(...normal); b.color.push(...tint)
  b.uv.push(...uv); b.skinIndex.push(...influence.ids); b.skinWeight.push(...influence.values)
}
const fixedWeight = name => ({ ids: [definitions.findIndex(([n]) => n === name), 0, 0, 0], values: [1, 0, 0, 0] })
function geometry(geo, mat, bone, tint = '#ffffff') {
  const expanded = geo.index ? geo.toNonIndexed() : geo
  const p = expanded.getAttribute('position'), n = expanded.getAttribute('normal'), c = color(tint).toArray()
  for (let i = 0; i < p.count; i++) vertex(mat, [p.getX(i), p.getY(i), p.getZ(i)], [n.getX(i), n.getY(i), n.getZ(i)], c, fixedWeight(bone))
  expanded.dispose(); if (expanded !== geo) geo.dispose()
}
function ellipsoid(pos, scale, mat, bone, tint = '#ffffff', segments = 16) {
  const geo = new THREE.SphereGeometry(1, segments, 12)
  geo.scale(...scale).translate(...pos)
  geometry(geo, mat, bone, tint)
}
const centroid = ids => average(ids)
const skinColor = color('#c99375')
function clippedPolygon(ids, planes) {
  let polygon = ids.map(id => ({ p: new THREE.Vector3(...vertices[id]), n: normals[id].clone(), influence: vertexWeights[id] }))
  for (const distance of planes) {
    const output = []
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i], b = polygon[(i + 1) % polygon.length]
      const da = distance(a.p), db = distance(b.p)
      if (da >= 0) output.push(a)
      if ((da >= 0) !== (db >= 0)) {
        const t = da / (da - db), weights = new Map()
        for (const [point, factor] of [[a, 1 - t], [b, t]]) {
          point.influence.ids.forEach((bone, i) => weights.set(bone, (weights.get(bone) || 0) + point.influence.values[i] * factor))
        }
        const sorted = [...weights].sort((x, y) => y[1] - x[1]).slice(0, 4)
        const sum = sorted.reduce((value, [, w]) => value + w, 0)
        output.push({ p: a.p.clone().lerp(b.p, t), n: a.n.clone().lerp(b.n, t).normalize(), influence: {
          ids: Array.from({ length: 4 }, (_, j) => sorted[j]?.[0] || 0),
          values: Array.from({ length: 4 }, (_, j) => (sorted[j]?.[1] || 0) / sum),
        } })
      }
    }
    polygon = output
  }
  return polygon
}
function drawPolygon(polygon, draw) {
  for (let i = 1; i < polygon.length - 1; i++) for (const point of [polygon[0], polygon[i], polygon[i + 1]]) draw(point)
}
for (const { ids, group: name } of faces) {
  if (!['body', 'helper-tights'].includes(name)) continue
  const center = centroid(ids)
  if (name === 'helper-tights') {
    for (const [part, mat, planes] of [
      ['shirt', shirtMat, [p => p.y - 0.965, p => 1.478 - p.y, p => 0.304 - Math.abs(p.x)]],
      ['shorts', shortsMat, [p => p.y - 0.708, p => 0.982 - p.y, p => 0.29 - Math.abs(p.x)]],
      ['sock', sockMat, [p => p.y - 0.09, p => 0.455 - p.y]],
    ]) {
      const polygon = clippedPolygon(ids, planes)
      drawPolygon(polygon, ({ p: position, n, influence }) => {
        const p = position.clone()
        const amount = part === 'shorts' ? 0.018 : part === 'shirt' ? 0.012 : 0.005
        p.addScaledVector(n, amount + (part === 'shirt' ? Math.sin(p.y * 105 + p.x * 37) * 0.0016 : 0))
        const back = p.z < 0.025
        const uv = [Math.max(0.002, Math.min(0.498, ((back ? -p.x : p.x) / 0.55 + 0.5) * 0.5)) + (back ? 0.5 : 0), 1 - (p.y - 0.97) / 0.52]
        vertex(mat, p.toArray(), n.toArray(), [1, 1, 1], influence, uv)
      })
    }
    continue
  }
  // Leave a little skin beneath cuffs so joints never reveal gaps while running.
  if (!(center.y > 1.46 || Math.abs(center.x) > 0.29 || (center.y > 0.435 && center.y < 0.73))) continue
  const mat = skinMat
  for (const id of ids) {
    const p = new THREE.Vector3(...vertices[id]), n = normals[id]
    const tint = skinColor.clone()
    if (p.y > 1.51 && p.z > 0.12) {
      const lip = Math.exp(-(((p.y - 1.558) / 0.008) ** 2) - (p.x / 0.035) ** 4)
      tint.lerp(color('#9e5b50'), lip * 0.72)
    }
    tint.multiplyScalar(0.98 + Math.sin(id * 17.53) * 0.022)
    vertex(mat, p.toArray(), n.toArray(), tint.toArray(), vertexWeights[id])
  }
}

// The hair and beard follow the real scalp and jaw topology.
for (const { ids, group: name } of faces) {
  if (name !== 'body') continue
  const center = centroid(ids)
  if (center.y < 1.48) continue
  for (const [part, planes] of [
    ['scalp', [p => p.y - (1.693 - Math.max(0, 0.095 - p.z) * 0.9)]],
    ['beard', [p => p.y - 1.492, p => 1.54 - p.y, p => p.z - 0.095]],
    ['beard', [p => p.y - 1.54, p => 1.594 - p.y, p => p.z - 0.095, p => p.x - 0.033]],
    ['beard', [p => p.y - 1.54, p => 1.594 - p.y, p => p.z - 0.095, p => -p.x - 0.033]],
    ['beard', [p => p.y - 1.576, p => 1.586 - p.y, p => p.z - 0.135, p => 0.036 - Math.abs(p.x)]],
  ]) {
    drawPolygon(clippedPolygon(ids, planes), ({ p, n }) => {
      const pos = p.clone().addScaledVector(n, part === 'scalp' ? 0.005 : 0.004)
      if (part === 'beard') pos.y -= Math.max(0, 1.55 - pos.y) * 0.16
      const tint = color(part === 'scalp' ? '#493425' : '#654631')
      vertex(hairMat, pos.toArray(), n.toArray(), tint.toArray(), fixedWeight('Head'))
    })
  }
}
for (let i = 0; i < 42; i++) {
  const t = i / 41, x = -0.07 + t * 0.135, height = Math.sin(t * Math.PI)
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x, 1.688 + height * 0.012, 0.112),
    new THREE.Vector3(x + 0.009, 1.713 + height * 0.035, 0.075),
    new THREE.Vector3(x + 0.01, 1.703 + height * 0.033, 0.01),
    new THREE.Vector3(x, 1.687 + height * 0.012, -0.025),
  ])
  geometry(new THREE.TubeGeometry(path, 10, 0.0045 + Math.sin(i) * 0.001, 4, false), hairMat, 'Head', i % 5 === 0 ? '#80634a' : '#493425')
}
for (const side of ['L', 'R']) {
  const eye = average(rig.joints[rig.bones[`eye.${side}`].head])
  ellipsoid(eye.toArray(), [0.0136, 0.0118, 0.0125], whiteMat, 'Head')
  ellipsoid([eye.x, eye.y, eye.z + 0.0115], [0.0056, 0.0058, 0.0019], irisMat, 'Head')
  ellipsoid([eye.x, eye.y, eye.z + 0.013], [0.0026, 0.003, 0.001], blackMat, 'Head')
  const brow = new THREE.CatmullRomCurve3([
    new THREE.Vector3(eye.x - 0.019, eye.y + 0.017, eye.z + 0.001),
    new THREE.Vector3(eye.x, eye.y + 0.022, eye.z + 0.004),
    new THREE.Vector3(eye.x + 0.019, eye.y + 0.018, eye.z - 0.001),
  ])
  geometry(new THREE.TubeGeometry(brow, 7, 0.0028, 4), hairMat, 'Head', '#493425')
  const ankle = locations[`Foot_${side}`]
  ellipsoid([ankle.x, 0.065, ankle.z + 0.06], [0.047, 0.044, 0.129], bootMat, `Foot_${side}`)
  ellipsoid([ankle.x, 0.027, ankle.z + 0.065], [0.048, 0.012, 0.13], soleMat, `Foot_${side}`)
  for (let i = 0; i < 5; i++) {
    const lace = new THREE.BoxGeometry(0.05 - i * 0.004, 0.0025, 0.003)
    lace.translate(ankle.x, 0.106 - i * 0.004, ankle.z + 0.015 + i * 0.013)
    geometry(lace, whiteMat, `Foot_${side}`)
  }
}

let triangles = 0
const mesh = doc.createMesh('Footballer')
for (const [mat, data] of buckets) {
  let geo = new THREE.BufferGeometry()
  for (const [name, values] of Object.entries(data)) {
    const itemSize = name === 'uv' ? 2 : name.startsWith('skin') ? 4 : 3
    geo.setAttribute(name, new THREE.BufferAttribute(name === 'skinIndex' ? new Uint16Array(values) : new Float32Array(values), itemSize))
  }
  geo = mergeVertices(geo, 0.000001)
  const primitive = doc.createPrimitive().setMaterial(mat)
  for (const [name, semantic, type] of [
    ['position', 'POSITION', 'VEC3'], ['normal', 'NORMAL', 'VEC3'], ['color', 'COLOR_0', 'VEC3'],
    ['uv', 'TEXCOORD_0', 'VEC2'], ['skinIndex', 'JOINTS_0', 'VEC4'], ['skinWeight', 'WEIGHTS_0', 'VEC4'],
  ]) primitive.setAttribute(semantic, accessor(`${mat.getName()} ${name}`, type, geo.getAttribute(name).array))
  primitive.setIndices(accessor('Indices', 'SCALAR', new Uint32Array(geo.index.array)))
  triangles += geo.index.count / 3
  mesh.addPrimitive(primitive)
  geo.dispose()
}
root.addChild(doc.createNode('PlayerMesh').setMesh(mesh).setSkin(skin))
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule() })
await doc.transform(prune(), draco({ quantizePosition: 14, quantizeNormal: 10 }))
await mkdir('public/models', { recursive: true })
await io.write('public/models/efootball-forward.glb', doc)
const output = await readFile('public/models/efootball-forward.glb')
console.log({ triangles, bones: definitions.length, materials: buckets.size, bytes: output.length })
await writeFile('public/models/efootball-forward-source.json', JSON.stringify({ source, license: 'CC0-1.0', triangles, bones: definitions.length, generatedWith: 'node scripts/generate-efootball-player.mjs' }, null, 2) + '\n')
