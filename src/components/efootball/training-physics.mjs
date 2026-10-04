import { Body, Box, ContactMaterial, Material, Plane, Sphere, Vec3, World } from 'cannon-es'

export const FIELD = { width: 22, length: 34 }
export const GOAL = { width: 7.32, height: 2.44, z: -13, depth: 1.8, post: 0.065 }
export const BALL_RADIUS = 0.13

export function createBallPhysics() {
  const world = new World({ gravity: new Vec3(0, -9.81, 0), allowSleep: true })
  const grass = new Material('grass'), football = new Material('football'), metal = new Material('post')
  world.addContactMaterial(new ContactMaterial(grass, football, { friction: 0.2, restitution: 0.48 }))
  world.addContactMaterial(new ContactMaterial(metal, football, { friction: 0.2, restitution: 0.62 }))
  const ground = new Body({ mass: 0, material: grass, shape: new Plane() })
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
  world.addBody(ground)
  for (const x of [-GOAL.width / 2, GOAL.width / 2]) {
    const post = new Body({ mass: 0, material: metal, shape: new Box(new Vec3(GOAL.post, GOAL.height / 2, GOAL.post)) })
    post.position.set(x, GOAL.height / 2, GOAL.z)
    world.addBody(post)
  }
  const crossbar = new Body({ mass: 0, material: metal, shape: new Box(new Vec3(GOAL.width / 2, GOAL.post, GOAL.post)) })
  crossbar.position.set(0, GOAL.height, GOAL.z)
  world.addBody(crossbar)
  const ball = new Body({ mass: 0.43, material: football, shape: new Sphere(BALL_RADIUS), linearDamping: 0.16, angularDamping: 0.3 })
  world.addBody(ball)
  const defenders = []
  let flight = false, previous = new Vec3(), elapsed = 0, resolved = false
  return {
    ball,
    setDefenders(positions) {
      positions.forEach((position, i) => {
        if (!defenders[i]) {
          defenders[i] = new Body({ mass: 0, type: Body.KINEMATIC, material: grass, shape: new Box(new Vec3(0.24, 0.86, 0.18)) })
          world.addBody(defenders[i])
        }
        defenders[i].position.set(position.x, 0.86, position.z)
        defenders[i].aabbNeedsUpdate = true
      })
    },
    place(x, z) {
      flight = false; resolved = false; elapsed = 0
      ball.type = Body.KINEMATIC
      ball.position.set(x, BALL_RADIUS, z)
      ball.velocity.setZero(); ball.angularVelocity.setZero()
      ball.aabbNeedsUpdate = true
    },
    shoot(direction, charge) {
      if (flight || Math.hypot(direction.x, direction.z) < 0.1) return false
      flight = true; resolved = false; elapsed = 0
      ball.type = Body.DYNAMIC
      ball.updateMassProperties()
      const strength = Math.min(1, Math.max(0, charge))
      const speed = 13 + strength * 9
      const length = Math.hypot(direction.x, direction.z)
      ball.velocity.set(direction.x / length * speed, 2.5 + strength * 1.7, direction.z / length * speed)
      ball.angularVelocity.set(-direction.z * 15, 0, direction.x * 15)
      ball.wakeUp()
      return true
    },
    step(dt) {
      if (!flight) return null
      previous.copy(ball.position)
      world.step(1 / 120, Math.min(dt, 0.05), 6)
      elapsed += dt
      if (resolved) return null
      // Count a goal only after the whole ball crosses inside the posts.
      const line = GOAL.z - BALL_RADIUS
      if (previous.z > line && ball.position.z <= line) {
        const t = (line - previous.z) / (ball.position.z - previous.z)
        const x = previous.x + (ball.position.x - previous.x) * t
        const y = previous.y + (ball.position.y - previous.y) * t
        const scored = Math.abs(x) + BALL_RADIUS < GOAL.width / 2 - GOAL.post && y + BALL_RADIUS < GOAL.height - GOAL.post
        resolved = true
        if (scored) ball.velocity.scale(0.18, ball.velocity)
        return scored ? 'goal' : 'wide'
      }
      if (elapsed > 4 || Math.abs(ball.position.x) > FIELD.width / 2 + 1 || Math.abs(ball.position.z) > FIELD.length / 2 + 1 || (elapsed > 1 && ball.velocity.lengthSquared() < 0.12)) {
        resolved = true
        return 'wide'
      }
      return null
    },
  }
}
