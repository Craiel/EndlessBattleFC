declare('ItemCreator', function () {
    include('Component');
    include('Utils');
    include('StaticData');
    include('NameGenerator');
    include('StatGenerator');
    include('ItemBonuses');
    include('Item');
    include('UpgradeManager');
    include('Loot');
    include('Data');

    ItemCreator.prototype = component.prototype();
    ItemCreator.prototype.$super = parent;
    ItemCreator.prototype.constructor = ItemCreator;

    function ItemCreator() {
        component.construct(this);

        this.id = "ItemCreator";
    }

    ItemCreator.prototype.getRandomLoot = function(level, rarity, goldWorth) {
        var item = this.createRandomItem(level, this.getRandomItemRarity(rarity));
        var result = loot.create(goldWorth, item);
        return result;
    }

    ItemCreator.prototype.getRandomItemRarity = function(monsterRarity) {
        var rand = Math.random();
        var magicFindMultiplier = game.player.getStat(data.StatDefinition.magicFind.id) / 100;
        switch (monsterRarity) {
            case staticData.MonsterRarity.COMMON:
                if (rand < 0.20) {
                    rand = Math.random();
                    if (rand < (0.00001 * magicFindMultiplier)) {
                        return staticData.ItemRarity.LEGENDARY;
                    }
                    else if (rand < (0.0001 * magicFindMultiplier)) {
                        return staticData.ItemRarity.EPIC;
                    }
                    else if (rand < (0.001 * magicFindMultiplier)) {
                        return staticData.ItemRarity.RARE;
                    }
                    else if (rand < (0.01 * magicFindMultiplier)) {
                        return staticData.ItemRarity.UNCOMMON;
                    }
                    else {
                        return staticData.ItemRarity.COMMON;
                    }
                }
                break;
            case staticData.MonsterRarity.RARE:
                if (rand < (0.0001 * magicFindMultiplier)) {
                    return staticData.ItemRarity.LEGENDARY;
                }
                else if (rand < (0.001 * magicFindMultiplier)) {
                    return staticData.ItemRarity.EPIC;
                }
                else if (rand < (0.01 * magicFindMultiplier)) {
                    return staticData.ItemRarity.RARE;
                }
                else {
                    return staticData.ItemRarity.UNCOMMON;
                }
                break;
            case staticData.MonsterRarity.ELITE:
                if (rand < (0.001 * magicFindMultiplier)) {
                    return staticData.ItemRarity.LEGENDARY;
                }
                else if (rand < (0.01 * magicFindMultiplier)) {
                    return staticData.ItemRarity.EPIC;
                }
                else {
                    return staticData.ItemRarity.RARE;
                }
                break;
            case staticData.MonsterRarity.BOSS:
                if (rand < (0.01 * magicFindMultiplier)) {
                    return staticData.ItemRarity.LEGENDARY;
                }
                else {
                    return staticData.ItemRarity.EPIC;
                }
                break;
        }
    }

    ItemCreator.prototype.createRandomItem = function(level, rarity) {
        // If there is no rarity; do nothing
        if (rarity == null) {
            return null;
        }

        // Get a random item type
        var rand = Math.floor(Math.random() * staticData.ItemType.count);
        var type;
        switch (rand) {
            case 0:
                type = staticData.ItemType.HELM;
                break;
            case 1:
                type = staticData.ItemType.SHOULDERS;
                break;
            case 2:
                type = staticData.ItemType.CHEST;
                break;
            case 3:
                type = staticData.ItemType.LEGS;
                break;
            case 4:
                type = staticData.ItemType.WEAPON;
                break;
            case 5:
                type = staticData.ItemType.GLOVES;
                break;
            case 6:
                type = staticData.ItemType.BOOTS;
                break;
            case 7:
                type = staticData.ItemType.TRINKET;
                break;
            case 8:
                type = staticData.ItemType.OFF_HAND;
                break;
        }

        // Get a random rarity
        var prefixAmount;
        var suffixAmount;
        switch (rarity) {
            case staticData.ItemRarity.COMMON:
                prefixAmount = 1;
                suffixAmount = 0;
                break;
            case staticData.ItemRarity.UNCOMMON:
                prefixAmount = 1;
                suffixAmount = 1;
                break;
            case staticData.ItemRarity.RARE:
                prefixAmount = 2;
                suffixAmount = 1;
                break;
            case staticData.ItemRarity.EPIC:
                prefixAmount = 2;
                suffixAmount = 2;
                break;
            case staticData.ItemRarity.LEGENDARY:
                prefixAmount = 3;
                suffixAmount = 3;
                break;
        }

        // Add random item bonuses
        var itemBonusAddition = itemBonuses.create();
        var randBonus;
        var prefix = "";
        var suffix = "";

        // Create the prefixes
        var amount = prefixAmount;

        while (amount > 0) {
            // Get the ID of the bonuses; randomly
            randBonus = Math.floor(Math.random() * staticData.PREFIX_AMOUNT);

            // Add the bonus to the item bonuses
            switch (randBonus) {
                case 0:
                    if (itemBonusAddition.damageBonus == 0 && type == staticData.ItemType.WEAPON) {
                        itemBonusAddition.damageBonus = statGenerator.getRandomDamageBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomDamageBonusName();
                        }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonusAddition.health == 0) {
                        itemBonusAddition.health = statGenerator.getRandomHealthBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomHealthName();
                        }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonusAddition.armorBonus == 0 && type != staticData.ItemType.WEAPON) {
                        itemBonusAddition.armorBonus = statGenerator.getRandomArmorBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomArmorBonusName();
                        }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonusAddition.critChance == 0) {
                        itemBonusAddition.critChance = statGenerator.getRandomCritChanceBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomCritChanceName();
                        }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonusAddition.itemRarity == 0) {
                        itemBonusAddition.itemRarity = statGenerator.getRandomItemRarityBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomItemRarityName();
                        }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonusAddition.goldGain == 0) {
                        itemBonusAddition.goldGain = statGenerator.getRandomGoldGainBonus(level);
                        if (prefix == "") {
                            prefix = nameGenerator.getRandomGoldGainName();
                        }
                        amount--;
                    }
                    break;
            }
        }

        // Create the suffixes
        amount = suffixAmount;
        while (amount > 0) {
            // Get the ID of the bonuses; randomly
            randBonus = Math.floor(Math.random() * staticData.SUFFIX_AMOUNT);

            // Add the bonus to the item bonuses
            switch (randBonus) {
                case 0:
                    if (itemBonusAddition.strength == 0) {
                        itemBonusAddition.strength = statGenerator.getRandomStrengthBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomStrengthName();
                        }
                        amount--;
                    }
                    break;
                case 1:
                    if (itemBonusAddition.agility == 0) {
                        itemBonusAddition.agility = statGenerator.getRandomAgilityBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomAgilityName();
                        }
                        amount--;
                    }
                    break;
                case 2:
                    if (itemBonusAddition.stamina == 0) {
                        itemBonusAddition.stamina = statGenerator.getRandomStaminaBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomStaminaName();
                        }
                        amount--;
                    }
                    break;
                case 3:
                    if (itemBonusAddition.hp5 == 0) {
                        itemBonusAddition.hp5 = statGenerator.getRandomHp5Bonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomHp5Name();
                        }
                        amount--;
                    }
                    break;
                case 4:
                    if (itemBonusAddition.critDamage == 0) {
                        itemBonusAddition.critDamage = statGenerator.getRandomCritDamageBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomCritDamageName();
                        }
                        amount--;
                    }
                    break;
                case 5:
                    if (itemBonusAddition.experienceGain == 0) {
                        itemBonusAddition.experienceGain = statGenerator.getRandomExperienceGainBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomExperienceGainName();
                        }
                        amount--;
                    }
                    break;
                case 6:
                    if (itemBonusAddition.evasion == 0) {
                        itemBonusAddition.evasion = statGenerator.getRandomEvasionBonus(level);
                        if (suffix == "") {
                            suffix = nameGenerator.getRandomEvasionName();
                        }
                        amount--;
                    }
                    break;
            }
        }

        // If it's a weapon; add weapon damage
        if (type == staticData.ItemType.WEAPON) {
            itemBonusAddition.minDamage = statGenerator.getRandomMinDamage(level);
            itemBonusAddition.maxDamage = statGenerator.getRandomMaxDamage(level, itemBonusAddition.minDamage);
            // Add damage depending on the rarity
            switch (rarity) {
                case staticData.ItemRarity.UNCOMMON:
                    itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                    itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                    break;
                case staticData.ItemRarity.RARE:
                    itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2;
                    itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2;
                    break;
                case staticData.ItemRarity.EPIC:
                    itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;
                    itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;
                    break;
                case staticData.ItemRarity.LEGENDARY:
                    itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4;
                    itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4;
                    break;
            }
        }
        // Else; add armor
        else {
            itemBonusAddition.armor = statGenerator.getRandomArmor(level);
        }

        // Create the name
        var name = prefix;
        switch (type) {
            case staticData.ItemType.HELM:
                name += " Helmet ";
                break;
            case staticData.ItemType.SHOULDERS:
                name += " Shoulders ";
                break;
            case staticData.ItemType.CHEST:
                name += " Chest ";
                break;
            case staticData.ItemType.LEGS:
                name += " Legs ";
                break;
            case staticData.ItemType.WEAPON:
                name += " Weapon ";
                break;
            case staticData.ItemType.GLOVES:
                name += " Gloves ";
                break;
            case staticData.ItemType.BOOTS:
                name += " Boots ";
                break;
            case staticData.ItemType.TRINKET:
                name += " Trinket ";
                break;
            case staticData.ItemType.OFF_HAND:
                name += " Shield ";
                break;
        }
        name += suffix;

        // Calculate the icon coordinates
        var iconSourceX = 0;
        var iconSourceY = 0;
        // x coordinate
        switch (type) {
            case staticData.ItemType.HELM:
                iconSourceX = 0;
                break;
            case staticData.ItemType.SHOULDERS:
                iconSourceX = 280;
                break;
            case staticData.ItemType.CHEST:
                iconSourceX = 245;
                break;
            case staticData.ItemType.LEGS:
                iconSourceX = 210;
                break;
            case staticData.ItemType.WEAPON:
                iconSourceX = 175;
                break;
            case staticData.ItemType.GLOVES:
                iconSourceX = 140;
                break;
            case staticData.ItemType.BOOTS:
                iconSourceX = 105;
                break;
            case staticData.ItemType.TRINKET:
                iconSourceX = 70;
                break;
            case staticData.ItemType.OFF_HAND:
                iconSourceX = 35;
                break;
        }
        // y coordinate
        switch (rarity) {
            case staticData.ItemRarity.UNCOMMON:
                iconSourceY = 140;
                break;
            case staticData.ItemRarity.RARE:
                iconSourceY = 105;
                break;
            case staticData.ItemRarity.EPIC:
                iconSourceY = 70;
                break;
            case staticData.ItemRarity.LEGENDARY:
                iconSourceY = 35;
                break;
        }

        // Calculate the sell value
        var multiple = 0;
        switch (type) {
            case staticData.ItemType.HELM:
                multiple = 2.3;
                break;
            case staticData.ItemType.SHOULDERS:
                multiple = 2.5;
                break;
            case staticData.ItemType.CHEST:
                multiple = 3.3;
                break;
            case staticData.ItemType.LEGS:
                multiple = 3.1;
                break;
            case staticData.ItemType.WEAPON:
                multiple = 2.9;
                break;
            case staticData.ItemType.GLOVES:
                multiple = 2.1;
                break;
            case staticData.ItemType.BOOTS:
                multiple = 2.1;
                break;
            case staticData.ItemType.TRINKET:
                multiple = 2.9;
                break;
            case staticData.ItemType.OFF_HAND:
                multiple = 2.7;
                break;
        }
        var sellValue = Math.floor(level * multiple);

        // Add any special effects
        var effects = new Array();
        var newEffect = null;
        var effectOwned = false;
        var effectsAmount = 0;
        switch (rarity) {
            case staticData.ItemRarity.EPIC:
                effectsAmount = Math.floor(Math.random() * 2);
                break;
            case staticData.ItemRarity.LEGENDARY:
                effectsAmount = Math.floor(Math.random() * 2) + 1;
                break;
        }
        while (effectsAmount > 0) {
            effectOwned = false;
            // Get a new random effect
            switch (type) {
                case ItemType.WEAPON:
                    switch (Math.floor(Math.random() * 3)) {
                        case 0:
                            newEffect = new Effect(staticData.EffectType.CRUSHING_BLOWS, 100, 5);
                            break;
                        case 1:
                            newEffect = new Effect(staticData.EffectType.COMBUSTION, 100, 5);
                            break;
                        case 2:
                            newEffect = new Effect(staticData.EffectType.RUPTURE, 100, 5);
                            break;
                    }
                    break;
                case ItemType.TRINKET:
                    switch (Math.floor(Math.random() * 4)) {
                        case 0:
                            newEffect = new Effect(staticData.EffectType.SWIFTNESS, 10, 0);
                            break;
                        case 1:
                            newEffect = new Effect(staticData.EffectType.PILLAGING, 10, Math.floor(((utils.Sigma(level) * Math.pow(1.01, level)) / 4 + 1) * 15));
                            break;
                        case 2:
                            newEffect = new Effect(staticData.EffectType.NOURISHMENT, 10, Math.floor((10 * level) * Math.pow(1.001, level) * 0.75));
                            break;
                        case 3:
                            newEffect = new Effect(staticData.EffectType.BERSERKING, 10, Math.floor((level) * Math.pow(1.001, level) * 3));
                            break;
                    }
                    break;
                default:
                    switch (Math.floor(Math.random() * 5)) {
                        case 0:
                            newEffect = new Effect(staticData.EffectType.WOUNDING, 100, Math.ceil(level / 35));
                            break;
                        case 1:
                            newEffect = new Effect(staticData.EffectType.CURING, 100, Math.ceil(level / 35));
                            break;
                        case 2:
                            newEffect = new Effect(staticData.EffectType.FROST_SHARDS, 100, Math.ceil(level / 35));
                            break;
                        case 3:
                            newEffect = new Effect(staticData.EffectType.FLAME_IMBUED, 100, Math.ceil(level / 35));
                            break;
                        case 4:
                            newEffect = new Effect(staticData.EffectType.BARRIER, 100, Math.floor((Math.random() * 15) + 20));
                            break;
                    }
                    break;
            }
            // Check to see if the item will already have this effect
            for (var x = 0; x < effects.length; x++) {
                if (effects[x].type == newEffect.type) {
                    effectOwned = true;
                }
            }
            // If it won't, add it to the effects
            if (!effectOwned) {
                effects.push(newEffect);
                effectsAmount--;
            }
        }
        itemBonusAddition.effects = effects;

        // Todo:
        sellValue = 100;
        var newItem = item.create(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonusAddition);
        return newItem;
    }

    return new ItemCreator();
});