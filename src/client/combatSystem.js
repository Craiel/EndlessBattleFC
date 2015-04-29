declare('CombatSystem', function() {
    include('Debug');
    include('Component');
    include('EventAggregate');
    include('CombatUtils');
    include('CoreUtils');
    include('GameData');

    CombatSystem.prototype = component.prototype();
    CombatSystem.prototype.$super = parent;
    CombatSystem.prototype.constructor = CombatSystem;

    function CombatSystem() {
        component.construct(this);

        this.id = "CombatSystem";

        this.game = undefined;

        this.monsterUpdateCache = {};
        this.playerUpdateCache = {};

        this.actorUpdateDelay = 2500;
        this.actorUpdateTime = 0;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    CombatSystem.prototype.componentInit = CombatSystem.prototype.init;
    CombatSystem.prototype.init = function(game) {
        this.componentInit();

        this.game = game;
    };

    CombatSystem.prototype.componentUpdate = CombatSystem.prototype.update;
    CombatSystem.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        if(this.game.getInCombat() !== true) {
            // Turn off all auto combat timers etc
            return;
        }

        this.actorUpdateTime = coreUtils.processInterval(gameTime, this.actorUpdateTime, this.actorUpdateDelay, this, function(self) { self.updateActors(); });

        var monsters = this.game.getMonsters();
        for(var key in monsters) {
            //console.log(key);
            //console.log(monsters[key]);
        }

        this.actorCombatTick(this.game.player, gameTime);

        return true;
    };

    // ---------------------------------------------------------------------------
    // combat functions
    // ---------------------------------------------------------------------------
    CombatSystem.prototype.updateActors = function() {
        var monsters = this.game.getMonsters();

        var deleteList = [];
        for(var key in this.monsterUpdateCache) {
            var found = false;
            for(var position in monsters) {
                if(monsters[position] !== undefined && monsters[position].id === key) {
                    found = true;
                }
            }

            if(!found) {
                deleteList.push(key);
            }
        }

        for(var i = 0; i < deleteList.length; i++) {
            debug.logDebug("Removing Dead Monster from Cache: {0}".format(deleteList[i]));
            delete this.monsterUpdateCache[deleteList[i]];
        }

        for(var position in monsters) {
            if(monsters[position] !== undefined) {
                var needUpdate = this.updateActorAbilities(monsters[position], this.monsterUpdateCache);
                if(needUpdate === true) {
                    debug.logDebug("Actor {0} needs ability update!".format(monsters[position].id));
                }
            }
        }

        var needUpdate = this.updateActorAbilities(this.game.player, this.playerUpdateCache);
        if(needUpdate === true) {
            debug.logDebug("Player {0} needs ability update!".format(this.game.player.id));
        }

        console.log(this.monsterUpdateCache);
        console.log(this.playerUpdateCache);
    };

    CombatSystem.prototype.updateActorAbilities = function(actor, cache) {
        var speed = actor.getStat(gameData.StatDefinition.spd.id);
        var speedMultiplier = actor.getStat(gameData.StatDefinition.spdMult.id);
        console.log(speed + " - " + speedMultiplier);
        var finalSpeed = speed * speedMultiplier;

        var abilitySet = actor.getAbilities();

        var needUpdate = false;
        if(cache[actor.id] === undefined) {
            needUpdate = true;
            cache[actor.id] = {};
        }

        if(cache[actor.id].lastSpeed !== finalSpeed) {
            needUpdate = true;
            cache[actor.id].lastSpeed = finalSpeed;
        }


        if(cache[actor.id].abilityMap === undefined) {
            needUpdate = true;
            cache[actor.id].abilityMap = {};
        }

        for(var key in cache[actor.id].abilityMap) {
            if(abilitySet[key] === undefined) {
                // The ability is no longer present on this actor
                needUpdate = true;
                delete cache[actor.id].abilityMap[key];
            }
        }

        for(var key in abilitySet) {
            if(cache[actor.id].abilityMap[key] === undefined) {
                needUpdate = true;
                cache[actor.id].abilityMap[key] = 0;
            }
        }

        return needUpdate;
    };

    CombatSystem.prototype.actorCombatTick = function(actor, gameTime) {
        
        //console.log("Actor CombatSystem Tick for {0} ({1}), Speed: {2}".format(actor.name, actor.id, finalSpeed));
        /*var playerHit = combatUtils.resolveCombat(this.player, this.monsters.Center);
         var monsterHit = combatUtils.resolveCombat(this.monsters.Center, this.player);

         eventAggregate.publish(staticData.EventCombatHit, playerHit);
         eventAggregate.publish(staticData.EventCombatHit, monsterHit);*/
    };

    return new CombatSystem();
});