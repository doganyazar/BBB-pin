'use strict'

var test = require('tape');
var fs = require('fs');
var gpio = require('../gpio.js');
var modes = gpio.modes;
var pins = gpio.pins;

test('set/get', function (t) {
  t.plan(7);
  t.timeoutAfter(1000);

  gpio.set(pins.P8_12, modes.in, function (err) {
    t.error(err);
    gpio.set(pins.P8_12, modes.high, function (err) {
      t.error(err);

      gpio.get(pins.P8_12, function (err, value) {
        t.error(err);
        t.equal(value, 1);

        gpio.set(pins.P8_12, modes.low, function (err) {
          t.error(err);

          gpio.get(pins.P8_12, function (err, value) {
            t.error(err);
            t.equal(value, 0);
          });
        });
      })
    })
  });
});
