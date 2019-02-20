const renderer=new THREE.WebGLRenderer({
	antialias:             true,
	canvas:                rendererEle,
	alpha:                 true,
	preserveDrawingBuffer: true,
})

const scene=new THREE.Scene()
const camera=new THREE.PerspectiveCamera()
camera.position.set(0,0,10)
camera.lookAt(0,0,0)
// const controls=new THREE.OrbitControls(camera,rendererEle)

const setupRenderer=()=>{
	let viewportWidth=document.body.offsetWidth
	let viewportHeight=document.body.offsetHeight
	let aspectRatio=viewportWidth/viewportHeight

	renderer.setSize(viewportWidth,viewportHeight)
	renderer.setPixelRatio(window.devicePixelRatio)

	// Universal desktop and mobile friendly FOV algorithm
	camera.fov=45*(aspectRatio>1?1:Math.atan(1/aspectRatio)/piBy180/45)
	camera.aspect=aspectRatio
	camera.updateProjectionMatrix()
}
setupRenderer()
window.addEventListener('resize',()=>{ setupRenderer() },true)

const spherePoints=fibonacciSpherePoints(spherePointCount) // Fibonacci Sphere point positions
const sphereTexture=new THREE.DataTexture( // spherePoints[] as a texture for shaders
	spherePoints,
	gpgpuTexWidth,
	gpgpuTexBatchHeight,
	THREE.RGBFormat,
	THREE.FloatType,
)
sphereTexture.needsUpdate=true

const uniforms={
	uBatchCount      :{ value: batchCount          },
	uColor           :{ value: colors[color]       },
	uCurliness       :{ value: curliness           },
	uDirection       :{ value: null                },
	uFadeHardness    :{ value: fadeHardness        },
	uOffset          :{ value: null                },
	uParticleOpacity :{ value: particleOpacity     },
	uParticleSize    :{ value: particleSize        },
	uParticleSpeed   :{ value: particleSpeed       },
	uReactiveness    :{ value: reactiveness        },
	uSphere          :{ value: sphereTexture       },
	uSphereRadius    :{ value: sphereRadius        },
	uTexBatchHeight  :{ value: gpgpuTexBatchHeight },
	uTime            :{ value: Math.random()       },
}

// GPGPU - Perform Calculations in GPU & output as texture
const gpuCompute=new GPUComputationRenderer(gpgpuTexWidth,gpgpuTexHeight,renderer)

// Shaders for computing particle positions(offsets),directions
const offsetShader=httpGetText(document.getElementById('gpuComputeOffset').src)
const directionShader=httpGetText(document.getElementById('gpuComputeDirection').src)

// Texture outputs for particle positions(offsets),directions
const offsets=gpuCompute.addVariable('offset',offsetShader,gpuCompute.createTexture())
const directions=gpuCompute.addVariable('direction',directionShader,gpuCompute.createTexture())

offsets.material.uniforms=uniforms
directions.material.uniforms=uniforms

gpuCompute.setVariableDependencies(directions,[offsets])
gpuCompute.setVariableDependencies(offsets,[offsets,directions])

const gpuComputeError=gpuCompute.init()
if(gpuComputeError) console.error(gpuComputeError)

uniforms.uOffset.value=gpuCompute.getCurrentRenderTarget(offsets).texture
uniforms.uDirection.value=gpuCompute.getCurrentRenderTarget(directions).texture

const triangleVertices=new Float32Array([
	 0                 , 1  ,0,
	-0.8660254037844387,-0.5,0,
	 0.8660254037844387,-0.5,0,
])
const faces=[0,1,2]
const geometry=new THREE.InstancedBufferGeometry()
geometry.addAttribute('position',new THREE.Float32BufferAttribute(triangleVertices,3))
geometry.setIndex(faces)

const indices=new Float32Array(particleCount*2)
for(let i=0,j=0;i<particleCount;++i){
	indices[j++]=(i%gpgpuTexWidth+.5)/gpgpuTexWidth
	indices[j++]=(Math.floor(i/gpgpuTexWidth)+.5)/gpgpuTexHeight
}
geometry.addAttribute('aIndex',new THREE.InstancedBufferAttribute(indices,2))
geometry.maxInstancedCount=particleCount

const material=new THREE.ShaderMaterial({
	vertexShader: httpGetText(document.getElementById('vertexShader').src),
	fragmentShader: httpGetText(document.getElementById('fragmentShader').src),
	blending: THREE.AdditiveBlending,
	transparent: true,
	depthTest: false,
	depthWrite: false,
})
// material.wireframe=true
material.uniforms=uniforms

const particles=new THREE.Mesh(geometry,material)
// particles.rotation.x=45*piBy180
// particles.rotation.z=45*piBy180
scene.add(particles)


for(let i=0;i<=batchCount*2;++i)
	gpuCompute.compute()

let then=new Date().getTime()/1000 // Timestamp of last frame
const graphicsUpdate=()=>{
	const now=new Date().getTime()/1000
	const deltaT=now-then

	particles.rotation.y-=deltaT/5
	renderer.render(scene,camera)

	then=now
}

