declare("ProgressBar", function() {
	include("Log");
	include("Assert");
	include("Static");
	include("Element");
    include("CoreUtils");
    
    ProgressBar.prototype = element.create();
    ProgressBar.prototype.$super = parent;
    ProgressBar.prototype.constructor = ProgressBar;
    
    function ProgressBar(id) {
        this.id = id;

        this.setTemplate("progressBar");

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
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            // Nothing to do here atm
        };
        
        // ---------------------------------------------------------------------------
        // progress bar functions
        // ---------------------------------------------------------------------------
        this.setProgress = function(value, max) {
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

        this.setImages = function(left, mid, right) {
            this.leftImage = left;
            this.midImage = mid;
            this.rightImage = right;
            this._updateImages();
        }

        this.setBackgroundImages = function(left, mid, right) {
            this.backLeftImage = left;
            this.backMidImage = mid;
            this.backRightImage = right;
            this._updateBackImages();
        }

        this.setProgressText = function(text) {
            $('#' + this.id + 'Text').text(text);
        }

        this._updateImages = function() {
            if(this.leftImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'Start'), this.leftImage);
            }

            if(this.midImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'Value'), this.midImage);
            }

            if(this.rightImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'End'), this.rightImage);
            }
        }

        this._updateBackImages = function() {
            if(this.backLeftImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'BackStart'), this.backLeftImage);
            }

            if(this.backMidImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'BackValue'), this.backMidImage);
            }

            if(this.backRightImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'BackEnd'), this.backRightImage);
            }
        }
        
        this._updateProgressDiv = function() {
            var mainBar = $('#' + this.id);
            var progressValue = (this.value / this.maxValue);
            var progressWidth = Math.floor(progressValue * $('#' + this.id + 'MaxWidth').width());
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

    };
    
    return {
        create: function(id) { return new ProgressBar(id); }
    };
    
});
