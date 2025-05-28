const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const tileSize = 256;
const numberOfChunks = 3; 

/**
 * [------------------]
 * [    Functions     ]
 * [------------------] 
 */ 
async function downloadTiles(tileUrl, bbox, zoom) {
    const [minLon, minLat, maxLon, maxLat] = bbox;

    console.log(`Bounding box: ${minLon}, ${minLat}, ${maxLon}, ${maxLat}`);
    console.log(`Zoom level: ${zoom}`);
    console.log(`Tile URL: ${tileUrl}`);

    // Convert bounds to tile indices
    const minX = lon2tileX(minLon, zoom);
    const maxX = lon2tileX(maxLon, zoom);
    const minY = lat2tileY(maxLat, zoom); // note: Y is inverted
    const maxY = lat2tileY(minLat, zoom);

    console.log(`Tile indices: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);

    const cols = maxX - minX + 1;
    const rows = maxY - minY + 1;

    console.log(`Tile indices: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
    console.log(`Number of tiles: cols=${cols}, rows=${rows}`);
    
    const totalTiles = cols * rows;
    console.log(`Total tiles to download: ${totalTiles}`);

    const width = tileSize * cols;
    const height = tileSize * rows;

    const totalPixels = width * height;
    const MAX_SAFE_PIXELS = 268402689;
    
    console.log(`Total pixels: ${totalPixels}`);

    const sharpInstance = sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        },
        unlimited: true,
        limitInputPixels: false,
    });

    // sharp.concurrency(1); // Set memory limit to 1GB
    // sharp.cache(false); // Disable caching

    let tilesDownloaded = 0;
    let compositeOperations = [];

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {

            const tileUrlWithParams = tileUrl.replace('{x}', x).replace('{y}', y).replace('{z}', zoom);
            try {
                const response = await axios.get(tileUrlWithParams, {
                    responseType: 'arraybuffer'
                });
                const img = Buffer.from(response.data, 'binary');
                if (!img) {
                    console.error(`No image data received for tile (${x}, ${y})`);
                    continue;
                }

                const tileX = (x - minX) * tileSize;
                const tileY = (y - minY) * tileSize;

                compositeOperations.push({
                    input: img,
                    top: tileY,
                    left: tileX,
                    blend: 'over'
                });

                tilesDownloaded++;
                process.stdout.write(`${tilesDownloaded*100/totalTiles}%\r`);
            } catch (error) {
                console.error(`Error downloading tile at (${x}, ${y}): ${error.message}`);
            }
        }
    }

    console.log(`Downloaded ${tilesDownloaded} tiles.`);

    if (compositeOperations.length > 0) { // Apply remaining operations
        await sharpInstance.composite(compositeOperations);
    }
    
    console.log(`Composing ${compositeOperations.length} tiles...`)

    const startTime = Date.now();

    await sharpInstance
    .png(
        {
            compressionLevel: 0,
            effort: 1,
            adaptiveFiltering: true,
            progressive: true,
            palette: true,
        }
    )
    .toFile('stitched_image.png').catch((err) => {
        console.error(`Error saving stitched image: ${err.message}`);
    });

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`Stitching completed in ${elapsedTime} ms`);
}

function lon2tileX(lon, zoom) {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

function lat2tileY(lat, zoom) {
    const rad = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * Math.pow(2, zoom));
}

module.exports = { downloadTiles };

