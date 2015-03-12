declare('Options', function () {
    include('Component');

    Options.prototype = component.prototype();
    Options.prototype.$super = parent;
    Options.prototype.constructor = Options;

    function Options() {
        component.construct(this);

        this.id = "Options";

        this.displaySkullParticles = true;
        this.displayGoldParticles = true;
        this.displayExpParticles = true;
        this.displayPlayerDamageParticles = true;
        this.displayMonsterDamageParticles = true;

        this.alwaysDisplayPlayerHealth = false;
        this.alwaysDisplayMonsterHealth = false;
        this.alwaysDisplayExp = false;
    }

    Options.prototype.save = function() {
        localStorage.optionsSaved = true;
        localStorage.displaySkullParticles = this.displaySkullParticles;
        localStorage.displayGoldParticles = this.displayGoldParticles;
        localStorage.displayExpParticles = this.displayExpParticles;
        localStorage.displayPlayerDamageParticles = this.displayPlayerDamageParticles;
        localStorage.displayMonsterDamageParticles = this.displayMonsterDamageParticles;

        localStorage.alwaysDisplayPlayerHealth = this.alwaysDisplayPlayerHealth;
        localStorage.alwaysDisplayMonsterHealth = this.alwaysDisplayMonsterHealth;
        localStorage.alwaysDisplayExp = this.alwaysDisplayExp;
    }

    Options.prototype.load = function() {
        if (localStorage.optionsSaved != null) {
            this.displaySkullParticles = JSON.parse(localStorage.displaySkullParticles);
            this.displayGoldParticles = JSON.parse(localStorage.displayGoldParticles);
            this.displayExpParticles = JSON.parse(localStorage.displayExpParticles);
            this.displayPlayerDamageParticles = JSON.parse(localStorage.displayPlayerDamageParticles);
            this.displayMonsterDamageParticles = JSON.parse(localStorage.displayMonsterDamageParticles);

            this.alwaysDisplayPlayerHealth = JSON.parse(localStorage.alwaysDisplayPlayerHealth);
            this.alwaysDisplayMonsterHealth = JSON.parse(localStorage.alwaysDisplayMonsterHealth);
            this.alwaysDisplayExp = JSON.parse(localStorage.alwaysDisplayExp);

            if (!this.displaySkullParticles) {
                document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: OFF";
            }
            if (!this.displayGoldParticles) {
                document.getElementById("goldParticlesOption").innerHTML = "Gold particles: OFF";
            }
            if (!this.displayExpParticles) {
                document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: OFF";
            }
            if (!this.displayPlayerDamageParticles) {
                document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: OFF";
            }
            if (!this.displayMonsterDamageParticles) {
                document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: OFF";
            }

            if (this.alwaysDisplayMonsterHealth) {
                document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: ON";
                game.displayMonsterHealth = true;
            }
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Options.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Options.call(self); },
        create: function() { return new Options(); }
    };
});