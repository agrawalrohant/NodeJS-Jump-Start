const express = require("express");

require("dotenv").config(); // to read .env  file and make them available in process.env
const PORT = process.env.PORT;
const app = express();

/* Inbuild Middleware : Process the input body json and make it avaiable in request.body */
app.use(express.json());

/* Custom Middleware : Just log the incoming request */
app.use((req, res, next) => {
  console.log(`${req.method} send to ${req.path}`);
  next(); // Proceed with the next handler or route handler in the line
});

app.get("/api/user", (req, res) => {
  res.json({
    status: "success",
    statusCode: 200,
    data: {
      name: "John Doe",
      age: 30,
    },
  });
});

app.post("/api/user", (req, res) => {
  console.log(req.body);
  res.json({
    data: req.body,
  });
});

/* Basic Route manage*/
app.use(function (req, res) {
  res.status(200).send("Hello World");
});

/* Start a server which is listening to port 3000 */
app.listen(3000, () => {
  // Handler/callback function called after server started
  console.log(`Server is running on port ${PORT}.`);
});
