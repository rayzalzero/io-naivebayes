const nbayes = require('./lib/io-naivebayes')


nbayes.train('positif', 'budi alhamdulillah');
nbayes.train('negatif', 'budi suka bom');

console.log(nbayes.classify('alhamdulillah baik baik saja'));
console.log(nbayes.classifyplus('bom itu meledak'));