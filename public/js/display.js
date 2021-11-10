const socket = io();

socket.emit('new-display');


socket.on('send-titles', function(data){
    let titles = data.titles;
    console.log(titles);
    setInterface(titles);
});


socket.on('update-vote', function(data){
    let id_title = data.id_title;
    $( "div[id-title='"+id_title+"']").children("span")
});

function setInterface(titles) {

    $("#container").empty();

    for(i = 0; i < titles.length; i++) {

        $("#container").append('<div id-title="'+i+'" class="title">'+titles[i].title+' - vote : <span>'+titles[i].vote+'</span></div>');
    }
}