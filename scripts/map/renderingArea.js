import { map } from './mapInit.js';
import { getInitialOutputSize } from '../sidebar.js';

let outputSize = getInitialOutputSize(); // Default size in meters

document.addEventListener('DOMContentLoaded', () => {
    const updateSquareAndMarker = () => {
        const center = map.getCenter();
        const bounds = L.latLngBounds(
            L.latLng(center.lat - outputSize / 111320, center.lng - outputSize / (111320 * Math.cos(center.lat * Math.PI / 180))),
            L.latLng(center.lat + outputSize / 111320, center.lng + outputSize / (111320 * Math.cos(center.lat * Math.PI / 180)))
        );


        // Remove any existing square and add a new one
        if (window.currentSquare) {
            map.removeLayer(window.currentMarker);
            map.removeLayer(window.currentSquare);
        }
        window.currentSquare = L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
        window.currentMarker = L.marker(center, { draggable: false }).addTo(map);

        const event = new CustomEvent('centerChanged', {
            detail: {
                center: {
                    lat: center.lat,
                    lng: center.lng
                }
            }
        });
        document.dispatchEvent(event);
    };

    const setSquareOnClick = (e) => {
        const latlng = e.latlng;
        const bounds = L.latLngBounds(
            L.latLng(latlng.lat - outputSize / 111320, latlng.lng - outputSize / (111320 * Math.cos(latlng.lat * Math.PI / 180))),
            L.latLng(latlng.lat + outputSize / 111320, latlng.lng + outputSize / (111320 * Math.cos(latlng.lat * Math.PI / 180)))
        );

        // Remove any existing square and add a new one
        if (window.currentSquare) {
            map.removeLayer(window.currentMarker);
            map.removeLayer(window.currentSquare);
        }
        window.currentSquare = L.rectangle(bounds, { color: "#ff7800", weight: 1 }).addTo(map);
        window.currentMarker = L.marker(latlng, { draggable: false }).addTo(map);

        map.panTo(latlng, { animate: true });
    }

    document.addEventListener('outputSizeChanged', (e) => {
        const size = e.detail.size;
        if (size) {
         outputSize = size;
            updateSquareAndMarker();
        }
    });


    document.addEventListener('zoomChanged', (e) => {
        const zoom = e.detail.zoom;
        if (zoom) {
            map.setZoom(zoom);
        }
    });

    

    // Initial square creation
    updateSquareAndMarker();

    map.on('drag', updateSquareAndMarker);
    map.on('click', setSquareOnClick);
    map.on('zoomend', () => {
        const zoom = map.getZoom();
        const event = new CustomEvent('zoomChanged', {
            detail: {
                zoom: zoom
            }
        });
        document.dispatchEvent(event);
    });
 });