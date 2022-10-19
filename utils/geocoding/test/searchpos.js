const Geocoding = require("../geocoding");
const Dez = new Geocoding;
(async () => {
console.log((await Dez.searchPos("boulevard d'alsace"))); // Un début d'adresse random
})();