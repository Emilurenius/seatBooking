function reservedList() {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Æ", "Ø", "Å"]
    const list = getJSON(`${url}/static/json/occupiedSeats.json`)
    const container = document.getElementById("container")
    container.innerHTML = ""
    for (const [k, v] of Object.entries(list)) {
        const text = document.createElement("p")
        text.innerHTML = `Sete ${alphabet[k.split(':')[0]]}:${parseInt(k.split(':')[1]) + 1} ==> ${v.name}`
        console.log(text)
        container.appendChild(text)
    }
    console.log(container)
}reservedList()

setInterval(() => {
    reservedList()

}, 5000)