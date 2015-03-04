declare("MonsterCreator", function () {
    include('Component');
    include('Utils');
    include('Static');
    include('Monster');
    include('Data');

    MonsterCreator.prototype = component.create();
    MonsterCreator.prototype.$super = parent;
    MonsterCreator.prototype.constructor = MonsterCreator;

    function MonsterCreator() {
        this.id = "MonsterCreator";

        this.names = ["Zombie", "Skeleton", "Goblin", "Spider", "Troll", "Lizardman", "Ogre", "Orc"];
        this.monsterBaseHealth = 5;
        this.monsterBaseDamage = 0;
        this.monsterBaseGoldWorth = 1;
        this.monsterBaseExperienceWorth = 1;

        // Create a random monster of a specified level and rarity
        this.createRandomMonster = function(level, rarity) {
            var result = monster.create();
            result.name = this.names[Math.floor(Math.random() * this.names.length)];
            result.level = level;
            result.rarity = rarity;
            result.setStat(data.StatDefinition.hp.id, this.calculateMonsterHealth(level, rarity));
            result.maxHealth = result.getStat(data.StatDefinition.hp.id);
            result.damage = this.calculateMonsterDamage(level, rarity);
            result.goldWorth = this.calculateMonsterGoldWorth(level, rarity);
            result.experienceWorth = this.calculateMonsterExperienceWorth(level, rarity);
            return result;
        }

        // Calculate how much health a monster would have of a certain level and rarity
        this.calculateMonsterHealth = function(level, rarity) {
            var health = utils.Sigma(level) * Math.pow(1.05, level) + this.monsterBaseHealth;
            health = Math.ceil(health);
            switch (rarity) {
                case "COMMON":
                    break;
                case "RARE":
                    health *= 3;
                    break;
                case "ELITE":
                    health *= 10;
                    break;
                case "BOSS":
                    health *= 30;
                    break;
            }
            return health;
        }

        // Calculate how much damage a monster would have of a certain level and rarity
        this.calculateMonsterDamage = function(level, rarity) {
            var damage = (utils.Sigma(level) * Math.pow(1.01, level)) / 3 + this.monsterBaseDamage;
            damage = Math.ceil(damage);
            switch (rarity) {
                case "COMMON":
                    break;
                case "RARE":
                    damage *= 2;
                    break;
                case "ELITE":
                    damage *= 4;
                    break;
                case "BOSS":
                    damage *= 8;
                    break;
            }
            return damage;
        }

        // Calculate how much gold a monster would give of a certain level and rarity
        this.calculateMonsterGoldWorth = function(level, rarity) {
            var goldWorth = (utils.Sigma(level) * Math.pow(1.01, level)) / 4 + this.monsterBaseGoldWorth;
            goldWorth = Math.ceil(goldWorth);
            switch (rarity) {
                case "COMMON":
                    break;
                case "RARE":
                    goldWorth *= 1.5;
                    break;
                case "ELITE":
                    goldWorth *= 3;
                    break;
                case "BOSS":
                    goldWorth *= 6;
                    break;
            }
            return goldWorth;
        }

        // Calculate how much experience a monster would give of a certain level and rarity
        this.calculateMonsterExperienceWorth = function(level, rarity) {
            var experienceWorth = (utils.Sigma(level) * Math.pow(1.01, level)) / 5 + this.monsterBaseExperienceWorth;
            experienceWorth = Math.ceil(experienceWorth);
            switch (rarity) {
                case "COMMON":
                    break;
                case "RARE":
                    experienceWorth *= 1.5;
                    break;
                case "ELITE":
                    experienceWorth *= 3;
                    break;
                case "BOSS":
                    experienceWorth *= 6;
                    break;
            }
            return experienceWorth;
        }

        // Calculate the rarity of a monster on a certain battle level at a certain battle depth
        this.calculateMonsterRarity = function(battleLevel, battleDepth) {
            // Calculate the chances for each monster rarity other than normal
            var rareChance = 0.001 + (battleLevel / 500);
            if (rareChance > 0.1) {
                rareChance = 0.1;
            }
            var eliteChance = 0;
            if (battleLevel >= 10) {
                eliteChance = 0.03 + (battleLevel / 12000);
                if (eliteChance > 0.05) {
                    eliteChance = 0.05;
                }
            }
            var bossChance = 0;
            if (battleLevel >= 30) {
                bossChance = 0.03 + (battleLevel / 24000);
                if (bossChance > 0.01) {
                    bossChance = 0.01;
                }
            }
            rareChance += eliteChance + bossChance;
            eliteChance += bossChance;

            // Choose the rarity randomly and return it
            var rand = Math.random();
            if (rand <= bossChance) {
                return static.MonsterRarity.BOSS;
            }
            else if (rand <= eliteChance) {
                return static.MonsterRarity.ELITE;
            }
            else if (rand <= rareChance) {
                return static.MonsterRarity.RARE;
            }
            else return static.MonsterRarity.COMMON;
        }
    }

    return new MonsterCreator();
});