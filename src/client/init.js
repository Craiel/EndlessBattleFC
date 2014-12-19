// set the main namespace
Endless = {
		isDebug: false,
        componentUpdateList: [],
        componentUpdateCount: 0,
        componentInitCount: 0,
        resetFrame: function() {
            Endless.componentUpdateList = [];
            Endless.componentUpdateCount = 0;
        }
};

var StrLoc = function(str) {
	return str;
};

// #IfDebug
Endless.isDebug = true;
// #EndIf

declare("$", jQuery);
