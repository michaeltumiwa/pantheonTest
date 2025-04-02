import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CanvasVideo from './CanvasVideo.tsx'
import SearchImages from './SearchImages.tsx'
import GraphQLImageSearch from './GQLSearchImages.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CanvasVideo/>
      <SearchImages/>
      <GraphQLImageSearch/>
    </>
  )
}

export default App