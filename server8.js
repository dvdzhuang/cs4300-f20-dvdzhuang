const express = require('express');
const app = express();
app.use(express.static('a8'));
app.listen(3000);