import './App.css'
import { useEffect, useRef, useState } from 'react'
import { createWebglRenderer } from './webgl'


// const renderer = createWebglRenderer()

function App() {
  const [scale, setScale] = useState<number>(1)
  const [translation, setTranslation] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })

  const [renderer, setRenderer] = useState<ReturnType<typeof createWebglRenderer> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const newRenderer = createWebglRenderer(canvasRef.current)
      setRenderer(newRenderer)
    }
  }, [])
  useEffect(() => {
    console.log("useEffect ran!")
    if (!renderer) return

    renderer.clear()
    renderer.scale(scale, scale)
    renderer.rotateX(rotation.x)
    renderer.rotateY(rotation.y)
    renderer.rotateZ(rotation.z)
    renderer.translate(translation.x, translation.y, translation.z)
    renderer.draw()
  }, [scale, translation, rotation])

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <canvas ref={canvasRef}></canvas>
        <div style={{ margin: "1rem" }}>
          <p>scale : {scale}</p>
          <input value={scale} type="range" onChange={e => setScale(Number(e.target.value))} min="0" max="2" step=".1" />
          <p>rotate X: {rotation.x}</p>
          <input value={rotation.x} type="range" onChange={e => setRotation(v => ({ ...v, x: Number(e.target.value) }))} min="0" max="300" step="1" />
          <p>rotate Y: {rotation.y}</p>
          <input value={rotation.y} type="range" onChange={e => setRotation(v => ({ ...v, y: Number(e.target.value) }))} min="0" max="300" step="1" />
          <p>rotate Z: {rotation.z}</p>
          <input value={rotation.z} type="range" onChange={e => setRotation(v => ({ ...v, z: Number(e.target.value) }))} min="0" max="300" step="1" />
          <p>translate x : {translation.x}</p>
          <input value={translation.x} type="range" onChange={e => setTranslation(v => ({ ...v, x: Number(e.target.value) }))} min="0" max="300" step="1" />
          <p>translate y : {translation.y}</p>
          <input value={translation.y} type="range" onChange={e => setTranslation(v => ({ ...v, y: Number(e.target.value) }))} min="0" max="300" step="1" />
          <p>translate z : {translation.z}</p>
          <input value={translation.z} type="range" onChange={e => setTranslation(v => ({ ...v, z: Number(e.target.value) }))} min="0" max="300" step="1" />
        </div>
      </div>
    </>
  )
}


export default App
