const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express());
require("dotenv").config();



app.get('/', (req, res) => {
    res.send('Assignment 11 server running..');
})
app.listen(port, () => console.log(`Server running on port: ${port}`));



