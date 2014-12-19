var loader = new Loader();
declare = function(name, content) { loader.declare(name, content); };
include = function(name) { return loader.include(name); };

/** @constructor */
function Loader(nameSpace) {
	
	this.instances = {};
	this.declarations = {};
	this.refCount = {};
		
	this.include = function(name) {
		if(name === undefined || typeof(name) == "function") {
			// JQuery has a tendency to callback an include with a function
			//  Not sure why yet so just throwing it for now...
			throw "Invalid arguments for include!";
		}
		
		if(this.instances[name] === undefined) {
			if(this.declarations[name] === undefined) {
				throw "No declaration for include " + name;				
			}
			
			// Special case for jQuery, we don't call new
			if(name === '$') {
				this.instances[name] = this.declarations[name](this.include);
			} else {
				this.instances[name] = new this.declarations[name](this.include);				
			}
		}
		
		if(this.refCount[name] === undefined) {
			this.refCount[name] = 0;
		}
		
		this.refCount[name]++;
		
		// return the instance
		return this.instances[name];
	};
	
	this.declare = function(name, content) {
		if(this.declarations[name] !== undefined) {
			throw name + " was already declared!";
		}
		
		this.declarations[name] = content;
	};
	
	this.diagnostics = function() {
		var declarationKeys = "";
		for(var key in this.declarations) {
			declarationKeys += " " + key;
		}
		
		console.log("Declarations: " + declarationKeys);
		
		var instanceKeys = "";
		for(var key in this.instances) {
			instanceKeys += " " + key;
		}
		
		console.log("Instances: " + this.instances);
	};
};