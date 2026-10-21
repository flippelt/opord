import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import '@fontsource/oswald/700.css'
import '@fontsource/share-tech-mono/400.css'
import '@fontsource/cedarville-cursive/400.css'
import '@fontsource/dancing-script/500.css'
import '@fontsource/herr-von-muellerhoff/400.css'
import '@fontsource/homemade-apple/400.css'
import '@fontsource/la-belle-aurore/400.css'
import '@fontsource/monsieur-la-doulaise/400.css'
import '@fontsource/mrs-saint-delafield/400.css'
import '@fontsource/zeyada/400.css'
import { App } from './App'
import './styles/signature-fonts.css'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
