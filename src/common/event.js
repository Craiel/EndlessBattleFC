declare("Event", function() {
	
    function EventAggregate() {
        
        this.subscribers = {};
        
        this.subscribe = function(event, callback) {
            assert.isDefined(event);
            assert.isDefined(callback);
            
            if(!this.subscribers[event]) {
                this.subscribers[event] = [];
            }
            
            if($.inArray(this.subscribers[event], callback) != -1) {
                this.subscribers[event].push(callback);
            }
        };
        
        this.publish = function(event, parameter) {
            if(this.subscribers[event] === undefined) {
                return;
            }
            
            for(var i = 0; i < this.subscribers[event].length; i++) {
                this.subscribers[event][i](parameter);
            };
        };
    };
    
    return new EventAggregate();
});

