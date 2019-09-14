var dgram = require('dgram');

module.exports = function (host, port, debug) {
	var module = {};

	module.host = host;
	module.port = port;
	module.debug = debug;
	module.color = { H: 0, S: 0, V: 100 }
	module.powerState = false;
	module.lastHex = null;

	module.getPowerState = function () {
		return module.powerState;
	}
	
	module.setPowerState = function (state, callback) {
		var onMessage = '7e040401ffffff00ef';
		var offMessage = '7e040400ffffff00ef';
		if (module.powerState != state){
			sendHexString(state ? onMessage : offMessage, function(success) {
				if (success) {
					module.powerState = state;
				}
				callback(true);
			});
		} else {
			callback(true);
		}
	};

	module.getBrightness = function() {
		return module.color.V;
	}

	module.setBrightness = function (value, callback) {
		module.color.V = value;
		setColor(callback);
	};

	module.getHue = function() {
		return module.color.H;
	}

	module.setHue = function (value, callback) {
		module.color.H = value;
		setColor(callback);
	};

	module.getSaturation = function() {
		return module.color.S;
	}

	module.setSaturation = function (value, callback) {
		module.color.S = value;
		setColor(callback);
	};

	function setColor(callback) {
		var rgb = hsv2rgb(module.color.H, module.color.S, module.color.V);
		var hexString = '7e070503' + decimalToHex(rgb.r, 2) + decimalToHex(rgb.g, 2) + decimalToHex(rgb.b, 2) + '00ef';
		if (module.lastHex != hexString){
			sendHexString(hexString, function(success) {
				module.lastHex = hexString;
				callback(success);
			});
		} else {
			callback(true);
		}
	}
	
	function sendHexString(hexMessage, callback) {
		var message = new Buffer(hexMessage, 'hex')
		var client = dgram.createSocket('udp4');

		client.send(message, 0, message.length, module.port, module.host, function(err, bytes) {
			if (err) {
				callback(false)
				if (module.debug === true) console.log('UDP ERROR ' + module.host +':'+ module.port);
			} else {
				if (module.debug === true) console.log('UDP message ' + hexMessage + ' sent to ' + module.host +':'+ module.port);
				client.close();
				callback(true);
			}
		});
	}
	

	function decimalToHex(d, padding) {
		var hex = Number(d).toString(16);
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
		while (hex.length < padding) {
			hex = "0" + hex;
		}
		return hex;
	}

	function hsv2rgb (h, s, v) {
		var r, g, b, i, f, p, q, t;

		 h /= 360;
		 s /= 100;
		 v /= 100;

		 i = Math.floor(h * 6);
		 f = h * 6 - i;
		 p = v * (1 - s);
		 q = v * (1 - f * s);
		 t = v * (1 - (1 - f) * s);
		 switch (i % 6) {
			 case 0: r = v; g = t; b = p; break;
			 case 1: r = q; g = v; b = p; break;
			 case 2: r = p; g = v; b = t; break;
			 case 3: r = p; g = q; b = v; break;
			 case 4: r = t; g = p; b = v; break;
			 case 5: r = v; g = p; b = q; break;
		}
		var rgb = { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
		return rgb;
	}
	
	return module;
};
