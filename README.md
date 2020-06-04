# `epicgames-client` deviceauth adapter
[![npm version](https://img.shields.io/npm/v/epicgames-client-deviceauth-adapter.svg)](https://npmjs.com/package/epicgames-client-deviceauth-adapter)
[![npm downloads](https://img.shields.io/npm/dm/epicgames-client-deviceauth-adapter.svg)](https://npmjs.com/package/epicgames-client-deviceauth-adapter)
[![license](https://img.shields.io/npm/l/epicgames-client-deviceauth-adapter.svg)](https://github.com/ThisNils/node-epicgames-client-deviceauth-adapter/blob/master/LICENSE.MD)

# Installation
```
npm i epicgames-client-deviceauth-adapter --save
```

# Example
```javascript
const { Launcher } = require('epicgames-client');
const ClientDeviceAuthAdapter = require('epicgames-client-deviceauth-adapter');

(async () => {

  const launcher = new Launcher();

  if(!await launcher.init()) {
    throw new Error('Error while initialize process.');
  }
  
  await launcher.login(null, await ClientDeviceAuthAdapter('EXCHANGE_CODE'));
  
  const playerName = 'Kysune';
  const account = await launcher.getProfile(playerName);
  if(!account) throw new Error(`Player ${playerName} not found!`);
	
  console.log(`${account.name}'s id: ${account.id}`);
  // "Kysune's id: 9a1d43b1d826420e9fa393a79b74b2ff"

})();
```

# Exchange Code
As you cant obtain exchange codes in the browser anymore you need to use [my tool](https://github.com/ThisNils/exchange-code-generator/releases/download/1.1/get-exchange-code-win.zip) or your own way!
An exchange code is a onetime code that expires after 300 seconds.
You will only have to get it once. If you want to login with a new account,
delete the deviceAuth file (by default at .egstore/deviceAuth.json) and get a
new exchange code for the account you want to add.

# Do you need help?
Join our discord server: https://discord.gg/PRJs3e6

# License
MIT License

Copyright (c) 2020 Nils S.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
