import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userID, setUserID] = useState("");
  const [userPseudo, setUserPseudo] = useState("");
  const [userAge, setUserAge] = useState(0);
  const [userGender, setUserGender] = useState("");

  const [infosSave, setInfosSave] = useState(false);
  const [error, setError] = useState("");
  const [usersList, setUsersList] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  socket.on("disconnect", (data) => {
    socket.emit("disconnected", true);
    setInfosSave(false);
  });

  socket.on("connect", () => {
    const clientId = socket.id; // Récupération de l'ID du client
    setUserID(clientId);
  });

  const saveUserInfos = () => {
    if (userPseudo) {
      if (!usersList.find((objet) => objet.pseudo === userPseudo)) {
        if (userGender) {
          if (userAge) {
            if (userAge >= 18) {
              socket.emit("save_user_infos", {
                pseudo: userPseudo,
                gender: userGender,
                age: userAge,
              });
              setError("");
              setInfosSave(true);
            } else {
              setError("Vous devez être majeur pour rentrer");
            }
          } else {
            setError("Veuillez renseigner votre âge");
          }
        } else {
          setError("Veuillez renseigner votre genre");
        }
      } else {
        setError("Ce pseudo est déjà pris");
      }
    } else {
      setError("Veuillez rentrer un pseudo");
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", newMessage);
    setNewMessage("")
    setInfosSave(true);
  };

  useEffect(() => {
    socket.on("new_user", (data) => {
      setUsersList(data);
    });
  }, [usersList]);

  useEffect(() => {
    socket.on("delete_user", (data) => {
      setUsersList(data);
    });
  }, [usersList]);

  useEffect(() => {
    socket.on("received_message", (messages) => {
      setMessages(messages.data);
    });
  }, [messages]);

  return infosSave ? (
    <div className="h-screen flex relative bg-neutral-950">
      <div className="h-full w-60 py-4 px-4">
        <div className="h-full bg-neutral-900 rounded-lg flex justify-center  py-4 px-4 text-white">{userPseudo}</div>
      </div>

      <div className="flex-1 h-full ">
        <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
          {messages.map((data) => {
            const additionalClass =
              data.user_id === userID ? "self-end" : "self-start";
            const date = new Date(data.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Notez que les mois commencent à partir de 0 (janvier = 0)
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            return (
              <div
                className={`flex flex-col my-4 ${additionalClass}`}
                key={data.id}
              >
                <div className={`text-white ${additionalClass}`}>
                  {data.pseudo}
                </div>
                <div
                  className={`flex flex-col bg-neutral-500 py-2 px-4 rounded-lg  `}
                >
                  {data.message}
                  <span className="text-xs text-neutral-700">{`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <input
            type="text"
            name="chat"
            id="chat"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className="w-full max-w-2xl bg-neutral-50 border border-neutral-300 text-neutral-950 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-neutral-100 border-neutral-600 border rounded-r-lg px-4 hover:bg-neutral-500"
          >
            Send
          </button>
        </div>
      </div>

      <div className=" w-60 py-4 px-4 ">
        <div className="px-8 py-4 h-full bg-neutral-900 rounded-lg">
          <ul>
            {usersList.map((data) => {
              return (
                <li key={data.id} className="text-white">
                  <span
                    className={
                      data.gender === "Male" ? "text-blue-400" : "text-pink-400"
                    }
                  >
                    {data.pseudo}
                  </span>{" "}
                  {data.age}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen bg-neutral-950 flex justify-center items-center">
      <div className=" px-20 py-16 bg-neutral-900 rounded-lg flex flex-col ">
        <div>
          <label
            htmlFor="pseudo"
            className="cursor-pointer text-base font-medium text-neutral-900 dark:text-white"
          >
            Ton pseudo
          </label>
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            maxLength={12}
            className="bg-neutral-50 border mt-2 border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) => setUserPseudo(event.target.value)}
          />
        </div>

        <div
          className="py-4"
          onChange={(event) => setUserGender(event.target.value)}
        >
          <input type="radio" name="genre" id="male" value={"Male"} />
          <label
            className="cursor-pointer ml-2 text-base font-medium text-neutral-900 dark:text-white"
            htmlFor="male"
          >
            Homme
          </label>
          <input
            className="ml-4"
            type="radio"
            name="genre"
            id="female"
            value={"Female"}
          />
          <label
            className="cursor-pointer ml-2 text-base font-medium text-neutral-900 dark:text-white"
            htmlFor="female"
          >
            Femme
          </label>
        </div>

        <div className="flex items-center">
          <label
            htmlFor="age"
            className="mr-2  cursor-pointer mb-2 text-base font-medium text-neutral-900 dark:text-white"
          >
            Ton âge
          </label>

          <input
            className=" text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
            onChange={(event) => setUserAge(event.target.value)}
            type="number"
            min={0}
            max={99}
            maxLength={2}
            name="age"
            id="age"
          />
        </div>

        <p className="text-sm text-rose-900 h4 mt-1">{error}</p>
        <button
          onClick={saveUserInfos}
          className="bg-white px-4 py-1 rounded hover:bg-neutral-200 mt-8 m-auto"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default App;
