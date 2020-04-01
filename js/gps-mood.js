//@format
// Guidelines for building the program:
// - Opening app:
// - - If GPS signal: Show white canvas with recorded smileys, when loss of signal show map and radial menu, so smiley can be chosen
// - - If NO GPS signal: Ask person to get GPS signal - can't place a simley if no position is known
//
//

var data = Papa.parse("worldcities.csv", { delimiter: "," });
// var file = FileReader.readAsArrayBuffer("worldcities.csv");

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
spinner.stop();

var markerList = [];

demoList = [
  { lat: 55.68296, lng: 12.57197 }, // Nørreport
  { lat: 55.67273, lng: 12.566 }, // Hovedbanegården
  { lat: 55.67812, lng: 12.57952 },
  { lat: 55.67916, lng: 12.58483 },
  { lat: 55.68506, lng: 12.58926 },
  { lat: 55.69251, lng: 12.58725 },
  { lat: 55.69948, lng: 12.57734 },
  { lat: 55.70943, lng: 12.5772 },
  { lat: 55.70584, lng: 12.56148 },
  { lat: 55.70333, lng: 12.54801 },
  { lat: 55.70469, lng: 12.52606 },
  { lat: 55.69404, lng: 12.54825 },
  { lat: 55.68883, lng: 12.54355 },
  { lat: 55.6861, lng: 12.53344 },
  { lat: 55.68106, lng: 12.53193 },
  { lat: 55.67495, lng: 12.53286 },
  { lat: 55.66613, lng: 12.54411 },
  { lat: 55.65989, lng: 12.59123 }, // ITU
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

var colorlist = ["blue", "green", "orange", "purple", "red", "yellow"];

//make a new map
var map = L.map("map").fitWorld();
var lastKnownLocation;
var trigger = false;

//create a map tile layer and add it to the map
//there are lots of different map options at maps.stamen.com
var whiteEarthLayer = L.tileLayer("./white_earth.jpg", {
  attribution: "",
  maxZoom: 12,
  minZoom: 3,
});
whiteEarthLayer.addTo(map);

var stamenMap = L.tileLayer(
  "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
  {
    attribution: "",
    maxZoom: 14,
    minZoom: 3,
  }
);
// stamenMap.addTo(map)

//finds current location of the device
map.locate({ setView: true, maxZoom: 14, enableHighAccuracy: true });

//when the location is found, run the function "onLocationFound"
map.on("locationfound", onLocationFound);
//if there is a location error, run "onLocationError"
map.on("locationerror", onLocationError);

// Create toolbar for cheating/simulating no gps signal
var ImmediateSubAction = L.Toolbar2.Action.extend({
  initialize: function (map, myAction) {
    this.map = map;
    this.myAction = myAction;
    L.Toolbar2.Action.prototype.initialize.call(this);
  },
  addHooks: function () {
    this.myAction.disable();
  },
});
var World = ImmediateSubAction.extend({
  options: {
    toolbarIcon: {
      html: "World",
      tooltip: "See the whole world",
    },
  },
  addHooks: function () {
    this.map.setView([0, 0], 0);
    ImmediateSubAction.prototype.addHooks.call(this);
  },
});
var Eiffel = ImmediateSubAction.extend({
  options: {
    toolbarIcon: {
      html: "Eiffel Tower",
      tooltip: "Go to the Eiffel Tower",
    },
  },
  addHooks: function () {
    this.map.setView([48.85815, 2.2942], 19);
    ImmediateSubAction.prototype.addHooks.call(this);
  },
});

var Cancel = ImmediateSubAction.extend({
  options: {
    toolbarIcon: {
      html: '<i class="fa fa-times"></i>',
      tooltip: "Cancel",
    },
  },
});
var MyCustomAction = L.Toolbar2.Action.extend({
  options: {
    toolbarIcon: {
      className: "fa fa-eye",
    },
    /* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
     * by definition, contained inside another toolbar, so it
     * doesn't need the additional styling and behavior of a
     * L.Toolbar2.Control or L.Toolbar2.Popup.
     */
    subToolbar: new L.Toolbar2({
      actions: [World, Eiffel, Cancel],
    }),
  },
});

var viewWorld = L.Toolbar2.Action.extend({
  options: {
    toolbarIcon: {
      tooltip: "See the whole world",
      className: "fa fa-globe",
    },
  },
  addHooks: function () {
    map.setView([0, 0], 0);
  },
});

var myLocation = L.Toolbar2.Action.extend({
  options: {
    toolbarIcon: {
      tooltip: "Goto your location",
      className: "fa fa-map-marker",
    },
  },
  addHooks: function () {
    let lat = lastKnownLocation.lat;
    let lng = lastKnownLocation.lng;
    map.setView([lat, lng], 19);
  },
});

var loseSignal = ImmediateSubAction.extend({
  options: {
    toolbarIcon: {
      tooltip: "Simulate loss of GPS-signal",
      html: "Lose signal",
      // className: "fa fa-map-marker",
    },
  },
  addHooks: function () {
    whiteEarthLayer.remove();
    stamenMap.addTo(map);

    if (typeof marker !== "undefined") {
      marker.remove();
    }

    let lat = lastKnownLocation.lat;
    let lng = lastKnownLocation.lng;
    map.setView([lat, lng], 19);
    createRadial("emoji");
    ImmediateSubAction.prototype.addHooks.call(this);
  },
});

var gainSignal = ImmediateSubAction.extend({
  options: {
    toolbarIcon: {
      tooltip: "End simulation of loss of GPS-signal",
      html: "Gain signal",
      // className: "fa fa-map-marker",
    },
  },
  addHooks: function () {
    stamenMap.remove();
    whiteEarthLayer.addTo(map);
    let markerIcon = L.icon({
      iconUrl: "./icons/position.png",
      iconSize: [50, 50],
    });
    marker = L.marker(lastKnownLocation, { icon: markerIcon }).addTo(map); // Create a new marker with our marker icon and the xy coordinates and add it to the map.
  },
});

var signalMenu = L.Toolbar2.Action.extend({
  options: {
    toolbarIcon: {
      className: "fa fa-signal",
    },
    /* Use L.Toolbar2 for sub-toolbars. A sub-toolbar is,
     * by definition, contained inside another toolbar, so it
     * doesn't need the additional styling and behavior of a
     * L.Toolbar2.Control or L.Toolbar2.Popup.
     */
    subToolbar: new L.Toolbar2({
      actions: [loseSignal, gainSignal, Cancel],
    }),
  },
});

new L.Toolbar2.Control({
  position: "topleft",
  actions: [viewWorld, myLocation, signalMenu],
}).addTo(map);

function getFiles() {
  let response = [];
  $.get("capitals.csv").done(function (data) {
    // console.log(data.length);
    let line = "";
    for (i = 0; i < data.length; i++) {
      if (data[i] != "\n") {
        line = line + data[i];
      } else {
        latlng = line.split(",");
        lati = latlng[0];
        lngi = latlng[1];
        obj = { lat: lati, lng: lngi };
        response.push(obj);
        line = "";
      }
    }
    loadDemoMarkers(response);
  });
}

function onLocationFound(e) {
  lastKnownLocation = e.latlng;
  getFiles();
  loadDemoMarkers(demoList);
  let markerIcon = L.icon({
    iconUrl: "./icons/position.png",
    iconSize: [50, 50],
  });
  marker = L.marker(lastKnownLocation, { icon: markerIcon }).addTo(map); // Create a new marker with our marker icon and the xy coordinates and add it to the map.
  let lat = lastKnownLocation.lat;
  let lng = lastKnownLocation.lng;
  map.setView([lat, lng], 19);

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
  whiteEarthLayer.remove();
  stamenMap.addTo(map);
  createRadial("emoji");
}

// Function that creates the HTML code for the radial menu
function createRadial(radialType, faceType = null) {
  let targetDiv = document.getElementById("map");
  removeRadial();
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "super");
  newDiv.setAttribute("id", "radial");
  newDiv.setAttribute(
    "style",
    "position: absolute; display: block; width: 0px; z-index: 2000000000; margin: auto; transform: translate(-35.5,-31);"
  );
  // position: absolute;
  // width: 0px;
  // z-index: 2000000000;
  // left: 50%;
  // top: 50%;
  // transform: scale(1);
  let ul = document.createElement("ul");
  ul.setAttribute("id", "UL");
  let svg;
  if (radialType == "emoji") {
    ul.setAttribute("class", "menu");
    createEmojiList(ul);
    svg = createSVG("emoji");
  }
  if (radialType == "color") {
    ul.setAttribute("class", "cmenu");
    createColorList(ul, faceType);
    svg = createSVG("color");
  }
  newDiv.append(ul);
  newDiv.append(svg);
  targetDiv.append(newDiv);
}

