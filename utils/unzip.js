const JSZip = require("jszip");
const fs = require("fs")
const jszip = new JSZip();
const zip = fs.readFileSync("./PrixCarburants_instantane.zip");

async function unzip() {
    const file = await jszip.loadAsync(zip)
    fs.writeFileSync("PrixCarburants_instantane.xml", Buffer.from(await file.file("PrixCarburants_instantane.xml").async("arraybuffer")))
}

module.exports = unzip;