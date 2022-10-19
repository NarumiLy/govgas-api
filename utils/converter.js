const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const strictify = require("json-strictify");
const jsons = strictify.default;
const unzip = require("./unzip");
const download = require("./download");

async function convert() {

    download("https://donnees.roulez-eco.fr/opendata/instantane ", "./PrixCarburants_instantane.zip")
    await unzip();
    let xml_string = fs.readFileSync("PrixCarburants_instantane.xml", "utf-8");
    var bdd = { dt: [] };
    let x = 0;
    while(x <= 94) {
        let dt = x+1;
        dt = dt.toString();

        if(Number(dt) <= 9) {
            dt = "0" + dt
        }

        bdd.dt.push({ id: dt, pdv: [] });
        x++;
    }

    parser.parseString(xml_string, function(error, result) {
        if(error) return console.log(error);
        let pdv = result["pdv_liste"]["pdv"]

        for(const i of pdv) {
            let cp = i["ATTR"]["cp"].slice(0, 2);
            x = 0;
            for(const o of bdd.dt) {
                if(o["id"] === cp) {
                    bdd.dt[x]["pdv"].push({ list: i });
                }
                x++;
            }
        } 
    }); 

    fs.writeFileSync("../bdd.json", jsons.stringify(bdd.dt));
}

setInterval(convert, 10000);