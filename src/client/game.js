declare('Game', function() {
    include('Log');
    include('Component');
    include('Player');
    include('Inventory');
    include('Equipment');
    include('Stats');
    include('Options');
    include('StaticData');
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
    include('CoreUtils');
    include('GeneratorMonster');
    include('StatUtils');

    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        this.id = "Game";

        save.register(this, saveKeys.idnGameVersion).asFloat().withDefault(0.3);
        save.register(this, saveKeys.idnGameBattleLevel).asNumber().withDefault(1);
        save.register(this, saveKeys.idnGameBattleDepth).asNumber().withDefault(1);

        save.register(this, saveKeys.idnMercenariesPurchased).asJson().withDefault({}).withCallback(false, true, false);

        this.mercenaryGps = 0;
        this.mercenaryGpsTime = 0;
        this.mercenaryGpsDelay = 1000;

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            statUtils.init();
            generatorMonster.init();

            ////////////////////// TODO: Remove / refactor below
            this.reset();

            gameState.init();
            eventManager.init();
            upgradeManager.init();
            particleManager.init();
            questManager.init();

            this.load();
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            this.mercenaryGpsTime = coreUtils.processInterval(gameTime, this.mercenaryGpsTime, this.mercenaryGpsDelay, this, function(self, value) { self.gainMercenaryGold(value); }, this.mercenaryGps);

            /////////////////////TODO: Remove / refactor below
            var newDate = new Date();
            this.oldDate = newDate;

            if(this.player.alive !== true) {
                this.leaveBattle();
            }

            gameState.update(gameTime)
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
                this.testMonster.update(gameTime);
            }

            this.updateAutoSave(gameTime);

            oldDate = newDate;

            return true;
        }

        // ---------------------------------------------------------------------------
        // player functions
        // ---------------------------------------------------------------------------
        this.gainMercenaryGold = function(value) {
            if(isNaN(value) || value === undefined) {
                return;
            }

            this.player.modifyStat(data.StatDefinition.gold.id, value);
        }

        // ---------------------------------------------------------------------------
        // mercenary functions
        // ---------------------------------------------------------------------------
        this.purchaseMercenary = function(key) {
            var cost = this.getMercenaryCost(key);
            if(this.player.getStat(data.StatDefinition.gold.id) < cost) {
                return;
            }

            this.player.modifyStat(data.StatDefinition.gold.id, -cost);

            if(this[saveKeys.idnMercenariesPurchased][key] === undefined) {
                this[saveKeys.idnMercenariesPurchased][key] = 0;
            }

            this[saveKeys.idnMercenariesPurchased][key]++;
            this.calculateMercenaryGps();
        }

        this.getMercenaryCost = function(key) {
            var owned = this.getMercenaryCount(key);
            return Math.floor(data.Mercenaries[key].gold * Math.pow(staticData.mercenaryPriceIncreaseFactor, owned));
        }

        this.getMercenaryCount = function(key) {
            if(this[saveKeys.idnMercenariesPurchased][key] === undefined) {
                return 0;
            }

            return this[saveKeys.idnMercenariesPurchased][key];
        }

        this.mercenaryGps = function(key) {
            return this.mercenaryGps;
        }

        this.calculateMercenaryGps = function() {
            var gps = 0;
            for(key in this[saveKeys.idnMercenariesPurchased]) {
                var baseValue = data.Mercenaries[key].gps * this[saveKeys.idnMercenariesPurchased][key];
                gps += baseValue;
            }

            this.mercenaryGps = gps;
        }

        this.updateProcessMercenaryGps = function(gameTime) {

        }

        // ---------------------------------------------------------------------------
        // save / load functions
        // ---------------------------------------------------------------------------
        this.onLoad = function() {
            // Perform some initial operation after being loaded
            this.calculateMercenaryGps();

            this.testMonster = generatorMonster.generate(this[saveKeys.idnGameBattleLevel]);
            this.testMonster.init();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Unchecked code below
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        this.testMonster = undefined;
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
                if (this.player.attackType == staticData.AttackType.DOUBLE_STRIKE) {
                    attackAmount++;
                }

                for (var x = 0; x < attackAmount; x++) {
                    // Calculate the damage
                    var playerMinDamage = this.player.getStat(data.StatDefinition.dmgMin.id);
                    var playerMaxDamage = this.player.getStat(data.StatDefinition.dmgMax.id);
                    var playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                    // If the player is using power strike, multiply the damage
                    if (this.player.attackType == staticData.AttackType.POWER_STRIKE) {
                        playerDamage *= 1.5;
                    }

                    // See if the player will crit
                    var criticalHappened = false;
                    if (this.player.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                        playerDamage *= (this.player.getStat(data.StatDefinition.critDmg.id) / 100);
                        criticalHappened = true;
                    }

                    // If the player has any crushing blows effects then deal the damage from those effects
                    var crushingBlowsEffects = game.player.getEffectsOfType(staticData.EffectType.CRUSHING_BLOWS);
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
                    var swiftnessEffects = game.player.getEffectsOfType(staticData.EffectType.SWIFTNESS);
                    for (var z = 0; z < swiftnessEffects.length; z++) {
                        // Try to generate an extra attack
                        if (Math.random() < swiftnessEffects[z].chance / 100) {
                            // Calculate the damage
                            playerMinDamage = this.player.getStat(data.StatDefinition.dmgMin.id);
                            playerMaxDamage = this.player.getStat(data.StatDefinition.dmgMax.id);
                            playerDamage = playerMinDamage + (Math.random() * (playerMaxDamage - playerMinDamage));

                            // If the player is using power strike, multiply the damage
                            if (this.player.attackType == staticData.AttackType.POWER_STRIKE) {
                                playerDamage *= 1.5;
                            }

                            // See if the player will crit
                            criticalHappened = false;
                            if (this.player.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                                playerDamage *= (this.player.getStat(data.StatDefinition.critDmg.id) / 100);
                                criticalHappened = true;
                            }

                            // If the player has any crushing blows effects then deal the damage from those effects
                            crushingBlowsEffects = game.player.getEffectsOfType(staticData.EffectType.CRUSHING_BLOWS);
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
                var pillagingEffects = this.player.getEffectsOfType(staticData.EffectType.PILLAGING);
                var nourishmentEffects = this.player.getEffectsOfType(staticData.EffectType.NOURISHMENT);
                var berserkingEffects = this.player.getEffectsOfType(staticData.EffectType.BERSERKING);
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
                    game.player.giveItem(loot.item);
                    this.inventory.lootItem(loot.item);
                }

                // Create particles for the loot, experience and kill
                particleManager.createParticle(this.player.lastGoldGained.toFixed(2), staticData.ParticleType.GOLD);
                particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), staticData.ParticleType.EXP_ORB);
                particleManager.createParticle(null, staticData.ParticleType.SKULL);

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

            $("#gps").css('color', '#ffd800');
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

            // Update the player's stats
            document.getElementById("levelValue").innerHTML = this.player.getLevel();
            document.getElementById("healthValue").innerHTML = Math.floor(this.player.getStat(data.StatDefinition.hp.id)) + '/' + this.player.getStat(data.StatDefinition.hpMax.id);
            document.getElementById("hp5Value").innerHTML = this.player.getStat(data.StatDefinition.hp5.id).toFixed(2);
            document.getElementById("damageValue").innerHTML = this.player.getStat(data.StatDefinition.dmgMin.id) + ' - ' + this.player.getStat(data.StatDefinition.dmgMax.id);
            document.getElementById("damageBonusValue").innerHTML = this.player.getStat(data.StatDefinition.dmgMult.id) + '%';
            document.getElementById("armorValue").innerHTML = this.player.getStat(data.StatDefinition.armor.id).toFixed(2) + ' (' + this.player.calculateDamageReduction().toFixed(2) + '%)';
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
                    case staticData.QuestType.KILL:
                        if (quest.typeAmount == 1) {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                        }
                        else {
                            newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                        }
                        break;
                    case staticData.QuestType.UPGRADE:
                        newText = "Purchase the " + upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                        break;
                }
                document.getElementById("questGoal").innerHTML = newText;
                // Create the quest progress text
                switch (quest.type) {
                    case staticData.QuestType.KILL:
                        newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                        break;
                    case staticData.QuestType.UPGRADE:
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