import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userPseudo, setUserPseudo] = useState("");
  const [pseudoSave, setPseudoSave] = useState(false);
  const [error, setError] = useState("");
  const [userList, setUserList] = useState([]);

  const [message, setMessage] = useState("")

  const savePseudo = () => {

    if (userPseudo) {
      if(userList.find(objet => objet.pseudo === userPseudo)){
        setError("Ce pseudo est déjà pris"); 
      } else {
        socket.emit("save_pseudo", { userPseudo });
        setError("");
        setPseudoSave(true);
      }
    } else {
      setError("Veuillez rentrer un pseudo");
    }
  };

  const sendMessage = () => {
    socket.emit('message', message)
  }

  socket.on("disconnect", () => {
    socket.emit("disconnected", true);
  });

  useEffect(()=>{
console.log(message);
  },[message])

  useEffect(() => {
    socket.on("new_user", (data) => {
      setUserList(data)
    });
    // eslint-disable-next-line
  }, [userList]);

  useEffect(() => {
    socket.on("delete_user", (data) => {
      setUserList(data)
    });
  }, [userList]);

  return pseudoSave ? (
    <div className="h-screen flex relative bg-neutral-800">
      <div className="h-full">{userPseudo}</div>

      <div className="flex flex-1 flex-col h-full bg-neutral-900">
        <div className="flex-1 border-x border-x-neutral-700"></div>
        <div className="flex justify-center">
        <input
          type="text"
          name="chat"
          id="chat"
          onChange={el => setMessage(el.target.value)}
          className="w-full mb-2 max-w-2xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button onSubmit={sendMessage} className="bg-neutral-100 border-neutral-600 border rounded-r-lg mb-2 px-4 hover:bg-neutral-500">
          Send
        </button>
      </div>
      </div>

      <div className="px-8 py-4">
        <ul>
          {userList.map((data) => {
            return (
              <li key={data.id} className="text-white">
                {data.pseudo}
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  ) : (
    <div className="w-full h-screen bg-neutral-900 flex justify-center items-center">
      <div className=" px-20 py-16 bg-neutral-800 rounded-lg">
        <label
          htmlFor="pseudo"
          className=" cursor-pointer block mb-2 text-base font-medium text-neutral-900 dark:text-white"
        >
          Your Pseudo
        </label>
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          maxLength={12}
          className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => setUserPseudo(event.target.value)}
        />
        {error && <p className="text-sm text-rose-900 mt-1">{error}</p>}
        <button
          onClick={savePseudo}
          className="bg-white px-4 py-1 rounded hover:bg-neutral-200 mt-8 m-auto"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
