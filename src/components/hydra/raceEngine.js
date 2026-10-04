import * as T from 'three'
import * as C from 'cannon-es'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export async function createRace(mount, roster, publish, minimap) {
  const draco = new DRACOLoader().setDecoderPath('/models/draco/')
  let source
  try { source = (await new GLTFLoader().setDRACOLoader(draco).loadAsync('/models/hydra-gt.glb')).scene }
  finally { draco.dispose() }
  source.updateMatrixWorld(true)
  const bounds = new T.Box3().setFromObject(source)
  const center = bounds.getCenter(new T.Vector3())
  const batches = new Map()
  source.traverse(mesh => {
    if (!mesh.isMesh) return
    if (/interior|leather|carpet|steering/.test(mesh.name)) return
    let wheel = ''
    for (let node = mesh; node; node = node.parent) if (/^wheel_[fr][lr]$/.test(node.name)) wheel = node.name
    const kind = mesh.name === 'body' ? 'paint' : mesh.name === 'glass' ? 'glass' : /lights_red/.test(mesh.name) ? 'tail' : /lights|leds/.test(mesh.name) ? 'light' : /rim|chrome|metal|trim/.test(mesh.name) ? 'metal' : 'dark'
    const key = wheel + ':' + kind
    const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
    geometry.translate(-center.x,-bounds.min.y,-center.z)
    for (const attribute of Object.keys(geometry.attributes)) if (!['position','normal'].includes(attribute)) geometry.deleteAttribute(attribute)
    const plain = geometry.index ? geometry.toNonIndexed() : geometry
    if (plain !== geometry) geometry.dispose()
    if (!batches.has(key)) batches.set(key, [])
    batches.get(key).push(plain)
  })
  const parts = [...batches].map(([key, geometries]) => {
    const geometry = mergeGeometries(geometries)
    geometries.forEach(g => g.dispose())
    const [wheel, kind] = key.split(':')
    return { wheel, kind, geometry }
  })
  const sourceGeometries = new Set(), sourceMaterials = new Set()
  source.traverse(o => { if(o.geometry)sourceGeometries.add(o.geometry); if(o.material)sourceMaterials.add(o.material) })
  sourceGeometries.forEach(g => g.dispose());sourceMaterials.forEach(m => m.dispose())
  const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = .85
  mount.appendChild(renderer.domElement)
  const scene = new T.Scene()
  scene.background = new T.Color('#b9d5dc')
  scene.fog = new T.Fog('#b9d5dc', 180, 620)
  const camera = new T.PerspectiveCamera(52, 1, .1, 900)
  const pmrem = new T.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, .04)
  scene.environment = environment.texture
  room.dispose()
  pmrem.dispose()
  scene.add(new T.HemisphereLight('#e7f6ff', '#596649', 1.5))
  const sun = new T.DirectionalLight('#fff2cf', 2.5)
  sun.position.set(100, 150, 60)
  scene.add(sun)
  const box = new T.BoxGeometry(1, 1, 1)
  const rubber = new T.MeshStandardMaterial({ color: '#141719', roughness: .85 })
  const chrome = new T.MeshStandardMaterial({ color: '#c6d0d3', metalness: .95, roughness: .22 })
  const glass = new T.MeshStandardMaterial({ color: '#11272e', metalness: .6, roughness: .12 })
  const white = new T.MeshStandardMaterial({ color: '#e9eee6', roughness: .7 })
  const red = new T.MeshStandardMaterial({ color: '#c43136', roughness: .65 })
  function cube(parent, material, x,y,z, sx,sy,sz) {
    const mesh = new T.Mesh(box, material)
    mesh.position.set(x,y,z); mesh.scale.set(sx,sy,sz); parent.add(mesh)
    return mesh
  }
  const lamps=new T.MeshBasicMaterial({color:'#e9ffff'})
  const tails=new T.MeshBasicMaterial({color:'#ff263e'})
  const ao = new T.TextureLoader().load('/models/ferrari_ao.png')
  const shadowGeo = new T.PlaneGeometry(2.62,5.2)
  const shadowMat = new T.MeshBasicMaterial({map:ao,blending:T.MultiplyBlending,toneMapped:false,transparent:true,premultipliedAlpha:true,depthWrite:false})
  const wheelCenters = new Map()
  for(const name of ['wheel_fl','wheel_fr','wheel_rl','wheel_rr']) {
    const b = new T.Box3()
    parts.filter(p=>p.wheel===name).forEach(p=>{p.geometry.computeBoundingBox();b.union(p.geometry.boundingBox)})
    wheelCenters.set(name,b.getCenter(new T.Vector3()))
  }
  parts.forEach(p=>{if(p.wheel){const c=wheelCenters.get(p.wheel);p.geometry.translate(-c.x,-c.y,-c.z)}})
  function makeCar(spec) {
    const root=new T.Group(), wheels=[]
    const paint=new T.MeshPhysicalMaterial({color:spec.color,metalness:.85,roughness:.3,clearcoat:1,clearcoatRoughness:.12})
    const materials={paint,glass,metal:chrome,dark:rubber,light:lamps,tail:tails}
    const groups = new Map()
    for(const [name,c] of wheelCenters) {const g=new T.Group();g.position.copy(c);root.add(g);groups.set(name,g);wheels.push(g)}
    for(const part of parts) (part.wheel?groups.get(part.wheel):root).add(new T.Mesh(part.geometry,materials[part.kind]))
    const shadow=new T.Mesh(shadowGeo,shadowMat)
    shadow.rotation.x=-Math.PI/2; shadow.position.y=.025; root.add(shadow)
    scene.add(root)
    return { root, wheels, paint }
  }
  const curve=new T.CatmullRomCurve3([
    new T.Vector3(0,0,170),new T.Vector3(-150,0,150),new T.Vector3(-235,0,50),
    new T.Vector3(-210,0,-100),new T.Vector3(-80,0,-175),new T.Vector3(60,0,-130),
    new T.Vector3(180,0,-160),new T.Vector3(250,0,-40),new T.Vector3(200,0,110),
    new T.Vector3(100,0,175),
  ],true,'centripetal')
  const length=curve.getLength(), samples=900
  const points=curve.getSpacedPoints(samples)
  const mapContext=minimap?.getContext('2d')
  const mapPoint=p=>[(p.x+280)/560*160+10,(p.z+200)/400*110+15]
  const tangents=points.map((p,i)=>points[(i+1)%samples].clone().sub(points[(i+samples-1)%samples]).normalize())
  function frame(distance, lane=0) {
    const f=((distance%length+length)%length)/length*samples, i=Math.floor(f), a=f-i
    const p=points[i].clone().lerp(points[i+1],a)
    const tangent=tangents[i].clone().lerp(tangents[i+1],a).normalize()
    p.x-=tangent.z*lane; p.z+=tangent.x*lane
    return { p,tangent,yaw:Math.atan2(-tangent.x,-tangent.z) }
  }
  function ribbon(inner,outer,material,y=.03) {
    const v=[], idx=[],uv=[]
    for(let i=0;i<=samples;i++) for(const lane of [inner,outer]) {
      const p=frame(i/samples*length,lane).p; v.push(p.x,y,p.z);uv.push((lane-inner)/Math.max(.01,outer-inner)*4,i/samples*length/5)
    }
    for(let i=0;i<samples;i++) { const a=i*2; idx.push(a,a+2,a+1,a+1,a+2,a+3) }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals()
    const mesh=new T.Mesh(g,material);scene.add(mesh)
  }
  const roadCanvas=document.createElement('canvas');roadCanvas.width=128;roadCanvas.height=128
  const roadCtx=roadCanvas.getContext('2d'),noise=roadCtx.createImageData(128,128)
  let seed=73
  for(let i=0;i<noise.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const value=105+(seed%45);noise.data.set([value,value,value,255],i)}
  roadCtx.putImageData(noise,0,0)
  const roadTexture=new T.CanvasTexture(roadCanvas);roadTexture.wrapS=roadTexture.wrapT=T.RepeatWrapping;roadTexture.colorSpace=T.SRGBColorSpace;roadTexture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy())
  const asphalt=new T.MeshStandardMaterial({color:'#53595b',map:roadTexture,roughness:.96,side:T.DoubleSide})
  ribbon(-10.5,10.5,asphalt)
  ribbon(-10.6,-10.4,white,.045);ribbon(10.4,10.6,white,.045)
  const ground=new T.Mesh(new T.PlaneGeometry(1600,1600),new T.MeshStandardMaterial({color:'#78906c',roughness:1}))
  ground.rotation.x=-Math.PI/2;ground.position.y=-.08;scene.add(ground)
  const ocean=new T.Mesh(new T.PlaneGeometry(1600,700),new T.MeshStandardMaterial({color:'#458c99',roughness:.35,metalness:.3}))
  ocean.rotation.x=-Math.PI/2;ocean.position.set(0,-.04,-580);scene.add(ocean)
  const dummy=new T.Object3D()
  function instances(geometry,material,transforms) {
    const mesh=new T.InstancedMesh(geometry,material,transforms.length)
    transforms.forEach(([x,y,z,sx,sy,sz,angle=0],i)=>{dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,angle,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)})
    mesh.computeBoundingSphere();scene.add(mesh);return mesh
  }
  const rails=[],curbs=[[],[]],dashes=[]
  for(let i=0;i<420;i++) for(const side of [-1,1]) {
    const a=frame(i/420*length,side*11.15),b=frame(i/420*length,side*13)
    curbs[i%2].push([a.p.x,.08,a.p.z,1.1,.13,length/420+.03,a.yaw])
    rails.push([b.p.x,.8,b.p.z,.28,1.1,length/420+.03,b.yaw])
  }
  instances(box,white,curbs[0]);instances(box,red,curbs[1]);instances(box,chrome,rails)
  for(let i=0;i<120;i++) { const a=frame(i/120*length);dashes.push([a.p.x,.055,a.p.z,.13,.02,3,a.yaw]) }
  instances(box,white,dashes)
  const trees=[],trunks=[],rocks=[]
  for(let i=0;i<160;i++) {
    const a=frame(i/160*length,(i%2?1:-1)*(23+(i*17%55))),h=5+i%7
    for(let tier=0;tier<3;tier++) trees.push([a.p.x+Math.sin(i+tier)*1.2,h*.48+tier*1.1,a.p.z+Math.cos(i+tier)*1.2,2.8-tier*.4,h*.32,2.8-tier*.4,i])
    trunks.push([a.p.x,1.7,a.p.z,.45,3.4,.45])
    if(i%3===0) rocks.push([a.p.x+8,1,a.p.z+3,4,3+i%4,3])
  }
  const foliage=instances(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({color:'#527453',roughness:1}),trees)
  const leafColor=new T.Color()
  trees.forEach((_,i)=>foliage.setColorAt(i,leafColor.setHSL(.24+(i%9)*.008,.22,.55+(i%7)*.025)))
  instances(box,new T.MeshStandardMaterial({color:'#65675a'}),trunks)
  instances(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:'#919e95',roughness:1}),rocks)
  const mountains=[]
  for(let i=0;i<22;i++) mountains.push([-700+i*65,24,-450-(i%3)*60,70,70+i%5*30,80])
  instances(new T.ConeGeometry(1,1,6),new T.MeshStandardMaterial({color:'#78908d',roughness:1}),mountains)
  const startFrame=frame(0),gantry=new T.Group()
  gantry.position.copy(startFrame.p);gantry.rotation.y=startFrame.yaw;scene.add(gantry)
  cube(gantry,rubber,-12,4,0,.5,8,.5);cube(gantry,rubber,12,4,0,.5,8,.5)
  cube(gantry,rubber,0,7.5,0,24,1.5,.55)
  const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=128
  const ctx=signCanvas.getContext('2d');ctx.fillStyle='#172322';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#e5ee73';ctx.font='italic bold 74px sans-serif';ctx.textAlign='center';ctx.fillText('HYDRA / COASTAL GP',512,90)
  const signTexture=new T.CanvasTexture(signCanvas);signTexture.colorSpace=T.SRGBColorSpace
  const sign=new T.Mesh(new T.PlaneGeometry(22,2.75),new T.MeshBasicMaterial({map:signTexture,side:T.DoubleSide}));sign.position.set(0,7.6,.3);gantry.add(sign)
  const checks=[[],[]]
  for(let x=0;x<20;x++) for(let z=0;z<2;z++) { const a=frame(z-1,x-9.5);checks[(x+z)%2].push([a.p.x,.06,a.p.z,1,.025,1,a.yaw]) }
  instances(box,white,checks[0]);instances(box,rubber,checks[1])
  for(const side of [-1,1]) {
    const a=frame(70,side*28),stand=new T.Group();stand.position.copy(a.p);stand.rotation.y=a.yaw;scene.add(stand)
    for(let i=0;i<5;i++) cube(stand,i%2?white:red,side*i*.9,i*.65,0,1.5,.65,35)
    cube(stand,white,side*2,6,0,10,.25,38)
    for(const z of [-16,16]) cube(stand,chrome,side*5,3,z,.22,6,.22)
  }
  // Cannon resolves car-to-car contact in unwrapped circuit coordinates.
  const world=new C.World({gravity:new C.Vec3(0,0,0)})
  world.defaultContactMaterial.friction=.05;world.defaultContactMaterial.restitution=.15
  const racers=Array.from({length:8},(_,i)=>{
    const car=makeCar(roster[i])
    const body=new C.Body({mass:1200,shape:new C.Box(new C.Vec3(1,.6,2.25)),linearDamping:0,angularDamping:1,fixedRotation:true})
    body.linearFactor.set(1,0,1);world.addBody(body)
    return {...car,body,index:i,finish:0}
  })
  let selected=0,phase='garage',resumePhase='racing',elapsed=0,countdown=3.5,boost=100,quality='auto',disposed=false,visible=true,last=performance.now(),hudTimer=0,accumulator=0,raf=0,slow=0
  const keys=new Set(), player=racers[0]
  let audio,oscillator,gain,muted=false
  function sound() {
    if(!audio) {
      const Audio=window.AudioContext||window.webkitAudioContext
      if(!Audio)return
      audio=new Audio();oscillator=audio.createOscillator();gain=audio.createGain()
      const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=420
      oscillator.type='sawtooth';oscillator.connect(filter);filter.connect(gain);gain.connect(audio.destination);gain.gain.value=0;oscillator.start()
    }
    audio.resume().catch(()=>{})
  }
  const camTarget=new T.Vector3(),lookTarget=new T.Vector3()
  function reset() {
    racers.forEach((r,i)=>{r.body.position.set(i%2?3:-3,0,-8-Math.floor(i/2)*7);r.body.velocity.set(0,0,0);r.body.angularVelocity.set(0,0,0);r.finish=0;r.body.aabbNeedsUpdate=true})
    elapsed=0;countdown=3.5;boost=100;accumulator=0;keys.clear()
  }
  function snapshot() {
    const position=1+racers.slice(1).filter(r=>player.finish ? r.finish && r.finish<player.finish : r.finish || r.body.position.z>player.body.position.z).length
    publish({phase,speed:Math.round(Math.max(0,player.body.velocity.z)*3.6),lap:Math.min(3,1+Math.floor(Math.max(0,player.body.position.z)/length)),position,time:elapsed,boost,countdown:Math.max(0,Math.ceil(countdown-.5))})
    if(mapContext&&phase!=='garage') {
      mapContext.clearRect(0,0,180,140);mapContext.beginPath()
      points.forEach((p,i)=>{const [x,y]=mapPoint(p);if(i)mapContext.lineTo(x,y);else mapContext.moveTo(x,y)})
      mapContext.strokeStyle='#ffffff65';mapContext.lineWidth=5;mapContext.stroke()
      for(const r of [...racers.slice(1),player]){const [x,y]=mapPoint(r.root.position);mapContext.beginPath();mapContext.arc(x,y,r===player?4:2.5,0,Math.PI*2);mapContext.fillStyle=r===player?'#e5ee73':'#fff';mapContext.fill()}
    }
  }
  function pause() {
    if(phase==='paused') phase=resumePhase
    else if(phase==='racing'||phase==='countdown') {resumePhase=phase;phase='paused'}
    if(audio&&phase==='paused')gain.gain.setTargetAtTime(0,audio.currentTime,.02)
    keys.clear();snapshot()
  }
  function step(dt) {
    if(phase==='countdown') {countdown-=dt;if(countdown<=0)phase='racing';return}
    if(phase!=='racing')return
    elapsed+=dt
    const spec=roster[selected],v=player.body.velocity
    const throttle=keys.has('KeyW')||keys.has('ArrowUp'),brake=keys.has('KeyS')||keys.has('ArrowDown')
    const steering=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))
    const boosting=(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&boost>0&&throttle
    boost=T.MathUtils.clamp(boost+(boosting?-27:9)*dt,0,100)
    const max=(45+spec.stats[0]*.23)+(boosting?17:0)
    v.z=T.MathUtils.clamp(v.z+((throttle?9+spec.stats[1]*.06: -3)-(brake?27:0)+(boosting?9:0))*dt,0,max)
    const near=frame(player.body.position.z).tangent,far=frame(player.body.position.z+25).tangent
    const turn=near.x*far.z-near.z*far.x
    const slide=-turn*v.z*v.z*.008*(1.2-spec.stats[2]/200)
    v.x=T.MathUtils.damp(v.x,steering*(3+spec.stats[2]*.05)*Math.min(1,v.z/9)+slide,7,dt)
    if(Math.abs(player.body.position.x)>9.4) {v.z=Math.max(0,v.z-24*dt);v.x-=Math.sign(player.body.position.x)*15*dt}
    for(const r of racers.slice(1)) {
      const d=r.body.position.z,a=frame(d).tangent,b=frame(d+35).tangent
      const corner=1-a.dot(b),target=47+r.index*1.2-Math.min(18,corner*85)
      r.body.velocity.z=T.MathUtils.damp(r.body.velocity.z,target, .5,dt)
      let lane=(r.index%3-1)*5+Math.sin(d*.012+r.index)*.8
      for(const other of racers) if(other!==r&&other.body.position.z>d&&other.body.position.z-d<16&&Math.abs(other.body.position.x-lane)<2.5) lane=other.body.position.x>0?-5:5
      r.body.velocity.x=T.MathUtils.clamp((lane-r.body.position.x)*1.7,-5,5)
    }
    world.step(dt)
    for(const r of racers) {
      r.body.position.x=T.MathUtils.clamp(r.body.position.x,-10,10)
      if(r.body.position.z>=length*3&&!r.finish) r.finish=elapsed
    }
    if(player.finish) {phase='finished';keys.clear();if(audio)gain.gain.setTargetAtTime(0,audio.currentTime,.05);snapshot()}
  }
  function resize() {const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  const observer=new ResizeObserver(resize);observer.observe(mount);resize()
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&(phase==='racing'||phase==='countdown'))pause()});intersection.observe(mount)
  const blur=()=>{keys.clear();if(phase==='racing'||phase==='countdown')pause()}
  const visibility=()=>{if(document.hidden)blur()}
  window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility)
  function render(now) {
    if(disposed)return
    raf=requestAnimationFrame(render)
    const raw=(now-last)/1000
    if(phase==='garage'&&raw<1/30)return
    const dt=Math.min(raw,.1);last=now
    if(!visible||document.hidden)return
    if(phase==='paused'||phase==='finished')return
    if(quality==='auto'&&raw>.026) {slow+=dt;if(slow>3&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);resize();slow=0}}
    accumulator+=dt
    while(accumulator>=1/60){step(1/60);accumulator-=1/60}
    for(const r of racers) {
      const f=frame(r.body.position.z,r.body.position.x)
      r.root.position.copy(f.p);r.root.position.y=.075
      r.root.visible=r===player||r.root.position.distanceToSquared(player.root.position)<(quality==='low'?14400:40000)
      r.root.rotation.set(0,f.yaw-Math.atan2(r.body.velocity.x,Math.max(15,r.body.velocity.z))*.5,0)
      r.wheels.forEach(w=>{w.rotation.x-=r.body.velocity.z*dt/.39})
    }
    const f=frame(player.body.position.z,player.body.position.x)
    if(phase==='garage') {
      const side=new T.Vector3(f.tangent.z,0,-f.tangent.x)
      camTarget.copy(player.root.position).addScaledVector(f.tangent,8).addScaledVector(side,8)
      camTarget.y=4.5
      lookTarget.copy(player.root.position);lookTarget.y=.7
      // Lift the vehicle above the selector strip on narrow screens.
      camera.setViewOffset(mount.clientWidth,mount.clientHeight,0,mount.clientHeight*.08,mount.clientWidth,mount.clientHeight)
    } else {
      camera.clearViewOffset()
      camTarget.copy(player.root.position).addScaledVector(f.tangent,-7.5-player.body.velocity.z*.025);camTarget.y=5.2
      lookTarget.copy(player.root.position).addScaledVector(f.tangent,11);lookTarget.y=.85
      camera.position.addScaledVector(f.tangent,player.body.velocity.z*dt)
    }
    camera.position.lerp(camTarget,1-Math.exp(-5*dt));camera.lookAt(lookTarget)
    const targetFov=phase==='garage'?48:56+player.body.velocity.z*.14
    camera.fov=T.MathUtils.damp(camera.fov,targetFov,3,dt);camera.updateProjectionMatrix()
    renderer.render(scene,camera)
    if(audio){const running=phase==='racing'&&!muted;gain.gain.setTargetAtTime(running?.025:0,audio.currentTime,.08);oscillator.frequency.setTargetAtTime(35+player.body.velocity.z*2.4,audio.currentTime,.07)}
    mount.dataset.drawCalls=String(renderer.info.render.calls);mount.dataset.triangles=String(renderer.info.render.triangles)
    hudTimer+=dt;if(hudTimer>.1){snapshot();hudTimer=0}
  }
  reset()
  const initialFrame=frame(-8,-3)
  camera.position.copy(initialFrame.p).addScaledVector(initialFrame.tangent,8).add(new T.Vector3(initialFrame.tangent.z*8,4.5,-initialFrame.tangent.x*8))
  raf=requestAnimationFrame(render)
  return {
    select(i){if(phase!=='garage')return;selected=i;player.paint.color.set(roster[i].color)},
    start(){reset();sound();phase='countdown';snapshot()},
    mute(){muted=!muted;return muted},
    garage(){reset();phase='garage';snapshot()},
    pause,blur,
    key(code,down){if(down&&code==='Escape'){pause();return}if(down&&code==='KeyR'&&phase!=='garage'){reset();phase='countdown';snapshot();return}if(down)keys.add(code);else keys.delete(code)},
    quality(value){quality=value;renderer.setPixelRatio(value==='low'?1:Math.min(devicePixelRatio,value==='high'?2:1.5));resize()},
    dispose(){disposed=true;cancelAnimationFrame(raf);audio?.close().catch(()=>{});observer.disconnect();intersection.disconnect();window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());roadTexture.dispose();ao.dispose();signTexture.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove()},
  }
}
