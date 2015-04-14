declare('StatUtils', function () {
    include('Assert');
    include('GameData');
    include('Component');

    StatUtils.prototype = component.prototype();
    StatUtils.prototype.$super = parent;
    StatUtils.prototype.constructor = StatUtils;

    function StatUtils() {
        component.construct(this);

        this.id = "StatUtils";

        this.primaryStats = {};
        this.secondaryStats = {};
        this.tertiaryStats = {};
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    StatUtils.prototype.componentInit = StatUtils.prototype.init;
    StatUtils.prototype.init = function() {
        this.componentInit();

        for(var key in gameData.StatDefinition) {
            var entry = gameData.StatDefinition[key];
            if(entry.isPrimaryStat === true) {
                this.primaryStats[key] = entry;
            } else if (entry.isSecondaryStat === true) {
                this.secondaryStats[key] = entry;
            } else if (entry.isTertiaryStat === true) {
                this.tertiaryStats[key] = entry;
            }
        }
    }

    // ---------------------------------------------------------------------------
    // Generic stat functions
    // ---------------------------------------------------------------------------
    StatUtils.prototype.initStats = function(stats, useDefaults) {
        for (stat in gameData.StatDefinition) {
            if(useDefaults === undefined || useDefaults === true) {
                stats[stat] = gameData.StatDefinition[stat].default;
            }

            // Ensure each stat is assigned with at least 0
            if(stats[stat] === undefined) {
                if(gameData.StatDefinition[stat].isMultiplier !== true) {
                    stats[stat] = 0;
                } else {
                    stats[stat] = 1.0;
                }
            }
        }
    }

    StatUtils.prototype.mergeStats = function(statObjects) {
        var result = {};
        this.initStats(result, false);

        var trickleDowns = {};
        this.initStats(trickleDowns, false);
        for(var i = 0; i < statObjects.length; i++) {
            this.getTrickleDownStats(statObjects[i], trickleDowns);
            this.doMergeStats(statObjects[i], result);
        }

        this.doMergeStats(trickleDowns, result);
        return result;
    }

    StatUtils.prototype.doMergeStats = function(stats, target) {
        for(var stat in stats) {
            var value = stats[stat];
            if(gameData.StatDefinition[stat].isMultiplier !== true) {
                target[stat] += value;
            } else {
                target[stat] += (value - 1.0);
            }
        }
    }

    StatUtils.prototype.doSetStat = function(stat, value, target) {
        assert.isDefined(value);
        assert.isNotNaN(value);

        // Avoid changing if it's the same
        if(target[stat] !== value) {
            target[stat] = value;
            if(gameData.StatDefinition[stat].isMultiplier !== true) {
                target[stat] = Math.floor(target[stat]);
            }
            return true;
        } else {
            return false;
        }
    }

    StatUtils.prototype.doModifyStat = function(stat, value, target) {
        assert.isDefined(value);
        assert.isNotNaN(value);

        // Avoid modifying by zero
        if(value === 0) {
            return false;
        }

        // Modify the value and ensure its in the valid range
        target[stat] += value;
        if(gameData.StatDefinition[stat].isMultiplier !== true) {
            target[stat] = Math.floor(target[stat]);
        }

        return true;
    }

    StatUtils.prototype.getStatsFromData = function(sourceData) {
        assert.isDefined(sourceData);

        statData = {};
        for(key in sourceData) {
            if(gameData.StatDefinition[key] !== undefined) {
                statData[key] = sourceData[key];
            }
        }

        return statData;
    }

    // ---------------------------------------------------------------------------
    // Stat calculation functions
    // ---------------------------------------------------------------------------
    StatUtils.prototype.getTrickleDownStats = function(sourceStats, target) {
        for(stat in sourceStats) {
            var value = sourceStats[stat];
            switch (stat) {
                case gameData.StatDefinition.str.id:
                {
                    this.doModifyStat(gameData.StatDefinition.hpMax.id, value * 2, target);
                    this.doModifyStat(gameData.StatDefinition.dmgMin.id, value, target);
                    this.doModifyStat(gameData.StatDefinition.dmgMax.id, value, target);
                    this.doModifyStat(gameData.StatDefinition.critDmg.id, (value * 2) / 100, target);
                    break;
                }

                case gameData.StatDefinition.agi.id:
                {
                    this.doModifyStat(gameData.StatDefinition.critRate.id, value, target);
                    this.doModifyStat(gameData.StatDefinition.evaRate.id, value, target);
                    this.doModifyStat(gameData.StatDefinition.hitRate.id, value, target);
                    break;
                }

                case gameData.StatDefinition.sta.id:
                {
                    this.doModifyStat(gameData.StatDefinition.hpMax.id, value * 5, target);
                    this.doModifyStat(gameData.StatDefinition.hp5.id, value, target);

                    this.doModifyStat(gameData.StatDefinition.fireResist.id, value / 10, target);
                    this.doModifyStat(gameData.StatDefinition.iceResist.id, value / 10, target);
                    this.doModifyStat(gameData.StatDefinition.lightResist.id, value / 10, target);
                    this.doModifyStat(gameData.StatDefinition.darkResist.id, value / 10, target);
                    break;
                }

                case gameData.StatDefinition.int.id:
                {
                    this.doModifyStat(gameData.StatDefinition.mpMax.id, value * 5, target);
                    this.doModifyStat(gameData.StatDefinition.mp5.id, value, target);

                    this.doModifyStat(gameData.StatDefinition.fireDmgMult.id, value / 100, target);
                    this.doModifyStat(gameData.StatDefinition.iceDmgMult.id, value / 100, target);
                    this.doModifyStat(gameData.StatDefinition.lightDmgMult.id, value / 100, target);
                    this.doModifyStat(gameData.StatDefinition.darkDmgMult.id, value / 100, target);
                    break;
                }
            }
        }
    }

    return new StatUtils();
});