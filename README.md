Naive Bayes Classifier

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