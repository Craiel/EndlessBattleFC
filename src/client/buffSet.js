declare("BuffSet", function () {
    include('Component');
    include('Buff');
    include('Static');

    BuffSet.prototype = component.create();
    BuffSet.prototype.$super = parent;
    BuffSet.prototype.constructor = BuffSet;

    function BuffSet() {
        this.id = "BuffSet";

        this.buffs = new Array();

        // These are for debuffs
        this.bleeding = false;
        this.bleedStacks = 0;
        this.bleedDamage = 0;
        this.bleedDuration = 0;
        this.bleedMaxDuration = 0;

        this.chilled = false;
        this.chillDuration = 0;
        this.chillMaxDuration = 0;

        this.burning = false;
        this.burningStacks = 0;
        this.burningDamage = 0;
        this.burningDuration = 0;
        this.burningMaxDuration = 0;

        this.addBuff = function(buff) {
            buff.id = this.buffs.length + 1;
            this.buffs.push(buff);
            game.displayAlert(buff.name);

            var newDiv = document.createElement('div');
            newDiv.id = 'buffContainer' + buff.id;
            newDiv.className = 'buffContainer';
            var container = document.getElementById("buffsArea");
            container.appendChild(newDiv);

            var newDiv2 = document.createElement('div');
            newDiv2.id = 'buffIcon' + buff.id;
            newDiv2.className = 'buffIcon';
            newDiv2.style.background = 'url("includes/images/buffIcons.png") ' + buff.leftPos + 'px ' + buff.topPos + 'px';
            newDiv.appendChild(newDiv2);

            var newDiv3 = document.createElement('div');
            newDiv3.id = 'buffBar' + buff.id;
            newDiv3.className = 'buffBar';
            newDiv3.style.width = '175px';
            newDiv.appendChild(newDiv3);
        }

        this.getDamageMultiplier = function() {
            var multiplier = 0;
            for (var x = 0; x < this.buffs.length; x++) {
                if (this.buffs[x].type == static.BuffType.DAMAGE) {
                    multiplier += this.buffs[x].multiplier;
                }
            }
            if (multiplier == 0) {
                multiplier = 1;
            }
            return multiplier;
        }
        this.getGoldMultiplier = function() {
            var multiplier = 0;
            for (var x = 0; x < this.buffs.length; x++) {
                if (this.buffs[x].type == static.BuffType.GOLD) {
                    multiplier += this.buffs[x].multiplier;
                }
            }
            if (multiplier == 0) {
                multiplier = 1;
            }
            return multiplier;
        }
        this.getExperienceMultiplier = function() {
            var multiplier = 0;
            for (var x = 0; x < this.buffs.length; x++) {
                if (this.buffs[x].type == static.BuffType.EXPERIENCE) {
                    multiplier += this.buffs[x].multiplier;
                }
            }
            if (multiplier == 0) {
                multiplier = 1;
            }
            return multiplier;
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            // Update all the buff durations
            for (var x = this.buffs.length - 1; x >= 0; x--) {
                this.buffs[x].currentDuration -= gameTime.elapsed;
                // If the buff has expired, remove it and its elements, then update the id of all the other buffs that need updating
                if (this.buffs[x].currentDuration <= 0) {
                    var buffContainer = document.getElementById('buffContainer' + (this.buffs.length));
                    buffContainer.parentNode.removeChild(buffContainer);
                    this.buffs.splice(x, 1);

                    for (var y = x; y < this.buffs.length; y++) {
                        this.buffs[x].id--;
                    }
                }
                else {
                    var buffBar = document.getElementById('buffBar' + (x + 1));
                    buffBar.style.width = (175 * (this.buffs[x].currentDuration / this.buffs[x].maxDuration)) + 'px';
                }
            }
        }

        this.getRandomQuestRewardBuff = function() {
            switch (Math.floor(Math.random() * 9)) {
                case 0:
                    return buff.create("Damage x2", static.BuffType.DAMAGE, 2, 60, 0, 0);
                    break;
                case 1:
                    return buff.create("Damage x4", static.BuffType.DAMAGE, 4, 60, 30, 0);
                    break;
                case 2:
                    return buff.create("Damage x7", static.BuffType.DAMAGE, 7, 60, 15, 0);
                    break;
                case 3:
                    return buff.create("Gold x2", static.BuffType.GOLD, 2, 60, 0, 30);
                    break;
                case 4:
                    return buff.create("Gold x4", static.BuffType.GOLD, 4, 60, 30, 30);
                    break;
                case 5:
                    return buff.create("Gold x7", static.BuffType.GOLD, 7, 60, 15, 30);
                    break;
                case 6:
                    return buff.create("Experience x2", static.BuffType.EXPERIENCE, 2, 60, 0, 15);
                    break;
                case 7:
                    return buff.create("Experience x4", static.BuffType.EXPERIENCE, 4, 60, 30, 15);
                    break;
                case 8:
                    return buff.create("Experience x7", static.BuffType.EXPERIENCE, 7, 60, 15, 15);
                    break;
            }
        }
    }

    return {
        create: function() { return new BuffSet(); }
    }
});