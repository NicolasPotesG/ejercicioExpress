var express = require("express");
var router = express.Router();

const fs = require("fs");
const Joi = require("joi");
const ws = require("../wslib");
//const { isString } = require("util");

express().listen(300, () => console.log("Listening on port 3000"));
//Express JSON
express().use(express.json());

let messages = [];

//Obtiene todos los mensajes que se han enviado al chat
router.get("/chat/api/messages", function (req, res, next) {
  res.render("index", { title: "Express" });
  fs.readFile("persistence.json", "utf8", (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

//Obtiene el mensaje con el ts especificado
router.get("/chat/api/messages/:id", function (req, res, next) {
  fs.readFile("persistence.json", (err, data) => {
    JSON.parse(data).forEach((item) => {
      let msg;
      if (item.ts == parseInt(req.body.id)) {
        msg = item;
      }
    });
    if (!msg)
      return res
        .status(404)
        .send("The message with the given id (ts) was not found.");
    res.send(msg);
  });
});

//POST
router.post("/chat/api/messages", (req, res) => {
  const newMessage = {
    message: req.body.message,
    author: req.body.author,
    ts: req.body.ts,
  };
  messages.push(newMessage);
  res.send(newMessage);
});

//PUT
router.put("/chat/api/messages", (req, res) => {
  let ps = fs.readFileSync("persistence.json");
  let msg;
  JSON.parse(ps).forEach((item) => {
    if (item.ts == req.body.ts) {
      msg = item;
    }
  });

  if (!msg)
    return res.status(404).send("The message with the given ts was not found.");

  ws.sendMessages();
  res.send(msg);
});

//DELETE
route.delete("/chat/api/:id", (req, res) => {
  let ps = fs.readFileSync("persistence.json");
  let msg;
  JSON.parse(ps).forEach((item) => {
    if (item.ts == req.body.ts) {
      msg = item;
    }
  });
  if (!msg)
    return res.status(404).send("The message with the given ts was not found.");

  const index = messages.indexOf(msg);
  messages.splice(index, 1);

  res.send(msg);
});

module.exports = router;
