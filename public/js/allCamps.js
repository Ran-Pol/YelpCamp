mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-102.22677685546178, 38.9546638840946],
    zoom: 3
});

//Use the camps variable to loop over the camps
function mapping() {
    const campsMaker = [];
    for (let camp of camps) {

        campsMaker.push(
            new mapboxgl.Marker().setLngLat(camp.geometry.coordinates).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(camp.properties.popUpMarkup)).addTo(map)
        )
    }
    return campsMaker
}

const markers = mapping();
