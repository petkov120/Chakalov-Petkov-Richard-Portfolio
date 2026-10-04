import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { compactPrimitive, draco, prune } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import draco3d from 'draco3dgltf'

await MeshoptSimplifier.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
})
const doc = await io.read('public/models/ferrari.glb')
let before = 0, after = 0
for (const mesh of doc.getRoot().listMeshes()) {
  if (/interior|leather|carpet|steering|brake|nuts/.test(mesh.getName())) {
    for (const node of doc.getRoot().listNodes()) if (node.getMesh() === mesh) node.setMesh(null)
    continue
  }
  for (const primitive of mesh.listPrimitives()) {
    const positions = new Float32Array(primitive.getAttribute('POSITION').getArray())
    const original = new Uint32Array(primitive.getIndices().getArray())
    before += original.length / 3
    const target = Math.max(60, Math.floor(original.length * .17 / 3) * 3)
    const normals = new Float32Array(primitive.getAttribute('NORMAL').getArray())
    const [simplified] = MeshoptSimplifier.simplifyWithAttributes(original, positions, 3, normals, 3, [.1,.1,.1], null, target, .01, ['Permissive'])
    const accessor = doc.createAccessor().setType('SCALAR').setBuffer(primitive.getIndices().getBuffer()).setArray(simplified)
    primitive.setIndices(accessor)
    for (const semantic of primitive.listSemantics()) if (!['POSITION', 'NORMAL'].includes(semantic)) primitive.setAttribute(semantic, null)
    compactPrimitive(primitive)
    after += simplified.length / 3
  }
}
await doc.transform(prune(), draco())
await io.write('public/models/hydra-gt.glb', doc)
console.log({ before, after, reduction: ((1 - after / before) * 100).toFixed(1) + '%' })
