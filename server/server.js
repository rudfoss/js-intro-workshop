const express = require("express")
const bodyParser = require("body-parser")

const port = 1337
const store = new Map()
const app = express()

app.get("/", (req, res) => {
	res.send(Array.from(store.keys()))
})
app.get("/:id", (req, res) => {
	const id = req.params.id
	if (!store.has(id)) {
		res.status(404).send("No such data")
	}
	res.send(store.get(id))
})
app.post("/:id", bodyParser.json(), (req, res) => {
	const {id} = req.params
	store.set(id, req.body)
	res.status(204).send()
})

app.listen(port, () => { console.log(`Server online @:${port}`) })