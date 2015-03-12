declare('StatGenerator', function () {
    include('Component');

    StatGenerator.prototype = component.prototype();
    StatGenerator.prototype.$super = parent;
    StatGenerator.prototype.constructor = StatGenerator;

    function StatGenerator() {
        component.construct(this);

        this.id = "StatGenerator";
    }

    // Random min damage
    StatGenerator.prototype.getRandomMinDamage = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level));
                break;
            case 1:
                return Math.ceil(((level * Math.pow(1.001, level)) + (level / 10) + 1));
                break;
            case 2:
                return Math.ceil(((level * Math.pow(1.001, level)) + (level / 5) + 2));
                break;
        }
    }

    // Random max damage
    StatGenerator.prototype.getRandomMaxDamage = function(level, minDamage) {
        return (minDamage + this.getRandomDamageBonus(level));
    }

    // Random damage bonus
    StatGenerator.prototype.getRandomDamageBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random strength bonus
    StatGenerator.prototype.getRandomStrengthBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random agility bonus
    StatGenerator.prototype.getRandomAgilityBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random stamina bonus
    StatGenerator.prototype.getRandomStaminaBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random health bonus
    StatGenerator.prototype.getRandomHealthBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil((10 * level) * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil(((10 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random hp5 bonus
    StatGenerator.prototype.getRandomHp5Bonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil((2 * level) * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random base armor
    StatGenerator.prototype.getRandomArmor = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    // Random bonus armor
    StatGenerator.prototype.getRandomArmorBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) / 5);
                break;
            case 1:
                return Math.ceil(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1) / 4);
                break;
            case 2:
                return Math.ceil(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) / 3);
                break;
        }
    }

    // Random crit chance bonus
    StatGenerator.prototype.getRandomCritChanceBonus = function(level) {
        var critChance = 0;
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.75) + 0.00001) * 100) / 100).toFixed(2));
                break;
            case 1:
                critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.8) + 0.00001) * 100) / 100).toFixed(2));
                break;
            case 2:
                critChance = parseFloat((((((0.3 * level) * Math.pow(1.001, level) * 0.85) + 0.00001) * 100) / 100).toFixed(2));
                break;
        }
        // Cap the crit chance at 10%
        if (critChance > 10) {
            critChance = 10;
        }
        return critChance;
    }

    // Random crit damage bonus
    StatGenerator.prototype.getRandomCritDamageBonus = function(level) {
        var rand = Math.floor(Math.random() * 3);
        switch (rand) {
            case 0:
                return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.75) + 0.00001) * 100) / 100).toFixed(2));
                break;
            case 1:
                return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.8) + 0.00001) * 100) / 100).toFixed(2));
                break;
            case 2:
                return parseFloat((((((0.2 * level) * Math.pow(1.001, level) * 0.85) + 0.00001) * 100) / 100).toFixed(2));
                break;
        }
    }

    // Random item rarity bonus
    StatGenerator.prototype.getRandomItemRarityBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2));
                break;
            case 1:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2));
                break;
            case 2:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2));
                break;
        }
    }

    // Random gold gain bonus
    StatGenerator.prototype.getRandomGoldGainBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2));
                break;
            case 1:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2));
                break;
            case 2:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2));
                break;
        }
    }

    // Random experience gain bonus
    StatGenerator.prototype.getRandomExperienceGainBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return parseFloat((level * Math.pow(1.001, level) * 0.75).toFixed(2));
                break;
            case 1:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1).toFixed(2));
                break;
            case 2:
                return parseFloat(((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1).toFixed(2));
                break;
        }
    }

    // Random evasion bonus
    StatGenerator.prototype.getRandomEvasionBonus = function(level) {
        var rand = Math.random() * 3;
        rand = Math.floor(rand);
        switch (rand) {
            case 0:
                return Math.ceil(level * Math.pow(1.001, level) * 0.75);
                break;
            case 1:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 10) + 1);
                break;
            case 2:
                return Math.ceil((level * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                break;
        }
    }

    return new StatGenerator();
});