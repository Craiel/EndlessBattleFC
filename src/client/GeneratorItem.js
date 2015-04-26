declare('GeneratorItem', function () {
    include('Debug');
    include('GameData');
    include('Generator');
    include('StatUtils');
    include('CoreUtils');
    include('Save');
    include('SaveKeys');
    include('Item');

    GeneratorItem.prototype = generator.prototype();
    GeneratorItem.prototype.$super = parent;
    GeneratorItem.prototype.constructor = GeneratorItem;

    function GeneratorItem() {
        generator.construct(this);

        this.id = "GeneratorItem";

        save.register(this, saveKeys.idnNextItemId).asNumber().withDefault(1);

        this.rarityList = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    GeneratorItem.prototype.generatorInit = GeneratorItem.prototype.init;
    GeneratorItem.prototype.init = function() {
        this.generatorInit();

        this.rebuildLookupData();
    };

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    GeneratorItem.prototype.getNextItemId = function() {
        return this[saveKeys.idnNextItemId]++;
    };

    GeneratorItem.prototype.generate = function(level) {
        var itemData = item.create(this.getNextItemId());
        statUtils.initStats(itemData.stats, false);

        // Find out which slot we are generating for
        var slot = coreUtils.pickRandomProperty(gameData.ItemSlots);
        itemData.slot = slot.id;
        if(itemData.slot === "weapon") {
            // We are generating weapons
            this.generateWeapon(level, itemData);
        } else {
            // We are generating armor
            this.generateArmor(level, itemData);
        }

        var prefix = coreUtils.pickRandomProperty(gameData.ItemPrefix);
        var suffix = coreUtils.pickRandomProperty(gameData.ItemSuffix);
        itemData.name = prefix +" " + itemData.typeName + " " + suffix;

        return itemData;
    };

    GeneratorItem.prototype.generateWeapon = function(level, itemData) {
        // Generate the rarity first
        var rarity = this.getItemRarity();
        itemData.rarity = rarity.id;

        var type = coreUtils.pickRandomProperty(gameData.WeaponTypes);
        itemData.type = type.id;
        itemData.allowMainHand = type.allowMainHand;
        itemData.allowOffHand = type.allowOffHand;
        itemData.twoHand = type.is2hand;
        itemData.baseTypeName = type.baseTypeName;

        itemData.typeName = coreUtils.pickRandomProperty(gameData["WeaponNames_" + itemData.type]);

        switch(itemData.rarity) {
            case "unique": {
                debug.logWarning("Unique items not implemented!");
                return undefined;
            }

            case "set": {
                debug.logWarning("Set items not implemented!");
                return undefined;
            }

            default: {
                this.generateDynamicItemStats(level, rarity, itemData);
            }
        }
    };

    GeneratorItem.prototype.generateArmor = function(level, itemData) {
        // Generate the rarity first
        var rarity = this.getItemRarity();
        itemData.rarity = rarity.id;

        var type = gameData.ArmorTypes[itemData.slot];
        itemData.type = type.id;
        itemData.baseTypeName = type.name;
        itemData.typeName = coreUtils.pickRandomProperty(gameData["ArmorNames_" + type.id]);

        switch(itemData.rarity) {
            case "unique": {
                debug.logWarning("Unique items not implemented!");
                return undefined;
            }

            case "set": {
                debug.logWarning("Set items not implemented!");
                return undefined;
            }

            default: {
                this.generateDynamicItemStats(level, rarity, itemData);
            }
        }
    };

    GeneratorItem.prototype.generateDynamicItemStats = function(level, rarity, itemData) {
        // Determine if we are adding sockets and calculate the secondary stats
        var slot = gameData.ItemSlots[itemData.slot];
        var socketCount = this.getSocketCount(slot.maxSockets, rarity.socketRolls);
        var secondaryStatRolls = rarity.secondaryStatRolls - socketCount;

        var stats = this.getItemStats(level, secondaryStatRolls, rarity.multiplier);
        statUtils.doMergeStats(stats, itemData.stats);
    };

    GeneratorItem.prototype.getItemStats = function(level, secondaryRolls, multiplier) {
        var stats = {};
        statUtils.initStats(stats, false);

        if(secondaryRolls === undefined) {
            secondaryRolls = 0;
        }

        var primaryStat = this.getRandomPrimaryStat();
        stats[primaryStat.id] = this.getStatValue(level, 1.01, multiplier);

        for(var i = 0; i < secondaryRolls; i++) {
            var secondaryStat = this.getRandomSecondaryStat();
            var temp = {};
            if(secondaryStat.isMultiplier === true) {
                temp[secondaryStat.id] = this.getMultiplierStatValue(multiplier);
            } else {
                temp[secondaryStat.id] = this.getStatValue(Math.ceil(level / 2), 1.01, multiplier);
            }

            statUtils.doMergeStats(temp, stats);
        }

        return stats;
    };

    GeneratorItem.prototype.getSocketCount = function(maxSockets, socketRolls) {
        if(maxSockets <= 0) {
            return 0;
        }

        // We keep adding sockets per roll up to the maximum
        var sockets = 0;
        for(var i = 0; i < socketRolls; i++) {
            sockets += coreUtils.getRandomInt(0, maxSockets);
        }

        if(sockets > maxSockets) {
            sockets = maxSockets;
        }

        return sockets;
    };

    GeneratorItem.prototype.getItemRarity = function() {
        var rarityRandom = Math.random();
        var rarity = undefined;
        var tryCount = 0;
        while(rarity === undefined) {
            tryCount++;
            for (var i = 0; i < this.rarityList.length; i++) {
                if (this.rarityList[i].dropChance > rarityRandom) {
                    rarity = this.rarityList[i];
                    break;
                }
            }

            if(tryCount >= 10) {
                debug.logError("Could not determine item rarity!");
                break;
            }
        }

        return rarity;
    }

    GeneratorItem.prototype.rebuildLookupData = function() {
        this.rarityList.length = 0;

        debug.logInfo("Rebuilding Item Generator lookup gameData!");
        for(var key in gameData.ItemRarity) {
            this.rarityList.push(gameData.ItemRarity[key]);
        }

        this.rarityList.sort(this.sortItemRarity);
    }

    GeneratorItem.prototype.sortItemRarity = function(a, b) {
        return a.dropChance > b.dropChance;
    }

    return new GeneratorItem();

});