declare('UpgradeManager', function () {
    include('Component');
    include('StaticData');
    include('Upgrade');
    include('MonsterCreator');
    include('Resources');
    include('CoreUtils');

    UpgradeManager.prototype = component.prototype();
    UpgradeManager.prototype.$super = parent;
    UpgradeManager.prototype.constructor = UpgradeManager;

    function UpgradeManager() {
        component.construct(this);

        this.id = "UpgradeManager";

        this.upgradesButtonGlowing = false;

        this.upgradesAvailable = 0;
        this.upgradesPurchased = 0;

        // The Id of the upgrade that each button is linked to
        this.purchaseButtonUpgradeIds = new Array();

        this.upgrades = new Array();
    }

    UpgradeManager.prototype.componentInit = UpgradeManager.prototype.init;
    UpgradeManager.prototype.init = function() {
        this.componentInit();

        // Footman Basic Upgrades
        this.upgrades.push(upgrade.create("Footman Training", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 10, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training II", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 19)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 20, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training III", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 29)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 30, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training IV", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 50, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training V", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 74)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 75, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training VI", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 100, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training VII", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 150, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training VIII", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 200, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training IX", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 249)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 250, "Doubles the GPS of your Footmen", 0, 0));
        this.upgrades.push(upgrade.create("Footman Training X", Math.floor((staticData.baseFootmanPrice * Math.pow(1.15, 199)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.FOOTMAN, 300, "Doubles the GPS of your Footmen", 0, 0));

        // Cleric Basic Upgrades
        this.upgrades.push(upgrade.create("Cleric Training", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.CLERIC, 10, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(upgrade.create("Cleric Training II", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 24)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.CLERIC, 25, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(upgrade.create("Cleric Training III", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.CLERIC, 50, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(upgrade.create("Cleric Training IV", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.CLERIC, 100, "Doubles the GPS of your Clerics", 200, 0));
        this.upgrades.push(upgrade.create("Cleric Training V", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.CLERIC, 150, "Doubles the GPS of your Clerics", 200, 0));

        // Commander Basic Upgrades
        this.upgrades.push(upgrade.create("Commander Training", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.COMMANDER, 10, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(upgrade.create("Commander Training II", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 24)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.COMMANDER, 25, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(upgrade.create("Commander Training III", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.COMMANDER, 50, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(upgrade.create("Commander Training IV", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.COMMANDER, 100, "Doubles the GPS of your Commanders", 160, 0));
        this.upgrades.push(upgrade.create("Commander Training V", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.COMMANDER, 150, "Doubles the GPS of your Commanders", 160, 0));

        // Mage Basic Upgrades
        this.upgrades.push(upgrade.create("Mage Training", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.MAGE, 10, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(upgrade.create("Mage Training II", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 24)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.MAGE, 25, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(upgrade.create("Mage Training III", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.MAGE, 50, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(upgrade.create("Mage Training IV", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.MAGE, 100, "Doubles the GPS of your Mages", 120, 0));
        this.upgrades.push(upgrade.create("Mage Training V", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.MAGE, 150, "Doubles the GPS of your Mages", 120, 0));

        // Assassin Basic Upgrades
        this.upgrades.push(upgrade.create("Assassin Training", Math.floor((staticData.baseAssassinPrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.ASSASSIN, 10, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(upgrade.create("Assassin Training II", Math.floor((staticData.baseAssassinPrice * Math.pow(1.15, 24)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.ASSASSIN, 25, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(upgrade.create("Assassin Training III", Math.floor((staticData.baseAssassinPrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.ASSASSIN, 50, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(upgrade.create("Assassin Training IV", Math.floor((staticData.baseAssassinPrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.ASSASSIN, 100, "Doubles the GPS of your Assassin", 80, 0));
        this.upgrades.push(upgrade.create("Assassin Training V", Math.floor((staticData.baseAssassinPrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.ASSASSIN, 150, "Doubles the GPS of your Assassin", 80, 0));

        // Warlock Basic Upgrades
        this.upgrades.push(upgrade.create("Warlock Training", ((staticData.baseWarlockPrice * Math.pow(1.15, 9)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.WARLOCK, 10, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(upgrade.create("Warlock Training II", ((staticData.baseWarlockPrice * Math.pow(1.15, 24)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.WARLOCK, 25, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(upgrade.create("Warlock Training III", ((staticData.baseWarlockPrice * Math.pow(1.15, 49)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.WARLOCK, 50, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(upgrade.create("Warlock Training IV", ((staticData.baseWarlockPrice * Math.pow(1.15, 99)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.WARLOCK, 100, "Doubles the GPS of your Warlocks", 40, 0));
        this.upgrades.push(upgrade.create("Warlock Training V", ((staticData.baseWarlockPrice * Math.pow(1.15, 149)) * 1.5), staticData.UpgradeType.GPS, staticData.UpgradeRequirementType.WARLOCK, 150, "Doubles the GPS of your Warlocks", 40, 0));

        // Cleric Ability Upgrades
        this.upgrades.push(upgrade.create("Holy Imbuement", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 49)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.CLERIC, 50, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(upgrade.create("Holy Imbuement II", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 99)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.CLERIC, 100, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(upgrade.create("Holy Imbuement III", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 149)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.CLERIC, 150, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));
        this.upgrades.push(upgrade.create("Holy Imbuement IV", Math.floor((staticData.baseClericPrice * Math.pow(1.15, 199)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.CLERIC, 200, "Increases the hp5 bonus from your Clerics by 2.5%.", 200, 0));

        // Commander Ability Upgrades
        this.upgrades.push(upgrade.create("Battle Morale", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 49)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.COMMANDER, 50, "Increases the health bonus from your Commanders by " + staticData.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(upgrade.create("Battle Morale II", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 99)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.COMMANDER, 100, "Increases the health bonus from your Commanders by " + staticData.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(upgrade.create("Battle Morale III", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 149)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.COMMANDER, 150, "Increases the health bonus from your Commanders by " + staticData.commanderHealthPercentUpgradeValue + "%.", 160, 0));
        this.upgrades.push(upgrade.create("Battle Morale IV", Math.floor((staticData.baseCommanderPrice * Math.pow(1.15, 199)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.COMMANDER, 200, "Increases the health bonus from your Commanders by " + staticData.commanderHealthPercentUpgradeValue + "%.", 160, 0));

        // Mage Ability Upgrades
        this.upgrades.push(upgrade.create("Fire Mastery", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 49)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.MAGE, 50, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(upgrade.create("Fire Mastery II", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 99)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.MAGE, 100, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(upgrade.create("Fire Mastery III", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 149)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.MAGE, 150, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));
        this.upgrades.push(upgrade.create("Fire Mastery IV", Math.floor((staticData.baseMagePrice * Math.pow(1.15, 199)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.MAGE, 200, "Increases the damage bonus from your Mages by 2.5%.", 120, 0));

        // Assassin Ability Upgrades
        this.upgrades.push(upgrade.create("Shadow Mastery", Math.floor((staticData.baseAssassinPrice + Math.pow(1.15, 49)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.ASSASSIN, 50, "Increases the evasion bonus from your assassins by " + staticData.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(upgrade.create("Shadow Mastery II", Math.floor((staticData.baseAssassinPrice + Math.pow(1.15, 99)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.ASSASSIN, 100, "Increases the evasion bonus from your assassins by " + staticData.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(upgrade.create("Shadow Mastery III", Math.floor((staticData.baseAssassinPrice + Math.pow(1.15, 149)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.ASSASSIN, 150, "Increases the evasion bonus from your assassins by " + staticData.assassinEvasionPercentUpgradeValue + "%.", 80, 0));
        this.upgrades.push(upgrade.create("Shadow Mastery IV", Math.floor((staticData.baseAssassinPrice + Math.pow(1.15, 199)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.ASSASSIN, 200, "Increases the evasion bonus from your assassins by " + staticData.assassinEvasionPercentUpgradeValue + "%.", 80, 0));

        // Warlock Ability Upgrades
        this.upgrades.push(upgrade.create("Corruption", Math.floor((staticData.baseWarlockPrice * Math.pow(1.15, 49)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.WARLOCK, 50, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(upgrade.create("Corruption II", Math.floor((staticData.baseWarlockPrice * Math.pow(1.15, 99)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.WARLOCK, 100, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(upgrade.create("Corruption III", Math.floor((staticData.baseWarlockPrice * Math.pow(1.15, 149)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.WARLOCK, 150, "Increases the crit damage bonus from your Warlocks by 2.5%.", 40, 0));
        this.upgrades.push(upgrade.create("Corruption IV", Math.floor((staticData.baseWarlockPrice * Math.pow(1.15, 199)) * 3), staticData.UpgradeType.SPECIAL, staticData.UpgradeRequirementType.WARLOCK, 200, "Increases the crit damage bonus from Warlocks by 2.5%.", 40, 0));

        // Attack Upgrades
        this.upgrades.push(upgrade.create("Power Strike",monsterCreator.calculateMonsterGoldWorth(50, staticData.MonsterRarity.COMMON) * 400, staticData.UpgradeType.ATTACK, staticData.UpgradeRequirementType.LEVEL, 50, "Upgrades your attack to Power Strike", 0, 80));
        this.upgrades.push(upgrade.create("Double Strike",monsterCreator.calculateMonsterGoldWorth(100, staticData.MonsterRarity.COMMON) * 400, staticData.UpgradeType.ATTACK, staticData.UpgradeRequirementType.LEVEL, 100, "Upgrades your attack to Double Strike", 200, 80));
    }

    UpgradeManager.prototype.componentUpdate = UpgradeManager.prototype.update;
    UpgradeManager.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        /*var currentUpgrade;
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
                    case staticData.UpgradeRequirementType.FOOTMAN:
                        if (gameState.footmenOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.CLERIC:
                        if (gameState.clericsOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.COMMANDER:
                        if (gameState.commandersOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.MAGE:
                        if (gameState.magesOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.ASSASSIN:
                        if (gameState.assassinsOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.WARLOCK:
                        if (gameState.warlocksOwned >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.ITEMS_LOOTED:
                        if (game.stats.itemsLooted >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                    case staticData.UpgradeRequirementType.LEVEL:
                        if (game.player.getLevel() >= currentUpgrade.requirementAmount) {
                            available = true;
                        }
                        break;
                }
            }

            // If the upgrade is now available, then add it to the interface
            if (available) {
                //game.displayAlert("New upgrade available!");
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
                icon.style.background = coreUtils.getImageUrl(resources.ImageBigIcons) + ' ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
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
*/
        return true;
    }

    UpgradeManager.prototype.purchaseUpgrade = function(id) {
        // If the player can afford the upgrade
        if (game.player.getStat(data.StatDefinition.gold.id) >= this.upgrades[this.purchaseButtonUpgradeIds[id]].cost) {
            // Purchase the upgrade
            var upgrade = this.upgrades[this.purchaseButtonUpgradeIds[id]];
            game.player.modifyStat(data.StatDefinition.gold.id, -upgrade.cost);
            upgrade.purchased = true;
            upgrade.available = false;
            this.upgradesAvailable--;
            this.upgradesPurchased++;
            this.purchaseButtonUpgradeIds.splice(id, 1);

            // Apply the bonus
            switch (upgrade.type) {
                case staticData.UpgradeType.GPS:
                    switch (upgrade.requirementType) {
                        case staticData.UpgradeRequirementType.FOOTMAN:
                            this.footmanUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.CLERIC:
                            this.clericUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.COMMANDER:
                            this.commanderUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.MAGE:
                            this.mageUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.ASSASSIN:
                            this.assassinUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.WARLOCK:
                            this.warlockUpgradesPurchased++;
                            break;
                    }
                    break;
                case staticData.UpgradeType.SPECIAL:
                    switch (upgrade.requirementType) {
                        case staticData.UpgradeRequirementType.FOOTMAN:
                            break;
                        case staticData.UpgradeRequirementType.CLERIC:
                            this.clericSpecialUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.COMMANDER:
                            this.commanderSpecialUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.MAGE:
                            this.mageSpecialUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.ASSASSIN:
                            this.assassinSpecialUpgradesPurchased++;
                            break;
                        case staticData.UpgradeRequirementType.WARLOCK:
                            this.warlockSpecialUpgradesPurchased++;
                            break;
                    }
                    break;
                case staticData.UpgradeType.ATTACK:
                    switch (upgrade.name) {
                        case "Power Strike":
                            if (!this.upgrades[56].purchased) {
                                game.player.changeAttack(staticData.AttackType.POWER_STRIKE);
                            }
                            break;
                        case "Double Strike":
                            game.player.changeAttack(staticData.AttackType.DOUBLE_STRIKE);
                            break;
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

    UpgradeManager.prototype.stopGlowingUpgradesButton = function() {
        this.upgradesButtonGlowing = false;
        $("#upgradesWindowButtonGlow").stop(true);
        $("#upgradesWindowButtonGlow").css('opacity', 0);
        $("#upgradesWindowButtonGlow").css('background', coreUtils.getImageUrl(resources.ImageWindowButtons) + ' 78px 0');
    }

    UpgradeManager.prototype.glowUpgradesButton = function() {
        this.upgradesButtonGlowing = true;
        $("#upgradesWindowButtonGlow").animate({opacity: '+=0.5'}, 400);
        $("#upgradesWindowButtonGlow").animate({opacity: '-=0.5'}, 400, function () {
            include('UserInterface')
            userInterface.glowUpgradesButton();
        });
    }

    UpgradeManager.prototype.save = function() {
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

    UpgradeManager.prototype.load = function() {
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
                    // TODO:
                    /*newDiv.onmouseover = userupgradeButtonMouseOverFactory(newDiv, id);
                     newDiv.onmousedown = upgradeButtonMouseDownFactory(id);
                     newDiv.onmouseup = upgradeButtonMouseOverFactory(newDiv, id);
                     newDiv.onmouseout = upgradeButtonMouseOutFactory(id)*/
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
                    icon.style.background = coreUtils.getImageUrl(resources.ImageBigIcons) + ' ' + currentUpgrade.iconSourceLeft + 'px ' + currentUpgrade.iconSourceTop + 'px';
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
        }
    }

    return new UpgradeManager();

});