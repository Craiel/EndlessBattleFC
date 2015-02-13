declare("TutorialManager", function () {
    include('Component');
    include('QuestManager');
    include('GameState');

    TutorialManager.prototype = component.create();
    TutorialManager.prototype.$super = parent;
    TutorialManager.prototype.constructor = TutorialManager;

    function TutorialManager() {
        this.id = "TutorialManager";

        this.currentTutorial = 0;
        // If each of the tutorials have had the continue button pressed
        this.tutorialContinued = new Array();
        this.tutorialsAmount = 12;

        for (var x = 0; x < this.tutorialsAmount; x++) {
            this.tutorialContinued.push(false);
        }

        this.tutorialDescriptions = new Array(
            "Welcome to Endless Battle, to get started click the enter battle button.",
            "Entering battle will engage you with a random monster. If your current opponent is too strong, you can leave the battle and enter again. Let's get started with some combat, use your Attack ability to kill the monster.",
            "Well fought, keep killing monsters until you reach level 2.",
            "Congratulations! When you level up you get to choose a random upgrade. Click the level up button and choose an upgrade.",
            "Click the Leave Battle button so we can continue.",
            "When out of battle, you can increase the level of the monsters you will fight. However you can only fight monsters lower than or equal to your own level.",
            "It's time for your first quest. Open the quests window and complete that quest, then we shall continue.",
            "You've killed quite a few monsters now, open your inventory and see if you've gathered any loot.",
            "When you equip your loot you can view your stats and equipment here.",
            "Killing monsters for gold is good, but if you really want to get rich you should hire mercenaries. I've given you a new quest, purchase 5 footmen and then we'll continue.",
            "Mercenaries are good, but to make them more worth their money you can purchase upgrades. It's time for another quest, get a total of 10 Footmen to unlock the Footman Training upgrade and then purchase it.",
            "Well done! You're off to a great start, but there's dangerous monsters, powerful loot and riches ahead. This concludes the tutorial, good luck!");

        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[0];
            $("#tutorialContinueButton").hide();

            // Animate the quest arrows
            this.animateRightArrow();

            $("#tutorialArea").css('left', '0');
            $("#tutorialArea").css('right', '0');
            $("#tutorialArea").css('top', '0');
            $("#tutorialArea").css('bottom', '0');
            $("#tutorialArea").css('margin', 'auto');
            $("#tutorialArea").css('padding-right', '660px');
            $("#tutorialArea").css('padding-bottom', '50px');
            $("#tutorialArea").show();

            $("#tutorialRightArrow").stop(true);
            $("#tutorialRightArrow").css('left', '290px');
            $("#tutorialRightArrow").css('top', '67px');
            this.animateRightArrow();
        }

        this.animateRightArrow = function() {
            $("#tutorialRightArrow").animate({left: '+=20px'}, 400);
            $("#tutorialRightArrow").animate({left: '-=20px'}, 400, function () {
                include("TutorialManager");
                tutorialManager.animateRightArrow();
            });
        }

        this.advanceTutorial = function() {
            this.currentTutorial++;
            if (this.currentTutorial < this.tutorialsAmount) {
                document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
            }
            $("#tutorialWindow").show();
            $("#tutorialRightArrow").show();
        }

        this.continueTutorial = function() {
            this.tutorialContinued[this.currentTutorial] = true;
            this.hideTutorial();
        }

        this.hideTutorial = function() {
            $("#tutorialWindow").hide();
            $("#tutorialRightArrow").hide();
        }

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return;
            }

            // Check the requirements of the current tutorial, if it is completed then start the next tutorial
            switch (this.currentTutorial) {
                case 0:
                    if (gameState.battleButtonClicked) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                    }
                    break;
                case 1:
                    if (gameState.monsterKilled) {
                        this.advanceTutorial();
                        $("#expBarArea").show();
                    }
                    break;
                case 2:
                    if (game.player.level >= 2) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '');
                        $("#tutorialArea").css('bottom', '-40px');
                    }
                    break;
                case 3:
                    if (gameState.statUpgradeChosen) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '97px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '0');
                        $("#tutorialArea").css('bottom', '0');
                    }
                    break;
                case 4:
                    if (gameState.leaveBattleButtonPressed) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        $("#tutorialRightArrow").css('z-index', '3');
                        this.animateRightArrow();
                        $("#tutorialArea").css('padding-right', '200px');
                        $("#tutorialArea").css('z-index', '');
                        $("#tutorialWindow").css('z-index', '3');
                        $("#tutorialContinueButton").show();
                    }
                case 5://
                    if (this.tutorialContinued[5]) {
                        this.advanceTutorial();
                        questManager.addQuest(new Quest("A Beginner's Task", "It's time for your first quest as well as more combat experience. Increase the battle level and slay a level 2 monster and the tutorial will continue.", QuestType.KILL, 2, 1, 5, 5, null));
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '55px');
                        $("#tutorialArea").css('bottom', '');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#tutorialContinueButton").hide();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                    }
                case 6://
                    if (this.quest1Complete) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").show();
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '');
                        $("#tutorialArea").css('bottom', '5px');
                        $("#tutorialArea").css('padding-bottom', '');
                        $(".inventoryWindowButton").show();
                    }
                    break;
                case 7://
                    if (this.inventoryOpened) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '0px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '5px');
                        $("#tutorialArea").css('bottom', '');
                        $(".characterWindowButton").show();
                    }
                    break;
                case 8://
                    if (this.equipmentOpened) {
                        this.advanceTutorial();
                        questManager.addQuest(new Quest("A Helping Hand", "You've slain monsters, but if you really want a lot of gold you'll need to hire mercenaries to help you. Hire 5 Footmen to continue the tutorial.", QuestType.MERCENARIES, 0, 5, 10, 10, null));
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '38px');
                        this.animateRightArrow();
                        $(".mercenariesWindowButton").show();
                    }
                    break;
                case 9:
                    if (this.quest2Complete) {
                        this.advanceTutorial();
                        questManager.addQuest(new Quest("Strengthening your Forces", "Purchasing those footmen is a good start, but they can get pricey. To negate this inflation you'll need to upgrade them. Hire a total of 10 Footmen and then buy the Footman Training upgrade.", QuestType.UPGRADE, 0, 0, 50, 50, null));
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '14px');
                        $(".upgradesWindowButton").show();
                        $("#upgradesWindowButtonGlow").show();
                    }
                    break;
                case 10:
                    if (this.quest3Complete) {
                        this.advanceTutorial();
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").hide();
                        $("#tutorialArea").css('left', '0');
                        $("#tutorialArea").css('right', '0');
                        $("#tutorialArea").css('top', '0');
                        $("#tutorialArea").css('bottom', '0');
                        $("#tutorialArea").css('margin', 'auto');
                        $("#tutorialArea").css('padding-right', '660px');
                        $("#tutorialArea").css('padding-bottom', '50px');
                        $("#tutorialContinueButton").show();
                    }
                    break;
            }
        }

        this.save = function() {
            localStorage.tutorialSaved = true;
            localStorage.currentTutorial = this.currentTutorial;
        }

        this.load = function() {
            if (localStorage.tutorialSaved != null) {
                this.currentTutorial = parseInt(localStorage.currentTutorial);

                switch (this.currentTutorial) {
                    case 0:
                        break;
                    case 1:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 2:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        $("#expBarArea").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 3://
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '');
                        $("#tutorialArea").css('bottom', '-40px');
                        $("#expBarArea").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 4:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '97px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('top', '0');
                        $("#tutorialArea").css('bottom', '0');
                        $("#expBarArea").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 5:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        $("#tutorialRightArrow").css('z-index', '3');
                        this.animateRightArrow();
                        $("#tutorialArea").css('padding-right', '200px');
                        $("#tutorialWindow").css('z-index', '3');
                        $("#tutorialContinueButton").show();
                        $("#expBarArea").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 6:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '55px');
                        $("#tutorialArea").css('bottom', '');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 7://
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").show();
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '137px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '');
                        $("#tutorialArea").css('bottom', '5px');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#tutorialArea").css('padding-bottom', '');
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        $(".inventoryWindowButton").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 8://
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '0px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '5px');
                        $("#tutorialArea").css('bottom', '');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#tutorialArea").css('padding-bottom', '');
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        $(".inventoryWindowButton").show();
                        $(".characterWindowButton").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 9:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '38px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '5px');
                        $("#tutorialArea").css('bottom', '');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#tutorialArea").css('padding-bottom', '');
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        $(".inventoryWindowButton").show();
                        $(".characterWindowButton").show();
                        $(".mercenariesWindowButton").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 10:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialRightArrow").css('left', '290px');
                        $("#tutorialRightArrow").css('top', '67px');
                        this.animateRightArrow();
                        $("#tutorialArea").css('left', '');
                        $("#tutorialArea").css('right', '50px');
                        $("#tutorialArea").css('top', '14px');
                        $("#tutorialArea").css('bottom', '');
                        $("#tutorialArea").css('margin', '');
                        $("#tutorialArea").css('padding-right', '');
                        $("#tutorialArea").css('padding-bottom', '');
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        $(".inventoryWindowButton").show();
                        $(".characterWindowButton").show();
                        $(".mercenariesWindowButton").show();
                        $(".upgradesWindowButton").show();
                        $("#upgradesWindowButtonGlow").show();
                        document.getElementById("tutorialDescription").innerHTML = this.tutorialDescriptions[this.currentTutorial];
                        break;
                    case 11:
                        $("#tutorialRightArrow").stop(true);
                        $("#tutorialArea").hide();
                        $("#expBarArea").show();
                        $(".questsWindowButton").show();
                        $("#questsWindowButtonGlow").show();
                        $(".inventoryWindowButton").show();
                        $(".characterWindowButton").show();
                        $(".mercenariesWindowButton").show();
                        $(".upgradesWindowButton").show();
                        $("#upgradesWindowButtonGlow").show();
                        break;
                }
            }
        }
    }

    return new TutorialManager();
});