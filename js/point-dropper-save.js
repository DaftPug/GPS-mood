//make a new map
var map = L.map('map').fitWorld();
var position = {};
var markers = [];

// retreive data from localStorage
var saveData = JSON.parse(localStorage.saveData || null) || {data : []};

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

// get saved markers and add them to map
var count = saveData.data.length;
console.log(count);
for (i=0; i<count; i++){
    innercount = saveData.data[i].markers.length;
    console.log(innercount);
    for (j=0; j<innercount;j++){
        L.marker(saveData.data[i].markers[j]).addTo(map)
    }
}

//when the location is found, run the function "onLocationFound"
map.on('locationfound', onLocationFound);
//if there is a location error, run "onLocationError"
map.on('locationerror', onLocationError);
//click on the map to add a marker
map.on('click', addMarker);

// save and clear the data when clicked:
document.getElementById("save").addEventListener("click", saveOurData);
document.getElementById("clear").addEventListener("click", clearOurData);

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

// Store your data.
function saveOurData() {
    // Create a temporary object
    var tempObject = {};
    // Add our marker values to the object
    tempObject.markers = markers;
    // Add the time to our object in a readable format
    var date = new Date();
    tempObject.time = date.toDateString() + " · " + date.toTimeString();
    // Add the object to our data array
    saveData.data.push(tempObject);
    console.log(saveData);
    // Save it to the localStorage
    localStorage.saveData = JSON.stringify(saveData);
    console.log("Data from "+tempObject.time+" saved!");
}

// Clear your data
function clearOurData() {
    saveData.data = [];
    localStorage.saveData = JSON.stringify(saveData);
    //reload page... delete if you don't want to refresh
    location.reload();

}
