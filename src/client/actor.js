declare('Actor', function () {
    include('Assert');
    include('Log');
    include('Component');
    include('Save');
    include('SaveKeys');
    include('StaticData');
    include('BuffSet');
    include('Data');
    include('Storage');
    include('StatUtils');

    Actor.prototype = component.create();
    Actor.prototype.$super = parent;
    Actor.prototype.constructor = Actor;

    function Actor() {
        this.id = "Actor";

        // General
        this.level = 0;
        this.actorStats = {};
        this.statsChanged = true;

        // Combat
        this.abilitySet = {}
        this.abilityCooldown = {}

        this.alive = true;


        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function(baseStats) {
            this.componentInit();

            assert.isDefined(this.getBaseStats, "Actor needs to have a getBaseStats() function");

            // Todo: pull this from data
            this.abilitySet['basic'] = { id: 'basic', name: 'Basic Attack', dmgMult: 1 }
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            // Check if we need to recompute the actor state
            if(this.statsChanged === true) {
                this.computeActorStats();
            }

            this.alive = this.getStat(data.StatDefinition.hp.id) > 0;

            return true;
        }

        // ---------------------------------------------------------------------------
        // getters / setters
        // ---------------------------------------------------------------------------
        this.getLevel = function() {
            return this.level;
        }

        this.getAbility = function(key) {
            // Todo:
            return undefined;
        }

        // ---------------------------------------------------------------------------
        // Item functions
        // ---------------------------------------------------------------------------
        this.giveItem = function(item, count) {
            var storage = this.getStorage();
            if(storage === undefined) {
                log.error("Actor {0} has no Storage".format(this.id));
                return;
            }

            if(storage.canAdd(item) === false) {
                log.warning("Could not add item " + item);
                return;
            }

            storage.add(item.id, count);

            // If it's not a static item store it's meta information
            if(item.isStatic !== true) {
                storage.setMetadata(item.id, item);
            }
        }

        // ---------------------------------------------------------------------------
        // Stats functions
        // ---------------------------------------------------------------------------
        this.getStat = function(stat) {
            if(this.statsChanged === true) {
                this.computeActorStats();
            }

            if(this.actorStats[stat] === undefined) {
                return 0;
            }

            return this.actorStats[stat];
        }

        this.getBaseStat = function(stat) {
            if(this.getBaseStats()[stat] === undefined) {
                return 0;
            }

            return this.getBaseStats()[stat];
        }

        this.setStat = function(stat, value) {
            this.statsChanged = statUtils.doSetStat(stat, value, this.getBaseStats());
        }

        this.modifyStat = function(stat, value) {
            this.statsChanged = statUtils.doModifyStat(stat, value, this.getBaseStats());
        }

        this.computeActorStats = function() {
            var stats = [];
            if(this.getStatLists !== undefined) {
                stats = this.getStatLists();
            }

            stats.splice(0, 0, this.getBaseStats());
            this.actorStats = statUtils.mergeStats(stats);
            this.statsChanged = false;
        }

        // ---------------------------------------------------------------------------
        // actor functions
        // ---------------------------------------------------------------------------
        this.heal = function(amount) {
            if(amount === undefined) {
                amount = this.getStat(data.StatDefinition.hpMax.id);
            }

            this.modifyStat(data.StatDefinition.hp.id, amount);
            if (this.getStat(data.StatDefinition.hp.id) > this.getStat(data.StatDefinition.hpMax.id)) {
                this.setStat(data.StatDefinition.hp.id, this.getStat(data.StatDefinition.hpMax.id));
            }
        }

        this.healMp = function(amount) {
            if(amount === undefined) {
                amount = this.getStat(data.StatDefinition.mpMax.id);
            }

            this.modifyStat(data.StatDefinition.mp.id, amount);
            if(this.getStat(data.StatDefinition.mp.id) > this.getStat(data.StatDefinition.mpMax.id)) {
                this.setStat(data.StatDefinition.mp.id, this.getStat(data.StatDefinition.mpMax.id));
            }
        }
    }

    return {
        create: function() { return new Actor(); }
    }
});