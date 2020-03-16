//This example illustrates how you can reappropriate leaflet.js to map all kinds of other things that geographical location

//Make a new map
var map = L.map('map', {
    crs: L.CRS.Simple //This changes coordinates to a simple square mapping
}).fitWorld();

var markers = []; // Used to store the marker you place on the map
var a = 0; // Used to store the alpha value from the orientation sensor
var b = 0; // Used to store the beta value from the orientation sensor


// create a map tile layer and add it to the map
L.tileLayer('fabric-tile.jpg', { // I am importing an image to use as the background of the map
    attribution: '',
    maxZoom: 4,
    minZoom: 1
}).addTo(map);

// Create a new icon that can be used for markers
var markerIcon = L.icon({
    iconUrl: 'marker_red.png', // I've made a custom marker that I'm importing here
    iconSize: [35, 35], //Size of the icon
    iconAnchor: [17, 17], // This the point in the image that will be used as the center
});

//click on the map to add a marker
map.on('click', addMarker);

// Add an event listener for the orientation sensor. Remember to add permission code, if you are on an iOS device.
window.addEventListener("deviceorientation", handleOrientation, true);
function handleOrientation(e){
  b = e.beta;
  a = e.alpha;
}

// A coordinate set outlined the bounds of the orientation sensor values
var mapBounds = [
    [-180, -180],
    [-180, 180],
    [180, 180],
    [180, -180],
    [-180, -180],
];

// Draw a line is a blue and somewhat transparent color to outline the bounds of our map
var borders = L.polyline(mapBounds, {color: '#0000ff33'}).addTo(map);
// zoom the map to the polyline
map.fitBounds(borders.getBounds());


function addMarker(e){
    var date = new Date(); // Used if you want to get the current time

    var xy = L.latLng(a, b); // Set the last orientation sensor values as our x and y coordinates
    //var latlng = L.latLng((date.getSeconds() * 6) - 180, b); //Use this line instead to map the x axis to the current second number instead

    marker = L.marker(xy, {icon: markerIcon}).addTo(map); // Create a new marker with our marker icon and the xy coordinates and add it to the map. 
    markers.push(xy) // Save our new marker to our list of markers

    var polygon = L.polygon(markers, {color: 'white'}).addTo(map); //Draw a polygon between all our markers
}
