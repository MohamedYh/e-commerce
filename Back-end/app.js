const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");

const app = express();
const cors = require("cors");
const port = 3002;

const appuri = "http://localhost:3001/";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Accounts = require("./modules/accounts");

app.use(cors());

const uri =
  "mongodb+srv://mohamedadyh00:yahyaad@cluster0.qs59ddi.mongodb.net/Data?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const prnt = (s) => {};

app.post("/register", async (req, res) => {
  const chrs = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  var s = "";
  for (let i = 0; i < 5; i++) {
    let x = Math.random() * parseInt(chrs.length);
    s += chrs[parseInt(x)];
  }

  console.log(req.body);
  try {
    await Accounts.find({ email: req.body.email })
      .then(async (r) => {
        if (r.length == 0) {
          const hashedPss = await bcrypt.hash(req.body.password, 10);
          const user = new Accounts({
            username: req.body.username,
            email: req.body.email,
            password: hashedPss,
            personalInfo: {
              name: "",
              adress: "",
              phonenumber: "",
            },
            verificationCode: s,
            isActive: false,
          });

          user
            .save()
            .then(async (r) => {
              console.log(r);
              let t = "";
              const chrs = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
              ];
              for (let i = 0; i < 5; i++) {
                t += chrs[chrs.length - chrs.indexOf(s[i]) - 1];
              }
              res.send(`verification code is: ${t}`);

              const trnsprt = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                  user: "sft.devams@gmail.com",
                  pass: "wenuendzdpasioef ",
                },
              });

              const infos = await trnsprt.sendMail({
                from: "sft.devams@gmail.com",
                to: req.body.email,
                subject: "Confirm your email",
                html: `<h2>Hello ${req.body.username}</h2><p>confirm your email<br></br>your verification code is: ${s}</p>`,
              });
              console.log("hhhhhhhhhhhhhhhhh");
              console.log(infos.response);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          res.send("this account is already exist");
        }
        prnt(r.toString());
      })
      .catch((e) => {
        prnt(e);
      });
  } catch (e) {
    console.log(e);
    res.json("error in post data");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    await Accounts.findOne({ email: email }).then(async (r) => {
      if (r == null) {
        res.send("this email doesn't exist");
      } else {
        const isSamePss = await bcrypt.compare(password, r.password);
        console.log(isSamePss);
        if (isSamePss) {
          if (r.isActive == false) {
            let t = "";
            const chrs = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "a",
              "b",
              "c",
              "d",
              "e",
              "f",
              "g",
              "h",
              "i",
              "j",
              "k",
              "l",
              "m",
              "n",
              "o",
              "p",
              "q",
              "r",
              "s",
              "t",
              "u",
              "v",
              "w",
              "x",
              "y",
              "z",
            ];
            for (let i = 0; i < 5; i++) {
              t += chrs[chrs.length - chrs.indexOf(r.verificationCode[i]) - 1];
            }
            res.send(`verification code is: ${t}`);
          } else {
            res.status(222).send(r);
          }
        } else {
          res.send("Email and password don't match");
        }
      }
    });
  } catch (e) {
    prnt(e);
  }
});

app.get("/setactive/:email", async (req, res) => {
  try {
    await Accounts.updateOne({ email: req.params.email }, { isActive: true });
  } catch (e) {
    prnt(e);
  }
});

app.post("/sbmtpinfo/:eml", async (req, res) => {
  console.log(req.body, req.params.eml);
  await Accounts.updateOne(
    { email: req.params.eml },
    { personalInfo: req.body }
  )
    .then((r) => {
      res.status(201).send("changed successfully");
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(port, () => {
  console.log(`application start on port ${port}`);
});

// mongodb+srv://mohamedadyh00:Yahyaad2019542008@container.ebxcp5p.mongodb.net/
