function reservedList() {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Æ", "Ø", "Å"]
    const list = getJSON(`${url}/static/json/occupiedSeats.json`)
    container = document.getElementById("container")
    for (const [k, v] of Object.entries(list)) {
        const text = document.createElement("p")
        text.innerHTML = `Sete ${alphabet[v.seat.split(':')[0]]}:${v.seat.split(':')[1]} ==> ${v.name}`
    }
}reservedList()