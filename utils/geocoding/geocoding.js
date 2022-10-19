class Geocoding {
    constructor() {
        this.uri = "https://api-adresse.data.gouv.fr/";
        this.axios = require("axios");
    }

    /**
     * @name distance - get distance between 2 specific location, in km or m
     * @param {int} lat1 - First latitude in decimal degrees
     * @param {int} long1 - First longitude in decimal degrees
     * @param {int} lat2 - 2nd latitude in decimal degrees
     * @param {int} long2 - 2nd longitude in decimal degrees
     */
    getDistance(lat1, long1, lat2, long2) {

        const R = 6371;
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (long2-long1) * Math.PI/180;
    
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        let d = R * c; // valeur en km, j'ai essayé le théorème de pythagore mais c'était beaucoup trop aproximatif
    
        if(d < 1) {
            d = d * 1000
            return  {
                distance: Number(d.toString().split(".")[0]),
                unit: "m",
            }
        } else {
            return { 
                distance: Number(d.toString().split(".")[0]),
                unit: "km",
            }
        }
    }

    /**
     * @name getPos
     * @param {string} lat - decimal degrees
     * @param {string} long - decimal degrees
     */
    async getPos(lat, long) {
        if(typeof lat != "string" || typeof long != "string") return console.log("Values must be strings");
        const res = (await this.axios.get(this.uri + "reverse/?" + `lon=${long}&lat=${lat}`)).data;
        if(res.features.length === 0) return console.log("Found nothing");

        return {
            "coordinates": res.features[0].geometry.coordinates,
            "properties": res.features[0].properties
        }
    }

    /**
     * @name searchPos
     * @param {string} search 
     * @param {int} limit - optional, between 1 and 100 
     * @param {int} autocomplete - optional,  0 or 1
     * @param {string} lat - optional, latitude in decimal degrees
     * @param {string} lon - optional, lon in decimal degrees 
     * @param {string} type -  optional, housenumber, street, locality or municipality
     * @param {string} postcode - optional, code POSTAL
     * @param {string} citycode - optional, code INSEE
     */
    async searchPos(search, limit = 100, autocomplete = 1, lat = null, lon = null, type = null, postcode = null, citycode = null ) {
        if(typeof search != "string") return console.log("It must be a string value !");
        const res = (await this.axios.get(this.uri + "search/" + `?q=${search}&limit=${limit}&autocomplete=${autocomplete}&lat=${lat}&lon=${lon}&type=${type}&postcode=${postcode}&citycode=${citycode}`)).data;
        if(res.features.length === 0) return console.log("Found nothing");

        if(res.features.length === 1) return {
            "coordinates": res.features[0].geometry.coordinates,
            "properties": res.features[0].properties
        }
        
        return {
            "list": res.features
        }
    }
}

module.exports = Geocoding;