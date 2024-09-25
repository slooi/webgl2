import './App.css'
import { useEffect, useRef, useState } from 'react'
import { createWebglRenderer } from './webgl'
import { UserInputHandler } from './UserInputHandler'

const userInputHandler = new UserInputHandler()

function App() {
  const [scale, setScale] = useState<number>(1)
  const [originTranslation, setOriginTranslation] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })
  const [translation, setTranslation] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: -50 })
  const [rotation, setRotation] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 30, z: 0 })

  const [renderer, setRenderer] = useState<ReturnType<typeof createWebglRenderer> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const newRenderer = createWebglRenderer(canvasRef.current)
      setTimeout(() => setRenderer(newRenderer), 200)
    }

    userInputHandler.on("w", () => setTranslation(v => ({ x: v.x, y: v.y, z: v.z + 5 })))
    userInputHandler.on("s", () => setTranslation(v => ({ x: v.x, y: v.y, z: v.z - 5 })))
    userInputHandler.on("a", () => setTranslation(v => ({ x: v.x - 5, y: v.y, z: v.z })))
    userInputHandler.on("d", () => setTranslation(v => ({ x: v.x + 5, y: v.y, z: v.z })))
    userInputHandler.on("q", () => setTranslation(v => ({ x: v.x, y: v.y - 5, z: v.z })))
    userInputHandler.on("e", () => setTranslation(v => ({ x: v.x, y: v.y + 5, z: v.z })))
    return () => {
      userInputHandler.removeAll()
    }
  }, [])

  const clickHandler = async (e: MouseEvent) => await canvasRef.current?.requestPointerLock()
  const mouseMoveHandler = (e: MouseEvent) => {
    console.log("e", e.movementX, e.movementY)
    setRotation(val => ({ x: val.x - e.movementY, y: val.y - e.movementX, z: val.z }))
  }

  useEffect(() => {
    canvasRef.current?.addEventListener("click", clickHandler);
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvasRef.current?.removeEventListener("click", clickHandler)
      document.removeEventListener("mousemove", mouseMoveHandler)
    }
  }, [canvasRef])

  useEffect(() => {
    if (!renderer) return
    console.log("scale, translation, rotation, originTranslation", scale, translation, rotation, originTranslation)

    renderer.clear()
    renderer.scale(scale, scale, scale)
    renderer.translate(originTranslation.x, originTranslation.y, originTranslation.z)
    renderer.rotateX(rotation.x)
    renderer.rotateY(rotation.y)
    renderer.rotateZ(rotation.z)
    renderer.translate(translation.x, translation.y, translation.z)
    renderer.draw()
  }, [renderer, scale, translation, rotation, originTranslation])

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <canvas ref={canvasRef}></canvas>
        <div style={{ margin: "1rem" }}>
          <p>scale : {scale}</p>
          <input value={scale} type="range" onChange={e => setScale(Number(e.target.value))} min="-2" max="2" step=".1" style={{ width: "18rem" }} />
          <p>rotate X: {rotation.x}</p>
          <input value={rotation.x} type="range" onChange={e => setRotation(v => ({ ...v, x: Number(e.target.value) }))} min="-360" max="360" step="1" style={{ width: "18rem" }} />
          <p>rotate Y: {rotation.y}</p>
          <input value={rotation.y} type="range" onChange={e => setRotation(v => ({ ...v, y: Number(e.target.value) }))} min="-360" max="360" step="1" style={{ width: "18rem" }} />
          <p>rotate Z: {rotation.z}</p>
          <input value={rotation.z} type="range" onChange={e => setRotation(v => ({ ...v, z: Number(e.target.value) }))} min="-360" max="360" step="1" style={{ width: "18rem" }} />
          <p>translate x : {translation.x}</p>
          <input value={translation.x} type="range" onChange={e => setTranslation(v => ({ ...v, x: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />
          <p>translate y : {translation.y}</p>
          <input value={translation.y} type="range" onChange={e => setTranslation(v => ({ ...v, y: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />
          <p>translate z : {translation.z}</p>
          <input value={translation.z} type="range" onChange={e => setTranslation(v => ({ ...v, z: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />

          <h3 style={{ marginTop: "1rem" }}>Origin Parameters</h3>
          <p>origin translate x : {originTranslation.x}</p>
          <input value={originTranslation.x} type="range" onChange={e => setOriginTranslation(v => ({ ...v, x: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />
          <p>origin translate y : {originTranslation.y}</p>
          <input value={originTranslation.y} type="range" onChange={e => setOriginTranslation(v => ({ ...v, y: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />
          <p>origin translate z : {originTranslation.z}</p>
          <input value={originTranslation.z} type="range" onChange={e => setOriginTranslation(v => ({ ...v, z: Number(e.target.value) }))} min="-1500" max="1500" step="1" style={{ width: "18rem" }} />
        </div>
      </div >
    </>
  )
}


export default App
