import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from '../../libs/Auth/Auth'
import ChatList from '../../components/Chat/ChatList'


// include botstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import SocketProvider from '../../libs/Socket/Socket'

const SupportPage : React.FC = () => {


  return(<section className="w-100 h-100 bg-danger ">
        <ChatList />
    </section>)
}




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider >
        <SupportPage />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)


