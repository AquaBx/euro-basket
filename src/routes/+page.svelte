<script lang="ts">
    import {Polygon,Point, Secteur} from "$lib/polygon"
    import {secteurs} from "$lib/secteur"
    import {secteurSelected} from "$lib/store"
    import { onMount } from 'svelte';

    let map:HTMLDivElement;
    let mymap:any

    onMount(async ()=>{

        var corner1 = L.latLng(48.205685, -1.936169)
        var corner2 = L.latLng(48.101126, -1.607609)
        var bounds = L.latLngBounds(corner1, corner2);

        mymap = L.map(map, {
            center: [48.146961, -1.772747],
            zoom: 13,
            maxBounds:bounds,
            preferCanvas: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 13, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(mymap);

        L.control.browserPrint({
            printModes: [
                L.BrowserPrint.Mode.Auto("A4"),
            ]
        }).addTo(mymap)

        let secteursPoly = []
        for (let i in secteurs){
            let liste = []
            for (let couple of secteurs[i]){
                liste.push(new Point(L,couple.at(0)!,couple.at(1)!))
            }
            secteursPoly.push(new Secteur(parseInt(i),new Polygon(L,liste)))
        }

        let resp = await fetch("https://bano.openstreetmap.fr/data/bano-35.csv")
        let text = await resp.text()

        for (let line of text.split("\n")){
            let params = line.split(",")
            if (["35740","35590"].includes(params[3])){
                let pt = new Point(L,parseFloat(params[6]),parseFloat(params[7]))
                for (let s of secteursPoly){
                    if (s.contains(pt)){
                        s.addPoint(pt)
                    }
                }
            }
        }

        for (let secteur of secteursPoly){
            secteur.addTo(L,mymap)
            
        }

    })

</script>

{#if $secteurSelected}
    <div class="info">
        <h4>Secteur {$secteurSelected.id}</h4>
        <div>{$secteurSelected.points.length} habitants</div>
    </div>

{/if}
<div bind:this={map} style="height:100dvh;width:100dvw" />

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="./leaflet.browser.print.min.js"></script>
    
    <style>
        body{margin:0}
        @media print{
            .leaflet-control-layers, .leaflet-control-zoom {
                display:none;
            }
        }
    </style>
</svelte:head>

<style>
    .info {
        padding: 6px 8px;
        font: 26px Arial, Helvetica, sans-serif;
        background: white;
        background: rgba(255,255,255,0.8);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 5px;
        position: absolute;
        top:8px;
        right:8px;
        z-index:10000;
    }
        
    .info h4 { 
        margin: 0 0 5px;
        color: #777; 
    }



</style>