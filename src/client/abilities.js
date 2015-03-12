declare('Abilities', function () {
    include('Component');
    include('StaticData');

    Abilities.prototype = component.prototype();
    Abilities.prototype.$super = parent;
    Abilities.prototype.constructor = Abilities;

    function Abilities() {
        component.construct(this);

        this.id = "Abilities";

        this.baseRendLevel = 0;
        this.rendDuration = 5;
        this.baseRejuvenatingStrikesLevel = 0;
        this.baseIceBladeLevel = 0;
        this.iceBladeChillDuration = 5;
        this.baseFireBladeLevel = 0;
        this.fireBladeBurnDuration = 5;
    }

    Abilities.prototype.getRendLevel = function() {
        var level = this.baseRendLevel;
        var effects = game.player.getEffectsOfType(staticData.EffectType.WOUNDING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }

    Abilities.prototype.getRendDamage = function(levelBonus) {
        return Math.ceil((game.player.getAverageDamage() / 17) + (game.player.getLevel() / 1.5)) * (this.getRendLevel() + levelBonus);
    }

    Abilities.prototype.getRejuvenatingStrikesLevel = function() {
        var level = this.baseRejuvenatingStrikesLevel;
        var effects = game.player.getEffectsOfType(staticData.EffectType.CURING);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }

    Abilities.prototype.getRejuvenatingStrikesHealAmount = function(levelBonus) {
        return Math.ceil((game.player.getAverageDamage() / 54) + (game.player.getLevel() / 2)) * (this.getRejuvenatingStrikesLevel() + levelBonus);
    }

    Abilities.prototype.getIceBladeLevel = function() {
        var level = this.baseIceBladeLevel;
        var effects = game.player.getEffectsOfType(staticData.EffectType.FROST_SHARDS);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }

    Abilities.prototype.getIceBladeDamage = function(levelBonus) {
        return Math.ceil((game.player.getAverageDamage() / 12) + game.player.getLevel()) * (this.getIceBladeLevel() + levelBonus);
    }

    Abilities.prototype.getFireBladeLevel = function() {
        var level = this.baseFireBladeLevel;
        var effects = game.player.getEffectsOfType(staticData.EffectType.FLAME_IMBUED);
        for (var x = 0; x < effects.length; x++) {
            level += effects[x].value;
        }
        return level;
    }

    Abilities.prototype.getFireBladeDamage = function(levelBonus) {
        return Math.ceil((game.player.getAverageDamage() / 12) + game.player.getLevel()) * (this.getFireBladeLevel() + levelBonus);
    }

    Abilities.prototype.getFireBladeBurnDamage = function(levelBonus) {
        return Math.ceil((game.player.getAverageDamage() / 9) + game.player.getLevel()) * (this.getFireBladeLevel() + levelBonus);
    }

    Abilities.prototype.save = function() {
        localStorage.playerRendLevel = this.baseRendLevel;
        localStorage.playerRejuvenatingStrikesLevel = this.baseRejuvenatingStrikesLevel;
        localStorage.playerIceBladeLevel = this.baseIceBladeLevel;
        localStorage.playerFireBladeLevel = this.baseFireBladeLevel;
    }

    Abilities.prototype.load = function() {
        if (localStorage.playerRendLevel != null) {
            this.baseRendLevel = parseInt(localStorage.playerRendLevel);
        }
        if (localStorage.playerRejuvenatingStrikesLevel != null) {
            this.baseRejuvenatingStrikesLevel = parseInt(localStorage.playerRejuvenatingStrikesLevel);
        }
        if (localStorage.playerIceBladeLevel != null) {
            this.baseIceBladeLevel = parseInt(localStorage.playerIceBladeLevel);
        }
        if (localStorage.playerFireBladeLevel != null) {
            this.baseFireBladeLevel = parseInt(localStorage.playerFireBladeLevel);
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Abilities.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Abilities.call(self); },
        create: function() { return new Abilities(); }
    }
});
