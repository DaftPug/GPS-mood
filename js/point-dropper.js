//make a new map
var map = L.map('map').fitWorld();
var position = {};
var markers = [];

// var saveData = JSON.parse(localStorage.saveData || null) || {data : []};

// create a map tile layer and add it to the map
// there are lots of different map options at maps.stamen.com
// cam change "toner" to another map type if you'd like to, for example
L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 20
}).addTo(map);

// finds current location of the device
// NOTE: this updates continuously using watch: true
map.locate({setView: true, maxZoom: 20, watch: true})

//when the location is found, run the function "onLocationFound"
map.on('locationfound', onLocationFound);
//if there is a location error, run "onLocationError"
map.on('locationerror', onLocationError);
//click on the map to add a marker
map.on('click', addMarker);


function onLocationFound(e) {
    // remove any previous markers
    if (position != undefined) {
        map.removeLayer(position);
    }
    // place a marker on the map at geolocated point:
    position = L.circleMarker(e.latlng).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

function addMarker(e){
    marker = L.marker(e.latlng).addTo(map);
    markers.push(e.latlng)
    console.log(markers);
}