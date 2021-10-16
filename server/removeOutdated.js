const path = require("path")
const fs = require("fs")

function loadJSON(filename) {
    const rawdata = fs.readFileSync(path.join(__dirname, filename))
    const data = JSON.parse(rawdata)
    return data
}

function saveJSON(json, filename) {
    const stringified = JSON.stringify(json, null, 4)
    fs.writeFile(path.join(__dirname, filename), stringified, (err) => {
        if (err) throw err
        console.log("Data written to file")
    })
}

setInterval(() => {
    let pending = loadJSON("/public/json/pendingSeats.json")
    let save = false

    for (const [k, v] of Object.entries(pending)) {
        console.log(Date.now() - parseInt(v.timestamp))
        if (Date.now() - parseInt(v.timestamp) > 5000) { // 300000
            delete pending[k]
            console.log(`Seat ${k} was reserved, but never confirmed. Reservation removed!`)
            save = true
        }
    }
    if (save) {
        saveJSON(pending, "/public/json/pendingSeats.json")
    }

}, 5000) // 300000