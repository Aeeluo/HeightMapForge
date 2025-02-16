document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([48.8566, 2.3522], 13); // Paris coords

    // OpenStreetMap (Free & Open-Source)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    // Alternative: OpenTopoMap (Terrain style)
    // L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    //     attribution: "© OpenTopoMap (CC-BY-SA)",
    //     maxZoom: 17,
    // }).addTo(map);

    // Alternative: Carto (Positron - Light Themed)
    // L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    //     attribution: "&copy; CartoDB contributors",
    //     maxZoom: 20,
    // }).addTo(map);
});
