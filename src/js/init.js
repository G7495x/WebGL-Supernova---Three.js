// TODO
// Icon

const colors={
	blue   :new Float32Array([.075,.25,1]),
	green  :new Float32Array([.375,1,.075]),
	orange :new Float32Array([1,.225,.075]),
	red    :new Float32Array([1,.15,.05]),
	violet :new Float32Array([.2,.075,1]),
	yellow :new Float32Array([1,.375,.075]),
}

gpgpuTexWidth   =1*getUrlParam('gpgpuTexWidth')
spherePointCount=1*getUrlParam('spherePointCount')

batchCount      =1*getUrlParam('batchCount')
color           =  getUrlParam('color')
curliness       =1*getUrlParam('curliness')
fadeHardness    =1*getUrlParam('fadeHardness')
particleOpacity =1*getUrlParam('particleOpacity')
particleSize    =1*getUrlParam('particleSize')
particleSpeed   =1*getUrlParam('particleSpeed')
reactiveness    =1*getUrlParam('reactiveness')
sphereRadius    =1*getUrlParam('sphereRadius')

// Compile time parameters
gpgpuTexWidth   ||(gpgpuTexWidth   =2048)
spherePointCount||(spherePointCount=2048*8)
batchCount      ||(batchCount      =7) // Particle are emitted in 'batches'

curliness      ||(curliness      =1.375)
particleSpeed  ||(particleSpeed  =.75)
reactiveness   ||(reactiveness   =1) // Controls the amount of variation

// NOTE:
// - gpgpuTexWidth must be a power of 2 (for performance)
// - spherePointCount must be a multiple of gpgpuTexWidth
// - particleLifetime*emitFrequency must be a whole number

// Run time parameters
color          ||(color          ='red')
fadeHardness   ||(fadeHardness   =batchCount*4/7)
particleOpacity||(particleOpacity=.625)
particleSize   ||(particleSize   =.025)
// sphereRadius   ||(sphereRadius   =.375)
sphereRadius   ||(sphereRadius   =clamp(Math.random(),1/3,1/2))

// Initializing Constants
const rendererEle        =document.getElementById('renderer')
const gpgpuTexBatchHeight=spherePointCount/gpgpuTexWidth
const gpgpuTexHeight     =gpgpuTexBatchHeight*batchCount
const particleCount      =spherePointCount*batchCount

// Setup dat.gui
let gui
const setupGui=()=>{
	gui=new dat.GUI()

	const color_          =gui.add(window,'color',Object.keys(colors)).name('Color').onChange(v=>uniforms.uColor.value=colors[v])
	const curliness_      =gui.add(uniforms.uCurliness,'value',0,2).name('Curliness').step(.01)
	const fadeHardness_   =gui.add(uniforms.uFadeHardness,'value',0,batchCount).name('Fade Hardness').step(.01)
	const particleSize_   =gui.add(uniforms.uParticleSize,'value',0,.1).name('Particle Size').step(.005)
	const particleSpeed_  =gui.add(uniforms.uParticleSpeed,'value',0,3).name('Particle Speed').step(.01)
	const particleOpacity_=gui.add(uniforms.uParticleOpacity,'value',0,1).name('Opacity').step(.01)
	const reactiveness_   =gui.add(uniforms.uReactiveness,'value',0,2).name('Reactiveness').step(.01)
	const sphereRadius_   =gui.add(uniforms.uSphereRadius,'value',0,2).name('Sphere Radius').step(.01)

	gui.close()
}
