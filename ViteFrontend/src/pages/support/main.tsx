import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from '../../libs/Auth/Auth'
import ChatList from '../../components/Chat/ChatList'
import AlertSound from '../../assets/alert.wav'

// include botstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import SocketProvider, {  useSupportSocket } from '../../libs/Socket/Socket'
import { Socket } from 'socket.io-client'

const SupportPage : React.FC = () => {
  //const socket = useGeneralSocket() as Socket
  const supportChannel = useSupportSocket() as Socket

  


  supportChannel.on("chat_started", (data) => {
    console.log(data)
    new Audio(AlertSound).play()
  })


  return(<div className="d-flex w-100 bg-warning">
    <section className="h-100 bg-danger ">
        <ChatList />
    </section>
    this should work, by the way.
    
</div>)
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


