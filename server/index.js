const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const monk = require('monk')
const helmet = require('helmet')

require('dotenv').config()

const url = process.env.MONGODB_URI;

const db = monk(url);
const urls = db.get('urls')
urls.createIndex('slug',  { unique:true })

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

let addhttpToUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url;
  }
  return url;
};
 
app.get('/:slug', async (req, res) => {
  let err;
  try {
    const urlResult = await urls.findOne({ slug: req.params.slug })
    if (urlResult) {
      res.redirect(addhttpToUrl(urlResult.url));
      return;
    } else {
      err = new Error(`Cannot find slug`);
      err.statusCode = 400;
    }
  } catch (mongoError) {
    err = new Error(`Unknown error`);
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
});

app.post('/api/url', async (req, res) => {
  const url = req.body.url;
  const slug = req.body.slug;

  try {
    await urls.insert({ url: url, slug: slug });
  } catch (mongoError) {
    let err;
    if (mongoError.message.startsWith('E11000')) {
      err = new Error(`Slug in use`);
      err.statusCode = 400;
      res.status(err.statusCode).send(err.message);
    } else {
      err = new Error(`Unknown error`);
      err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
  }

  res.json({
    url: url,
    slug: slug
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
