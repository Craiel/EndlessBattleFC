declare('NameGenerator', function () {
    include('Component');
    include('StaticData');

    NameGenerator.prototype = component.create();
    NameGenerator.prototype.$super = parent;
    NameGenerator.prototype.constructor = NameGenerator;

    function NameGenerator() {
        this.id = "NameGenerator";

        var rand;
        // ----- Prefixes -----
        // Damage Bonus
        this.getRandomDamageBonusName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.DamageNames[rand];
        }
        // Health
        this.getRandomHealthName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.HealthNames[rand];
        }
        // Armour Bonus
        this.getRandomArmourBonusName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.ArmourNames[rand];
        }
        // Crit Chance
        this.getRandomCritChanceName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.CritChanceNames[rand];
        }
        // Item Rarity
        this.getRandomItemRarityName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.ItemRarityNames[rand];
        }
        // Gold Gain
        this.getRandomGoldGainName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.GoldGainNames[rand];
        }

        // ----- Suffixes -----
        // Strength
        this.getRandomStrengthName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.StrengthNames[rand];
        }
        // Agility
        this.getRandomAgilityName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.AgilityNames[rand];
        }
        // Stamina
        this.getRandomStaminaName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.StaminaNames[rand];
        }
        // Hp5
        this.getRandomHp5Name = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.Hp5Names[rand];
        }
        // Crit Damage
        this.getRandomCritDamageName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.CritDamageNames[rand];
        }
        // Experience Gain
        this.getRandomExperienceGainName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.ExperienceGainNames[rand];
        }
        // Evasion
        this.getRandomEvasionName = function() {
            rand = Math.random() * staticData.namesAmount;
            rand = Math.floor(rand);
            return staticData.EvasionNames[rand];
        }
    }

    return new NameGenerator();
});