declare("Quest", function () {
    include('Component');
    include('MercenaryManager');
    include('UpgradeManager');
    include('GameState');
    include('Static');

    Quest.prototype = component.create();
    Quest.prototype.$super = parent;
    Quest.prototype.constructor = Quest;

    var nextQuestId = 0;

    function Quest(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward) {
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

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            // Update this quest depending on the type that it is
            switch (this.type) {
                // Kill Quest - Check if the amount of monsters required has been met
                case static.QuestType.KILL:
                    if (this.killCount >= this.typeAmount) {
                        this.complete = true;
                    }
                    break;
                // Mercenary Quest - Check if the amount of mercenaries required has been met
                case static.QuestType.MERCENARIES:
                    switch (this.typeId) {
                        case 0:
                            if (gameState.footmenOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 1:
                            if (gameState.clericsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 2:
                            if (gameState.commandersOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 3:
                            if (gameState.magesOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 4:
                            if (gameState.assassinsOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                        case 5:
                            if (gameState.warlocksOwned >= this.typeAmount) {
                                this.complete = true;
                            }
                            break;
                    }
                    break;
                // Upgrade Quest - Check if the required upgrade has been purchased
                case static.QuestType.UPGRADE:
                    if (upgradeManager.upgrades[this.typeId].purchased) {
                        this.complete = true;
                    }
                    break;
            }

            return true;
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