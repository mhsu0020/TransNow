
var statusReport = {"statusReport":{"stops":[{"stopName":"Eastern @ Owens (S)","shelter":"1","bench":"1","stopId":"863","odom":"3.665","load":0,"long":"-115.11625","lat":"36.188128"},{"stopName":"Eastern @ Searles (S)","shelter":"1","bench":"1","stopId":"882","odom":"3.929","load":0,"long":"-115.116213","lat":"36.184325"},{"stopName":"Eastern @ Washington (S)","shelter":"1","bench":"1","stopId":"904","odom":"4.201","load":0,"long":"-115.116211","lat":"36.18043"},{"stopName":"Eastern @ Kirk (S)","shelter":"1","bench":"1","stopId":"856","odom":"4.397","load":0,"long":"-115.116273","lat":"36.177609"},{"stopName":"Eastern @ Bonanza (S)","shelter":"1","bench":"1","stopId":"833","odom":"4.728","load":0,"long":"-115.11629","lat":"36.172852"},{"stopName":"Eastern @ Cedar (S)","shelter":"0","bench":"1","stopId":"835","odom":"4.951","load":0,"long":"-115.116103","lat":"36.169651"},{"stopName":"Eastern @ Stewart (S)","shelter":"1","bench":"1","stopId":"886","odom":"5.223","load":0,"long":"-115.115946","lat":"36.165751"},{"stopName":"Eastern @ Isabelle (S)","shelter":"0","bench":"1","stopId":"887","odom":"5.447","load":0,"long":"-115.116075","lat":"36.162553"},{"stopName":"Eastern @ Fremont (S)","shelter":"1","bench":"1","stopId":"846","odom":"5.623","load":0,"long":"-115.117566","lat":"36.160725"},{"stopName":"Eastern @ Charleston (S)","shelter":"1","bench":"1","stopId":"837","odom":"5.806","load":0,"long":"-115.119054","lat":"36.158343"},{"stopName":"Eastern @ Franklin (S)","shelter":"0","bench":"1","stopId":"845","odom":"6.061","load":0,"long":"-115.119004","lat":"36.154683"},{"stopName":"Eastern @ Oakey (S)","shelter":"0","bench":"0","stopId":"860","odom":"6.296","load":0,"long":"-115.118982","lat":"36.151301"},{"stopName":"Eastern @ St Louis (S)","shelter":"1","bench":"1","stopId":"885","odom":"6.543","load":0,"long":"-115.118926","lat":"36.147753"}],"currentlyStoppedAtBusStop":0,"currentStopId":"882","routeId":"1102"},"requestTime":"2016-01-03T01:04:05.746+0000","status":"success","requestType":"bus_Info"};


var WebSocketServer = require('ws').Server;

 var port = (process.env.VCAP_APP_PORT || 8888);

 wss = new WebSocketServer({port: port});
 wss.on('connection', function(ws) {
     ws.on('message', function(message) {
         console.log('received: %s', message);
         ws.send('echo: ' + message);
     });
     ws.send('connected');
 });
 for(var j = 0; j< statusReport.statusReport.stops.length; j++){
    var stopToChange = statusReport.statusReport.stops[j];
    stopToChange.lat = parseFloat(stopToChange.lat);
    stopToChange.lon = parseFloat(stopToChange.lon);
 }
setInterval(function(){
  var d = new Date();
  var currentTimeInMiliSeconds = d.getTime();
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(statusReport));
  });
  if(statusReport.statusReport.currentlyStoppedAtBusStop >= statusReport.statusReport.stops.length - 1){
    statusReport.statusReport.currentlyStoppedAtBusStop = 0;
  } else{
    statusReport.statusReport.currentlyStoppedAtBusStop += 1;
  }
  for(var j = 0; j< statusReport.statusReport.stops.length; j++){
     var stopToChange = statusReport.statusReport.stops[j];
     stopToChange.isBusThere = 0;
     stopToChange.load = Math.random() * 40;

  }
  statusReport.statusReport.stops[statusReport.statusReport.currentlyStoppedAtBusStop].isBusThere = 1;

}, 2000);
