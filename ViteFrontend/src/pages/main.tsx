import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// include botstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SupportRequestPanel from '../components/SupportRequestPanel';
//


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <section className=' container'>
      <h1>This is the Client side part</h1>

      <aside className=' position-fixed bottom-0 end-0'>
        <SupportRequestPanel />
      </aside>
      

    </section>
  </StrictMode>,
)
