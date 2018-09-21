// const mapboxToken = "pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ";

// perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("past_7_days_earthquake.json", createMarkers);

function createMarkers(response) {

  // pull the "geometry" property off of response.data
  //var geometry = response.geometry;

  // initialize an array to hold bike markers
  var earthquakeMarkers = [];

  // loop through the geometry array
  for (var index = 0; index < response.length; index++) {
    var eqlocation = response[index].geometry.coordinates;
    var title = response[index].properties.title;
    var bubblesize = response[index].properties.mag;

    // for each eqlocation, create a marker and bind a popup with the eqlocation's name
    //console.log(bubblesize)

    var earthquakeMarker = L.circle([eqlocation[1], eqlocation[0]],
      { radius: 20000*bubblesize,
        fillColor: "orange",
        fillOpacity: .5,
        stroke: true,
        strokecolor: "write",
        weight: 0.5

    })
      .bindPopup("<h3>" + title + "<h3>");

    // add the marker to the earthquakeMarkers array
    earthquakeMarkers.push(earthquakeMarker);
  }

  // create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(earthquakeMarkers));
}


d3.json("faultline.json", createfaultline);

function createfaultline(faultdata) {

 
    // loop through the geometry array
   
      var line = faultdata[0].coordinates;
      console.log(line)
  
      // for each eqlocation, create a marker and bind a popup with the eqlocation's name
      //console.log(bubblesize)
  
      var faultline = L.polyline(line,
        { color: "red"});
    

var faultlines = L.layerGroup(faultline);

}


function createMap(earthquakegeometry) {

  // create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1Ijoic3VuNzY3NzkiLCJhIjoiY2pseWs2b2d3MGwxMDNxcnRsZWNxN2twYSJ9.k38OSZUIfbo-Adc0zCANLg"
  });

  //  satelite tile layer
var satellitemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 18,
  id: 'mapbox.satellite',
  accessToken: "pk.eyJ1Ijoic3VuNzY3NzkiLCJhIjoiY2pseWs2b2d3MGwxMDNxcnRsZWNxN2twYSJ9.k38OSZUIfbo-Adc0zCANLg"
});


// outdoors layer
var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1Ijoic3VuNzY3NzkiLCJhIjoiY2pseWs2b2d3MGwxMDNxcnRsZWNxN2twYSJ9.k38OSZUIfbo-Adc0zCANLg"
});

  // create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Grayscale": lightmap,
    "Satellitemap": satellitemap,
    "Outdoormap": outdoormap

  };

  // create an overlayMaps object to hold the earthquakegeometry layer
  var overlayMaps = {
    "Earthquake": earthquakegeometry,
    //"Fault Line": faultlines
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -120.03],
    zoom: 6,
    layers: [lightmap, earthquakegeometry]
  });


  // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
