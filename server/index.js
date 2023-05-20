const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let users = [];

io.on("connection", (socket) => {
  io.sockets.emit("new_user", users);
  fs.readFile('./data/messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  
    try {
      const json = JSON.parse(data);
      
      io.sockets.emit("received_message", json)
    } catch (error) {
      console.error('Erreur lors de l\'analyse du fichier JSON:', error);
      // Gérer l'erreur lors de l'analyse du fichier JSON
    }
  });

  socket.on("send_message", (message) => {
    // Lire le contenu du fichier JSON existant
    fs.readFile("./data/messages.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Erreur lors de la lecture du fichier JSON :", err);
        return;
      }

      // Analyser le contenu JSON existant en un objet JavaScript
      let messages = JSON.parse(data);
      const indexOf =
        messages.data.length === 0
          ? 1
          : messages.data[messages.data.length - 1].index + 1;

      // Ajouter le nouveau message à l'objet JavaScript
      messages.data.push({
        "index": indexOf,
        "id" : uuidv4(),
        "user_id" : socket.id,
        "pseudo": socket.pseudo,
        "message": message,
        "date": new Date(),
      });
      // Convertir l'objet JavaScript en chaîne de caractères JSON
      const jsonContent = JSON.stringify(messages);

      console.log(jsonContent);

      // Enregistrer le contenu mis à jour dans le fichier
      fs.writeFile("./data/messages.json", jsonContent, "utf8", (err) => {
        if (err) {
          console.error(
            "Erreur lors de l'enregistrement du fichier JSON :",
            err
          );
          return;
        }
        fs.readFile('./data/messages.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
        
          try {
            const json = JSON.parse(data);
            
            io.sockets.emit("received_message", json)
          } catch (error) {
            console.error('Erreur lors de l\'analyse du fichier JSON:', error);
            // Gérer l'erreur lors de l'analyse du fichier JSON
          }
        });
        console.log("Message ajouté avec succès dans le fichier JSON.");
      });
    });
  });

  socket.on("save_user_infos", (data) => {
    // Ajouter les infos au socket de l'utilisateur
    socket.pseudo = data.pseudo;
    socket.gender = data.gender;
    socket.age = data.age;

    users.push({
      id: socket.id,
      pseudo: socket.pseudo,
      gender: socket.gender,
      age: socket.age,
    });
    io.sockets.emit("new_user", users);
  });

  
  socket.on("disconnect", () => {
    const usersFiltres = users.filter((element) => {
      if (element.id !== socket.id) {
        return element;
      }
    });

    users = usersFiltres;
    io.sockets.emit("delete_user", usersFiltres);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
