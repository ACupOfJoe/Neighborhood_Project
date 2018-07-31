/**
@description: This is the model that holds latitude, longitude, and name of a marker
@constructor
@param {float} latitude - this is the latitude of the marker
@param {float} longitude - this is the longitude of the marker
@param {string} name - this is the name of the marker
**/
function markerPosition(latitude, longitude, name)
{
	this.Latitude = latitude;
	this.Longitude = longitude;
	this.Name = name;
}

/**
@description: This is the view model that holds latitude, longitude, and name of a marker
@constructor
@param {float} latitude - this is the latitude of the view model
@param {float} longitude - this is the longitude of the view model
@param {string} name - this is the name of the view model
**/


function markerPositionViewModel(markerPos)
{
	this.Latitude = ko.observable(markerPos.Latitude);
	this.Longitude = ko.observable(markerPos.Longitude);
	this.Name = ko.observable(markerPos.Name);
}

//These are global variables that will be used throughout the program
var markers = [];
var map;
var infowindow/**
@Description: This is the call back function that runs all of the other functions. It starts with map initialization and
marker initializaton. Then it defines the different types of markers. Then it populates the infowindows and
adds event listeners.
**/
function execute() {
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
			infowindow = new google.maps.InfoWindow();
		};
	initMap();
	var burkeGilmanTrail = new markerPosition(47.69589, -122.278065, 'Burke-Gilman Trail');
	var discoveryPark = new markerPosition(47.657302, -122.405496, 'Discovery Park (Seattle)');
	var rattlesnakeLedge = new  markerPosition(47.445825, -121.794994, 'Rattlesnake Ridge');
	var mountSi =  new markerPosition(47.3027, -121.4424, 'Mount Si');
	var mountPilchuck = new markerPosition(48.03287, -121.47521, 'Mount Pilchuck');
	var summerlandMountRanier = new markerPosition(46.888362, -121.611019, 'Mount Ranier');
	var twinFallsWashington = new markerPosition(47.44542, -121.69638, 'Twin Falls (Washington)');

	var burkeGilmanTrailViewModel = new markerPositionViewModel(burkeGilmanTrail);
	var discoveryParkViewModel = new markerPositionViewModel(discoveryPark);
	var rattlesnakeLedgeViewModel = new markerPositionViewModel(rattlesnakeLedge);
	var mountSiViewModel = new markerPositionViewModel(mountSi);
	var mountPilchuckViewModel = new markerPositionViewModel(mountPilchuck);
	var summerlandMountRanierViewModel = new markerPositionViewModel(summerlandMountRanier);
	var twinFallsWashingtonViewModel = new markerPositionViewModel(twinFallsWashington);

	var locations = ([burkeGilmanTrailViewModel, discoveryParkViewModel,
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
	for (var i = 0; i < locations.length; i++){
		var location = locations[i]
		var marker = new google.maps.Marker({
		   	position: {lat: locations[i].Latitude(), lng: locations[i].Longitude()},
			title: locations[i].Name(),
			animation: google.maps.Animation.DROP,
			id: i,
			map: map,
			icon: defaultIcon
			});

			markers.push(marker)
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
				toggleBounce(this)
			});


	}
		// This autocomplete is for usei nthe saerch within time entry box.
	var timeAutocomplete = new google.maps.places.Autocomplete(
		document.getElementById('starting_location_string'));
	document.getElementById('starting_location_button').addEventListener('click', function() {
					searchWithinTime()
				});
};

//This set of code was taken from "Project_Code_10_DisplayingRoutesDirectionsService.html" lines 357-373
// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
	  bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

/**
@description: This function will loop through the listings and hide them all.
**/
function hideListings() {
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(null);
	}
}


/**
@description: This method toggles the  bounce for a single marker.
**/
function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }

//This part was borrowed from "ud864-maps-api/Project_Code_5_BeingStylish.html"
//lines 205-216
//https://stackoverflow.com/questions/41651251/wikipedia-api-file-not-found-error
//https://forum.freecodecamp.org/t/im-working-on-wikipedia-viewer-project-and-having-problem-with-wiki-api-solved/1058/17
//https://stackoverflow.com/questions/41428334/retrieving-extract-from-wikipedia-api

