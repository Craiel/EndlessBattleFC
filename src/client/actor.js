declare('Actor', function () {
    include('Assert');
    include('Log');
    include('Component');
    include('Save');
    include('SaveKeys');
    include('Static');
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
        this.actorStats = {};
        this.statsChanged = true;
        this.storage = undefined;

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
        this.init = function(baseStats) {
            this.componentInit();

            assert.isDefined(this.getBaseStats, "Actor needs to have a getBaseStats() function");

            this.storage = storage.create(this.id);
            this.storage.init();
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
        // Item functions
        // ---------------------------------------------------------------------------
        this.giveItem = function(item, count) {
            if(this.storage.canAdd(item) === false) {
                log.warning("Could not add item " + item);
                return;
            }

            this.storage.add(item, count)
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
            stats.push(this.getBaseStats());
            this.actorStats = statUtils.mergeStats(stats);
            this.statsChanged = false;
        }
    }

    return {
        create: function() { return new Actor(); }
    }
});