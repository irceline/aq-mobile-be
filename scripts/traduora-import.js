require('dotenv').config();

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

assert(process.env.TRADUORA_CLIENT_ID, 'TRADUORA_CLIENT_ID is required');
assert(process.env.TRADUORA_PROJECT_ID, 'TRADUORA_PROJECT_ID is required');
assert(
  process.env.TRADUORA_CLIENT_SECRET,
  'TRADUORA_CLIENT_SECRET is required',
);

// authenticate
(async () => {
  console.log('Authenticating...');

  let authOptions =
    process.env.TRADUORA_USERNAME === 'pipeline@nebulae.be'
      ? {
        grant_type: 'password',
        username: process.env.TRADUORA_USERNAME,
        password: process.env.TRADUORA_PASSWORD,
      }
      : {
        grant_type: 'client_credentials',
        client_id: process.env.TRADUORA_CLIENT_ID,
        client_secret: process.env.TRADUORA_CLIENT_SECRET,
      };

  const auth = await axios.post(
    `${process.env.TRADUORA_API_URL}/auth/token`,
    authOptions,
  );

  if (auth.status !== 200) {
    console.error('ERR! Authentication failed');
    process.exit(1);
  }

  console.log('Authenticated');

  axios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${auth.data.access_token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // List all available translation locales
  console.log('Fething available locales...');
  const locales = await axios.get(
    `${process.env.TRADUORA_API_URL}/projects/${process.env.TRADUORA_PROJECT_ID}/translations`,
  );

  if (locales.status !== 200) {
    console.error('ERR! Unable to load locales from TRADUORA');
    process.exit(1);
  }

  console.log(
    `Loop through all locales: [${locales.data.data
      .map(d => d.locale.code)
      .join(', ')}]`,
  );

  const promises = locales.data.data.map(locale => {
    return new Promise(async (resolve, reject) => {
      const translation = await axios.get(
        `${process.env.TRADUORA_API_URL}/projects/${process.env.TRADUORA_PROJECT_ID}/exports?locale=${locale.locale.code}&format=jsonnested&projectId=${process.env.TRADUORA_PROJECT_ID}`,
      );
      if (translation.status !== 200) {
        return reject(translation.statusText);
      }

      console.log(`OK! local: ${locale.locale.code}`);

      resolve({
        code: locale.locale.code,
        translation: translation.data,
      });
    });
  });

  Promise.all(promises)
    .then(arr => {
      arr.map(writeTranslationFile);
    })
    .catch(err => {
      console.error('Err! Unable to export translations', err);
      process.exit(1);
    });
})();

function writeTranslationFile({ code, translation }) {
  if (!fs.existsSync(path.join(__dirname, '../src/assets/i18n'))) {
    fs.mkdirSync(path.join(__dirname, '../src/assets/i18n'));
  }
  // check if file existed
  // fs.writeSync(path.join(__dirname, '../'))
  fs.writeFileSync(
    path.join(__dirname, `../src/assets/i18n/${code}.json`),
    JSON.stringify(translation, undefined, 2),
  );
  console.log(
    `OK! translation ${code} written to src/assets/i18n/${code}.json`,
  );
}
