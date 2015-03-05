declare('Save', function() {
    include('Log');
    include('CoreSave');
    
    Save.prototype = coreSave.create();
    Save.prototype.$super = parent;
    Save.prototype.constructor = Save;
    
    // ---------------------------------------------------------------------------
    // main save object
    // ---------------------------------------------------------------------------
    function Save() {
                
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.doSave = function(data) {			
        	var storageKey = this.getStorageKey();
        	localStorage[storageKey] = data;
        	return true;
		};
		
		this.doLoad = function() {
			var storageKey = this.getStorageKey();
			return localStorage[storageKey];
		};
        
        // ---------------------------------------------------------------------------
        // utility functions
        // ---------------------------------------------------------------------------
        this.getLocalStorageSize = function() {
            var size = 3072; // General overhead for localstorage is around 3kb
            for(var entry in localStorage) {
                size += (entry.length + localStorage[entry].length) * 16;
            }
            
            return size;
        };
        
        this.debugLocalStorage = function() {
            for(var entry in localStorage) {
                log.debug(entry + ": " + localStorage[entry].length);
            }
        };
    }
    
    return new Save();
    
});
