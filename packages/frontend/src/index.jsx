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
      content="The server is currently paused, we will announce right after it is redeployed."
      button={<></>}
    />
    <ScrollToTop />
    <Routes />
  </BrowserRouter>
)

const root = createRoot(document.getElementById('root'))
root.render(<App />)
