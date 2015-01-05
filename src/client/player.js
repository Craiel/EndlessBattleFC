declare("Player", function () {
    include('Component');
    include('PlayerState');
    include('Static');
    include('Utils');
    include('Abilities');
    include('BuffSet');
    include('MercenaryManager');
    include('ParticleManager');
    include('StatUpgradeManager');

    Player.prototype = component.create();
    Player.prototype.$super = parent;
    Player.prototype.constructor = Player;

    function Player() {
        this.id = "Player";

        this.level = 1;
        this.health = 100;

        // Base values for all stats; these are static
        this.baseStats = playerState.create();
        this.baseStats.health = this.health;
        this.baseStats.hp5 = 10;
        this.baseStats.minDamage = 1;
        this.baseStats.maxDamage = 1;
        this.baseStats.damageBonus = 0;
        this.baseStats.armour = 0;
        this.baseStats.evasion = 0;
        this.baseStats.strength = 0;
        this.baseStats.agility = 0;
        this.baseStats.stamina = 0;
        this.baseStats.critChance = 5;
        this.baseStats.critDamage = 200;
        this.baseStats.itemRarity = 0;
        this.baseStats.goldGain = 0;
        this.baseStats.experienceGain = 0;

        // Stat bonuses automatically gained when leveling up
        this.baseLevelUpBonuses = playerState.create();
        this.baseLevelUpBonuses.health = 5;
        this.baseLevelUpBonuses.hp5 = 1;

        // The amount of stats the player has gained from leveling up
        this.levelUpBonuses = playerState.create();

        // Stat bonuses chosen when leveling up
        this.chosenLevelUpBonuses = playerState.create();

        // Item stat bonuses; this does not include increases to these stats
        this.baseItemBonuses = playerState.create();

        // All the special effects from items the player has
        this.effects = new Array();

        // Combat
        this.lastDamageTaken = 0;
        this.alive = true;
        this.canAttack = true;
        this.attackType = static.AttackType.BASIC_ATTACK;

        // Resources
        this.gold = 0;
        this.lastGoldGained = 0;
        this.experience = 0;
        this.baseExperienceRequired = 10;
        this.experienceRequired = Math.ceil(utils.Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);
        this.lastExperienceGained = 0;
        this.powerShards = 0;

        // Death
        this.resurrecting = false;
        this.resurrectionTimer = 60;
        this.resurrectionTimeRemaining = 0;

        // Abilities
        this.skillPointsSpent = 0;
        this.skillPoints = 0;
        this.abilities = abilities.create();

        // Buffs/Debuffs
        this.buffSet = buffSet.create();

        // Stat calculation functions
        this.getMaxHealth = function() {
            return Math.floor((this.getStrength() * 5) + (((this.baseStats.health + this.levelUpBonuses.health + this.baseItemBonuses.health) * (((mercenaryManager.getCommanderHealthPercentBonus() * mercenaryManager.commandersOwned) / 100) + 1)) * ((this.powerShards / 100) + 1)));
        }
        this.getHp5 = function() {
            return Math.floor(this.getStamina() + (((this.baseStats.hp5 + this.levelUpBonuses.hp5 + this.chosenLevelUpBonuses.hp5 + this.baseItemBonuses.hp5) * ((mercenaryManager.getClericHp5PercentBonus() * mercenaryManager.clericsOwned) / 100 + 1)) * ((this.powerShards / 100) + 1)));
        }
        this.getMinDamage = function() {
            // If the player has a weapon equipped then remove the 1 unarmed damage
            if (game.equipment.weapon() != null) {
                return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage - 1) * ((this.getDamageBonus() + 100) / 100)) * this.buffSet.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
            else {
                return Math.floor((((this.baseStats.minDamage + this.baseItemBonuses.minDamage) * ((this.getDamageBonus() + 100) / 100)) * this.buffSet.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
        }
        this.getMaxDamage = function() {
            // If the player has a weapon equipped then remove the 2 unarmed damage
            if (game.equipment.weapon() != null) {
                return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage - 1) * ((this.getDamageBonus() + 100) / 100)) * this.buffSet.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
            else {
                return Math.floor((((this.baseStats.maxDamage + this.baseItemBonuses.maxDamage) * ((this.getDamageBonus() + 100) / 100)) * this.buffSet.getDamageMultiplier()) * ((this.powerShards / 100) + 1));
            }
        }
        this.getDamageBonus = function() {
            return this.getStrength() + ((this.baseStats.damageBonus + this.chosenLevelUpBonuses.damageBonus + this.baseItemBonuses.damageBonus + (mercenaryManager.getMageDamagePercentBonus() * mercenaryManager.magesOwned)) * ((this.powerShards / 100) + 1));
        }
        this.getAverageDamage = function() {
            var average = this.getMaxDamage() - this.getMinDamage();
            average += this.getMinDamage();
            return average;
        }
        this.getArmour = function() {
            return Math.floor(((this.baseStats.armour + this.chosenLevelUpBonuses.armour + this.baseItemBonuses.armour) * ((this.getStamina() / 100) + 1)) * ((this.powerShards / 100) + 1));
        }
        this.getEvasion = function() {
            return Math.floor(((this.baseStats.evasion + this.chosenLevelUpBonuses.evasion + this.baseItemBonuses.evasion) * (((this.getAgility() + (mercenaryManager.getAssassinEvasionPercentBonus() * mercenaryManager.assassinsOwned)) / 100) + 1)) * ((this.powerShards / 100) + 1));
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
            return ((this.baseStats.critDamage + this.chosenLevelUpBonuses.critDamage + this.baseItemBonuses.critDamage) + (this.getAgility() * 0.2) + (mercenaryManager.getWarlockCritDamageBonus() * mercenaryManager.warlocksOwned)) * ((this.powerShards / 100) + 1);
        }
        this.getItemRarity = function() {
            return (this.baseStats.itemRarity + this.chosenLevelUpBonuses.itemRarity + this.baseItemBonuses.itemRarity) * ((this.powerShards / 100) + 1);
        }
        this.getGoldGain = function() {
            return (this.baseStats.goldGain + this.chosenLevelUpBonuses.goldGain + this.baseItemBonuses.goldGain) * ((this.powerShards / 100) + 1);
        }
        this.getExperienceGain = function() {
            return (this.baseStats.experienceGain + this.chosenLevelUpBonuses.experienceGain + this.baseItemBonuses.experienceGain) * ((this.powerShards / 100) + 1);
        }

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
                case AbilityName.REND:
                    this.abilities.baseRendLevel++;
                    break;
                case AbilityName.REJUVENATING_STRIKES:
                    this.abilities.baseRejuvenatingStrikesLevel++;
                    break;
                case AbilityName.ICE_BLADE:
                    this.abilities.baseIceBladeLevel++;
                    break;
                case AbilityName.FIRE_BLADE:
                    this.abilities.baseFireBladeLevel++;
                    break;
            }

            // Alter the player's skill points
            this.skillPoints--;
            this.skillPointsSpent++;

            // Show the Level Up button if there are still skill points remaining
            if (this.skillPoints > 0) {
                $("#levelUpButton").show();
            }
        }

        // Use all the abilities the player has
        this.useAbilities = function() {
            var monstersDamageTaken = 0;
            var criticalHappened = false;
            // Use the abilities
            // REND
            if (this.abilities.getRendLevel() > 0) {
                // Apply the bleed effect to the monster
                game.monster.addDebuff(DebuffType.BLEED, this.abilities.getRendDamage(0), this.abilities.rendDuration);
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
                if (this.getCritChance() >= (Math.random() * 100)) {
                    damage *= (this.getCritDamage() / 100);
                    criticalHappened = true;
                }
                // Damage the monster
                game.monster.takeDamage(damage, criticalHappened, false);

                // Apply the chill effect to the monster
                game.monster.addDebuff(DebuffType.CHILL, 0, this.abilities.iceBladeChillDuration);
            }
            // FIRE BLADE
            if (this.abilities.getFireBladeLevel() > 0) {
                // Calculate the damage
                var damage = this.abilities.getFireBladeDamage(0);
                // See if the player will crit
                if (this.getCritChance() >= (Math.random() * 100)) {
                    damage *= (this.getCritDamage() / 100);
                    criticalHappened = true;
                }
                // Damage the monster
                game.monster.takeDamage(damage, criticalHappened, false);

                // Apply the burn effect to the monster
                game.monster.addDebuff(DebuffType.BURN, this.abilities.getFireBladeBurnDamage(0), this.abilities.fireBladeBurnDuration);
            }
        }

        // Change the player's attack
        this.changeAttack = function(type) {
            switch (type) {
                case static.AttackType.BASIC_ATTACK:
                    this.attackType = static.AttackType.BASIC_ATTACK;
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 0');
                    break;
                case static.AttackType.POWER_STRIKE:
                    this.attackType = static.AttackType.POWER_STRIKE;
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 100px');
                    break;
                case static.AttackType.DOUBLE_STRIKE:
                    this.attackType = static.AttackType.DOUBLE_STRIKE;
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 50px');
                    break;
            }
        }

        // Gain an amount of gold, this can include bonuses from gold gain and it also can not
        this.gainGold = function(amount, includeBonuses) {
            if (includeBonuses) {
                amount *= 1 + (this.getGoldGain() / 100);
                amount *= this.buffSet.getGoldMultiplier();
                this.gold += amount;
                this.lastGoldGained = amount;
            }
            else {
                this.gold += amount;
                this.lastGoldGained = amount;
            }
            game.stats.goldEarned += this.lastGoldGained;
        }

        // Gain an amount of experience, this can include bonuses from exp gain and it also can not
        this.gainExperience = function(amount, includeBonuses) {
            if (includeBonuses) {
                amount *= 1 + (this.getExperienceGain() / 100);
                amount *= this.buffSet.getExperienceMultiplier();
                this.experience += amount;
                this.lastExperienceGained = amount;
            }
            else {
                this.experience += amount;
                this.lastExperienceGained = amount;
            }
            game.stats.experienceEarned += this.lastExperienceGained;

            // Give the player a level if enough experience was gained
            while (this.experience >= this.experienceRequired) {
                this.experience -= this.experienceRequired;
                this.level++;
                this.skillPoints++;
                this.experienceRequired = Math.ceil(utils.Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);
                $("#levelUpButton").show();

                // If this number is not divisible by 5 then add a random stat upgrade
                if (this.level % 5 != 0) {
                    statUpgradeManager.addRandomUpgrades(this.level);
                }

                // Add stats to the player for leveling up
                this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, this.level - 1)));
                this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, this.level - 1)));
            }
        }

        // Take an amount of damage
        this.takeDamage = function(damage) {
            // Reduce the damage based on the amount of armour
            var damageReduction = this.calculateDamageReduction();
            var newDamage = damage - Math.floor(damage * (damageReduction / 100));
            if (newDamage < 0) {
                newDamage = 0;
            }

            // Take the damage
            this.health -= newDamage;
            this.lastDamageTaken = newDamage;
            game.stats.damageTaken += newDamage;

            // Reflect a percentage of the damage if the player has any Barrier effects
            var reflectAmount = 0;
            var barrierEffects = this.getEffectsOfType(EffectType.BARRIER);
            for (var x = 0; x < barrierEffects.length; x++) {
                reflectAmount += barrierEffects[x].value;
            }
            reflectAmount = this.lastDamageTaken * (reflectAmount / 100);
            if (reflectAmount > 0) {
                game.monster.takeDamage(reflectAmount, false, false);
            }

            // Check if the player is dead
            if (this.health <= 0) {
                this.alive = false;
            }

            // Create the monster's damage particle
            particleManager.createParticle(newDamage, ParticleType.MONSTER_DAMAGE);
        }

        // Calculate the amount of reduction granted by armour
        this.calculateDamageReduction = function() {
            // Calculate the reduction
            var reduction = this.getArmour() / (this.getArmour() + 500) * 99

            // Cap the reduction at 99%
            if (reduction >= 99) {
                reduction = 99;
            }

            return reduction;
        }

        // Calculate the chance the player has of dodging an attack
        this.calculateEvasionChance = function() {
            // Calculate the chance
            var chance = (this.getEvasion() / (this.getEvasion() + 375)) * 75;

            // Cap the dodge at 75%
            if (chance >= 75) {
                chance = 75;
            }

            return chance;
        }

        // Heal the player for a specified amount
        this.heal = function(amount) {
            this.health += amount;
            if (this.health > this.getMaxHealth()) {
                this.health = this.getMaxHealth();
            }
        }

        // Regenerate the players health depending on how much time has passed
        this.regenerateHealth = function(ms) {
            this.health += ((this.getHp5() / 5) * (ms / 1000));
            if (this.health >= this.getMaxHealth()) {
                this.health = this.getMaxHealth();
            }
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
            this.baseItemBonuses.armour += item.armour + item.armourBonus;
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
            this.baseItemBonuses.armour -= item.armour + item.armourBonus;
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
                case DebuffType.BLEED:
                    this.buffSet.bleeding = true;
                    this.buffSet.bleedDamage = damage;
                    this.buffSet.bleedDuration = 0;
                    this.buffSet.bleedMaxDuration = duration;
                    this.buffSet.bleedStacks++;
                    break;
                case DebuffType.CHILL:
                    this.buffSet.chilled = true;
                    this.buffSet.chillDuration = 0;
                    this.buffSet.chillMaxDuration = duration;
                    break;
                case DebuffType.BURN:
                    this.buffSet.burning = true;
                    this.buffSet.burningDamage = damage;
                    this.buffSet.burningDuration = 0;
                    this.buffSet.burningMaxDuration = duration;
                    break;
            }
        }

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            this.buffSet.init();
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            this.buffSet.update(gameTime);
        }

        // Update all the debuffs on the player
        this.updateDebuffs = function() {
            // If the player is bleeding
            if (this.buffSet.bleeding) {
                // Cause the player to take damage
                this.takeDamage(this.buffSet.bleedDamage);
                // Increase the duration of this debuff
                this.buffSet.bleedDuration++;
                // If the debuff has expired then remove it
                if (this.buffSet.bleedDuration >= this.buffSet.bleedMaxDuration) {
                    this.buffSet.bleeding = false;
                    this.buffSet.bleedDamage = 0;
                    this.buffSet.bleedDuration = 0;
                    this.buffSet.bleedMaxDuration = 0;
                    this.buffSet.bleedStacks = 0;
                }
            }

            // If the player is chilled
            if (this.buffSet.chilled) {
                // If the chill duration is even then the player can't attack this turn
                if (this.buffSet.chillDuration == 0 || (this.buffSet.chillDuration % 2 == 0)) {
                    this.canAttack = false;
                }
                else {
                    this.canAttack = true;
                }
                // Increase the duration of this debuff
                this.buffSet.chillDuration++;
                // If the debuff has expired then remove it
                if (this.buffSet.chillDuration >= this.buffSet.chillMaxDuration) {
                    this.buffSet.chillDuration = 0;
                    this.buffSet.chillMaxDuration = 0;
                    this.buffSet.chilled = false;
                }
            }
            // If the player is not chilled then they can attack
            else {
                this.canAttack = true;
            }

            // If the player is burning
            if (this.buffSet.burning) {
                // Cause the player to take damage
                this.takeDamage(this.buffSet.burningDamage);
                // Increase the duration of this debuff
                this.buffSet.burningDuration++;
                // If the debuff has expired then remove it
                if (this.buffSet.burningDuration >= this.buffSet.burningMaxDuration) {
                    this.buffSet.burningDamage = 0;
                    this.buffSet.burningDuration = 0;
                    this.buffSet.burningMaxDuration = 0;
                    this.buffSet.burning = false;
                }
            }
        }

        // Save all the player's data
        this.save = function() {
            localStorage.playerSaved = true;
            localStorage.playerLevel = this.level;
            localStorage.playerHealth = this.health;

            localStorage.chosenLevelUpBonuses = JSON.stringify(this.chosenLevelUpBonuses);
            localStorage.baseItemBonuses = JSON.stringify(this.baseItemBonuses);

            localStorage.playerGold = this.gold;
            localStorage.playerLevel = this.level;
            localStorage.playerExperience = this.experience;

            localStorage.playerSkillPointsSpent = this.skillPointsSpent;
            localStorage.playerSkillPoints = this.skillPoints;
            this.abilities.save();

            localStorage.playerAlive = this.alive;
            localStorage.attackType = this.attackType;
            localStorage.playerEffects = JSON.stringify(this.effects);

            localStorage.powerShards = this.powerShards;
        }

        // Load all the player's data
        this.load = function load() {
            if (localStorage.playerSaved != null) {
                this.level = parseInt(localStorage.playerLevel);
                this.health = parseFloat(localStorage.playerHealth);

                if (localStorage.version == null) {
                    this.chosenLevelUpBonuses.health = parseFloat(localStorage.playerBaseHealthStatBonus);
                    this.chosenLevelUpBonuses.hp5 = parseFloat(localStorage.playerBaseHp5StatBonus);
                    this.chosenLevelUpBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusStatBonus);
                    this.chosenLevelUpBonuses.armour = parseFloat(localStorage.playerBaseArmourStatBonus);
                    this.chosenLevelUpBonuses.strength = parseFloat(localStorage.playerBaseStrengthStatBonus);
                    this.chosenLevelUpBonuses.stamina = parseFloat(localStorage.playerBaseStaminaStatBonus);
                    this.chosenLevelUpBonuses.agility = parseFloat(localStorage.playerBaseAgilityStatBonus);
                    this.chosenLevelUpBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceStatBonus);
                    this.chosenLevelUpBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageStatBonus);
                    this.chosenLevelUpBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityStatBonus);
                    this.chosenLevelUpBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainStatBonus);
                    this.chosenLevelUpBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainStatBonus);

                    this.baseItemBonuses.health = parseInt(localStorage.playerBaseHealthFromItems);
                    this.baseItemBonuses.hp5 = parseInt(localStorage.playerBaseHp5FromItems);
                    this.baseItemBonuses.minDamage = parseInt(localStorage.playerBaseMinDamageFromItems);
                    this.baseItemBonuses.maxDamage = parseInt(localStorage.playerBaseMaxDamageFromItems);
                    this.baseItemBonuses.damageBonus = parseFloat(localStorage.playerBaseDamageBonusFromItems);
                    this.baseItemBonuses.armour = parseFloat(localStorage.playerBaseArmourFromItems);
                    this.baseItemBonuses.strength = parseInt(localStorage.playerBaseStrengthFromItems);
                    this.baseItemBonuses.stamina = parseInt(localStorage.playerBaseStaminaFromItems);
                    this.baseItemBonuses.agility = parseInt(localStorage.playerBaseAgilityFromItems);
                    this.baseItemBonuses.critChance = parseFloat(localStorage.playerBaseCritChanceFromItems);
                    this.baseItemBonuses.critDamage = parseFloat(localStorage.playerBaseCritDamageFromItems);
                    this.baseItemBonuses.itemRarity = parseFloat(localStorage.playerBaseItemRarityFromItems);
                    this.baseItemBonuses.goldGain = parseFloat(localStorage.playerBaseGoldGainFromItems);
                    this.baseItemBonuses.experienceGain = parseFloat(localStorage.playerBaseExperienceGainFromItems);
                }

                // Add stats to the player for leveling up
                for (var x = 1; x < this.level; x++) {
                    this.levelUpBonuses.health += Math.floor(this.baseLevelUpBonuses.health * (Math.pow(1.01, x)));
                    this.levelUpBonuses.hp5 += Math.floor(this.baseLevelUpBonuses.hp5 * (Math.pow(1.01, x)));
                }

                this.gold = parseFloat(localStorage.playerGold);
                this.level = parseInt(localStorage.playerLevel);
                this.experience = parseFloat(localStorage.playerExperience);
                this.experienceRequired = Math.ceil(utils.Sigma(this.level * 2) * Math.pow(1.05, this.level) + this.baseExperienceRequired);

                this.skillPointsSpent = parseInt(localStorage.playerSkillPointsSpent);
                this.skillPoints = parseInt(localStorage.playerSkillPoints);
                if (this.skillPoints > 0) {
                    $("#levelUpButton").show();
                }
                this.abilities.load();
                this.changeAttack(localStorage.attackType);

                if (localStorage.version != null) {
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

                if (localStorage.powerShards != null) {
                    this.powerShards = parseInt(localStorage.powerShards);
                }
            }

            if (localStorage.playerAlive != null) {
                this.alive = JSON.parse(localStorage.playerAlive);
            }
        }
    }

    return {
        create: function() { return new Player(); }
    }
});