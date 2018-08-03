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

var locations = []; 

var burkeGilmanTrail = new markerPosition(47.69589, -122.278065, 'Burke-Gilman Trail');
var discoveryPark = new markerPosition(47.657302, -122.405496, 'Discovery Park (Seattle)');
var rattlesnakeLedge = new  markerPosition(47.445825, -121.794994, 'Rattlesnake Ridge');
var mountSi =  new markerPosition(47.3027, -121.4424, 'Mount Si');
var mountPilchuck = new markerPosition(48.03287, -121.47521, 'Mount Pilchuck');
var summerlandMountRanier = new markerPosition(46.888362, -121.611019, 'Mount Ranier');
var twinFallsWashington = new markerPosition(47.44542, -121.69638, 'Twin Falls (Washington)');

var burkeGilmanTrailViewModel = new markerPositionViewModel(burkeGilmanTrail);
locations.push(burkeGilmanTrailViewModel);
var discoveryParkViewModel = new markerPositionViewModel(discoveryPark);
locations.push(discoveryParkViewModel);
var rattlesnakeLedgeViewModel = new markerPositionViewModel(rattlesnakeLedge);
locations.push(rattlesnakeLedgeViewModel);
var mountSiViewModel = new markerPositionViewModel(mountSi);
locations.push(mountSiViewModel);
var mountPilchuckViewModel = new markerPositionViewModel(mountPilchuck);
locations.push(mountPilchuckViewModel);
var summerlandMountRanierViewModel = new markerPositionViewModel(summerlandMountRanier);
locations.push(summerlandMountRanierViewModel);
var twinFallsWashingtonViewModel = new markerPositionViewModel(twinFallsWashington);
locations.push(twinFallsWashingtonViewModel);
