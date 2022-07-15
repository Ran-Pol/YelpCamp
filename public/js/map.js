
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: mapCoordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker()
    .setLngLat(mapCoordinates)
    .addTo(map);


console.log(mapCoordinates);