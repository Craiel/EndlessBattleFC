declare("Component", function() {
    include("Assert");
    
    if(Crystal.isDebug === true) {
        idCheck = {};
    }
    
    function Component() {
        this.initDone = false;
        this.updateTime = undefined;
        this.updateInterval = 0;
        
        this.enabled = true;
        this.invalidated = true;
        this.updateWhenNeededOnly = false;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function() {
            assert.isDefined(this.id, StrLoc("Component needs valid Id"));
            
            if(Crystal.isDebug === true) {
                assert.isUndefined(idCheck[this.id], StrLoc("Duplicate ID: {0}").format(this.id));
                idCheck[this.id] = true;
            }
            
            Crystal.componentInitCount++;
            
            this.initDone = true;
        };
        
        this.update = function(currentTime) {
            assert.isTrue(this.initDone, StrLoc("Init must be called before update!"));
            
            if(this.enabled === false) {
                return false;
            }
            
            // If we don't need an update and we are only allowed to update then bail out
            if(this.invalidated === false && this.updateWhenNeededOnly === true) {
                return false;
            }
            
            // If we don't need an update and we are updating in intervals and our interval is not yet up, bail out
            if(this.invalidated === false && this.updateInterval > 0 && currentTime.getElapsed() < this.updateInterval) {
                return false;
            }
            
            Crystal.componentUpdateList.push(this.id);
            Crystal.componentUpdateCount++;
            
            this.updateTime = currentTime.getTime();
            this.invalidated = false;
            return true;
        };
        
        this.remove = function() {
            if(Crystal.isDebug) {
                delete idCheck[this.id];
            }
        };
        
        this.invalidate = function() {
            this.invalidated = true;
        };
    }
    
    return {
        create: function() { return new Component(); }
    };
    
});