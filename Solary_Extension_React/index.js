const PORT = 8000;
import express from 'express';
import cors from 'cors';
import axios from 'axios';
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.json('hi')
})

app.listen(8000, () => console.log(`Server is running on port ${PORT}`));

