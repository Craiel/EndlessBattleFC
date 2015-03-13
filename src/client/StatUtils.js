declare('StatUtils', function () {
    include('Assert');
    include('Data');
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

        for(var key in data.StatDefinition) {
            var entry = data.StatDefinition[key];
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
        for (stat in data.StatDefinition) {
            if(useDefaults === undefined || useDefaults === true) {
                stats[stat] = data.StatDefinition[stat].default;
            }

            // Ensure each stat is assigned with at least 0
            if(stats[stat] === undefined) {
                if(data.StatDefinition[stat].isMultiplier !== true) {
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
            if(data.StatDefinition[stat].isMultiplier !== true) {
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
            if(data.StatDefinition[stat].isMultiplier !== true) {
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
        if(data.StatDefinition[stat].isMultiplier !== true) {
            target[stat] = Math.floor(target[stat]);
        }

        return true;
    }

    StatUtils.prototype.getStatsFromData = function(sourceData) {
        assert.isDefined(sourceData);

        statData = {};
        for(key in sourceData) {
            if(data.StatDefinition[key] !== undefined) {
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
                case data.StatDefinition.str.id:
                {
                    this.doModifyStat(data.StatDefinition.hpMax.id, value * 2, target);
                    this.doModifyStat(data.StatDefinition.dmgMin.id, value, target);
                    this.doModifyStat(data.StatDefinition.dmgMax.id, value, target);
                    this.doModifyStat(data.StatDefinition.critDmg.id, (value * 2) / 100, target);
                    break;
                }

                case data.StatDefinition.agi.id:
                {
                    this.doModifyStat(data.StatDefinition.critRate.id, value, target);
                    this.doModifyStat(data.StatDefinition.evaRate.id, value, target);
                    this.doModifyStat(data.StatDefinition.hitRate.id, value, target);
                    break;
                }

                case data.StatDefinition.sta.id:
                {
                    this.doModifyStat(data.StatDefinition.hpMax.id, value * 5, target);
                    this.doModifyStat(data.StatDefinition.hp5.id, value, target);

                    this.doModifyStat(data.StatDefinition.fireResist.id, value / 10, target);
                    this.doModifyStat(data.StatDefinition.iceResist.id, value / 10, target);
                    this.doModifyStat(data.StatDefinition.lightResist.id, value / 10, target);
                    this.doModifyStat(data.StatDefinition.darkResist.id, value / 10, target);
                    break;
                }

                case data.StatDefinition.int.id:
                {
                    this.doModifyStat(data.StatDefinition.mpMax.id, value * 5, target);
                    this.doModifyStat(data.StatDefinition.mp5.id, value, target);

                    this.doModifyStat(data.StatDefinition.fireDmgMult.id, value / 100, target);
                    this.doModifyStat(data.StatDefinition.iceDmgMult.id, value / 100, target);
                    this.doModifyStat(data.StatDefinition.lightDmgMult.id, value / 100, target);
                    this.doModifyStat(data.StatDefinition.darkDmgMult.id, value / 100, target);
                    break;
                }
            }
        }
    }

    return new StatUtils();
});