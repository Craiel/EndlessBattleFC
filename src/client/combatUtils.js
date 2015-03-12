declare('CombatUtils', function () {
    include('Assert');
    include('Log');
    include('Data');
    include('CoreUtils');

    function CombatResult() {
        this.wasHit = false;
        this.wasCrit = false;

        this.damageTotal = 0;
        this.damage = { physical: 0 }
    }

    function CombatUtils() {}

    CombatUtils.prototype.resolveCombatTick = function(sourceActor, targetActor) {
        var ability = data.Abilities.basic.id;
        var sourceAbility = sourceActor.getAbility(ability);
        var sourceCooldown = sourceActor.getAbilityCooldown(ability);
        var targetAbility = targetActor.getAbility(ability);
        var targetCooldown = targetActor.getAbilityCooldown(ability);

        console.log(sourceAbility + "." + sourceCooldown);

        console.log("Combat Resolve Starting: ");
        console.log(this.computeHit(sourceActor));
        console.log(this.computeHit(targetActor));
    }

    CombatUtils.prototype.computeHit = function(actor) {
        var result = new CombatResult();

        var isHit = this.computeHitChance(actor);
        if(isHit !== true) {
            return result;
        }

        result.wasHit = true;

        // Calculate the basic damage
        var dmgMult = actor.getStat(data.StatDefinition.dmgMult.id);
        var minDmg = actor.getStat(data.StatDefinition.dmgMin.id);
        var maxDmg = actor.getStat(data.StatDefinition.dmgMax.id);
        var damage = coreUtils.getRandomInt(minDmg, maxDmg) * dmgMult;

        // See if we are having a critical hit
        if(this.computeCrit(actor) === true) {
            result.wasCrit = true;
            var critDmg = actor.getStat(data.StatDefinition.critDmg.id);
            var critDmgMult = actor.getStat(data.StatDefinition.critDmgMult.id);
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

    this.computeHitChance = function(actor) {
        var chance = actor.getHitChance();
        if(Math.random() <= chance) {
            return true;
        }

        return false;
    }

    return new CombatUtils;
});