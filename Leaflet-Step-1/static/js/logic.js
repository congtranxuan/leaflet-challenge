//unction createMap(earthQuake) {
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Grayscale": earthQuake
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [lightmap, earthQuake]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
 // }
 d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", response => { 
  //function createBubbles(response) {
    console.log('response', response);
    // Pull the "stations" property off of response.data
    //let stations = response.data.stations;
    //console.log('stations', stations);
    
    // Initialize an array to hold bike markers
    let earchQuake_data = [];
})
    // Loop through the stations array
    //for (var index = 0; index < stations.length; index++) {
    //  var station = stations[index];
    // stations.forEach(station => {
  
    //   // For each station, create a marker and bind a popup with the station's name
    //   var bikeMarker = L.marker([station.lat, station.lon])
    //     .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");
  
    //   // Add the marker to the bikeMarkers array
    //   bikeMarkers.push(bikeMarker);
    // });
  
    // // Create a layer group made from the bike markers array, pass it into the createMap function
    // createMap(L.layerGroup(bikeMarkers));

  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  //d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", createMarkers);
  