const Geocoding = require("../geocoding");
const Dez = new Geocoding;
(async () => {
console.log((await Dez.getPos("50.637", "3.075"))); // Euralille - Lille
})();