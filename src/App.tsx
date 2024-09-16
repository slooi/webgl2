import './App.css'
import React, { useEffect } from 'react'
import { createWebglRenderer } from './webgl'

function App() {
  useEffect(() => {
    console.log("useEffect ran!")
    createWebglRenderer()
  }, [])
  return (
    <>
      <canvas></canvas>
    </>
  )
}


export default App
