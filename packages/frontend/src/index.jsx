import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Popup from './components/Popup'

import Routes from './Routes'

const App = () => (
  <BrowserRouter>
    <Popup
      open={true}
      onClose={() => {}}
      title="Announcement"
      content="The server is currently paused, we will announce right after it restarts."
      button={
        <button
          style={{
            borderRadius: '24px',
            padding: '12px 24px',
            fontWeight: '600',
          }}
        >
          <a
            target="_blank"
            href="https://discord.com/invite/VzMMDJmYc5"
            style={{ color: 'black' }}
          >
            Discord
          </a>
        </button>
      }
    />
    <ScrollToTop />
    <Routes />
  </BrowserRouter>
)

const root = createRoot(document.getElementById('root'))
root.render(<App />)
