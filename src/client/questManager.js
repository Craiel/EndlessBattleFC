declare("QuestManager", function () {
    include('Component');
    include('GameState');
    include('Quest');
    include('Resources');
    include('Static');
    include('CoreUtils');

    QuestManager.prototype = component.create();
    QuestManager.prototype.$super = parent;
    QuestManager.prototype.constructor = QuestManager;

    function QuestManager() {
        this.id = "QuestManager";

        this.quests = new Array();
        this.selectedQuest = 0;

        this.addQuest = function(quest) {
            this.quests.push(quest);
            //game.displayAlert("New quest received!");
            include('UserInterface').glowQuestsButton();

            // Create the quest entry in the quest window for this quest
            var newDiv = document.createElement('div');
            newDiv.id = 'questName' + quest.displayId;
            newDiv.className = 'questName';
            var id = quest.displayId - 1;
            newDiv.onmousedown = function () {
                questNameClick(id);
            }
            newDiv.innerHTML = quest.name;
            var container = document.getElementById("questNamesArea");
            container.appendChild(newDiv);

            $("#questNamesArea").show();
            $("#questTextArea").show();
        }

        // Go through every quest and update it
        // If the quest is now complete, grant the reward and remove it
        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            for (var x = this.quests.length - 1; x >= 0; x--) {
                this.quests[x].update(gameTime);
                if (this.quests[x].complete) {
                    this.quests[x].grantReward();
                    this.removeQuest(x);
                    game.stats.questsCompleted++;
                }
            }

            return true;
        }

        this.stopGlowingQuestsButton = function() {
            this.questsButtonGlowing = false;
            $("#questsWindowButtonGlow").stop(true);
            $("#questsWindowButtonGlow").css('opacity', 0);
            $("#questsWindowButtonGlow").css('background', coreUtils.getImageUrl(resources.ImageWindowButtons) + ' 78px 195px');
        }

        // Go through every quest and if it is a kill quest and the level required is equal to this one; increase the kill count
        this.updateKillCounts = function(level) {
            for (var x = 0; x < this.quests.length; x++) {
                if (this.quests[x].type == static.QuestType.KILL && this.quests[x].typeId == level) {
                    this.quests[x].killCount++;
                }
            }
        }

        this.removeQuest = function(id) {
            // Remove the quest and calculate the display id it had
            this.quests.splice(id, 1);
            var displayId = id + 1;

            // Update all the quests with their new ids and change the names in the quest window
            for (var x = id; x < this.quests.length; x++) {
                this.quests[x].displayId--;

                var element = document.getElementById("questName" + (x + 1));
                element.innerHTML = this.quests[x].name;
            }

            // Remove the last element as it is no longer used
            currentElement = document.getElementById('questName' + (this.quests.length + 1));
            currentElement.parentNode.removeChild(currentElement);

            // Reset the selected quest if the currently selected one is this one
            if (this.selectedQuest == id) {
                this.selectedQuest = 0;

                // If there are no quests then hide the current quest text
                $("#questTextArea").hide();
            }
        }

        this.getSelectedQuest = function() {
            if (this.quests.length >= 0) {
                return this.quests[this.selectedQuest];
            }
            else {
                return null;
            }
        }

        this.createQuest = function(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward)
        {
            var result = quest.create(name, description, type, typeId, typeAmount, goldReward, expReward, buffReward);
            result.displayId = this.quests.length + 1;
            result.init();
            return result;
        }

        this.save = function() {
            localStorage.questsManagerSaved = true;

            var questNames = new Array();
            var questDescriptions = new Array();
            var questTypes = new Array();
            var questTypeIds = new Array();
            var questTypeAmounts = new Array();
            var questGoldRewards = new Array();
            var questExpRewards = new Array();
            var questBuffRewards = new Array();

            for (var x = 0; x < this.quests.length; x++) {
                questNames.push(this.quests[x].name);
                questDescriptions.push(this.quests[x].description);
                questTypes.push(this.quests[x].type);
                questTypeIds.push(this.quests[x].typeId);
                questTypeAmounts.push(this.quests[x].typeAmount);
                questGoldRewards.push(this.quests[x].goldReward);
                questExpRewards.push(this.quests[x].expReward);
                questBuffRewards.push(this.quests[x].buffReward);
            }

            localStorage.setItem("questNames", JSON.stringify(questNames));
            localStorage.setItem("questDescriptions", JSON.stringify(questDescriptions));
            localStorage.setItem("questTypes", JSON.stringify(questTypes));
            localStorage.setItem("questTypeIds", JSON.stringify(questTypeIds));
            localStorage.setItem("questTypeAmounts", JSON.stringify(questTypeAmounts));
            localStorage.setItem("questGoldRewards", JSON.stringify(questGoldRewards));
            localStorage.setItem("questExpRewards", JSON.stringify(questExpRewards));
            localStorage.setItem("questBuffRewards", JSON.stringify(questBuffRewards));
        }

        this.load = function() {
            if (localStorage.questsManagerSaved != null) {
                var questNames = JSON.parse(localStorage.getItem("questNames"));
                var questDescriptions = JSON.parse(localStorage.getItem("questDescriptions"));
                var questTypes = JSON.parse(localStorage.getItem("questTypes"));
                var questTypeIds = JSON.parse(localStorage.getItem("questTypeIds"));
                var questTypeAmounts = JSON.parse(localStorage.getItem("questTypeAmounts"));
                var questGoldRewards = JSON.parse(localStorage.getItem("questGoldRewards"));
                var questExpRewards = JSON.parse(localStorage.getItem("questExpRewards"));
                var questBuffRewards = JSON.parse(localStorage.getItem("questBuffRewards"));

                if (questBuffRewards == null) {
                    for (var x = 0; x < questNames.length; x++) {
                            this.addQuest(this.createQuest(questNames[x], questDescriptions[x], questTypes[x], questTypeIds[x], questTypeAmounts[x], questGoldRewards[x], questExpRewards[x], null));
                    }
                }
                else {
                    for (var x = 0; x < questNames.length; x++) {
                        this.addQuest(this.createQuest(questNames[x], questDescriptions[x], questTypes[x], questTypeIds[x], questTypeAmounts[x], questGoldRewards[x], questExpRewards[x], null));
                    }
                }
            }
        }
    }

    return new QuestManager();
});