# BBB-pin
Simple library for Beaglebone Black gpio

# Example
var gpio = require('bbb-pin');
var pins = gpio.pins;

var watch = gpio.watch([pins.P8_10, pins.P8_12]);

watch.on('change', function (pin, newValue) {
  console.log('change', pin, newValue);
});
