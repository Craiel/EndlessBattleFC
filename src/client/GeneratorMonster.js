declare('GeneratorMonster', function () {
    include('Log');
    include('Assert');
    include('Data');
    include('Component');
    include('Generator');
    include('Monster');
    include('StatUtils');
    include('CoreUtils');

    GeneratorMonster.prototype = generator.create();
    GeneratorMonster.prototype.$super = parent;
    GeneratorMonster.prototype.constructor = GeneratorMonster;

    function GeneratorMonster() {
        this.id = "GeneratorMonster";

        this.rarityList = [];

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.generatorInit = this.init;
        this.init = function() {
            this.generatorInit();

            this.rebuildLookupData();
        }

        // ---------------------------------------------------------------------------
        // monster functions
        // ---------------------------------------------------------------------------
        this.generate = function(level) {
            assert.isTrue(this.rarityList.length > 0, "Rarity definitions need to be loaded before Generate!");

            var monsterData = monster.create();
            var rarity = this.getMonsterRarity();

            monsterData.setRarity(rarity);
            monsterData.setStats(this.getMonsterStats(level, rarity.secondaryStatRolls));

            return monsterData;
        }

        this.getMonsterRarity = function() {
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

        this.getMonsterStats = function(level, secondaryRolls) {
            var stats = {};
            statUtils.initStats(stats);

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
                stats = statUtils.mergeStats([stats, temp]);
            }

            console.log("Rolling Secondary stats " + secondaryRolls);
            for(var i = 0; i < secondaryRolls; i++) {
                var secondaryStat = this.getRandomSecondaryStat();
                var temp = {};
                if(stat.isMultiplier === true) {
                    temp[secondaryStat.id] = coreUtils.getRandom(0.01, 0.1);
                } else {
                    temp[secondaryStat.id] = this.getStatValue(level / 2, 1.01);
                }

                console.log("Secondary: " + secondaryStat.id + ": " + temp[secondaryStat.id]);
                stats = statUtils.mergeStats([stats, temp]);
            }

            console.log("Final Stats");
            console.log(stats);
            return stats;
        }

        this.getStatValue = function(level, multiplier) {
            if(level < 1) {
                return 1;
            }

            return Math.floor(this.sigma(level) * Math.pow(multiplier, level));
        }

        this.rebuildLookupData = function() {
            this.rarityList.length = 0;

            log.info("Rebuilding Monster Generator lookup data!");
            for(var key in data.MonsterRarity) {
                this.rarityList.push(data.MonsterRarity[key]);
            }

            this.rarityList.sort(this.sortMonsterRarity);
        }

        this.sortMonsterRarity = function(a, b) {
            return a.spawnChance > b.spawnChance;
        }
    }

    return new GeneratorMonster();

});