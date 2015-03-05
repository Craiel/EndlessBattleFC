declare('GameState', function () {
    include('Component');
    include('Static');
    include('Save');
    include('SaveKeys');

    GameState.prototype = component.create();
    GameState.prototype.$super = parent;
    GameState.prototype.constructor = GameState;

    function GameState() {
        this.id = "GameState";

        //save.register(this, saveKeys.idnMercenariesPurchased).asJson().withDefault({static.MERCENARIES.})


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

        // The amount of gps mercenaries will give without any buffs
        this.footmanGps = static.baseFootmanGps;
        this.clericGps = static.baseClericGps;
        this.commanderGps = static.baseCommanderGps;
        this.mageGps = static.baseMageGps;
        this.assassinGps = static.baseAssassinGps;
        this.warlockGps = static.baseWarlockGps;

        // Current prices of mercenaries and how many of each the player owns
        this.footmanPrice = static.baseFootmanPrice;
        this.footmenOwned = 0;
        this.clericPrice = static.baseClericPrice;
        this.clericsOwned = 0;
        this.commanderPrice = static.baseCommanderPrice;
        this.commandersOwned = 0;
        this.magePrice = static.baseMagePrice;
        this.magesOwned = 0;
        this.assassinPrice = static.baseAssassinPrice;
        this.assassinsOwned = 0;
        this.warlockPrice = static.baseWarlockPrice;
        this.warlocksOwned = 0;

        // Gps reduction when dead
        this.gpsReductionTimeRemaining = 0;
        this.gpsReduction = 0;

        this.componentUpdate = this.update;

        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            return true;
        }

        this.save = function() {
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

            localStorage.footmenOwned = this.footmenOwned;
            localStorage.clericsOwned = this.clericsOwned;
            localStorage.commandersOwned = this.commandersOwned;
            localStorage.magesOwned = this.magesOwned;
            localStorage.assassinsOwned = this.assassinsOwned;
            localStorage.warlocksOwned = this.warlocksOwned;
        }

        this.load = function() {
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

            this.footmenOwned = parseInt(localStorage.footmenOwned);
            this.clericsOwned = parseInt(localStorage.clericsOwned);
            this.commandersOwned = parseInt(localStorage.commandersOwned);
            this.magesOwned = parseInt(localStorage.magesOwned);
            this.assassinsOwned = parseInt(localStorage.assassinsOwned);
            this.warlocksOwned = parseInt(localStorage.warlocksOwned);

            this.footmanPrice = Math.floor(static.baseFootmanPrice * Math.pow(1.15, this.footmenOwned));
            this.clericPrice = Math.floor(static.baseClericPrice * Math.pow(1.15, this.clericsOwned));
            this.commanderPrice = Math.floor(static.baseCommanderPrice * Math.pow(1.15, this.commandersOwned));
            this.magePrice = Math.floor(static.baseMagePrice * Math.pow(1.15, this.magesOwned));
            this.assassinPrice = Math.floor(static.baseAssassinPrice * Math.pow(1.15, this.assassinsOwned));
            this.warlockPrice = Math.floor(static.baseWarlockPrice * Math.pow(1.15, this.warlocksOwned));
        }
    }

    return new GameState();
});