const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const { title } = require('process');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;


var file_vote = "first_vote.json";
var votedDevice = [];

app.use(express.static(path.join(__dirname, 'public')));
// app.use("/public", express.static('./public/'));

app.get('/', (req, res) => {
  
  res.sendFile(__dirname + '/public/quizz.html');

}).get('/admin', (req, res) => {

  res.sendFile(__dirname + '/public/admin.html');

});

io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('new-user', function(data){
      let newUid = data.uid;
      console.log("new user with uid: " + newUid);

      let rawdata = fs.readFileSync(__dirname + "/public/data/" + file_vote);
      let titles = JSON.parse(rawdata);
      
      socket.emit("send-titles", {titles: titles});

    });

    /**
     * - Update json data
     * - TODO: Update Display
     */
    socket.on('new-vote', function(data){
      let vote_id = data.vote_id;
      let client_id = data.client_id;

      
      // si le client n'a pas encore voté
      if(!votedDevice.includes(client_id)){
      
        let rawdata = fs.readFileSync(__dirname + "/public/data/" + file_vote);
        let titles = JSON.parse(rawdata);
        
        titles[vote_id].vote++;
  
        rawdata = JSON.stringify(titles);
        fs.writeFileSync(__dirname + "/public/data/" + file_vote, rawdata);

        votedDevice.push(client_id);
        console.log(client_id + " VOTED !");
        socket.emit("vote-saved");

      } else {
        
        console.log(client_id + " DEJA VOTE.........");
        //répond déja voté au client
        socket.emit("client-already-vote");

      }
    });

    /**
     * - Set data in second_vote.json with 4 most popular titles
     * - Change used file
     * - reset already vote array
     * - TODO: reset client  interface
     * - TODO: reset display inetface
     */
    socket.on('set-second-tour', function() {
      
      /*************************************************************
       * Set data in second_vote.json with 4 most popular titles
       *************************************************************/
      let rawdata = fs.readFileSync(__dirname + "/public/data/" + file_vote);
      let titles = JSON.parse(rawdata);
      let second_titles = [];
      let max = 0;
      let max_id;

      for (i = 0; i < 4; i++) {
        for(j = 0; j < titles.length; j++) {
          if(titles[j].vote > max) {
            console.log(titles[j].vote + " > " + max);
            max = titles[j].vote;
            max_id = j;
          }
        }
        console.log("GET: " + titles[max_id].title);
        second_titles.push(titles[max_id]);
        titles.splice(max_id, 1);
        max = 0;
      }

      // Change used file
      file_vote = "second_vote.json";

      rawdata = JSON.stringify(second_titles);
      fs.writeFileSync(__dirname + "/public/data/" + file_vote, rawdata);

      /*****************************
       * reset already vote array
       *****************************/
      votedDevice = [];

      console.log("============== SECOND TOUR BEGIN");
    });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});