declare('StatUpgradeManager', function () {
    include('Component');
    include('StatUpgrade');
    include('StatGenerator');
    include('Static');

    StatUpgradeManager.prototype = component.create();
    StatUpgradeManager.prototype.$super = parent;
    StatUpgradeManager.prototype.constructor = StatUpgradeManager;

    function StatUpgradeManager() {
        this.id = "StatUpgradeManager";

        // The current possible stat upgrades
        this.upgrades = new Array();

        // Add 3 new stat upgrades for the player to choose from
        this.addNewUpgrades = function(upgrade1Type, upgrade1Amount, upgrade2Type, upgrade2Amount, upgrade3Type, upgrade3Amount) {
            var newUpgrades = new Array();
            var upgrade = statUpgrade.create();
            upgrade.init(upgrade1Type, upgrade1Amount);
            newUpgrades.push(upgrade);

            upgrade = statUpgrade.create();
            upgrade.init(upgrade2Type, upgrade2Amount);
            newUpgrades.push(upgrade);

            upgrade = statUpgrade.create();
            upgrade.init(upgrade3Type, upgrade3Amount);
            newUpgrades.push(upgrade);
            this.upgrades.push(newUpgrades);
        }

        // Add 3 random stat upgrades
        this.addRandomUpgrades = function(level) {
            var upgradeTypes = new Array();
            var upgradeIds = new Array();
            var upgradeAmounts = new Array();

            // Assign 3 random stat upgrade types
            var idsRemaining = 3;
            var newId;
            while (idsRemaining >= 0) {
                // Create a random Id
                newId = Math.floor(Math.random() * (static.StatUpgradeType.amount + 1));

                // Check that the new Id hasn't already been generated
                if (upgradeIds.indexOf(newId) == -1) {
                    // If it hasn't, add it to the array and reduce the amount of Ids we need to create
                    upgradeIds.push(newId);
                    idsRemaining--;
                }
            }

            // Asign the types and the amounts for all the Ids
            for (var x = 0; x < upgradeIds.length; x++) {
                switch (upgradeIds[x]) {
                    case 0:
                        upgradeTypes.push(static.StatUpgradeType.DAMAGE);
                        upgradeAmounts.push(statGenerator.getRandomDamageBonus(level));
                        break;
                    case 1:
                        upgradeTypes.push(static.StatUpgradeType.STRENGTH);
                        upgradeAmounts.push(statGenerator.getRandomStrengthBonus(level));
                        break;
                    case 2:
                        upgradeTypes.push(static.StatUpgradeType.AGILITY);
                        upgradeAmounts.push(statGenerator.getRandomAgilityBonus(level));
                        break;
                    case 3:
                        upgradeTypes.push(static.StatUpgradeType.STAMINA);
                        upgradeAmounts.push(statGenerator.getRandomStaminaBonus(level));
                        break;
                    case 4:
                        upgradeTypes.push(static.StatUpgradeType.ARMOUR);
                        upgradeAmounts.push(statGenerator.getRandomArmourBonus(level));
                        break;
                    case 5:
                        upgradeTypes.push(static.StatUpgradeType.HP5);
                        upgradeAmounts.push(statGenerator.getRandomHp5Bonus(level));
                        break;
                    case 6:
                        upgradeTypes.push(static.StatUpgradeType.CRIT_DAMAGE);
                        upgradeAmounts.push(statGenerator.getRandomCritDamageBonus(level));
                        break;
                    case 7:
                        upgradeTypes.push(static.StatUpgradeType.ITEM_RARITY);
                        upgradeAmounts.push(statGenerator.getRandomItemRarityBonus(level));
                        break;
                    case 8:
                        upgradeTypes.push(static.StatUpgradeType.GOLD_GAIN);
                        upgradeAmounts.push(statGenerator.getRandomGoldGainBonus(level));
                        break;
                    case 9:
                        upgradeTypes.push(static.StatUpgradeType.EXPERIENCE_GAIN);
                        upgradeAmounts.push(statGenerator.getRandomExperienceGainBonus(level));
                        break;
                }
            }

            // Add this new set of upgrades
            this.addNewUpgrades(upgradeTypes[0], upgradeAmounts[0], upgradeTypes[1], upgradeAmounts[1], upgradeTypes[2], upgradeAmounts[2]);
        }

        this.save = function() {
            localStorage.statUpgradesSaved = true;
            localStorage.statUpgrades = JSON.stringify(this.upgrades);
        }

        this.load = function() {
            if (localStorage.statUpgradesSaved != null) {
                this.upgrades = JSON.parse(localStorage.statUpgrades);
            }
        }
    }

    return new StatUpgradeManager();
});