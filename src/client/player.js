declare('Player', function () {
    include('Assert');
    include('Debug');
    include('Actor');
    include('StaticData');
    include('Utils');
    include('Save');
    include('SaveKeys');
    include('GameData');
    include('StatUtils');
    include('CoreUtils');
    include('Storage');

    Player.prototype = actor.prototype();
    Player.prototype.$super = parent;
    Player.prototype.constructor = Player;

    function Player() {
        actor.construct(this);

        this.id = "Player";

        this.statsChanged = true;

        save.register(this, saveKeys.idnName).withDefault("Hero");
        save.register(this, saveKeys.idnPlayerBaseStats).asJson();
        save.register(this, saveKeys.idnPlayerSkillPoints).asNumber().withDefault(0);
        save.register(this, saveKeys.idnPlayerStatPoints).asNumber().withDefault(0);
        save.register(this, saveKeys.idnPlayerStorageSlots).asJsonArray().withDefault([]);
        save.register(this, saveKeys.idnPlayerEquip).asJson();
        save.register(this, saveKeys.idnPlayerInventoryPurchased).asNumber().withDefault(0);
        save.register(this, saveKeys.idnLevel).asNumber().withDefault(1).withCallback(false, true, false);

        this.storage = undefined;

        this.experienceRequired = 0;

        this.hp5Delay = 5000;
        this.hp5Time = 0;
        this.mp5Delay = 5000;
        this.mp5Time = 0;

        this.resurrectionTime = 0;
        this.resurrectionDelay = 10000;
        this.resurrectionDelayMin = 10000;
        this.resurrectionDelayIncrement = 10000;
        this.resurrectionDelayMax = 600000;
        this.resurrectionDelayDecreaseInterval = 30000;
        this.resurrectionDelayDecreaseTime = 0;

        this.slotCountBasic = 14;
        this.slotCountPerPurchase = 14;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Player.prototype.actorInit = Player.prototype.init;
    Player.prototype.init = function() {
        this.actorInit(this[saveKeys.idnPlayerBaseStats]);

        statUtils.initStats(this[saveKeys.idnPlayerBaseStats]);

        this.storage = storage.create(this.id);
        this.storage.init(this.slotCountBasic);

        this.addEquipmentSlot(gameData.ItemSlots.head, staticData.EquipSlotHead);
        this.addEquipmentSlot(gameData.ItemSlots.chest, staticData.EquipSlotChest);
        this.addEquipmentSlot(gameData.ItemSlots.waist, staticData.EquipSlotWaist);
        this.addEquipmentSlot(gameData.ItemSlots.legs, staticData.EquipSlotLegs);
        this.addEquipmentSlot(gameData.ItemSlots.feet, staticData.EquipSlotFeet);
        this.addEquipmentSlot(gameData.ItemSlots.shoulder, staticData.EquipSlotShoulder);
        this.addEquipmentSlot(gameData.ItemSlots.wrist, staticData.EquipSlotWrist);
        this.addEquipmentSlot(gameData.ItemSlots.hand, staticData.EquipSlotHands);
        this.addEquipmentSlot(gameData.ItemSlots.neck, staticData.EquipSlotNeck);
        this.addEquipmentSlot(gameData.ItemSlots.ring, staticData.EquipSlotRing1);
        this.addEquipmentSlot(gameData.ItemSlots.ring, staticData.EquipSlotRing2);
        this.addEquipmentSlot(gameData.ItemSlots.weapon, staticData.EquipSlotMainHand);
        this.addEquipmentSlot(gameData.ItemSlots.weapon, staticData.EquipSlotOffHand);
        this.addEquipmentSlot(gameData.ItemSlots.trinket, staticData.EquipSlotTrinket1);
        this.addEquipmentSlot(gameData.ItemSlots.trinket, staticData.EquipSlotTrinket2);
    };

    Player.prototype.actorUpdate = Player.prototype.update;
    Player.prototype.update = function(gameTime) {
        if(this.actorUpdate(gameTime) !== true) {
            return false;
        }

        this.updateExperience(gameTime);
        this.updateEquipment(gameTime);
        this.updateInventory(gameTime);

        // Perform some basic operations that happen when the player is alive
        if(this.alive === true) {
            // Hp5
            this.hp5Time = coreUtils.processInterval(gameTime, this.hp5Time, this.hp5Delay, this, function(self, value) { self.heal(value); }, this.getStat(gameData.StatDefinition.hp5.id));

            // Mp5
            this.mp5Time = coreUtils.processInterval(gameTime, this.mp5Time, this.mp5Delay, this, function(self, value) { self.healMp(value); }, this.getStat(gameData.StatDefinition.mp5.id));

            this.processResurrectionDelay(gameTime);
        } else {
            this.processResurrection(gameTime);
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // getters / setters
    // ---------------------------------------------------------------------------
    Player.prototype.getBaseStats = function() {
        return this[saveKeys.idnPlayerBaseStats];
    };

    Player.prototype.getName = function() {
        return this[saveKeys.idnName];
    };

    Player.prototype.setName = function(name) {
        this[saveKeys.idnName] = name;
    };

    Player.prototype.getLevel = function() {
        return this[saveKeys.idnLevel];
    };

    Player.prototype.getAverageDamage = function() {
        var minDamage = this.getStat(gameData.StatDefinition.dmgMin);
        return minDamage + (this.getStat(gameData.StatDefinition.dmgMax) - minDamage);
    };

    Player.prototype.getSkillPoints = function() {
        return this[saveKeys.idnPlayerSkillPoints];
    };

    Player.prototype.getStorage = function() {
        return this.storage;
    };

    Player.prototype.getEquipment = function() {
        return this[saveKeys.idnPlayerEquip];
    };

    Player.prototype.modifySkillPoints = function(value) {
        assert.isDefined(value);
        assert.isNotNaN(value);

        this[saveKeys.idnPlayerSkillPoints] += value;
    };

    Player.prototype.getStatPoints = function() {
        return this[saveKeys.idnPlayerStatPoints];
    };

    Player.prototype.modifyStatPoints = function(value) {
        assert.isDefined(value);
        assert.isNotNaN(value);

        this[saveKeys.idnPlayerStatPoints] += value;
    };

    // ---------------------------------------------------------------------------
    // player functions
    // ---------------------------------------------------------------------------
    Player.prototype.updateInventory = function(gameTime) {
        var currentSlotCount = this.storage.getSize();
        var slotCount = this.slotCountBasic + (this.slotCountPerPurchase * this[saveKeys.idnPlayerInventoryPurchased]);
        if(currentSlotCount < slotCount) {
            // Raise the inventory slot count if we can have more
            this.storage.increaseSize(slotCount - currentSlotCount);
        }
    };

    Player.prototype.updateEquipment = function(gameTime) {
        for(var i = 0; i < staticData.EquipSlots.length; i++) {
            if(this[saveKeys.idnPlayerEquip][staticData.EquipSlots[i]] === undefined) {
                this[saveKeys.idnPlayerEquip][staticData.EquipSlots[i]] = null;
            }
        }
    };

    Player.prototype.updateExperience = function(gameTime) {
        this.updateExperienceRequired();

        var current = this.getStat(gameData.StatDefinition.xp.id);
        if(current < this.experienceRequired) {
            return;
        }

        this.levelUp();
    };

    Player.prototype.updateExperienceRequired = function() {
        var level = this.getLevel();
        this.experienceRequired = Math.ceil((coreUtils.getSigma(level) * 2) * Math.pow(1.05, level));
    };

    Player.prototype.levelUp = function() {
        this.setStat(gameData.StatDefinition.xp.id, 0);
        this[saveKeys.idnLevel]++;
        this.modifySkillPoints(1);
        this.modifyStatPoints(5);

        // Add 1-2 to the primary attributes
        this.modifyStat(gameData.StatDefinition.str.id, coreUtils.getRandomInt(1, 2));
        this.modifyStat(gameData.StatDefinition.agi.id, coreUtils.getRandomInt(1, 2));
        this.modifyStat(gameData.StatDefinition.int.id, coreUtils.getRandomInt(1, 2));
        this.modifyStat(gameData.StatDefinition.sta.id, coreUtils.getRandomInt(1, 2));

        this.updateExperienceRequired();
    };

    Player.prototype.processResurrectionDelay = function(gameTime) {
        if(this.resurrectionDelayDecreaseTime === 0) {
            this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
            return;
        }

        if(gameTime.current < this.resurrectionDelayDecreaseTime) {
            return;
        }

        if(this.resurrectionDelay > this.resurrectionDelayMin) {
            this.resurrectionDelay -= this.resurrectionDelayIncrement;
            this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
            debug.logInfo("Decreasing res time to " + this.resurrectionDelay);
        }
    };

    Player.prototype.processResurrection = function(gameTime) {
        assert.isFalse(this.alive);

        if(this.resurrectionTime === 0) {
            this.resurrectionTime = gameTime.current + this.resurrectionDelay;

            return;
        }

        if(this.resurrectionTime > gameTime.current) {
            return;
        }

        // Bring the player back alive
        this.setStat(gameData.StatDefinition.hp.id, 1);
        this.alive = true;
        this.resurrectionTime = 0;

        // Make the next resurrection a little more costly
        if(this.resurrectionDelay < this.resurrectionDelayMax) {
            this.resurrectionDelay += this.resurrectionDelayIncrement;
            this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
            debug.logInfo("Increasing res time to " + this.resurrectionDelay);
        }
    };

    Player.prototype.getResurrectionTime = function() {
        return this.resurrectionDelay;
    };

    Player.prototype.getResurrectionTimeRemaining = function(gameTime) {
        assert.isFalse(this.alive);

        if(this.resurrectionTime <= 0) {
            return 0;
        }

        if(this.resurrectionTime < gameTime.current) {
            return 0;
        }

        return this.resurrectionTime - gameTime.current;
    };

    Player.prototype.onLoad = function() {
        // Update the storage slot data with the object from the save
        this.storage.setSlotData(this[saveKeys.idnPlayerStorageSlots]);

        // Reload the current equipment slot contents from the save
        this.reloadEquipmentSlots();

        // TODO:
        this.baseExperienceRequired = 10;
        this.experienceRequired = Math.ceil(utils.Sigma(this[saveKeys.idnLevel] * 2) * Math.pow(1.05, this[saveKeys.idnLevel]) + this.baseExperienceRequired);
    };

    Player.prototype.receiveItem = function(item) {
        // Stub for now, but functional:
        this.storage.add(item);
    };

    var surrogate = function(){};
    surrogate.prototype = Player.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Player.call(self); },
        create: function() { return new Player(); }
    }
});