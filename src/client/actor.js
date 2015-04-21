declare('Actor', function () {
    include('Assert');
    include('Log');
    include('Component');
    include('StaticData');
    include('GameData');
    include('Storage');
    include('StatUtils');
    include('CoreUtils');
    include('EventAggregate');

    Actor.prototype = component.prototype();
    Actor.prototype.$super = parent;
    Actor.prototype.constructor = Actor;

    function Actor() {
        component.construct(this);

        this.id = "Actor";
        this.name = "#ERR";

        // Limits:
        this.armorRatingMultiplier = 20;
        this.baseRatingMultiplier = 10;
        this.hitChanceMin = 0.50;
        this.hitChanceMax = 1.0;
        this.critChanceMin = 0.05;
        this.critChanceMax = 0.75;
        this.evadeChanceMin = 0.05;
        this.evadeChanceMax = 0.75;
        this.armorReductionMax = 0.9;

        // General
        this.level = 0;
        this.actorStats = {};
        this.statsChanged = true;

        this.nextEquipmentSlotId = 0;
        this.equipmentSlots = {};

        // Combat
        this.abilitySet = {};
        this.abilityCooldown = {};

        this.alive = true;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Actor.prototype.componentInit = Actor.prototype.init;
    Actor.prototype.init = function(baseStats) {
        this.componentInit();

        assert.isDefined(this.getBaseStats, "Actor needs to have a getBaseStats() function");

        // Add the basic attack ability to the actor, this everyone will have
        this.addAbility(gameData.Abilities.basic.id);
    }

    Actor.prototype.componentUpdate = Actor.prototype.update;
    Actor.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.updateEquipmentSlots(gameTime);

        // Check if we need to recompute the actor state
        if(this.statsChanged === true) {
            this.computeActorStats();
        }

        var wasAlive = this.alive;
        this.alive = this.getStat(gameData.StatDefinition.hp.id) > 0;

        if(wasAlive === true && this.alive !== true) {
            // The actor has died, trigger the event
            eventAggregate.publish(staticData.EventCombatDeath, { actorName: this.getName() });
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // getters / setters
    // ---------------------------------------------------------------------------
    Actor.prototype.getName = function() {
        return this.name;
    }

    Actor.prototype.getLevel = function() {
        return this.level;
    }

    // ---------------------------------------------------------------------------
    // Ability functions
    // ---------------------------------------------------------------------------
    Actor.prototype.addAbility = function(key) {
        if(this.abilitySet[key] !== undefined) {
            log.warning("Ability {0} already added to actor {1}".format(key, this.id));
            return;
        }

        this.abilitySet[key] = gameData.Abilities[key];
        this.abilityCooldown[key] = 0;
    }

    Actor.prototype.getAbility = function(key) {
        return this.abilitySet[key];
    }

    Actor.prototype.getAbilityCooldown = function(key) {
        return this.abilityCooldown[key];
    }

    // ---------------------------------------------------------------------------
    // Item functions
    // ---------------------------------------------------------------------------
    Actor.prototype.giveItem = function(item, count) {
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
    Actor.prototype.getStat = function(stat) {
        if(this.statsChanged === true) {
            this.computeActorStats();
        }

        if(this.actorStats[stat] === undefined) {
            return 0;
        }

        return this.actorStats[stat];
    }

    Actor.prototype.getBaseStat = function(stat) {
        if(this.getBaseStats()[stat] === undefined) {
            return 0;
        }

        return this.getBaseStats()[stat];
    }

    Actor.prototype.setStat = function(stat, value) {
        this.statsChanged = statUtils.doSetStat(stat, value, this.getBaseStats());
    }

    Actor.prototype.modifyStat = function(stat, value) {
        this.statsChanged = statUtils.doModifyStat(stat, value, this.getBaseStats());
    }

    Actor.prototype.computeActorStats = function() {
        var stats = [];
        if(this.getStatLists !== undefined) {
            stats = this.getStatLists();
        }

        stats.splice(0, 0, this.getBaseStats());
        this.actorStats = statUtils.mergeStats(stats);
        this.statsChanged = false;
    }

    Actor.prototype.getHitChance = function() {
        return this.getRatingValue(gameData.StatDefinition.hitRate.id, gameData.StatDefinition.hitRateMult.id, this.hitChanceMin, this.hitChanceMax, this.baseRatingMultiplier);
    }

    Actor.prototype.getCritChance = function() {
        return this.getRatingValue(gameData.StatDefinition.critRate.id, gameData.StatDefinition.critRateMult.id, this.critChanceMin, this.critChanceMax, this.baseRatingMultiplier);
    }

    Actor.prototype.getEvadeChance = function() {
        return this.getRatingValue(gameData.StatDefinition.evaRate.id, gameData.StatDefinition.evaRateMult.id, this.evadeChanceMin, this.evadeChanceMax, this.baseRatingMultiplier);
    }

    Actor.prototype.getArmorDmgReduction = function() {
        return this.getRatingValue(gameData.StatDefinition.armor.id, gameData.StatDefinition.armorMult.id, 0, this.armorReductionMax, this.armorRatingMultiplier);
    }

    Actor.prototype.getRatingValue = function(ratingStat, ratingMultStat, min, max, multiplier) {
        var requiredRating = coreUtils.getSigma(this.getLevel()) * multiplier;
        var rating = this.getStat(ratingStat);
        var multiplier = this.getStat(ratingMultStat);
        var chance = (rating * multiplier) / requiredRating;
        if(chance > max) {
            chance = max;
        } else if (chance < min) {
            chance = min;
        }

        return chance;
    };

    // ---------------------------------------------------------------------------
    // equipment functions
    // ---------------------------------------------------------------------------
    Actor.prototype.updateEquipmentSlots = function(gameTime) {
        for(var type in this.equipmentSlots) {
            for(var i = 0; i < this.equipmentSlots[type].length; i++) {
                var slot = this.equipmentSlots[type][i];
                slot.update(gameTime);
            }
        }
    };

    Actor.prototype.addEquipmentSlot = function(type) {
        if(this.equipmentSlots[type] === undefined) {
            this.equipmentSlots[type] = [];
        }

        var slot = equipmentSlot.create(this.id  + type + (this.nextEquipmentSlotId++));
        slot.init();
        this.equipmentSlots[type].push(slot);
    };

    // ---------------------------------------------------------------------------
    // actor functions
    // ---------------------------------------------------------------------------
    Actor.prototype.heal = function(amount) {
        if(amount === undefined) {
            amount = this.getStat(gameData.StatDefinition.hpMax.id);
        }

        this.modifyStat(gameData.StatDefinition.hp.id, amount);
        if (this.getStat(gameData.StatDefinition.hp.id) > this.getStat(gameData.StatDefinition.hpMax.id)) {
            this.setStat(gameData.StatDefinition.hp.id, this.getStat(gameData.StatDefinition.hpMax.id));
        }
    }

    Actor.prototype.healMp = function(amount) {
        if(amount === undefined) {
            amount = this.getStat(gameData.StatDefinition.mpMax.id);
        }

        this.modifyStat(gameData.StatDefinition.mp.id, amount);
        if(this.getStat(gameData.StatDefinition.mp.id) > this.getStat(gameData.StatDefinition.mpMax.id)) {
            this.setStat(gameData.StatDefinition.mp.id, this.getStat(gameData.StatDefinition.mpMax.id));
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Actor.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Actor.call(self); }
    }
});