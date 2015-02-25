deis-api
========

Wrapper for deis.io API

`npm install deis-api --save`

```js
var DeisAPI = require('./index');

var client = new DeisAPI({
    controller : 'deis.local3.deisapp.com',
    secure     : true,  // Optional
    version    : 1,     // Optional
    username   : 'deis',
    password   : 'qwerty'
});
```

The properties that aren't marked optional will throw an error if they are missing.

*Tests*

To run the test the suite required a running deis cluster. It will use `deis.local3.deisapp.com` as URL.

Run `npm test` or `make test`

**TODO**
- [ ] limits
- [ ] missing tests
