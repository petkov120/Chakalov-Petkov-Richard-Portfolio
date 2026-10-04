import * as THREE from 'three'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { animateFootballer, createFootballer } from './football-player'
import { BALL_RADIUS, FIELD, GOAL, createBallPhysics } from './training-physics.mjs'

const clamp = THREE.MathUtils.clamp

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function footballTexture() {
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#faf9f2'; ctx.fillRect(0, 0, w, h)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        const x = col * 74 + (row % 2) * 37, y = row * 74
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 2 / 5 - Math.PI / 2
          ctx.lineTo(x + Math.cos(angle) * 19, y + Math.sin(angle) * 19)
        }
        ctx.closePath(); ctx.fillStyle = '#202831'; ctx.fill()
        ctx.strokeStyle = '#a9aaa5'; ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 2 / 5 - Math.PI / 2
          ctx.beginPath(); ctx.moveTo(x + Math.cos(angle) * 19, y + Math.sin(angle) * 19)
          ctx.lineTo(x + Math.cos(angle) * 38, y + Math.sin(angle) * 38); ctx.stroke()
        }
      }
    }
  })
}

function pitch(scene) {
  const grass = canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#658451'; ctx.fillRect(0, 0, w, h)
    let seed = 12
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        seed = (seed * 1664525 + 1013904223) >>> 0
        const shade = 72 + (seed >>> 24) / 16
        ctx.fillStyle = `rgb(${shade - 10} ${shade + 22} ${shade - 20})`; ctx.fillRect(x, y, 1, 1)
      }
    }
  })
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping
  grass.repeat.set(100, 100); grass.anisotropy = 4
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ map: grass, roughness: 1 }))
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground)
  const stripes = new THREE.InstancedMesh(new THREE.PlaneGeometry(FIELD.width, 2), new THREE.MeshStandardMaterial({ color: '#b8c693', transparent: true, opacity: 0.07, depthWrite: false }), 8)
  const matrix = new THREE.Matrix4()
  for (let i = 0; i < 8; i++) {
    matrix.makeRotationX(-Math.PI / 2); matrix.setPosition(0, 0.009, -14 + i * 4); stripes.setMatrixAt(i, matrix)
  }
  scene.add(stripes)
  const white = new THREE.MeshBasicMaterial({ color: '#f0eee0' })
  function line(x1, z1, x2, z2, width = 0.07) {
    const length = Math.hypot(x2 - x1, z2 - z1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), white)
    mesh.rotation.set(-Math.PI / 2, 0, -Math.atan2(x2 - x1, z2 - z1))
    mesh.position.set((x1 + x2) / 2, 0.018, (z1 + z2) / 2); scene.add(mesh)
  }
  function box(x, near, far) { line(-x, near, x, near); line(-x, near, -x, far); line(x, near, x, far); line(-x, far, x, far) }
  box(FIELD.width / 2, 15, GOAL.z)
  box(7.3, GOAL.z + 8, GOAL.z)
  box(4.7, GOAL.z + 3, GOAL.z)
  line(-11, 8, 11, 8)
  const circle = new THREE.Mesh(new THREE.RingGeometry(3, 3.07, 64), white)
  circle.rotation.x = -Math.PI / 2; circle.position.set(0, 0.018, 8); scene.add(circle)
  const spot = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), white)
  spot.rotation.x = -Math.PI / 2; spot.position.set(0, 0.022, GOAL.z + 6); scene.add(spot)
  const railMat = new THREE.MeshStandardMaterial({ color: '#c5c9c4', roughness: 0.85 })
  const boardTexture = canvasTexture(1024, 128, ctx => {
    ctx.fillStyle = '#20282a'; ctx.fillRect(0, 0, 1024, 128)
    ctx.fillStyle = '#eff1e9'; ctx.font = 'bold 44px sans-serif'; ctx.fillText('eFootball', 40, 82)
    ctx.fillStyle = '#de4268'; ctx.fillRect(348, 44, 5, 42)
    ctx.fillStyle = '#c8ef9a'; ctx.font = 'bold 30px sans-serif'; ctx.fillText('TRAINING GROUND', 406, 78)
  })
  const board = new THREE.Mesh(new THREE.BoxGeometry(26, 1, 0.25), railMat)
  board.position.set(0, 0.5, -17); scene.add(board)
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.9), new THREE.MeshStandardMaterial({ map: boardTexture, roughness: 1 }))
  sign.position.set(0, 0.53, -16.86); scene.add(sign)
  for (const x of [-13, 13]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 33), railMat)
    rail.position.set(x, 0.45, -1); scene.add(rail)
  }
}

