declare("Resources", function() {
	include("Static");
	include("Component");

	Resources.prototype = component.create();
    Resources.prototype.$super = parent;
    Resources.prototype.constructor = Resources;
    
    function Resources() {
        this.id = 'Resources';
        
        this.componentInit = this.init;
        
        // ---------------------------------------------------------------------------
    	// component functions
    	// ---------------------------------------------------------------------------	
        this.init = function() {
        	this.componentInit();

            // Todo
        	// this.ImageStartBackground = static.imageRoot + "TitleScreen.png";
        };
    };
    
    return new Resources();
});

