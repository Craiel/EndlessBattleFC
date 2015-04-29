declare('CombatUtils', function () {
    include('Debug');
    include('GameData');
    include('CoreUtils');

    function CombatResult() {
        this.sourceActorName = undefined;
        this.targetActorName = undefined;
        this.wasHit = false;
        this.wasCrit = false;
        this.wasEvaded = false;

        this.damageTotal = 0;
        this.damage = { physical: 0, ice: 0, fire: 0, light: 0, dark: 0 }
        this.mitigation = { physical: 0, ice: 0, fire: 0, light: 0, dark: 0 }
    }

    function CombatUtils() {
        this.maxResist = 0.8;
    }

    CombatUtils.prototype.applyHit = function(targetActor, hit) {
        if(hit.wasHit !== true || hit.wasEvaded !== false) {
            debug.logWarning("Tried to apply missed or evaded hit!");
            return;
        }

        targetActor.modifyStat(gameData.StatDefinition.hp.id, -hit.damageTotal);
    }

    CombatUtils.prototype.resolveCombat = function(sourceActor, targetActor, ability) {

        var hit = this.computeHit(sourceActor, ability);
        hit.sourceActorName = sourceActor.getName();
        hit.targetActorName = targetActor.getName();

        if(hit.wasHit !== true) {
            return hit;
        }

        this.applyEvasion(targetActor, hit);
        if(hit.wasEvaded !== false) {
            return hit;
        }

        // Calculate the mitigation from armor and resistances
        this.applyArmor(targetActor, hit);
        this.applyResistances(targetActor, hit);

        // Apply the hit to the target
        this.applyHit(targetActor, hit);

        return hit;
    }

    CombatUtils.prototype.applyEvasion = function(actor, hit) {
        var chance = actor.getEvadeChance();
        if(Math.random() <= chance) {
            hit.wasEvaded = true;
            return true;
        }

        return false;
    }

    CombatUtils.prototype.applyArmor = function(actor, hit) {
        var reduction = actor.getArmorDmgReduction();
        var value = Math.floor(hit.damage.physical * reduction);
        if(value > 0) {
            hit.mitigation.physical += value;
            hit.damage.physical -= value;
            hit.damageTotal -= value;
        }
    }

    CombatUtils.prototype.applyResistances = function(actor, hit) {
        var iceResist = 1.0 - actor.getStat(gameData.StatDefinition.iceResist.id) * actor.getStat(gameData.StatDefinition.iceResistMult.id);
        var fireResist = 1.0 - actor.getStat(gameData.StatDefinition.fireResist.id) * actor.getStat(gameData.StatDefinition.fireResistMult.id);
        var lightResist = 1.0 - actor.getStat(gameData.StatDefinition.lightResist.id) * actor.getStat(gameData.StatDefinition.lightResistMult.id);
        var darkResist = 1.0 - actor.getStat(gameData.StatDefinition.darkResist.id) * actor.getStat(gameData.StatDefinition.darkResistMult.id);

        iceResist = iceResist.clamp(0, this.maxResist);
        fireResist = fireResist.clamp(0, this.maxResist);
        lightResist = lightResist.clamp(0, this.maxResist);
        darkResist = darkResist.clamp(0, this.maxResist);

        var mitigation = Math.floor(hit.damage.ice * iceResist);
        if(mitigation > 0) {
            hit.mitigation.ice += mitigation;
            hit.damage.ice -= mitigation;
            hit.damageTotal -= mitigation;
        }

        mitigation = Math.floor(hit.damage.fire * fireResist);
        if(mitigation > 0) {
            hit.mitigation.fire += mitigation;
            hit.damage.fire -= mitigation;
            hit.damageTotal -= mitigation;
        }

        mitigation = Math.floor(hit.damage.light * lightResist);
        if(mitigation > 0) {
            hit.mitigation.light += mitigation;
            hit.damage.light -= mitigation;
            hit.damageTotal -= mitigation;
        }

        mitigation = Math.floor(hit.damage.dark * darkResist);
        if(mitigation > 0) {
            hit.mitigation.dark += mitigation;
            hit.damage.dark -= mitigation;
            hit.damageTotal -= mitigation;
        }
    }

    CombatUtils.prototype.computeHit = function(actor) {
        var result = new CombatResult();

        var isHit = this.computeHitChance(actor);
        if(isHit !== true) {
            return result;
        }

        result.wasHit = true;

        // Calculate the basic damage
        var dmgMult = actor.getStat(gameData.StatDefinition.dmgMult.id);
        var minDmg = actor.getStat(gameData.StatDefinition.dmgMin.id);
        var maxDmg = actor.getStat(gameData.StatDefinition.dmgMax.id);
        var damage = coreUtils.getRandomInt(minDmg, maxDmg) * dmgMult;

        // See if we are having a critical hit
        if(this.computeCrit(actor) === true) {
            result.wasCrit = true;
            var critDmg = actor.getStat(gameData.StatDefinition.critDmg.id);
            var critDmgMult = actor.getStat(gameData.StatDefinition.critDmgMult.id);
            var critDamage = (damage * critDmg) * critDmgMult;
            damage += critDamage;
        }

        // Todo: damage types
        result.damage.physical = Math.floor(damage);
        result.damageTotal += result.damage.physical;

        return result;
    }

    CombatUtils.prototype.computeCrit = function(actor) {
        var chance = actor.getCritChance();
        if(Math.random() <= chance) {
            return true;
        }

        return false;
    }

    CombatUtils.prototype.computeHitChance = function(actor) {
        var chance = actor.getHitChance();
        if(Math.random() <= chance) {
            return true;
        }

        return false;
    }

    return new CombatUtils;
});