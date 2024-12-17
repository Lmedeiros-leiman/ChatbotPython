import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// include botstrap
import 'bootstrap/dist/css/bootstrap.min.css'

import SupportRequestPanel from '../components/SupportRequestPanel';
import AuthProvider from '../libs/Auth/Auth';
//


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <section className=' container'>
      <h1>This is the Client side part</h1>

      <aside className=' position-fixed bottom-0 end-0'>
        <AuthProvider>
          <SupportRequestPanel />
        </AuthProvider>
        
      </aside>
      

    </section>
  </StrictMode>,
)
