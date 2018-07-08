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

	var map;
	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.6162, lng: -122.3321},
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


	var markers = ko.computed(function() {
		var markers = ko.observableArray();
		for (var i = 0; i < locations().length; i++){
		var location = locations()[i]
		console.log(locations()[i].Name())
		var marker = new google.maps.Marker({
           position: {lat: locations()[i].Latitude(), lng: locations()[i].Longitude()},
        	title: locations()[i].name,
            animation: google.maps.Animation.DROP,
            id: i,
            map: map
            });

		    markers.push(marker)
	}
	return markers;
	});

	
}