function goal(scene) {
  const material = new THREE.MeshStandardMaterial({ color: '#f7f5e8', roughness: 0.4 })
  for (const x of [-GOAL.width / 2, GOAL.width / 2]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(GOAL.post, GOAL.post, GOAL.height, 12), material)
    post.position.set(x, GOAL.height / 2, GOAL.z); post.castShadow = true; scene.add(post)
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(GOAL.post, GOAL.post, GOAL.width, 12), material)
  bar.rotation.z = Math.PI / 2; bar.position.set(0, GOAL.height, GOAL.z); bar.castShadow = true; scene.add(bar)
  const points = [], rear = GOAL.z - GOAL.depth
  const segment = (a, b) => points.push(...a, ...b)
  for (let x = -GOAL.width / 2; x <= GOAL.width / 2; x += 0.22) {
    segment([x, 0, rear], [x, GOAL.height, rear]); segment([x, GOAL.height, rear], [x, GOAL.height, GOAL.z])
  }
  for (let y = 0; y <= GOAL.height; y += 0.22) {
    segment([-GOAL.width / 2, y, rear], [GOAL.width / 2, y, rear])
    for (const x of [-GOAL.width / 2, GOAL.width / 2]) segment([x, y, rear], [x, y, GOAL.z])
  }
  for (let z = rear; z <= GOAL.z; z += 0.22) {
    segment([-GOAL.width / 2, GOAL.height, z], [GOAL.width / 2, GOAL.height, z])
    for (const x of [-GOAL.width / 2, GOAL.width / 2]) segment([x, 0, z], [x, GOAL.height, z])
  }
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  scene.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: '#e6e4d7', transparent: true, opacity: 0.5 })))
}

function disposeScene(scene) {
  const geometries = new Set(), materials = new Set(), textures = new Set(), skeletons = new Set()
  scene.traverse(node => {
    if (node.geometry) geometries.add(node.geometry)
    if (node.skeleton) skeletons.add(node.skeleton)
    for (const material of node.material ? [node.material].flat() : []) {
      materials.add(material)
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value)
    }
  })
  geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); skeletons.forEach(s => s.dispose())
}

