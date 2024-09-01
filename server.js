require('dotenv').config();
const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAIOpenAIApi;
const axios = require('axios');
const secrets = require('./secrets');
// const registerRoute = require('./Backend/src/routes/register');
const registerRoute = require('./Backend/src/routes/Register');
const passport = require('passport');
const { Strategy } = require('passport-local');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const multer = require('multer');
const contentAnswer = secrets.contentAnswer ;


const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const port = process.env.PORT || 3001;

const upload = multer({ dest: 'uploads/' });
const apiKey = process.env.OPENAI_API_KEY;

// might not be using the two lines below as I may just be using body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(cors());



// app.use(express.static('client/public'));

//
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const {OAuth2Client} = require('google-auth-library');
// const {User} = require('./serverMongo');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.get('/google-auth', (req, res) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  res.json({clientId, clientSecret});
});

app.post('/googlelogin', async (req, res) => {
  const {tokenId} = req.body;
  client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  }).then(response => {
    const {email_verified, name, email} = response.payload;
    if (email_verified) {
      res.json({
        message: 'Login success!',
        user: {name, email},
      });
    } else {
      res.json({
                message: 'Login failed!',
              });
            }
          });
        });
        
app.use('/register', registerRoute);
app.use('/login', registerRoute);

app.post('/', async (req, res) => {
  
  const {message} = req.body ;

  
  
  const response = await openai.createChatCompletion({
    "model": "gpt-3.5-turbo",
    // "model": "gpt-4",
    messages: [
      {role: "system", content: contentAnswer},
      {role: "user", content: message},
    ],
    
    
    "max_tokens": 80,
    "temperature": 0
  });
  
  console.log(response.data)

 var answer = response["data"]["choices"][0]["message"]["content"]
 console.log(answer);
 if(answer) {
       res.json({
           message: answer
       });
   }
});




// Route for uploading and processing images
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded family.');
  }
  
  let {message} = req.body ;

  // if (typeof message !== 'string') {
  //   message = JSON.stringify(message);
  // }

  const visionLola = secrets.visionLola;
  const visionLolaImage = secrets.visionLolaImage;
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const imageBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
  
  // Immediately delete the file after reading
  fs.unlinkSync(filePath);
  
try {
    console.log(typeof message);
    console.log(message);

    console.log(req.file);
    console.log(typeof imageBase64);

  const data = {
    // model: "gpt-4o",
    model: "gpt-4-vision-preview",
    // model: "gpt-4-turbo",
    messages: [
      // { role: "system", content: visionLola },
      {
        "role": "user",
        "content": [
          // { "type": "text", "text": message },
          { 
            "type": "image_url", 
            "image_url": `data:${mimeType};base64,${imageBase64}`
          } 
        ],
      }
    ],
    max_tokens: 30,
    "temperature": 0
  };

  // Make the request to the OpenAI API
  const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

   
      const answer = response.data.choices[0].message.content;
      // res.json({ message: answer });
      
      
      const newGPT3Input = `${visionLolaImage} ${answer} ${message}`;
      console.log(newGPT3Input);

      const responseGPT3 = await openai.createChatCompletion({
        "model": "gpt-3.5-turbo",
        // "model": "gpt-4",
        messages: [
          {role: "system", content: contentAnswer},
          // {role: "user", content:  visionLolaImage + answer + message},
          {role: "user", content:  newGPT3Input},
        ],
        
        
        "max_tokens": 30,
        "temperature": 0
      });
      
      console.log("GPT3 data: ", responseGPT3.data)
    
     var answerGPT3 = responseGPT3["data"]["choices"][0]["message"]["content"]
     console.log(answerGPT3);
     if(answerGPT3) {
           res.json({
               message: answerGPT3
           });
       }
       else {
        res.status(500).json({ error: 'Failed to fetch from GPT-3.5-turbo' });
      }
  
    } catch (error) {
      console.error('Error communicating with OpenAI API:', error);
      res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
    }
  });



app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Hey Yall World')
});



// try {
//   console.log(typeof message);
//   console.log(message);

//   console.log(req.file);
//   console.log(typeof imageBase64);

// const data = {
//   // model: "gpt-4o",
//   // model: "gpt-4-vision-preview",
//   model: "gpt-4-turbo",
//   messages: [
//     { role: "system", content: visionLola },
//     {
//       "role": "user",
//       "content": [
//         { "type": "text", "text": message },
//         { 
//           "type": "image_url", 
//           "image_url": `data:${mimeType};base64,${imageBase64}`
//         } 
//       ],
//     }
//   ],
//   max_tokens: 40,
// };
  
//   // Make the request to the OpenAI API
//   axios.post('https://api.openai.com/v1/chat/completions', data, {
//     headers: {
//       'Authorization': `Bearer ${apiKey}`,
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => {
//     const answer = response.data.choices[0].message.content;
//     res.json({ message: answer });
//     console.log(response.data.choices[0].message.content);
//   })
//   .catch(error => {
//     console.error('Error:', error.response ? error.response.data : error.message);
//   });
// }
// catch (error) {
//   console.error('Error communicating with OpenAI API:', error);
//   res.status(500).json({ error: 'Failed to fetch from OpenAI API' });
// }
      
      app.use(express.static(path.join(__dirname, 'client', 'public')));






const listImagesFromDirectory = (subDirectory) => {
    return new Promise((resolve, reject) => {
      const directoryPath = path.join(__dirname, 'client', 'public', subDirectory);
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.log(`Error reading directory: ${directoryPath}`, err);
          reject("Failed to list images");
        } else {
          console.log(`Files found in ${directoryPath}:`, files);
          const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|mp4)$/i.test(file))
                                  .map(file => `/` + path.join(subDirectory, file));
          resolve(imageFiles);
        }
      });
    });
  };

// Endpoint for listing images in headerMain
app.get('/api/images/headerMain', async (req, res) => {
    try {
      const images = await listImagesFromDirectory('headerMain');
      res.json(images); // Removing 'public' from the path, as static serve does this automatically
    } catch (error) {
      console.error(`Error in /api/images/headerMain:`, error);
      res.status(500).send(error);
    }
  });

// Endpoint for listing images in Yoga
app.get('/api/images/Yoga', async (req, res) => {
    try {
      const images = await listImagesFromDirectory('Yoga');
      res.json(images); // Removing 'public' from the path, as static serve does this automatically
    } catch (error) {
      console.error(`Error in /api/images/Yoga:`, error);
      res.status(500).send(error);
    }
  });
  

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
})



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

                           