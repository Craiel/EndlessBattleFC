declare("Actor", function () {
    include('Assert');
    include('Component');
    include('Save');
    include('SaveKeys');
    include('Static');
    include('BuffSet');
    include('Data');

    Actor.prototype = component.create();
    Actor.prototype.$super = parent;
    Actor.prototype.constructor = Actor;

    function Actor() {
        this.id = "Actor";

        // General
        this.actorStats = {};

        // Combat
        this.lastDamageTaken = 0;
        this.alive = true;
        this.canAttack = true;
        this.attackType = static.AttackType.BASIC_ATTACK;

        // Buffs/Debuffs
        this.buffs = buffSet.create();

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            //this.buffs.init();
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            this.buffs.update(gameTime);

            return true;
        }

        // ---------------------------------------------------------------------------
        // getters / setters
        // ---------------------------------------------------------------------------
        this.getLevel = function() {
            return this.level;
        }

        // ---------------------------------------------------------------------------
        // Stats functions
        // ---------------------------------------------------------------------------
        this.initStats = function(stats, useDefaults) {
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

        this.mergeIntoActorStats = function(statObjects) {
            this.actorStats = {};
            this.initStats(this.actorStats, false);
            var trickleDowns = {};
            this.initStats(trickleDowns, false);

            for(var i = 0; i < statObjects.length; i++) {
                this.getTrickleDownStats(statObjects[i], trickleDowns);
                this.doMergeActorStats(statObjects[i]);
            }

            this.doMergeActorStats(trickleDowns);
        }

        this.doMergeActorStats = function(stats) {
            for(var stat in stats) {
                var value = stats[stat];
                if(data.StatDefinition[stat].isMultiplier !== 1) {
                    this.actorStats[stat] += value;
                } else {
                    this.actorStats[stat] += (value - 1.0);
                }
            }
        }

        this.doGetStat = function(stat) {
            if(this.actorStats[stat] === undefined) {
                return 0;
            }

            return this.actorStats[stat];
        }

        this.doSetStat = function(stat, value, target) {
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

        this.doModifyStat = function(stat, value, target) {
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

        this.getTrickleDownStats = function(sourceStats, target) {
            for(stat in sourceStats) {
                var value = sourceStats[stat];
                switch (stat) {
                    case data.StatDefinition.str.id:
                    {
                        this.doModifyStat(data.StatDefinition.hpMax.id, value * 2, target);
                        this.doModifyStat(data.StatDefinition.dmgMin.id, value, target);
                        this.doModifyStat(data.StatDefinition.dmgMax.id, value, target);
                        break;
                    }

                    case data.StatDefinition.agi.id:
                    {
                        this.doModifyStat(data.StatDefinition.critDmg.id, (value * 2) / 100, target);
                        this.doModifyStat(data.StatDefinition.evaRate.id, value, target);
                        break;
                    }

                    case data.StatDefinition.sta.id:
                    {
                        this.doModifyStat(data.StatDefinition.hpMax.id, value * 5, target);
                        this.doModifyStat(data.StatDefinition.hp5.id, value, target);
                        break;
                    }
                }
            }
        }
    }

    return {
        create: function() { return new Actor(); }
    }
});