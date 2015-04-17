declare('Monster', function () {
    include('Actor');
    include('StatUtils');

    Monster.prototype = actor.prototype();
    Monster.prototype.$super = parent;
    Monster.prototype.constructor = Monster;

    var nextId = 1;

    function Monster() {
        actor.construct(this);

        this.id = "Monster" + nextId++;

        this.baseStats = {};
        this.rarityStats = undefined;
        this.typeStats = undefined;
        this.rarity = undefined;
        this.type = undefined;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Monster.prototype.actorInit = Monster.prototype.init;
    Monster.prototype.init = function() {
        this.actorInit();

        statUtils.initStats(this.baseStats, false);
    };

    Monster.prototype.actorUpdate = Monster.prototype.update;
    Monster.prototype.update = function(gameTime) {
        if(this.actorUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // getters / setters
    // ---------------------------------------------------------------------------
    Monster.prototype.getBaseStats = function() {
        return this.baseStats;
    };

    Monster.prototype.getStatLists = function() {
        var stats = [];
        if(this.rarityStats !== undefined) {
            stats.push(this.rarityStats);
        } else {
            log.warning("Monster has no Rarity set!");
        }

        if(this.typeStats !== undefined) {
            stats.push(this.typeStats);
        } else {
            log.warning("Monster has no Type set!");
        }

        return stats;
    };

    Monster.prototype.setRarity = function(rarity) {
        this.rarity = rarity;
        this.rarityStats = statUtils.getStatsFromData(rarity);
    };

    Monster.prototype.setType = function(type) {
        console.log(type);
        this.type = type;
        this.name = type.name;
        this.typeStats = statUtils.getStatsFromData(type);
    };

    Monster.prototype.getRarity = function() {
        return this.rarity;
    };

    Monster.prototype.setStats = function(stats) {
        this.baseStats = stats;
    };

    var surrogate = function(){};
    surrogate.prototype = Monster.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Monster.call(self); },
        create: function() { return new Monster(); }
    }
});