import './App.css';
import io from 'socket.io-client'
import { useEffect } from 'react';
const socket = io.connect('http://localhost:3001')

function App() {

  useEffect(()=>{
    socket.on('receive_message', (data)=> {
      alert(data.message)
    })

  }, [socket])

  const sendMessage = () => {
      socket.emit("send_message", {message: "hello"})
  }

  return (
    <div className="App">
        <input type="text" placeholder="Message"/>
        <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
