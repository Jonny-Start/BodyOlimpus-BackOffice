let map, marker, geocoder;
let addressSearchInput;

function openPopupMap() {
    document.getElementById('popupMap').style.display = 'block';
    // Aseguramos que el mapa se redimensione correctamente al abrir el popup
    if (map) {
        google.maps.event.trigger(map, 'resize');
    }
}

function closePopupMap() {
    document.getElementById('popupMap').style.display = 'none';
}

window.initMap = function () {
    const mapDiv = document.getElementById("map");
    geocoder = new google.maps.Geocoder();
    addressSearchInput = document.getElementById('addressSearch');

    // Si ya hay coordenadas almacenadas, las usamos
    const storedLat = document.getElementById("latitude").value;
    const storedLng = document.getElementById("longitude").value;

    if (storedLat && storedLng && !isNaN(parseFloat(storedLat)) && !isNaN(parseFloat(storedLng))) {
        initializeWithCoordinates({
            lat: parseFloat(storedLat),
            lng: parseFloat(storedLng)
        });
    } else {
        // Intentamos obtener la ubicación actual del usuario
        navigator.geolocation.getCurrentPosition(
            pos => {
                const location = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                initializeWithCoordinates(location);
            },
            err => {
                console.warn("Unable to get current location: " + err.message);
                // Ubicación por defecto si no podemos obtener la ubicación actual
                const defaultLocation = {
                    lat: 4.570868,
                    lng: -74.297333
                };
                initializeWithCoordinates(defaultLocation);
            }
        );
    }
};

function initializeWithCoordinates(location) {
    const mapDiv = document.getElementById("map");

    // Inicializamos el mapa
    map = new google.maps.Map(mapDiv, {
        center: location,
        zoom: 15,
        styles: [{
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{
                visibility: 'off'
            }]
        }]
    });

    // Inicializamos el marcador (usando AdvancedMarkerElement si está disponible)
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        // Usar AdvancedMarkerElement si está disponible
        const pinElement = document.createElement('div');
        pinElement.innerHTML = '<img src="/public/img/pinMaps.png" style="width: 40px; height: 50px;">';

        marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: location,
            content: pinElement,
            gmpDraggable: true
        });

        // Evento para cuando se arrastra el marcador
        marker.addListener('dragend', function (event) {
            updateLocationData(marker.position);
        });
    } else {
        // Fallback a Marker tradicional
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            icon: {
                url: "/public/img/pinMaps.png",
                scaledSize: new google.maps.Size(40, 50),
            }
        });

        // Evento para cuando se arrastra el marcador
        marker.addListener('dragend', function () {
            const position = marker.getPosition();
            updateLocationData(position);
        });
    }

    // Si hay una dirección almacenada, actualizamos el campo de búsqueda
    if (document.getElementById("address").value) {
        document.getElementById("addressSearch").value = document.getElementById("address").value;
    }

    // Configuramos el autocompletado para el campo de búsqueda
    setupAutocomplete();

    // Evento para hacer clic en el mapa y mover el marcador
    map.addListener('click', function (event) {
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            marker.position = event.latLng;
        } else {
            marker.setPosition(event.latLng);
        }
        updateLocationData(event.latLng);
    });
}

function setupAutocomplete() {
    // Utilizamos el Autocomplete tradicional que sabemos que funciona
    const autocomplete = new google.maps.places.Autocomplete(addressSearchInput, {
        types: ['address']
    });

    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            alert("No details found for: " + place.name);
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            marker.position = place.geometry.location;
        } else {
            marker.setPosition(place.geometry.location);
        }

        updateLocationData(place.geometry.location, place.formatted_address);
    });
}

function updateLocationData(location, formattedAddress = null) {
    // Extraer lat/lng dependiendo de si estamos usando AdvancedMarkerElement o Marker
    let lat, lng;

    if (location instanceof google.maps.LatLng) {
        lat = location.lat();
        lng = location.lng();
    } else if (typeof location === 'object' && location !== null) {
        // Para AdvancedMarkerElement la posición puede ser un objeto simple
        lat = location.lat;
        lng = location.lng;
    } else {
        console.error("Invalid location format", location);
        return;
    }

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    if (formattedAddress) {
        document.getElementById("address").value = formattedAddress;
    } else {
        // Si no tenemos una dirección formateada, hacemos geocodificación inversa
        geocoder.geocode({
            location: {
                lat: lat,
                lng: lng
            }
        }, (results, status) => {
            if (status === "OK" && results[0]) {
                document.getElementById("address").value = results[0].formatted_address;
            } else {
                console.error("Error getting address:", status);
                document.getElementById("address").value = lat + ", " + lng;
            }
        });
    }
}

function confirmLocation() {
    if (!marker) {
        alert("Please select a location on the map");
        return;
    }

    // Obtener posición según el tipo de marcador
    let position;
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        position = marker.position;
    } else {
        position = marker.getPosition();
    }

    updateLocationData(position);
    closePopupMap();
}

// Función para buscar una dirección manualmente (opcional)
function searchAddress() {
    const address = document.getElementById('addressSearch').value;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(15);

            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                marker.position = location;
            } else {
                marker.setPosition(location);
            }

            updateLocationData(location, results[0].formatted_address);
        } else {
            alert('No se encontró la dirección debido a: ' + status);
        }
    });
}