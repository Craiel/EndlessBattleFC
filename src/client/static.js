declare("Static", function () {
    include('Component');

    Static.prototype = component.create();
    Static.prototype.$super = parent;
    Static.prototype.constructor = Static;

    function Static() {
        this.id = "Static";

        this.AttackType = new Object();
        this.AttackType.BASIC_ATTACK = "BASIC_ATTACK";
        this.AttackType.POWER_STRIKE = "POWER_STRIKE";
        this.AttackType.DOUBLE_STRIKE = "DOUBLE_STRIKE";

        this.AbilityName = new Object();
        this.AbilityName.REND = "REND";
        this.AbilityName.REJUVENATING_STRIKES = "REJUVENATING_STRIKES";
        this.AbilityName.ICE_BLADE = "ICE_BLADE";
        this.AbilityName.FIRE_BLADE = "FIRE_BLADE";

        this.StatUpgradeType = new Object();
        this.StatUpgradeType.DAMAGE = "DAMAGE";
        this.StatUpgradeType.STRENGTH = "STRENGTH";
        this.StatUpgradeType.AGILITY = "AGILITY";
        this.StatUpgradeType.STAMINA = "STAMINA";
        this.StatUpgradeType.HP5 = "HP5";
        this.StatUpgradeType.ARMOUR = "ARMOUR";
        this.StatUpgradeType.EVASION = "EVASION";
        this.StatUpgradeType.CRIT_DAMAGE = "CRIT_DAMAGE";
        this.StatUpgradeType.ITEM_RARITY = "ITEM_RARITY";
        this.StatUpgradeType.GOLD_GAIN = "GOLD_GAIN";
        this.StatUpgradeType.EXPERIENCE_GAIN = "EXPERIENCE_GAIN";
        this.StatUpgradeType.amount = 10;

        this.DebuffType = new Object();
        this.DebuffType.BLEED = "BLEED";
        this.DebuffType.CHILL = "CHILL";
        this.DebuffType.BURN = "BURN";

        this.MercenaryType = new Object();
        this.MercenaryType.FOOTMAN = "FOOTMAN";
        this.MercenaryType.CLERIC = "CLERIC";
        this.MercenaryType.COMMANDER = "COMMANDER";
        this.MercenaryType.MAGE = "MAGE";
        this.MercenaryType.ASSASSIN = "ASSASSIN";
        this.MercenaryType.WARLOCK = "WARLOCK";

        this.QuestType = new Object();
        this.QuestType.KILL = "KILL";
        this.QuestType.MERCENARIES = "MERCENARIES";
        this.QuestType.UPGRADE = "UPGRADE";

        this.BuffType = new Object();
        this.BuffType.DAMAGE = "DAMAGE";
        this.BuffType.GOLD = "GOLD";
        this.BuffType.EXPERIENCE = "EXPERIENCE";

        this.EventType = new Object();
        this.EventType.QUEST = "QUEST";
        this.EventType.amount = 1;

        this.QuestNamePrefixes = new Array("Clearing", "Reaping", "Destroying", "Removing", "Obliterating");
        this.QuestNameSuffixes = new Array("Threat", "Swarm", "Horde", "Pillagers", "Ravagers");

        this.MonsterRarity = new Object();
        this.MonsterRarity.COMMON = "COMMON";
        this.MonsterRarity.RARE = "RARE";
        this.MonsterRarity.ELITE = "ELITE";
        this.MonsterRarity.BOSS = "BOSS";

        this.ParticleType = new Object();
        this.ParticleType.SKULL = "SKULL";
        this.ParticleType.GOLD = "GOLD";
        this.ParticleType.EXP_ORB = "EXP_ORB";
        this.ParticleType.PLAYER_DAMAGE = "PLAYER_DAMAGE";
        this.ParticleType.PLAYER_CRITICAL = "PLAYER_CRITICAL";
        this.ParticleType.MONSTER_DAMAGE = "MONSTER_DAMAGE";

        this.Prefixes = new Array("DAMAGE", "HEALTH", "ARMOUR", "CRIT_CHANCE", "ITEM_RARITY", "GOLD_GAIN");
        this.PREFIX_AMOUNT = 6;

        this.Suffixes = new Array("STRENGTH", "AGILITY", "STAMINA", "HP5", "CRIT_DAMAGE", "EXPERIENCE_GAIN", "EVASION");
        this.SUFFIX_AMOUNT = 7;

        this.DamageNames = new Array("Heavy", "Honed", "Fine", "Tempered", "Annealed", "Burnished", "Polished", "Shiny", "Glinting", "Shimmering",
            "Sparkling", "Gleaming", "Dazzling", "Glistening", "Flaring", "Luminous", "Glowing", "Brilliant", "Radiant", "Glorious");
        this.HealthNames = new Array("Healthy", "Lively", "Athletic", "Brisk", "Tough", "Fecund", "Bracing", "Uplifting", "Stimulating", "Invigorating",
            "Exhilarating", "Virile", "Stout", "Stalwart", "Sanguine", "Robust", "Rotund", "Spirited", "Potent", "Vigorous");
        this.ArmourNames = new Array("Lacquered", "Studded", "Ribbed", "Fortified", "Plated", "Carapaced", "Reinforced", "Strengthened", "Backed",
            "Banded", "Bolstered", "Braced", "Thickened", "Spiked", "Barbed", "Layered", "Scaled", "Tightened", "Chained", "Supported");
        this.CritChanceNames = new Array("Dark", "Shadow", "Wilderness", "Night", "Bloodthirsty", "Black", "Cloudy", "Dim", "Grim", "Savage", "Deadly",
            "Sharpened", "Razor Sharp", "Pincer", "Bloody", "Cruel", "Dangerous", "Fatal", "Harmful", "Lethal");
        this.ItemRarityNames = new Array("Bandit's", "Pillager's", "Thug's", "Magpie's", "Pirate's", "Captain's", "Raider's", "Corsair's", "Filibuster's",
            "Freebooter's", "Marauder's", "Privateer's", "Rover's", "Criminal's", "Hooligan's", "Mobster's", "Outlaw's", "Robber's", "Crook's",
            "Forager's");
        this.GoldGainNames = new Array("King's", "Queen's", "Prince's", "Emperor's", "Monarch's", "Sultan's", "Baron's", "Caeser's", "Caliph's",
            "Czar's", "Kaiser's", "Khan's", "Magnate's", "Overlord's", "Lord's", "Ruler's", "Leader's", "Sovereign's", "Tycoon's", "Duke's");

        this.StrengthNames = new Array("of the Hippo", "of the Seal", "of the Bear", "of the Lion", "of the Gorrilla", "of the Goliath",
            "of the Leviathan", "of the Titan", "of the Shark", "of the Yeti", "of the Tiger", "of the Elephant", "of the Beetle", "of the Ancient",
            "of the Strong", "of the Rhino", "of the Whale", "of the Crocodile", "of the Aligator", "of the Tortoise");
        this.AgilityNames = new Array("of the Mongoose", "of the Lynx", "of the Fox", "of the Falcon", "of the Panther", "of the Leopard",
            "of the Jaguar", "of the Phantasm", "of the Cougar", "of the Owl", "of the Eagle", "of the Cheetah", "of the Antelope", "of the Greyhound",
            "of the Wolf", "of the Kangaroo", "of the Horse", "of the Coyote", "of the Zebra", "of the Hyena");
        this.StaminaNames = new Array("of the Guardian", "of the Protector", "of the Defender", "of the Keeper", "of the Overseer", "of the Paladin",
            "of the Preserver", "of the Sentinel", "of the Warden", "of the Crusader", "of the Patron", "of the Savior", "of the Liberator",
            "of the Zealot", "of the Safeguard", "of the Monk", "of the Vigilante", "of the Bodyguard", "of the Hero", "of the Supporter");
        this.Hp5Names = new Array("of Regeneration", "of Restoration", "of Healing", "of Rebirth", "of Resurrection", "of Reclamation", "of Growth",
            "of Nourishment", "of Warding", "of Rejuvenation", "of Revitalisation", "of Recovery", "of Renewal", "of Revival", "of Curing",
            "of Resurgance", "of Replenishment", "of Holyness", "of Prayer", "of Meditation");
        this.CritDamageNames = new Array("of the Berserker", "of the Insane", "of the Psychopath", "of the Ravager", "of the Breaker",
            "of the Warrior", "of the Warlord", "of the Destructor", "of the Crazy", "of the Mad", "of the Champion", "of the Mercenary",
            "of the Militant", "of the Assailent", "of the Gladiator", "of the Assassin", "of the Rogue", "of the Guerilla", "of the Destroyer",
            "of the Hunter");
        this.ExperienceGainNames = new Array("of Wisdom", "of Experience", "of Foresight", "of Intelligence", "of Knowledge", "of Mastery",
            "of Evolution", "of Brilliance", "of Perception", "of Senses", "of Understanding", "of Expansion", "of Growth", "of Progression",
            "of Transformation", "of Advancement", "of Gain", "of Improvement", "of Success", "of Development");
        this.EvasionNames = new Array("of Dodging", "of Reflexes", "of Shadows", "of Acrobatics", "of Avoidance", "of Eluding",
            "of Swerving", "of Deception", "of Juking", "of Reaction", "of Response", "of Elusion", "of Escape", "of Ducking",
            "of Avoiding", "of Swerving", "of Trickery", "of Darkness", "of Blinding", "of Shuffling");
        this.namesAmount = 20;

        this.LevelOneNames = new Array("Leather Spaulders", "Leather Tunic", "Leather Trousers", "Wooden Club",
            "Leather Gloves", "Leather Boots", "Talisman");

        this.itemBonusesAmount = 14;

        this.ItemRarity = new Object();
        this.ItemRarity.COMMON = "COMMON";
        this.ItemRarity.UNCOMMON = "UNCOMMON";
        this.ItemRarity.RARE = "RARE";
        this.ItemRarity.EPIC = "EPIC";
        this.ItemRarity.LEGENDARY = "LEGENDARY";
        this.ItemRarity.count = 5;

        this.ItemType = new Object();
        this.ItemType.HELM = "HELM";
        this.ItemType.SHOULDERS = "SHOULDERS";
        this.ItemType.CHEST = "CHEST";
        this.ItemType.LEGS = "LEGS";
        this.ItemType.WEAPON = "WEAPON";
        this.ItemType.TRINKET = "TRINKET";
        this.ItemType.OFF_HAND = "OFF_HAND";
        this.ItemType.GLOVES = "GLOVES";
        this.ItemType.BOOTS = "BOOTS";
        this.ItemType.count = 9;

        this.EffectType = new Object();
        this.EffectType.CRUSHING_BLOWS = "CRUSHING_BLOWS";
        this.EffectType.COMBUSTION = "COMBUSTION";
        this.EffectType.RUPTURE = "RUPTURE";
        this.EffectType.WOUNDING = "WOUNDING";
        this.EffectType.CURING = "CURING";
        this.EffectType.FROST_SHARDS = "FROST_SHARDS";
        this.EffectType.FLAME_IMBUED = "FLAME_IMBUED";
        this.EffectType.BARRIER = "BARRIER";
        this.EffectType.SWIFTNESS = "SWIFTNESS";
        this.EffectType.PILLAGING = "PILLAGING";
        this.EffectType.NOURISHMENT = "NOURISHMENT";
        this.EffectType.BERSERKING = "BERSERKING";

        this.UpgradeType = new Object();
        this.UpgradeType.GPS = "GPS";
        this.UpgradeType.SPECIAL = "SPECIAL";
        this.UpgradeType.ATTACK = "ATTACK";
        this.UpgradeType.AUTO_SELL = "AUTO_SELL";

        this.UpgradeRequirementType = new Object();
        this.UpgradeRequirementType.FOOTMAN = "FOOTMAN";
        this.UpgradeRequirementType.CLERIC = "CLERIC";
        this.UpgradeRequirementType.COMMANDER = "COMMANDER";
        this.UpgradeRequirementType.MAGE = "MAGE";
        this.UpgradeRequirementType.ASSASSIN = "ASSASSIN";
        this.UpgradeRequirementType.WARLOCK = "WARLOCK";
        this.UpgradeRequirementType.LEVEL = "LEVEL";
        this.UpgradeRequirementType.ITEMS_LOOTED = "ITEMS_LOOTED";

        this.SLOT_TYPE = new Object();
        this.SLOT_TYPE.EQUIP = "EQUIP";
        this.SLOT_TYPE.INVENTORY = "INVENTORY";
        this.SLOT_TYPE.SELL = "SELL";

        this.setRoot = function(value) {

        };
    }

    return new Static();
});