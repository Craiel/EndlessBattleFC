declare('Button', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');

    Button.prototype = element.prototype();
    Button.prototype.$super = parent;
    Button.prototype.constructor = Button;

    function Button(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("button");

        this.backgroundImage = undefined;
        this.hoverImage = undefined;
        this.foregroundImage = undefined;
        this.callback = undefined;
        this.callbackArgument = undefined;

        this.foregroundImageElement = undefined;
    };

    // ---------------------------------------------------------------------------
    // overrides
    // ---------------------------------------------------------------------------
    Button.prototype.elementInit = Button.prototype.init;

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    Button.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        assert.isDefined(this.callback, "Callback must be set before init");

        this.getMainElement().mousedown({self: this, arg: this.callbackArgument}, this.callback);

        this.foregroundImageElement = element.create(this.id + 'Text');
        this.foregroundImageElement.init(this);

        this._setupEvents();
    };

    // ---------------------------------------------------------------------------
    // progress bar functions
    // ---------------------------------------------------------------------------
    Button.prototype.setImages = function(background, hover, foreground) {
        this.backgroundImage = background;
        this.hoverImage = hover;
        this.foregroundImage = foreground;

        this._updateImages();
        this._setupEvents();
    }

    Button.prototype.setButtonText = function(text) {
        $('#' + this.id + 'Text').text(text);
    }

    Button.prototype._updateImages = function() {
        if(this.foregroundImage !== undefined) {
            this.foregroundImageElement.setStyle({ 'background-image': coreUtils.getImageUrl(this.foregroundImage), 'background-repeat': 'no-repeat', 'background-size': '70% 70%', "background-position": "center" });
        }

        this.getMainElement().mouseout();
    }

    Button.prototype._setupEvents = function() {
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

    var surrogate = function(){};
    surrogate.prototype = Button.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Button.call(self); },
        create: function(id) { return new Button(id); }
    };

});
