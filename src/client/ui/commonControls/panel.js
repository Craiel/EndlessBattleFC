declare('Panel', function() {
    include('Assert');
    include('Element');
    include('CoreUtils');
    include('StaticData');

    Panel.prototype = element.prototype();
    Panel.prototype.$super = parent;
    Panel.prototype.constructor = Panel;

    function Panel(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("panel");

        this.styles = {};

        this.topLeftImage = undefined;
        this.topImage = undefined;
        this.topRightImage = undefined;
        this.leftImage = undefined;
        this.midImage = undefined;
        this.rightImage = undefined;
        this.bottomLeftImage = undefined;
        this.bottomImage = undefined;
        this.bottomRightImage = undefined;

        this.contentElement = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    Panel.prototype.elementInit = Panel.prototype.init;
    Panel.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        // Nothing to do here atm
        this.contentElement = element.create(this.id + 'Content');
        this.contentElement.init(this);
        this.addManagedChild(this.contentElement);

        this.loadDefaultStyles();
    };

    // ---------------------------------------------------------------------------
    // panel functions
    // ---------------------------------------------------------------------------
    Panel.prototype.setStyle = function(key) {
        assert.isDefined(this.styles[key], "Style does not exist: " + key);

        this.setImages(this.styles[key].LT, this.styles[key].T, this.styles[key].RT,
            this.styles[key].L, this.styles[key].Content, this.styles[key].R,
            this.styles[key].LB, this.styles[key].B, this.styles[key].RB);
    };

    Panel.prototype.setImages = function(topLeft, top, topRight, left, mid, right, bottomLeft, bottom, bottomRight) {
        this.topLeftImage = topLeft;
        this.topImage = top;
        this.topRightImage = topRight;
        this.leftImage = left;
        this.midImage = mid;
        this.rightImage = right;
        this.bottomLeftImage = bottomLeft;
        this.bottomImage = bottom;
        this.bottomRightImage = bottomRight;

        this._updateImages();
    };

    Panel.prototype.getContentArea = function() {
        return this.contentElement;
    };

    Panel.prototype.loadDefaultStyles = function() {
        this.styles.Beige = {};
        this.styles.Beige.LT = ResImg(interfacePanelBeigeLT);
        this.styles.Beige.T = ResImg(interfacePanelBeigeT);
        this.styles.Beige.RT = ResImg(interfacePanelBeigeRT);
        this.styles.Beige.L = ResImg(interfacePanelBeigeL);
        this.styles.Beige.Content = ResImg(interfacePanelBeigeContent);
        this.styles.Beige.R = ResImg(interfacePanelBeigeR);
        this.styles.Beige.LB = ResImg(interfacePanelBeigeLB);
        this.styles.Beige.B = ResImg(interfacePanelBeigeB);
        this.styles.Beige.RB = ResImg(interfacePanelBeigeRB);

        this.styles.BeigeInset = {};
        this.styles.BeigeInset.LT = ResImg(interfacePanelBeigeInsetLT);
        this.styles.BeigeInset.T = ResImg(interfacePanelBeigeInsetT);
        this.styles.BeigeInset.RT = ResImg(interfacePanelBeigeInsetRT);
        this.styles.BeigeInset.L = ResImg(interfacePanelBeigeInsetL);
        this.styles.BeigeInset.Content = ResImg(interfacePanelBeigeInsetContent);
        this.styles.BeigeInset.R = ResImg(interfacePanelBeigeInsetR);
        this.styles.BeigeInset.LB = ResImg(interfacePanelBeigeInsetLB);
        this.styles.BeigeInset.B = ResImg(interfacePanelBeigeInsetB);
        this.styles.BeigeInset.RB = ResImg(interfacePanelBeigeInsetRB);

        this.styles.BeigeLight = {};
        this.styles.BeigeLight.LT = ResImg(interfacePanelBeigeLightLT);
        this.styles.BeigeLight.T = ResImg(interfacePanelBeigeLightT);
        this.styles.BeigeLight.RT = ResImg(interfacePanelBeigeLightRT);
        this.styles.BeigeLight.L = ResImg(interfacePanelBeigeLightL);
        this.styles.BeigeLight.Content = ResImg(interfacePanelBeigeLightContent);
        this.styles.BeigeLight.R = ResImg(interfacePanelBeigeLightR);
        this.styles.BeigeLight.LB = ResImg(interfacePanelBeigeLightLB);
        this.styles.BeigeLight.B = ResImg(interfacePanelBeigeLightB);
        this.styles.BeigeLight.RB = ResImg(interfacePanelBeigeLightRB);

        this.styles.BeigeLightInset = {};
        this.styles.BeigeLightInset.LT = ResImg(interfacePanelBeigeLightInsetLT);
        this.styles.BeigeLightInset.T = ResImg(interfacePanelBeigeLightInsetT);
        this.styles.BeigeLightInset.RT = ResImg(interfacePanelBeigeLightInsetRT);
        this.styles.BeigeLightInset.L = ResImg(interfacePanelBeigeLightInsetL);
        this.styles.BeigeLightInset.Content = ResImg(interfacePanelBeigeLightInsetContent);
        this.styles.BeigeLightInset.R = ResImg(interfacePanelBeigeLightInsetR);
        this.styles.BeigeLightInset.LB = ResImg(interfacePanelBeigeLightInsetLB);
        this.styles.BeigeLightInset.B = ResImg(interfacePanelBeigeLightInsetB);
        this.styles.BeigeLightInset.RB = ResImg(interfacePanelBeigeLightInsetRB);

        this.styles.Blue = {};
        this.styles.Blue.LT = ResImg(interfacePanelBlueLT);
        this.styles.Blue.T = ResImg(interfacePanelBlueT);
        this.styles.Blue.RT = ResImg(interfacePanelBlueRT);
        this.styles.Blue.L = ResImg(interfacePanelBlueL);
        this.styles.Blue.Content = ResImg(interfacePanelBlueContent);
        this.styles.Blue.R = ResImg(interfacePanelBlueR);
        this.styles.Blue.LB = ResImg(interfacePanelBlueLB);
        this.styles.Blue.B = ResImg(interfacePanelBlueB);
        this.styles.Blue.RB = ResImg(interfacePanelBlueRB);

        this.styles.BlueInset = {};
        this.styles.BlueInset.LT = ResImg(interfacePanelBlueInsetLT);
        this.styles.BlueInset.T = ResImg(interfacePanelBlueInsetT);
        this.styles.BlueInset.RT = ResImg(interfacePanelBlueInsetRT);
        this.styles.BlueInset.L = ResImg(interfacePanelBlueInsetL);
        this.styles.BlueInset.Content = ResImg(interfacePanelBlueInsetContent);
        this.styles.BlueInset.R = ResImg(interfacePanelBlueInsetR);
        this.styles.BlueInset.LB = ResImg(interfacePanelBlueInsetLB);
        this.styles.BlueInset.B = ResImg(interfacePanelBlueInsetB);
        this.styles.BlueInset.RB = ResImg(interfacePanelBlueInsetRB);

        this.styles.Brown = {};
        this.styles.Brown.LT = ResImg(interfacePanelBrownLT);
        this.styles.Brown.T = ResImg(interfacePanelBrownT);
        this.styles.Brown.RT = ResImg(interfacePanelBrownRT);
        this.styles.Brown.L = ResImg(interfacePanelBrownL);
        this.styles.Brown.Content = ResImg(interfacePanelBrownContent);
        this.styles.Brown.R = ResImg(interfacePanelBrownR);
        this.styles.Brown.LB = ResImg(interfacePanelBrownLB);
        this.styles.Brown.B = ResImg(interfacePanelBrownB);
        this.styles.Brown.RB = ResImg(interfacePanelBrownRB);

        this.styles.Tooltip = {};
        this.styles.Tooltip.LT = ResImg(interfacePanelTooltipLT);
        this.styles.Tooltip.T = ResImg(interfacePanelTooltipT);
        this.styles.Tooltip.RT = ResImg(interfacePanelTooltipRT);
        this.styles.Tooltip.L = ResImg(interfacePanelTooltipL);
        this.styles.Tooltip.Content = ResImg(interfacePanelTooltipContent);
        this.styles.Tooltip.R = ResImg(interfacePanelTooltipR);
        this.styles.Tooltip.LB = ResImg(interfacePanelTooltipLB);
        this.styles.Tooltip.B = ResImg(interfacePanelTooltipB);
        this.styles.Tooltip.RB = ResImg(interfacePanelTooltipRB);
    };

    Panel.prototype._updateImages = function() {
        if(this.topLeftImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'LT'), this.topLeftImage);
        }

        if(this.topImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'T'), this.topImage, 'repeat-x');
        }

        if(this.topRightImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'RT'), this.topRightImage);
        }

        if(this.leftImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'L'), this.leftImage, 'repeat-y');
        }

        if(this.midImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'Content'), this.midImage, 'repeat');
        }

        if(this.rightImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'R'), this.rightImage, 'repeat-y');
        }

        if(this.bottomLeftImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'LB'), this.bottomLeftImage);
        }

        if(this.bottomImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'B'), this.bottomImage, 'repeat-x');
        }

        if(this.bottomRightImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'RB'), this.bottomRightImage);
        }
    };

    var surrogate = function(){};
    surrogate.prototype = Panel.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Panel.call(self); },
        create: function(id) { return new Panel(id); }
    };

});
