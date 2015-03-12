declare('GameState', function () {
    include('Component');
    include('StaticData');
    include('Save');
    include('SaveKeys');

    GameState.prototype = component.prototype();
    GameState.prototype.$super = parent;
    GameState.prototype.constructor = GameState;

    function GameState() {
        component.construct(this);

        this.id = "GameState";

        this.footmanUpgradesPurchased = 0;
        this.clericUpgradesPurchased = 0;
        this.commanderUpgradesPurchased = 0;
        this.mageUpgradesPurchased = 0;
        this.assassinUpgradesPurchased = 0;
        this.warlockUpgradesPurchased = 0;

        this.clericSpecialUpgradesPurchased = 0;
        this.commanderSpecialUpgradesPurchased = 0;
        this.mageSpecialUpgradesPurchased = 0;
        this.assassinSpecialUpgradesPurchased = 0;
        this.warlockSpecialUpgradesPurchased = 0;

        // Gps reduction when dead
        this.gpsReductionTimeRemaining = 0;
        this.gpsReduction = 0;
    }

    GameState.prototype.componentUpdate = GameState.prototype.update;
    GameState.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    }

    GameState.prototype.save = function() {
        localStorage.footmanUpgradesPurchased = this.footmanUpgradesPurchased;
        localStorage.clericUpgradesPurchased = this.clericUpgradesPurchased;
        localStorage.commanderUpgradesPurchased = this.commanderUpgradesPurchased;
        localStorage.mageUpgradesPurchased = this.mageUpgradesPurchased;
        localStorage.assassinUpgradesPurchased = this.assassinUpgradesPurchased;
        localStorage.warlockUpgradesPurchased = this.warlockUpgradesPurchased;

        localStorage.clericSpecialUpgradesPurchased = this.clericSpecialUpgradesPurchased;
        localStorage.commanderSpecialUpgradesPurchased = this.commanderSpecialUpgradesPurchased;
        localStorage.mageSpecialUpgradesPurchased = this.mageSpecialUpgradesPurchased;
        localStorage.assassinSpecialUpgradesPurchased = this.assassinSpecialUpgradesPurchased;
        localStorage.warlockSpecialUpgradesPurchased = this.warlockSpecialUpgradesPurchased;
    }

    GameState.prototype.load = function() {
        this.footmanUpgradesPurchased = parseInt(localStorage.footmanUpgradesPurchased);
        this.clericUpgradesPurchased = parseInt(localStorage.clericUpgradesPurchased);
        this.commanderUpgradesPurchased = parseInt(localStorage.commanderUpgradesPurchased);
        this.mageUpgradesPurchased = parseInt(localStorage.mageUpgradesPurchased);
        this.assassinUpgradesPurchased = parseInt(localStorage.assassinUpgradesPurchased);
        this.warlockUpgradesPurchased = parseInt(localStorage.warlockUpgradesPurchased);

        if (localStorage.clericSpecialUpgradesPurchased != null) {
            this.clericSpecialUpgradesPurchased = localStorage.clericSpecialUpgradesPurchased;
        }
        if (localStorage.commanderSpecialUpgradesPurchased != null) {
            this.commanderSpecialUpgradesPurchased = localStorage.commanderSpecialUpgradesPurchased;
        }
        if (localStorage.mageSpecialUpgradesPurchased != null) {
            this.mageSpecialUpgradesPurchased = localStorage.mageSpecialUpgradesPurchased;
        }
        if (localStorage.assassinSpecialUpgradesPurchased != null) {
            this.assassinSpecialUpgradesPurchased = localStorage.assassinSpecialUpgradesPurchased;
        }
        else if (localStorage.thiefSpecialUpgradesPurchased != null) {
            this.assassinSpecialUpgradesPurchased = localStorage.thiefSpecialUpgradesPurchased;
        }
        if (localStorage.warlockSpecialUpgradesPurchased != null) {
            this.warlockSpecialUpgradesPurchased = localStorage.warlockSpecialUpgradesPurchased;
        }
    }

    return new GameState();
});