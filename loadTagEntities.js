const https = require('https');

var reqParams;
var callback = function (res, err) {
  var data = '';
res.on('error', function (err) {
console.log(err);
})
  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {
    console.log(data)
  });
}

https.get('https://d30ac1dba7a4f1cf5b494f21d11667c0:a9862d7cfd3190ee9432d6d80e576ca0@dev-circle-toronto-hackathon.myshopify.com/admin/products.json', (resp) => {
  let data = '';
  let parsedData;
  let products;
  let tagHash = {};
  let tagArray = [];
  

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    parsedData = JSON.parse(data);

    if (parsedData.hasOwnProperty('products')) {
      products = parsedData.products;
    }

    products.forEach((product, i) => {
      let tags;
      tags = product.tags.split(', ');
      tags.forEach(tag => {
        tagHash[tag] = tagHash.hasOwnProperty(tag) ? tagHash[tag] + 1 : 1;
      })
    });
    for (var tag in tagHash) {
      if (tagHash.hasOwnProperty(tag)) {
        tagArray.push({value:tag,expressions:[tag],metadata:'1'});
      }
    }
    https.request({
      headers: {
        'content-type' : 'application/json',
        "Authorization": "Bearer 6VME2J2N3S4HUQ7ODURGYDHS4YDGRGKN"
      },
      host: 'api.wit.ai',
      path: '/entities/tags',
      method: 'PUT'
    }, callback).end(JSON.stringify({id: 'tags', values: tagArray}));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
