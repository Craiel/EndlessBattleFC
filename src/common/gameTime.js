declare("GameTime", function() {
    include("Assert");
    
    var timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    
    // ---------------------------------------------------------------------------
    // statistic object
    // ---------------------------------------------------------------------------
    function GameTime() {
        
    	this.start = undefined;
    	this.current = undefined;
    	this.currentLocale = undefined;
    	this.elapsed = undefined;
    	
        // ---------------------------------------------------------------------------
        // game time functions
        // ---------------------------------------------------------------------------
        this.update = function() {        	
        	this.current = Date.now();
        	this.currentLocale = this.current - timeZoneOffset;
        	this.elapsed = this.current - this.start;
        	
        	assert.isTrue(this.current >= this.start, StrLoc("GameTime may not be initialized properly!"));
        };
        
        this.reset = function() {
        	this.start = Date.now();        	
        	this.update();
        };
        
        this.getTime = function(useLocalTime) {
        	if (useLocalTime === true) {
        		return this.currentLocale;
        	}
        	
        	return this.current;
        };
        
        this.getElapsed = function() {
        	return this.elapsed;
        };
        
        this.getElapsedSinceUpdate = function() {
        	return Date.now() - this.current;
        };
        
        this.getStartTime = function() {
        	return this.start;
        };
    };
    
    return {
        create: function() {
        	// We make sure game time is always initialized
        	var time = new GameTime();
        	time.reset();
        	return time; 
        }
    };
});
