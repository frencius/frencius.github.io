// create angular app
var app = angular.module('myApp', []);

// maps controller
app.controller('mapsCtrl', function ($scope) {
    // input search model
    $scope.value = null;

    // set initial position
    var myLatLng = { lat: -6.1958997, lng: 106.8161688 };

    // create initial maps
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14,
        mapTypeId: 'roadmap',
    });

    // create initial marker    
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        draggable: true,
        title: 'Drag Me',
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('input-address');
    var searchBox = new google.maps.places.SearchBox(input);

    // get marker position 
    $scope.getPosition = function (marker) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode
            ({
                latLng: marker.getPosition(),
            },
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.$apply(function () {
                        $scope.value = results[0].formatted_address;
                    });
                }
                else {
                    console.log(status);
                }
            }
            );
    }

    // marker drag event listener
    google.maps.event.addListener(marker, 'dragend', function () {
        $scope.getPosition(marker)
    });

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

        // remove old marker
        marker.setMap(null);

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // create new marker
            marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
                draggable: true,
            });

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            google.maps.event.addListener(marker, 'dragend', function () {
                $scope.getPosition(marker);
            });
        });

        map.fitBounds(bounds);
    });
});
