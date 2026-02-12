//Leaflet Map

const map = L.map('map').setView([latitude, longitude], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: null
}).addTo(map);

const marker = L.marker([latitude, longitude],).addTo(map);
marker.bindPopup("Exact Location Will Be Given After Booking").openPopup();

const auraCircle = L.circle([latitude, longitude], {
    color: '#4756dec2',
    fillColor: '#4756dec2',
    fillOpacity: 0.2,
    radius: 10000
}).addTo(map);