declare('Effect', function () {
    include('StaticData');

    function Effect(type, chance, value) {
        this.type = type;
        this.chance = chance;
        this.value = value;

        this.getDescription = function() {
            switch (this.type) {
                case staticData.EffectType.CRUSHING_BLOWS:
                    return "Crushing Blows: Your attack deal " + this.value + "% of your opponent's current health in damage";
                    break;
                case staticData.EffectType.COMBUSTION:
                    return "Combustion: The debuff from Fire Blade can stack up to " + this.value + " more times";
                    break;
                case staticData.EffectType.RUPTURE:
                    return "Rupture: Your attacks apply an additional stack of Rend. Also increases the maximum stacks of Rend by " + this.value;
                    break;
                case staticData.EffectType.WOUNDING:
                    return "Wounding: Increases the level of your Rend ability by " + this.value;
                    break;
                case staticData.EffectType.CURING:
                    return "Curing: Increases the level of your Rejuvenating Strikes ability by " + this.value;
                    break;
                case staticData.EffectType.FROST_SHARDS:
                    return "Frost Shards: Increases the level of your Ice Blade ability by " + this.value;
                    break;
                case staticData.EffectType.FLAME_IMBUED:
                    return "Flame Imbued: Increases the level of your Fire Blade ability by " + this.value;
                    break;
                case staticData.EffectType.BARRIER:
                    return "Barrier: You reflect " + this.value + "% of the damage you receive";
                    break;
                case staticData.EffectType.SWIFTNESS:
                    return "Swiftness: Your attacks have a " + this.chance + "% chance to generate an additional attack";
                    break;
                case staticData.EffectType.PILLAGING:
                    return "Pillaging: Your attacks have a " + this.chance + "% chance to grant you " + this.value + " gold";
                    break;
                case staticData.EffectType.NOURISHMENT:
                    return "Nourishment: Your attacks have a " + this.chance + "% chance to heal you for " + this.value + " health";
                    break;
                case staticData.EffectType.BERSERKING:
                    return "Berserking: Your attacks have a " + this.chance + "% chance to deal " + this.value + " damage";
                    break;
            }
        }
    }

    return {
        create: function(type, chance, value) { return new Effect(type, chance, value); }
    }

});