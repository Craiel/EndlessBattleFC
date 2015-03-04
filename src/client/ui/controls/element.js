declare("Element", function() {
	include("$");
	include("Log");
	include("Assert");
	include("TemplateProvider");
	include("Component");
    
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
    UIElement.prototype = component.create();
    UIElement.prototype.$super = parent;
    UIElement.prototype.constructor = UIElement;
    
    function UIElement(id) {
        this.id = id;
        
        this.isVisible = true;
        
        this.parent = undefined;
        
        this.templateName = this.templateName !== undefined ? this.templateName : undefined;
        
        this._mainDiv = undefined;
        
        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.componentUpdate = this.update;
        this.componentRemove = this.remove;
        
        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
        	this.componentInit();

            // Check the parent
        	log.debug(StrLoc(" ELEMENT: {0}").format(this.id));
        	if (parent !== undefined) {
        		if (parent === RootParentKey) {
        			log.warning(StrLoc("  --> Appending to ROOT!"));
        			this.parent = $(document.body);
        		} else {
        			log.debug(StrLoc("  --> Appending to {0}").format(parent.id));
        			this.parent = parent;
        		}
        	} else {
        		log.debug(StrLoc("  --> skipping parent"));
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
                    log.debug(StrLoc("  --> from template (replacing content)"));
                } else {
                    this._mainDiv = content;

                    // this is a new element so check if we are supposed to register it
                    //  undefined means no registration
                    if(parent !== undefined) {
                        var targetElement = parent.getMainElement();
                        assert.isTrue(targetElement !== undefined && targetElement.length > 0, "Parent must be UIElement and initialized: " + parent.id);
                        parent.getMainElement().append(this._mainDiv);
                    }

                    log.debug(StrLoc("  --> from template"));
                }
            } else {
                this._mainDiv = existingElement;
                log.debug(StrLoc("  --> from content"));
            }

            assert.isDefined(this._mainDiv, "MainDiv must be assigned after init: " + this.id);
            assert.isTrue(this._mainDiv.length > 0, "MainDiv must be valid after init: " + this.id);
        };
        
        this.update = function(currentTime) {
            if(!this.isVisible) {
                return false;
            }
    
            return this.componentUpdate(currentTime);
        };
        
        this.remove = function(keepDivAlive) {
            this.componentRemove();
            
            if(keepDivAlive !== true) {
                this._mainDiv.remove();
            }
        };
        
        // ---------------------------------------------------------------------------
        // ui functions
        // ---------------------------------------------------------------------------
        this.hide = function() {
            this.isVisible = false;
            this._mainDiv.hide();
        };
        
        this.show = function() {
            this.isVisible = true;
            this._mainDiv.show();
            this.invalidate();
        };
        
        this.getMainElement = function() {
            return this._mainDiv;
        };
        
        this.checkClassExist = function(className) {
            if(Endless.isDebug === false) {
                return;
            }
            
            if($("."+className).length > 0) {
                return;
            }
            
            log.warning(StrLoc("ClassVerifyError: {0} on {1}").format(className, this.id));
        };
        
        this.addClass = function(className) {
            assert.isFalse(this._mainDiv.hasClass(className));
            this.checkClassExist(className);
            
            this._mainDiv.addClass(className);
        };
        
        this.removeClass = function(className) {
            assert.isTrue(this._mainDiv.hasClass(className));
            this.checkClassExist(className);
            
            this._mainDiv.removeClass(className);
        };
        
        this.toggleClass = function(className) {
            if(this._mainDiv.hasClass(className) === true) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            };
        };
        
        this.setPosition = function(point) {
            assert.isTrue(point.isValid(), StrLoc("Point needs to be a valid structure"));
            
            this._mainDiv.offset({ left: point.x, top: point.y});
        };
        
        this.setSize = function(size) {
            assert.isTrue(size.isValid(), StrLoc("Size needs to be a valid structure"));
            
            this._mainDiv.width(size.x);
            this._mainDiv.height(size.y);
            this._mainDiv.trigger( "updatelayout" );
        };
        
        this.setContent = function(content) {
            this._mainDiv.empty();
            this._mainDiv.append(content);
        };
        
        this.setText = function(text) {
            this._mainDiv.text(text);
        };
        
        this.getText = function() {
        	return this._mainDiv.text();
        };
        
        this.setAttribute = function(name, content) {
        	this._mainDiv.attr(name, content);
        };
        
        this.setOnClick = function(target) {
            assert.isDefined(target);
        	this._mainDiv.click({ target: target, self: this }, function(event) { event.data.target(event.data.self); });
        };
        
        this.setKeyPress = function(code, callback) {
        	this._mainDiv.keypress({self: this}, function(event) {
        		if(event.which === code) {
        			callback(event.data.self);
        			return false;
        		}
        	});
        };

        this.setTemplate = function(name) {
            if(this.templateName !== undefined) {
                log.error("Replacing template " + this.templateName + " with " + name + " for " + this.id);
            }

            this.templateName = name;
        };
    };
    
    return {
    	rootParent: RootParentKey,
    	
        create: function(id) { return new UIElement(id); }
    };
});
