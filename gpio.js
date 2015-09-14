'use strict';

var pins = require('./pins.js');

var util = require('util');
var fs = require('fs');
var async = require('async');

function getPinPath(pin) {
  return util.format('/sys/class/gpio/gpio%d/value', pin.id);
}

function Gpio {

};

{P8.10: 'in'}

Gpio.prototype.set = function set(pinSet) {
  Object.keys(pinSet).forEach(function(key) {
    var setValue = pinSet[key]; //gpio, in, out, spi, ...

  });

  async.forEach()
}

Gpio.prototype.get = function get(pin, cb) {
  fs.readFile(getPinPath(pin), function (err, data) {
    if (err) throw err;
    return cb(null, parseInt(data));
  });
}
