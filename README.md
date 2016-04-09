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

**This module is compatible with deis workflow (deis V2)**

*Tests*

To run the test the suite required a running deis cluster. It will use `deis.local3.deisapp.com` as URL.

Run `npm test` or `make test`



## License

(The MIT License)

Copyright (c) 2015 Manuel Alejandro de Brito fontes &lt;aledbf@gmail.com&gt;

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

