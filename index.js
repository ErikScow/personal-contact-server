require("dotenv").config();
const express = require("express");
const server = express();
const nodemailer = require("nodemailer");
const cors = require("cors");

server.use(cors());
server.use(express.json());

const transport = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.ADDRESS,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is ready to take messages");
  }
});

server.post("/send", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const subject = req.body.subject;

  const content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

  const mail = {
    from: name,
    to: `${process.env.ADDRESS}`,
    subject: `FROM YOUR CONTACT SERVER: ${subject}`,
    text: content,
  };

  const returnMail = {
    from: process.env.ADDRESS,
    to: email,
    subject: `Message to ${process.env.NAME} was delivered!`,
    text: `Thank you for contacting me. I will get back to you as soon as I can!\nForm details\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({ status: "fail" });
    } else {
      res.json({
        status: "success",
      });

      transporter.sendMail(returnMail, (returnErr, returnData) => {
        if (returnErr) {
          console.log(returnErr);
        } else {
          console.log("Message send" + returnData.response);
        }
      });
    }
  });
});

server.listen(3002);
