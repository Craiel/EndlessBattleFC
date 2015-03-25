declare('Resources', function() {
	include('StaticData');
	include('Component');

	Resources.prototype = component.prototype();
    Resources.prototype.$super = parent;
    Resources.prototype.constructor = Resources;
    
    function Resources() {
        component.construct(this);

        this.id = 'Resources';
    };

    // ---------------------------------------------------------------------------
    // component functions
    // ---------------------------------------------------------------------------
    Resources.prototype.componentInit = Resources.prototype.init;
    Resources.prototype.init = function() {
        this.componentInit();

        this.ImageNull = staticData.imageRoot + "NULL.png";
        this.ImagePlaceHolder = staticData.imageRoot + "placeHolder.png";
        this.ImageDefaultBackground = staticData.imageRoot + "background.png";
        this.ImageButton = staticData.imageRoot + "buttonLong_blue.png";
        this.ImageButtonPressed = staticData.imageRoot + "buttonLong_blue_pressed.png";
        this.ImageButtonHover = staticData.imageRoot + "buttonLong_blue_hover.png";
        this.ImageAttackButtons = staticData.imageRoot + "attackButtons.png";
        this.ImageStoneButtons = staticData.imageRoot + "stoneButton1.png";
        this.ImageBattleLevelButton = staticData.imageRoot + "battleLevelButton.png";
        this.ImageBuffIcons = staticData.imageRoot + "buffIcons.png";
        this.ImageItemSheet3 = staticData.imageRoot + "itemSheet3.png";
        this.ImageWindowButtons = staticData.imageRoot + "windowButtons.png";
        this.ImageBigIcons = staticData.imageRoot + "bigIcons.png";
        this.ImageBuyButtonBase = staticData.imageRoot + "buyButtonBase.png";
        this.ImageCloseButton = staticData.imageRoot + "closeButton.png";
        this.ImageIconGlobe = staticData.imageRoot + "iconGlobe.png";
        this.ImageIconCoin = staticData.imageRoot + "iconGoldCoin.png";
        this.ImageIconXp = staticData.imageRoot + "iconXp.png";
        this.ImageIconSkull = staticData.imageRoot + "iconSkull.png";
        this.ImageIconAttack = staticData.imageRoot + "iconAttack.png";
        this.ImageIconBackpack = staticData.imageRoot + "iconBackpack.png";
        this.ImageIconBackpackHover = staticData.imageRoot + "iconBackpackHover.png";
        this.ImageIconQuest = staticData.imageRoot + "iconQuest.png";
        this.ImageIconQuestHover = staticData.imageRoot + "iconQuestHover.png";
        this.ImageIconCharacter = staticData.imageRoot + "iconCharacter.png";
        this.ImageIconCharacterHover = staticData.imageRoot + "iconCharacterHover.png";
        this.ImageIconUpgrade = staticData.imageRoot + "iconUpgrade.png";
        this.ImageIconUpgradeHover = staticData.imageRoot + "iconUpgradeHover.png";
        this.ImageIconMercenary = staticData.imageRoot + "iconMercenary.png";
        this.ImageIconMercenaryHover = staticData.imageRoot + "iconMercenaryHover.png";
        this.ImageIconClose = staticData.imageRoot + "iconClose.png";
        this.ImageIconCloseHover = staticData.imageRoot + "iconCloseHover.png";
        this.ImageIconPlus = staticData.imageRoot + "iconPlus_Blue.png";
        this.ImageResurrectionBar = staticData.imageRoot + "resurrectionBar.png";
        this.ImageMonsterHealthBar = staticData.imageRoot + "monsterHealthBar.png";

        // Armor Images
        this.ImageArmorDefault_head = this.ImagePlaceHolder;
        this.ImageArmorDefault_chest = this.ImagePlaceHolder;
        this.ImageArmorDefault_waist = this.ImagePlaceHolder;
        this.ImageArmorDefault_legs = this.ImagePlaceHolder;
        this.ImageArmorDefault_feet = this.ImagePlaceHolder;
        this.ImageArmorDefault_shoulder = this.ImagePlaceHolder;
        this.ImageArmorDefault_wrist = this.ImagePlaceHolder;
        this.ImageArmorDefault_hand = this.ImagePlaceHolder;
        this.ImageArmorDefault_neck = this.ImagePlaceHolder;
        this.ImageArmorDefault_ring = this.ImagePlaceHolder;
        this.ImageArmorDefault_trinket = this.ImagePlaceHolder;

         // Weapon Items
        this.ImageWeaponDefault_dagger = this.ImagePlaceHolder;
        this.ImageWeaponDefault_sword = this.ImagePlaceHolder;
        this.ImageWeaponDefault_sword2h = this.ImagePlaceHolder;
        this.ImageWeaponDefault_mace = this.ImagePlaceHolder;
        this.ImageWeaponDefault_mace2h = this.ImagePlaceHolder;
        this.ImageWeaponDefault_axe = this.ImagePlaceHolder;
        this.ImageWeaponDefault_axe2h = this.ImagePlaceHolder;
        this.ImageWeaponDefault_spear = this.ImagePlaceHolder;
        this.ImageWeaponDefault_staff = this.ImagePlaceHolder;
        this.ImageWeaponDefault_wand = this.ImagePlaceHolder;
        this.ImageWeaponDefault_bow = this.ImagePlaceHolder;
        this.ImageWeaponDefault_crossbow = this.ImagePlaceHolder;
        this.ImageWeaponDefault_shield = this.ImagePlaceHolder;
        this.ImageWeaponDefault_orb = this.ImagePlaceHolder;

         // Panel images
        this.ImagePanelBeigeLT = staticData.imageRoot + "panelBeigeLT.png";
        this.ImagePanelBeigeT = staticData.imageRoot + "panelBeigeT.png";
        this.ImagePanelBeigeRT = staticData.imageRoot + "panelBeigeRT.png";
        this.ImagePanelBeigeL = staticData.imageRoot + "panelBeigeL.png";
        this.ImagePanelBeigeContent = staticData.imageRoot + "panelBeigeContent.png";
        this.ImagePanelBeigeR = staticData.imageRoot + "panelBeigeR.png";
        this.ImagePanelBeigeLB = staticData.imageRoot + "panelBeigeLB.png";
        this.ImagePanelBeigeB = staticData.imageRoot + "panelBeigeB.png";
        this.ImagePanelBeigeRB = staticData.imageRoot + "panelBeigeRB.png";

        this.ImagePanelBeigeInsetLT = staticData.imageRoot + "panelBeigeInsetLT.png";
        this.ImagePanelBeigeInsetT = staticData.imageRoot + "panelBeigeInsetT.png";
        this.ImagePanelBeigeInsetRT = staticData.imageRoot + "panelBeigeInsetRT.png";
        this.ImagePanelBeigeInsetL = staticData.imageRoot + "panelBeigeInsetL.png";
        this.ImagePanelBeigeInsetContent = staticData.imageRoot + "panelBeigeInsetContent.png";
        this.ImagePanelBeigeInsetR = staticData.imageRoot + "panelBeigeInsetR.png";
        this.ImagePanelBeigeInsetLB = staticData.imageRoot + "panelBeigeInsetLB.png";
        this.ImagePanelBeigeInsetB = staticData.imageRoot + "panelBeigeInsetB.png";
        this.ImagePanelBeigeInsetRB = staticData.imageRoot + "panelBeigeInsetRB.png";

        this.ImagePanelBeigeLightLT = staticData.imageRoot + "panelBeigeLightLT.png";
        this.ImagePanelBeigeLightT = staticData.imageRoot + "panelBeigeLightT.png";
        this.ImagePanelBeigeLightRT = staticData.imageRoot + "panelBeigeLightRT.png";
        this.ImagePanelBeigeLightL = staticData.imageRoot + "panelBeigeLightL.png";
        this.ImagePanelBeigeLightContent = staticData.imageRoot + "panelBeigeLightContent.png";
        this.ImagePanelBeigeLightR = staticData.imageRoot + "panelBeigeLightR.png";
        this.ImagePanelBeigeLightLB = staticData.imageRoot + "panelBeigeLightLB.png";
        this.ImagePanelBeigeLightB = staticData.imageRoot + "panelBeigeLightB.png";
        this.ImagePanelBeigeLightRB = staticData.imageRoot + "panelBeigeLightRB.png";

        this.ImagePanelBeigeLightInsetLT = staticData.imageRoot + "panelBeigeLightInsetLT.png";
        this.ImagePanelBeigeLightInsetT = staticData.imageRoot + "panelBeigeLightInsetT.png";
        this.ImagePanelBeigeLightInsetRT = staticData.imageRoot + "panelBeigeLightInsetRT.png";
        this.ImagePanelBeigeLightInsetL = staticData.imageRoot + "panelBeigeLightInsetL.png";
        this.ImagePanelBeigeLightInsetContent = staticData.imageRoot + "panelBeigeLightInsetContent.png";
        this.ImagePanelBeigeLightInsetR = staticData.imageRoot + "panelBeigeLightInsetR.png";
        this.ImagePanelBeigeLightInsetLB = staticData.imageRoot + "panelBeigeLightInsetLB.png";
        this.ImagePanelBeigeLightInsetB = staticData.imageRoot + "panelBeigeLightInsetB.png";
        this.ImagePanelBeigeLightInsetRB = staticData.imageRoot + "panelBeigeLightInsetRB.png";

        this.ImagePanelBrownLT = staticData.imageRoot + "panelBrownLT.png";
        this.ImagePanelBrownT = staticData.imageRoot + "panelBrownT.png";
        this.ImagePanelBrownRT = staticData.imageRoot + "panelBrownRT.png";
        this.ImagePanelBrownL = staticData.imageRoot + "panelBrownL.png";
        this.ImagePanelBrownContent = staticData.imageRoot + "panelBrownContent.png";
        this.ImagePanelBrownR = staticData.imageRoot + "panelBrownR.png";
        this.ImagePanelBrownLB = staticData.imageRoot + "panelBrownLB.png";
        this.ImagePanelBrownB = staticData.imageRoot + "panelBrownB.png";
        this.ImagePanelBrownRB = staticData.imageRoot + "panelBrownRB.png";

        this.ImagePanelBlueLT = staticData.imageRoot + "panelBlueLT.png";
        this.ImagePanelBlueT = staticData.imageRoot + "panelBlueT.png";
        this.ImagePanelBlueRT = staticData.imageRoot + "panelBlueRT.png";
        this.ImagePanelBlueL = staticData.imageRoot + "panelBlueL.png";
        this.ImagePanelBlueContent = staticData.imageRoot + "panelBlueContent.png";
        this.ImagePanelBlueR = staticData.imageRoot + "panelBlueR.png";
        this.ImagePanelBlueLB = staticData.imageRoot + "panelBlueLB.png";
        this.ImagePanelBlueB = staticData.imageRoot + "panelBlueB.png";
        this.ImagePanelBlueRB = staticData.imageRoot + "panelBlueRB.png";

        this.ImagePanelBlueInsetLT = staticData.imageRoot + "panelBlueInsetLT.png";
        this.ImagePanelBlueInsetT = staticData.imageRoot + "panelBlueInsetT.png";
        this.ImagePanelBlueInsetRT = staticData.imageRoot + "panelBlueInsetRT.png";
        this.ImagePanelBlueInsetL = staticData.imageRoot + "panelBlueInsetL.png";
        this.ImagePanelBlueInsetContent = staticData.imageRoot + "panelBlueInsetContent.png";
        this.ImagePanelBlueInsetR = staticData.imageRoot + "panelBlueInsetR.png";
        this.ImagePanelBlueInsetLB = staticData.imageRoot + "panelBlueInsetLB.png";
        this.ImagePanelBlueInsetB = staticData.imageRoot + "panelBlueInsetB.png";
        this.ImagePanelBlueInsetRB = staticData.imageRoot + "panelBlueInsetRB.png";

        this.ImagePanelTooltipLT = staticData.imageRoot + "panelTooltipLT.png";
        this.ImagePanelTooltipT = staticData.imageRoot + "panelTooltipT.png";
        this.ImagePanelTooltipRT = staticData.imageRoot + "panelTooltipRT.png";
        this.ImagePanelTooltipL = staticData.imageRoot + "panelTooltipL.png";
        this.ImagePanelTooltipContent = staticData.imageRoot + "panelTooltipContent.png";
        this.ImagePanelTooltipR = staticData.imageRoot + "panelTooltipR.png";
        this.ImagePanelTooltipLB = staticData.imageRoot + "panelTooltipLB.png";
        this.ImagePanelTooltipB = staticData.imageRoot + "panelTooltipB.png";
        this.ImagePanelTooltipRB = staticData.imageRoot + "panelTooltipRB.png";

        // Progress bar images
        this.ImageProgressBlueHorizontalLeft = staticData.imageRoot + "barBlue_horizontalLeft.png";
        this.ImageProgressBlueHorizontalMid = staticData.imageRoot + "barBlue_horizontalMid.png";
        this.ImageProgressBlueHorizontalRight = staticData.imageRoot + "barBlue_horizontalRight.png";
        this.ImageProgressGreenHorizontalLeft = staticData.imageRoot + "barGreen_horizontalLeft.png";
        this.ImageProgressGreenHorizontalMid = staticData.imageRoot + "barGreen_horizontalMid.png";
        this.ImageProgressGreenHorizontalRight = staticData.imageRoot + "barGreen_horizontalRight.png";
        this.ImageProgressRedHorizontalLeft = staticData.imageRoot + "barRed_horizontalLeft.png";
        this.ImageProgressRedHorizontalMid = staticData.imageRoot + "barRed_horizontalMid.png";
        this.ImageProgressRedHorizontalRight = staticData.imageRoot + "barRed_horizontalRight.png";
        this.ImageProgressYellowHorizontalLeft = staticData.imageRoot + "barYellow_horizontalLeft.png";
        this.ImageProgressYellowHorizontalMid = staticData.imageRoot + "barYellow_horizontalMid.png";
        this.ImageProgressYellowHorizontalRight = staticData.imageRoot + "barYellow_horizontalRight.png";
        this.ImageProgressPurpleHorizontalLeft = staticData.imageRoot + "barPurple_horizontalLeft.png";
        this.ImageProgressPurpleHorizontalMid = staticData.imageRoot + "barPurple_horizontalMid.png";
        this.ImageProgressPurpleHorizontalRight = staticData.imageRoot + "barPurple_horizontalRight.png";
        this.ImageProgressBackHorizontalLeft = staticData.imageRoot + "barBack_horizontalLeft.png";
        this.ImageProgressBackHorizontalMid = staticData.imageRoot + "barBack_horizontalMid.png";
        this.ImageProgressBackHorizontalRight = staticData.imageRoot + "barBack_horizontalRight.png";
    };

    // Helper function for panels
    Resources.prototype.setPanelImages = function(panel, imageKey) {
        panel.setImages(this['ImagePanel'+imageKey+'LT'], this['ImagePanel'+imageKey+'T'], this['ImagePanel'+imageKey+'RT'],
            this['ImagePanel'+imageKey+'L'], this['ImagePanel'+imageKey+'Content'], this['ImagePanel'+imageKey+'R'],
            this['ImagePanel'+imageKey+'LB'], this['ImagePanel'+imageKey+'B'], this['ImagePanel'+imageKey+'RB']);
    }
    
    return new Resources();
});

