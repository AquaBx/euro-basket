<script lang="ts">
    import {Secteur} from "$lib/polygon.svelte"
    import {settings} from "$lib/store.svelte"
    import { onMount } from 'svelte';
    import maplibregl from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';

    let map:HTMLDivElement;
    let mymap:maplibregl.Map

    let {data} : { data : {secteurs : Secteur[]}} = $props()

    onMount(()=>{
        mymap = new maplibregl.Map({
            container: map,
            style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json', 
            center: [-1.772747,48.146961],
            zoom: 13,
        });

        mymap.on("load",()=>{
            for (let secteur of data.secteurs){
                secteur.addTo(mymap)
            }
        })
    })

</script>

{#if settings.secteurID}

    <div class="bg-white/80 shadow-2xl rounded-2xl absolute top-2 right-2 p-2 z-50">
        <h4 class="text-3xl text-slate-800">Secteur {settings.secteurID}</h4>
        <div>{data.secteurs[settings.secteurID].points.length} habitants</div>
    </div>
{/if}

<div bind:this={map} class="w-dvw h-dvh"></div>