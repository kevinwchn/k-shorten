const yup = require('yup');
const schema = yup.object().shape({
  url: yup.string().trim().url().required(),
  slug: yup.string().trim().matches(/[\w\-]/i)
});

(async () => {
  console.log(await schema.isValid({
    url:'https://asdf.com',
    slug:'a'
  }))

  // all of the script.... 

})();
