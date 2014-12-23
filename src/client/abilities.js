declare("Abilities", function () {
    include('Component');

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

        this.getRendLevel = function getRendLevel() {
            var level = this.baseRendLevel;
            var effects = game.player.getEffectsOfType(EffectType.WOUNDING);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getRendDamage = function getRendDamage(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 17) + (game.player.level / 1.5)) * (this.getRendLevel() + levelBonus);
        }
        this.getRejuvenatingStrikesLevel = function getRejuvenatingStrikesLevel() {
            var level = this.baseRejuvenatingStrikesLevel;
            var effects = game.player.getEffectsOfType(EffectType.CURING);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getRejuvenatingStrikesHealAmount = function getRejuvenatingStrikesHealAmount(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 54) + (game.player.level / 2)) * (this.getRejuvenatingStrikesLevel() + levelBonus);
        }
        this.getIceBladeLevel = function getIceBladeLevel() {
            var level = this.baseIceBladeLevel;
            var effects = game.player.getEffectsOfType(EffectType.FROST_SHARDS);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getIceBladeDamage = function getIceBladeDamage(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 12) + game.player.level) * (this.getIceBladeLevel() + levelBonus);
        }
        this.getFireBladeLevel = function getFireBladeLevel() {
            var level = this.baseFireBladeLevel;
            var effects = game.player.getEffectsOfType(EffectType.FLAME_IMBUED);
            for (var x = 0; x < effects.length; x++) {
                level += effects[x].value;
            }
            return level;
        }
        this.getFireBladeDamage = function getFireBladeDamage(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 12) + game.player.level) * (this.getFireBladeLevel() + levelBonus);
        }
        this.getFireBladeBurnDamage = function getFireBladeBurnDamage(levelBonus) {
            return Math.ceil((game.player.getAverageDamage() / 9) + game.player.level) * (this.getFireBladeLevel() + levelBonus);
        }

        this.save = function save() {
            localStorage.playerRendLevel = this.baseRendLevel;
            localStorage.playerRejuvenatingStrikesLevel = this.baseRejuvenatingStrikesLevel;
            localStorage.playerIceBladeLevel = this.baseIceBladeLevel;
            localStorage.playerFireBladeLevel = this.baseFireBladeLevel;
        }

        this.load = function load() {
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