
var mymap = L.map("map", {
  center: [38.88, -103.60],
  zoom: 5
});

//Create a function to match a color with magnitude of earthquake
function getColor(d) {
  return d>= 5?   "#51802F":
          d>=4?   "#7C9F3C":
          d>=3.5? "#AEBF4A":
          d>=3?   "#DFDC59":
          d>=2.5? "#FFD968":
          d>=2?   "#FEC378":
          d>=1.5? "#FEB487":
          d>=0.1? "#FDAA96":
          d>=0.5? "#FDA6A6":
          "#FDB5C2";
}

//Create a function to adjust the magnitude to show on the map.
function createMagnitude(magnitude) {
  return magnitude * 25000;
}

//Create a function to show the legend on the map.
function legend() {
var legends = L.control({
  //The location of legend is set at bottom right.
  position: "bottomright"
});

  // Define the properties of legend
    legends.onAdd = function () {
    var labels = ["Magnitude Color Legend"]; 
    var div = L.DomUtil.create('div', 'legend');
    cat = ['< 0.5','<1','<1.5','<2','<2.5',"<3","<3.5","<4","<5",">=5"];
    color = ["#51802F", "#7C9F3C", "#AEBF4A", "#DFDC59","#FFD968" ,"#FEC378", "#FEB487", "#FDAA96", "#FDA6A6", "#FDB5C2"];

    for (var i = 0; i < cat.length; i++) {

            div.innerHTML = 
            labels.push('<div class="square" style="background:' + color[i] + '"></div><span class="explanation">' + cat[color.length-i-1] +'</span>' );
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };

    legends.addTo(mymap);
  }


function createMap(earthQuakeLayer,tectonicPlatesLayer) {
  

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 13,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(mymap);

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var mbAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  var mbUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  var satelitemap = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});
   
    // Create a baseMaps object to hold the Grayscale layer
    var baseMaps = {
    "Grayscale": lightmap,
    "Satelite": satelitemap,
    "Outdoors": streetmap
     };
  
    // Create an overlayMaps object to hold the Earthquakes layer
    var overlayMaps = {
    "Earthquakes": earthQuakeLayer,
    "Fault Lines": tectonicPlatesLayer
     };
  
    // Create the map object with options
    
    //earthQuakeLayer.addTo(mymap);
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);
 }

 function createtectonicplates(response1) {
  let tectonicplates= response1.features;
  let tectoniclines = [];
   
    // Loop through the lines array
    for (var i = 0; i < tectonicplates.length; i++) {
      var points = tectonicplates[i].geometry.coordinates;
      var title = tectonicplates[i].properties.Name;
      var latlong = [];
      //Change the order of lat and long.
      points.forEach(d=>{latlong.push([d[1],d[0]])});
    
      // Create the polyline using latlogs
    var polyline = L.polyline(latlong, {color: '#FF6F23'}).bindPopup(title);
    tectoniclines.push(polyline);
    }
    
    return L.layerGroup(tectoniclines);
  }

 
  function createBubblesLayer(response) {
    // Pull the earthquake locations and features
    
    let earthQuakesData= response.features;
    let earthQuakePoints = [];
   
    // Loop through the earthQuakes array
    for (var i = 0; i < earthQuakesData.length; i++) {
      var point = earthQuakesData[i].geometry.coordinates;
      var magnitude = earthQuakesData[i].properties.mag;
      var title = earthQuakesData[i].properties.title;
    // For each station, create a marker and bind a popup with the station's name
    var earthQuakesBubble = L.circle([point[1],point[0]], {
      color: "#AF9C60",
      fillColor: getColor(magnitude),
      fillOpacity: 0.9,
      radius: createMagnitude(magnitude)
    }).bindPopup(title);

    earthQuakePoints.push(earthQuakesBubble);
    }
    return L.layerGroup(earthQuakePoints).addTo(mymap);
  }
   
  // Perform an API call to the USGS API to get earthquake information.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",function(response){ 
  // Perform an API call to get the tectonic plates information.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",function(response1){ 
  
  var layer = createBubblesLayer(response);
  var layer1 = createtectonicplates(response1);

  createMap(layer,layer1);
  legend();
  });
});   