const express = require("express");
const fs = require("fs");
const short = require("short-uuid");

require("dotenv").config(); // to read .env  file and make them available in process.env
const PORT = process.env.PORT;
const app = express();
const data = fs.readFileSync("./data.json", "utf8");
const userData = JSON.parse(data);
//console.log(userData);

/* Inbuild Middleware : Process the input body json and make it avaiable in request.body */
app.use(express.json());

/* Custom Middleware : Just log the incoming request */
app.use((req, res, next) => {
  console.log(`${req.method} send to ${req.path}`);
  next(); // Proceed with the next handler or route handler in the line
});

//app.use();

app.get("/api/allUsers", (req, res) => {
  try {
    let msg = "";
    if (userData.length === 0) {
      msg = "No user found";
    } else {
      msg = "Data found";
    }
    res.json({
      status: "success",
      message: msg,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/user/:id", (req, res) => {
  try {
    const { id } = req.params;
    let user = userData.find((user) => user.id == id);
    if (!user) {
      throw new Error("User not found");
    } else {
      res.json({
        status: 200,
        message: "User found",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/user", (req, res) => {
  const id = short.generate();
  const userDetails = req.body;
  if (Object.keys(userDetails).length === 0) {
    res.status(400).json({
      status: 400,
      message: "Body cannot be empty",
    });
  } else {
    userDetails["id"] = id;
    console.log("New User : " + userDetails);
    userData.push(userDetails);
    fs.writeFile("./data.json", JSON.stringify(userData), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("data.json updated");
    });
    res.json({
      status: 200,
      message: "User added successfully",
      data: userDetails,
    });
  }
});

/* User Delete Route*/
app.delete("/api/user/:id", (req, res) => {
  try {
    const { id } = req.params;
    let user = userData.find((user) => user.id == id);

    if (!user) {
      throw new Error("User not found");
    } else {
      let index = userData.indexOf(user);
      userData.splice(index, 1);
      fs.writeFile("./data.json", JSON.stringify(userData), (err) => {
        if (err) {
          console.log(err);
        }
        console.log("data.json updated");
      });
      res.json({
        status: 200,
        message: "User deleted successfully",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* User Patch Route*/
app.patch("/api/user/:id", (req, res) => {
  try {
    const { id } = req.params;
    let user = userData.find((user) => user.id == id);
    if (!user) {
      throw new Error("User not found");
    } else {
      const userDetails = req.body;
      let index = userData.indexOf(user);
      Object.keys(userDetails).forEach((key) => {
        userData[index][key] = userDetails[key];
      });
      fs.writeFile("./data.json", JSON.stringify(userData), (err) => {
        if (err) {
          console.log(err);
        }
        console.log("data.json updated");
      });
      res.json({
        status: 200,
        message: "User updates successfully",
        data: userData[index],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* Basic Route manage*/
app.use(function (req, res) {
  res.status(404).send("404 Not found");
});

/* Start a server which is listening to port 3000 */
app.listen(3000, () => {
  // Handler/callback function called after server started
  console.log(`Server is running on port ${PORT}.`);
});
