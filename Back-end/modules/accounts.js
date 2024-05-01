const mongoose = require("mongoose");

const Account = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  personalInfo: {
    name: String,
    adress: String,
    phonenumber: String,
  },
  verificationCode: String,
  isActive: Boolean,
});

const Accounts = mongoose.model("Accounts", Account);

module.exports = Accounts;
