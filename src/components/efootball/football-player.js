import * as THREE from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'

export function createFootballer(template, opponent = false) {
  const root = new THREE.Group()
  const body = clone(template)
  const bones = {}
  let skeleton
  body.traverse(node => {
    if (node.isBone) bones[node.name] = node
    if (!node.isMesh) return
    if (node.isSkinnedMesh) {
      if (!skeleton) skeleton = node.skeleton
      else node.skeleton = skeleton
    }
    node.castShadow = !['Eye whites', 'Iris', 'Pupil', 'Soles'].includes(node.material.name)
    node.receiveShadow = true
    node.frustumCulled = false
    if (opponent) {
      node.material = node.material.clone()
      if (node.material.name === 'Jersey') {
        node.material.map = null
        node.material.color.set('#b92e47')
      }
      if (node.material.name === 'Shorts') node.material.color.set('#e5e0d9')
      if (node.material.name === 'Socks') node.material.color.set('#aa253d')
    }
  })
  root.add(body)
  root.userData = { body, bones, phase: 0, motion: 0, kick: 1, opponent }
  animateFootballer(root, 0, 0)
  return root
}

export function animateFootballer(model, speed, dt, kick = false) {
  const data = model.userData
  const { bones, body } = data
  data.motion = THREE.MathUtils.damp(data.motion, Math.min(speed / 4.2, 1), 12, dt)
  data.phase += dt * (7 + data.motion * 5) * data.motion
  if (kick) data.kick = 0.2
  data.kick = Math.min(1, data.kick + dt * 2.4)
  const stride = Math.sin(data.phase), lift = Math.cos(data.phase)
  const motion = data.motion
  const strike = data.kick < 1 ? Math.sin(data.kick * Math.PI) : 0
  body.position.y = Math.abs(lift) * 0.018 * motion
  bones.Hips.rotation.z = stride * 0.025 * motion
  bones.Chest.rotation.x = 0.06 * motion
  bones.Chest.rotation.y = stride * 0.06 * motion
  bones.Head.rotation.x = -0.025 * motion
  for (const side of ['L', 'R']) {
    const sign = side === 'L' ? 1 : -1
    const swing = stride * sign
    bones[`UpperArm_${side}`].rotation.set(swing * 0.4 * motion, 0, -sign * (0.45 + 0.05 * motion + strike * 0.12))
    bones[`ForeArm_${side}`].rotation.x = -0.1 - 0.25 * motion - Math.max(0, -swing) * 0.18 * motion
    bones[`Thigh_${side}`].rotation.set(-swing * 0.62 * motion - (side === 'L' ? strike * 1.05 : 0), 0, sign * 0.07)
    bones[`Shin_${side}`].rotation.x = 0.06 + Math.max(0, -swing) * 1.05 * motion + (side === 'L' ? strike * 0.24 : 0)
    bones[`Foot_${side}`].rotation.x = -Math.max(0, swing) * 0.18 * motion
  }
}
