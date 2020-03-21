//make a new map
var map = L.map('map').fitWorld();

//create a map tile layer and add it to the map
//there are lots of different map options at maps.stamen.com
L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 18
}).addTo(map);

//finds current location of the device
map.locate({setView: true, maxZoom: 18});

//when the location is found, run the function "onLocationFound"
map.on('locationfound', onLocationFound);
//if there is a location error, run "onLocationError"
map.on('locationerror', onLocationError);


function onLocationFound(e) {
	// find the range of event (e) and create a radius:
    var radius = e.accuracy / 2;
    // place a marker on the map at geolocated point:
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters of this point").openPopup();
    // draw a circle on the map to indicate error:
    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}
