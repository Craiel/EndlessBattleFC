declare("Quest", function () {
    include('Component');
    include('MercenaryManager');
    include('QuestManager');
    include('UpgradeManager');

    Quest.prototype = component.create();
    Quest.prototype.$super = parent;
    Quest.prototype.constructor = Quest;

    function Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) {
        this.id = "Quest";

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
        this.displayId = questManager.quests.length + 1;

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            // Update this quest depending on the type that it is
            switch (this.type) {
                // Kill Quest - Check if the amount of monsters required has been met
                case QuestType.KILL:
                    if (this.killCount >= this.typeAmount) {
                        this.complete = true;
                    }
                    break;
                // Mercenary Quest - Check if the amount of mercenaries required has been met
                case QuestType.MERCENARIES:
                    switch (this.typeId) {
                        case 0:
                            if (mercenaryManager.footmenOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 1:
                            if (mercenaryManager.clericsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 2:
                            if (mercenaryManager.commandersOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 3:
                            if (mercenaryManager.magesOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 4:
                            if (mercenaryManager.assassinsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 5:
                            if (mercenaryManager.warlocksOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                    }
                    break;
                // Upgrade Quest - Check if the required upgrade has been purchased
                case QuestType.UPGRADE:
                    if (upgradeManager.upgrades[this.typeId].purchased) {
                        this.complete = true;
                    }
                    break;
            }
        }

        this.grantReward = function() {
            game.player.gainGold(this.goldReward, false);
            game.stats.goldFromQuests += game.player.lastGoldGained;
            game.player.gainExperience(this.expReward, false);
            game.stats.experienceFromQuests += game.player.lastExperienceGained;
            if (this.buffReward != null) {
                game.player.buffs.addBuff(this.buffReward);
            }
        }
    }

    return {
        create: function(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) { return new Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward); }
    }
});