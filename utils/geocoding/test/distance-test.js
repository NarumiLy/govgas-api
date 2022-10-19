const Geocoding = require("../geocoding");
const Dez = new Geocoding;
(async () => {
console.log(Dez.distance(50.637, 3.07508, 45.16382, 5.706578)); // Distance à vol d'oiseau entre Euralille (Lille) et le parc des Champs-Elysées de Grenoble
})();