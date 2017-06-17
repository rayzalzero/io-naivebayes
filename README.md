# Naive Bayes Classifier

<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg" /></a>
<a href="https://codeclimate.com/github/rayzalzero/io-naivebayes"><img src="https://codeclimate.com/github/codeclimate/codeclimate/badges/issue_count.svg" /></a>

Perhitungan ini sedang dalam pengembangan jika ada kesalahan silahkan masukkan di issue

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
