declare('GeneratorItem', function () {
    include('Log');
    include('Assert');
    include('Data');
    include('Component');
    include('Generator');
    include('StatUtils');
    include('CoreUtils');
    include('Save');
    include('SaveKeys');

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
    }

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    GeneratorItem.prototype.getNextItemId = function() {
        return this[saveKeys.idnNextItemId]++;
    }
    GeneratorItem.prototype.generate = function(level) {
        var itemData = { id: this.getNextItemId(), name: undefined, stats: {} };
        statUtils.initStats(itemData.stats, false);

        // Rarity: multiplier	dropChance	secondaryStatRolls	socketRolls
        // Slot: maxSockets
        var rarity = this.getItemRarity();
        var slot = coreUtils.pickRandomProperty(data.ItemSlots);

        var rarityStats = statUtils.getStatsFromData(rarity);
        var slotStats = statUtils.getStatsFromData(slot);

        statUtils.doMergeStats(rarityStats, itemData.stats);
        statUtils.doMergeStats(slotStats, itemData.stats);

        // Determine if we are adding sockets and calculate the secondary stats
        var socketCount = this.getSocketCount(slot.maxSockets, rarity.socketRolls);
        var secondaryStatRolls = rarity.secondaryStatRolls - socketCount;

        switch(rarity.id) {
            case "unique": {

            }

            case "set": {

            }

            default: {
                var stats = this.getItemStats(level, secondaryStatRolls);
                statUtils.doMergeStats(stats, itemData.stats);
            }
        }

        console.log("ItemGenerate: " + rarity.name + " - " + slot.id);
        console.log(itemData);
        return itemData;
    };

    GeneratorItem.prototype.getItemStats = function(level, secondaryRolls) {
        var stats = {};
        statUtils.initStats(stats, false);

        if(secondaryRolls === undefined) {
            secondaryRolls = 0;
        }

        var primaryStat = this.getRandomPrimaryStat();
        stats[primaryStat.id] = this.getStatValue(level, 1.01);

        console.log("Rolling Secondary stats " + secondaryRolls);
        for(var i = 0; i < secondaryRolls; i++) {
            var secondaryStat = this.getRandomSecondaryStat();
            var temp = {};
            if(secondaryStat.isMultiplier === true) {
                temp[secondaryStat.id] = this.getMultiplierStatValue();
                console.log("Multiplier Roll");
            } else {
                temp[secondaryStat.id] = this.getStatValue(Math.ceil(level / 2), 1.01);
            }

            console.log("Secondary: " + secondaryStat.id + ": " + temp[secondaryStat.id]);
            statUtils.doMergeStats(temp, stats);
        }

        console.log("Final Stats");
        console.log(stats);
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
                log.error("Could not determine item rarity!");
                break;
            }
        }

        return rarity;
    }

    GeneratorItem.prototype.rebuildLookupData = function() {
        this.rarityList.length = 0;

        log.info("Rebuilding Item Generator lookup data!");
        for(var key in data.ItemRarity) {
            this.rarityList.push(data.ItemRarity[key]);
        }

        this.rarityList.sort(this.sortItemRarity);
    }

    GeneratorItem.prototype.sortItemRarity = function(a, b) {
        return a.dropChance > b.dropChance;
    }

    return new GeneratorItem();

});