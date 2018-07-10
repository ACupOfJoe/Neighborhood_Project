function markerPosition(latitude, longitude, name) 
{ 
	this.Latitude = latitude; 
	this.Longitude = longitude;
	this.Name = name;
}


function markerPositionViewModel(markerPos) 
{ 
	this.Latitude = ko.observable(markerPos.Latitude);
	this.Longitude = ko.observable(markerPos.Longitude);
	this.Name = ko.observable(markerPos.Name);
}



function execute() { 

	var map;
		function initMap() {
			map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 47.6062, lng: -122.3321},
			zoom: 8
			});
			var center;
			function calculateCenter() {
				center = map.getCenter();
			}
			google.maps.event.addDomListener(map, 'idle', function() {
				calculateCenter();
			});
			google.maps.event.addDomListener(window, 'resize', function() {
				map.setCenter(center);
			});
		}

	initMap();


	var sewardPark =  new markerPosition(47.550260, -122.264850, "Seward Park, WA");
	var burkeGilmanTrail = new markerPosition(47.69589, -122.278065, "Burke-Gilman Trail, WA");
	var discoveryPark = new markerPosition(47.657302, -122.405496, "Discovery Park, WA");
	var rattlesnakeLedge = new  markerPosition(47.445825, -121.794994, "Rattlesnake Ledge, WA");
	var littleSiAndMountSi = new markerPosition(47.498714, -121.755943, "Little Si and Mount Si, WA");
	var mountPilchuck = new markerPosition(48.057881, -121.796792, "Mt. Pilchuk, WA");
	var summerlandMountRanier = new markerPosition(46.888362, -121.611019, "Summerland, Mt.Ranier, WA");

	var sewardParkViewModel = new markerPositionViewModel(sewardPark);
	var burkeGilmanTrailViewModel = new markerPositionViewModel(burkeGilmanTrail);
	var discoveryParkViewModel = new markerPositionViewModel(discoveryPark);
	var rattlesnakeLedgeViewModel = new markerPositionViewModel(rattlesnakeLedge);
	var littleSiAndMountSiViewModel = new markerPositionViewModel(littleSiAndMountSi);
	var mountPilchuckViewModel = new markerPositionViewModel(mountPilchuck);
	var summerlandMountRanierViewModel = new markerPositionViewModel(summerlandMountRanier);
	
	var locations = ko.observableArray([sewardParkViewModel, burkeGilmanTrailViewModel, discoveryParkViewModel,
						rattlesnakeLedgeViewModel, littleSiAndMountSiViewModel,
						mountPilchuckViewModel, summerlandMountRanierViewModel]);
	var largeInfowindow = new google.maps.InfoWindow();


	//These parts were borrowed from "ud864-maps-api/Project_Code_5_BeingStylish.html" 
	//lines 161- 166
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
	var markers = ko.computed(function() {
		var markers = ko.observableArray();
		for (var i = 0; i < locations().length; i++){
		var location = locations()[i]
		console.log(locations()[i].Name())
		var marker = new google.maps.Marker({
           position: {lat: locations()[i].Latitude(), lng: locations()[i].Longitude()},
        	title: locations()[i].Name(),
            animation: google.maps.Animation.DROP,
            id: i,
            map: map,
            icon: defaultIcon
            });

		markers.push(marker)
		marker.addListener('click', function() { 
			populateInfoWindow(this, largeInfowindow);
		});

		//This part was borrowed from "ud864-maps-api/Project_Code_5_BeingStylish.html" 
		//lines 190 - 195
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon)
		})

        marker.addListener('mouseout', function() {
        	this.setIcon(defaultIcon);
        });
	}
	return markers;
	});
}

//This part was borrowed from "ud864-maps-api/Project_Code_5_BeingStylish.html" 
//lines 205-216
//https://stackoverflow.com/questions/41651251/wikipedia-api-file-not-found-error
function populateInfoWindow(marker, infowindow) { 
		if (infowindow.marker != marker) { 
				$.ajax({
				url: 'https://en.wikipedia.org/w/api.php',
				data: {
				action: 'query',
				list: 'search',
				srsearch: marker.title,
				format: 'json',
				prop: 'extract',
				},
				dataType: 'jsonp',
				success: function (x) {
				console.log('title', x.query.search[0]);
				infowindow.marker = marker;
				infowindow.setContent('<div>' + x.query.search[0].snippet + '</div>');
				infowindow.open(map, marker);
				}
			});
			
			infowindow.addListener('closeclick', function() { 
				infowindow.marker = null; 
			}) 
		}
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
  	'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
  	'|40|_|%E2%80%A2',
  	new google.maps.Size(21, 34),
  	new google.maps.Point(0, 0),
  	new google.maps.Point(10, 34),
  	new google.maps.Size(21,34));
	return markerImage;
}



