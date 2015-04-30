declare('Game', function() {
    include('Debug');
    include('Assert');
    include('Component');
    include('Player');
    include('StaticData');
    include('Save');
    include('SaveKeys');
    include('GameData');
    include('CoreUtils');
    include('GeneratorMonster');
    include('GeneratorItem');
    include('StatUtils');
    include('CombatUtils');
    include('EventAggregate');
    include('CombatSystem');

    Game.prototype = component.prototype();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        component.construct(this);

        this.id = "Game";

        save.register(this, saveKeys.idnGameVersion).asFloat().withDefault(0.3);
        save.register(this, saveKeys.idnGameBattleLevel).asNumber().withDefault(1);
        save.register(this, saveKeys.idnGameBattleDepth).asNumber().withDefault(1);

        save.register(this, saveKeys.idnMercenariesPurchased).asJson().withDefault({}).withCallback(false, true, false);

        this.autoSaveDelay = 30000; // 30s default
        this.autoSaveTime = undefined;

        this.versionCheckDelay = 12000;
        this.versionCheckTime = undefined;
        this.versionCheckData = undefined;

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
        };
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Game.prototype.componentInit = Game.prototype.init;
    Game.prototype.init = function() {
        this.componentInit();

        statUtils.init();
        generatorMonster.init();
        generatorItem.init();
        combatSystem.init(this);

        this.player.init();

        ////////////////////// TODO: Remove / refactor below
        this.reset();
        this.load();
    };

    Game.prototype.componentUpdate = Game.prototype.update;
    Game.prototype.update = function(gameTime) {
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
        this.updateVersionCheck(gameTime);

        combatSystem.update(gameTime);

        return true;
    };

    // ---------------------------------------------------------------------------
    // game functions
    // ---------------------------------------------------------------------------
    Game.prototype.getCurrentVersion = function() {
        return this[saveKeys.idnGameVersion];
    };

    Game.prototype.getVersionCheckData = function() {
        return this.versionCheckData;
    };

    Game.prototype.updateAutoSave = function(gameTime) {
        if(this.autoSaveTime  === undefined) {
            // Skip the first auto save cycle
            this.autoSaveTime = gameTime.current;
            return;
        }

        if (gameTime.current > this.autoSaveTime + this.autoSaveDelay) {
            this.save();
            this.autoSaveTime = gameTime.current;
        }
    };

    Game.prototype.updateVersionCheck = function(gameTime) {
        if(this.versionCheckTime  === undefined) {
            // Skip the first auto save cycle
            this.versionCheckTime = gameTime.current;
            return;
        }

        if (gameTime.current > this.versionCheckTime + this.versionCheckDelay) {
            $.ajax({
                url : staticData.versionFile,
                success : this.handleVersionCheckResult(this)
            });

            this.versionCheckTime = gameTime.current;
        }
    };

    Game.prototype.handleVersionCheckResult = function(self) {
        return function(data, textStatus, jqXHR) {
            self.versionCheckData = JSON.parse(data);
        };
    };

    // ---------------------------------------------------------------------------
    // player functions
    // ---------------------------------------------------------------------------
    Game.prototype.updatePlayers = function(gameTime) {
        this.player.update(gameTime);
        if(this.player.alive !== true && this.inBattle === true) {
            this.leaveBattle();
        }
    };

    Game.prototype.gainXp = function(value, source) {
        if(isNaN(value) || value === undefined) {
            return;
        }

        // Todo: Apply modifiers etc
        this.player.modifyStat(gameData.StatDefinition.xp.id, value);

        eventAggregate.publish(staticData.EventXpGain, { value: value });
    };

    Game.prototype.gainGold = function(value, source) {
        if(isNaN(value) || value === undefined) {
            return;
        }

        // Todo: Apply modifiers etc
        this.player.modifyStat(gameData.StatDefinition.gold.id, value);

        // Report gold gain from sources that qualify
        if(source !== staticData.GoldSourceMercenary) {
            eventAggregate.publish(staticData.EventGoldGain, {value: value});
        }
    };

    Game.prototype.gainItem = function(item, source) {
        if(item === undefined) {
            return;
        }

        this.player.receiveItem(item);
    };

    Game.prototype.gainRandomItem = function() {
        item = this.generateRandomItem(this.player.level);
        this.gainItem(item, staticData.ItemSourceUnknown);
    }

    Game.prototype.spendStatPoint = function(statId) {
        if(this.player.getStatPoints() <= 0) {
            return;
        }

        var stat = gameData.StatDefinition[statId];
        if(stat === undefined) {
            return;
        }

        this.player.modifyStat(stat.id, 1);
        this.player.modifyStatPoints(-1);
    };

    // ---------------------------------------------------------------------------
    // mercenary functions
    // ---------------------------------------------------------------------------
    Game.prototype.purchaseMercenary = function(key) {
        var cost = this.getMercenaryCost(key);
        if(this.player.getStat(gameData.StatDefinition.gold.id) < cost) {
            return;
        }

        this.player.modifyStat(gameData.StatDefinition.gold.id, -cost);

        if(this[saveKeys.idnMercenariesPurchased][key] === undefined) {
            this[saveKeys.idnMercenariesPurchased][key] = 0;
        }

        this[saveKeys.idnMercenariesPurchased][key]++;
        this.calculateMercenaryGps();
    };

    Game.prototype.getMercenaryCost = function(key) {
        var owned = this.getMercenaryCount(key);
        return Math.floor(gameData.Mercenaries[key].gold * Math.pow(staticData.mercenaryPriceIncreaseFactor, owned));
    };

    Game.prototype.getMercenaryCount = function(key) {
        if(this[saveKeys.idnMercenariesPurchased][key] === undefined) {
            return 0;
        }

        return this[saveKeys.idnMercenariesPurchased][key];
    };

    Game.prototype.mercenaryGps = function(key) {
        return this.mercenaryGps;
    };

    Game.prototype.calculateMercenaryGps = function() {
        var gps = 0;
        for(key in this[saveKeys.idnMercenariesPurchased]) {
            var baseValue = gameData.Mercenaries[key].gps * this[saveKeys.idnMercenariesPurchased][key];
            gps += baseValue;
        }

        this.mercenaryGps = gps;
    };

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    Game.prototype.getMonsters = function() {
        return this.monsters;
    };

    Game.prototype.updateMonsters = function(gameTime) {
        var aliveMonsters = 0;
        for(var key in this.monsters) {
            if(this.monsters[key] === undefined) {
                continue;
            }

            this.monsters[key].update(gameTime);

            if(this.monsters[key].alive !== true) {
                this.killMonster(key);
            } else {
                aliveMonsters++;
            }
        }

        // For now we just respawn if everything is dead
        if(aliveMonsters <= 0) {
            this.respawnMonsters();
        }
    };

    Game.prototype.killMonster = function(position) {
        assert.isDefined(this.monsters[position], "Tried to kill non-existing monster");

        var monster = this.monsters[position];
        var xp = Math.floor(monster.getStat(gameData.StatDefinition.xp.id) * monster.getStat(gameData.StatDefinition.xpMult.id));
        var gold = Math.floor(monster.getStat(gameData.StatDefinition.gold.id) * monster.getStat(gameData.StatDefinition.goldMult.id));

        if(xp <= 0 || gold <= 0) {
            debug.logWarning("Warning, Monster gave no gold or xp!");
        }

        // For now just flat chance of 15% to spawn an item
        if(Math.random() <= 0.15) {
            item = this.generateRandomItem(monster.level);
            this.gainItem(item, staticData.ItemSourceMonster);
        }

        this.gainXp(xp, staticData.XpSourceMonster);
        this.gainGold(gold, staticData.GoldSourceMonster);

        this.monsters[position].remove();
        this.monsters[position] = undefined;
    };

    Game.prototype.despawnMonsters = function() {
        for(var key in this.monsters) {
            if(this.monsters[key] !== undefined) {
                this.monsters[key].remove();
            }

            this.monsters[key] = undefined;
        }
    };

    Game.prototype.respawnMonsters = function() {
        this.despawnMonsters();

        // Todo
        var level = this[saveKeys.idnGameBattleLevel];
        this.monsters.Center = generatorMonster.generate(level);
        this.monsters.Center.init();
        this.monsters.Center.level = level;
        this.monsters.Center.heal();
    };

    // ---------------------------------------------------------------------------
    // battle functions
    // ---------------------------------------------------------------------------
    Game.prototype.changeBattleLevel = function(value) {
        this[saveKeys.idnGameBattleLevel] += value;
        this.checkBattleLevel();
    };

    Game.prototype.checkBattleLevel = function() {
        var max = this.player.getLevel();
        if(this[saveKeys.idnGameBattleLevel] <= 0) {
            this[saveKeys.idnGameBattleLevel] = 1;
        } else if (this[saveKeys.idnGameBattleLevel] > max) {
            this[saveKeys.idnGameBattleLevel] = max;
        }
    };

    Game.prototype.getBattleLevel = function() {
        return this[saveKeys.idnGameBattleLevel];
    };

    Game.prototype.setBattleLevel = function(value) {
        this[saveKeys.idnGameBattleDepth] = value;
        this.checkBattleLevel();
    };

    Game.prototype.enterBattle = function() {
        assert.isFalse(this.inBattle);
        this.inBattle = true;

        this.respawnMonsters();
    };

    Game.prototype.leaveBattle = function() {
        assert.isTrue(this.inBattle);

        this.inBattle = false;

        this.despawnMonsters();
    };

    Game.prototype.getInCombat = function() {
        return this.inBattle;
    };

    Game.prototype.attack = function() {
        // Todo: This is for testing purpose
        var playerHit = combatUtils.resolveCombat(this.player, this.monsters.Center);
        var monsterHit = combatUtils.resolveCombat(this.monsters.Center, this.player);

        eventAggregate.publish(staticData.EventCombatHit, playerHit);
        eventAggregate.publish(staticData.EventCombatHit, monsterHit);
    };

    // ---------------------------------------------------------------------------
    // item functions
    // ---------------------------------------------------------------------------
    Game.prototype.generateRandomItem = function(level) {
        return generatorItem.generate(level);
    };

    Game.prototype.handleSlotSellAction = function(mode, slot) {
        var item = slot.item;
        assert.isDefined(item);

        switch(mode) {
            case staticData.InventoryModePlayer: {

                debug.logDebug("PlayerInventory Slot Sell Action Received");
                if(item !== undefined && item.slot !== undefined) {
                    this.handlePlayerSlotSellAction(mode, item);
                } else {
                    debug.logWarning("handleSlotSellAction for Non-Equip Item");
                }

                break;
            }

            default: {
                debug.logWarning("handleSlotSellAction not implemented for " + mode);
            }
        }
    };

    Game.prototype.handleSlotEquipAction = function(mode, slot) {
        var item = slot.item;
        assert.isDefined(item);

        switch(mode) {
            case staticData.InventoryModePlayer: {

                debug.logDebug("PlayerInventory Slot Equip Action Received");
                if(item !== undefined && item.slot !== undefined) {
                    this.handlePlayerSlotEquipAction(mode, item);
                } else {
                    debug.logWarning("handleSlotEquipAction for Non-Equip Item");
                }

                break;
            }

            default: {
                debug.logWarning("handleSlotEquipAction not implemented for " + mode);
            }
        }
    };

    Game.prototype.handlePlayerSlotEquipAction = function(mode, item, targetSlot) {
        if(targetSlot === undefined) {
            targetSlot = this.getTargetSlotForItem(item);
        }

        if(targetSlot === undefined) {
            debug.logWarning("Could not determine target slot for item {0}, slot {1}".format(item.name, item.slot));
            return;
        }

        debug.logDebug("Calling Player EquipItem() for item " + item.id);
        this.player.equipItem(item, targetSlot);
    };

    Game.prototype.handlePlayerSlotSellAction = function(mode, item) {
        this.player.takeItem(item, 1);
        game.gainGold(item.stats.gold, staticData.GoldSourceItemSale);
        debug.logInfo("Sold Item {0} for {1} gold".format(item.name, item.stats.gold));
    };

    Game.prototype.getTargetSlotForItem = function(item) {
        // Pick a target slot from the item type
        for(var i = 0; i < staticData.EquipSlots.length; i++) {
            var slotType = staticData.EquipSlots[i];
            var segments = slotType.split("|");
            if(segments[0] === item.slot) {
                return slotType;
            }
        }

        return undefined;
    };

    // ---------------------------------------------------------------------------
    // save / load functions
    // ---------------------------------------------------------------------------
    Game.prototype.save = function() {
        save.save();
    };

    Game.prototype.load = function() {
        save.load();
    };

    Game.prototype.reset = function() {
        save.reset();
    };

    Game.prototype.onLoad = function() {
        // Perform some initial operation after being loaded
        this.calculateMercenaryGps();
    };

    return new Game();

});