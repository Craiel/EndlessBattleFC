// set the main namespace
Crystal = {
		isDebug: false,
        componentUpdateList: [],
        componentUpdateCount: 0,
        componentInitCount: 0,
        resetFrame: function() {
            Crystal.componentUpdateList = [];
            Crystal.componentUpdateCount = 0;
        }
};

var StrLoc = function(str) {
	return str;
};

// #IfDebug
Crystal.isDebug = true;
// #EndIf

declare("$", jQuery);
