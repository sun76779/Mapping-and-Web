// const mapboxToken = "pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ";

// read earthquake file from Json file. Call createMarkers when complete
d3.json("past_7_days_earthquake.json", createMarkers);

function createMarkers(response) {

  // pull the "geometry" property off of response.data
  //var geometry = response.geometry;

  // initialize an array to hold earthquake markers
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
        fillColor: color_palettes(bubblesize),
        fillOpacity: .6,
        stroke: true,
        weight: 0.5

    })
      .bindPopup("<h3>" + title + "<h3>");


      function color_palettes(bubblesize) {
        if (bubblesize > 5) {
          return "black";
      } else if (bubblesize > 4){
        return "#360000";
      } else if (bubblesize > 3){
        return "'#6d0202";
      } else if (bubblesize > 2){
        return "#a31818";
      } else if (bubblesize > 1){
        return "#ee7272";
      } else {
        return "#ffb9b9";
    }
  }

    // add the marker to the earthquakeMarkers array
    earthquakeMarkers.push(earthquakeMarker);
  }





  // create a layer group made from the earthquake array, pass it into the createMap function
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
    

 L.layerGroup(faultline);

}


function createMap(earthquakegeometry, createfaultline) {

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
    "Legend":legend,
    "Fault Line": createfaultline,
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -120.03],
    zoom: 6,
    layers: [lightmap, earthquakegeometry, createfaultline]
  });


  // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

    // add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
  
      div.innerHTML += '<p><u>Magnitude</u></p>'
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + color_palettes(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
  