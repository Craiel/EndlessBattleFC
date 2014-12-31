declare("NameGenerator", function () {
    include('Component');

    NameGenerator.prototype = component.create();
    NameGenerator.prototype.$super = parent;
    NameGenerator.prototype.constructor = NameGenerator;

    function NameGenerator() {
        this.id = "NameGenerator";

        var rand;
        // ----- Prefixes -----
        // Damage Bonus
        this.getRandomDamageBonusName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return DamageNames[rand];
        }
        // Health
        this.getRandomHealthName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return HealthNames[rand];
        }
        // Armour Bonus
        this.getRandomArmourBonusName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return ArmourNames[rand];
        }
        // Crit Chance
        this.getRandomCritChanceName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return CritChanceNames[rand];
        }
        // Item Rarity
        this.getRandomItemRarityName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return ItemRarityNames[rand];
        }
        // Gold Gain
        this.getRandomGoldGainName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return GoldGainNames[rand];
        }

        // ----- Suffixes -----
        // Strength
        this.getRandomStrengthName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return StrengthNames[rand];
        }
        // Agility
        this.getRandomAgilityName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return AgilityNames[rand];
        }
        // Stamina
        this.getRandomStaminaName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return StaminaNames[rand];
        }
        // Hp5
        this.getRandomHp5Name = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return Hp5Names[rand];
        }
        // Crit Damage
        this.getRandomCritDamageName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return CritDamageNames[rand];
        }
        // Experience Gain
        this.getRandomExperienceGainName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return ExperienceGainNames[rand];
        }
        // Evasion
        this.getRandomEvasionName = function() {
            rand = Math.random() * namesAmount;
            rand = Math.floor(rand);
            return EvasionNames[rand];
        }
    }

    return new NameGenerator();
});