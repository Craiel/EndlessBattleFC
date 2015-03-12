declare('NameGenerator', function () {
    include('Component');
    include('StaticData');

    NameGenerator.prototype = component.prototype();
    NameGenerator.prototype.$super = parent;
    NameGenerator.prototype.constructor = NameGenerator;

    function NameGenerator() {
        component.construct(this);

        this.id = "NameGenerator";
    }

    // ----- Prefixes -----
    // Damage Bonus
    NameGenerator.prototype.getRandomDamageBonusName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.DamageNames[rand];
    }
    // Health
    NameGenerator.prototype.getRandomHealthName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.HealthNames[rand];
    }
    // Armor Bonus
    NameGenerator.prototype.getRandomArmorBonusName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.ArmorNames[rand];
    }
    // Crit Chance
    NameGenerator.prototype.getRandomCritChanceName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.CritChanceNames[rand];
    }
    // Item Rarity
    NameGenerator.prototype.getRandomItemRarityName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.ItemRarityNames[rand];
    }
    // Gold Gain
    NameGenerator.prototype.getRandomGoldGainName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.GoldGainNames[rand];
    }

    // ----- Suffixes -----
    // Strength
    NameGenerator.prototype.getRandomStrengthName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.StrengthNames[rand];
    }
    // Agility
    NameGenerator.prototype.getRandomAgilityName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.AgilityNames[rand];
    }
    // Stamina
    NameGenerator.prototype.getRandomStaminaName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.StaminaNames[rand];
    }
    // Hp5
    NameGenerator.prototype.getRandomHp5Name = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.Hp5Names[rand];
    }
    // Crit Damage
    NameGenerator.prototype.getRandomCritDamageName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.CritDamageNames[rand];
    }
    // Experience Gain
    NameGenerator.prototype.getRandomExperienceGainName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.ExperienceGainNames[rand];
    }
    // Evasion
    NameGenerator.prototype.getRandomEvasionName = function() {
        var rand = Math.random() * staticData.namesAmount;
        rand = Math.floor(rand);
        return staticData.EvasionNames[rand];
    }

    return new NameGenerator();
});