declare("PlayerState", function () {
    include('Component');

    PlayerState.prototype = component.create();
    PlayerState.prototype.$super = parent;
    PlayerState.prototype.constructor = PlayerState;

    function PlayerState() {
        this.id = "PlayerState";
        this.health = 0;
        this.hp5 = 0;
        this.minDamage = 0;
        this.maxDamage = 0;
        this.damageBonus = 0;
        this.armour = 0;
        this.evasion = 0;
        this.strength = 0;
        this.stamina = 0;
        this.agility = 0;
        this.critChance = 0;
        this.critDamage = 0;
        this.itemRarity = 0;
        this.goldGain = 0;
        this.experienceGain = 0;
    }

    return {
        create: function() { return new PlayerState(); }
    }
});