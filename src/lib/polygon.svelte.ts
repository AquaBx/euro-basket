import type { Feature } from "maplibre-gl"
import {settings} from "./store.svelte"
import { secteurs } from "./secteur"
import maplibregl from "maplibre-gl"

export class Secteur {
    points : Point[]
    polygon : Polygon
    id : number
    constructor(id:number,poly : Polygon) {
        this.polygon = poly
        this.points	= []
        this.id = id
    }
    addPoint(pt:Point){
        this.points.push(pt)
    }
    contains(p:Point){
        return this.polygon.contains(p)
    }
    addTo(map:maplibregl.Map){

        map.addSource(`secteur-${this.id}`, {
            type: 'geojson',
            data: {
                "type": "FeatureCollection",
                "features": [
                    this.polygon.geoJSON,
                ]
            }
        });
        map.addLayer({
            'id': `secteur-${this.id}-fill`,
            'type': 'fill',
            'source': `secteur-${this.id}`,
            'layout': {},
            'paint': {
                'fill-color': `hsl(${ this.id / secteurs.length * 255}, 100%, 50%)`,
                'fill-opacity': 0.25,
            },
        });
        map.addLayer({
            'id': `secteur-${this.id}-border`,
            'type': 'line',
            'source': `secteur-${this.id}`,
            'layout': {},
            'paint': {
                'line-color': '#000000',
                'line-width': 1
            },
        });
        
        let thisSecteur = this
        map.on('click', `secteur-${this.id}-fill`, (e) => {
            settings.secteurID = thisSecteur.id
            const bounds = thisSecteur.polygon.bounds
            map.fitBounds(bounds, {
                    padding: 20
                });
        });
    }
}

export class Polygon{
    private points:Point[]
    constructor (points:Point[]){
        this.points = points
    }
    get geoJSON() : Feature<Geometry, GeoJsonProperties>{
        return {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                'coordinates': [
                    this.points.map(p => p.lnglat)
                ]
            }
        }
    }

    get bounds() {
        let bounds = new maplibregl.LngLatBounds()
        return this.points.reduce((bounds, coord) => { return bounds.extend(coord.lnglat); }, bounds);
    }


    public contains(point:Point) : boolean {
        let x = point.lng
        let y = point.lat

        let result = false;

        for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            let xi = this.points[i].lng
            let yi = this.points[i].lat
            let xj = this.points[j].lng
            let yj = this.points[j].lat
    
            if ((yi > y) != (yj > y)) {
                if (x < (xj - xi) * (y - yi) / (yj - yi) + xi){
                    result = !result
                }
            }
        }
    
        return result;
    };
}

export class Point{
    public lat:number
    public lng:number
    constructor (lat:number,lng:number){
        this.lat = lat
        this.lng = lng
    }
    get geoJSON() : Feature<Geometry, GeoJsonProperties>{
        return {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": this.latlng
                }
            }
    }

    get latlng() : [number,number] {
        return [this.lat,this.lng]
    }

    get lnglat() : [number,number] {
        return [this.lng,this.lat]
    }
}