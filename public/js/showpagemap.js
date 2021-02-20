mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'showmap',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
.setLngLat(campgrounds.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${campgrounds.title}</h3><p>${campgrounds.location}</p>`)
    )
.addTo(map);