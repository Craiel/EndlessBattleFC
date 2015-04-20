declare('ProgressBar', function() {
    include('Assert');
	include('Element');
    include('CoreUtils');
    include('StaticData');
    
    ProgressBar.prototype = element.prototype();
    ProgressBar.prototype.$super = parent;
    ProgressBar.prototype.constructor = ProgressBar;
    
    function ProgressBar(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("progressBar");

        this.styles = {};

        this.animate = false;
        this.animateDelay = 20;
        this.minWidth = 18;
        this.value = 0;
        this.maxValue = 100;
        this.leftImage = undefined;
        this.midImage = undefined;
        this.rightImage = undefined;
        this.backLeftImage = undefined;
        this.backMidImage = undefined;
        this.backRightImage = undefined;

        this.progressTextElement = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ProgressBar.prototype.elementInit = ProgressBar.prototype.init;
    ProgressBar.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.progressTextElement = this.findChildElement(this.id + 'Text');

        this.loadDefaultStyles();
    };

    // ---------------------------------------------------------------------------
    // progress bar functions
    // ---------------------------------------------------------------------------
    ProgressBar.prototype.loadDefaultStyles = function() {
        this.styles.Red = {};
        this.styles.Red.Left = ResImg(interfaceBarRedHorizontalLeft);
        this.styles.Red.Mid = ResImg(interfaceBarRedHorizontalMid);
        this.styles.Red.Right = ResImg(interfaceBarRedHorizontalRight);

        this.styles.Green = {};
        this.styles.Green.Left = ResImg(interfaceBarGreenHorizontalLeft);
        this.styles.Green.Mid = ResImg(interfaceBarGreenHorizontalMid);
        this.styles.Green.Right = ResImg(interfaceBarGreenHorizontalRight);

        this.styles.Blue = {};
        this.styles.Blue.Left = ResImg(interfaceBarBlueHorizontalLeft);
        this.styles.Blue.Mid = ResImg(interfaceBarBlueHorizontalMid);
        this.styles.Blue.Right = ResImg(interfaceBarBlueHorizontalRight);

        this.styles.Purple = {};
        this.styles.Purple.Left = ResImg(interfaceBarPurpleHorizontalLeft);
        this.styles.Purple.Mid = ResImg(interfaceBarPurpleHorizontalMid);
        this.styles.Purple.Right = ResImg(interfaceBarPurpleHorizontalRight);

        this.styles.Yellow = {};
        this.styles.Yellow.Left = ResImg(interfaceBarYellowHorizontalLeft);
        this.styles.Yellow.Mid = ResImg(interfaceBarYellowHorizontalMid);
        this.styles.Yellow.Right = ResImg(interfaceBarYellowHorizontalRight);

        this.styles.Back = {};
        this.styles.Back.Left = ResImg(interfaceBarBackHorizontalLeft);
        this.styles.Back.Mid = ResImg(interfaceBarBackHorizontalMid);
        this.styles.Back.Right = ResImg(interfaceBarBackHorizontalRight);
    };

    ProgressBar.prototype.setStyle = function(key) {
        assert.isDefined(this.styles[key], "Style not found: " + key);

        this.setImages(this.styles[key].Left, this.styles[key].Mid, this.styles[key].Right);
    };

    ProgressBar.prototype.setBackgroundStyle = function(key) {
        assert.isDefined(this.styles[key], "Style not found: " + key);

        this.setBackgroundImages(this.styles[key].Left, this.styles[key].Mid, this.styles[key].Right);
    };

    ProgressBar.prototype.setProgress = function(value, max) {
        var update = false;
        if(max !== undefined && this.maxValue !== max) {
            this.maxValue = max;
            update = true;
        }

        if(value !== undefined && value !== this.value) {
            this.value = value;
            update = true;
        };

        if(update === true) {
            this._updateProgressDiv();
        }
    };

    ProgressBar.prototype.setImages = function(left, mid, right) {
        this.leftImage = left;
        this.midImage = mid;
        this.rightImage = right;
        this._updateImages();
    };

    ProgressBar.prototype.setBackgroundImages = function(left, mid, right) {
        this.backLeftImage = left;
        this.backMidImage = mid;
        this.backRightImage = right;
        this._updateBackImages();
    };

    ProgressBar.prototype.setProgressText = function(text) {
        this.progressTextElement.text(text);
    };

    ProgressBar.prototype._updateImages = function() {
        if(this.leftImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'Start'), this.leftImage);
        }

        if(this.midImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'Value'), this.midImage);
        }

        if(this.rightImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'End'), this.rightImage);
        }
    };

    ProgressBar.prototype._updateBackImages = function() {
        if(this.backLeftImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'BackStart'), this.backLeftImage);
        }

        if(this.backMidImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'BackValue'), this.backMidImage);
        }

        if(this.backRightImage !== undefined) {
            coreUtils.setBackgroundImage(this.findChildElement(this.id + 'BackEnd'), this.backRightImage);
        }
    };

    ProgressBar.prototype._updateProgressDiv = function() {
        var mainBar = this.findChildElement(this.id + "Front");
        var progressValue = (this.value / this.maxValue);
        var maxWidth = this.findChildElement(this.id + 'MaxWidth').width();
        var progressWidth = Math.floor(progressValue * maxWidth);
        if(progressWidth > maxWidth) {
            progressWidth = maxWidth;
        }

        if(progressWidth < this.minWidth) {
            mainBar.hide();
            return;
        } else {
            mainBar.show();
        }

        if(this.animate === true) {
            mainBar.animate({width: progressWidth}, this.animateDelay);
        } else {
            mainBar.width(progressWidth);
        }
    };

    var surrogate = function(){};
    surrogate.prototype = ProgressBar.prototype;
    
    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { ProgressBar.call(self); },
        create: function(id) { return new ProgressBar(id); }
    };
    
});
