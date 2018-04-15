var app = angular.module('myApp', []);

app.service('Map', function ($q) {

    this.init = function (input) {
        var myLatLng = { lat: -6.1958997, lng: 106.8161688 };

        var map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 14,
            mapTypeId: 'roadmap',
        });

        var service = new google.maps.places.PlacesService(map);
        var marker = new google.maps.Marker({
            map: map,
            position: myLatLng,
            draggable: true,
        });

        var request = {
            location: map.getCenter(),
            radius: '500',
            query: 'Google Sydney'
          };

        service.getDetails({
            placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                google.maps.event.addListener(marker, 'dragend', function () {
                    console.log(place.formatted_address);
                });
            }
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

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });

    }
});

app.controller('newPlaceCtrl', function ($scope, Map) {
    $scope.value = null;
    Map.init($scope.value);
});
