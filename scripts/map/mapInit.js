const map = L.map('map', {
    center: [45.3, -66.5], // Initial center coordinates
    zoom: 6,
    scrollWheelZoom: 'center',

})

const apiURLs = {
    OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    OpenTopoMap: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    CartoDBPositron: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    CartoDBDarkMatter: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    ESRIWorldImagery: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    Terrarium: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
}

const layers = {
    OpenStreetMap: L.tileLayer(apiURLs['OpenStreetMap'], {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }),
    OpenTopoMap: L.tileLayer(apiURLs['OpenTopoMap'], {
        attribution: '© OpenTopoMap (CC-BY-SA)',
        maxZoom: 17,
    }),
    CartoDBPositron: L.tileLayer(apiURLs['CartoDBPositron'], {
        attribution: '&copy; <a href="https://www.carto.com/">CartoDB</a>',
        subdomains: "abcd",
        minZoom: 0,
        maxZoom: 19,
    }),
    CartoDBDarkMatter: L.tileLayer(apiURLs['CartoDBDarkMatter'], {
        attribution: '&copy; <a href="https://www.carto.com/">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 20,
    }),
    ESRIWorldImagery:  L.tileLayer(apiURLs['ESRIWorldImagery'], {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
        maxZoom: 18,
    }),
    terrariumLayer: L.tileLayer(apiURLs['Terrarium'], {
        tileSize: 256,
        opacity: 0.3,
        attribution: 'Mapzen terrain tiles via AWS',
    }),
};

document.addEventListener('DOMContentLoaded', () => {

    layers['OpenStreetMap'].addTo(map);

    document.addEventListener('datasetTypeChanged', (e) => {
        const selectedDataset = e.detail.datasetType;

        map.eachLayer((layer) => map.removeLayer(layer));
        layers[selectedDataset].addTo(map);
    });
});
   
export { map, apiURLs };