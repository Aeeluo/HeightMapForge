import { map } from './mapInit.js';

document.addEventListener('DOMContentLoaded', () => {
    // Define the size of the square (5km in meters)
    const sizeInMeters = 5000;

    const updateSquare = () => {
        const center = map.getCenter();

        // Calculate the bounds of the square
        const bounds = L.latLngBounds(
            L.latLng(center.lat - sizeInMeters / 111320, center.lng - sizeInMeters / (111320 * Math.cos(center.lat * Math.PI / 180))),
            L.latLng(center.lat + sizeInMeters / 111320, center.lng + sizeInMeters / (111320 * Math.cos(center.lat * Math.PI / 180)))
        );


        // Remove any existing square and add a new one
        if (window.currentSquare) {
            map.removeLayer(window.currentMarker);
            map.removeLayer(window.currentSquare);
        }
        window.currentSquare = L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
        window.currentMarker = L.marker(center, { draggable: false }).addTo(map);

        console.log(`Square updated to center at: ${center.lat}, ${center.lng}`);
    };

    const setSquareOnClick = (e) => {
        const latlng = e.latlng;
        const bounds = L.latLngBounds(
            L.latLng(latlng.lat - sizeInMeters / 111320, latlng.lng - sizeInMeters / (111320 * Math.cos(latlng.lat * Math.PI / 180))),
            L.latLng(latlng.lat + sizeInMeters / 111320, latlng.lng + sizeInMeters / (111320 * Math.cos(latlng.lat * Math.PI / 180)))
        );

        // Remove any existing square and add a new one
        if (window.currentSquare) {
            map.removeLayer(window.currentMarker);
            map.removeLayer(window.currentSquare);
        }
        window.currentSquare = L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
        window.currentMarker = L.marker(latlng, { draggable: false }).addTo(map);

        map.panTo(latlng, { animate: true });

        console.log(`Square set to center at: ${latlng.lat}, ${latlng.lng}`);
    }

    // Initial square creation
    updateSquare();

    map.on('drag', updateSquare);
    map.on('click', setSquareOnClick);
 });