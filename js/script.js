var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
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


function position(latitude, longitude) { 
	this.latitude = ko.observable(latitude); 
	this.longitude = ko.observable(longitude);
	this.latLng = ko.observableArray([latitude, longitude])
}
