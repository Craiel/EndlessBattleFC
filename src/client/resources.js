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

            this.ImageNull = static.imageRoot + "NULL.png";
            this.ImageAttackButtons = static.imageRoot + "attackButtons.png";
            this.ImageStoneButtons = static.imageRoot + "stoneButton1.png";
            this.ImageBattleLevelButton = static.imageRoot + "battleLevelButton.png";
            this.ImageBuffIcons = static.imageRoot + "buffIcons.png";
            this.ImageItemSheet3 = static.imageRoot + "itemSheet3.png";
            this.ImageWindowButtons = static.imageRoot + "windowButtons.png";
            this.ImageBigIcons = static.imageRoot + "bigIcons.png";
            this.ImageBuyButtonBase = static.imageRoot + "buyButtonBase.png";
            this.ImageCloseButton = static.imageRoot + "closeButton.png";
        };

        this.getImageUrl = function(imagePath) {
            return 'url("' + imagePath + '")';
        };
    };
    
    return new Resources();
});

