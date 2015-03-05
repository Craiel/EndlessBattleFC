declare('NameGenerator', function () {
    include('Component');
    include('Static');

    NameGenerator.prototype = component.create();
    NameGenerator.prototype.$super = parent;
    NameGenerator.prototype.constructor = NameGenerator;

    function NameGenerator() {
        this.id = "NameGenerator";

        var rand;
        // ----- Prefixes -----
        // Damage Bonus
        this.getRandomDamageBonusName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.DamageNames[rand];
        }
        // Health
        this.getRandomHealthName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.HealthNames[rand];
        }
        // Armour Bonus
        this.getRandomArmourBonusName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.ArmourNames[rand];
        }
        // Crit Chance
        this.getRandomCritChanceName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.CritChanceNames[rand];
        }
        // Item Rarity
        this.getRandomItemRarityName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.ItemRarityNames[rand];
        }
        // Gold Gain
        this.getRandomGoldGainName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.GoldGainNames[rand];
        }

        // ----- Suffixes -----
        // Strength
        this.getRandomStrengthName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.StrengthNames[rand];
        }
        // Agility
        this.getRandomAgilityName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.AgilityNames[rand];
        }
        // Stamina
        this.getRandomStaminaName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.StaminaNames[rand];
        }
        // Hp5
        this.getRandomHp5Name = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.Hp5Names[rand];
        }
        // Crit Damage
        this.getRandomCritDamageName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.CritDamageNames[rand];
        }
        // Experience Gain
        this.getRandomExperienceGainName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.ExperienceGainNames[rand];
        }
        // Evasion
        this.getRandomEvasionName = function() {
            rand = Math.random() * static.namesAmount;
            rand = Math.floor(rand);
            return static.EvasionNames[rand];
        }
    }

    return new NameGenerator();
});