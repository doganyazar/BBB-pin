'use strict';

var pins = require('./pins.js');
var util = require('util');
var fs = require('fs');
var child_process = require('child_process');
var exec = child_process.exec;
var events = require("events");


function getPinPath(pin) {
  return util.format('/sys/class/gpio/gpio%d/value', pin.id);
}

var modes = {
  in: 'in',
  out: 'out',
  high: 'hi',
  low: 'low'
};

function Watch(pin) {
  this.pin = pin;
  var pinFile = getPinPath(pin);
  console.log(pinFile);
  fs.watchFile(pinFile, function (curr, prev) {
    console.log('the current is: ' + curr);
    console.log('the previous was: ' + prev);
  });

  events.EventEmitter.call(this);
}
util.inherits(Watch, events.EventEmitter);

function Gpio() {
  this.modes = modes;
  this.pins = pins;
};

Gpio.prototype.set = function set(pin, value, cb) {
  var command = util.format('config-pin %s %s', pin.name, value);
  exec(command, function (error, stdout, stderr) {
    if (stderr) {
      console.log('stderr: ' + stderr);
    }

    cb(error);
  });
}

Gpio.prototype.get = function get(pin, cb) {
  fs.readFile(getPinPath(pin), function (err, data) {
    if (err) throw err;
    return cb(null, parseInt(data));
  });
}

Gpio.prototype.watch = function watch(pin) {
  return new Watch(pin);
}


module.exports = new Gpio();


if (module === require.main) {
  console.log('BOOOYA');
  var gpio = module.exports;
  gpio.watch(pins.P8_14);
}
