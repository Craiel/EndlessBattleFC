declare('Panel', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');

    Panel.prototype = element.create();
    Panel.prototype.$super = parent;
    Panel.prototype.constructor = Panel;

    function Panel(id) {
        this.id = id;

        this.setTemplate("panel");

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
            this.contentElement = element.create(this.id + 'Content');
            this.contentElement.init();
        };

        this.elementRemove = this.remove;
        this.remove = function() {
            this.contentElement.remove();

            this.elementRemove();
        }

        // ---------------------------------------------------------------------------
        // panel functions
        // ---------------------------------------------------------------------------
        this.setImages = function(topLeft, top, topRight, left, mid, right, bottomLeft, bottom, bottomRight) {
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
        }

        this.getContentArea = function() {
            return this.contentElement;
        }

        this._updateImages = function() {
            if(this.topLeftImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'LT'), this.topLeftImage);
            }

            if(this.topImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'T'), this.topImage, 'repeat-x');
            }

            if(this.topRightImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'RT'), this.topRightImage);
            }

            if(this.leftImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'L'), this.leftImage, 'repeat-y');
            }

            if(this.midImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'Content'), this.midImage, 'repeat');
            }

            if(this.rightImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'R'), this.rightImage, 'repeat-y');
            }

            if(this.bottomLeftImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'LB'), this.bottomLeftImage);
            }

            if(this.bottomImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'B'), this.bottomImage, 'repeat-x');
            }

            if(this.bottomRightImage !== undefined) {
                coreUtils.setBackgroundImage($('#' + this.id + 'RB'), this.bottomRightImage);
            }
        }
    };

    return {
        create: function(id) { return new Panel(id); }
    };

});
