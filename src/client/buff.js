declare("Buff", function () {

    function Buff(name, type, multiplier, duration, leftPos, topPos) {
        this.id = null;
        this.name = name;
        this.type = type;
        this.multiplier = multiplier;
        this.currentDuration = duration * 1000;
        this.maxDuration = duration * 1000;
        this.leftPos = leftPos;
        this.topPos = topPos;
    }

    return {
        create: function(name, type, multiplier, duration, leftPos, topPos) { return new Buff(name, type, multiplier, duration, leftPos, topPos); }
    }
});