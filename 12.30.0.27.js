// SneakyBoots Example Signer Updated By BaqqyClothes
// This needs some modification for larger scale i will update my research later.

var express = require('express');

var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

var Instance;

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16).toUpperCase();
    });
}
var DeviceToken;
app.post('/sign', function (req, res) {
  var ReqToken = req.body.e;
  var Path = req.body.v;
  DeviceToken = req.body.t;
  Java.perform(function () {
    try {
		res.status(200).json({"headers":{
			"x-snapchat-att": String(Instance.a.overload('java.lang.String', 'java.lang.String').call(Instance, ReqToken, Path).get("x-snapchat-att")), // Only return this so we can use in https://github.com/jsnapopensource/SnapchatLib later.....
        }});
		res.end();
    } catch (err) {
	  console.log(err);
      res.status(500).send("Error");
      res.end();
    }
  });
});

//To Compile: node compile.js -o compileme.js signing.js
//---- Start of Frida Code

var server = app.listen(1337, function () {
  Java.perform(function x() {
    var sneakyboots = Java.use("gWe"); //[attestation] SCArgosServiceImpl

	// TODO figure out spoofing in realtime to reload libary. Example Below


	/* Utilities

var RANDOM = function() {};

function _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _randomHex(len) {
    var hex = '0123456789abcdef';
    var output = '';
    for (var i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
}

function _pad(n, width) {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
}

function _randomPaddedInt(length) {
    return _pad(_randomInt(0, Math.pow(10, length)), length);
}

function _luhn_getcheck(code) {
    code = String(code).concat("0");
    var len = code.length;
    var parity = len % 2;
    var sum = 0;
    for (var i = len - 1; i >= 0; i--) {
        var d = parseInt(code.charAt(i))
        if (i % 2 == parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    var checksum = sum % 10;
    return checksum == 0 ? 0 : 10 - checksum;
}

function _luhn_verify(code) {
    code = String(code);
    var len = code.length;
    var parity = len % 2;
    var sum = 0;
    for (var i = len - 1; i >= 0; i--) {
        var d = parseInt(code.charAt(i))
        if (i % 2 == parity) {
            d *= 2;
        }
        if (d > 9) {
            d -= 9;
        }
        sum += d;
    }
    return sum % 10 == 0;
}


function spoofAndroidID(android_id) {
    if (android_id == RANDOM) {
        android_id = _randomHex(16);
    } else if (android_id !== null) {
        android_id = String(android_id).toLowerCase();
        if (! android_id.match(/^[0-9a-f]{16}$/)) {
            throw new Error("Invalid Android ID value");
        }
    }
    var ss = Java.use("android.provider.Settings$Secure");
    ss.getString.overload("android.content.ContentResolver", "java.lang.String").implementation = function(context, param) {
        if (param == ss.ANDROID_ID.value) {
            return android_id;
        } else {
            return this.getString(context, param);
        }
    }
}

function spoofPhone(phone) {
    if (phone === RANDOM) {
        phone = _randomPaddedInt(10);
    } else if (phone !== null) {
        phone = String(phone);
        if (! phone.match(/^[0-9]{1,15}$/)) {
            throw new Error("Invalid phone number");
        }
    }
    var tm = Java.use("android.telephony.TelephonyManager");
    tm.getLine1Number.overload().implementation = function() {
        return phone;
    }
}

function spoofIMEI(imei) {
    if (imei === RANDOM) {
        imei = _randomPaddedInt(14);
        imei = imei.concat(_luhn_getcheck(imei));
    } else if (imei !== null) {
        imei = String(imei);
        if (! imei.match(/^[0-9]{15}$/)) {
            throw new Error("Invalid IMEI value");
        }
        if (! _luhn_verify(imei)) {
            console.warn("IMEI has an invalid check digit");
        }
    }
    var tm = Java.use("android.telephony.TelephonyManager");
    tm.getDeviceId.overload().implementation = function() {
        return imei;
    }
    tm.getDeviceId.overload("int").implementation = function(slotIndex) {
        return imei;
    }
    tm.getImei.overload().implementation = function() {
        return imei;
    }
    tm.getImei.overload("int").implementation = function(slotIndex) {
        return imei;
    }
}

function spoofIMSI(imsi) {
    if (imsi == RANDOM) {
        imsi = _randomPaddedInt(15);
    } else if (imsi !== null) {
        imsi = String(imsi);
        if (! imsi.match(/^[0-9]{14,15}$/)) {
            throw new Error("Invalid IMSI value");
        }
    }
    var tm = Java.use("android.telephony.TelephonyManager");
    tm.getSubscriberId.overload().implementation = function() {
        return imsi;
    }
}

function spoofICCID(iccid) {
    if (iccid == RANDOM) {
        iccid = "89".concat(_randomPaddedInt(16));
        iccid = iccid.concat(_luhn_getcheck(iccid));
    } else if (iccid !== null) {
        iccid = String(iccid);
        if (! iccid.match(/^[0-9]{19,20}$/)) {
            throw new Error("Invalid ICCID value");
        }
        if (! _luhn_verify(iccid)) {
            console.warn("ICCID has an invalid check digit");
        }
    }
    var tm = Java.use("android.telephony.TelephonyManager");
    tm.getSimSerialNumber.overload().implementation = function() {
        return iccid;
    }
}

function spoofMAC(mac) {
    if (mac == RANDOM) {
        mac = [];
        for (var i = 0; i < 6; i++) {
            mac.push(_randomInt(0, 255));
        }
        mac = Java.array("byte", mac);
    } else if (mac !== null) {
        var mac_str = String(mac).toUpperCase();
        if (! mac_str.match(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/)) {
            throw new Error("Invalid MAC address value");
        }
        mac = [];
        var mac_arr = mac_str.split(":");
        for (var i = 0; i < 6; i++) {
            mac.push(parseInt(mac_arr[i], 16));
        }
        mac = Java.array("byte", mac);
    }
    var ni = Java.use("java.net.NetworkInterface");
    ni.getHardwareAddress.overload().implementation = function() {
        return mac;
    }
}

function hideGSFID(gsf_id) {
    var cr = Java.use("android.content.ContentResolver");
    cr.query.overload("android.net.Uri", "[Ljava.lang.String;", "android.os.Bundle", "android.os.CancellationSignal").implementation = function(uri, projection, queryArgs, cancellationSignal) {
        var qres = this.query(uri, projection, queryArgs, cancellationSignal);
        if (uri.toString() == "content://com.google.android.gsf.gservices") {
            qres = null;
        }
        return qres;
    }
    cr.query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String", "android.os.CancellationSignal").implementation = function(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal) {
        var qres = this.query(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal);
        if (uri.toString() == "content://com.google.android.gsf.gservices") {
            qres = null;
        }
        return qres;
    }
    cr.query.overload("android.net.Uri", "[Ljava.lang.String;", "java.lang.String", "[Ljava.lang.String;", "java.lang.String").implementation = function(uri, projection, selection, selectionArgs, sortOrder) {
        var qres = this.query(uri, projection, selection, selectionArgs, sortOrder);
        if (uri.toString() == "content://com.google.android.gsf.gservices") {
            qres = null;
        }
        return qres;
    }
}

Java.perform(function () {
    spoofMAC(RANDOM);
    spoofICCID(RANDOM);
    spoofIMSI(RANDOM);
    spoofAndroidID(RANDOM);
    spoofIMEI(RANDOM);
    spoofPhone(RANDOM);
    hideGSFID();
});

 */
 
    sneakyboots.a.overload('java.lang.String', 'java.lang.String').implementation = function (str, str2) {
      var ret_value = this.a.overload('java.lang.String', 'java.lang.String').call(this, str, str2);
      Instance = this;
      SCPluginWrapper.a.implementation = null;
      return ret_value;
    };
	}); //---- End of Frida Code
	
	// Example way to hijack and reload lib to change data. (Untested / Unfinished) (Credits to JSnapOpenSource Research)
	//var System = Java.use('java.lang.System');
	//var Runtime = Java.use('java.lang.Runtime');
	//var SystemLoad_2 = System.loadLibrary.overload('java.lang.String');
   // var VMStack = Java.use('dalvik.system.VMStack');
	//Runtime.getRuntime().loadLibrary0(loader, "scplugin");
	//Java.perform(function x() {
    var System = Java.use('java.lang.System');
    var Runtime = Java.use('java.lang.Runtime');
    var SystemLoad_2 = System.loadLibrary.overload('java.lang.String');
    var VMStack = Java.use('dalvik.system.VMStack');
	SystemLoad_2.implementation = function (library) {
      console.log("Loading dynamic library => " + library);

      try {
        var loaded = Runtime.getRuntime().loadLibrary0(VMStack.getCallingClassLoader(), library);

        if (library === 'scplugin') {
          console.log("lib called hooking");
          loader = VMStack.getCallingClassLoader();
        }

        return loaded;
      } catch (ex) {
        console.log(ex);
      }
    };
	}); //---- End of Frida Code
	
	Java.perform(function x() {
		var DeviceTokenClass = Java.use("ge.g");

		DeviceTokenClass.a.implementation = function () {
			    console.log(String(DeviceToken)); 
				return String(DeviceToken); // Here you want to inject a dtoken1i later to hide your device (I haven't implemented yet feel free to contribute)
		};
	}); //---- End of Frida Code
	Java.perform(function x() {
	// We return 0 here to avoid flags.....
	
	var sneakyboots = Java.use("op.ntuq");

    sneakyboots.a.implementation = function () {
      return 0; //return 0 any higher value == a flag in lib
    };
	}); //---- End of Frida Code
	  
	Java.perform(function x() {
	// We return 0 here to avoid flags.....
	
	var sneakyboots = Java.use("op.ntuq");

    sneakyboots.a.implementation = function () {
      return 0; //return 0 any higher value == a flag in lib
    };
  }); //---- End of Frida Code
  console.log('Server is listening');
});