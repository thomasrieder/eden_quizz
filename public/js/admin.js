const socket = io();

$("#btnSecondTour").on("click", function() {
    socket.emit('set-second-tour');
});