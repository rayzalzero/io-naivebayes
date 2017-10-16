# Naive Bayes Classifier

[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/codeclimate/codeclimate)
[![Issue Count](https://codeclimate.com/github/rayzalzero/io-naivebayes/badges/issue_count.svg)](https://codeclimate.com/github/rayzalzero/io-naivebayes)
[![version](https://img.shields.io/npm/v/io-naivebayes.svg)](https://www.npmjs.org/package/io-naivebayes)
[![status](https://travis-ci.org/rayzalzero/io-naivebayes.svg)](https://travis-ci.org/rayzalzero/io-naivebayes)

Perhitungan ini sedang dalam pengembangan jika ada kesalahan silahkan masukkan di issue. Perhitungan ini masih menggunakan perhitungan murni dengan beberapa tambahan di Stopword dll. Apabila ada masukkan atau ingin mengembangkan module ini silahkan <a href="mailto:rayzalzero@gmail.com">klik disini</a>

# Install

```bash
npm install bayes-classifier
```

# Usage

```javascript
const nbayes = require('io-naivebayes')

nbayes.train('positif', 'budi alhamdulillah');
nbayes.train('negatif', 'budi suka bom');

console.log(nbayes.classify('alhamdulillah baik baik saja'));
console.log(nbayes.classify('bom itu meledak'));
```
MIT License

Copyright (c) 2017 Naufal Riza Fatahillah

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
