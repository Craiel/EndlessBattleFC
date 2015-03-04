declare("Game", function() {
    include('Component');
    include('Player');
    include('Inventory');
    include('Equipment');
    include('Stats');
    include('Options');
    include('Static');
    include('MercenaryManager');
    include('UpgradeManager');
    include('ParticleManager');
    include('MonsterCreator');
    include('ItemCreator');
    include('NameGenerator');
    include('StatUpgradeManager');
    include('QuestManager');
    include('EventManager');
    include('GameState');
    include('Resources');
    include('Save');
    include('SaveKeys');
    include('Data');

    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        this.id = "Game";

        save.register(this, saveKeys.idnGameVersion).asFloat().withDefault(0.3);
        save.register(this, saveKeys.idnGameBattleLevel).asNumber().withDefault(1);
        save.register(this, saveKeys.idnGameBattleDepth).asNumber().withDefault(1);

        this.oldDate = new Date();

        // Player
        this.player = player.create();
        this.player.init();
        this.inventory = inventory.create();
        this.inventory.init();
        this.equipment = equipment.create();
        this.equipment.init();

        // Other
        this.stats = stats.create();
        this.stats.init();
        this.options = options.create();
        this.options.init();

        // Combat
        this.inBattle = false;

        // Monsters
        this.displayMonsterHealth = false;

        // Saving/Loading
        this.autoSaveDelay = 30000; // 30s default
        this.autoSaveTime = 0;

        this.spawnMonster = function() {
            this.monster = monsterCreator.createRandomMonster(
                this[saveKeys.idnGameBattleLevel],
                monsterCreator.calculateMonsterRarity(this[saveKeys.idnGameBattleLevel], this[saveKeys.idnGameBattleDepth]));
            this.monster.init();
        }

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            this.reset();

            this.spawnMonster();

            gameState.init();
            eventManager.init();
            mercenaryManager.init();
            upgradeManager.init();
            particleManager.init();
            questManager.init();

            this.load();
        }

        this.enterBattle = function() {
            this.inBattle = true;
            // Create a new monster
            this.spawnMonster();
        }

        this.leaveBattle = function() {
            if(this.inBattle === false) {
                return;
            }

            // Leave the battle and update the interface
            this.inBattle = false;

            // Reset the battle depth
            this.resetBattle();

            // Hide the attack button and debuffs
            $("#monsterBleedingIcon").hide();
            $("#monsterBurningIcon").hide();
            $("#monsterChilledIcon").hide();
        }

        this.attack = function() {
            if(this.inBattle !== true) {
                return;
            }

            // Update the player and monster
            this.player.updateDebuffs();
            this.monster.updateDebuffs();

            // Attack the monster if the player can attack
            var monstersDamageTaken = 0;
            if (game.player.canAttack) {
                // Calculate how many attacks the player will do
                var attackAmount = 1;
                var successfulAttacks = 0;
                if (this.player.attackType == static.AttackType.DOUBLE_STRIKE) {
                    attackAmount++;
                }

                for (var x = 0; x < attackAmount; x++) {
                    // Calculate the damage
                    var playerMinDamage = this.player.getStat(data.StatDefinition.dmgMin.id);
                    var playerMaxDamage = this.player.getStat(data.StatDefinition.dmgMax.id);
                    var playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                    // If the player is using power strike, multiply the damage
                    if (this.player.attackType == static.AttackType.POWER_STRIKE) {
                        playerDamage *= 1.5;
                    }

                    // See if the player will crit
                    var criticalHappened = false;
                    if (this.player.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                        playerDamage *= (this.player.getStat(data.StatDefinition.critDmg.id) / 100);
                        criticalHappened = true;
                    }

                    // If the player has any crushing blows effects then deal the damage from those effects
                    var crushingBlowsEffects = game.player.getEffectsOfType(static.EffectType.CRUSHING_BLOWS);
                    var crushingBlowsDamage = 0;
                    if (crushingBlowsEffects.length > 0) {
                        for (var y = 0; y < crushingBlowsEffects.length; y++) {
                            crushingBlowsDamage += crushingBlowsEffects[y].value;
                        }
                        if (crushingBlowsDamage > 0) {
                            this.monster.takeDamage((crushingBlowsDamage / 100) * this.monster.getStat(data.StatDefinition.hp.id), false, false);
                        }
                    }
                    this.monster.takeDamage(playerDamage, criticalHappened, true);
                    this.player.useAbilities();
                    successfulAttacks++;

                    // If the player has any Swiftness effects, see if the player generates any extra attacks
                    var swiftnessEffects = game.player.getEffectsOfType(static.EffectType.SWIFTNESS);
                    for (var z = 0; z < swiftnessEffects.length; z++) {
                        // Try to generate an extra attack
                        if (Math.random() < swiftnessEffects[z].chance / 100) {
                            // Calculate the damage
                            playerMinDamage = this.player.getStat(data.StatDefinition.dmgMin.id);
                            playerMaxDamage = this.player.getStat(data.StatDefinition.dmgMax.id);
                            playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                            // If the player is using power strike, multiply the damage
                            if (this.player.attackType == static.AttackType.POWER_STRIKE) {
                                playerDamage *= 1.5;
                            }

                            // See if the player will crit
                            criticalHappened = false;
                            if (this.player.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                                playerDamage *= (this.player.getStat(data.StatDefinition.critDmg.id) / 100);
                                criticalHappened = true;
                            }

                            // If the player has any crushing blows effects then deal the damage from those effects
                            crushingBlowsEffects = game.player.getEffectsOfType(static.EffectType.CRUSHING_BLOWS);
                            crushingBlowsDamage = 0;
                            if (crushingBlowsEffects.length > 0) {
                                for (var y = 0; y < crushingBlowsEffects.length; y++) {
                                    crushingBlowsDamage += crushingBlowsEffects[y].value;
                                }
                                if (crushingBlowsDamage > 0) {
                                    this.monster.takeDamage((crushingBlowsDamage / 100) * this.monster.getStat(data.StatDefinition.hp.id), false, false);
                                }
                            }
                            this.monster.takeDamage(playerDamage, criticalHappened, true);
                            this.player.useAbilities();
                            successfulAttacks++;
                        }
                    }
                }

                // Try to trigger on-hit effects for every attack
                var pillagingEffects = this.player.getEffectsOfType(static.EffectType.PILLAGING);
                var nourishmentEffects = this.player.getEffectsOfType(static.EffectType.NOURISHMENT);
                var berserkingEffects = this.player.getEffectsOfType(static.EffectType.BERSERKING);
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
                questManager.updateKillCounts(this.monster.getLevel());

                // Get the loot and experience from the monster and reward it to the player
                var loot = itemCreator.getRandomLoot(this.monster.getLevel(), this.monster.rarity, this.monster.goldWorth);
                this.player.gainGold(loot.gold, true);
                this.stats.goldFromMonsters += this.player.lastGoldGained;
                this.player.gainExperience(this.monster.experienceWorth, true);
                this.stats.experienceFromMonsters += this.player.lastExperienceGained;
                if (loot.item != null) {
                    this.inventory.lootItem(loot.item);
                }

                // Create particles for the loot, experience and kill
                particleManager.createParticle(this.player.lastGoldGained.toFixed(2), static.ParticleType.GOLD);
                particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), static.ParticleType.EXP_ORB);
                particleManager.createParticle(null, static.ParticleType.SKULL);

                // Create a new monster
                this.spawnMonster();

                // Hide the debuff icons for the monster
                $("#monsterBleedingIcon").hide();
                $("#monsterBurningIcon").hide();
                $("#monsterChilledIcon").hide();

                // Increase the depth of the battle
                this[saveKeys.idnGameBattleDepth]++;
            }
        }

        this.maxBattleLevelReached = function() {
            if (this.player.getLevel() == this[saveKeys.idnGameBattleLevel]) {
                return true;
            }
            else {
                return false;
            }
        }

        this.increaseBattleLevel = function() {
            if (this.player.getLevel() > this[saveKeys.idnGameBattleLevel]) {
                this[saveKeys.idnGameBattleLevel]++;
                return true;
            }

            return false;
        }

        this.decreaseBattleLevel = function() {
            if (this[saveKeys.idnGameBattleLevel] > 1) {
                this[saveKeys.idnGameBattleLevel]--;
                return true;

            }

            return false;
        }

        this.getBattleLevel = function() {
            return this[saveKeys.idnGameBattleLevel];
        }

        this.resetBattle = function resetBattle() {
            this[saveKeys.idnGameBattleDepth] = 1;
        }



        this.calculatePowerShardReward = function calculatePowerShardReward() {
            var powerShardsTotal = Math.floor((Math.sqrt(1 + 8 * (this.stats.goldEarned / 1000000000000)) - 1) / 2);
            var powerShardsReward = powerShardsTotal - this.player.getStat(data.StatDefinition.shards.id);
            if (powerShardsReward < 0) {
                powerShardsReward = 0;
            }
            return powerShardsReward;
        }

        this.save = function() {
            save.save();

            this.inventory.save();
            this.equipment.save();
            questManager.save();
            mercenaryManager.save();
            upgradeManager.save();
            statUpgradeManager.save();
            this.stats.save();
            this.options.save();
        }

        this.load = function() {
            save.load();

            this.inventory.load();
            this.equipment.load();
            questManager.load();
            mercenaryManager.load();
            upgradeManager.load();
            statUpgradeManager.load();
            this.stats.load();
            this.options.load();


            /*if (localStorage.battleLevel != null) {
                this.battleLevel = parseInt(localStorage.battleLevel);
            }
            if (this.battleLevel > 1) {
                $("#battleLevelDownButton").css('background', 'url("' + resources.ImageBattleLevelButton + '") 0 0px');
            }
            if (this.maxBattleLevelReached()) {
                $("#battleLevelUpButton").css('background', 'url("' + resources.ImageBattleLevelButton + '") 0 25px');
            }

            this.monster = monsterCreator.createRandomMonster(
                this.battleLevel,
                monsterCreator.calculateMonsterRarity(this.battleLevel, this.battleDepth));*/
        }

        this.reset = function() {

            // Combat
            save.reset();

            // Upgrades
            // Remove all the upgrade purchase buttons
            var currentElement;
            for (var x = 0; x < upgradeManager.upgradesAvailable; x++) {
                currentElement = document.getElementById('upgradePurchaseButton' + (x + 1));
                currentElement.parentNode.removeChild(currentElement);
            }

            // Monsters
            this.spawnMonster();

            // Reset all the inventory and equipment slots
            for (var x = 0; x < this.inventory.slots.length; x++) {
                $("#inventoryItem" + (x + 1)).css('background', 'url("' + resources.ImageNull + '")');
            }
            for (var x = 0; x < this.equipment.slots.length; x++) {
                $(".equipItem" + (x + 1)).css('background', 'url("' + resources.ImageNull + '")');
            }

            /*$("#expBarArea").hide();
            $("#powerStrikeButton").hide();
            $(".characterWindowButton").hide();
            $(".mercenariesWindowButton").hide();
            $(".upgradesWindowButton").hide();
            $("#upgradesWindowButtonGlow").hide();
            $(".questsWindowButton").hide();
            $("#questsWindowButtonGlow").hide();

            $("#inventoryWindow").hide();
            $("#characterWindow").hide();
            $("#upgradesWindow").hide();
            $("#mercenariesWindow").hide();
            $("#questsWindow").hide();*/

            $("#gps").css('color', '#ffd800');

            /*$("#checkboxWhite").hide();
            $("#checkboxGreen").hide();
            $("#checkboxBlue").hide();
            $("#checkboxPurple").hide();
            $("#checkboxOrange").hide();*/

            // Reset the mercenary amounts and prices to default
            document.getElementById("footmanCost").innerHTML = gameState.footmanPrice.formatMoney(0);
            document.getElementById("footmenOwned").innerHTML = gameState.footmenOwned;
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

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            var newDate = new Date();
            this.oldDate = newDate;

            if(this.player.alive !== true) {
                this.leaveBattle();
            }

            // old death mechanic
            // Check if the player is dead
            /*if (!this.player.alive) {
                this.leaveBattle();

                // If the player is not already resurrecting then start resurrection
                if (!this.player.resurrecting) {

                    this.player.resurrecting = true;
                    this.player.resurrectionTimeRemaining = this.player.resurrectionTimer;
                    this.leaveBattle();
                    this.player.setStat(data.StatDefinition.hp.id, 0);
                    mercenaryManager.addGpsReduction(static.deathGpsReductionAmount, static.deathGpsReductionDuration);
                }
                // Else update the resurrecting
                else {
                    // Update the timer
                    this.player.resurrectionTimeRemaining -= (gameTime.elapsed / 1000);

                    // Update the bar


                    // Check if the player is now alive
                    if (this.player.resurrectionTimeRemaining <= 0) {
                        // Make the player alive
                        this.player.resurrecting = false;
                        this.player.setStat(data.StatDefinition.hp.id, 1);
                        this.player.alive = true;

                        // Hide the resurrection bar

                    }
                }
            }*/

            gameState.update(gameTime)
            mercenaryManager.update(gameTime);
            this.inventory.update(gameTime);
            this.updateInterface(gameTime.elapsed);
            questManager.update(gameTime);
            eventManager.update(gameTime);
            upgradeManager.update(gameTime);
            particleManager.update(gameTime);
            this.stats.update(gameTime);
            this.player.update(gameTime);

            if(this.monster !== undefined) {
                this.monster.update(gameTime);
            }

            this.updateAutoSave(gameTime);

            oldDate = newDate;

            return true;
        }

        this.updateAutoSave = function(gameTime) {
            // Save the progress if enough time has passed
            if(this.autoSaveTime <= 0) {
                // Skip the first auto save cycle
                this.autoSaveTime = gameTime.current;
            } else if (gameTime.current > this.autoSaveTime + this.autoSaveDelay) {
                this.save();
                this.autoSaveTime = gameTime.current;
            }
        }

        this.updateInterface = function(ms) {
            // Update the player's health bar


            // Update the gold and experience amounts
            document.getElementById("goldAmount").innerHTML = this.player.getStat(data.StatDefinition.gold.id).formatMoney(2);

            // Move the gold icon and gold depending on the amount of gold the player has
            var leftReduction = document.getElementById("goldAmount").scrollWidth / 2;
            $("#goldAmount").css('left', (($("#gameArea").width() / 2) - leftReduction) + 'px');
            $("#goldCoin").css('left', (($("#gameArea").width() / 2) - leftReduction - 21) + 'px');

            // Update the player's stats
            document.getElementById("levelValue").innerHTML = this.player.getLevel();
            document.getElementById("healthValue").innerHTML = Math.floor(this.player.getStat(data.StatDefinition.hp.id)) + '/' + this.player.getStat(data.StatDefinition.hpMax.id);
            document.getElementById("hp5Value").innerHTML = this.player.getStat(data.StatDefinition.hp5.id).toFixed(2);
            document.getElementById("damageValue").innerHTML = this.player.getStat(data.StatDefinition.dmgMin.id) + ' - ' + this.player.getStat(data.StatDefinition.dmgMax.id);
            document.getElementById("damageBonusValue").innerHTML = this.player.getStat(data.StatDefinition.dmgMult.id) + '%';
            document.getElementById("armourValue").innerHTML = this.player.getStat(data.StatDefinition.armor.id).toFixed(2) + ' (' + this.player.calculateDamageReduction().toFixed(2) + '%)';
            document.getElementById("evasionValue").innerHTML = this.player.getStat(data.StatDefinition.evaRate.id).toFixed(2) + ' (' + this.player.calculateEvasionChance().toFixed(2) + '%)';

            document.getElementById("strengthValue").innerHTML = this.player.getStat(data.StatDefinition.str.id);
            document.getElementById("staminaValue").innerHTML = this.player.getStat(data.StatDefinition.sta.id);
            document.getElementById("agilityValue").innerHTML = this.player.getStat(data.StatDefinition.agi.id);
            document.getElementById("critChanceValue").innerHTML = this.player.getStat(data.StatDefinition.critRate.id).toFixed(2) + '%';
            document.getElementById("critDamageValue").innerHTML = this.player.getStat(data.StatDefinition.critDmg.id).toFixed(2) + '%';

            document.getElementById("itemRarityValue").innerHTML = this.player.getStat(data.StatDefinition.magicFind.id).toFixed(2) + '%';
            document.getElementById("goldGainValue").innerHTML = this.player.getStat(data.StatDefinition.goldMult.id).toFixed(2) + '%';
            document.getElementById("experienceGainValue").innerHTML = this.player.getStat(data.StatDefinition.xpMult.id).toFixed(2) + '%';

            // Update the select quest display
            var quest = questManager.getSelectedQuest();
            if (quest != null) {
                var newText = '';
                // Name
                document.getElementById("questTitle").innerHTML = quest.name;
                // Create the quest goal
                switch (quest.type) {
                    case static.QuestType.KILL:
                        if (quest.typeAmount == 1) {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                        }
                        else {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                        }
                        break;
                    case static.QuestType.MERCENARIES:
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
                    case static.QuestType.UPGRADE:
                        newText = "Purchase the " + upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                        break;
                }
                document.getElementById("questGoal").innerHTML = newText;
                // Create the quest progress text
                switch (quest.type) {
                    case static.QuestType.KILL:
                        newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                        break;
                    case static.QuestType.MERCENARIES:
                        switch (quest.typeId) {
                            case 0:
                                newText = gameState.footmenOwned + "/" + quest.typeAmount + " Footmen owned.";
                                break;
                            case 1:
                                newText = gameState.clericsOwned + "/" + quest.typeAmount + " Clerics owned.";
                                break;
                            case 2:
                                newText = gameState.commandersOwned + "/" + quest.typeAmount + " Commanders owned.";
                                break;
                            case 3:
                                newText = gameState.magesOwned + "/" + quest.typeAmount + " Mages owned.";
                                break;
                            case 4:
                                newText = gameState.assassinsOwned + "/" + quest.typeAmount + " Assassins owned.";
                                break;
                            case 5:
                                newText = gameState.warlocksOwned + "/" + quest.typeAmount + " Warlocks owned.";
                                break;
                        }
                        break;
                    case static.QuestType.UPGRADE:
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
        }
    }

    return new Game();

});