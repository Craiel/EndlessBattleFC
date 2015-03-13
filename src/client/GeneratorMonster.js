declare('GeneratorMonster', function () {
    include('Log');
    include('Assert');
    include('Data');
    include('Component');
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
    }

    // ---------------------------------------------------------------------------
    // monster functions
    // ---------------------------------------------------------------------------
    GeneratorMonster.prototype.generate = function(level) {
        assert.isTrue(this.rarityList.length > 0, "Rarity definitions need to be loaded before Generate!");

        var monsterData = monster.create();
        var rarity = this.getMonsterRarity();
        var type = coreUtils.pickRandomProperty(data.MonsterTypes);

        monsterData.setRarity(rarity);
        monsterData.setType(type);
        monsterData.setStats(this.getMonsterStats(level, rarity.secondaryStatRolls));

        return monsterData;
    }

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
                log.error("Could not determine monster rarity!");
                break;
            }
        }

        return rarity;
    }

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
            console.log("Primary: " + key + ": " + temp[key]);
            statUtils.doMergeStats(temp, stats);
        }

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

        // Add a little bit of extra stamina
        temp = {};
        temp[data.StatDefinition.sta.id] = this.getStatValue(Math.ceil(level / 2), 1.01);
        // Compute Gold and XP this monster will give
        temp[data.StatDefinition.xp.id] = this.getStatValue(Math.ceil(level / 2), 1.05);
        temp[data.StatDefinition.gold.id] = this.getStatValue(level, 1.05);
        statUtils.doMergeStats(temp, stats);

        console.log("Final Stats");
        console.log(stats);
        return stats;
    }

    GeneratorMonster.prototype.getMultiplierStatValue = function() {
        var precision = 1000;
        return Math.floor(coreUtils.getRandom(1.01, 1.1) * precision) / precision;
    }

    GeneratorMonster.prototype.getStatValue = function(level, multiplier) {
        if(level < 1) {
            return 1;
        }

        return Math.floor(coreUtils.getSigma(level) * Math.pow(multiplier, level));
    }

    GeneratorMonster.prototype.rebuildLookupData = function() {
        this.rarityList.length = 0;

        log.info("Rebuilding Monster Generator lookup data!");
        for(var key in data.MonsterRarity) {
            this.rarityList.push(data.MonsterRarity[key]);
        }

        this.rarityList.sort(this.sortMonsterRarity);
    }

    GeneratorMonster.prototype.sortMonsterRarity = function(a, b) {
        return a.spawnChance > b.spawnChance;
    }

    return new GeneratorMonster();

});