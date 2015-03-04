declare("Abilities", function () {
    include('Component');
    include('Static');

    Abilities.prototype = component.create();
    Abilities.prototype.$super = parent;
    Abilities.prototype.constructor = Abilities;

    function Abilities() {
        this.id = "Abilities";

        this.baseRendLevel = 0;
        this.rendDuration = 5;
        this.baseRejuvenatingStrikesLevel = 0;
        this.baseIceBladeLevel = 0;
        this.iceBladeChillDuration = 5;
        this.baseFireBladeLevel = 0;
        this.fireBladeBurnDuration = 5;

        this.getRendLevel = function() {
            var level = this.baseRendLevel;
            var effects = game.player.getEffectsOfType(static.EffectType.WOUNDING);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getRendDamage = function(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 17) + (game.player.getLevel() / 1.5)) * (this.getRendLevel() + levelBonus);
        }
        this.getRejuvenatingStrikesLevel = function() {
            var level = this.baseRejuvenatingStrikesLevel;
            var effects = game.player.getEffectsOfType(static.EffectType.CURING);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getRejuvenatingStrikesHealAmount = function(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 54) + (game.player.getLevel() / 2)) * (this.getRejuvenatingStrikesLevel() + levelBonus);
        }
        this.getIceBladeLevel = function() {
            var level = this.baseIceBladeLevel;
            var effects = game.player.getEffectsOfType(static.EffectType.FROST_SHARDS);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getIceBladeDamage = function(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 12) + game.player.getLevel()) * (this.getIceBladeLevel() + levelBonus);
        }
        this.getFireBladeLevel = function() {
            var level = this.baseFireBladeLevel;
            var effects = game.player.getEffectsOfType(static.EffectType.FLAME_IMBUED);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getFireBladeDamage = function(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 12) + game.player.getLevel()) * (this.getFireBladeLevel() + levelBonus);
        }
        this.getFireBladeBurnDamage = function(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 9) + game.player.getLevel()) * (this.getFireBladeLevel() + levelBonus);
        }

        this.save = function() {
            localStorage.playerRendLevel = this.baseRendLevel;
            localStorage.playerRejuvenatingStrikesLevel = this.baseRejuvenatingStrikesLevel;
            localStorage.playerIceBladeLevel = this.baseIceBladeLevel;
            localStorage.playerFireBladeLevel = this.baseFireBladeLevel;
        }

        this.load = function() {
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
    }

    return {
        create: function() { return new Abilities(); }
    }
});