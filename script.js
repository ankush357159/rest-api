import express from "express";
import Joi from "joi";

const app = express();
app.use(express.json());

const customers = [
  { title: "George", id: 1 },
  { title: "Josh", id: 2 },
  { title: "Tyler", id: 3 },
  { title: "Alice", id: 4 },
  { title: "Candice", id: 5 },
];

app.get("/", (req, res) => res.send("This is REST API demo"));

app.get("/api/customers", (req, res) => res.send(customers));

app.get("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));

  if (!customer)
    res.status(404)
      .send(`<h2 style="font-family: Malgun Gothic, color: darkred" >
    Oops...can't find what you are looking for</h2>`);
  res.send(customer);
});

//CREATE Request handler
//CREATE New customer information

app.post("/api/customers", (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //Increment the customer id
  const customer = {
    id: customers.length + 1,
    title: req.body.title,
  };
  customers.push(customer);
  res.send(customer);
});

//UPDATE Request handler
// UPDATE existing customer information
app.put("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send(`Not found!`);

  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  customer.title = req.body.title;
  res.send(customer);
});

//DELETE request handler
// DELETE existing customer information
app.delete("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send(`Not found!`);

  const index = customers.indexOf(customer);
  customers.splice(index, 1);

  res.send(customer);
});

//Validate information
function validateCustomer(req) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
  });

  const validation = schema.validate(req);
  return validation;
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
