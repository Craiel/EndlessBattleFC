declare('Quest', function () {
    include('Component');
    include('UpgradeManager');
    include('StaticData');

    Quest.prototype = component.prototype();
    Quest.prototype.$super = parent;
    Quest.prototype.constructor = Quest;

    var nextQuestId = 0;

    function Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) {
        component.construct(this);

        this.id = "Quest" + (nextQuestId++);

        this.name = name;
        this.description = description;
        this.type = type;
        this.typeId = typeId;
        this.typeAmount = typeAmount;
        this.goldReward = goldReward;
        this.expReward = expReward;
        this.buffReward = buffReward;

        this.originalKillCount = 0;
        this.killCount = 0;

        this.complete = false;

        // The Id that this quest will use to display in the quests window
        this.displayId = undefined;
    }

    Quest.prototype.componentUpdate = Quest.prototype.update;
    Quest.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        // Update this quest depending on the type that it is
        switch (this.type) {
            // Kill Quest - Check if the amount of monsters required has been met
            case staticData.QuestType.KILL:
                if (this.killCount >= this.typeAmount) {
                    this.complete = true;
                }
                break;
            // Upgrade Quest - Check if the required upgrade has been purchased
            case staticData.QuestType.UPGRADE:
                if (upgradeManager.upgrades[this.typeId].purchased) {
                    this.complete = true;
                }
                break;
        }

        return true;
    }

    Quest.prototype.grantReward = function() {
        game.player.gainGold(this.goldReward, false);
        game.stats.goldFromQuests += game.player.lastGoldGained;
        game.player.gainExperience(this.expReward, false);
        game.stats.experienceFromQuests += game.player.lastExperienceGained;
        if (this.buffReward != null) {
            game.player.buffs.addBuff(this.buffReward);
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Quest.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Quest.call(self); },
        create: function(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) { return new Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward); }
    }
});