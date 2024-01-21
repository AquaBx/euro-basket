
async function test() {
    
    let resp = await fetch("https://bano.openstreetmap.fr/data/bano-35.csv")
    let text = await resp.text()

    let points = []

    for (let line of text.split("\n")){
        let params = line.split(",")
        if (["35740","35590"].includes(params[3])){
            points.push([parseFloat(params[6]),parseFloat(params[7])])
        }
    }
    
    console.log(resp)
    
}

test()