export async function createTrainingScene(mount, input, callbacks, signal) {
  const decoder = new DRACOLoader().setDecoderPath('/models/draco/').setWorkerLimit(1)
  let template
  try { template = (await new GLTFLoader().setDRACOLoader(decoder).loadAsync('/models/efootball-forward.glb')).scene }
  finally { decoder.dispose() }
  if (signal.aborted) { disposeScene(template); return null }
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1.35 : 1.6))
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15
  renderer.domElement.setAttribute('aria-label', 'Playable football training pitch')
  mount.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#bac9c7'); scene.fog = new THREE.Fog('#bac9c7', 38, 85)
  scene.add(new THREE.HemisphereLight('#f3f7ff', '#658358', 2.3))
  const sun = new THREE.DirectionalLight('#fff4e5', 3.1)
  sun.position.set(-8, 14, 6); sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -16; sun.shadow.camera.right = 16
  sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -18; sun.shadow.camera.far = 50
  sun.shadow.normalBias = 0.025; sun.shadow.bias = -0.0002
  scene.add(sun)
  pitch(scene); goal(scene)
  const player = createFootballer(template)
  player.name = 'ControlledPlayer'; scene.add(player)
  const defenders = [-1, 1].map((sign, i) => {
    const mesh = createFootballer(template, true); scene.add(mesh)
    return { mesh, start: new THREE.Vector3(sign * 4.5, 0, -6 - i * 3) }
  })
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_RADIUS, 24, 16), new THREE.MeshStandardMaterial({ map: footballTexture(), roughness: 0.62 }))
  ball.castShadow = true; scene.add(ball)
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.415, 40), new THREE.MeshBasicMaterial({ color: '#dff58b', transparent: true, opacity: 0.7, depthWrite: false }))
  ring.rotation.x = -Math.PI / 2; scene.add(ring)
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(), 1.5, '#e1f892', 0.28, 0.19)
  scene.add(arrow)
  const physics = createBallPhysics()
  const state = { goals: 0, shots: 0, phase: 'ready', message: 'Ready', charge: 0, releaseTime: 0, resultTime: 0, view: 'follow', viewTime: 0, lastHud: 0, elapsed: 0, hasMoved: false }
  const direction = new THREE.Vector3(0, 0, -1), velocity = new THREE.Vector3(), desired = new THREE.Vector3()
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
  const cameraTarget = new THREE.Vector3(), cameraPosition = new THREE.Vector3(), target = new THREE.Vector3(), pressure = new THREE.Vector3()
  let raf = 0, previousTime = 0, active = true, visible = true, lastSnapshot = ''
  const emit = () => {
    const snapshot = { goals: state.goals, shots: state.shots, message: state.message, charge: Math.round(state.charge * 100), view: state.view }
    const key = JSON.stringify(snapshot)
    if (key !== lastSnapshot) { lastSnapshot = key; callbacks.onHud(snapshot) }
  }
  function kickoff(resetScore = false) {
    if (resetScore) { state.goals = 0; state.shots = 0 }
    state.message = 'Ready'; state.hasMoved = false
    state.phase = 'ready'; state.charge = 0; state.releaseTime = 0; state.resultTime = 0
    velocity.set(0, 0, 0); direction.set(0, 0, -1)
    player.position.set(0, 0, 5); player.rotation.y = 0
    physics.place(-0.2, 4.5)
    defenders.forEach(d => { d.mesh.position.copy(d.start); d.mesh.rotation.y = 0 })
    physics.setDefenders(defenders.map(d => d.mesh.position))
    emit()
  }
  function resume() {
    state.message = 'Ready'; state.phase = 'ready'; state.charge = 0; state.releaseTime = 0; state.resultTime = 0
    input.space = false; input.fire = false
    player.position.z = Math.max(player.position.z, GOAL.z + 8)
    physics.place(player.position.x + direction.x * 0.48, player.position.z + direction.z * 0.48)
    defenders.forEach((d, i) => { d.mesh.position.set(d.start.x + (player.position.x > 0 ? -2 : 2) * (i ? 1 : -1), 0, Math.min(d.start.z, player.position.z - 7 - i * 2)) })
    physics.setDefenders(defenders.map(d => d.mesh.position))
    emit()
  }
  function finish(result) {
    state.phase = 'result'; state.resultTime = 0.55; state.charge = 0
    if (result === 'goal') { state.goals++; state.message = 'Ready' }
    else state.message = result === 'tackled' ? 'Possession lost' : 'Wide'
    emit()
  }
  function resize() {
    const { width, height } = mount.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height; camera.updateProjectionMatrix()
  }
  function update(dt) {
    state.elapsed += dt
    const canMove = state.view === 'follow' && state.phase !== 'result'
    desired.set(canMove ? input.x : 0, 0, canMove ? input.z : 0)
    const moving = desired.length() > 0.12
    if (moving) {
      if (desired.length() > 1) desired.normalize()
      direction.copy(desired).normalize(); state.hasMoved = true
    }
    velocity.lerp(desired.multiplyScalar(moving ? 4.2 : 0), 1 - Math.exp(-12 * dt))
    if (state.view === 'follow') player.position.addScaledVector(velocity, dt)
    player.position.x = clamp(player.position.x, -10, 10); player.position.z = clamp(player.position.z, GOAL.z + 1.4, 13.5)
    if (moving) {
      const angle = Math.atan2(direction.x, direction.z)
      player.rotation.y += Math.atan2(Math.sin(angle - player.rotation.y), Math.cos(angle - player.rotation.y)) * (1 - Math.exp(-16 * dt))
    }
    let kicked = false
    if (state.phase === 'ready' && state.view === 'follow') {
      if (input.cancel) { state.charge = 0; state.releaseTime = 0; input.cancel = false; input.fire = false }
      if (input.space) {
        state.charge = Math.min(1, state.charge + dt * 0.9); state.releaseTime = 0; state.message = 'Charging shot'
      } else if (input.fire) {
        input.fire = false
        physics.shoot(direction, Math.max(state.charge, 0.35)); state.phase = 'shot'; state.shots++; state.message = 'Shot away'; kicked = true
        state.charge = 0
      } else if (moving) {
        state.charge = Math.min(1, state.charge + dt * 0.6); state.releaseTime = 0; state.message = 'In possession'
      } else if (state.charge > 0) {
        state.releaseTime += dt
        if (state.releaseTime > 0.1) {
          if (state.charge > 0.1) {
            physics.shoot(direction, state.charge); state.phase = 'shot'; state.shots++; state.message = 'Shot away'; kicked = true
          }
          state.charge = 0
        }
      }
      if (state.phase === 'ready') {
        const touch = moving ? 0.48 + Math.abs(Math.sin(player.userData.phase)) * 0.12 : 0.48
        physics.place(player.position.x + direction.x * touch + direction.z * 0.13, player.position.z + direction.z * touch - direction.x * 0.13)
        ball.rotation.x += velocity.z * dt / BALL_RADIUS; ball.rotation.z -= velocity.x * dt / BALL_RADIUS
      }
    }
    if (state.view === 'follow') {
      physics.setDefenders(defenders.map(d => d.mesh.position))
      const result = physics.step(dt)
      if (result && state.phase === 'shot') finish(result)
      if (state.phase === 'result') { state.resultTime -= dt; if (state.resultTime <= 0) resume() }
    }
    ball.position.copy(physics.ball.position)
    if (state.phase !== 'ready') ball.quaternion.copy(physics.ball.quaternion)
    ring.position.set(player.position.x, 0.026, player.position.z)
    arrow.visible = state.phase === 'ready' && state.charge > 0.1 && state.view === 'follow'
    arrow.position.set(ball.position.x, 0.065, ball.position.z); arrow.setDirection(direction)
    arrow.setLength(0.8 + state.charge * 1.2, 0.25, 0.18)
    animateFootballer(player, velocity.length(), state.view === 'follow' ? dt : 0, kicked)
    defenders.forEach((defender, i) => {
      pressure.subVectors(player.position, defender.mesh.position); pressure.y = 0
      const chasing = state.phase !== 'result' && state.view === 'follow'
      if (chasing) {
        pressure.normalize(); defender.mesh.position.addScaledVector(pressure, dt * (2.3 + i * 0.3))
        defender.mesh.rotation.y = Math.atan2(pressure.x, pressure.z)
        if (state.phase === 'ready' && defender.mesh.position.distanceTo(player.position) < 0.6) finish('tackled')
      }
      animateFootballer(defender.mesh, chasing ? 2.3 : 0, state.view === 'follow' ? dt : 0)
    })
    if (state.view === 'player') {
      state.viewTime += dt
      const t = state.viewTime * 0.14 + 0.15
      cameraPosition.set(player.position.x + Math.sin(t) * 2.7, 1.35, player.position.z + Math.cos(t) * 2.7)
      target.set(player.position.x, 1.03, player.position.z)
    } else {
      const narrow = camera.aspect < 0.85
      cameraPosition.set(player.position.x * 0.7 + (narrow ? 0.5 : 1.4), narrow ? 3.6 : 3.25, player.position.z + (narrow ? 7 : 5.5))
      target.set(player.position.x * 0.7, 0.95, player.position.z - (narrow ? 3.7 : 3))
    }
    camera.position.lerp(cameraPosition, 1 - Math.exp(-6 * dt))
    cameraTarget.lerp(target, 1 - Math.exp(-6 * dt)); camera.lookAt(cameraTarget)
    if (state.elapsed - state.lastHud > 0.1) { state.lastHud = state.elapsed; emit() }
  }
  function frame(time) {
    if (!active) return
    const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60
    previousTime = time
    if (visible && !document.hidden) { update(dt); renderer.render(scene, camera) }
    raf = requestAnimationFrame(frame)
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(mount)
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; previousTime = 0 })
  intersectionObserver.observe(mount)
  kickoff(true); resize()
  camera.position.set(1.4, 3.25, 10.5); cameraTarget.set(0, 0.95, 2)
  raf = requestAnimationFrame(frame)
  callbacks.onReady()
  const api = {
    reset: () => { input.x = 0; input.z = 0; input.space = false; input.fire = false; kickoff(true) },
    toggleView: () => {
      input.x = 0; input.z = 0; input.space = false; input.fire = false; state.charge = 0; state.releaseTime = 0
      state.viewTime = 0; velocity.set(0, 0, 0)
      state.view = state.view === 'follow' ? 'player' : 'follow'; emit()
    },
    dispose: () => {
      active = false; cancelAnimationFrame(raf); resizeObserver.disconnect(); intersectionObserver.disconnect()
      disposeScene(scene); renderer.dispose(); renderer.domElement.remove()
    },
  }
  // Read-only development diagnostics support real browser input tests.
  if (import.meta.env.DEV) {
    mount.__football = () => ({ ...state, player: player.position.toArray(), ball: ball.position.toArray(), direction: direction.toArray(), bones: Object.keys(player.userData.bones).length, triangles: renderer.info.render.triangles, calls: renderer.info.render.calls })
    const dispose = api.dispose
    api.dispose = () => { delete mount.__football; dispose() }
  }
  return api
}
