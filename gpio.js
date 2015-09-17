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
}

util.inherits(Watch, events.EventEmitter);
function Watch(pins) {
  this.pins = pins;
  this.watchers = [];
  var self = this;
  function listen(pin, value) {
      self.emit('change', pin, value);
  }
  this.watch = pins.forEach(function(pin) {
    self.watchPin(pin, listen);
  });

  events.EventEmitter.call(this);
}

Watch.prototype.close = function close() {
  this.watchers.forEach(function(watcher) {
    watcher.close();
  });
}

Watch.prototype.watchPin = function watchPin(pin, cb) {
  var self = this;

  gpio.get(pin, function(err, value) {
    if (err) throw err;
    self.value = value;

    var fswatch = fs.watch(util.format('/sys/class/gpio/gpio%d/direction', pin.id), function (event, filename) {
      gpio.get(pin, function(err, value) {
        if (err) throw err;

        if (value !== self.value) {
          self.value = value;
          return cb(pin, value);
        }
      })
    });
    self.watchers.push(fswatch);
  });
}

function Gpio() {
  this.modes = modes;
  this.pins = pins;
};

Gpio.prototype.watch = function watch(pins) {
  return new Watch(this, pins);
}

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

var gpio = new Gpio();

module.exports = gpio;


if (module === require.main) {
  console.log('BOOOYA');
  var gpio = module.exports;
  var watch = gpio.watch([pins.P8_10, pins.P8_12]);

  watch.on('change', function () {
    console.log('change', arguments)
  });

  setTimeout(function() {
    watch.close();
  }, 10000);
}
