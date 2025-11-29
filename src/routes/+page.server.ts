import { Point, Polygon, Secteur } from "$lib/polygon.svelte"
import { secteurs } from "$lib/secteur"
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function({ fetch }) {
    let resp = await fetch("https://bano.openstreetmap.fr/data/bano-35.csv")
    let text = await resp.text()

    let secteursPoly = []
    for (let i in secteurs){
        let liste = []
        for (let couple of secteurs[i]){
            liste.push(new Point(couple.at(0)!,couple.at(1)!))
        }
        secteursPoly.push(new Secteur(parseInt(i),new Polygon(liste)))
    }

    let points = []
    for (let line of text.split("\n")){
        let params = line.split(",")
        if (["35740","35590"].includes(params[3])){
            let pt = new Point(parseFloat(params[6]),parseFloat(params[7]))
            for (let s of secteursPoly){
                if (s.contains(pt)){
                    s.addPoint(pt)
                }
            }
            points.push(pt)
        }
    }

    return { secteurs : secteursPoly }
}

