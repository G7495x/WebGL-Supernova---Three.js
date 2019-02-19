if(getUrlParam('showControls')) setupGui()

let stats=new Stats()
stats.showPanel(0)
// document.body.appendChild(stats.dom)

const animate=()=>{
	stats.begin()
	graphicsUpdate()
	requestAnimationFrame(animate)
	stats.end()
}
animate()
setTimeout(()=>document.getElementById('title').classList.add('side'),1000)

// Prevent pinch zoom for website
document.documentElement.addEventListener('touchstart',(event)=>{
	if(event.touches.length>1) event.preventDefault()
},false)
