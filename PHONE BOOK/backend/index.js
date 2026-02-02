const express = require('express');
const cors = require('cors');   // <-- import cors
const app = express();
require('./db');

// Enable CORS for all routes
app.use(cors());               // <-- add this
app.use(express.json());

app.use('/api', require('./Routes/contactRouter'));

app.listen(3000, () => console.log("Port listening at 3000"));
