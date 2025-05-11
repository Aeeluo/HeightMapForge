let initialOutputSize = 1000; // Default square size = 1000 x 1000m

document.addEventListener("DOMContentLoaded", () => {
    const datasetSelect = document.getElementById("mapType");
    const outputSize = document.getElementById("outputSize");
    const currentZoom = document.getElementById("currentZoom");

    datasetSelect.addEventListener("change", (e) => {
        const datasetType = e.target.value;

        const event = new CustomEvent("datasetTypeChanged", {
            detail: {
                datasetType: datasetType
            }
        });
        document.dispatchEvent(event);
    });

    // Set default value for currentZoom
    currentZoom.value = 6;

    /**
     * [------------------]
     * [  Event listeners ]
     * [------------------] 
    */

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