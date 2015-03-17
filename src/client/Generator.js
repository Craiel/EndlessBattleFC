declare('Generator', function () {
    include('Log');
    include('Assert');
    include('Data');
    include('Component');
    include('CoreUtils');
    include('StatUtils');

    Generator.prototype = component.prototype();
    Generator.prototype.$super = parent;
    Generator.prototype.constructor = Generator;

    function Generator() {
        component.construct(this);

        this.rarityList = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Generator.prototype.componentInit = Generator.prototype.init;
    Generator.prototype.init = function() {
        this.componentInit();

    };

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    Generator.prototype.getRandomPrimaryStat = function() {
        return coreUtils.pickRandomProperty(statUtils.primaryStats);
    };

    Generator.prototype.getRandomSecondaryStat = function() {
        return coreUtils.pickRandomProperty(statUtils.secondaryStats);
    };

    Generator.prototype.getStatValue = function(level, multiplier) {
        if(level < 1) {
            return 1;
        }

        return Math.floor(coreUtils.getSigma(level) * Math.pow(multiplier, level));
    };

    Generator.prototype.getMultiplierStatValue = function() {
        var precision = 1000;
        return Math.floor(coreUtils.getRandom(1.01, 1.1) * precision) / precision;
    };

    var surrogate = function(){};
    surrogate.prototype = Generator.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Generator.call(self); },
        create: function() { return new Generator(); }
    }

});