var socket = io();
var flight_rdy = document.getElementById("flight_rdy");

flight_rdy.onclick = function () {
    socket.emit('press-flightRdy', flight_rdy.value);
};
