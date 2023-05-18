const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const fs = require("fs");

// socket.io
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.6:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log('a user connected');

  socket.on("save_pseudo", (pseudo) => {
    
    socket.pseudo = pseudo.userPseudo;

    // Lire le contenu du fichier JSON existant
    fs.readFile("./data/users.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Erreur lors de la lecture du fichier JSON :", err);
        return;
      }

      // Analyser le contenu JSON existant en un objet JavaScript
      let users = JSON.parse(data);
      // Ajouter le nouveau pseudo à l'objet JavaScript
      users[socket.id] = { pseudo: socket.pseudo };
      // Convertir l'objet JavaScript en chaîne de caractères JSON
      const jsonContent = JSON.stringify(users);

      // Enregistrer le contenu mis à jour dans le fichier
      fs.writeFile("./data/users.json", jsonContent, "utf8", (err) => {
        if (err) {
          console.error(
            "Erreur lors de l'enregistrement du fichier JSON :",
            err
          );
          return;
        }
        console.log("Pseudo ajouté avec succès dans le fichier JSON.");
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
