declare('Monster', function () {
    include('Actor');
    include('BuffSet');
    include('StaticData');
    include('ParticleManager');
    include('Loot');
    include('Data');
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

        this.legacyConstruct();
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



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Unchecked code below
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    Monster.prototype.legacyConstruct = function() {
        this.level = 0;
        this.rarity = staticData.MonsterRarity.COMMON;

        this.maxHealth = 0;
        this.damage = 0;
        this.armor = 0;
        this.goldWorth = 0;
        this.experienceWorth = 0;

        this.buffIconLeftPositionBase = 325;
        this.buffIconTopPosition = 0;
        this.buffLeftPositionIncrement = 30;
    };

    Monster.prototype.takeDamage = function(damage, isCritical, displayParticle) {
        this.modifyStat(data.StatDefinition.hp.id, -damage);
        game.stats.damageDealt += damage;

        // Create the player's damage particle
        if (displayParticle) {
            if (isCritical) {
                particleManager.createParticle(Math.round(this.lastDamageTaken), staticData.ParticleType.PLAYER_CRITICAL);
            }
            else {
                particleManager.createParticle(Math.round(this.lastDamageTaken), staticData.ParticleType.PLAYER_DAMAGE);
            }
        }

        if (this.getStat(data.StatDefinition.hp.id) <= 0) {
            this.alive = false;
            game.stats.monstersKilled++;
        }
    };

    // Add a debuff to this monster of the specified type, damage and duration
    Monster.prototype.addDebuff = function(type, damage, duration) {
        switch (type) {
            case staticData.DebuffType.BLEED:
                // If the monster is not currently bleeding then show the bleeding icon
                if (this.buffs.bleeding == false) {
                    $("#monsterBleedingIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.buffIconLeftPositionBase;
                    if (this.buffs.burning) {
                        left += this.buffLeftPositionIncrement;
                    }
                    if (this.buffs.chilled) {
                        left += this.buffLeftPositionIncrement;
                    }

                    // Set the position
                    $("#monsterBleedingIcon").css('left', left + 'px');
                }
                // Check to see if the player has any Rupture effects
                var effects = game.player.getEffectsOfType(staticData.EffectType.RUPTURE);
                var maxStacks = 5;
                if (effects.length > 0) {
                    for (var x = 0; x < effects.length; x++) {
                        maxStacks += effects[x].value;
                    }
                }
                this.buffs.bleeding = true;
                this.buffs.bleedDamage = damage;
                this.buffs.bleedDuration = 0;
                this.buffs.bleedMaxDuration = duration;
                this.buffs.bleedStacks += effects.length + 1
                if (this.buffs.bleedStacks > maxStacks) {
                    this.buffs.bleedStacks = maxStacks;
                }
                document.getElementById("monsterBleedingStacks").innerHTML = this.buffs.bleedStacks;
                break;
            case staticData.DebuffType.BURN:
                // If the monster is not currently burning then show the burning icon
                if (this.buffs.burning == false) {
                    $("#monsterBurningIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.buffIconLeftPositionBase;
                    if (this.buffs.bleeding) {
                        left += this.buffLeftPositionIncrement;
                    }
                    if (this.buffs.chilled) {
                        left += this.buffLeftPositionIncrement;
                    }

                    // Set the position
                    $("#monsterBurningIcon").css('left', left + 'px');
                }
                this.buffs.burning = true;
                this.buffs.burningDamage = damage;
                this.buffs.burningDuration = 0;
                this.buffs.burningMaxDuration = duration;
                // Check to see if the player has any Combustion effects allowing them to stack burning
                var effects = game.player.getEffectsOfType(staticData.EffectType.COMBUSTION);
                var maxStacks = 0;
                if (effects.length > 0) {
                    for (var x = 0; x < effects.length; x++) {
                        maxStacks += effects[x].value;
                    }
                }
                // Add a stack if possible
                if (maxStacks > this.buffs.burningStacks) {
                    this.buffs.burningStacks++;
                }
                if (this.buffs.burningStacks == 0) {
                    this.buffs.burningStacks = 1;
                }
                document.getElementById("monsterBurningStacks").innerHTML = this.buffs.burningStacks;
                break;
            case staticData.DebuffType.CHILL:
                // If the monster is not currently chilled then show the chilled icon
                if (this.buffs.chilled == false) {
                    $("#monsterChilledIcon").show();

                    // Calculate the position of the icon depending on how many debuffs the monster has
                    var left = this.buffIconLeftPositionBase;
                    if (this.buffs.bleeding) {
                        left += this.buffLeftPositionIncrement;
                    }
                    if (this.buffs.burning) {
                        left += this.buffLeftPositionIncrement;
                    }

                    // Set the position
                    $("#monsterChilledIcon").css('left', left + 'px');
                }
                this.buffs.chilled = true;
                this.buffs.chillDuration = 0;
                this.buffs.chillMaxDuration = duration;
                break;
        }
    };

    // Update all the debuffs on this monster
    /*Monster.prototype.updateDebuffs = function() {
        // Update all the debuffs on this monster
        // If there are bleed stacks on this monster
        if (this.buffs.bleeding) {
            // Cause the monster to take damage
            this.takeDamage(this.buffs.bleedDamage * this.buffs.bleedStacks, false, false);
            // Increase the duration of this debuff
            this.buffs.bleedDuration++;
            // If the debuff has expired then remove it
            if (this.buffs.bleedDuration >= this.buffs.bleedMaxDuration) {
                // Hide the icon and decrease the left position of the other icons
                $("#monsterBleedingIcon").hide();
                $("#monsterBurningIcon").css('left', ($("#monsterBurningIcon").position().left - this.buffLeftPositionIncrement) + 'px');
                $("#monsterChilledIcon").css('left', ($("#monsterChilledIcon").position().left - this.buffLeftPositionIncrement) + 'px');

                this.buffs.bleeding = false;
                this.buffs.bleedDamage = 0;
                this.buffs.bleedDuration = 0;
                this.buffs.bleedMaxDuration = 0;
                this.buffs.bleedStacks = 0;
            }
        }

        // If this monster is burning
        if (this.buffs.burning) {
            this.takeDamage(this.buffs.burningDamage * this.buffs.burningStacks, false, false);
            // Increase the duration of this debuff
            this.buffs.burningDuration++;
            // If the debuff has expired then remove it
            if (this.buffs.burningDuration >= this.buffs.burningMaxDuration) {
                $("#monsterBurningIcon").hide();
                $("#monsterBleedingIcon").css('left', ($("#monsterBleedingIcon").position().left - this.buffLeftPositionIncrement) + 'px');
                $("#monsterChilledIcon").css('left', ($("#monsterChilledIcon").position().left - this.buffLeftPositionIncrement) + 'px');

                this.buffs.burningStacks = 0;
                this.buffs.burningDamage = 0;
                this.buffs.burningDuration = 0;
                this.buffs.burningMaxDuration = 0;
                this.buffs.burning = false;
            }
        }

        // If this monster is chilled
        if (this.buffs.chilled) {
            // If the chill duration is even then the monster can't attack this turn
            if (this.canAttack) {
                this.canAttack = false;
            }
            else {
                this.canAttack = true;
            }
            // Increase the duration of this debuff
            this.buffs.chillDuration++;
            // If the debuff has expired then remove it
            if (this.buffs.chillDuration >= this.buffs.chillMaxDuration) {
                // Hide the icon and decrease the left position of the other icons
                $("#monsterChilledIcon").hide();
                $("#monsterBleedingIcon").css('left', ($("#monsterBleedingIcon").position().left - this.buffLeftPositionIncrement) + 'px');
                $("#monsterBurningIcon").css('left', ($("#monsterBurningIcon").position().left - this.buffLeftPositionIncrement) + 'px');

                this.buffs.chillDuration = 0;
                this.buffs.chillMaxDuration = 0;
                this.buffs.chilled = false;
            }
        }
        // If the monster is not chilled then it can attack
        else {
            this.canAttack = true;
        }
    }*/

    var surrogate = function(){};
    surrogate.prototype = Monster.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Monster.call(self); },
        create: function() { return new Monster(); }
    }
});