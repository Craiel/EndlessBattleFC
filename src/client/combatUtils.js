declare('CombatUtils', function () {
    include('Assert');
    include('Log');
    include('Data');
    include('CoreUtils');

    function CombatResult() {
        this.wasHit = false;
        this.wasCrit = false;

        this.damage = { physical: 0 }
    }

    function CombatUtils() {

        this.resolveCombatTick = function(sourceActor, targetActor) {
            var sourceAbility = sourceActor.getAbility('basic');
            var targetAbility = targetActor.getAbility('basic');

            console.log("Combat Resolve Starting: ");
            console.log(this.computeHit(sourceActor));
            console.log(this.computeHit(targetActor));
        }

        this.computeHit = function(actor) {
            var result = new CombatResult();
            var dmgMult = actor.getStat(data.StatDefinition.dmgMult.id);
            var minDmg = actor.getStat(data.StatDefinition.dmgMin.id);
            var maxDmg = actor.getStat(data.StatDefinition.dmgMax.id);
            var damage = coreUtils.getRandomInt(minDmg, maxDmg) * dmgMult;
            if(this.computeCrit(actor) === true) {
                result.wasCrit = true;
                var critDmg = actor.getStat(data.StatDefinition.critDmg.id);
                var critDmgMult = actor.getStat(data.StatDefinition.critDmgMult.id);
                var critDamage = (hit * critDmg) * critDmgMult;
                damage += critDamage;
            }

            // Todo: damage types
            // Todo: % Hit chance
            result.damage.physical = damage;
            return result;
        }

        this.computeCrit = function(actor) {
            var level = actor.getLevel();
            var critRate = actor.getStat(data.StatDefinition.critRate.id);
            var critMult = actor.getStat(data.StatDefinition.critRateMult.id);
            log.info("ComputeCrit: " + level + " " + critRate + " " + critMult);

            return false;
        }

    }

    return new CombatUtils;
});