
mapboxgl.accessToken = 'pk.eyJ1IjoidGFydW5yZWRkeTkyIiwiYSI6ImNrYWsydnNsODAya2Iyc2xnajBjYmNtbHUifQ.VdKf2V0xgzASiFZPTInhhw';
if (!mapboxgl.supported()) {
    alert('Your browser does not support Mapbox GL');
} else {
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // 'mapbox://styles/tarunreddy92/ckak3ad5h0uvs1ip7rg1hr0ux', // 'mapbox://styles/mapbox/satellite-v9', //hosted style id
        center: [-96, 37.8], // starting position
        zoom: 3 // starting zoom
    });
}

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        setZoom: 14,
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: false,
        showAccuracyCircle: false,
        fitBoundsOptions: {
            maxZoom: 15
        }
    })
);

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
} map.addControl(draw);

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
    var data = draw.getAll();
    var answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
        var area = turf.area(data);
        // restrict to area to 2 decimal points
        var rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML =
            '<p><strong>' +
            rounded_area +
            '</strong></p><p>square meters</p>';
    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Use the draw tools to draw a polygon!');
    }
}
