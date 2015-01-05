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

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t, ab
    s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var StrLoc = function(str) {
	return str;
};

// #IfDebug
Endless.isDebug = true;
// #EndIf

declare("$", jQuery);
