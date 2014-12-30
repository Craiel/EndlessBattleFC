declare("UpgradeManager", function () {
    include('Component');
    include('Static');

    UpgradeManager.prototype = component.create();
    UpgradeManager.prototype.$super = parent;
    UpgradeManager.prototype.constructor = UpgradeManager;

    function UpgradeManager() {
        this.id = "UpgradeManager";

        this.upgradesButtonGlowing = false;

        this.upgradesAvailable = 0;
        this.upgradesPurchased = 0;

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

        this.autoSellUpgradesPurchased = 0;

        // The Id of the upgrade that each button is linked to
        this.purchaseButtonUpgradeIds = new Array();

        this.upgrades = new Array();

        this.initialize = function initialize() {
            // Footman Basic Upgrades
            this.upgrades.push(new Upgrade("Footman Training", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 10, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training II", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 19)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 20, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training III", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 29)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 30, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training IV", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 50, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training V", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 74)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 75, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training VI", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 100, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training VII", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 150, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training VIII", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 200, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training IX", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 249)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 250, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(new Upgrade("Footman Training X", Math.floor((game.mercenaryManager.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.FOOTMAN, 300, "Doubles the GPS of your Footmen", 0, 0));

            // Cleric Basic Upgrades
            this.upgrades.push(new Upgrade("Cleric Training", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 10, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(new Upgrade("Cleric Training II", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 25, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(new Upgrade("Cleric Training III", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 50, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(new Upgrade("Cleric Training IV", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 100, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(new Upgrade("Cleric Training V", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.CLERIC, 150, "Doubles the GPS of your Clerics", 200, 0));

            // Commander Basic Upgrades
            this.upgrades.push(new Upgrade("Commander Training", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 10, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(new Upgrade("Commander Training II", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 25, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(new Upgrade("Commander Training III", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 50, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(new Upgrade("Commander Training IV", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 100, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(new Upgrade("Commander Training V", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.COMMANDER, 150, "Doubles the GPS of your Commanders", 160, 0));

            // Mage Basic Upgrades
            this.upgrades.push(new Upgrade("Mage Training", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 10, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(new Upgrade("Mage Training II", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 25, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(new Upgrade("Mage Training III", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 50, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(new Upgrade("Mage Training IV", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 100, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(new Upgrade("Mage Training V", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.MAGE, 150, "Doubles the GPS of your Mages", 120, 0));

            // Assassin Basic Upgrades
            this.upgrades.push(new Upgrade("Assassin Training", Math.floor((game.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 10, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(new Upgrade("Assassin Training II", Math.floor((game.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 25, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(new Upgrade("Assassin Training III", Math.floor((game.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 50, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(new Upgrade("Assassin Training IV", Math.floor((game.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 100, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(new Upgrade("Assassin Training V", Math.floor((game.mercenaryManager.baseAssassinPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.ASSASSIN, 150, "Doubles the GPS of your Assassin", 80, 0));

            // Warlock Basic Upgrades
            this.upgrades.push(new Upgrade("Warlock Training", ((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 9)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 10, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(new Upgrade("Warlock Training II", ((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 24)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 25, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(new Upgrade("Warlock Training III", ((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 50, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(new Upgrade("Warlock Training IV", ((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 100, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(new Upgrade("Warlock Training V", ((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 1.5), UpgradeType.GPS, UpgradeRequirementType.WARLOCK, 150, "Doubles the GPS of your Warlocks", 40, 0));

            // Cleric Ability Upgrades
            this.upgrades.push(new Upgrade("Holy Imbuement", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 50, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(new Upgrade("Holy Imbuement II", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 100, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(new Upgrade("Holy Imbuement III", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 150, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(new Upgrade("Holy Imbuement IV", Math.floor((game.mercenaryManager.baseClericPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.CLERIC, 200, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));

            // Commander Ability Upgrades
            this.upgrades.push(new Upgrade("Battle Morale", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 50, "Increases the health bonus from your Commanders by " + game.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(new Upgrade("Battle Morale II", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 100, "Increases the health bonus from your Commanders by " + game.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(new Upgrade("Battle Morale III", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 150, "Increases the health bonus from your Commanders by " + game.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(new Upgrade("Battle Morale IV", Math.floor((game.mercenaryManager.baseCommanderPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.COMMANDER, 200, "Increases the health bonus from your Commanders by " + game.mercenaryManager.commanderHealthPercentUpgradeValue + "%.", 160, 0));

            // Mage Ability Upgrades
            this.upgrades.push(new Upgrade("Fire Mastery", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 50, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(new Upgrade("Fire Mastery II", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 100, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(new Upgrade("Fire Mastery III", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 150, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(new Upgrade("Fire Mastery IV", Math.floor((game.mercenaryManager.baseMagePrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.MAGE, 200, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));

            // Assassin Ability Upgrades
            this.upgrades.push(new Upgrade("Shadow Mastery", Math.floor((game.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 50, "Increases the evasion bonus from your assassins by " + game.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(new Upgrade("Shadow Mastery II", Math.floor((game.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 100, "Increases the evasion bonus from your assassins by " + game.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(new Upgrade("Shadow Mastery III", Math.floor((game.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 150, "Increases the evasion bonus from your assassins by " + game.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(new Upgrade("Shadow Mastery IV", Math.floor((game.mercenaryManager.baseAssassinPrice + Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.ASSASSIN, 200, "Increases the evasion bonus from your assassins by " + game.mercenaryManager.assassinEvasionPercentUpgradeValue + "%.", 80, 0));

            // Warlock Ability Upgrades
            this.upgrades.push(new Upgrade("Corruption", Math.floor((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 49)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 50, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(new Upgrade("Corruption II", Math.floor((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 99)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 100, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(new Upgrade("Corruption III", Math.floor((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 149)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 150, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(new Upgrade("Corruption IV", Math.floor((game.mercenaryManager.baseWarlockPrice * Math.pow(1.15, 199)) * 3), UpgradeType.SPECIAL, UpgradeRequirementType.WARLOCK, 200, "Increases the crit damage bonus from Warlocks by 2.5%.", 40, 0));

            // Attack Upgrades
            this.upgrades.push(new Upgrade("Power Strike", game.monsterCreator.calculateMonsterGoldWorth(50, static.MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 50, "Upgrades your attack to Power Strike", 0, 80));
            this.upgrades.push(new Upgrade("Double Strike", game.monsterCreator.calculateMonsterGoldWorth(100, static.MonsterRarity.COMMON) * 400, UpgradeType.ATTACK, UpgradeRequirementType.LEVEL, 100, "Upgrades your attack to Double Strike", 200, 80));

            // Auto Loot Upgrades
            this.upgrades.push(new Upgrade("Vendor", game.monsterCreator.calculateMonsterGoldWorth(25, static.MonsterRarity.COMMON) * 200, UpgradeType.AUTO_SELL, UpgradeRequirementType.ITEMS_LOOTED, 100, "Doubles the amount of gold items are worth and allows you to automatically sell common items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(new Upgrade("Trader", game.monsterCreator.calculateMonsterGoldWorth(50, static.MonsterRarity.COMMON) * 200, UpgradeType.AUTO_SELL, UpgradeRequirementType.ITEMS_LOOTED, 200, "Doubles the amount of gold items are worth and allows you to automatically sell uncommon items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(new Upgrade("Merchant", game.monsterCreator.calculateMonsterGoldWorth(100, static.MonsterRarity.COMMON) * 200, UpgradeType.AUTO_SELL, UpgradeRequirementType.ITEMS_LOOTED, 400, "Doubles the amount of gold items are worth and allows you to automatically sell rare items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(new Upgrade("Storekeeper", game.monsterCreator.calculateMonsterGoldWorth(150, static.MonsterRarity.COMMON) * 200, UpgradeType.AUTO_SELL, UpgradeRequirementType.ITEMS_LOOTED, 800, "Doubles the amount of gold items are worth and allows you to automatically sell epic items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(new Upgrade("Operator", game.monsterCreator.calculateMonsterGoldWorth(250, static.MonsterRarity.COMMON) * 200, UpgradeType.AUTO_SELL, UpgradeRequirementType.ITEMS_LOOTED, 1600, "Doubles the amount of gold items are worth and allows you to automatically sell legendary items. This can be set in your inventory.", 200, 40));
        }

        this.update = function update() {
            var currentUpgrade;
            var available = false;
            // Go through every upgrade
            for (var x = 0; x < this.upgrades.length; x++) {
                currentUpgrade = this.upgrades[x];
                // Check to see if this upgrade is already available
                if (!currentUpgrade.available && !currentUpgrade.purchased) {
                    // If it isn't then see if it can be now
                    available = false;

                    // Find the matching requirement type, then see if it has been met
                    switch (currentUpgrade.requirementType) {
                        case UpgradeRequirementType.FOOTMAN:
                            if (game.mercenaryManager.footmenOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.CLERIC:
                            if (game.mercenaryManager.clericsOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.COMMANDER:
                            if (game.mercenaryManager.commandersOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.MAGE:
                            if (game.mercenaryManager.magesOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.ASSASSIN:
                            if (game.mercenaryManager.assassinsOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.WARLOCK:
                            if (game.mercenaryManager.warlocksOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.ITEMS_LOOTED:
                            if (game.stats.itemsLooted >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case UpgradeRequirementType.LEVEL:
                            if (game.player.level >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                    }
                }

                // If the upgrade is now available, then add it to the interface
                if (available) {
                    game.displayAlert("New upgrade available!");
                    // Set the upgrade to available
                    currentUpgrade.available = true;
                    this.upgradesAvailable++;
                    this.purchaseButtonUpgradeIds.push(x);

                    // Create the button
                    var newDiv = document.createElement('div');
                    newDiv.id = 'upgradePurchaseButton' + this.upgradesAvailable;
                    newDiv.className = 'buyButton';
                    var id = this.upgradesAvailable;
                    newDiv.onmouseover = function () {
                        upgradeButtonMouseOver(newDiv, id);
                    }
                    newDiv.onmousedown = function () {
                        upgradeButtonMouseDown(id);
                    }
                    newDiv.onmouseup = function () {
                        upgradeButtonMouseOver(newDiv, id);
                    }
                    newDiv.onmouseout = function () {
                        upgradeButtonMouseOut(id);
                    }
                    var container = document.getElementById("upgradesBuyArea");
                    container.appendChild(newDiv);

                    // Create the text container
                    var newDiv2 = document.createElement('div');
                    newDiv2.className = 'buyButtonArea';
                    newDiv.appendChild(newDiv2);

                    // Create the icon
                    var icon = document.createElement('div');
                    icon.id = "upgradeIcon" + this.upgradesAvailable;
                    icon.className = 'buyButtonIcon';
                    icon.style.background = 'url("includes/images/bigIcons.png") ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
                    newDiv2.appendChild(icon);

                    // Create the name
                    var newDiv3 = document.createElement('div');
                    newDiv3.id = 'upgradeName' + this.upgradesAvailable;
                    newDiv3.className = 'mercenaryName';
                    newDiv3.innerHTML = currentUpgrade.name;
                    newDiv2.appendChild(newDiv3);

                    // Transform the cost
                    var cost = currentUpgrade.cost;
                    cost = cost.formatMoney(0);

                    // Create the cost
                    newDiv3 = document.createElement('div');
                    newDiv3.id = 'upgradeCost' + this.upgradesAvailable;
                    newDiv3.className = 'mercenaryAmount';
                    newDiv3.innerHTML = cost;
                    newDiv3.style.left = '53px';
                    newDiv2.appendChild(newDiv3);

                    // Create the gold coin
                    newDiv3 = document.createElement('div');
                    newDiv3.id = 'upgradeCoin' + this.upgradesAvailable;
                    newDiv3.className = 'goldCoin';
                    newDiv3.style.position = 'absolute';
                    newDiv3.style.top = '28px';
                    newDiv3.style.width = '12px';
                    newDiv3.style.height = '12px';
                    newDiv3.style.left = '41px';
                    newDiv2.appendChild(newDiv3);

                    // Make the Upgrades Button glow to tell the player a new upgrade is available
                    this.glowUpgradesButton();

                    break;
                }
            }
        }

        this.purchaseUpgrade = function purchaseUpgrade(id) {
            // If the player can afford the upgrade
            if (game.player.gold >= this.upgrades[this.purchaseButtonUpgradeIds[id]].cost) {
                // Purchase the upgrade
                var upgrade = this.upgrades[this.purchaseButtonUpgradeIds[id]];
                game.player.gold -= upgrade.cost;
                upgrade.purchased = true;
                upgrade.available = false;
                this.upgradesAvailable--;
                this.upgradesPurchased++;
                this.purchaseButtonUpgradeIds.splice(id, 1);

                var autoSellUpgradePurchased = false;
                // Apply the bonus
                switch (upgrade.type) {
                    case UpgradeType.GPS:
                        switch (upgrade.requirementType) {
                            case UpgradeRequirementType.FOOTMAN:
                                this.footmanUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.CLERIC:
                                this.clericUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.COMMANDER:
                                this.commanderUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.MAGE:
                                this.mageUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.ASSASSIN:
                                this.assassinUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.WARLOCK:
                                this.warlockUpgradesPurchased++;
                                break;
                        }
                        break;
                    case UpgradeType.SPECIAL:
                        switch (upgrade.requirementType) {
                            case UpgradeRequirementType.FOOTMAN:
                                break;
                            case UpgradeRequirementType.CLERIC:
                                this.clericSpecialUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.COMMANDER:
                                this.commanderSpecialUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.MAGE:
                                this.mageSpecialUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.ASSASSIN:
                                this.assassinSpecialUpgradesPurchased++;
                                break;
                            case UpgradeRequirementType.WARLOCK:
                                this.warlockSpecialUpgradesPurchased++;
                                break;
                        }
                        break;
                    case UpgradeType.AUTO_SELL:
                        autoSellUpgradePurchased = true;
                        this.autoSellUpgradesPurchased++;
                        switch (upgrade.name) {
                            case "Vendor":
                                $("#checkboxWhite").show();
                                break;
                            case "Trader":
                                $("#checkboxGreen").show();
                                break;
                            case "Merchant":
                                $("#checkboxBlue").show();
                                break;
                            case "Storekeeper":
                                $("#checkboxPurple").show();
                                break;
                            case "Operator":
                                $("#checkboxOrange").show();
                                break;
                        }
                        break;
                    case UpgradeType.ATTACK:
                        switch (upgrade.name) {
                            case "Power Strike":
                                if (!this.upgrades[56].purchased) {
                                    game.player.changeAttack(static.AttackType.POWER_STRIKE);
                                }
                                break;
                            case "Double Strike":
                                game.player.changeAttack(static.AttackType.DOUBLE_STRIKE);
                                break;
                        }
                }

                // If an auto sell upgrade was purchased then upgrade the gold value on all items the player currently has
                if (autoSellUpgradePurchased) {
                    for (var x = 0; x < game.inventory.slots.length; x++) {
                        if (game.inventory.slots[x] != null) {
                            game.inventory.slots[x].sellValue *= 2;
                        }
                    }
                    for (var x = 0; x < game.equipment.slots.length; x++) {
                        if (game.equipment.slots[x] != null) {
                            game.equipment.slots[x].sellValue *= 2;
                        }
                    }
                }

                // Remove the button and organise the others
                var currentElement;
                var nextElement;
                var buttonId;
                for (var x = id; x < this.upgradesAvailable; x++) {
                    // Change the button
                    buttonId = x + 1;
                    currentElement = document.getElementById('upgradePurchaseButton' + buttonId);
                    nextElement = document.getElementById('upgradePurchaseButton' + (buttonId + 1));
                    currentElement.className = nextElement.className;

                    // Change the icon
                    currentElement = document.getElementById('upgradeIcon' + buttonId);
                    nextElement = document.getElementById('upgradeIcon' + (buttonId + 1));
                    currentElement.style.background = nextElement.style.background;

                    // Change the name
                    currentElement = document.getElementById('upgradeName' + buttonId);
                    nextElement = document.getElementById('upgradeName' + (buttonId + 1));
                    currentElement.innerHTML = nextElement.innerHTML;

                    // Change the cost
                    currentElement = document.getElementById('upgradeCost' + buttonId);
                    nextElement = document.getElementById('upgradeCost' + (buttonId + 1));
                    currentElement.innerHTML = nextElement.innerHTML;
                    currentElement.style.left = nextElement.style.left;
                }

                // Remove the last element and update the position for the next upgrade
                currentElement = document.getElementById('upgradePurchaseButton' + (this.upgradesAvailable + 1));
                currentElement.parentNode.removeChild(currentElement);
                this.nextTopPosition -= this.topIncrement;

                // Hide the tooltip
                $("#otherTooltip").hide();
            }
        }

        this.stopGlowingUpgradesButton = function stopGlowingUpgradesButton() {
            this.upgradesButtonGlowing = false;
            $("#upgradesWindowButtonGlow").stop(true);
            $("#upgradesWindowButtonGlow").css('opacity', 0);
            $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 0');
        }
        this.glowUpgradesButton = function glowUpgradesButton() {
            this.upgradesButtonGlowing = true;
            $("#upgradesWindowButtonGlow").animate({opacity: '+=0.5'}, 400);
            $("#upgradesWindowButtonGlow").animate({opacity: '-=0.5'}, 400, function () {
                glowUpgradesButton();
            });
        }

        this.save = function save() {
            localStorage.upgradesSaved = true;

            localStorage.footmanUpgradesPurchased = this.footmanUpgradesPurchased;
            localStorage.clericUpgradesPurchased = this.clericUpgradesPurchased;
            localStorage.commanderUpgradesPurchased = this.commanderUpgradesPurchased;
            localStorage.mageUpgradesPurchased = this.mageUpgradesPurchased;
            localStorage.assassinUpgradesPurchased = this.assassinUpgradesPurchased;
            localStorage.warlockUpgradesPurchased = this.warlockUpgradesPurchased;

            var upgradesPurchasedArray = new Array();
            var upgradesAvailableArray = new Array();

            for (var x = 0; x < this.upgrades.length; x++) {
                upgradesPurchasedArray.push(this.upgrades[x].purchased);
                upgradesAvailableArray.push(this.upgrades[x].available);
            }

            localStorage.upgradesPurchasedArray = JSON.stringify(upgradesPurchasedArray);
            localStorage.upgradesAvailableArray = JSON.stringify(upgradesAvailableArray);

            localStorage.clericSpecialUpgradesPurchased = this.clericSpecialUpgradesPurchased;
            localStorage.commanderSpecialUpgradesPurchased = this.commanderSpecialUpgradesPurchased;
            localStorage.mageSpecialUpgradesPurchased = this.mageSpecialUpgradesPurchased;
            localStorage.assassinSpecialUpgradesPurchased = this.assassinSpecialUpgradesPurchased;
            localStorage.warlockSpecialUpgradesPurchased = this.warlockSpecialUpgradesPurchased;

            localStorage.autoSellUpgradesPurchased = this.autoSellUpgradesPurchased;
        }

        this.load = function load() {
            if (localStorage.upgradesSaved != null) {
                this.footmanUpgradesPurchased = parseInt(localStorage.footmanUpgradesPurchased);
                this.clericUpgradesPurchased = parseInt(localStorage.clericUpgradesPurchased);
                this.commanderUpgradesPurchased = parseInt(localStorage.commanderUpgradesPurchased);
                this.mageUpgradesPurchased = parseInt(localStorage.mageUpgradesPurchased);
                if (localStorage.version == null) {
                    this.assassinUpgradesPurchased = parseInt(localStorage.thiefUpgradesPurchased);
                }
                else {
                    this.assassinUpgradesPurchased = parseInt(localStorage.assassinUpgradesPurchased);
                }
                this.warlockUpgradesPurchased = parseInt(localStorage.warlockUpgradesPurchased);

                var upgradesPurchasedArray = JSON.parse(localStorage.upgradesPurchasedArray);
                var upgradesAvailableArray = JSON.parse(localStorage.upgradesAvailableArray);

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

                for (var x = 0; x < upgradesPurchasedArray.length; x++) {
                    if (upgradesPurchasedArray[x]) {
                        this.upgradesPurchased++;
                        this.upgrades[x].purchased = upgradesPurchasedArray[x];
                    }
                    else if (upgradesAvailableArray[x]) {
                        this.upgrades[x].available = upgradesAvailableArray[x];
                    }
                }

                // Show all the buttons for each available upgrade
                for (var x = 0; x < this.upgrades.length; x++) {
                    if (this.upgrades[x].available && !this.upgrades[x].purchased) {
                        // Set the upgrade to available
                        var currentUpgrade = this.upgrades[x];
                        this.upgradesAvailable++;
                        this.purchaseButtonUpgradeIds.push(x);

                        // Create the button
                        var newDiv = document.createElement('div');
                        newDiv.id = 'upgradePurchaseButton' + this.upgradesAvailable;
                        newDiv.className = 'buyButton'
                        newDiv.style.top = this.nextTopPosition + 'px';
                        var id = this.upgradesAvailable;
                        newDiv.onmouseover = upgradeButtonMouseOverFactory(newDiv, id);
                        newDiv.onmousedown = upgradeButtonMouseDownFactory(id);
                        newDiv.onmouseup = upgradeButtonMouseOverFactory(newDiv, id);
                        newDiv.onmouseout = upgradeButtonMouseOutFactory(id)
                        var container = document.getElementById("upgradesBuyArea");
                        container.appendChild(newDiv);

                        this.nextTopPosition += this.topIncrement;

                        // Create the text container
                        var newDiv2 = document.createElement('div');
                        newDiv2.className = 'buyButtonArea';
                        newDiv.appendChild(newDiv2);

                        // Create the icon
                        var icon = document.createElement('div');
                        icon.className = 'buyButtonIcon button';
                        icon.style.background = 'url("includes/images/bigIcons.png") ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
                        newDiv2.appendChild(icon);

                        // Create the name
                        var newDiv3 = document.createElement('div');
                        newDiv3.id = 'upgradeName' + this.upgradesAvailable;
                        newDiv3.className = 'mercenaryName';
                        newDiv3.innerHTML = currentUpgrade.name;
                        newDiv2.appendChild(newDiv3);

                        // Transform the cost
                        var cost = currentUpgrade.cost;
                        cost = cost.formatMoney(0);

                        // Create the cost
                        newDiv3 = document.createElement('div');
                        newDiv3.id = 'upgradeCost' + this.upgradesAvailable;
                        newDiv3.className = 'mercenaryAmount';
                        newDiv3.innerHTML = cost;
                        newDiv3.style.left = '53px';
                        newDiv2.appendChild(newDiv3);

                        // Create the gold coin
                        newDiv3 = document.createElement('div');
                        newDiv3.id = 'upgradeCoin' + this.upgradesAvailable;
                        newDiv3.className = 'goldCoin';
                        newDiv3.style.position = 'absolute';
                        newDiv3.style.top = '28px';
                        newDiv3.style.width = '12px';
                        newDiv3.style.height = '12px';
                        newDiv3.style.left = '41px';
                        newDiv2.appendChild(newDiv3);
                    }
                }

                // Show the auto selling checkboxes the player has unlocked
                if (this.upgrades[57].purchased) {
                    $("#checkboxWhite").show();
                }
                if (this.upgrades[58].purchased) {
                    $("#checkboxGreen").show();
                }
                if (this.upgrades[59].purchased) {
                    $("#checkboxBlue").show();
                }
                if (this.upgrades[60].purchased) {
                    $("#checkboxPurple").show();
                }
                if (this.upgrades[61].purchased) {
                    $("#checkboxOrange").show();
                }
                if (localStorage.autoSellUpgradesPurchased != null) {
                    this.autoSellUpgradesPurchased = parseInt(localStorage.autoSellUpgradesPurchased);
                }
            }
        }
    }

    return {
        create: function() { return new UpgradeManager(); }
    };

});