//@format
// Guidelines for building the program:
// - Opening app:
// - - If GPS signal: Show white canvas with recorded smileys, when loss of signal show map and radial menu, so smiley can be chosen
// - - If NO GPS signal: Ask person to get GPS signal - can't place a simley if no position is known
//
//

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
    "#ff7a7a",
    "#ff9447",
    "#ffd17a",
    "#ffeb7a",
    "#feed6d",
    "#f1ff5c",
    "#67f25a",
    "#3afdbf",
    "#95e9e2",
    "#7abdff",
    "#7a7aff",
    "#c67aff",
  ], // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-shrink", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: "spinner", // The CSS class to assign to the spinner
  top: "50%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  position: "absolute", // Element positioning
};

// Target for the spinner
var target = document.getElementById("map");

// Creating the new spinner
var spinner = new Spin.Spinner(opts).spin(target);

//make a new map
var map = L.map("map").fitWorld();
var lastKnownLocation;
var trigger = false;

//create a map tile layer and add it to the map
//there are lots of different map options at maps.stamen.com
var whiteEarthLayer = L.tileLayer("white_earth.jpg", {
  attribution: "",
  maxZoom: 12,
  minZoom: 3,
});
whiteEarthLayer.addTo(map);

var stamenMap = L.tileLayer(
  "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
  {
    attribution: "",
    maxZoom: 12,
    minZoom: 3,
  }
);
// stamenMap.addTo(map)

//finds current location of the device
map.locate({ setView: true, maxZoom: 5 });

//when the location is found, run the function "onLocationFound"
map.on("locationfound", onLocationFound);
//if there is a location error, run "onLocationError"
map.on("locationerror", onLocationError);

// Create a new icon that can be used for markers
var markerIcon = L.icon({
  iconUrl: "/icons/angry/angry_green.png", // I've made a custom marker that I'm importing here
  iconSize: [50, 50], //Size of the icon
});

function onLocationFound(e) {
  lastKnownLocation = e.latlng;
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
  alert(e.message);
  console.log(e.latlng);
}

//click on the map to add a marker
map.on("click", addMarker);

function addMarker(e) {
  // spinner.spin(target)
  spinner.stop();

  trigger = true;
  whiteEarthLayer.remove();
  stamenMap.addTo(map);
  var date = new Date(); // Used if you want to get the current time

  var xy = lastKnownLocation; // Set the last orientation sensor values as our x and y coordinates
  //var latlng = L.latLng((date.getSeconds() * 6) - 180, b); //Use this line instead to map the x axis to the current second number instead
  console.log(xy);
  marker = L.marker(xy, { icon: markerIcon }).addTo(map); // Create a new marker with our marker icon and the xy coordinates and add it to the map.
  // markers.push(xy) // Save our new marker to our list of markers

  // var polygon = L.polygon(markers, {color: 'white'}).addTo(map); //Draw a polygon between all our markers
}

// Rightclick to open radial menu
map.on("contextmenu", createEmojiRadial);

// Function that creates the HTML code for the radial menu
function createEmojiRadial() {
  let targetDiv = document.getElementById("map");
  let oldUl = document.getElementById("UL");
  let oldSvg = document.getElementById("SVG");
  if (oldUl != null) {
    oldUl.remove();
  }
  if (oldSvg != null) {
    oldSvg.remove();
  }
  let ul = document.createElement("ul");
  ul.setAttribute("id", "UL");
  ul.setAttribute("class", "menu");
  createEmojiList(ul);
  svg = createSVG("emoji");
  targetDiv.append(ul);
  targetDiv.append(svg);
}

function createSVG(type) {
  let svg = document.createElement("svg");
  svg.setAttribute("id", "SVG");
  svg.setAttribute("height", "0");
  svg.setAttribute("width", "0");
  let defs = document.createElement("defs");
  let clipPath = document.createElement("clipPath");
  clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
  clipPath.setAttribute("id", "sector");
  let path = document.createElement("path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#111");
  path.setAttribute("stroke-width", "1");
  path.setAttribute("class", "sector");
  if (type == "emoji") {
    path.setAttribute(
      "d",
      "M0.5,0.5 l0.5,0 A0.5,0.5 0 0,0 0.853553390593274,0.146446609406726 z"
    );
  }
  // implement else if for colors
  clipPath.append(path);
  defs.append(clipPath);
  svg.append(defs);
  return svg;
}

// Support function to createRadial
// - creates 8 <li> elements with the 8 emojis
function createEmojiList(ul) {
  for (let i = 0; i < emojilist.length; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", numberlist[i]);
    let a = document.createElement("a");
    a.setAttribute("href", "#");
    let span = document.createElement("span");
    span.setAttribute("class", "icon");
    let img = document.createElement("img");
    let imgSrc = "/icons/" + emojilist[i] + "/" + emojilist[i] + ".png";
    img.setAttribute("src", imgSrc);
    span.append(img);
    a.append(span);
    li.append(a);
    ul.append(li);
  }
}

var numberlist = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];

var emojilist = [
  "angry",
  "confused",
  "crying",
  "delighted",
  "embarrassed",
  "happy",
  "love",
  "sad",
];

// Support function to createRadial
// - creates 8 <li> elements with the 6 chosen colors
function createColorList() {}

var colorlist = ["blue", "green", "orange", "purple", "red", "yellow"];