function removeRadial() {
  let oldDiv = document.getElementById("radial");
  let oldUl = document.getElementById("UL");
  let oldSvg = document.getElementById("SVG");
  if (oldDiv != null) {
    oldDiv.remove();
  }
  if (oldUl != null) {
    oldUl.remove();
  }
  if (oldSvg != null) {
    oldSvg.remove();
  }
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
  if (type == "color") {
    path.setAttribute("d", "M0.5,0.5 l0.5,0 A0.5,0.5 0 0,0 0.75,.066987298 z");
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
    let emojiClick = 'emojiClicked("' + emojilist[i] + '")';
    a.setAttribute("onclick", emojiClick);
    let span = document.createElement("span");
    span.setAttribute("class", "icon");
    let img = document.createElement("img");
    let imgSrc = "./icons/" + emojilist[i] + "/" + emojilist[i] + ".png";
    img.setAttribute("src", imgSrc);
    img.setAttribute("height", "50");
    img.setAttribute("width", "50");
    span.append(img);
    a.append(span);
    li.append(a);
    ul.append(li);
  }
}

// Support function to createRadial
// - creates 8 <li> elements with the 6 chosen colors
function createColorList(ul, faceType) {
  for (let i = 0; i < colorlist.length; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", "c" + numberlist[i]);
    let a = document.createElement("a");
    a.setAttribute("href", "#");
    let colorClick = 'colorClicked("' + faceType + '", "' + colorlist[i] + '")';
    a.setAttribute("onclick", colorClick);
    let span = document.createElement("span");
    span.setAttribute("class", "icon");
    let img = document.createElement("img");
    let imgSrc = "./icons/" + faceType + "/" + colorlist[i] + ".png";
    img.setAttribute("src", imgSrc);
    img.setAttribute("height", "50");
    img.setAttribute("width", "50");
    span.append(img);
    a.append(span);
    li.append(a);
    ul.append(li);
  }
}

