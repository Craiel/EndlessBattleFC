declare('GeneratorMonster', function () {
    include('Debug');
    include('Assert');
    include('GameData');
    include('Generator');
    include('Monster');
    include('StatUtils');
    include('CoreUtils');

    GeneratorMonster.prototype = generator.prototype();
    GeneratorMonster.prototype.$super = parent;
    GeneratorMonster.prototype.constructor = GeneratorMonster;

    function GeneratorMonster() {
        generator.construct(this);

        this.id = "GeneratorMonster";

        this.rarityList = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    GeneratorMonster.prototype.generatorInit = GeneratorMonster.prototype.init;
    GeneratorMonster.prototype.init = function() {
        this.generatorInit();

        this.rebuildLookupData();
    };

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    GeneratorMonster.prototype.generate = function(level) {
        assert.isTrue(this.rarityList.length > 0, "Rarity definitions need to be loaded before Generate!");

        var monsterData = monster.create();
        var rarity = this.getMonsterRarity();
        var type = coreUtils.pickRandomProperty(gameData.MonsterTypes);

        monsterData.setRarity(rarity);
        monsterData.setType(type);
        monsterData.setStats(this.getMonsterStats(level, rarity.secondaryStatRolls));

        return monsterData;
    };

    GeneratorMonster.prototype.getMonsterRarity = function() {
        var rarityRandom = Math.random();
        var rarity = undefined;
        var tryCount = 0;
        while(rarity === undefined) {
            tryCount++;
            for (var i = 0; i < this.rarityList.length; i++) {
                if (this.rarityList[i].spawnChance > rarityRandom) {
                    rarity = this.rarityList[i];
                    break;
                }
            }

            if(tryCount >= 10) {
                debug.logError("Could not determine monster rarity!");
                break;
            }
        }

        return rarity;
    };

    GeneratorMonster.prototype.getMonsterStats = function(level, secondaryRolls) {
        var stats = {};
        statUtils.initStats(stats, false);

        if(secondaryRolls === undefined) {
            secondaryRolls = 0;
        }

        var primaryStat = this.getRandomPrimaryStat();
        for(var key in statUtils.primaryStats) {
            var temp = {};
            if(primaryStat.id === key) {
                temp[key] = this.getStatValue(level, 1.05);
            } else {
                temp[key] = this.getStatValue(level, 1.01);
            }

            statUtils.doMergeStats(temp, stats);
        }

        for(var i = 0; i < secondaryRolls; i++) {
            var secondaryStat = this.getRandomSecondaryStat();
            var temp = {};
            if(secondaryStat.isMultiplier === true) {
                temp[secondaryStat.id] = this.getMultiplierStatValue();
            } else {
                temp[secondaryStat.id] = this.getStatValue(Math.ceil(level / 2), 1.01);
            }

            statUtils.doMergeStats(temp, stats);
        }

        // Extra stats that are needed
        temp = {};
        temp[gameData.StatDefinition.spd.id] = 1;
        temp[gameData.StatDefinition.sta.id] = this.getStatValue(Math.ceil(level / 2), 1.01);

        // Compute Gold and XP this monster will give
        temp[gameData.StatDefinition.xp.id] = this.getStatValue(Math.ceil(level / 2), 1.05);
        temp[gameData.StatDefinition.gold.id] = this.getStatValue(level, 1.05);
        statUtils.doMergeStats(temp, stats);

        return stats;
    };

    GeneratorMonster.prototype.rebuildLookupData = function() {
        this.rarityList.length = 0;

        debug.logInfo("Rebuilding Monster Generator lookup gameData!");
        for(var key in gameData.MonsterRarity) {
            this.rarityList.push(gameData.MonsterRarity[key]);
        }

        this.rarityList.sort(this.sortMonsterRarity);
    };

    GeneratorMonster.prototype.sortMonsterRarity = function(a, b) {
        return a.spawnChance > b.spawnChance;
    };

    return new GeneratorMonster();

});