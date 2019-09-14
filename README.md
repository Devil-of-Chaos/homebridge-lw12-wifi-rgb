# homebridge-lw12-rgb-ledstrip

Homebridge Plugin for Lagute LW-12 Wifi LED Strip Controller (https://www.amazon.de/gp/product/B00GMAS7U2)

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g git+https://github.com/Devil-of-Chaos/homebridge-lw12-wifi-rgb.git
3. Update your configuration file.

# Configuration

Configuration sample file:

 ```
 
"accessories": [
		{
		    "accessory": "lw12-rgb",
		    "name": "Living Room",
		    "host": "192.168.1.110",
		    "port": 5000,
		    "debug": false
		},
]

```
