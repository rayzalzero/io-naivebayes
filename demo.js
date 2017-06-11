const nbayes = require('./lib/app')


nbayes.train('positif', 'budi alhamdulillah');
nbayes.train('negatif', 'budi suka bom');

console.log(nbayes.classify('alhamdulillah baik baik saja'));
console.log(nbayes.classify('bom itu meledak'));