declare("MercenaryManager", function () {
    include('Component');
    include('Static');
    include('GameState');
    include('Mercenary');
    include('Data');
    include('Save');
    include('SaveKeys');

    MercenaryManager.prototype = component.create();
    MercenaryManager.prototype.$super = parent;
    MercenaryManager.prototype.constructor = MercenaryManager;

    function MercenaryManager() {
        this.id = "MercenaryManager";

        save.register(this, saveKeys.idnMercenaryUpdateTime).asNumber().withDefault(0);

        // The interval at which mercenary income is updated
        this.gpsUpdateDelay = 1000;

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if (this.componentUpdate(gameTime) !== true) {
                return false;
            }

            this.processMercenaryIncome(gameTime);

            this.legacyUpdate(gameTime);

            return true;
        }

        // ---------------------------------------------------------------------------
        // mercenary functions
        // ---------------------------------------------------------------------------
        this.processMercenaryIncome = function(gameTime) {
            if(this[saveKeys.idnMercenaryUpdateTime] === 0) {
                this[saveKeys.idnMercenaryUpdateTime] = gameTime.current;
                return;
            }

            var incomeCount = Math.floor((gameTime.current - this[saveKeys.idnMercenaryUpdateTime]) / this.gpsUpdateDelay);
            if(incomeCount <= 0) {
                return;
            }

            var income = incomeCount * this.getGps();
            game.player.modifyStat(data.StatDefinition.gold.id, income);
            game.stats.goldFromMercenaries += income;
            this[saveKeys.idnMercenaryUpdateTime] = gameTime.current;
        }
















        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Unchecked code below
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // All the mercenaries the player owns
        this.mercenaries = new Array();

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            document.getElementById("footmanCost").innerHTML = gameState.footmanPrice.formatMoney(0);
            document.getElementById("clericCost").innerHTML = gameState.clericPrice.formatMoney(0);
            document.getElementById("commanderCost").innerHTML = gameState.commanderPrice.formatMoney(0);
            document.getElementById("mageCost").innerHTML = gameState.magePrice.formatMoney(0);
            document.getElementById("assassinCost").innerHTML = gameState.assassinPrice.formatMoney(0);
            document.getElementById("warlockCost").innerHTML = gameState.warlockPrice.formatMoney(0);
        }

        // Add a new mercenary of a specified type for the player
        this.addMercenary = function(type) {
            switch (type) {
                case static.MercenaryType.FOOTMAN:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.FOOTMAN));
                    break;
                case static.MercenaryType.CLERIC:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.CLERIC));
                    break;
                case static.MercenaryType.COMMANDER:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.COMMANDER));
                    break;
                case static.MercenaryType.MAGE:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.MAGE));
                    break;
                case static.MercenaryType.ASSASSIN:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.ASSASSIN));
                    break;
                case static.MercenaryType.WARLOCK:
                    this.mercenaries.push(mercenary.create(static.MercenaryType.WARLOCK));
                    break;
            }
        }

        // Get the amount that a mercenary's special effect gives
        this.getClericHp5PercentBonus = function() {
            return static.baseClericHp5PercentBonus + (static.clericHp5PercentUpgradeValue * gameState.clericSpecialUpgradesPurchased);
        }
        this.getCommanderHealthPercentBonus = function() {
            return static.baseCommanderHealthPercentBonus + (static.commanderHealthPercentUpgradeValue * gameState.commanderSpecialUpgradesPurchased);
        }
        this.getMageDamagePercentBonus = function() {
            return static.baseMageDamagePercentBonus + (static.mageDamagePercentUpgradeValue * gameState.mageSpecialUpgradesPurchased);
        }
        this.getAssassinEvasionPercentBonus = function() {
            return static.baseAssassinEvasionPercentBonus + (static.assassinEvasionPercentUpgradeValue * gameState.assassinSpecialUpgradesPurchased);
        }
        this.getWarlockCritDamageBonus = function() {
            return static.baseWarlockCritDamageBonus + (static.warlockCritDamageUpgradeValue * gameState.warlockSpecialUpgradesPurchased);
        }

        this.getMercenaryBaseGps = function(type) {
            switch (type) {
                case static.MercenaryType.FOOTMAN:
                    return (static.baseFootmanGps * Math.pow(2, gameState.footmanUpgradesPurchased));
                    break;
                case static.MercenaryType.CLERIC:
                    return (static.baseClericGps * Math.pow(2, gameState.clericUpgradesPurchased));
                    break;
                case static.MercenaryType.COMMANDER:
                    return (static.baseCommanderGps * Math.pow(2, gameState.commanderUpgradesPurchased));
                    break;
                case static.MercenaryType.MAGE:
                    return (static.baseMageGps * Math.pow(2, gameState.mageUpgradesPurchased));
                    break;
                case static.MercenaryType.ASSASSIN:
                    return (static.baseAssassinGps * Math.pow(2, gameState.assassinUpgradesPurchased));
                    break;
                case static.MercenaryType.WARLOCK:
                    return (static.baseWarlockGps * Math.pow(2, gameState.warlockUpgradesPurchased));
                    break;
            }
        }

        // Get the amount of Gps a mercenary will grant
        this.getMercenariesGps = function(type) {
            var goldMultiplier = game.player.getStat(data.StatDefinition.goldMult.id);
            switch (type) {
                case static.MercenaryType.FOOTMAN:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
                case static.MercenaryType.CLERIC:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
                case static.MercenaryType.COMMANDER:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
                case static.MercenaryType.MAGE:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
                case static.MercenaryType.ASSASSIN:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
                case static.MercenaryType.WARLOCK:
                    return (this.getMercenaryBaseGps(type) * goldMultiplier * ((100 - gameState.gpsReduction) / 100)) * game.player.buffs.getGoldMultiplier();
                    break;
            }
        }

        // Get the Gps
        this.getGps = function() {
            var gps = 0;
            var gold = 0;

            // Go through all the mercenaries and add the gold they would generate to the gps
            for (var x = 0; x < this.mercenaries.length; x++) {
                // Reset the values
                gold = 0;

                // Get the gold gained from each mercenary
                gold += this.getMercenariesGps(this.mercenaries[x].type);

                // Add this mercenary's gold to the gps
                gps += gold;
            }

            return gps.formatMoney(2);
        }

        this.legacyUpdate = function(gameTime) {

            // Update the gps reduction if there is a reduction active
            if (gameState.gpsReduction > 0) {
                gameState.gpsReductionTimeRemaining -= gameTime.elapsed;

                if (gameState.gpsReductionTimeRemaining <= 0) {
                    gameState.gpsReduction = 0;

                    $("#gps").css('color', '#ffd800');
                }
            }

            gps = this.getGps();

            // Update the gps amount on the screen and reposition it
            var element = document.getElementById('gps');
            element.innerHTML = gps + 'gps';
            var leftReduction = element.scrollWidth / 2;
            $("#gps").css('left', (($("#gameArea").width() / 2) - leftReduction) + 'px');
        }

        // Purchasing a new Footman
        this.purchaseMercenary = function(type) {
            var price;
            switch (type) {
                case static.MercenaryType.FOOTMAN:
                    price = gameState.footmanPrice;
                    break;
                case static.MercenaryType.CLERIC:
                    price = gameState.clericPrice;
                    break;
                case static.MercenaryType.COMMANDER:
                    price = gameState.commanderPrice;
                    break;
                case static.MercenaryType.MAGE:
                    price = gameState.magePrice;
                    break;
                case static.MercenaryType.ASSASSIN:
                    price = gameState.assassinPrice;
                    break;
                case static.MercenaryType.WARLOCK:
                    price = gameState.warlockPrice;
                    break;
            }
            // Can the player afford it?
            if (game.player.getStat(data.StatDefinition.gold.id) >= price) {
                // Remove the gold from the player
                game.player.modifyStat(data.StatDefinition.gold.id, -price);

                // Add the mercenary
                this.addMercenary(type);
                switch (type) {
                    case static.MercenaryType.FOOTMAN:
                        gameState.footmenOwned++;
                        break;
                    case static.MercenaryType.CLERIC:
                        gameState.clericsOwned++;
                        break;
                    case static.MercenaryType.COMMANDER:
                        gameState.commandersOwned++;
                        break;
                    case static.MercenaryType.MAGE:
                        gameState.magesOwned++;
                        break;
                    case static.MercenaryType.ASSASSIN:
                        gameState.assassinsOwned++;
                        break;
                    case static.MercenaryType.WARLOCK:
                        gameState.warlocksOwned++;
                        break;
                }

                // Increase the price of the mercenary
                switch (type) {
                    case static.MercenaryType.FOOTMAN:
                        gameState.footmanPrice = Math.floor(static.baseFootmanPrice * Math.pow(1.15, gameState.footmenOwned));
                        break;
                    case static.MercenaryType.CLERIC:
                        gameState.clericPrice = Math.floor(static.baseClericPrice * Math.pow(1.15, gameState.clericsOwned));
                        break;
                    case static.MercenaryType.COMMANDER:
                        gameState.commanderPrice = Math.floor(static.baseCommanderPrice * Math.pow(1.15, gameState.commandersOwned));
                        break;
                    case static.MercenaryType.MAGE:
                        gameState.magePrice = Math.floor(static.baseMagePrice * Math.pow(1.15, gameState.magesOwned));
                        break;
                    case static.MercenaryType.ASSASSIN:
                        gameState.assassinPrice = Math.floor(static.baseAssassinPrice * Math.pow(1.15, gameState.assassinsOwned));
                        break;
                    case static.MercenaryType.WARLOCK:
                        gameState.warlockPrice = Math.floor(static.baseWarlockPrice * Math.pow(1.15, gameState.warlocksOwned));
                        break;
                }

                // Update the interface
                var leftReduction;
                switch (type) {
                    case static.MercenaryType.FOOTMAN:
                        document.getElementById("footmanCost").innerHTML = gameState.footmanPrice.formatMoney(0);
                        document.getElementById("footmenOwned").innerHTML = gameState.footmenOwned;
                        break;
                    case static.MercenaryType.CLERIC:
                        document.getElementById("clericCost").innerHTML = gameState.clericPrice.formatMoney(0);
                        document.getElementById("clericsOwned").innerHTML = gameState.clericsOwned;
                        break;
                    case static.MercenaryType.COMMANDER:
                        document.getElementById("commanderCost").innerHTML = gameState.commanderPrice.formatMoney(0);
                        document.getElementById("commandersOwned").innerHTML = gameState.commandersOwned;
                        break;
                    case static.MercenaryType.MAGE:
                        document.getElementById("mageCost").innerHTML = gameState.magePrice.formatMoney(0);
                        document.getElementById("magesOwned").innerHTML = gameState.magesOwned;
                        break;
                    case static.MercenaryType.ASSASSIN:
                        document.getElementById("assassinCost").innerHTML = gameState.assassinPrice.formatMoney(0);
                        document.getElementById("assassinsOwned").innerHTML = gameState.assassinsOwned;
                        break;
                    case static.MercenaryType.WARLOCK:
                        document.getElementById("warlockCost").innerHTML = gameState.warlockPrice.formatMoney(0);
                        document.getElementById("warlocksOwned").innerHTML = gameState.warlocksOwned;
                        break;
                }
            }
        }

        // Add a Gps reduction of a specified amount and duration
        this.addGpsReduction = function(percentage, duration) {
            gameState.gpsReduction = percentage;
            gameState.gpsReductionTimeRemaining = (duration * 1000);

            $("#gps").css('color', '#ff0000');
        }

        this.save = function() {
            localStorage.mercenaryManagerSaved = true;



            localStorage.mercenaries = JSON.stringify(this.mercenaries);
        }

        this.load = function() {
            if (localStorage.mercenaryManagerSaved != null) {


                this.mercenaries = JSON.parse(localStorage.mercenaries);
                for (var x = 0; x < this.mercenaries.length; x++) {
                    if (this.mercenaries[x].type == static.MercenaryType.THIEF) {
                        this.mercenaries[x].type = static.MercenaryType.ASSASSIN;
                    }
                }

                // Update the mercenary purchase buttons
                document.getElementById("clericCost").innerHTML = gameState.clericPrice.formatMoney(0);
                document.getElementById("clericsOwned").innerHTML = gameState.clericsOwned;

                document.getElementById("commanderCost").innerHTML = gameState.commanderPrice.formatMoney(0);
                document.getElementById("commandersOwned").innerHTML = gameState.commandersOwned;

                document.getElementById("mageCost").innerHTML = gameState.magePrice.formatMoney(0);
                document.getElementById("magesOwned").innerHTML = gameState.magesOwned;

                document.getElementById("assassinCost").innerHTML = gameState.assassinPrice.formatMoney(0);
                document.getElementById("assassinsOwned").innerHTML = gameState.assassinsOwned;

                document.getElementById("warlockCost").innerHTML = gameState.warlockPrice.formatMoney(0);
                document.getElementById("warlocksOwned").innerHTML = gameState.warlocksOwned;
            }
        }
    }

    return new MercenaryManager();
});