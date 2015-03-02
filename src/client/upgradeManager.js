declare("UpgradeManager", function () {
    include('Component');
    include('Static');
    include('Upgrade');
    include('MonsterCreator');
    include('GameState');
    include('Resources');

    UpgradeManager.prototype = component.create();
    UpgradeManager.prototype.$super = parent;
    UpgradeManager.prototype.constructor = UpgradeManager;

    function UpgradeManager() {
        this.id = "UpgradeManager";

        this.upgradesButtonGlowing = false;

        this.upgradesAvailable = 0;
        this.upgradesPurchased = 0;

        // The Id of the upgrade that each button is linked to
        this.purchaseButtonUpgradeIds = new Array();

        this.upgrades = new Array();

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            // Footman Basic Upgrades
            this.upgrades.push(upgrade.create("Footman Training", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 10, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training II", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 19)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 20, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training III", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 29)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 30, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training IV", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 50, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training V", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 74)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 75, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training VI", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 100, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training VII", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 150, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training VIII", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 200, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training IX", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 249)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 250, "Doubles the GPS of your Footmen", 0, 0));
            this.upgrades.push(upgrade.create("Footman Training X", Math.floor((static.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.FOOTMAN, 300, "Doubles the GPS of your Footmen", 0, 0));

            // Cleric Basic Upgrades
            this.upgrades.push(upgrade.create("Cleric Training", Math.floor((static.baseClericPrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.CLERIC, 10, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(upgrade.create("Cleric Training II", Math.floor((static.baseClericPrice * Math.pow(1.15, 24)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.CLERIC, 25, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(upgrade.create("Cleric Training III", Math.floor((static.baseClericPrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.CLERIC, 50, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(upgrade.create("Cleric Training IV", Math.floor((static.baseClericPrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.CLERIC, 100, "Doubles the GPS of your Clerics", 200, 0));
            this.upgrades.push(upgrade.create("Cleric Training V", Math.floor((static.baseClericPrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.CLERIC, 150, "Doubles the GPS of your Clerics", 200, 0));

            // Commander Basic Upgrades
            this.upgrades.push(upgrade.create("Commander Training", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.COMMANDER, 10, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(upgrade.create("Commander Training II", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 24)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.COMMANDER, 25, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(upgrade.create("Commander Training III", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.COMMANDER, 50, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(upgrade.create("Commander Training IV", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.COMMANDER, 100, "Doubles the GPS of your Commanders", 160, 0));
            this.upgrades.push(upgrade.create("Commander Training V", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.COMMANDER, 150, "Doubles the GPS of your Commanders", 160, 0));

            // Mage Basic Upgrades
            this.upgrades.push(upgrade.create("Mage Training", Math.floor((static.baseMagePrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.MAGE, 10, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(upgrade.create("Mage Training II", Math.floor((static.baseMagePrice * Math.pow(1.15, 24)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.MAGE, 25, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(upgrade.create("Mage Training III", Math.floor((static.baseMagePrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.MAGE, 50, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(upgrade.create("Mage Training IV", Math.floor((static.baseMagePrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.MAGE, 100, "Doubles the GPS of your Mages", 120, 0));
            this.upgrades.push(upgrade.create("Mage Training V", Math.floor((static.baseMagePrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.MAGE, 150, "Doubles the GPS of your Mages", 120, 0));

            // Assassin Basic Upgrades
            this.upgrades.push(upgrade.create("Assassin Training", Math.floor((static.baseAssassinPrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.ASSASSIN, 10, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(upgrade.create("Assassin Training II", Math.floor((static.baseAssassinPrice * Math.pow(1.15, 24)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.ASSASSIN, 25, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(upgrade.create("Assassin Training III", Math.floor((static.baseAssassinPrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.ASSASSIN, 50, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(upgrade.create("Assassin Training IV", Math.floor((static.baseAssassinPrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.ASSASSIN, 100, "Doubles the GPS of your Assassin", 80, 0));
            this.upgrades.push(upgrade.create("Assassin Training V", Math.floor((static.baseAssassinPrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.ASSASSIN, 150, "Doubles the GPS of your Assassin", 80, 0));

            // Warlock Basic Upgrades
            this.upgrades.push(upgrade.create("Warlock Training", ((static.baseWarlockPrice * Math.pow(1.15, 9)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.WARLOCK, 10, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(upgrade.create("Warlock Training II", ((static.baseWarlockPrice * Math.pow(1.15, 24)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.WARLOCK, 25, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(upgrade.create("Warlock Training III", ((static.baseWarlockPrice * Math.pow(1.15, 49)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.WARLOCK, 50, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(upgrade.create("Warlock Training IV", ((static.baseWarlockPrice * Math.pow(1.15, 99)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.WARLOCK, 100, "Doubles the GPS of your Warlocks", 40, 0));
            this.upgrades.push(upgrade.create("Warlock Training V", ((static.baseWarlockPrice * Math.pow(1.15, 149)) * 1.5), static.UpgradeType.GPS, static.UpgradeRequirementType.WARLOCK, 150, "Doubles the GPS of your Warlocks", 40, 0));

            // Cleric Ability Upgrades
            this.upgrades.push(upgrade.create("Holy Imbuement", Math.floor((static.baseClericPrice * Math.pow(1.15, 49)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.CLERIC, 50, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(upgrade.create("Holy Imbuement II", Math.floor((static.baseClericPrice * Math.pow(1.15, 99)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.CLERIC, 100, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(upgrade.create("Holy Imbuement III", Math.floor((static.baseClericPrice * Math.pow(1.15, 149)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.CLERIC, 150, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
            this.upgrades.push(upgrade.create("Holy Imbuement IV", Math.floor((static.baseClericPrice * Math.pow(1.15, 199)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.CLERIC, 200, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));

            // Commander Ability Upgrades
            this.upgrades.push(upgrade.create("Battle Morale", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 49)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.COMMANDER, 50, "Increases the health bonus from your Commanders by " + static.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(upgrade.create("Battle Morale II", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 99)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.COMMANDER, 100, "Increases the health bonus from your Commanders by " + static.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(upgrade.create("Battle Morale III", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 149)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.COMMANDER, 150, "Increases the health bonus from your Commanders by " + static.commanderHealthPercentUpgradeValue + "%.", 160, 0));
            this.upgrades.push(upgrade.create("Battle Morale IV", Math.floor((static.baseCommanderPrice * Math.pow(1.15, 199)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.COMMANDER, 200, "Increases the health bonus from your Commanders by " + static.commanderHealthPercentUpgradeValue + "%.", 160, 0));

            // Mage Ability Upgrades
            this.upgrades.push(upgrade.create("Fire Mastery", Math.floor((static.baseMagePrice * Math.pow(1.15, 49)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.MAGE, 50, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(upgrade.create("Fire Mastery II", Math.floor((static.baseMagePrice * Math.pow(1.15, 99)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.MAGE, 100, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(upgrade.create("Fire Mastery III", Math.floor((static.baseMagePrice * Math.pow(1.15, 149)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.MAGE, 150, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
            this.upgrades.push(upgrade.create("Fire Mastery IV", Math.floor((static.baseMagePrice * Math.pow(1.15, 199)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.MAGE, 200, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));

            // Assassin Ability Upgrades
            this.upgrades.push(upgrade.create("Shadow Mastery", Math.floor((static.baseAssassinPrice + Math.pow(1.15, 49)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.ASSASSIN, 50, "Increases the evasion bonus from your assassins by " + static.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(upgrade.create("Shadow Mastery II", Math.floor((static.baseAssassinPrice + Math.pow(1.15, 99)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.ASSASSIN, 100, "Increases the evasion bonus from your assassins by " + static.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(upgrade.create("Shadow Mastery III", Math.floor((static.baseAssassinPrice + Math.pow(1.15, 149)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.ASSASSIN, 150, "Increases the evasion bonus from your assassins by " + static.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
            this.upgrades.push(upgrade.create("Shadow Mastery IV", Math.floor((static.baseAssassinPrice + Math.pow(1.15, 199)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.ASSASSIN, 200, "Increases the evasion bonus from your assassins by " + static.assassinEvasionPercentUpgradeValue + "%.", 80, 0));

            // Warlock Ability Upgrades
            this.upgrades.push(upgrade.create("Corruption", Math.floor((static.baseWarlockPrice * Math.pow(1.15, 49)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.WARLOCK, 50, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(upgrade.create("Corruption II", Math.floor((static.baseWarlockPrice * Math.pow(1.15, 99)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.WARLOCK, 100, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(upgrade.create("Corruption III", Math.floor((static.baseWarlockPrice * Math.pow(1.15, 149)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.WARLOCK, 150, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
            this.upgrades.push(upgrade.create("Corruption IV", Math.floor((static.baseWarlockPrice * Math.pow(1.15, 199)) * 3), static.UpgradeType.SPECIAL, static.UpgradeRequirementType.WARLOCK, 200, "Increases the crit damage bonus from Warlocks by 2.5%.", 40, 0));

            // Attack Upgrades
            this.upgrades.push(upgrade.create("Power Strike",monsterCreator.calculateMonsterGoldWorth(50, static.MonsterRarity.COMMON) * 400, static.UpgradeType.ATTACK, static.UpgradeRequirementType.LEVEL, 50, "Upgrades your attack to Power Strike", 0, 80));
            this.upgrades.push(upgrade.create("Double Strike",monsterCreator.calculateMonsterGoldWorth(100, static.MonsterRarity.COMMON) * 400, static.UpgradeType.ATTACK, static.UpgradeRequirementType.LEVEL, 100, "Upgrades your attack to Double Strike", 200, 80));

            // Auto Loot Upgrades
            this.upgrades.push(upgrade.create("Vendor",monsterCreator.calculateMonsterGoldWorth(25, static.MonsterRarity.COMMON) * 200, static.UpgradeType.AUTO_SELL, static.UpgradeRequirementType.ITEMS_LOOTED, 100, "Doubles the amount of gold items are worth and allows you to automatically sell common items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(upgrade.create("Trader",monsterCreator.calculateMonsterGoldWorth(50, static.MonsterRarity.COMMON) * 200, static.UpgradeType.AUTO_SELL, static.UpgradeRequirementType.ITEMS_LOOTED, 200, "Doubles the amount of gold items are worth and allows you to automatically sell uncommon items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(upgrade.create("Merchant",monsterCreator.calculateMonsterGoldWorth(100, static.MonsterRarity.COMMON) * 200, static.UpgradeType.AUTO_SELL, static.UpgradeRequirementType.ITEMS_LOOTED, 400, "Doubles the amount of gold items are worth and allows you to automatically sell rare items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(upgrade.create("Storekeeper",monsterCreator.calculateMonsterGoldWorth(150, static.MonsterRarity.COMMON) * 200, static.UpgradeType.AUTO_SELL, static.UpgradeRequirementType.ITEMS_LOOTED, 800, "Doubles the amount of gold items are worth and allows you to automatically sell epic items. This can be set in your inventory.", 200, 40));
            this.upgrades.push(upgrade.create("Operator",monsterCreator.calculateMonsterGoldWorth(250, static.MonsterRarity.COMMON) * 200, static.UpgradeType.AUTO_SELL, static.UpgradeRequirementType.ITEMS_LOOTED, 1600, "Doubles the amount of gold items are worth and allows you to automatically sell legendary items. This can be set in your inventory.", 200, 40));
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

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
                        case static.UpgradeRequirementType.FOOTMAN:
                            if (gameState.footmenOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.CLERIC:
                            if (gameState.clericsOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.COMMANDER:
                            if (gameState.commandersOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.MAGE:
                            if (gameState.magesOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.ASSASSIN:
                            if (gameState.assassinsOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.WARLOCK:
                            if (gameState.warlocksOwned >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.ITEMS_LOOTED:
                            if (game.stats.itemsLooted >= currentUpgrade.requirementAmount) {
                                available = true;
                            }
                            break;
                        case static.UpgradeRequirementType.LEVEL:
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
                    icon.style.background = resources.getImageUrl(resources.ImageBigIcons) + ' ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
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

        this.purchaseUpgrade = function(id) {
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
                    case static.UpgradeType.GPS:
                        switch (upgrade.requirementType) {
                            case static.UpgradeRequirementType.FOOTMAN:
                                this.footmanUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.CLERIC:
                                this.clericUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.COMMANDER:
                                this.commanderUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.MAGE:
                                this.mageUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.ASSASSIN:
                                this.assassinUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.WARLOCK:
                                this.warlockUpgradesPurchased++;
                                break;
                        }
                        break;
                    case static.UpgradeType.SPECIAL:
                        switch (upgrade.requirementType) {
                            case static.UpgradeRequirementType.FOOTMAN:
                                break;
                            case static.UpgradeRequirementType.CLERIC:
                                this.clericSpecialUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.COMMANDER:
                                this.commanderSpecialUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.MAGE:
                                this.mageSpecialUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.ASSASSIN:
                                this.assassinSpecialUpgradesPurchased++;
                                break;
                            case static.UpgradeRequirementType.WARLOCK:
                                this.warlockSpecialUpgradesPurchased++;
                                break;
                        }
                        break;
                    case static.UpgradeType.AUTO_SELL:
                        autoSellUpgradePurchased = true;
                        gameState.autoSellUpgradesPurchased++;
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
                    case static.UpgradeType.ATTACK:
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

        this.stopGlowingUpgradesButton = function() {
            this.upgradesButtonGlowing = false;
            $("#upgradesWindowButtonGlow").stop(true);
            $("#upgradesWindowButtonGlow").css('opacity', 0);
            $("#upgradesWindowButtonGlow").css('background', resources.getImageUrl(resources.ImageWindowButtons) + ' 78px 0');
        }

        this.glowUpgradesButton = function() {
            this.upgradesButtonGlowing = true;
            $("#upgradesWindowButtonGlow").animate({opacity: '+=0.5'}, 400);
            $("#upgradesWindowButtonGlow").animate({opacity: '-=0.5'}, 400, function () {
                include('UserInterface')
                userInterface.glowUpgradesButton();
            });
        }

        this.save = function() {
            localStorage.upgradesSaved = true;



            var upgradesPurchasedArray = new Array();
            var upgradesAvailableArray = new Array();

            for (var x = 0; x < this.upgrades.length; x++) {
                upgradesPurchasedArray.push(this.upgrades[x].purchased);
                upgradesAvailableArray.push(this.upgrades[x].available);
            }

            localStorage.upgradesPurchasedArray = JSON.stringify(upgradesPurchasedArray);
            localStorage.upgradesAvailableArray = JSON.stringify(upgradesAvailableArray);


        }

        this.load = function() {
            if (localStorage.upgradesSaved != null) {


                var upgradesPurchasedArray = JSON.parse(localStorage.upgradesPurchasedArray);
                var upgradesAvailableArray = JSON.parse(localStorage.upgradesAvailableArray);



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
                        icon.style.background = resources.getImageUrl(resources.ImageBigIcons) + ' ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
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

            }
        }
    }

    return new UpgradeManager();

});