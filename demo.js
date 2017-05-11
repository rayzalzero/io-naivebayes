const nbayes = require('./app.js')
let classifier = nbayes()
console.log(classifier.train('positif', 'coba aja'));