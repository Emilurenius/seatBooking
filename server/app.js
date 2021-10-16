// All external modules are loaded in:
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const cors = require("cors")
const nodemailer = require("nodemailer")
const emailCheck = require("email-check")

const serverAddress = "http://172.16.4.195:3000"

let connections = 0

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

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

mailPass = loadJSON("/mailPass.json")
console.log(mailPass)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "emilsen68@gmail.com",
        pass: mailPass
    }
})



// Reading input from terminal start
const port = parseInt(process.argv[2])
console.log(`${port} registered as server port`)
// Reading input from terminal end

app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.

app.use("/static", express.static("public"))

app.get("/", (req, res) => {
    connections++
    console.log(`Connections made since server started: ${connections}`)
    res.sendFile(path.join(__dirname, "/html/index.html"))
})

app.get("/mailtest", (req, res) => {

    emailCheck(req.query.mail)
        .then((response) => {
            console.log(response)
            res.send(response)
        })
        .catch((err) => {
            if (err.message === "refuse") {
                console.error("MX server is refusing requests from your IP address")
                res.send(false)
            } else {
                console.error(err)
                res.send(false)
            }
        })
})

app.get("/reserveseat", (req, res) => {
    let reserved = loadJSON("/public/json/occupiedSeats.json")
    let pendingSeats = loadJSON("/public/json/pendingSeats.json")

    if (req.query.seat in reserved || req.query.seat in pendingSeats) {
        console.log("Seat already reserved")
        res.send({"response": "Already reserved"})
    }
    else {
        res.send({"response": "Success"})
        console.log("Success")
        const randCode = randInt(1111111111, 9999999999)
        
        pendingSeats[req.query.seat] = {
            "name": req.query.name,
            "mail": req.query.mail,
            "code": randCode
        }
        saveJSON(pendingSeats, "/public/json/pendingSeats.json")

        const mailOptions = {
            from: "emilsen68@gmail.com",
            to: req.query.mail,
            subject: "Elevkveld reservasjon bekreftelse",
            text: `Klikk på denne linken for å bekrefte din reservasjon: ${serverAddress}/confirm?code=${randCode}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(`Email sent: ${info.response}`)
            }
        })
    }
})

app.get("/confirm", (req, res) => {
    const pendingSeats = loadJSON("/public/json/pendingSeats.json")

    let reservationFound = false
    let confirmedReservation = ""
    for (const [k, v] of Object.entries(pendingSeats)) {
        if (req.query.code == (v.code)) {
            res.send("Reservasjonen har blitt bekreftet")
            reservationFound = true
            confirmedReservation = k
            break
        }
    }
    if (reservationFound) {
        const occupiedSeats = loadJSON("/public/json/occupiedSeats.json")

        occupiedSeats[confirmedReservation] = {
            "name": pendingSeats[confirmedReservation].name,
            "mail": pendingSeats[confirmedReservation].mail
        }
        delete pendingSeats[confirmedReservation]

        saveJSON(occupiedSeats, "/public/json/occupiedSeats.json")
        saveJSON(pendingSeats, "/public/json/pendingSeats.json")

        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Æ", "Ø", "Å"]

        const mailOptions = {
            from: "emilsen68@gmail.com",
            to: req.query.mail,
            subject: "Elevkveld reservasjon Kvittering",
            text: `Du har nå reservert sete ${confirmedReservation}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                res.send(error)
            }
            else {
                console.log(`Email sent: ${info.response}`)
                res.send(`Email sent: ${info.response}`)
            }
        })

    }
    else {
        res.send("Oida! Den reservasjonen finnes ikke!\nHvis det er mer enn 5 minutter siden du reserverte setet, har tiden gått ut!")
    }
})

app.listen(port, () => console.log(`Listening on ${port}`))