document.addEventListener("DOMContentLoaded", () => {
    const datasetSelect = document.getElementById("mapType");

    datasetSelect.addEventListener("change", (e) => {
        const datasetType = e.target.value;

        const event = new CustomEvent("datasetTypeChanged", {
            detail: {
                datasetType: datasetType
            }
        });
        document.dispatchEvent(event);
    });
})