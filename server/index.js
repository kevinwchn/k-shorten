const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
 
const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
 
app.get('/api', (req, res) => {
  res.json({
    message: 'I\'m the response!'
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public'));

  app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
 
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
