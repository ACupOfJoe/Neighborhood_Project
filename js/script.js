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


	var burkeGilmanTrail = new markerPosition(47.69589, -122.278065, "Burke-Gilman Trail");
	var discoveryPark = new markerPosition(47.657302, -122.405496, "Discovery Park");
	var rattlesnakeLedge = new  markerPosition(47.445825, -121.794994, "Rattlesnake Ridge");
	var mountSi =  new markerPosition(47.3027, -121.4424, "Mount Si");
	var mountPilchuck = new markerPosition(48.03287, -121.47521, "Mount Pilchuck");
	var summerlandMountRanier = new markerPosition(46.888362, -121.611019, "Mount Ranier");
	var twinFallsWashington = new markerPosition(47.44542, -121.69638, "Twin Falls (Washington)");

	var burkeGilmanTrailViewModel = new markerPositionViewModel(burkeGilmanTrail);
	var discoveryParkViewModel = new markerPositionViewModel(discoveryPark);
	var rattlesnakeLedgeViewModel = new markerPositionViewModel(rattlesnakeLedge);
	var mountSiViewModel = new markerPositionViewModel(mountSi);
	var mountPilchuckViewModel = new markerPositionViewModel(mountPilchuck);
	var summerlandMountRanierViewModel = new markerPositionViewModel(summerlandMountRanier);
	var twinFallsWashingtonViewModel = new markerPositionViewModel(twinFallsWashington);
	
	var locations = ko.observableArray([burkeGilmanTrailViewModel, discoveryParkViewModel,
						rattlesnakeLedgeViewModel, mountSiViewModel,
						mountPilchuckViewModel, summerlandMountRanierViewModel, twinFallsWashingtonViewModel]);
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
//https://forum.freecodecamp.org/t/im-working-on-wikipedia-viewer-project-and-having-problem-with-wiki-api-solved/1058/17
//https://stackoverflow.com/questions/41428334/retrieving-extract-from-wikipedia-api
function populateInfoWindow(marker, infowindow) { 
	if (infowindow.marker != marker) {
 			var wikiUrl = ' https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+ marker.title + '&redirects&callback=?'

		    var wikiRequestTimeout = setTimeout(function() { 
		        $wikiElem.text("failed to get wikipedia resources");
		    }, 8000000);
			
		    $.ajax({
			        url: wikiUrl,
			        dataType: "jsonp",
			        // jsonp: "callback",
			        success: function(response) { 
			        	pageId = Object.keys(response.query.pages)[0];
			        	console.log(marker.title)
			       		console.log(pageId);
			            console.log(response['query']['pages'][String(pageId)]['extract']);
			       		infowindow.marker = marker;
						infowindow.setContent('<div>' + response['query']['pages'][String(pageId)]['extract'] + '</div>');
						infowindow.open(map, marker);

			            }
			}); 	
			
			}
			infowindow.addListener('closeclick', function() { 
				infowindow.marker = null; 
		}) 
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



