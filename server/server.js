const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const agenda = require("./agenda")

const store = new Map()
const app = express()
const port = 4242

store.set("agenda", agenda)

app.use(cors())

app.get("/", (req, res) => {
	const id = req.query.id
	if (!id) {
		res.status(400).send("Missing required parameter 'id'")
		return
	}
	if (!store.has(id)) {
		res.status(404).send("Not stored")
		return
	}

	const data = store.get(id)
	res.status(200).send(data)
})

app.post("/", bodyParser.json(), (req, res) => {
	const id = req.query.id
	if (!id) {
		res.status(400).send("Missing required parameter 'id'")
		return
	}

	store.set(id, req.body)
	res.send(req.body)
})

app.listen(port, () => { console.log(`Server online @:${port}`)})