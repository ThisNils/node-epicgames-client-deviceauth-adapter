const {
  mkdir,
  readFile,
  readdir,
  writeFile,
} = require('fs').promises;
const request = require('request-promise');
const path = require('path');

const BASE_PROD = 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth';
const DEVICE_AUTH = 'https://account-public-service-prod.ol.epicgames.com/account/api/public/account';

const IOS_TOKEN = 'MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=';

const authenticate = async (exchangeCode, args) => {
  const config = {
    path: path.join(process.cwd(), '/.egstore'),
    ...args,
  };

  try {
    await readdir(config.path);
  } catch (err) {
    await mkdir(config.path);
  }

  let deviceAuthCredentials;
  try {
    deviceAuthCredentials = JSON.parse(await readFile(`${config.path}/deviceAuth.json`));
  } catch (err) {
    await writeFile(`${config.path}/deviceAuth.json`, '');
  }

  if (deviceAuthCredentials) {
    const fortniteToken = await request.post({
      url: `${BASE_PROD}/token`,
      form: {
        grant_type: 'device_auth',
        account_id: deviceAuthCredentials.accountId,
        device_id: deviceAuthCredentials.deviceId,
        secret: deviceAuthCredentials.secret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `basic ${IOS_TOKEN}`,
      },
      json: true,
    });

    const launcherExchange = await request({
      url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange',
      headers: {
        Authorization: `${fortniteToken.token_type} ${fortniteToken.access_token}`,
      },
      json: true,
    });

    return launcherExchange.code;
  }

  if (!exchangeCode) throw new Error('No deviceAuth or exchangeCode found!');

  const iosToken = await request.post({
    url: `${BASE_PROD}/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `basic ${IOS_TOKEN}`,
    },
    form: {
      grant_type: 'exchange_code',
      exchange_code: exchangeCode,
      includePerms: false,
    },
    json: true,
  });

  const deviceAuth = await request.post({
    url: `${DEVICE_AUTH}/${iosToken.account_id}/deviceAuth`,
    headers: {
      Authorization: `bearer ${iosToken.access_token}`,
    },
    json: true,
  });

  await writeFile(`${config.path}/deviceAuth.json`, JSON.stringify({
    accountId: deviceAuth.accountId,
    deviceId: deviceAuth.deviceId,
    secret: deviceAuth.secret,
  }));

  return authenticate(null, args);
};

module.exports = authenticate;
