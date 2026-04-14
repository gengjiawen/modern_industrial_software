import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { installRendererConsoleForwarding } from '@/lib/rendererConsoleForwarding'
import { router } from '@/router'
import './global.css'
import './i18n'

installRendererConsoleForwarding()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
