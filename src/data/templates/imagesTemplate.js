declare("Images", function() {
    include('StaticData');
    include('Component');

    Images.prototype = component.prototype();
    Images.prototype.$super = parent;
    Images.prototype.constructor = Images;
    
    function Images() {
        component.construct(this);

        this.id = 'Images';

        this.useRegister = {};
    };

    // ---------------------------------------------------------------------------
    // component functions
    // ---------------------------------------------------------------------------
    Images.prototype.componentInit = Images.prototype.init;
    Images.prototype.init = function() {

{CONTENT}

    };

    Images.prototype.use = function(id, image) {
        Assert.isDefined(this[image], "Image {0} was not defined for use by {1}".format(image, id));

        if(this.useRegister[image] === undefined) {
            this.useRegister[image] = {};
        }

        if(this.useRegister[image][id] === undefined) {
            this.useRegister[image][id] = 0;
        }

        this.useRegister[image][id]++;
        return image;
    };

    // Helper function for panels
    Images.prototype.setPanelImages = function(panel, imageKey) {
        panel.setImages(this['InterfacePanel'+imageKey+'LT'], this['InterfacePanel'+imageKey+'T'], this['InterfacePanel'+imageKey+'RT'],
            this['InterfacePanel'+imageKey+'L'], this['InterfacePanel'+imageKey+'Content'], this['InterfacePanel'+imageKey+'R'],
            this['InterfacePanel'+imageKey+'LB'], this['InterfacePanel'+imageKey+'B'], this['InterfacePanel'+imageKey+'RB']);
    };

    return new Images();
});