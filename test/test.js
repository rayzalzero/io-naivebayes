var mocha = require('mocha')
var assert = require('assert')
var app = require('../app')

describe('Test Service', function() {
    it('Classification', function (done) {
        app.train('positif', 'budi alhamdulillah');
        app.train('negatif', 'budi suka bom');
        
        assert.equal('positif', app.classify('alhamdulillah baik baik saja'));
        done();
    });    
});