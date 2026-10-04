import test from 'node:test'
import assert from 'node:assert/strict'
import { BALL_RADIUS, GOAL, createBallPhysics } from '../src/components/efootball/training-physics.mjs'

function fire({ x = 0, z = 0, direction = { x: 0, z: -1 }, charge = 1, dt = 1 / 60, configure = () => {} } = {}) {
  const sim = createBallPhysics()
  sim.place(x, z); sim.shoot(direction, charge); configure(sim)
  for (let i = 0; i < Math.ceil(5 / dt); i++) {
    const result = sim.step(dt)
    if (result) return { result, sim }
    assert.ok(sim.ball.position.y >= BALL_RADIUS - 0.03, 'ball stays above the pitch')
  }
  throw new Error('Shot did not resolve')
}

test('a forward shot crosses the whole goal line and counts once', () => {
  const { result, sim } = fire()
  assert.equal(result, 'goal')
  assert.ok(sim.ball.position.z <= GOAL.z - BALL_RADIUS)
  for (let i = 0; i < 100; i++) assert.equal(sim.step(1 / 60), null)
})
test('sideways and backwards movement cannot auto-aim at goal', () => {
  assert.equal(fire({ direction: { x: 1, z: 0 } }).result, 'wide')
  assert.equal(fire({ direction: { x: 0, z: 1 } }).result, 'wide')
})
test('shots outside the posts and above the crossbar miss', () => {
  assert.equal(fire({ x: 5 }).result, 'wide')
  assert.equal(fire({ configure: sim => { sim.ball.velocity.y = 15 } }).result, 'wide')
})
test('the post physically deflects a shot', () => {
  const { result } = fire({ x: GOAL.width / 2 })
  assert.equal(result, 'wide')
})
test('defenders physically block the ball', () => {
  const { result } = fire({ z: -4, configure: sim => sim.setDefenders([{ x: 0, z: -5 }]) })
  assert.equal(result, 'wide')
})
test('scoring is stable at 30, 60 and 120 frames per second', () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 120]) assert.equal(fire({ dt }).result, 'goal')
})
test('reset clears velocity and permits the next shot', () => {
  const { sim } = fire()
  sim.place(0, 1)
  assert.equal(sim.ball.velocity.length(), 0)
  assert.equal(sim.step(1 / 60), null)
  assert.equal(sim.shoot({ x: 0, z: 0 }, 1), false)
  assert.equal(sim.shoot({ x: 0, z: -1 }, 0.7), true)
  assert.equal(sim.shoot({ x: 0, z: -1 }, 0.7), false)
})
