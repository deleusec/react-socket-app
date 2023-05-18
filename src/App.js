import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://192.168.1.6:3001");

function App() {
  const [userPseudo, setUserPseudo] = useState("");
  const [error, setError] = useState("");

  const savePseudo = () => {
    if(userPseudo !== "" && userPseudo) {
      socket.emit("save_pseudo", { userPseudo });
      setError("")
    } else {
      setError("Veuillez rentrer un pseudo")
    }
  };

  socket.on("disconnect", () => {
    socket.emit("disconnected", true); 
  });

  useEffect(() => {
    socket.on("receive_message", (data) => {});
  }, []);

  return (
    <div className="w-full h-screen bg-neutral-900 flex justify-center items-center">
      <div className=" px-20 py-16 bg-neutral-800 rounded-lg">
        <label for="pseudo" class=" cursor-pointer block mb-2 text-base font-medium text-neutral-900 dark:text-white">Your Pseudo</label>
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          maxLength={12}
          className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setUserPseudo(event.target.value)}
        />
        {error && <p className="text-sm text-rose-900 mt-1">{error}</p>}
        <button onClick={savePseudo} className="bg-white px-4 py-1 rounded hover:bg-neutral-200 mt-8 m-auto">Save</button>
      </div>
    </div>
  );
}

export default App;