/**
@description: This function populates the infowindows with content from the wikipedia api
@param (marker) marker: This parameter is the marker whose infowindow we want to populate
@param (infowindow) infowindow: This parmaeter is the infowindow object that we are manipulating
**/
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
			var wikiUrl = ' https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+ marker.title + '&redirects&callback=?'

			var defaultIcon = makeMarkerIcon('0091ff');
			$.ajax({
					url: wikiUrl,
					dataType: 'jsonp',
					timeout: 20000,
					success: function(response) {
						pageId = Object.keys(response.query.pages)[0];
						infowindow.marker = marker;
						infowindow.setContent('<h3>' + marker.title + '</h3>' + '<div class="MarkerPopUp">' + response['query']['pages'][String(pageId)]['extract'] + '</div>');
						infowindow.open(map, marker);
					},
					error: function(parsedJSON, textStatus, errorThrown) {
						infowindow.setContent('<h3>' + parsedJSON.status + "</h3><br><h3>" + textStatus + "</h3><br><h3>" + errorThrown + "</h3>");
					}
			});

			}
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
		})
}
/**
@description: This function populates the infowindows with content from the wikipedia api
and google's distance matrix api
@param (marker) marker: This parameter is the marker whose infowindow we want to populate
@param (infowindow) infowindow: This parmaeter is the infowindow object that we are manipulating
**/
function populateInfoWindowIncludingDistanceInfo(marker, infowindow,  durationText, distanceText) {
	if (infowindow.marker != marker) {
			var wikiUrl = ' https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='+ marker.title + '&redirects&callback=?'
			$.ajax({
					url: wikiUrl,
					dataType: 'jsonp',
					timeout: 20000,
					success: function(response) {
						pageId = Object.keys(response.query.pages)[0];
						infowindow.marker = marker;
						infowindow.setContent('<h3>' + marker.title + '</h3><p>' + durationText + ' away, ' + distanceText + '</p></br>'
							 + '<div>' + response['query']['pages'][String(pageId)]['extract'] + '</div>');
						infowindow.open(map, marker);
						marker.setMap(map);
					},
					error: function(parsedJSON, textStatus, errorThrown) {
						infowindow.setContent('<h3>' + parsedJSON.status + "</h3><br><h3>" + textStatus + "</h3><br><h3>" + errorThrown + "</h3>");
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

/**
@description: This method creates a marker icon from a specific color
@parm (String): This parameter is a hexadecimal string of the color of the marker
**/
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


/**
@description: This method figures if the any of the markers in the markers list are within a specific
distance (by time) of a specified location
**/
function searchWithinTime() {
	var distanceMatrixService = new google.maps.DistanceMatrixService();
	var address = document.getElementById('starting_location_string').value
	if (address == '') {
		window.alert('Sorry! You need to enter an address');
	}
	else {
		hideListings(markers);
		var origins= [];
		for (var i = 0; i < markers.length; i++) {
			origins[i] = markers[i].position;
		}
	var destination = address;
	distanceMatrixService.getDistanceMatrix({
		origins: origins,
		destinations: [destination],
		travelMode: google.maps.TravelMode['DRIVING'],
		unitSystem: google.maps.UnitSystem.IMPERIAL

	},  function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
			  window.alert('Error was: ' + status);
			} else {
			  displayMarkersWithinTime(response);
			}
			});
	}
}

/**
@description: This method is used to hide markers based on their title from both the map and the list
@param (Object List) markers: This is the list of all the markers that are available
@param (String) title: This is the string that we want to check for if the marker's title contains
**/
function hideMarkersBasedOnTitle(markers, title) {
	console.log(markers)
	var ul = document.getElementById("ListOfPlaces")
	//This forloop clears all the existing elements
	for (var j = 0; j < markers.length; j++) {
		var li = document.getElementById(markers[j].title);
		if (document.getElementById(markers[j].title) != null) {
			li.outerHTML = '';
		}
	}
	for (var i = 0 ; i < markers.length; i++)  {
		if (markers[i].title.includes(title)) {
			markers[i].setMap(map);
			//The next 4 lines prevents duplications from happening.
			var li = document.getElementById(markers[i].title);
			if (document.getElementById(markers[i].title) != null) {
				li.outerHTML = '';
			}
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(markers[i].title));
			li.setAttribute("id", markers[i].title);
			ul.appendChild(li);

		}
		else {
			markers[i].setMap(null);

		}
	}
};

/**
@description: This method filters and displays the appropriate markers on both the list and map
**/
function filterAndDisplayMarkers() {
	var suggestion = document.getElementById('filter-by-name').value;
	//The next 6 lines populate the markers list.
	var ul = document.getElementById("ListOfPlaces");

	if (suggestion) {
		hideMarkersBasedOnTitle(markers, suggestion);
	}
	else {
		showListings(markers, map);
		for (i = 0; i < markers.length; i++) {
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(markers[i].title));
		li.setAttribute("id", markers[i].title);
		ul.appendChild(li);
	}
	}

};

/**
@description: This method is used to display all the markers that fit a certain time radius
@param (Object) response: This contains the response from the distanceMatrixService object that contains
the distance in time from an origin to a destination.
**/
function displayMarkersWithinTime(response) {
	var maxDuration = document.getElementById('time_radius').value;
	var origins = response.originAddresses;
	var destination = response.destinationAddresses;


	// Parse through the results, and get he distance and duration of each.
	// Because there might be multiple origins and destinations we have a
	// nested loop. Then, make sure at least 1 result was found.

	var atLeastOne = false;
	for (var i = 0; i < origins.length; i++) {
		var results = response.rows[i].elements;
		for (var j = 0; j < results.length; j++) {
			var element = results[j];
			if (element.status === 'OK') {
				// The distance is returned in feet, but the TEXT is in miles. If we watned to switch
				// the function to show markers within a user-enetered DISTANCE, we would need the
				// value for distance, but now we only need the text.
				var distanceText = element.distance.text;
				// Duration value is given in a second so we can make it MINUTES. We need both the value
				// and the text.
				var duration = element.duration.value / 60;
				var durationText = element.duration.text;
				if (duration <= maxDuration) {
					// the origin [i] should = the markers[i]
					console.log(markers[i].title);
					//markers[i].setMap(map);
					atLeastOne = true;
					// Create a mini infowindow to open immediately and contain the
					// distance and duration
					populateInfoWindowIncludingDistanceInfo(markers[i], infowindow, durationText, distanceText);

					};
				}

			}
		}
};