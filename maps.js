var app = angular.module('myApp', []);

app.service('Map', function ($q) {

    this.init = function (input) {

    }
});

app.controller('newPlaceCtrl', function ($scope, Map) {

    $scope.value = null;
    //Map.init($scope.value);

    var myLatLng = { lat: -6.1958997, lng: 106.8161688 };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14,
        mapTypeId: 'roadmap',
    });

    var markers = new google.maps.Marker({
        map: map,
        position: myLatLng,
        draggable: true,
        title: 'Drag Me',
    });

    google.maps.event.addListener(markers, 'dragend', function () {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode
            ({
                latLng: markers.getPosition(),
            },
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    value = results[0].formatted_address;
                    console.log(results[0].formatted_address);
                }
                else {
                    console.log(status);
                }
            }
            );
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('input-address');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
        // if ($(map.getDiv()).children().eq(0).height() == window.innerHeight &&
        //     $(map.getDiv()).children().eq(0).width() == window.innerWidth) {
        //     console.log('FULL SCREEN');
        // }
        // else {
        //     console.log('NOT FULL SCREEN');
        // }
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.setMap(null);

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            // Create a marker
            markers = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
                draggable: true,
            });

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
});