function emojiClicked(emoji) {
  createRadial("color", emoji);
}

function colorClicked(emoji, color) {
  emojiUrl = "./icons/" + emoji + "/" + color + ".png";
  addEmojiMarker(emojiUrl, lastKnownLocation);
  if (typeof marker !== "undefined") {
    marker.remove();
  }
  removeRadial();
}

function addEmojiMarker(emojiUrl, latlng) {
  let emojiIcon = L.icon({
    iconUrl: emojiUrl,
    iconSize: [35, 35],
  });
  emojiMarker = L.marker(latlng, { icon: emojiIcon });
  markerList.push(emojiMarker);
  let date = new Date();
  emojiMarker.addTo(map).bindPopup(date);
}

function loadDemoMarkers(mlist) {
  for (let i = 0; i < mlist.length; i++) {
    let emojiIcon = L.icon({
      iconUrl: createRandomEmojiUrl(),
      iconSize: [35, 35],
    });
    emojiMarker = L.marker(mlist[i], { icon: emojiIcon });
    markerList.push(emojiMarker);
    let date = new Date();
    emojiMarker.addTo(map).bindPopup(date);
  }
}

function createRandomEmojiUrl() {
  randEmoj = Math.floor(Math.random() * emojilist.length);
  randCol = Math.floor(Math.random() * colorlist.length);
  emojiUrl =
    "./icons/" + emojilist[randEmoj] + "/" + colorlist[randCol] + ".png";
  return emojiUrl;
}
