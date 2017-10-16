# Naive Bayes Classifier

[![Build Status](https://travis-ci.org/rayzalzero/io-naivebayes.svg?branch=master)](https://travis-ci.org/rayzalzero/io-naivebayes)
<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg" /></a>
<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/issue_count.svg" /></a>

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
