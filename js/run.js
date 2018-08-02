var url = "https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyAxnOiuoL4eGMJ-HiCIRKPy3Jm-tBOSDW0&callback=execute"

$.getScript(url)
	.done(function() {
	})
	.fail(function() {
		alert("Sorry. The Script Failed to Load");
	});
