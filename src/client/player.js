declare('Player', function () {
    include('Assert');
    include('Log');
    include('Actor');
    include('Component');
    include('StaticData');
    include('Utils');
    include('Abilities');
    include('BuffSet');
    include('ParticleManager');
    include('StatUpgradeManager');
    include('GameState');
    include('Resources');
    include('Save');
    include('SaveKeys');
    include('Data');
    include('StatUtils');
    include('CoreUtils');
    include('Storage');

    Player.prototype = actor.create();
    Player.prototype.$super = parent;
    Player.prototype.constructor = Player;

    function Player() {
        this.id = "Player";
        this.name = "Hero";

        this.statsChanged = true;

        save.register(this, saveKeys.idnName).withDefault("#ERR");
        save.register(this, saveKeys.idnPlayerBaseStats).asJson();
        save.register(this, saveKeys.idnPlayerSkillPoints).asNumber().withDefault(0);
        save.register(this, saveKeys.idnPlayerStorageSlots).asJsonArray().withDefault([]);
        save.register(this, saveKeys.idnLevel).asNumber().withDefault(1).withCallback(false, true, false);

        this.storage = undefined;

        this.hp5Delay = 5000;
        this.hp5Time = 0;
        this.mp5Delay = 5000;
        this.mp5Time = 0;

        this.resurrectionTime = 0;
        this.resurrectionDelay = 10000;
        this.resurrectionDelayMin = 10000;
        this.resurrectionDelayIncrement = 10000;
        this.resurrectionDelayMax = 600000;
        this.resurrectionDelayDecreaseInterval = 30000;
        this.resurrectionDelayDecreaseTime = 0;

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.actorInit = this.init;
        this.init = function() {
            this.actorInit(this[saveKeys.idnPlayerBaseStats]);

            statUtils.initStats(this[saveKeys.idnPlayerBaseStats]);

            this.storage = storage.create(this.id, 25);
            this.storage.init();
        }

        this.actorUpdate = this.update;
        this.update = function(gameTime) {
            if(this.actorUpdate(gameTime) !== true) {
                return false;
            }

            // Perform some basic operations that happen when the player is alive
            if(this.alive === true) {
                // Hp5
                this.hp5Time = coreUtils.processInterval(gameTime, this.hp5Time, this.hp5Delay, this, function(self, value) { self.heal(value); }, this.getStat(data.StatDefinition.hp5.id));

                // Mp5
                this.mp5Time = coreUtils.processInterval(gameTime, this.mp5Time, this.mp5Delay, this, function(self, value) { self.healMp(value); }, this.getStat(data.StatDefinition.mp5.id));

                this.processResurrectionDelay(gameTime);
            } else {
                this.processResurrection(gameTime);
            }

            return true;
        }

        // ---------------------------------------------------------------------------
        // getters / setters
        // ---------------------------------------------------------------------------
        this.getBaseStats = function() {
            return this[saveKeys.idnPlayerBaseStats];
        }

        this.getLevel = function() {
            return this[saveKeys.idnLevel];
        }

        this.getAverageDamage = function() {
            var minDamage = this.getStat(data.StatDefinition.dmgMin);
            return minDamage + (this.getStat(data.StatDefinition.dmgMax) - minDamage);
        }

        this.getSkillPoints = function() {
            return this[saveKeys.idnPlayerSkillPoints];
        }

        this.getStorage = function() {
            return this.storage;
        }

        this.modifySkillPoints = function(value) {
            assert.isDefined(value);
            assert.isNotNaN(value);

            this[saveKeys.idnPlayerSkillPoints] += value;
        }

        // ---------------------------------------------------------------------------
        // player functions
        // ---------------------------------------------------------------------------
        this.levelUp = function() {
            this.setStat(data.StatDefinition.xp.id, 0);
            this[saveKeys.idnLevel]++;
            this[saveKeys.idnPlayerSkillPoints]++;

            // Todo
            this.legacyLevelUp();
        }

        this.heal = function(amount) {
            this.modifyStat(data.StatDefinition.hp.id, amount);
            if (this.getStat(data.StatDefinition.hp.id) > this.getStat(data.StatDefinition.hpMax.id)) {
                this.setStat(data.StatDefinition.hp.id, this.getStat(data.StatDefinition.hpMax.id));
            }
        }

        this.healMp = function(amount) {
            this.modifyStat(data.StatDefinition.mp.id, amount);
            if(this.getStat(data.StatDefinition.mp.id) > this.getStat(data.StatDefinition.mpMax.id)) {
                this.setStat(data.StatDefinition.mp.id, this.getStat(data.StatDefinition.mpMax.id));
            }
        }

        this.processResurrectionDelay = function(gameTime) {
            if(this.resurrectionDelayDecreaseTime === 0) {
                this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
                return;
            }

            if(gameTime.current < this.resurrectionDelayDecreaseTime) {
                return;
            }

            if(this.resurrectionDelay > this.resurrectionDelayMin) {
                this.resurrectionDelay -= this.resurrectionDelayIncrement;
                this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
                log.info("Decreasing res time to " + this.resurrectionDelay);
            }
        }

        this.processResurrection = function(gameTime) {
            assert.isFalse(this.alive);

            if(this.resurrectionTime === 0) {
                this.resurrectionTime = gameTime.current + this.resurrectionDelay;
                return;
            }

            if(this.resurrectionTime > gameTime.current) {
                return;
            }

            // Bring the player back alive
            this.alive = true;
            this.resurrectionTime = 0;

            // Make the next resurrection a little more costly
            if(this.resurrectionDelay < this.resurrectionDelayMax) {
                this.resurrectionDelay += this.resurrectionDelayIncrement;
                this.resurrectionDelayDecreaseTime = gameTime.current + this.resurrectionDelayDecreaseInterval;
                log.info("Increasing res time to " + this.resurrectionDelay);
            }
        }

        this.getResurrectionTime = function() {
            return this.resurrectionDelay;
        }

        this.getResurrectionTimeRemaining = function(gameTime) {
            assert.isFalse(this.alive);

            if(this.resurrectionTime <= 0) {
                return 0;
            }

            if(this.resurrectionTime < gameTime.current) {
                return 0;
            }

            return this.resurrectionTime - gameTime.current;
        }

        this.onLoad = function() {
            // Update the storage slot data with the object from the save
            this.storage.setSlotData(this[saveKeys.idnPlayerStorageSlots]);

            // TODO:
            this.baseExperienceRequired = 10;
            this.experienceRequired = Math.ceil(utils.Sigma(this[saveKeys.idnLevel] * 2) * Math.pow(1.05, this[saveKeys.idnLevel]) + this.baseExperienceRequired);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Unchecked code below
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Stat bonuses automatically gained when leveling up
        this.baseLevelUpBonuses = {};
        statUtils.initStats(this.baseLevelUpBonuses);
        this.baseLevelUpBonuses.health = 5;
        this.baseLevelUpBonuses.hp5 = 1;

        // The amount of stats the player has gained from leveling up
        this.levelUpBonuses = {};
        statUtils.initStats(this.levelUpBonuses);

        // Stat bonuses chosen when leveling up
        this.chosenLevelUpBonuses = {};
        statUtils.initStats(this.chosenLevelUpBonuses);

        // Item stat bonuses; this does not include increases to these stats
        this.baseItemBonuses = {};
        statUtils.initStats(this.baseItemBonuses);

        // All the special effects from items the player has
        this.effects = new Array();

        // Resources
        this.lastGoldGained = 0;

        this.lastExperienceGained = 0;

        // Death


        // Abilities
        this.skillPointsSpent = 0;
        this.abilities = abilities.create();

        /*// Stat calculation functions
        this.getMaxHealth = function() {
            return Math.floor((this.getStrength() * 5) + (((this.baseStats.health + this.levelUpBonuses.health + this.baseItemBonuses.health) * (((mercenaryManager.getCommanderHealthPercentBonus() * gameState.commandersOwned) / 100) + 1)) * ((this.powerShards / 100) + 1)));
        }
        this.getHp5 = function() {
            return Math.floor(this.getStamina() + (((this.baseStats.hp5 + this.levelUpBonuses.hp5 + this.chosenLevelUpBonuses.hp5 + this.baseItemBonuses.hp5) * ((mercenaryManager.getClericHp5PercentBonus() * gameState.clericsOwned) / 100 + 1)) * ((this.powerShards / 100) + 1)));
        }
        this.getMinDamage = function() {
            // If the player has a weapon equipped then remove the 1 unarmed damage
            if (game.equipment.weapon() != null) {
                return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage - 1) * ((this.getDamageBonus() + 100) / 100)) * this.buffs.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
            else {
                return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage) * ((this.getDamageBonus() + 100) / 100)) * this.buffs.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
        }
        this.getMaxDamage = function() {
            // If the player has a weapon equipped then remove the 2 unarmed damage
            if (game.equipment.weapon() != null) {
                return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage - 1) * ((this.getDamageBonus() + 100) / 100)) * this.buffs.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
            else {
                return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage) * ((this.getDamageBonus() + 100) / 100)) * this.buffs.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
        }
        this.getDamageBonus = function() {
            var baseBonus = this.baseStats.damageBonus + this.chosenLevelUpBonuses.damageBonus + this.baseItemBonuses.damageBonus;
            var mercenaryBonus = mercenaryManager.getMageDamagePercentBonus() * gameState.magesOwned;
            //var mercenaryBonus = 0;
            var shardMultiplier = (this.powerShards / 100) + 1;
            var bonus = (baseBonus + mercenaryBonus) * shardMultiplier;
            return this.getStrength() + bonus;
        }
        this.getArmor = function() {
            return Math.floor(((this.baseStats.armor + this.chosenLevelUpBonuses.armor + this.baseItemBonuses.armor) * ((this.getStamina() / 100) + 1)) * ((this.powerShards / 100) + 1));
        }
        this.getEvasion = function() {
            return Math.floor(((this.baseStats.evasion + this.chosenLevelUpBonuses.evasion + this.baseItemBonuses.evasion) * (((this.getAgility() + (mercenaryManager.getAssassinEvasionPercentBonus() * gameState.assassinsOwned)) / 100) + 1)) * ((this.powerShards / 100) + 1));
        }
        this.getStrength = function() {
            return Math.floor((this.baseStats.strength + this.chosenLevelUpBonuses.strength + this.baseItemBonuses.strength) * ((this.powerShards / 100) + 1));
        }
        this.getStamina = function() {
            return Math.floor((this.baseStats.stamina + this.chosenLevelUpBonuses.stamina + this.baseItemBonuses.stamina) * ((this.powerShards / 100) + 1));
        }
        this.getAgility = function() {
            return Math.floor((this.baseStats.agility + this.chosenLevelUpBonuses.agility + this.baseItemBonuses.agility) * ((this.powerShards / 100) + 1));
        }
        this.getCritChance = function() {
            return ((this.baseStats.critChance + this.chosenLevelUpBonuses.critChance + this.baseItemBonuses.critChance)) * ((this.powerShards / 100) + 1);
        }
        this.getCritDamage = function() {
            return ((this.baseStats.critDamage + this.chosenLevelUpBonuses.critDamage + this.baseItemBonuses.critDamage) + (this.getAgility() * 0.2) + (mercenaryManager.getWarlockCritDamageBonus() * gameState.warlocksOwned)) * ((this.powerShards / 100) + 1);
        }
        this.getItemRarity = function() {
            return (this.baseStats.itemRarity + this.chosenLevelUpBonuses.itemRarity + this.baseItemBonuses.itemRarity) * ((this.powerShards / 100) + 1);
        }
        this.getGoldGain = function() {
            return (this.baseStats.goldGain + this.chosenLevelUpBonuses.goldGain + this.baseItemBonuses.goldGain) * ((this.powerShards / 100) + 1);
        }
        this.getExperienceGain = function() {
            return (this.baseStats.experienceGain + this.chosenLevelUpBonuses.experienceGain + this.baseItemBonuses.experienceGain) * ((this.powerShards / 100) + 1);
        }*/

        // Get the power of a certain special effect
        this.getEffectsOfType = function(type) {
            var allEffects = new Array();
            for (var x = 0; x < this.effects.length; x++) {
                if (this.effects[x].type == type) {
                    allEffects.push(this.effects[x]);
                }
            }
            return allEffects;
        }

        // Increase the power of an ability
        this.increaseAbilityPower = function(name) {
            // Increase the level for the ability
            switch (name) {
                case staticData.AbilityName.REND:
                    this.abilities.baseRendLevel++;
                    break;
                case staticData.AbilityName.REJUVENATING_STRIKES:
                    this.abilities.baseRejuvenatingStrikesLevel++;
                    break;
                case staticData.AbilityName.ICE_BLADE:
                    this.abilities.baseIceBladeLevel++;
                    break;
                case staticData.AbilityName.FIRE_BLADE:
                    this.abilities.baseFireBladeLevel++;
                    break;
            }

            // Alter the player's skill points
            this[saveKeys.idnPlayerSkillPoints]--;
            this.skillPointsSpent++;
        }

        // Use all the abilities the player has
        this.useAbilities = function() {
            var monstersDamageTaken = 0;
            var criticalHappened = false;
            // Use the abilities
            // REND
            if (this.abilities.getRendLevel() > 0) {
                // Apply the bleed effect to the monster
                game.monster.addDebuff(staticData.DebuffType.BLEED, this.abilities.getRendDamage(0), this.abilities.rendDuration);
            }
            // REJUVENATING STRIKES
            if (this.abilities.getRejuvenatingStrikesLevel() > 0) {
                // Heal the player
                this.heal(this.abilities.getRejuvenatingStrikesHealAmount(0));
            }
            // ICE BLADE
            if (this.abilities.getIceBladeLevel() > 0) {
                // Calculate the damage
                var damage = this.abilities.getIceBladeDamage(0);
                // See if the player will crit
                if (this.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                    damage *= (this.getStat(data.StatDefinition.critDmg.id) / 100);
                    criticalHappened = true;
                }
                // Damage the monster
                game.monster.takeDamage(damage, criticalHappened, false);

                // Apply the chill effect to the monster
                game.monster.addDebuff(staticData.DebuffType.CHILL, 0, this.abilities.iceBladeChillDuration);
            }
            // FIRE BLADE
            if (this.abilities.getFireBladeLevel() > 0) {
                // Calculate the damage
                var damage = this.abilities.getFireBladeDamage(0);
                // See if the player will crit
                if (this.getStat(data.StatDefinition.critRate.id) >= (Math.random() * 100)) {
                    damage *= (this.getStat(data.StatDefinition.critDmg.id) / 100);
                    criticalHappened = true;
                }
                // Damage the monster
                game.monster.takeDamage(damage, criticalHappened, false);

                // Apply the burn effect to the monster
                game.monster.addDebuff(staticData.DebuffType.BURN, this.abilities.getFireBladeBurnDamage(0), this.abilities.fireBladeBurnDuration);
            }
        }

        // Change the player's attack
        /*this.changeAttack = function(type) {
            switch (type) {
                case staticData.AttackType.BASIC_ATTACK:
                    this.attackType = staticData.AttackType.BASIC_ATTACK;
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 0');
                    break;
                case staticData.AttackType.POWER_STRIKE:
                    this.attackType = staticData.AttackType.POWER_STRIKE;
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 100px');
                    break;
                case staticData.AttackType.DOUBLE_STRIKE:
                    this.attackType = staticData.AttackType.DOUBLE_STRIKE;
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 50px');
                    break;
            }
        }*/

        // Gain an amount of gold, this can include bonuses from gold gain and it also can not
        this.gainGold = function(amount, includeBonuses) {
            if (includeBonuses) {
                amount *= this.getStat(data.StatDefinition.goldMult.id);
                amount *= this.buffs.getGoldMultiplier();
            }

            this.modifyStat(data.StatDefinition.gold.id, amount);
            this.lastGoldGained = amount;
            game.stats.goldEarned += this.lastGoldGained;
        }

        // Gain an amount of experience, this can include bonuses from exp gain and it also can not
        this.gainExperience = function(amount, includeBonuses) {
            if (includeBonuses) {
                amount *= this.getStat(data.StatDefinition.xpMult.id);
                amount *= this.buffs.getExperienceMultiplier();
            }

            this.modifyStat(data.StatDefinition.xp.id, amount);
            this.lastExperienceGained = amount;
            game.stats.experienceEarned += this.lastExperienceGained;

            // Give the player a level if enough experience was gained
            var levels = Math.floor(this.getStat(data.StatDefinition.xp.id) / this.experienceRequired);
            for(var i = 0; i < levels; i++) {
                this.levelUp();
            }
        }

        this.legacyLevelUp = function() {
            this.experienceRequired = Math.ceil(utils.Sigma(this[saveKeys.idnLevel] * 2) * Math.pow(1.05, this[saveKeys.idnLevel]) + this.baseExperienceRequired);

            // If this number is not divisible by 5 then add a random stat upgrade
            if (this[saveKeys.idnLevel] % 5 != 0) {
                statUpgradeManager.addRandomUpgrades(this[saveKeys.idnLevel]);
            }

            // Add stats to the player for leveling up
            this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, this[saveKeys.idnLevel] - 1)));
            this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, this[saveKeys.idnLevel] - 1)));
        }

        // Take an amount of damage
        this.takeDamage = function(damage) {
            // Reduce the damage based on the amount of armor
            var damageReduction = this.calculateDamageReduction();
            var newDamage = damage - Math.floor(damage * (damageReduction / 100));
            if (newDamage < 0) {
                newDamage = 0;
            }

            // Take the damage
            this.modifyStat(data.StatDefinition.hp.id, -newDamage);
            this.lastDamageTaken = newDamage;
            game.stats.damageTaken += newDamage;

            // Reflect a percentage of the damage if the player has any Barrier effects
            var reflectAmount = 0;
            var barrierEffects = this.getEffectsOfType(staticData.EffectType.BARRIER);
            for (var x = 0; x < barrierEffects.length; x++) {
                reflectAmount += barrierEffects[x].value;
            }
            reflectAmount = this.lastDamageTaken * (reflectAmount / 100);
            if (reflectAmount > 0) {
                game.monster.takeDamage(reflectAmount, false, false);
            }

            // Check if the player is dead
            if (this.getStat(data.StatDefinition.hp.id) <= 0) {
                this.alive = false;
            }

            // Create the monster's damage particle
            particleManager.createParticle(newDamage, staticData.ParticleType.MONSTER_DAMAGE);
        }

        // Calculate the amount of reduction granted by armor
        this.calculateDamageReduction = function() {
            // Calculate the reduction
            var armor = this.getStat(data.StatDefinition.armor.id);
            var reduction = armor / (armor + 500) * 99

            // Cap the reduction at 99%
            if (reduction >= 99) {
                reduction = 99;
            }

            return reduction;
        }

        // Calculate the chance the player has of dodging an attack
        this.calculateEvasionChance = function() {
            // Calculate the chance
            var evasionRate = this.getStat(data.StatDefinition.evaRate.id);
            var chance = (evasionRate / (evasionRate + 375)) * 75;

            // Cap the dodge at 75%
            if (chance >= 75) {
                chance = 75;
            }

            return chance;
        }



        // Gain the stats from an item
        this.gainItemsStats = function(item) {
            this.baseItemBonuses.minDamage += item.minDamage + item.damageBonus;
            this.baseItemBonuses.maxDamage += item.maxDamage + item.damageBonus;

            this.baseItemBonuses.strength += item.strength;
            this.baseItemBonuses.agility += item.agility;
            this.baseItemBonuses.stamina += item.stamina;

            this.baseItemBonuses.health += item.health;
            this.baseItemBonuses.hp5 += item.hp5;
            this.baseItemBonuses.armor += item.armor + item.armorBonus;
            this.baseItemBonuses.evasion += item.evasion;

            this.baseItemBonuses.critChance += item.critChance;
            this.baseItemBonuses.critDamage += item.critDamage;

            this.baseItemBonuses.itemRarity += item.itemRarity;
            this.baseItemBonuses.goldGain += item.goldGain;
            this.baseItemBonuses.experienceGain += item.experienceGain;
            for (var x = 0; x < item.effects.length; x++) {
                this.effects.push(item.effects[x]);
            }
        }

        // Lose the stats from an item
        this.loseItemsStats = function(item) {
            this.baseItemBonuses.minDamage -= item.minDamage + item.damageBonus;
            this.baseItemBonuses.maxDamage -= item.maxDamage + item.damageBonus;

            this.baseItemBonuses.strength -= item.strength;
            this.baseItemBonuses.agility -= item.agility;
            this.baseItemBonuses.stamina -= item.stamina;

            this.baseItemBonuses.health -= item.health;
            this.baseItemBonuses.hp5 -= item.hp5;
            this.baseItemBonuses.armor -= item.armor + item.armorBonus;
            this.baseItemBonuses.evasion -= item.evasion;

            this.baseItemBonuses.critChance -= item.critChance;
            this.baseItemBonuses.critDamage -= item.critDamage;

            this.baseItemBonuses.itemRarity -= item.itemRarity;
            this.baseItemBonuses.goldGain -= item.goldGain;
            this.baseItemBonuses.experienceGain -= item.experienceGain;
            for (var x = item.effects.length - 1; x >= 0; x--) {
                for (var y = this.effects.length - 1; y >= 0; y--) {
                    if (this.effects[y].type == item.effects[x].type &&
                        this.effects[y].chance == item.effects[x].chance &&
                        this.effects[y].value == item.effects[x].value) {
                        this.effects.splice(y, 1);
                        break;
                    }
                }
            }
        }

        // Add a debuff to the player of the specified type, damage and duration
        this.addDebuff = function(type, damage, duration) {
            switch (type) {
                case staticData.DebuffType.BLEED:
                    this.buffs.bleeding = true;
                    this.buffs.bleedDamage = damage;
                    this.buffs.bleedDuration = 0;
                    this.buffs.bleedMaxDuration = duration;
                    this.buffs.bleedStacks++;
                    break;
                case staticData.DebuffType.CHILL:
                    this.buffs.chilled = true;
                    this.buffs.chillDuration = 0;
                    this.buffs.chillMaxDuration = duration;
                    break;
                case staticData.DebuffType.BURN:
                    this.buffs.burning = true;
                    this.buffs.burningDamage = damage;
                    this.buffs.burningDuration = 0;
                    this.buffs.burningMaxDuration = duration;
                    break;
            }
        }



        // Update all the debuffs on the player
        this.updateDebuffs = function() {
            // If the player is bleeding
            if (this.buffs.bleeding) {
                // Cause the player to take damage
                this.takeDamage(this.buffs.bleedDamage);
                // Increase the duration of this debuff
                this.buffs.bleedDuration++;
                // If the debuff has expired then remove it
                if (this.buffs.bleedDuration >= this.buffs.bleedMaxDuration) {
                    this.buffs.bleeding = false;
                    this.buffs.bleedDamage = 0;
                    this.buffs.bleedDuration = 0;
                    this.buffs.bleedMaxDuration = 0;
                    this.buffs.bleedStacks = 0;
                }
            }

            // If the player is chilled
            if (this.buffs.chilled) {
                // If the chill duration is even then the player can't attack this turn
                if (this.buffs.chillDuration == 0 || (this.buffs.chillDuration % 2 == 0)) {
                    this.canAttack = false;
                }
                else {
                    this.canAttack = true;
                }
                // Increase the duration of this debuff
                this.buffs.chillDuration++;
                // If the debuff has expired then remove it
                if (this.buffs.chillDuration >= this.buffs.chillMaxDuration) {
                    this.buffs.chillDuration = 0;
                    this.buffs.chillMaxDuration = 0;
                    this.buffs.chilled = false;
                }
            }
            // If the player is not chilled then they can attack
            else {
                this.canAttack = true;
            }

            // If the player is burning
            if (this.buffs.burning) {
                // Cause the player to take damage
                this.takeDamage(this.buffs.burningDamage);
                // Increase the duration of this debuff
                this.buffs.burningDuration++;
                // If the debuff has expired then remove it
                if (this.buffs.burningDuration >= this.buffs.burningMaxDuration) {
                    this.buffs.burningDamage = 0;
                    this.buffs.burningDuration = 0;
                    this.buffs.burningMaxDuration = 0;
                    this.buffs.burning = false;
                }
            }
        }

        // Save all the player's data
        /*this.save = function() {
            localStorage.chosenLevelUpBonuses = JSON.stringify(this.chosenLevelUpBonuses);
            localStorage.baseItemBonuses = JSON.stringify(this.baseItemBonuses);

            localStorage.playerSkillPointsSpent = this.skillPointsSpent;
            this.abilities.save();

            localStorage.playerAlive = this.alive;
            localStorage.attackType = this.attackType;
            localStorage.playerEffects = JSON.stringify(this.effects);

        }*/

        // Load all the player's data
        /*this.load = function load() {
            if (localStorage.playerSaved != null) {

                // Add stats to the player for leveling up
                for (var x = 1; x < this[saveKeys.idnLevel]; x++) {
                    this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, x)));
                    this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, x)));
                }

                this.experienceRequired = Math.ceil(utils.Sigma(this[saveKeys.idnLevel] * 2) * Math.pow(1.05, this[saveKeys.idnLevel]) + this.baseExperienceRequired);

                this.skillPointsSpent = parseInt(localStorage.playerSkillPointsSpent);
                if (this[saveKeys.idnPlayerSkillPoints] > 0) {
                    $("#levelUpButton").show();
                }
                this.abilities.load();
                this.changeAttack(localStorage.attackType);

                this.chosenLevelUpBonuses = JSON.parse(localStorage.chosenLevelUpBonuses);
                this.baseItemBonuses = JSON.parse(localStorage.baseItemBonuses);
                this.changeAttack(localStorage.attackType);
                var newEffects = JSON.parse(localStorage.playerEffects);
                if (newEffects != null && newEffects.length > 0) {
                    for (var x = 0; x < newEffects.length; x++) {
                        this.effects.push(new Effect(newEffects[x].type, newEffects[x].chance, newEffects[x].value));
                    }
                }

            }

            if (localStorage.playerAlive != null) {
                this.alive = JSON.parse(localStorage.playerAlive);
            }
        }*/
    }

    return {
        create: function() { return new Player(); }
    }
});