const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const courses = [
	{ id: 1, name: "course1" },
	{ id: 2, name: "course2" },
	{ id: 3, name: "course3" }
];

function validateCourse(course) {
	const schema = {
		name: Joi.string().min(3)
	};
	return Joi.validate(course, schema);
}


app.put("/api/courses/:id", (req, res) => {
	// Find that course
	const course = courses.find(c => c.id === parseInt(req.params.id));
	// If not exists, return 404 error
	if(!course) return res.status(404).send("Course does not exist");
	// Validate
	const { error } = validateCourse(req.body);
	// Wrong validation, return 400 error
	if(error) return res.status(400).send(error.details[0].message);
 	// Update the course
 	course["name"] = req.body.name;
	// Return the course to the client
	res.send(course);
});


app.get("/", (req, res) => {
	res.send(`<h1>Hello WORLD</h1><br />I am Peter!
		<p>${req.ips}</p>
		<p>${req.hostname}</p>`);
	res.end();
});

app.get("/api/courses", (req, res) => {
	res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
	const course = courses.find(c => c.id == req.params.id);
	if(!course) return res.status(404).send("NO COURSE FOUND!");
	res.send(course);
});


app.post("/api/courses", (req, res) => {
	const { error } = validateCourse(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const course = {
		id: courses.length + 1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
	const course = courses.find(c => c.id == req.params.id);
	if(!course) return res.status(404).send("NO COURSE FOUND!");

	const index = courses.findIndex(c => c.id == req.params.id);
	courses.splice(index, 1);
	res.send(course);	
});

/*app.use("*", (req, res) => {
	res.redirect(routes.products.get);
});*/

app.listen(port, () => console.log(`Listening on port ${port}...`));