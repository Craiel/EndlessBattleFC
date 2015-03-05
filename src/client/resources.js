declare('Resources', function() {
	include('Static');
	include('Component');

	Resources.prototype = component.create();
    Resources.prototype.$super = parent;
    Resources.prototype.constructor = Resources;
    
    function Resources() {
        this.id = 'Resources';
        
        this.componentInit = this.init;

        // ---------------------------------------------------------------------------
    	// component functions
    	// ---------------------------------------------------------------------------	
        this.init = function() {
        	this.componentInit();

            this.ImageNull = static.imageRoot + "NULL.png";
            this.ImageDefaultBackground = static.imageRoot + "background.png";
            this.ImageButton = static.imageRoot + "buttonLong_blue.png";
            this.ImageButtonPressed = static.imageRoot + "buttonLong_blue_pressed.png";
            this.ImageButtonHover = static.imageRoot + "buttonLong_blue_hover.png";
            this.ImageAttackButtons = static.imageRoot + "attackButtons.png";
            this.ImageStoneButtons = static.imageRoot + "stoneButton1.png";
            this.ImageBattleLevelButton = static.imageRoot + "battleLevelButton.png";
            this.ImageBuffIcons = static.imageRoot + "buffIcons.png";
            this.ImageItemSheet3 = static.imageRoot + "itemSheet3.png";
            this.ImageWindowButtons = static.imageRoot + "windowButtons.png";
            this.ImageBigIcons = static.imageRoot + "bigIcons.png";
            this.ImageBuyButtonBase = static.imageRoot + "buyButtonBase.png";
            this.ImageCloseButton = static.imageRoot + "closeButton.png";
            this.ImageIconGlobe = static.imageRoot + "iconGlobe.png";
            this.ImageIconCoin = static.imageRoot + "iconCoin.png";
            this.ImageIconXp = static.imageRoot + "iconXp.png";
            this.ImageIconSkull = static.imageRoot + "iconSkull.png";
            this.ImageIconAttack = static.imageRoot + "iconAttack.png";
            this.ImageIconBackpack = static.imageRoot + "iconBackpack.png";
            this.ImageIconBackpackHover = static.imageRoot + "iconBackpackHover.png";
            this.ImageIconQuest = static.imageRoot + "iconQuest.png";
            this.ImageIconQuestHover = static.imageRoot + "iconQuestHover.png";
            this.ImageIconCharacter = static.imageRoot + "iconCharacter.png";
            this.ImageIconCharacterHover = static.imageRoot + "iconCharacterHover.png";
            this.ImageIconUpgrade = static.imageRoot + "iconUpgrade.png";
            this.ImageIconUpgradeHover = static.imageRoot + "iconUpgradeHover.png";
            this.ImageIconMercenary = static.imageRoot + "iconMercenary.png";
            this.ImageIconMercenaryHover = static.imageRoot + "iconMercenaryHover.png";
            this.ImageIconClose = static.imageRoot + "iconClose.png";
            this.ImageIconCloseHover = static.imageRoot + "iconCloseHover.png";
            this.ImageResurrectionBar = static.imageRoot + "resurrectionBar.png";
            this.ImageMonsterHealthBar = static.imageRoot + "monsterHealthBar.png";

            // Panel images
            this.ImagePanelBeigeLT = static.imageRoot + "panelBeigeLT.png";
            this.ImagePanelBeigeT = static.imageRoot + "panelBeigeT.png";
            this.ImagePanelBeigeRT = static.imageRoot + "panelBeigeRT.png";
            this.ImagePanelBeigeL = static.imageRoot + "panelBeigeL.png";
            this.ImagePanelBeigeContent = static.imageRoot + "panelBeigeContent.png";
            this.ImagePanelBeigeR = static.imageRoot + "panelBeigeR.png";
            this.ImagePanelBeigeLB = static.imageRoot + "panelBeigeLB.png";
            this.ImagePanelBeigeB = static.imageRoot + "panelBeigeB.png";
            this.ImagePanelBeigeRB = static.imageRoot + "panelBeigeRB.png";

            this.ImagePanelBeigeInsetLT = static.imageRoot + "panelBeigeInsetLT.png";
            this.ImagePanelBeigeInsetT = static.imageRoot + "panelBeigeInsetT.png";
            this.ImagePanelBeigeInsetRT = static.imageRoot + "panelBeigeInsetRT.png";
            this.ImagePanelBeigeInsetL = static.imageRoot + "panelBeigeInsetL.png";
            this.ImagePanelBeigeInsetContent = static.imageRoot + "panelBeigeInsetContent.png";
            this.ImagePanelBeigeInsetR = static.imageRoot + "panelBeigeInsetR.png";
            this.ImagePanelBeigeInsetLB = static.imageRoot + "panelBeigeInsetLB.png";
            this.ImagePanelBeigeInsetB = static.imageRoot + "panelBeigeInsetB.png";
            this.ImagePanelBeigeInsetRB = static.imageRoot + "panelBeigeInsetRB.png";

            this.ImagePanelBeigeLightInsetLT = static.imageRoot + "panelBeigeLightInsetLT.png";
            this.ImagePanelBeigeLightInsetT = static.imageRoot + "panelBeigeLightInsetT.png";
            this.ImagePanelBeigeLightInsetRT = static.imageRoot + "panelBeigeLightInsetRT.png";
            this.ImagePanelBeigeLightInsetL = static.imageRoot + "panelBeigeLightInsetL.png";
            this.ImagePanelBeigeLightInsetContent = static.imageRoot + "panelBeigeLightInsetContent.png";
            this.ImagePanelBeigeLightInsetR = static.imageRoot + "panelBeigeLightInsetR.png";
            this.ImagePanelBeigeLightInsetLB = static.imageRoot + "panelBeigeLightInsetLB.png";
            this.ImagePanelBeigeLightInsetB = static.imageRoot + "panelBeigeLightInsetB.png";
            this.ImagePanelBeigeLightInsetRB = static.imageRoot + "panelBeigeLightInsetRB.png";

            this.ImagePanelBrownLT = static.imageRoot + "panelBrownLT.png";
            this.ImagePanelBrownT = static.imageRoot + "panelBrownT.png";
            this.ImagePanelBrownRT = static.imageRoot + "panelBrownRT.png";
            this.ImagePanelBrownL = static.imageRoot + "panelBrownL.png";
            this.ImagePanelBrownContent = static.imageRoot + "panelBrownContent.png";
            this.ImagePanelBrownR = static.imageRoot + "panelBrownR.png";
            this.ImagePanelBrownLB = static.imageRoot + "panelBrownLB.png";
            this.ImagePanelBrownB = static.imageRoot + "panelBrownB.png";
            this.ImagePanelBrownRB = static.imageRoot + "panelBrownRB.png";

            // Progress bar images
            this.ImageProgressBlueHorizontalLeft = static.imageRoot + "barBlue_horizontalLeft.png";
            this.ImageProgressBlueHorizontalMid = static.imageRoot + "barBlue_horizontalMid.png";
            this.ImageProgressBlueHorizontalRight = static.imageRoot + "barBlue_horizontalRight.png";
            this.ImageProgressGreenHorizontalLeft = static.imageRoot + "barGreen_horizontalLeft.png";
            this.ImageProgressGreenHorizontalMid = static.imageRoot + "barGreen_horizontalMid.png";
            this.ImageProgressGreenHorizontalRight = static.imageRoot + "barGreen_horizontalRight.png";
            this.ImageProgressRedHorizontalLeft = static.imageRoot + "barRed_horizontalLeft.png";
            this.ImageProgressRedHorizontalMid = static.imageRoot + "barRed_horizontalMid.png";
            this.ImageProgressRedHorizontalRight = static.imageRoot + "barRed_horizontalRight.png";
            this.ImageProgressYellowHorizontalLeft = static.imageRoot + "barYellow_horizontalLeft.png";
            this.ImageProgressYellowHorizontalMid = static.imageRoot + "barYellow_horizontalMid.png";
            this.ImageProgressYellowHorizontalRight = static.imageRoot + "barYellow_horizontalRight.png";
            this.ImageProgressPurpleHorizontalLeft = static.imageRoot + "barPurple_horizontalLeft.png";
            this.ImageProgressPurpleHorizontalMid = static.imageRoot + "barPurple_horizontalMid.png";
            this.ImageProgressPurpleHorizontalRight = static.imageRoot + "barPurple_horizontalRight.png";
            this.ImageProgressBackHorizontalLeft = static.imageRoot + "barBack_horizontalLeft.png";
            this.ImageProgressBackHorizontalMid = static.imageRoot + "barBack_horizontalMid.png";
            this.ImageProgressBackHorizontalRight = static.imageRoot + "barBack_horizontalRight.png";
        };
    };
    
    return new Resources();
});

