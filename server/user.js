(function () {
  'use strict';

  var cache = [];

  module.exports.findOrCreate = function ({profile}, cb) {
    console.log('findOrCreate profile', profile);
    const u = cache.find(e=>e.id === profile._json.user_id)
    if (!u) {
      cache.push(profile._json);
    }
    cb(null, profile);
  };
}());
