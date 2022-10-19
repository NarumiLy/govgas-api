const express = require("express");
const Geocoding = require("./utils/geocoding/geocoding");
const fs = require("fs");
const app = express();
const geo = new Geocoding;
const rdata = fs.readFileSync("bdd.json");
const data = JSON.parse(rdata);
var station_liste = [];

app.get("/getstations", async function(req, res) {

    /*
    * Récupère la latitude, la longitude et la distance maximale demandée par l'utilisateur
    * Pour ensuite checker la position de celui-ci, on check également si les infos sont bien données
    */
    const lat = req.query.lat, 
    long = req.query.long,
    distance_max = req.query.distance_max;
    if(lat === undefined  || long === undefined || distance_max === undefined) return res.send({ result: "missing latitude, longitude or distance_max" });
    const position = await geo.getPos(lat, long);
   
    /* 
    * Si l'API n'a pas trouvé la position alors on check l'entièreté de la bdd,
    * Sinon on ne check que toutes les stations-service du département. 
    */
    if(position === undefined) {

        for(const i of data) {
            for(const station of i.pdv) {
                /* 
                * On divise la latitude et longitude des stations-service dans la bdd car elle
                * est donnée 100 000 fois + grande que normalement.
                * + On check la distance entre la station-service et l'utilisateur pour pouvoir comparé
                * avec la distance max que l'utilisateur demande.
                */
                const stlat = Number(station.list.ATTR.latitude) / 100000,
                stlong = Number(station.list.ATTR.longitude) / 100000,
                distance_calcul = geo.getDistance(lat, long, stlat, stlong);

                if(distance_calcul.unit == "km") {

                    if(distance_calcul.distance <= distance_max) {

                        /*
                        * On ajoute dans une variable, qu'on envoiera à la fin en réponse, les stations-services
                        * qui sont à une distance < à distance_max et on ajoute la distance à vol d'oiseau entre
                        * la position de l'utilisateur et celle de la station-service
                        */
                        station_liste.push({ station: station, distance: distance_calcul.distance + distance_calcul.unit });
                    }
                } else {

                    if(distance_calcul.distance <= distance_max * 1000) {

                        /*
                        * On ajoute dans une variable, qu'on envoiera à la fin en réponse, les stations-services
                        * qui sont à une distance < à distance_max et on ajoute la distance à vol d'oiseau entre
                        * la position de l'utilisateur et celle de la station-service.
                        * (Ps: distance_max fois 1000 car c'est la distance en mètre)
                        */
                        station_liste.push({ station: station, distance: distance_calcul.distance + distance_calcul.unit });
                    }
                }
            }
        }

        // On envoie la liste des stations-service et leurs nombres sous format JSON
        return res.send({ data: station_liste, length: station_liste.length })
    } else {

        /* 
        * Le "context" est donné comme un string, et contient également la ville et le département en +
        * du code départemental, alors on récupère seulement le code départemental
        */
        const dt = position.properties.context.slice(0, 2);
        for(const i of data) {
            if(i.id  === dt) {
                for(const station of i.pdv) {

                    const stlat = Number(station.list.ATTR.latitude) / 100000,
                    stlong = Number(station.list.ATTR.longitude) / 100000,
                    distance_calcul = geo.getDistance(lat, long, stlat, stlong);

                    if(distance_calcul.unit == "km") {

                        if(distance_calcul.distance <= distance_max) {
                            /*
                            * On ajoute dans une variable, qu'on envoiera à la fin en réponse, les stations-services
                            * qui sont à une distance < à distance_max et on ajoute la distance à vol d'oiseau entre
                            * la position de l'utilisateur et celle de la station-service
                            */
                            station_liste.push({ station: station, distance: distance_calcul.distance + distance_calcul.unit });
                        }
                    } else {

                        if(distance_calcul.distance <= distance_max * 1000) {

                            /*
                            * On ajoute dans une variable, qu'on envoiera à la fin en réponse, les stations-services
                            * qui sont à une distance < à distance_max et on ajoute la distance à vol d'oiseau entre
                            * la position de l'utilisateur et celle de la station-service.
                            * (Ps: distance_max fois 1000 car c'est la distance en mètre)
                            */
                            station_liste.push({ station: station, distance: distance_calcul.distance + distance_calcul.unit });
                        }
                    }
                }
            }
            
        }

        // On envoie la liste des stations-service et leurs nombres sous format JSON
        return res.send({ data: station_liste, length: station_liste.length })
    }


    /* 
    * ToDo: Donner les stations les + proches, donner la distance
    * Les organiser par distance ou prix (?)
    * Faire que ça marche qu'avec un mdp (?)
    * donner les stations par région/dp (?)
    */
})

app.listen(8080)