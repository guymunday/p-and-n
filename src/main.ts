import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import gsap from "gsap"

const rugSrc = "/guys-rug.png"

class Rug {
  private container: HTMLDivElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private geometry: THREE.PlaneGeometry
  private material!: THREE.MeshBasicMaterial
  private loader: THREE.TextureLoader
  private rug!: THREE.Mesh
  private controls: OrbitControls
  private clock: THREE.Clock

  constructor() {
    this.container = document.querySelector("#canvas") as HTMLDivElement
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearAlpha(0)
    this.renderer.outputColorSpace = THREE.LinearDisplayP3ColorSpace

    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.update()

    this.geometry = new THREE.PlaneGeometry(5, 3, 100, 6)
    this.loader = new THREE.TextureLoader()

    this.clock = new THREE.Clock()

    this.addRug()
    this.animate()

    this.handleResize()
    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  private addRug() {
    this.loader.load(rugSrc, (texture) => {
      this.material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        alphaHash: true,
      })

      this.rug = new THREE.Mesh(this.geometry, this.material)
      this.rug.rotation.set(-1, 0, 1)

      this.scene.add(this.rug)
    })
  }

  private animateRug() {
    let pos = this.geometry.attributes.position
    let v = new THREE.Vector3()
    const t = this.clock.getElapsedTime()

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const wavex1 = 0.5 * Math.sin(v.x * 1 + t)
      const wavex2 = 0.25 * Math.sin(v.x * 2 + t * 2)
      const wavex3 = 0.5 * Math.sin(v.y + t)

      pos.setZ(i, wavex1 + wavex2 + wavex3)
    }
    pos.needsUpdate = true
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this))

    this.animateRug()

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
  }
}

function handleTextAnimation() {
  const container = document.querySelector(".content") as HTMLDivElement
  const words = container.innerText.split(" ")
  container.innerHTML = ""

  words.map((word) => {
    const span = document.createElement("span")
    span.classList.add("word")
    span.innerText = `${word}`

    container.appendChild(span)
  })

  let tl = gsap.timeline()

  tl.to(".content", { opacity: 1 }).fromTo(
    ".word",
    {
      opacity: 0,
      y: 40,
      skewY: 15,
    },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.5,
      ease: "back.inOut(1)",
    }
  )
}

handleTextAnimation()
new Rug()
