var Twit = require('twit')

var T = new Twit({
  consumer_key:         'uGGP2BkPdPbNILdQ7MzbScHxs',
  consumer_secret:      '8XBdqgCsMwTUwHOBKROXPMDwWwG9yAYlwuL3w4p0PXKg4xiEYw',
  access_token:         '559978133-St9zmnkO5oLJmswUWcih7ZCusS3vpQXfLNYlhaWH',
  access_token_secret:  'D7kiO2ijLqAsS5Z06e0lor3RtByY22a7Zjp7DYbUf5vuS',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})


//
//  search twitter for all tweets containing the word 'banana' since July 11, 2011
//
T.get('search/tweets', { q: 'banana since:2017-05-24 until:2017-05-26', count: 100 }, function(err, data, response) {
  console.log(data)
})
