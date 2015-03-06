declare('CoreSave', function(require) {
    include('Log');
    include('Assert');
    include('CoreUtils');
    include('Type');
    include('Lzw');
    
    // ---------------------------------------------------------------------------
    // save mapping entry, internal use only
    // ---------------------------------------------------------------------------
    function SaveMapping(host, name) {
        this.host = host;
        this.name = name;
        this.type = type.EnumDataTypeString;
        this.defaultValue = undefined;
        this.isPersistent = false;
        this.saveCallback = false;
        this.loadCallback = false;
        this.resetCallback = false;
        
        // ---------------------------------------------------------------------------
        // setting functions
        // ---------------------------------------------------------------------------
        this.asNumber = function(defaultValue) {
            this.type = type.EnumDataTypeNumber;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asFloat = function(defaultValue) {
            this.type = type.EnumDataTypeFloat;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asBool = function(defaultValue) {
            this.type = type.EnumDataTypeBool;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJson = function(defaultValue) {
            this.type = type.EnumDataTypeJson;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.asJsonArray = function(defaultValue) {
            this.type = type.EnumDataTypeJsonArray;
            if(defaultValue !== undefined) {
                return this.withDefault(defaultValue);
            }
            
            this._updateDefaultByType();
            return this;
        };
        
        this.withDefault = function(value) {
        	assert.isDefined(value);
        	var formattedValue = type.getReadValueByType(value, this.type);
        	assert.isDefined(formattedValue, StrLoc("Default value {0} did not match the selected mapping type {1}").format(value, this.type));
            
            this.defaultValue = type.getReadValueByType(value, this.type);
            this.host[this.name] = value;
            return this;
        };
        
        this.persistent = function(value) {
            if(value !== undefined && value !== true && value !== false) {
                throw new Error(StrLoc("Invalid argument for persistent: {0}").format(value));
            }
            
            this.isPersistent = value || true;
            return this;
        };
        
        this.withCallback = function(saveCallback, loadCallback, resetCallback) {
            this.saveCallback = saveCallback;
            this.loadCallback = loadCallback;
            this.resetCallback = resetCallback;
        };
        
        // ---------------------------------------------------------------------------
        // save functions
        // ---------------------------------------------------------------------------
        this.getKey = function() {
            return this.host.id + '_' + this.name;
        };
        
        this.getValue = function() {
            return this.host[this.name];
        };
        
        this.setValue = function(value) {
        	assert.isDefined(value);
        	var formattedValue = type.getReadValueByType(value, this.type);
        	assert.isDefined(formattedValue, StrLoc("Value {0} did not match the selected mapping type {1}").format(value, this.type));
            this.host[this.name] = formattedValue;
        };
        
        this.resetToDefault = function(ignorePersistent) {
            if(ignorePersistent !== true && this.isPersistent) {
                return;
            }
            
            this.host[this.name] = this.defaultValue;
        };
        
        this.callbackSave = function() {
            if(this.saveCallback === false) {
                return;
            }
            
            if(this.host.onSave === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onSave: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onSave();
        };
        
        this.callbackLoad = function() {
            if(this.loadCallback === false) {
                return;
            }
            
            if(this.host.onLoad === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onLoad: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onLoad();
        };
        
        this.callbackReset = function() {
            if(this.resetCallback === false) {
                return;
            }
            
            if(this.host.onReset === undefined) {
            	log.error(StrLoc("Host declared callback but did not define onReset: {0}").format(this.host.id));
            	return;
            }
            
            this.host.onReset();
        };
        
        // ---------------------------------------------------------------------------
        // internal functions
        // ---------------------------------------------------------------------------
        this._updateDefaultByType = function() {
            this.defaultValue = type.getDefaultValueByType(this.type);
            this.host[this.name] = this.defaultValue;
        };
    };
    
    // ---------------------------------------------------------------------------
    // main save object
    // ---------------------------------------------------------------------------
    function CoreSave() {
        
        this.mappings = [];
        
        this.stateName = "undefined";
        this.stateSlot = 1;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.save = function() {
            var data = {};

            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                var key = mapping.getKey();
                
                var value = undefined;
                try
                {
                	value = type.getWriteValueByType(mapping.getValue(), mapping.type);                	
                } catch(e) {
                	log.error(StrLoc("Could not get write value for {0}").format(key));
                	throw e;
                }
                
                log.debug(StrLoc("SaveMapping: {0} -> {1}").format(key, value));
                data[key] = value;
                
                // Call the callback if present
                mapping.callbackSave();
            }
            
            // compress the save
            var compressedData = lzw.compress(encodeURIComponent(JSON.stringify(data)));

            // Transfer the save into the storage slot
            if(this.doSave(compressedData) === true)
            {
				log.debug(StrLoc("Saved {0}  bytes, now at {1} bytes used").format(compressedData.length, this.doGetSize()));
			} else {
				log.debug(StrLoc("Saving failed!"));
			}
        };

        this.load = function() {
        	var data = {};
            var compressedData = this.doLoad();
            if(compressedData !== undefined) {
            	log.debug(StrLoc("Loaded {0} bytes").format(compressedData.length));
            	data = JSON.parse(decodeURIComponent(lzw.decompress(compressedData)));
            }
            
            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                var key = mapping.getKey();
                
                log.debug(StrLoc("LoadMapping: {0} -> {1}").format(key, data[key]));
                if(data[key] === undefined) {
                    continue;
                }
                
                var value = type.getReadValueByType(data[key], mapping.type);                
                mapping.setValue(value);
                
                mapping.callbackLoad();
            }
            
            log.debug(StrLoc("Loaded {0} bytes").format(this.doGetSize()));
        };
    
        this.reset = function(fullReset) {
            for(var i = 0; i < this.mappings.length; i++) {
                var mapping = this.mappings[i];
                mapping.resetToDefault(fullReset);
                
                mapping.callbackReset();
            }
            
            log.debug(StrLoc("Reset done, full={0}").format(fullReset));
        };
        
        // ---------------------------------------------------------------------------
        // utility functions
        // ---------------------------------------------------------------------------
        this.doLoad = function() { log.error("doLoad not implemented!"); return undefined; };
        this.doSave = function(data) { log.error("doSave not implemented!"); return false; };
        this.doGetSize = function() { log.error("doGetSize not implemented!"); return 0; };
        
        this.getStorageKey = function() {
        	return this.stateName + "_" + this.stateSlot.toString();
        };
        
        this.register = function(host, name) {
            assert.isDefined(host);
            assert.isDefined(host.id, StrLoc("Host needs to have an id for saving state"));
            assert.isDefined(name);
            
            // Clear out the hosts value on register
            host[name] = undefined;
                        
            var mapping = new SaveMapping(host, name);
            this.mappings.push(mapping);
            return mapping;
        };
    }
    
    return {
		create: function() { return new CoreSave(); }
	};
    
});
