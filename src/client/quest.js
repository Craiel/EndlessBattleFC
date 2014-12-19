declare("Quest", function () {

    function Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) {
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
        this.displayId = game.questsManager.quests.length + 1;

        this.update = function update() {
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
                            if (game.mercenaryManager.footmenOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 1:
                            if (game.mercenaryManager.clericsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 2:
                            if (game.mercenaryManager.commandersOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 3:
                            if (game.mercenaryManager.magesOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 4:
                            if (game.mercenaryManager.assassinsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 5:
                            if (game.mercenaryManager.warlocksOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                    }
                    break;
                // Upgrade Quest - Check if the required upgrade has been purchased
                case QuestType.UPGRADE:
                    if (game.upgradeManager.upgrades[this.typeId].purchased) {
                        this.complete = true;
                    }
                    break;
            }
        }

        this.grantReward = function grantReward() {
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
        create: function() { return new Quest(); }
    }
});