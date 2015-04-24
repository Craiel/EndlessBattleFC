declare('Element', function() {
	include('Debug');
	include('Assert');
	include('TemplateProvider');
	include('Component');
    include('EventAggregate');
    include('StaticData');
    
    var RootParentKey = "__ROOT__";
        
    var createElementContent = function(id, parent, templateName, attributes) {
        // Check if we are using a custom template, if not we will look-up by id
        if(templateName === undefined) {
            templateName = id;
        }
        
        // Ensure attributes is valid
        if(attributes === undefined) {
            attributes = {};
        }
        
        if(attributes.id === undefined) {
            attributes["id"] = id;
        }
        
        // fetch the template to use, either custom or go by the id
        var content = templateProvider.GetTemplate(templateName, attributes);
        assert.isDefined(content, "Template for element does not exist: " + templateName);
        return $(content);
    };
        
    // ---------------------------------------------------------------------------
    // class definition
    // ---------------------------------------------------------------------------
    UIElement.prototype = component.prototype();
    UIElement.prototype.$super = parent;
    UIElement.prototype.constructor = UIElement;
    
    function UIElement(id) {
        component.construct(this);

        this.id = id;

        this.logContext = "element";

        this.tooltip = undefined;
        
        this.isVisible = true;
        this.hasTooltip = false;
        
        this.parent = undefined;
        
        this.templateName = this.templateName !== undefined ? this.templateName : undefined;
        
        this._mainDiv = undefined;

        this.managedChildren = [];

        this.lastUpdateTick = undefined;
    };

    // ---------------------------------------------------------------------------
    // overrides
    // ---------------------------------------------------------------------------
    UIElement.prototype.componentInit = UIElement.prototype.init;
    UIElement.prototype.componentUpdate = UIElement.prototype.update;
    UIElement.prototype.componentRemove = UIElement.prototype.remove;

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    UIElement.prototype.init = function(parent, attributes) {
        this.componentInit();

        // Check the parent
        if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc(" ELEMENT: {0}").format(this.id), this.logContext); }
        if (parent !== undefined) {
            if (parent === RootParentKey) {
                debug.logWarning(StrLoc("  --> Appending to ROOT!"), this.logContext);
                this.parent = $(document.body);
            } else {
                if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc("  --> Appending to {0}").format(parent.id), this.logContext); }
                this.parent = parent;
            }
        } else {
            if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc("  --> skipping parent"), this.logContext); }
        }

        // try to get our element target
        var existingElement = undefined;
        if(this.parent !== undefined) {
            existingElement = this.parent.getMainElement().find('#' + this.id);
        } else {
            existingElement = $('#' + this.id);
        }

        // Check if we are supposed to take from template
        if (this.templateName !== undefined) {
            var content = createElementContent(this.id, this.parent, this.templateName, attributes);
            if(existingElement !== undefined && existingElement.length > 0) {
                this._mainDiv = content;
                existingElement.replaceWith(content);
                if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc("  --> from template (replacing content)"), this.logContext); }
            } else {
                this._mainDiv = content;

                // this is a new element so check if we are supposed to register it
                //  undefined means no registration
                if(parent !== undefined) {
                    var targetElement = parent.getMainElement();
                    assert.isTrue(targetElement !== undefined && targetElement.length > 0, "Parent must be UIElement and initialized: " + parent.id);
                    parent.getMainElement().append(this._mainDiv);
                }

                if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc("  --> from template"), this.logContext); }
            }
        } else {
            this._mainDiv = existingElement;
            if(Endless.isVerboseDebug === true) { debug.logDebug(StrLoc("  --> from content"), this.logContext); }
        }

        assert.isDefined(this._mainDiv, "MainDiv must be assigned after init: " + this.id);
        assert.isTrue(this._mainDiv.length > 0, "MainDiv must be valid after init: " + this.id);
    };

    UIElement.prototype.update = function(gameTime) {
        if(Endless.isDebug === true) {
            assert.isFalse(Endless.currentUpdateTick === this.lastUpdateTick, "Element was updated more than once per cycle: " + this.id);
            this.lastUpdateTick = Endless.currentUpdateTick;
        }

        if(this.isVisible !== true) {
            return false;
        }

        for(var i = 0; i < this.managedChildren.length; i++) {
            this.managedChildren[i].update(gameTime);
        }

        return this.componentUpdate(gameTime);
    };

    UIElement.prototype.remove = function(keepDivAlive) {
        this.componentRemove();

        if(keepDivAlive !== true)
        {
            // Remove the managed children first before the main element goes out of scope
            for(var i = 0; i < this.managedChildren.length; i++) {
                this.managedChildren[i].remove();
            }

            this.managedChildren = [];

            this._mainDiv.remove();
        }
    };

    UIElement.prototype.removeElementOnly = function() {
        this._mainDiv.remove();
    };

    // ---------------------------------------------------------------------------
    // ui functions
    // ---------------------------------------------------------------------------
    UIElement.prototype.hide = function() {
        if(this.isVisible !== true) {
            // Avoid useless processing
            return;
        }

        this.isVisible = false;
        this._mainDiv.hide();
    };

    UIElement.prototype.show = function() {
        if(this.isVisible !== false) {
            // Avoid useless processing
            return;
        }

        this.isVisible = true;
        this._mainDiv.show();
        this.invalidate();
    };

    UIElement.prototype.setVisibility = function(value) {
        if(value === true) {
            this.show();
        } else {
            this.hide();
        }
    }

    UIElement.prototype.getMainElement = function() {
        return this._mainDiv;
    };

    UIElement.prototype.checkClassExist = function(className) {
        if(Endless.isDebug === false) {
            return;
        }

        if($("."+className).length > 0) {
            return;
        }

        debug.logWarning(StrLoc("ClassVerifyError: {0} on {1}").format(className, this.id), this.logContext);
    };

    UIElement.prototype.addClass = function(className) {
        assert.isFalse(this._mainDiv.hasClass(className));
        this.checkClassExist(className);

        this._mainDiv.addClass(className);
    };

    UIElement.prototype.removeClass = function(className) {
        assert.isTrue(this._mainDiv.hasClass(className));
        this.checkClassExist(className);

        this._mainDiv.removeClass(className);
    };

    UIElement.prototype.toggleClass = function(className) {
        if(this._mainDiv.hasClass(className) === true) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        };
    };

    UIElement.prototype.setTop = function(value) {
        this._mainDiv.css({top: value});
    };

    UIElement.prototype.setPosition = function(point) {
        this._mainDiv.css({ left: point.x, top: point.y});
    };

    UIElement.prototype.setHeight = function(height) {
        this._mainDiv.height(height);
        this._mainDiv.trigger( "updatelayout" );
    }

    UIElement.prototype.getSize = function() {
        return {x: this._mainDiv.width(), y: this._mainDiv.height()};
    }

    UIElement.prototype.setSize = function(size) {
        this._mainDiv.width(size.x);
        this._mainDiv.height(size.y);
        this._mainDiv.trigger( "updatelayout" );
    };

    UIElement.prototype.getContent = function() {
        return this._mainDiv.contents();
    };

    UIElement.prototype.removeContent = function() {
        this._mainDiv.empty();
    };

    UIElement.prototype.setContent = function(content) {
        this.removeContent();
        this._mainDiv.append(content);
    };

    UIElement.prototype.addContent = function(content) {
        this._mainDiv.append(content);
    };

    UIElement.prototype.setText = function(text) {
        this._mainDiv.text(text);
    };

    UIElement.prototype.getText = function() {
        return this._mainDiv.text();
    };

    UIElement.prototype.setStyle = function(style) {
        this._mainDiv.css(style);
    }

    UIElement.prototype.setAttribute = function(name, content) {
        this._mainDiv.attr(name, content);
    };

    UIElement.prototype.setOnClick = function(target) {
        assert.isDefined(target);
        this._mainDiv.click({ target: target, self: this }, function(event) { event.data.target(event.data.self); });
    };

    UIElement.prototype.setOnDoubleClick = function(target) {
        assert.isDefined(target);
        this._mainDiv.dblclick({ target: target, self: this }, function(event) { event.data.target(event.data.self); });
    };

    UIElement.prototype.setKeyPress = function(code, callback) {
        this._mainDiv.keypress({self: this}, function(event) {
            if(event.which === code) {
                callback(event.data.self);
                return false;
            }
        });
    };

    UIElement.prototype.setTemplate = function(name) {
        if(this.templateName !== undefined) {
            debug.logError("Replacing template " + this.templateName + " with " + name + " for " + this.id, this.logContext);
        }

        this.templateName = name;
    };

    UIElement.prototype.scrollToBottom = function(content) {
        this._mainDiv.scrollTop(1E10);
    };

    UIElement.prototype.getChildCount = function() {
        return this._mainDiv.children().length;
    };

    UIElement.prototype.removeFirstChild = function() {
        this._mainDiv.children().first().remove();
    };

    UIElement.prototype.setTooltip = function(content) {
        this.tooltip = content;

        if(this.hasTooltip === false && content !== undefined) {
            // Setup the enter / exit handlers
            var enterCallback = function(obj) { obj.data.aggregate.publish(obj.data.type, {content: obj.data.self.tooltip}); }
            var leaveCallback = function(obj) { obj.data.aggregate.publish(obj.data.type, {content: null}); }
            this._mainDiv.mouseenter({self: this, aggregate: eventAggregate, type: staticData.EventTooltip }, enterCallback);
            this._mainDiv.mouseleave({self: this, aggregate: eventAggregate, type: staticData.EventTooltip }, leaveCallback);

            this.hasTooltip = true;
        } else if (this.hasTooltip === true && content === undefined) {
            this._mainDiv.unbind('mouseenter');
            this._mainDiv.unbind('mouseleave');

            this.hasTooltip = false;
        }
    };

    UIElement.prototype.findChildElement = function(id) {
        return this.getMainElement().find('#' + id);
    };

    UIElement.prototype.addManagedChild = function(element) {
        this.managedChildren.push(element);
    };

    var surrogate = function(){};
    surrogate.prototype = UIElement.prototype;
    
    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { UIElement.call(self); },

    	rootParent: RootParentKey,
        create: function(id) { return new UIElement(id); }
    };
});
