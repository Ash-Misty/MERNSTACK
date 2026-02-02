const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ContactDb")
  .then(() => console.log("Db connected successfully"))
  .catch(err => console.log("Db not connected", err));
