declare("Assert", function() {

    function Assert() {
        this.isDefined = function(arg, msg) {
            if(Endless.isDebug === false){
                return;
            }
            
            console.assert(arg !== undefined, msg);
        };
        
        this.isUndefined = function(arg, msg) {
            if(Endless.isDebug === false){
                return;
            }
            
            console.assert(arg === undefined, msg);
        };
        
        this.isTrue = function(eval, msg) {
            if(Endless.isDebug === false){
                return;
            }
            
            console.assert(eval === true, msg);
        };
        
        this.isFalse = function(eval, msg) {
            if(Endless.isDebug === false){
                return;
            }
            
            console.assert(eval === false, msg);
        };
        
        this.isNumber = function(arg, msg) {
            if($.isNumeric(arg)) {
                return;
            }
            
            console.assert(false, msg);
        };
    }
    
    return new Assert();
    
});