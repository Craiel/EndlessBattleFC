//This will implement isArray if its not there, older browsers don't have it
if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.toString.call(obj) === '[object Array]';
    };
};

// Implement format for string
String.prototype.format = function() {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var key = '{' + i.toString() + '}';
		if(formatted.indexOf(key) < 0) {
			throw new Exeption(StrLoc("Index {0} was not defined in string: {1}").format(i, formatted));
		}
		
    	formatted = formatted.replace(key, arguments[i]);
	}
	
	return formatted;
};
