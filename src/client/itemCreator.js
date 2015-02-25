declare("ItemCreator", function () {
    include('Component');
    include('Utils');
    include('Static');
    include('NameGenerator');
    include('StatGenerator');
    include('ItemBonuses');
    include('Item');
    include('UpgradeManager');
    include('Loot');

    ItemCreator.prototype = component.create();
    ItemCreator.prototype.$super = parent;
    ItemCreator.prototype.constructor = ItemCreator;

    function ItemCreator() {
        this.id = "ItemCreator";

        this.getRandomLoot = function(level, rarity, goldWorth) {
            var item = this.createRandomItem(level, this.getRandomItemRarity(rarity));
            var result = loot.create(goldWorth, item);
            return result;
        }

        this.getRandomItemRarity = function(monsterRarity) {
            var rand = Math.random();
            switch (monsterRarity) {
                case static.MonsterRarity.COMMON:
                    if (rand < 0.20) {
                        rand = Math.random();
                        if (rand < (0.00001 * ((game.player.getItemRarity() / 100) + 1))) {
                            return static.ItemRarity.LEGENDARY;
                        }
                        else if (rand < (0.0001 * ((game.player.getItemRarity() / 100) + 1))) {
                            return static.ItemRarity.EPIC;
                        }
                        else if (rand < (0.001 * ((game.player.getItemRarity() / 100) + 1))) {
                            return static.ItemRarity.RARE;
                        }
                        else if (rand < (0.01 * ((game.player.getItemRarity() / 100) + 1))) {
                            return static.ItemRarity.UNCOMMON;
                        }
                        else {
                            return static.ItemRarity.COMMON;
                        }
                    }
                    break;
                case static.MonsterRarity.RARE:
                    if (rand < (0.0001 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.LEGENDARY;
                    }
                    else if (rand < (0.001 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.EPIC;
                    }
                    else if (rand < (0.01 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.RARE;
                    }
                    else {
                        return static.ItemRarity.UNCOMMON;
                    }
                    break;
                case static.MonsterRarity.ELITE:
                    if (rand < (0.001 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.LEGENDARY;
                    }
                    else if (rand < (0.01 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.EPIC;
                    }
                    else {
                        return static.ItemRarity.RARE;
                    }
                    break;
                case static.MonsterRarity.BOSS:
                    if (rand < (0.01 * ((game.player.getItemRarity() / 100) + 1))) {
                        return static.ItemRarity.LEGENDARY;
                    }
                    else {
                        return static.ItemRarity.EPIC;
                    }
                    break;
            }
        }

        this.createRandomItem = function(level, rarity) {
            // If there is no rarity; do nothing
            if (rarity == null) {
                return null;
            }

            // Get a random item type
            var rand = Math.floor(Math.random() * static.ItemType.count);
            var type;
            switch (rand) {
                case 0:
                    type = static.ItemType.HELM;
                    break;
                case 1:
                    type = static.ItemType.SHOULDERS;
                    break;
                case 2:
                    type = static.ItemType.CHEST;
                    break;
                case 3:
                    type = static.ItemType.LEGS;
                    break;
                case 4:
                    type = static.ItemType.WEAPON;
                    break;
                case 5:
                    type = static.ItemType.GLOVES;
                    break;
                case 6:
                    type = static.ItemType.BOOTS;
                    break;
                case 7:
                    type = static.ItemType.TRINKET;
                    break;
                case 8:
                    type = static.ItemType.OFF_HAND;
                    break;
            }

            // Get a random rarity
            var prefixAmount;
            var suffixAmount;
            switch (rarity) {
                case static.ItemRarity.COMMON:
                    prefixAmount = 1;
                    suffixAmount = 0;
                    break;
                case static.ItemRarity.UNCOMMON:
                    prefixAmount = 1;
                    suffixAmount = 1;
                    break;
                case static.ItemRarity.RARE:
                    prefixAmount = 2;
                    suffixAmount = 1;
                    break;
                case static.ItemRarity.EPIC:
                    prefixAmount = 2;
                    suffixAmount = 2;
                    break;
                case static.ItemRarity.LEGENDARY:
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
                randBonus = Math.floor(Math.random() * static.PREFIX_AMOUNT);

                // Add the bonus to the item bonuses
                switch (randBonus) {
                    case 0:
                        if (itemBonusAddition.damageBonus == 0 && type == static.ItemType.WEAPON) {
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
                        if (itemBonusAddition.armourBonus == 0 && type != static.ItemType.WEAPON) {
                            itemBonusAddition.armourBonus = statGenerator.getRandomArmourBonus(level);
                            if (prefix == "") {
                                prefix = nameGenerator.getRandomArmourBonusName();
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
                randBonus = Math.floor(Math.random() * static.SUFFIX_AMOUNT);

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
            if (type == static.ItemType.WEAPON) {
                itemBonusAddition.minDamage = statGenerator.getRandomMinDamage(level);
                itemBonusAddition.maxDamage = statGenerator.getRandomMaxDamage(level, itemBonusAddition.minDamage);
                // Add damage depending on the rarity
                switch (rarity) {
                    case static.ItemRarity.UNCOMMON:
                        itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                        itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1);
                        break;
                    case static.ItemRarity.RARE:
                        itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2;
                        itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 2;
                        break;
                    case static.ItemRarity.EPIC:
                        itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;
                        itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 3;
                        break;
                    case static.ItemRarity.LEGENDARY:
                        itemBonusAddition.minDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4;
                        itemBonusAddition.maxDamage += Math.ceil(((2 * level) * Math.pow(1.001, level) * 0.75) + (level / 5) + 1) * 4;
                        break;
                }
            }
            // Else; add armour
            else {
                itemBonusAddition.armour = statGenerator.getRandomArmour(level);
            }

            // Create the name
            var name = prefix;
            switch (type) {
                case static.ItemType.HELM:
                    name += " Helmet ";
                    break;
                case static.ItemType.SHOULDERS:
                    name += " Shoulders ";
                    break;
                case static.ItemType.CHEST:
                    name += " Chest ";
                    break;
                case static.ItemType.LEGS:
                    name += " Legs ";
                    break;
                case static.ItemType.WEAPON:
                    name += " Weapon ";
                    break;
                case static.ItemType.GLOVES:
                    name += " Gloves ";
                    break;
                case static.ItemType.BOOTS:
                    name += " Boots ";
                    break;
                case static.ItemType.TRINKET:
                    name += " Trinket ";
                    break;
                case static.ItemType.OFF_HAND:
                    name += " Shield ";
                    break;
            }
            name += suffix;

            // Calculate the icon coordinates
            var iconSourceX = 0;
            var iconSourceY = 0;
            // x coordinate
            switch (type) {
                case static.ItemType.HELM:
                    iconSourceX = 0;
                    break;
                case static.ItemType.SHOULDERS:
                    iconSourceX = 280;
                    break;
                case static.ItemType.CHEST:
                    iconSourceX = 245;
                    break;
                case static.ItemType.LEGS:
                    iconSourceX = 210;
                    break;
                case static.ItemType.WEAPON:
                    iconSourceX = 175;
                    break;
                case static.ItemType.GLOVES:
                    iconSourceX = 140;
                    break;
                case static.ItemType.BOOTS:
                    iconSourceX = 105;
                    break;
                case static.ItemType.TRINKET:
                    iconSourceX = 70;
                    break;
                case static.ItemType.OFF_HAND:
                    iconSourceX = 35;
                    break;
            }
            // y coordinate
            switch (rarity) {
                case static.ItemRarity.UNCOMMON:
                    iconSourceY = 140;
                    break;
                case static.ItemRarity.RARE:
                    iconSourceY = 105;
                    break;
                case static.ItemRarity.EPIC:
                    iconSourceY = 70;
                    break;
                case static.ItemRarity.LEGENDARY:
                    iconSourceY = 35;
                    break;
            }

            // Calculate the sell value
            var multiple = 0;
            switch (type) {
                case static.ItemType.HELM:
                    multiple = 2.3;
                    break;
                case static.ItemType.SHOULDERS:
                    multiple = 2.5;
                    break;
                case static.ItemType.CHEST:
                    multiple = 3.3;
                    break;
                case static.ItemType.LEGS:
                    multiple = 3.1;
                    break;
                case static.ItemType.WEAPON:
                    multiple = 2.9;
                    break;
                case static.ItemType.GLOVES:
                    multiple = 2.1;
                    break;
                case static.ItemType.BOOTS:
                    multiple = 2.1;
                    break;
                case static.ItemType.TRINKET:
                    multiple = 2.9;
                    break;
                case static.ItemType.OFF_HAND:
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
                case static.ItemRarity.EPIC:
                    effectsAmount = Math.floor(Math.random() * 2);
                    break;
                case static.ItemRarity.LEGENDARY:
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
                                newEffect = new Effect(static.EffectType.CRUSHING_BLOWS, 100, 5);
                                break;
                            case 1:
                                newEffect = new Effect(static.EffectType.COMBUSTION, 100, 5);
                                break;
                            case 2:
                                newEffect = new Effect(static.EffectType.RUPTURE, 100, 5);
                                break;
                        }
                        break;
                    case ItemType.TRINKET:
                        switch (Math.floor(Math.random() * 4)) {
                            case 0:
                                newEffect = new Effect(static.EffectType.SWIFTNESS, 10, 0);
                                break;
                            case 1:
                                newEffect = new Effect(static.EffectType.PILLAGING, 10, Math.floor(((utils.Sigma(level) * Math.pow(1.01, level)) / 4 + 1) * 15));
                                break;
                            case 2:
                                newEffect = new Effect(static.EffectType.NOURISHMENT, 10, Math.floor((10 * level) * Math.pow(1.001, level) * 0.75));
                                break;
                            case 3:
                                newEffect = new Effect(static.EffectType.BERSERKING, 10, Math.floor((level) * Math.pow(1.001, level) * 3));
                                break;
                        }
                        break;
                    default:
                        switch (Math.floor(Math.random() * 5)) {
                            case 0:
                                newEffect = new Effect(static.EffectType.WOUNDING, 100, Math.ceil(level / 35));
                                break;
                            case 1:
                                newEffect = new Effect(static.EffectType.CURING, 100, Math.ceil(level / 35));
                                break;
                            case 2:
                                newEffect = new Effect(static.EffectType.FROST_SHARDS, 100, Math.ceil(level / 35));
                                break;
                            case 3:
                                newEffect = new Effect(static.EffectType.FLAME_IMBUED, 100, Math.ceil(level / 35));
                                break;
                            case 4:
                                newEffect = new Effect(static.EffectType.BARRIER, 100, Math.floor((Math.random() * 15) + 20));
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

            sellValue *= Math.pow(2, upgradeManager.autoSellUpgradesPurchased);
            var newItem = item.create(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonusAddition);
            return newItem;
        }
    }

    return new ItemCreator();
});