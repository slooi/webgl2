import './App.css'
import { useEffect, useRef, useState } from 'react'
import { createWebglRenderer } from './webgl'


// const renderer = createWebglRenderer()

function App() {
  const [scale, setScale] = useState<number>(1)
  const [translation, setTranslation] = useState<[number, number]>([0, 0])
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
    renderer.translate(translation[0], translation[1])
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
          <p>translate x : {translation[0]}</p>
          <input value={translation[0]} type="range" onChange={e => setTranslation(t => [Number(e.target.value), t[1]])} min="0" max="300" step="1" />
          <p>translate y : {translation[1]}</p>
          <input value={translation[1]} type="range" onChange={e => setTranslation(t => [t[0], Number(e.target.value)])} min="0" max="300" step="1" />
        </div>
      </div>
    </>
  )
}


export default App
