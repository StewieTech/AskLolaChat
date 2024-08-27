const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

// app.get('/', (req, res) => {
//     res.send('Hey Yall World')
// });

const port = 3000 || process.env.PORT  
// 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

