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

    // Feature Group to store drawn shapes
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Add drawing controls
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems, // Enables editing mode
            remove: true, // Allow deletion of shapes
        },
        draw: {
            polyline: false,
            polygon: false,
            circle: false,
            marker: false,
            circlemarker: false,
            rectangle: true, // Enable square/rectangle drawing
        }
    });
    map.addControl(drawControl);

    // Variables for controlling custom sizing logic
    let customRectangle = null;

    // Event: When drawing a rectangle starts
    map.on("draw:drawstart", (e) => {
        if (e.layerType === "rectangle") {
            // Prevent drawing until user inputs size
            customRectangle = true;

            // Ask user for the desired side length (in meters)
            const sideLength = prompt("Enter the side length of the square (in meters):");
            if (sideLength && !isNaN(sideLength) && sideLength > 0) {
                const meters = parseFloat(sideLength);

                // Get the map's center as the starting coordinate
                const center = map.getCenter();
                const bounds = createSquareBounds(center, meters);

                // Immediately add a rectangle based on user-defined size
                const rectangle = L.rectangle(bounds, {
                    color: "#3388ff",
                    weight: 3,
                });
                drawnItems.addLayer(rectangle);

                console.log("Created square bounds:", bounds);
            } else {
                alert("Invalid input! Please use a positive number for the side length.");
            }

            // Reset for standard drawing (or replace behavior)
            customRectangle = false;
        }
    });


    // Event: When a rectangle is drawn
    map.on("draw:created", (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        // Enable editing & dragging
        layer.enableEdit();

        console.log("Rectangle drawn:", layer.getBounds()); // Logs coordinates
    });

    // Enable edit mode when a shape is clicked
    map.on("draw:edited", (event) => {
        event.layers.eachLayer((layer) => {
            console.log("Edited bounds:", layer.getBounds());
        });
    });
});
