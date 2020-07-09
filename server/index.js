const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const monk = require('monk');
const helmet = require('helmet');
const yup = require('yup');
const kenanIds = require('./episode/kenan');

require('dotenv').config();

const url = process.env.MONGODB_URI;

const db = monk(url);
const urls = db.get('urls');
urls.createIndex('slug',  { unique:true });

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const schema = yup.object().shape({
  url: yup.string().trim().url().required(),
  slug: yup.string().trim().matches(/[\w\-]/i)
});

let addhttpToUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'http://' + url;
  }
  return url;
};
 
app.get('/:slug', async (req, res, next) => {
  let err;
  try {
    const urlResult = await urls.findOne({ slug: req.params.slug });
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
  next(err);
});

app.get('/k/:id', async (req, res, next) => {
  const id = req.params.id;
  // res.json({
  //   id: id,
  //   ifvodId: kenanIds[id - 1]
  // });
  res.redirect('https://www.ifvod.tv/play?id=' + kenanIds[id - 1]);
});

app.post('/api/url', async (req, res, next) => {
  const { url, slug } = req.body;
  
  try {
    // await schema.validate({
    //   url: url,
    //   slug: slug
    // });
    await urls.insert({ url: url, slug: slug });
  } catch (err) {
    if (err.message.startsWith('E11000')) {
      err = new Error(`Slug in use`);
      err.statusCode = 400;
    }
    next(err);
  }

  res.json({
    url: url,
    slug: slug
  });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  }
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  })
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public'));

  app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
 
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
