declare('Item', function () {

    var nextId = 0;

    function Item(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses) {
        this.id = 'Item' + nextId++;
        this.name = name;
        this.level = level;
        this.rarity = rarity;
        this.type = type;
        this.sellValue = sellValue;
        this.iconSourceX = iconSourceX;
        this.iconSourceY = iconSourceY;

        // Item Bonuses
        this.minDamage = itemBonuses.minDamage;
        this.maxDamage = itemBonuses.maxDamage;
        this.damageBonus = itemBonuses.damageBonus;

        this.strength = itemBonuses.strength;
        this.agility = itemBonuses.agility;
        this.stamina = itemBonuses.stamina;

        this.health = itemBonuses.health;
        this.hp5 = itemBonuses.hp5;
        this.armor = itemBonuses.armor;
        this.armorBonus = itemBonuses.armorBons;
        this.evasion = itemBonuses.evasion;

        this.critChance = itemBonuses.critChance;
        this.critDamage = itemBonuses.critDamage;

        this.itemRarity = itemBonuses.itemRarity;
        this.goldGain = itemBonuses.goldGain;
        this.experienceGain = itemBonuses.experienceGain;
        this.effects = itemBonuses.effects;
    }

    return {
        create: function(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses) { return new Item(name, level, rarity, type, sellValue, iconSourceX, iconSourceY, itemBonuses); }
    }
});