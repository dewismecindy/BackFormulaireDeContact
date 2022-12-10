/* j'importe mes packages express, dotenv et cors et Mailgun */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
/* Lire les bodys envoyés dans la requête */
app.use(express.json());
app.use(cors());

/* Procedure mailgun à copier coller */
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "cindewi",
  key: process.env.MAILGUN_API_KEY,
});

/* J'interroge ma route */
app.get("/", (req, res) => {
  console.log("route /");
  /* Je réponds au client */
  res.status(200).json({ message: "Coucou !" });
});

app.post("/form", async (req, res) => {
  console.log("route form");
  console.log(req.body);

  const messageData = {
    from: `${req.body.prenom} ${req.body.nom}<${req.body.email}>`,
    to: "dewismecindy@gmail.com",
    subject: "Formulaire de contact",
    text: req.body.message,
  };
  /* Pour être sûre que j'ai bien fait la requête */
  console.log("messageData", messageData);

  /*   client.messages
    .create(process.env.SANDBOX, messageData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    }); */

  /* j'opte pour un try/catch */
  try {
    const reponse = await client.messages.create(
      process.env.SANDBOX,
      messageData
    );
    console.log("response>>>", response);
    res.status(200).json({ message: "email send" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server his started !", process.env.PORT);
});
