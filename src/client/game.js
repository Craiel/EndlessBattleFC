declare("Game", function() {

    function Game() {

        this.version = 0.3;
        this.loading = false;
        this.loadingTextInterval = 0;
        this.loadInterval = 0;

        // Player
        this.player = new Player();
        this.inventory = new Inventory();
        this.equipment = new Equipment();
        this.statGenerator = new StatGenerator();
        this.nameGenerator = new NameGenerator();
        this.statUpgradesManager = new StatUpgradesManager();

        // Other
        this.tooltipManager = new TooltipManager();
        this.questsManager = new QuestsManager();
        this.eventManager = new EventManager();
        this.tutorialManager = new TutorialManager();
        this.stats = new Stats();
        this.options = new Options();

        // Combat
        this.inBattle = false;
        this.battleLevel = 1;
        this.battleDepth = 1;

        // Mercenaries
        this.mercenaryManager = new mercenaryManager();

        // Upgrades
        this.upgradeManager = new UpgradeManager();

        // Particles
        this.particleManager = new ParticleManager();

        // Monsters
        this.monsterCreator = new MonsterCreator();
        this.monster = this.monsterCreator.createRandomMonster(
            this.battleLevel,
            this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
        this.displayMonsterHealth = false;

        // Items
        this.itemCreator = new ItemCreator();

        // Saving/Loading
        this.saveDelay = 10000;
        this.saveTimeRemaining = this.saveDelay;

        this.initialize = function initialize() {
            this.beginLoading();
            this.tutorialManager.initialize();
            this.mercenaryManager.initialize();
            this.upgradeManager.initialize();
            this.particleManager.initialize();

            this.load();

            document.getElementById("version").innerHTML = "Version " + this.version;
        }

        this.beginLoading = function beginLoading() {
            this.loading = true;
            this.loadingTextInterval = setInterval(function () {
                this.loadingInterval++;
                if (this.loadingInterval > 2) {
                    this.loadingInterval = 0;
                    $("#loadingText").html('Loading.');
                }
                else {
                    $("#loadingText").append('.');
                }
            }, 500);
        }

        this.finishLoading = function finishLoading() {
            this.loading = false;
            clearInterval(this.loadingTextInterval);
            $("#loadingArea").hide();
        }

        this.allowBattle = function allowBattle() {
            enterBattleButtonReset();
        }

        this.disallowBattle = function disallowBattle() {
            this.leaveBattle();
            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 25px');
        }

        this.enterBattle = function enterBattle() {
            this.inBattle = true;
            // Create a new monster
            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
            $("#leaveBattleButton").show();
            $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
            $("#monsterHealthBarArea").show();
            game.tutorialManager.battleButtonClicked = true;

            // Hide the battle level buttons
            $("#battleLevelDownButton").hide();
            $("#battleLevelUpButton").hide();

            // Show the action buttons
            $("#attackButton").show();
        }

        this.leaveBattle = function leaveBattle() {
            // Leave the battle and update the interface
            $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 50px');
            this.inBattle = false;
            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
            $("#monsterHealthBarArea").hide();
            $("#leaveBattleButton").hide();

            // Reset the battle depth
            this.resetBattle();

            // Update the tutorial if it is active
            if (this.tutorialManager.currentTutorial == 4) {
                this.tutorialManager.leaveBattleButtonPressed = true;
            }

            // Show the battle level buttons if the player is higher than level 1
            if (this.player.level > 1) {
                $("#battleLevelDownButton").show();
                $("#battleLevelUpButton").show();
            }

            // Hide the attack button and debuffs
            $("#attackButton").hide();
            $("#monsterBleedingIcon").hide();
            $("#monsterBurningIcon").hide();
            $("#monsterChilledIcon").hide();
        }

        this.attack = function attack() {
            // Update the player and monster
            this.player.updateDebuffs();
            this.monster.updateDebuffs();

            // Attack the monster if the player can attack
            var monstersDamageTaken = 0;
            if (game.player.canAttack) {
                // Calculate how many attacks the player will do
                var attackAmount = 1;
                var successfulAttacks = 0;
                if (this.player.attackType == AttackType.DOUBLE_STRIKE) {
                    attackAmount++;
                }

                for (var x = 0; x < attackAmount; x++) {
                    // Calculate the damage
                    var playerMinDamage = this.player.getMinDamage();
                    var playerMaxDamage = this.player.getMaxDamage();
                    var playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                    // If the player is using power strike, multiply the damage
                    if (this.player.attackType == AttackType.POWER_STRIKE) {
                        playerDamage *= 1.5;
                    }

                    // See if the player will crit
                    var criticalHappened = false;
                    if (this.player.getCritChance() >= (Math.random() * 100)) {
                        playerDamage *= (this.player.getCritDamage() / 100);
                        criticalHappened = true;
                    }

                    // If the player has any crushing blows effects then deal the damage from those effects
                    var crushingBlowsEffects = game.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                    var crushingBlowsDamage = 0;
                    if (crushingBlowsEffects.length > 0) {
                        for (var y = 0; y < crushingBlowsEffects.length; y++) {
                            crushingBlowsDamage += crushingBlowsEffects[y].value;
                        }
                        if (crushingBlowsDamage > 0) {
                            this.monster.takeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                        }
                    }
                    this.monster.takeDamage(playerDamage, criticalHappened, true);
                    this.player.useAbilities();
                    successfulAttacks++;

                    // If the player has any Swiftness effects, see if the player generates any extra attacks
                    var swiftnessEffects = game.player.getEffectsOfType(EffectType.SWIFTNESS);
                    for (var z = 0; z < swiftnessEffects.length; z++) {
                        // Try to generate an extra attack
                        if (Math.random() < swiftnessEffects[z].chance / 100) {
                            // Calculate the damage
                            playerMinDamage = this.player.getMinDamage();
                            playerMaxDamage = this.player.getMaxDamage();
                            playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                            // If the player is using power strike, multiply the damage
                            if (this.player.attackType == AttackType.POWER_STRIKE) {
                                playerDamage *= 1.5;
                            }

                            // See if the player will crit
                            criticalHappened = false;
                            if (this.player.getCritChance() >= (Math.random() * 100)) {
                                playerDamage *= (this.player.getCritDamage() / 100);
                                criticalHappened = true;
                            }

                            // If the player has any crushing blows effects then deal the damage from those effects
                            crushingBlowsEffects = game.player.getEffectsOfType(EffectType.CRUSHING_BLOWS);
                            crushingBlowsDamage = 0;
                            if (crushingBlowsEffects.length > 0) {
                                for (var y = 0; y < crushingBlowsEffects.length; y++) {
                                    crushingBlowsDamage += crushingBlowsEffects[y].value;
                                }
                                if (crushingBlowsDamage > 0) {
                                    this.monster.takeDamage((crushingBlowsDamage / 100) * this.monster.health, false, false);
                                }
                            }
                            this.monster.takeDamage(playerDamage, criticalHappened, true);
                            this.player.useAbilities();
                            successfulAttacks++;
                        }
                    }
                }

                // Try to trigger on-hit effects for every attack
                var pillagingEffects = this.player.getEffectsOfType(EffectType.PILLAGING);
                var nourishmentEffects = this.player.getEffectsOfType(EffectType.NOURISHMENT);
                var berserkingEffects = this.player.getEffectsOfType(EffectType.BERSERKING);
                for (var x = 0; x < successfulAttacks; x++) {
                    for (var y = 0; y < pillagingEffects.length; y++) {
                        if (Math.random() < pillagingEffects[y].chance / 100) {
                            game.player.gainGold(pillagingEffects[y].value, true);
                        }
                    }
                    for (var y = 0; y < nourishmentEffects.length; y++) {
                        if (Math.random() < nourishmentEffects[y].chance / 100) {
                            game.player.heal(nourishmentEffects[y].value);
                        }
                    }
                    for (var y = 0; y < berserkingEffects.length; y++) {
                        if (Math.random() < berserkingEffects[y].chance / 100) {
                            game.monster.takeDamage(berserkingEffects[y].value, false, false);
                        }
                    }
                }
            }

            // Have the monster attack if it can and did not die
            var playersDamageTaken = 0;
            if (this.monster.canAttack && this.monster.alive) {
                // See if the player will dodge the attack
                if (Math.random() >= (this.player.calculateEvasionChance() / 100)) {
                    var monsterDamage = this.monster.damage;
                    this.player.takeDamage(monsterDamage);
                    playersDamageTaken = monsterDamage;
                }
            }

            if (this.monster.alive == false) {
                // Add the kill to any quests that require it
                this.questsManager.updateKillCounts(this.monster.level);

                // Get the loot and experience from the monster and reward it to the player
                var loot = this.monster.getRandomLoot();
                this.player.gainGold(loot.gold, true);
                this.stats.goldFromMonsters += this.player.lastGoldGained;
                this.player.gainExperience(this.monster.experienceWorth, true);
                this.stats.experienceFromMonsters += this.player.lastExperienceGained;
                if (loot.item != null) {
                    this.inventory.lootItem(loot.item);
                }

                // Create particles for the loot, experience and kill
                this.particleManager.createParticle(this.player.lastGoldGained.toFixed(2), ParticleType.GOLD);
                this.particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), ParticleType.EXP_ORB);
                this.particleManager.createParticle(null, ParticleType.SKULL);

                // Create a new monster
                this.monster = this.monsterCreator.createRandomMonster(
                    this.battleLevel,
                    this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

                // Hide the debuff icons for the monster
                $("#monsterBleedingIcon").hide();
                $("#monsterBurningIcon").hide();
                $("#monsterChilledIcon").hide();

                // Increase the depth of the battle
                this.battleDepth++;
            }
        }

        this.maxBattleLevelReached = function maxBattleLevelReached() {
            if (this.player.level == this.battleLevel) {
                return true;
            }
            else {
                return false;
            }
        }

        this.increaseBattleLevel = function increaseBattleLevel() {
            if (this.player.level > this.battleLevel) {
                this.battleLevel++;
                this.displayAlert("Battle Level " + game.battleLevel);
            }
        }

        this.decreaseBattleLevel = function decreaseBattleLevel() {
            if (this.battleLevel != 1) {
                this.battleLevel--;
                this.displayAlert("Battle Level " + game.battleLevel);
            }
        }

        this.resetBattle = function resetBattle() {
            this.battleDepth = 1;
        }

        this.displayAlert = function displayAlert(text) {
            $("#battleLevelText").stop(true);
            var battleLevelText = document.getElementById("battleLevelText");
            battleLevelText.style.opacity = '1';
            battleLevelText.style.top = '600px';
            battleLevelText.innerHTML = text;
            $("#battleLevelText").animate({top: '-=50px', opacity: '0'}, 1000);
        }

        // Triggered when the Level Up button is clicked
        this.displayLevelUpWindow = function displayLevelUpWindow() {
            // Hide the Level Up button
            $("#levelUpButton").hide();

            // Display the stat upgrade window or the ability upgrade window depending on the level
            // If the number is divisible by 5 then the player can choose an ability
            if ((this.player.skillPointsSpent + 2) % 5 == 0) {
                $("#abilityUpgradesWindow").show();
            }
            // Else the player can upgrade a stat
            else {
                // Set the upgrade names on the window's buttons
                var upgrades = this.statUpgradesManager.upgrades[0];
                $("#statUpgradesWindow").show();

                switch (upgrades[0].type) {
                    case StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Damage";
                        break;
                    case StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Strength";
                        break;
                    case StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Agility";
                        break;
                    case StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Stamina";
                        break;
                    case StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Armour";
                        break;
                    case StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Hp5";
                        break;
                    case StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Crit Damage";
                        break;
                    case StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Item Rarity";
                        break;
                    case StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Gold Gain";
                        break;
                    case StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Experience Gain";
                        break;
                }

                switch (upgrades[1].type) {
                    case StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Damage";
                        break;
                    case StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Strength";
                        break;
                    case StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Agility";
                        break;
                    case StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Stamina";
                        break;
                    case StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Armour";
                        break;
                    case StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Hp5";
                        break;
                    case StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Crit Damage";
                        break;
                    case StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Item Rarity";
                        break;
                    case StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Gold Gain";
                        break;
                    case StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Experience Gain";
                        break;
                }

                switch (upgrades[2].type) {
                    case StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Damage";
                        break;
                    case StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Strength";
                        break;
                    case StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Agility";
                        break;
                    case StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Stamina";
                        break;
                    case StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Armour";
                        break;
                    case StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Hp5";
                        break;
                    case StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Crit Damage";
                        break;
                    case StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Item Rarity";
                        break;
                    case StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Gold Gain";
                        break;
                    case StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Experience Gain";
                        break;
                }
            }
        }

        this.calculatePowerShardReward = function calculatePowerShardReward() {
            var powerShardsTotal = Math.floor((Math.sqrt(1 + 8 * (this.stats.goldEarned / 1000000000000)) - 1) / 2);
            var powerShardsReward = powerShardsTotal - this.player.powerShards;
            if (powerShardsReward < 0) {
                powerShardsReward = 0;
            }
            return powerShardsReward;
        }

        this.save = function save() {
            if (typeof (Storage) !== "undefined") {
                localStorage.version = this.version;
                this.tutorialManager.save();
                this.inventory.save();
                this.equipment.save();
                this.player.save();
                this.questsManager.save();
                this.mercenaryManager.save();
                this.upgradeManager.save();
                this.statUpgradesManager.save();
                this.stats.save();
                this.options.save();

                localStorage.battleLevel = this.battleLevel;
            }
        }

        this.load = function load() {
            if (typeof (Storage) !== "undefined") {
                this.tutorialManager.load();
                this.inventory.load();
                this.equipment.load();
                this.player.load();
                this.questsManager.load();
                this.mercenaryManager.load();
                this.upgradeManager.load();
                this.statUpgradesManager.load();
                this.stats.load();
                this.options.load();

                // If the player is higher than level 2 then show the battle level buttons
                if (this.player.level > 1) {
                    $("#battleLevelUpButton").show();
                    $("#battleLevelDownButton").show();
                }

                if (localStorage.battleLevel != null) {
                    this.battleLevel = parseInt(localStorage.battleLevel);
                }
                if (this.battleLevel > 1) {
                    $("#battleLevelDownButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
                }
                if (this.maxBattleLevelReached()) {
                    $("#battleLevelUpButton").css('background', 'url("includes/images/battleLevelButton.png") 0 25px');
                }

                this.monster = this.monsterCreator.createRandomMonster(
                    this.battleLevel,
                    this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));
            }
        }

        this.reset = function reset() {
            localStorage.clear();
            // Player
            this.player = new Player();
            this.inventory = new Inventory();
            this.equipment = new Equipment();
            this.statGenerator = new StatGenerator();
            this.nameGenerator = new NameGenerator();
            this.statUpgradesManager = new StatUpgradesManager();

            // Other
            this.questsManager = new QuestsManager();
            this.eventManager = new EventManager();
            this.tutorialManager = new TutorialManager();
            this.stats = new Stats();

            // Combat
            this.inBattle = false;
            this.battleLevel = 1;
            this.battleDepth = 1;

            // Mercenaries
            this.mercenaryManager = new mercenaryManager();

            // Upgrades
            // Remove all the upgrade purchase buttons
            var currentElement;
            for (var x = 0; x < this.upgradeManager.upgradesAvailable; x++) {
                currentElement = document.getElementById('upgradePurchaseButton' + (x + 1));
                currentElement.parentNode.removeChild(currentElement);
            }
            this.upgradeManager = new UpgradeManager();

            // Particles
            this.particleManager = new ParticleManager();

            // Monsters
            this.monsterCreator = new MonsterCreator();
            this.monster = this.monsterCreator.createRandomMonster(
                this.battleLevel,
                this.monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));

            // Items
            this.itemCreator = new ItemCreator();
            // Reset all the inventory and equipment slots
            for (var x = 0; x < this.inventory.slots.length; x++) {
                $("#inventoryItem" + (x + 1)).css('background', 'url("includes/images/NULL.png")');
            }
            for (var x = 0; x < this.equipment.slots.length; x++) {
                $(".equipItem" + (x + 1)).css('background', 'url("includes/images/NULL.png")');
            }

            this.initialize();

            $("#leaveBattleButton").hide();
            $("#battleLevelDownButton").hide();
            $("#battleLevelUpButton").hide();
            $("#monsterHealthBarArea").hide();
            $("#levelUpButton").hide();
            $("#expBarArea").hide();
            $("#attackButton").hide();
            $("#powerStrikeButton").hide();
            $(".characterWindowButton").hide();
            $(".mercenariesWindowButton").hide();
            $(".upgradesWindowButton").hide();
            $("#upgradesWindowButtonGlow").hide();
            $(".questsWindowButton").hide();
            $("#questsWindowButtonGlow").hide();
            $(".inventoryWindowButton").hide();
            $("#tutorialArea").show();

            $("#inventoryWindow").hide();
            $("#characterWindow").hide();
            $("#upgradesWindow").hide();
            $("#mercenariesWindow").hide();
            $("#questsWindow").hide();

            $("#resurrectionBarArea").hide();
            $("#gps").css('color', '#ffd800');
            $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');

            $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 0');
            $("#checkboxWhite").hide();
            $("#checkboxGreen").hide();
            $("#checkboxBlue").hide();
            $("#checkboxPurple").hide();
            $("#checkboxOrange").hide();

            // Reset the mercenary amounts and prices to default
            document.getElementById("footmanCost").innerHTML = this.mercenaryManager.footmanPrice.formatMoney(0);
            document.getElementById("footmenOwned").innerHTML = this.mercenaryManager.footmenOwned;
            document.getElementById("clericCost").innerHTML = this.mercenaryManager.clericPrice.formatMoney(0);
            document.getElementById("clericsOwned").innerHTML = this.mercenaryManager.clericsOwned;
            document.getElementById("commanderCost").innerHTML = this.mercenaryManager.commanderPrice.formatMoney(0);
            document.getElementById("commandersOwned").innerHTML = this.mercenaryManager.commandersOwned;
            document.getElementById("mageCost").innerHTML = this.mercenaryManager.magePrice.formatMoney(0);
            document.getElementById("magesOwned").innerHTML = this.mercenaryManager.magesOwned;
            document.getElementById("assassinCost").innerHTML = this.mercenaryManager.assassinPrice.formatMoney(0);
            document.getElementById("assassinsOwned").innerHTML = this.mercenaryManager.assassinsOwned;
            document.getElementById("warlockCost").innerHTML = this.mercenaryManager.warlockPrice.formatMoney(0);
            document.getElementById("warlocksOwned").innerHTML = this.mercenaryManager.warlocksOwned;
        }

        this.update = function update() {
            var newDate = new Date();
            var ms = (newDate.getTime() - oldDate.getTime());

            // Check if the player is dead
            if (!this.player.alive) {
                // If the player is not already resurrecting then start resurrection
                if (!this.player.resurrecting) {
                    $("#resurrectionBarArea").show();
                    this.player.resurrecting = true;
                    this.player.resurrectionTimeRemaining = this.player.resurrectionTimer;
                    this.disallowBattle();
                    this.player.health = 0;
                    this.mercenaryManager.addGpsReduction(this.mercenaryManager.deathGpsReductionAmount, this.mercenaryManager.deathGpsReductionDuration);
                }
                // Else update the resurrecting
                else {
                    // Update the timer
                    this.player.resurrectionTimeRemaining -= (ms / 1000);

                    // Update the bar
                    $("#resurrectionBar").css('width', (200 * (this.player.resurrectionTimeRemaining / this.player.resurrectionTimer)));
                    $("#resurrectionBar").css('height', '23');
                    document.getElementById("resurrectionBarText").innerHTML = "Resurrecting: " + Math.floor((this.player.resurrectionTimeRemaining / this.player.resurrectionTimer) * 100) + "%";

                    // Check if the player is now alive
                    if (this.player.resurrectionTimeRemaining <= 0) {
                        // Make the player alive
                        this.player.resurrecting = false;
                        this.player.health = 1;
                        this.player.alive = true;

                        // Hide the resurrection bar
                        $("#resurrectionBarArea").hide();

                        // Display the other elements
                        this.allowBattle();
                    }
                }
            }
            // Else if the player is alive
            else {
                // Regenerate the player's health
                this.player.regenerateHealth(ms);
            }

            this.mercenaryManager.update(ms);
            this.inventory.update(ms);
            this.updateInterface(ms);
            this.questsManager.update();
            this.eventManager.update(ms);
            this.tutorialManager.update();
            this.player.update(ms);

            // Save the progress if enough time has passed
            game.saveTimeRemaining -= ms;
            if (game.saveTimeRemaining <= 0) {
                game.saveTimeRemaining = game.saveDelay;
                game.save();
            }

            oldDate = newDate;
        }

        this.updateInterface = function updateInterface(ms) {
            // Update the player's health bar
            var hpBar = $("#playerHealthBar");
            hpBar.css('width', 198 * (this.player.health / this.player.getMaxHealth()));
            hpBar.css('height', '23');
            document.getElementById("playerHealthBarText").innerHTML = Math.floor(this.player.health) + '/' + Math.floor(this.player.getMaxHealth());

            // Update the player's exp bar
            var expBar = $("#expBar");
            expBar.css('width', 718 * (this.player.experience / this.player.experienceRequired));
            expBar.css('height', '13');
            document.getElementById("expBarText").innerHTML = Math.floor(this.player.experience) + '/' + this.player.experienceRequired;

            // Update the monster's health bar
            hpBar = $("#monsterHealthBar");
            hpBar.css('width', 198 * (this.monster.health / this.monster.maxHealth));
            hpBar.css('height', '23');
            hpBar.css('color', game.monsterCreator.getRarityColour(this.monster.rarity));

            // Set the monster's name or health on the screen
            if (this.displayMonsterHealth) {
                document.getElementById("monsterName").innerHTML = Math.floor(this.monster.health) + '/' + Math.floor(this.monster.maxHealth);
                // Set the colour
                $("#monsterName").css('color', game.monsterCreator.getRarityColour(this.monster.rarity));
            }
            else {
                document.getElementById("monsterName").innerHTML = "(Lv" + this.monster.level + ") " + this.monster.name;
                // Set the colour
                $("#monsterName").css('color', this.monsterCreator.getRarityColour(this.monster.rarity));
            }

            // Update the gold and experience amounts
            document.getElementById("goldAmount").innerHTML = this.player.gold.formatMoney(2);

            // Move the gold icon and gold depending on the amount of gold the player has
            var leftReduction = document.getElementById("goldAmount").scrollWidth / 2;
            $("#goldAmount").css('left', (($("#gameArea").width() / 2) - leftReduction) + 'px');
            $("#goldCoin").css('left', (($("#gameArea").width() / 2) - leftReduction - 21) + 'px');

            // Update the upgrades
            this.upgradeManager.update();

            // Update the particles
            this.particleManager.update(ms);

            // Update the player's stats
            document.getElementById("levelValue").innerHTML = this.player.level;
            document.getElementById("healthValue").innerHTML = Math.floor(this.player.health) + '/' + Math.floor(this.player.getMaxHealth());
            document.getElementById("hp5Value").innerHTML = this.player.getHp5().toFixed(2);
            document.getElementById("damageValue").innerHTML = Math.floor(this.player.getMinDamage()) + ' - ' + Math.floor(this.player.getMaxDamage());
            document.getElementById("damageBonusValue").innerHTML = this.player.getDamageBonus() + '%';
            document.getElementById("armourValue").innerHTML = this.player.getArmour().toFixed(2) + ' (' + this.player.calculateDamageReduction().toFixed(2) + '%)';
            document.getElementById("evasionValue").innerHTML = this.player.getEvasion().toFixed(2) + ' (' + this.player.calculateEvasionChance().toFixed(2) + '%)';

            document.getElementById("strengthValue").innerHTML = this.player.getStrength();
            document.getElementById("staminaValue").innerHTML = this.player.getStamina();
            document.getElementById("agilityValue").innerHTML = this.player.getAgility();
            document.getElementById("critChanceValue").innerHTML = this.player.getCritChance().toFixed(2) + '%';
            document.getElementById("critDamageValue").innerHTML = this.player.getCritDamage().toFixed(2) + '%';

            document.getElementById("itemRarityValue").innerHTML = this.player.getItemRarity().toFixed(2) + '%';
            document.getElementById("goldGainValue").innerHTML = this.player.getGoldGain().toFixed(2) + '%';
            document.getElementById("experienceGainValue").innerHTML = this.player.getExperienceGain().toFixed(2) + '%';

            // Update the select quest display
            var quest = this.questsManager.getSelectedQuest();
            if (quest != null) {
                var newText = '';
                // Name
                document.getElementById("questTitle").innerHTML = quest.name;
                // Create the quest goal
                switch (quest.type) {
                    case QuestType.KILL:
                        if (quest.typeAmount == 1) {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                        }
                        else {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                        }
                        break;
                    case QuestType.MERCENARIES:
                        switch (quest.typeId) {
                            case 0:
                                newText = "Own " + quest.typeAmount + " Footmen.";
                                break;
                            case 1:
                                newText = "Own " + quest.typeAmount + " Clerics.";
                                break;
                            case 2:
                                newText = "Own " + quest.typeAmount + " Commanders.";
                                break;
                            case 3:
                                newText = "Own " + quest.typeAmount + " Mages.";
                                break;
                            case 4:
                                newText = "Own " + quest.typeAmount + " Assassins.";
                                break;
                            case 5:
                                newText = "Own " + quest.typeAmount + " Warlocks.";
                                break;
                        }
                        break;
                    case QuestType.UPGRADE:
                        newText = "Purchase the " + this.upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                        break;
                }
                document.getElementById("questGoal").innerHTML = newText;
                // Create the quest progress text
                switch (quest.type) {
                    case QuestType.KILL:
                        newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                        break;
                    case QuestType.MERCENARIES:
                        switch (quest.typeId) {
                            case 0:
                                newText = this.mercenaryManager.footmenOwned + "/" + quest.typeAmount + " Footmen owned.";
                                break;
                            case 1:
                                newText = this.mercenaryManager.clericsOwned + "/" + quest.typeAmount + " Clerics owned.";
                                break;
                            case 2:
                                newText = this.mercenaryManager.commandersOwned + "/" + quest.typeAmount + " Commanders owned.";
                                break;
                            case 3:
                                newText = this.mercenaryManager.magesOwned + "/" + quest.typeAmount + " Mages owned.";
                                break;
                            case 4:
                                newText = this.mercenaryManager.assassinsOwned + "/" + quest.typeAmount + " Assassins owned.";
                                break;
                            case 5:
                                newText = this.mercenaryManager.warlocksOwned + "/" + quest.typeAmount + " Warlocks owned.";
                                break;
                        }
                        break;
                    case QuestType.UPGRADE:
                        break;
                }
                document.getElementById("questProgress").innerHTML = newText;
                // Add the description
                document.getElementById("questDescription").innerHTML = "<br>" + quest.description;
                // Add the reward
                document.getElementById("questReward").innerHTML = "<br>Reward:";
                if (quest.buffReward != null) {
                    document.getElementById("questRewardText").innerHTML = "Completing this quest will empower you with a powerful buff.";
                }
                document.getElementById("questGold").innerHTML = quest.goldReward;
                document.getElementById("questExperience").innerHTML = quest.expReward;
            }
            else {
                $("#questNamesArea").hide();
                $("#questTextArea").hide();
            }

            // Update the stats window
            this.stats.update();
        }
    }


});