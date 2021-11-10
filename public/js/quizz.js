const socket = io();
var deviceID = new DeviceUUID().get();
// alert(deviceID);

socket.emit('new-user', {uid: deviceID});

$("#btnVote").on("click", function() {
    socket.emit('new-user-vote', {uid: deviceID});
});



socket.on('send-titles', function(data){
    let titles = data.titles;
    console.log(titles);
    setVoteButton(titles);
});

socket.on('client-already-vote', function(data){
    alert("VOUS AVEZ DEJA VOTE");
});


socket.on('vote-saved', function(data){
    
    alert("VOTE ENREGISTRE :) !!");
});


function setVoteButton(titles) {

    $("#voteButtonContainer").empty();
    
    for(i = 0; i < titles.length; i++) {

        $("#voteButtonContainer").append('<button id-title="'+i+'" class="vote-btn">'+titles[i].title+'</button>');
    }

    // add event listener for vote button
    $('.vote-btn').on("click", function() {
        
        let vote_id = $(this).attr("id-title");
        socket.emit('new-vote', {vote_id: vote_id, client_uid: deviceID});
    });
}