// Options for the spinner
var opts = {
  lines: 20, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  // color: '#ffffff', // CSS color or array of colors
  color: [
    '#ff7a7a',
    '#ff9447',
    '#ffd17a',
    '#ffeb7a',
    '#feed6d',
    '#f1ff5c',
    '#67f25a',
    '#3afdbf',
    '#95e9e2',
    '#7abdff',
    '#7a7aff',
    '#c67aff',
  ], // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute', // Element positioning
}

// Target for the spinner
var target = document.getElementById('map')

// Creating the new spinner
var spinner = new Spin.Spinner(opts).spin(target)
spinner.stop()

//make a new map
var map = L.map('map').fitWorld()
var lastKnownLocation
var trigger = false

//create a map tile layer and add it to the map
//there are lots of different map options at maps.stamen.com
var whiteEarthLayer = L.tileLayer('white_earth.jpg', {
  attribution: '',
  maxZoom: 5,
  minZoom: 1,
})
// whiteEarthLayer.addTo(map);

var stamenMap = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
  attribution: '',
  maxZoom: 12,
  minZoom: 3,
})
stamenMap.addTo(map)

var gifUrl = '/icons/loading.gif',
  gifBounds = [
    [85, -180],
    [-85, 180],
  ],
  gifOverlay = L.imageOverlay(gifUrl, gifBounds)

var loadingGifLayer = L.tileLayer('/icons/loading.gif', {
  attribution: '',
  maxZoom: 5,
  minZoom: 1,
})

//finds current location of the device
map.locate({ setView: true, maxZoom: 5 })

//when the location is found, run the function "onLocationFound"
map.on('locationfound', onLocationFound)
//if there is a location error, run "onLocationError"
map.on('locationerror', onLocationError)

// Create a new icon that can be used for markers
var markerIcon = L.icon({
  iconUrl: '/icons/angry/angry_green.png', // I've made a custom marker that I'm importing here
  iconSize: [50, 50], //Size of the icon
})

//click on the map to add a marker
map.on('click', addMarker)

function onLocationFound(e) {
  lastKnownLocation = e.latlng
  // gifOverlay.addTo(map)

  // var radius = e.accuracy / 2
  // // place a marker on the map at geolocated point:
  // L.marker(e.latlng)
  //   .addTo(map)
  //   .bindPopup('You are within ' + radius + ' meters of this point')
  //   .openPopup()
  // // draw a circle on the map to indicate error:
  // L.circle(e.latlng, radius).addTo(map)
}

function onLocationError(e) {
  alert(e.message)
  console.log(e.latlng)
}

function addMarker(e) {
  spinner.spin(target)
  trigger = true
  gifOverlay.remove()
  var date = new Date() // Used if you want to get the current time

  var xy = lastKnownLocation // Set the last orientation sensor values as our x and y coordinates
  //var latlng = L.latLng((date.getSeconds() * 6) - 180, b); //Use this line instead to map the x axis to the current second number instead
  console.log(xy)
  marker = L.marker(xy, { icon: markerIcon }).addTo(map) // Create a new marker with our marker icon and the xy coordinates and add it to the map.
  // markers.push(xy) // Save our new marker to our list of markers

  // var polygon = L.polygon(markers, {color: 'white'}).addTo(map); //Draw a polygon between all our markers
}
