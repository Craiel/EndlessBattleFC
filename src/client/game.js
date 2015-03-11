declare('Game', function() {
    include('Log');
    include('Assert');
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
    include('CombatUtils');

    Game.prototype = component.create();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        this.id = "Game";

        save.register(this, saveKeys.idnGameVersion).asFloat().withDefault(0.3);
        save.register(this, saveKeys.idnGameBattleLevel).asNumber().withDefault(1);
        save.register(this, saveKeys.idnGameBattleDepth).asNumber().withDefault(1);

        save.register(this, saveKeys.idnMercenariesPurchased).asJson().withDefault({}).withCallback(false, true, false);

        this.autoSaveDelay = 30000; // 30s default
        this.autoSaveTime = undefined;

        this.mercenaryGps = 0;
        this.mercenaryGpsTime = 0;
        this.mercenaryGpsDelay = 1000;

        this.inBattle = false;

        this.player = player.create();

        this.monsters = {
            Center: undefined,
            Left: undefined,
            Right: undefined,
            Back1: undefined,
            Back2: undefined,
            Back3: undefined,
            Back4: undefined
        }

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            statUtils.init();
            generatorMonster.init();

            this.player.init();

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

            this.mercenaryGpsTime = coreUtils.processInterval(gameTime, this.mercenaryGpsTime, this.mercenaryGpsDelay, this, function(self, value) { self.gainGold(value, staticData.GoldSourceMercenary); }, this.mercenaryGps);

            // Update the player
            this.updatePlayers(gameTime);

            // Update the monsters
            this.updateMonsters(gameTime);

            // Update misc components
            this.updateAutoSave(gameTime);

            /////////////////////TODO: Remove / refactor below


            gameState.update(gameTime)
            this.inventory.update(gameTime);
            questManager.update(gameTime);
            eventManager.update(gameTime);
            upgradeManager.update(gameTime);
            particleManager.update(gameTime);
            this.stats.update(gameTime);

            if(this.monster !== undefined) {
                this.monster.update(gameTime);
            }

            return true;
        }

        this.updateAutoSave = function(gameTime) {
            if(this.autoSaveTime  === undefined) {
                // Skip the first auto save cycle
                this.autoSaveTime = gameTime.current;
                return;
            }

            if (gameTime.current > this.autoSaveTime + this.autoSaveDelay) {
                this.save();
                this.autoSaveTime = gameTime.current;
            }
        }

        // ---------------------------------------------------------------------------
        // player functions
        // ---------------------------------------------------------------------------
        this.updatePlayers = function(gameTime) {
            this.player.update(gameTime);
            if(this.player.alive !== true) {
                this.leaveBattle();
            }
        }

        this.gainXp = function(value, source) {
            if(isNaN(value) || value === undefined) {
                return;
            }

            // Todo: Apply modifiers etc
            this.player.modifyStat(data.StatDefinition.xp.id, value);
        }

        this.gainGold = function(value, source) {
            if(isNaN(value) || value === undefined) {
                return;
            }

            // Todo: Apply modifiers etc
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

        // ---------------------------------------------------------------------------
        // monster functions
        // ---------------------------------------------------------------------------
        this.updateMonsters = function(gameTime) {
            for(var key in this.monsters) {
                if(this.monsters[key] === undefined) {
                    continue;
                }

                this.monsters[key].update(gameTime);

                if(this.monsters[key].alive !== true) {
                    this.killMonster(key);
                }
            }
        }

        this.killMonster = function(position) {
            assert.isDefined(this.monsters[position], "Tried to kill non-existing monster");

            var xp = this.monsters[position].getStat(data.StatDefinition.xp);
            var gold = this.monsters[position].getStat(data.StatDefinition.gold);

            this.gainXP(xp, staticData.XpSourceMonster);
            this.gainGold(gold, staticData.GoldSourceMonster);

            this.monsters[position].remove();
            this.monsters[position] = undefined;
        }

        this.despawnMonsters = function() {
            for(var key in this.monsters) {
                if(this.monsters[key] !== undefined) {
                    this.monsters[key].remove();
                }

                this.monsters[key] = undefined;
            }
        }

        this.respawnMonsters = function() {
            this.despawnMonsters();

            // Todo
            var level = this[saveKeys.idnGameBattleLevel];
            this.monsters.Center = generatorMonster.generate(level);
            this.monsters.Center.init();
            this.monsters.Center.level = level;
            this.monsters.Center.heal();
        }

        // ---------------------------------------------------------------------------
        // battle functions
        // ---------------------------------------------------------------------------
        this.changeBattleLevel = function(value) {
            this[saveKeys.idnGameBattleLevel] += value;
            this.checkBattleLevel();
        }

        this.checkBattleLevel = function() {
            var max = this.player.getLevel();
            if(this[saveKeys.idnGameBattleLevel] <= 0) {
                this[saveKeys.idnGameBattleLevel] = 1;
            } else if (this[saveKeys.idnGameBattleLevel] > max) {
                this[saveKeys.idnGameBattleLevel] = max;
            }
        }

        this.getBattleLevel = function() {
            return this[saveKeys.idnGameBattleLevel];
        }

        this.setBattleLevel = function(value) {
            this[saveKeys.idnGameBattleDepth] = value;
            this.checkBattleLevel();
        }

        this.enterBattle = function() {
            assert.isFalse(this.inBattle);
            this.inBattle = true;

            this.respawnMonsters();

            // Legacy
            this.spawnMonster();
        }

        this.leaveBattle = function() {
            assert.isTrue(this.inBattle);

            this.inBattle = false;

            this.despawnMonsters();
        }

        // ---------------------------------------------------------------------------
        // save / load functions
        // ---------------------------------------------------------------------------
        this.save = function() {
            save.save();

            this.legacySave();
        }

        this.load = function() {
            save.load();
            this.legacyLoad();
        }

        this.reset = function() {
            save.reset();
            this.legacyReset();
        }

        this.onLoad = function() {
            // Perform some initial operation after being loaded
            this.calculateMercenaryGps();
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Unchecked code below
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Player

        this.inventory = inventory.create();
        this.inventory.init();
        this.equipment = equipment.create();
        this.equipment.init();

        // Other
        this.stats = stats.create();
        this.stats.init();
        this.options = options.create();
        this.options.init();



        this.spawnMonster = function() {
            this.monster = monsterCreator.createRandomMonster(
                this[saveKeys.idnGameBattleLevel],
                monsterCreator.calculateMonsterRarity(this[saveKeys.idnGameBattleLevel], this[saveKeys.idnGameBattleDepth]));
            this.monster.init();
        }


        this.attack = function() {
            combatUtils.resolveCombatTick(this.player, this.monsters.Center);
        }


        this.attackOld = function() {
            if(this.inBattle !== true) {
                return;
            }

            // Update the player and monster
            this.player.updateDebuffs();
            this.monster.updateDebuffs();

            // Attack the monster if the player can attack
            var monstersDamageTaken = 0;
            if (game.player.canAttack) {
                // Calculate the damage
                var playerMinDamage = this.player.getStat(data.StatDefinition.dmgMin.id);
                var playerMaxDamage = this.player.getStat(data.StatDefinition.dmgMax.id);
                var playerDamage = playerMinDamage + coreUtils.getRandomInt(playerMinDamage, playerMaxDamage);


                // See if the player will crit
                var criticalHappened = false;
                if (this.player.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                    playerDamage *= (this.player.getStat(data.StatDefinition.critDmg.id) / 100);
                    criticalHappened = true;
                }

                this.monster.takeDamage(playerDamage, criticalHappened, true);
                this.player.useAbilities();
                successfulAttacks++;
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
                //particleManager.createParticle(this.player.lastGoldGained.toFixed(2), staticData.ParticleType.GOLD);
                //particleManager.createParticle(this.player.lastExperienceGained.toFixed(2), staticData.ParticleType.EXP_ORB);
                //particleManager.createParticle(null, staticData.ParticleType.SKULL);

                // Create a new monster
                this.spawnMonster();
            }
        }





        this.calculatePowerShardReward = function calculatePowerShardReward() {
            var powerShardsTotal = Math.floor((Math.sqrt(1 + 8 * (this.stats.goldEarned / 1000000000000)) - 1) / 2);
            var powerShardsReward = powerShardsTotal - this.player.getStat(data.StatDefinition.shards.id);
            if (powerShardsReward < 0) {
                powerShardsReward = 0;
            }
            return powerShardsReward;
        }

        this.legacySave = function() {
            this.inventory.save();
            this.equipment.save();
            questManager.save();
            upgradeManager.save();
            statUpgradeManager.save();
            this.stats.save();
            this.options.save();
        }

        this.legacyLoad = function() {
            this.inventory.load();
            this.equipment.load();
            questManager.load();
            upgradeManager.load();
            statUpgradeManager.load();
            this.stats.load();
            this.options.load();
        }

        this.legacyReset = function() {
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






    }

    return new Game();

});