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

    }

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    Generator.prototype.getRandomPrimaryStat = function() {
        return coreUtils.pickRandomProperty(statUtils.primaryStats);
    }

    Generator.prototype.getRandomSecondaryStat = function() {
        return coreUtils.pickRandomProperty(statUtils.secondaryStats);
    }

    var surrogate = function(){};
    surrogate.prototype = Generator.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Generator.call(self); },
        create: function() { return new Generator(); }
    }

});