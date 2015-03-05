declare('Button', function() {
    include('Log');
    include('Assert');
    include('Static');
    include('Element');
    include('CoreUtils');

    Button.prototype = element.create();
    Button.prototype.$super = parent;
    Button.prototype.constructor = Button;

    function Button(id) {
        this.id = id;

        this.setTemplate("button");

        this.backgroundImage = undefined;
        this.hoverImage = undefined;
        this.foregroundImage = undefined;
        this.callback = undefined;
        this.callbackArgument = undefined;

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            assert.isDefined(this.callback, "Callback must be set before init");

            this.getMainElement().mousedown({self: this, arg: this.callbackArgument}, this.callback);

            this._setupEvents();
        };

        // ---------------------------------------------------------------------------
        // progress bar functions
        // ---------------------------------------------------------------------------
        this.setImages = function(background, hover, foreground) {
            this.backgroundImage = background;
            this.hoverImage = hover;
            this.foregroundImage = foreground;

            this._updateImages();
            this._setupEvents();
        }

        this.setButtonText = function(text) {
            $('#' + this.id + 'Text').text(text);
        }

        this._updateImages = function() {
            if(this.foregroundImage !== undefined) {
                $('#' + this.id + 'Image').css({ 'background-image': coreUtils.getImageUrl(this.foregroundImage) });
            }

            this.getMainElement().mouseout();
        }

        this._setupEvents = function() {
            if(this.hoverImage !== undefined) {
                var hoverCallback = function (obj) { coreUtils.setBackgroundImage($(obj.currentTarget), obj.data.self.hoverImage); };
                this.getMainElement().mouseover({self: this}, hoverCallback );
                this.getMainElement().mouseup({self: this}, hoverCallback );
            }

            var resetCallback = undefined;
            if(this.backgroundImage !== undefined) {
                resetCallback = function (obj) { coreUtils.setBackgroundImage($(obj.currentTarget), obj.data.self.backgroundImage); };
            } else {
                resetCallback = function (obj) { $(obj.currentTarget).css({"background-image": "none"}); };
            }
            this.getMainElement().mouseout({self: this}, resetCallback );

            // Fire once to set the image
            this.getMainElement().mouseout();
        }
    };

    return {
        create: function(id) { return new Button(id); }
    };

});
