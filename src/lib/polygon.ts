import { secteurSelected } from "./store"

export class Secteur {
    points : Point[]
    polygon : Polygon
    id : number
    constructor(id:number,poly : Polygon) {
        this.polygon=poly
        this.points	= []
        this.id = id
    }
    addPoint(pt:Point){
        this.points.push(pt)
    }
    contains(p:Point){
        return this.polygon.contains(p)
    }
    addTo(L:any,mymap:any){
        let layer = L.layerGroup()

        this.polygon.addTo(layer)
        for (let pt of this.points){
            pt.addTo(layer)
        }

        let thisSecteur = this

        this.polygon.node.on("click", function (e:Event) {
            // info.update({"secteur": quer, "habitations": this.points.length,"id":e.target._leaflet_id});
            secteurSelected.set(thisSecteur)
            mymap.fitBounds(e.target!.getBounds());
        });

        layer.addTo(mymap)
    }

}

export class Polygon{
    private points:Point[]
    private polygon:any

    get node(){
        return this.polygon
    }

    constructor (L:any,points:Point[]){
        this.points = points

        let latlngs:number[][] = []

        for (let point of this.points){
            latlngs.push(point.getCouple)
        }

        this.polygon = L.polygon(latlngs, {color: 'red'});
    }

    addTo(mymap:any){
        this.polygon.addTo(mymap)
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
    private point:any

    get node(){
        return this.point
    }

    addTo(mymap:any){
        // this.point.addTo(mymap);
    }

    get getCouple() {
        return [this.lat,this.lng]
    }

    constructor (L:any,lat:number,lng:number){
        this.lat = lat
        this.lng = lng
        this.point=L.circle([lat,lng], {color: 'red'})
        // this.point.bindPopup(`${lat} ${lng}`)
    }
}