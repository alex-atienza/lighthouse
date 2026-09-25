import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { LighthouseProvider } from './store/LighthouseProvider'
import { FxProvider } from './components/fx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LighthouseProvider>
      <FxProvider>
        <RouterProvider router={router} />
      </FxProvider>
    </LighthouseProvider>
  </React.StrictMode>,
)
