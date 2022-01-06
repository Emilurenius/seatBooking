function seatSelectionhandler() {

    submitButton = document.getElementById("submit")
    Name = document.getElementById("name")
    mail = document.getElementById("mail")

    let seatSelected = {
        state: false,
        seat: ""
    }
    function populateSeats() {

        table = document.getElementById("table")
        table.innerHTML = ""
        const occupiedList = getJSON(`${url}/static/json/occupiedSeats.json`)
        const pendingList = getJSON(`${url}/static/json/pendingSeats.json`)

        for (let i = 0; i < 3; i++) {
            tr = document.createElement("tr")

            for (let y = 0; y < 8; y++) {
                td = document.createElement("td")
                button = document.createElement("input")
                button.type = "button"
                button.id = `${i}:${y}`

                // if (button.id in occupiedList && occupiedList[button.id].name == 'Admin') {
                //     //button.style = 'background-color: #090917 background: none; color: #090917; border: none; cursor: pointer; outline: none;'
                // }
                if (button.id in occupiedList) {
                    console.log(`${button.id} is occupied by ${occupiedList[button.id].name}`)
                    button.style = "background-color: #ff4a4a"
                }
                else if (button.id in pendingList) {
                    console.log(`${button.id} is awaiting confirmation from ${pendingList[button.id].name}`)
                    button.style = "background-color: #ff4a4a"
                }

                button.onclick = (event) => {
                    console.log(event.target.id)
                    if (event.target.id in occupiedList) {
                        console.log("Sete er ikke ledig")
                    }
                    else {

                        const occupiedList = getJSON(`${url}/static/json/occupiedSeats.json`)
                        const pendingList = getJSON(`${url}/static/json/pendingSeats.json`)
                        if (event.target.id in occupiedList || event.target.id in pendingList) {
                            document.getElementById(event.target.id).style = "background-color: #ff4a4a"
                        }else {
                            if (seatSelected.state) {
                                document.getElementById(seatSelected.seat).style = ""
                            }
    
                            document.getElementById(event.target.id).style = "background-color: #82ff86"
                            seatSelected.state = true
                            seatSelected.seat = event.target.id
                        }
                    }
                    populateSeats()
                            if (seatSelected.state) {
                                document.getElementById(seatSelected.seat).style = "background-color: #82ff86"
                            }
                }

                td.appendChild(button)
                tr.appendChild(td)
            }
            table.appendChild(tr)
        }

    }populateSeats()

    submitButton.addEventListener("click", (event) => {
        console.log(`${Name.value}, ${mail.value}`)
        const mailExists = getJSON(`${url}/mailtest?mail=${mail.value}`)
        let adminByPass
        if (mailExists.msg == 'adminByPassed') {
            alert('Setet er reservert av admin')

        }

        const occupiedList = getJSON(`${url}/static/json/occupiedSeats.json`)
        let alreadyReserved = false
        for (const [k, v] of Object.entries(occupiedList)) {
            if (mail.value == v.mail && mail.value != 'adminByPassed') {
                alert("Vent nå litt!!!\nDu har allerede reservert et sete!")
                alreadyReserved = true
                break
            }
        }
        if (!alreadyReserved && mailExists && seatSelected.state && !adminByPass) {
            response = getJSON(`${url}/reserveseat?name=${Name.value}&mail=${mail.value}&seat=${seatSelected.seat}`)
            if (response.response == "Success") {
                alert(`Sete reservert!\nEn Mail har blitt sendt til ${mail.value}.\nÅpne mailen for å bekrefte plassen din innen 5 minutter!`)
            }
            else if (response.response == "Already reserved") {
                alert("Setet er allerede reservert!")
                populateSeats()
                seatSelected = {
                    state: false,
                    seat: ""
                }
            }
            else if (response.response == "Invalid mail") {
                alert("Oida! Denne mailen kunne ikke brukes")
            }
            else {
                alert("Oisan!\nEn uventet feil har oppstått.\nVennligst prøv igjen.\nHvis problemet vedvarer, ta kontakt med Emil Christiansen.")
                populateSeats()
                seatSelected = {
                    state: false,
                    seat: ""
                }
            }
        }
        else if (!alreadyReserved && seatSelected.state && adminByPass) {
            response = getJSON(`${url}/reserveseat?name=${Name.value}&mail=${mail.value}&seat=${seatSelected.seat}`)
        }
        else if (!seatSelected.state) {
            alert("Du må velge et sete!")
        }
        else if (!alreadyReserved) {
            alert("Oida! Denne mailen kunne ikke brukes")
        }
    })
    
}seatSelectionhandler()