import { apiURLs } from "../map/mapInit.js";

let initialOutputSize = 1000; // Default square size = 1000 x 1000m

document.addEventListener("DOMContentLoaded", () => {
    const datasetSelect = document.getElementById("mapType");
    const outputSize = document.getElementById("outputSize");
    const currentZoom = document.getElementById("currentZoom");
    const selectDatasetType = document.getElementById("mapType");
    const exportButton = document.getElementById('exportData');
    
    // Set default value for currentZoom
    currentZoom.value = 6;

    /**
     * [------------------]
     * [  Event listeners ]
     * [------------------] 
    */

    datasetSelect.addEventListener("change", (e) => {
        const datasetType = e.target.value;

        const event = new CustomEvent("datasetTypeChanged", {
            detail: {
                datasetType: datasetType
            }
        });
        document.dispatchEvent(event);
    });

    // Handle Square output size change
    outputSize.addEventListener("change", (e) => {
        const size = e.target.value;
        const event = new CustomEvent("outputSizeChanged", {
            detail: {
                size: size
            }
        });
        document.dispatchEvent(event);
    });

    initialOutputSize = outputSize.value;

    currentZoom.addEventListener("change", (e) => {
        const zoom = e.target.value;
        const event = new CustomEvent("zoomChanged", {
            detail: {
                zoom: zoom
            }
        });
        document.dispatchEvent(event);
    });

    exportButton.addEventListener('click', async () => {
        console.log('Export button clicked!');

        const outputZoom = document.getElementById("outputZoom").value;
        const bounds = window.currentSquare.getBounds();
        const bbox = [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth()
        ];

        const datasetType = selectDatasetType.options[selectDatasetType.selectedIndex].value;
        const tileUrl = apiURLs[datasetType];

        const config = {
            tileUrl: tileUrl,
            bbox: bbox,
            zoom: outputZoom
        }

        await window.api.downloadTiles(config);
    });

    /**
     * [----------------------]
     * [  Map Events received ]
     * [----------------------] 
    */

    document.addEventListener("centerChanged", (e) => {
        const center = e.detail.center;
        const documentCenter = document.getElementById('latlong');
        documentCenter.value = `Lat: ${center.lat.toFixed(6)}, Long: ${center.lng.toFixed(6)}`;
    });

    document.addEventListener("zoomChanged", (e) => {
        const zoom = e.detail.zoom;
        const documentZoom = document.getElementById('currentZoom');
        documentZoom.value = zoom;
    });
})    

export function getInitialOutputSize() {
    return initialOutputSize;
}