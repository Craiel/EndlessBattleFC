declare('Generator', function () {
    include('Log');
    include('Assert');
    include('Data');
    include('Component');
    include('CoreUtils');
    include('StatUtils');

    Generator.prototype = component.create();
    Generator.prototype.$super = parent;
    Generator.prototype.constructor = Generator;

    function Generator() {

        this.rarityList = [];

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

        }

        // ---------------------------------------------------------------------------
        // monster functions
        // ---------------------------------------------------------------------------
        this.getRandomPrimaryStat = function() {
            return coreUtils.pickRandomProperty(statUtils.primaryStats);
        }

        this.getRandomSecondaryStat = function() {
            return coreUtils.pickRandomProperty(statUtils.secondaryStats);
        }

        this.sigma = function(number) {
            return (number*(number+1))/2;
        }
    }

    return {
        create: function() { return new Generator(); }
    }

});