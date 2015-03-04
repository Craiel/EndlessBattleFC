declare("ParticleManager", function () {
    include('Component');
    include('Static');
    include('Particle');
    include('Resources');

    ParticleManager.prototype = component.create();
    ParticleManager.prototype.$super = parent;
    ParticleManager.prototype.constructor = ParticleManager;

    function ParticleManager() {
        this.id = "ParticleManager";

        this.maxParticles = 50;
        this.particles = new Array();
        this.particleSources = new Object();
        this.particleSources.SKULL = resources.ImageIconSkull;
        this.particleSources.GOLD = resources.ImageIconCoin;
        this.particleSources.EXP_ORB = resources.ImageIconGlobe;
        this.particleSources.PLAYER_DAMAGE = resources.ImageIconAttack;
        this.particleSources.PLAYER_CRITICAL = resources.ImageIconAttack;

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            var canvas = document.getElementById("particleCanvas");
            var context = canvas.getContext("2d");
            context.font = "20px Gentium Book Basic";
            context.textAlign = 'center';
        }

        this.createParticle = function(text, imageType) {
            // If the type should not be displayed, end this function
            switch (imageType) {
                case static.ParticleType.SKULL:
                    if (game.options.displaySkullParticles == false) {
                        return;
                    }
                    break;
                case static.ParticleType.GOLD:
                    if (game.options.displayGoldParticles == false) {
                        return;
                    }
                    break;
                case static.ParticleType.EXP_ORB:
                    if (game.options.displayExpParticles == false) {
                        return;
                    }
                    break;
                case static.ParticleType.PLAYER_DAMAGE:
                    if (game.options.displayPlayerDamageParticles == false) {
                        return;
                    }
                    break;
                case static.ParticleType.PLAYER_CRITICAL:
                    if (game.options.displayPlayerDamageParticles == false) {
                        return;
                    }
                    break;
                case static.ParticleType.MONSTER_DAMAGE:
                    if (game.options.displayMonsterDamageParticles == false) {
                        return;
                    }
                    break;
            }

            // Calculate the left and top positions
            var left = Math.random() * 325 + 175;
            var top = Math.random() * 425 + 100;
            var textColour;
            var source = null;

            // Set the text colour and image source
            switch (imageType) {
                case static.ParticleType.SKULL:
                    source = this.particleSources.SKULL;
                    break;
                case static.ParticleType.GOLD:
                    textColour = '#fcd200';
                    source = this.particleSources.GOLD;
                    break;
                case static.ParticleType.EXP_ORB:
                    textColour = '#00ff00';
                    source = this.particleSources.EXP_ORB;
                    break;
                case static.ParticleType.PLAYER_DAMAGE:
                    textColour = '#ffffff';
                    source = this.particleSources.PLAYER_DAMAGE;
                    break;
                case static.ParticleType.PLAYER_CRITICAL:
                    textColour = '#fcff00';
                    source = this.particleSources.PLAYER_CRITICAL;
                    break;
                case static.ParticleType.MONSTER_DAMAGE:
                    textColour = '#ff0000';
                    source = this.particleSources.MONSTER_DAMAGE;
                    break;
            }

            // If there is text; create it
            var finalText = null;
            if (text != null) {
                // Calcuate the final text and set it
                finalText = '';
                if (imageType == static.ParticleType.GOLD || imageType == static.ParticleType.EXP_ORB) {
                    finalText += '+';
                }
                else if (imageType == static.ParticleType.MONSTER_DAMAGE) {
                    finalText += '-';
                }
                finalText += text;

                // If this was a player critical add an exclamation on the end
                if (imageType == static.ParticleType.PLAYER_CRITICAL) {
                    finalText += '!';
                }
            }

            // If there is an image; create one
            var image = null;
            if (source != null) {
                var image = new Image();
                image.src = source;
            }

            var canvas = document.getElementById("particleCanvas");
            var context = canvas.getContext("2d");

            var newParticle = particle.create(image, finalText, textColour, left, top, 25, 25, 0, -10, 1.5);
            this.particles.push(newParticle);
            // If the maximum amount of particles has been exceeded, remove the first particle
            if (this.particles.length > this.maxParticles) {
                this.particles.splice(0, 1);
            }
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            var canvas = document.getElementById("particleCanvas");
            var context = canvas.getContext("2d");
            var image;
            var p;
            context.clearRect(0, 0, 675, 550);
            for (var x = this.particles.length - 1; x >= 0; x--) {
                p = this.particles[x];
                p.update(gameTime);
                p.draw();
                if (p.expired()) {
                    this.particles.splice(x, 1);
                }
            }

            return true;
        }
    }

    return new ParticleManager();

});