declare('Storage', function() {
	include('Assert');
	include('Component');

	Storage.prototype = component.prototype();
	Storage.prototype.$super = parent;
	Storage.prototype.constructor = Storage;

	/* Sample item slot
	var ItemSlot = {
		Id: undefined,
		metadata: {},
		count: 0
	}
	*/

	function Storage(id) {
        component.construct(this);

		this.id = id + "Storage";

		// Items are stored in a array of json objects
		this.itemSlots = undefined;
		this.itemSlotMap = {};
        this.itemSlotSize = 36;

		this.changed = false;
	};

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Storage.prototype.componentInit = Storage.prototype.init;
    Storage.prototype.init = function(size) {
        this.componentInit();

        if(size !== undefined) {
            assert.isNumber(size, "Size needs to be a number!");

            this.itemSlotSize = size;
        }
    }

    // ---------------------------------------------------------------------------
    // storage functions
    // ---------------------------------------------------------------------------
    Storage.prototype.setChanged = function(value) {
        this.changed = value || true;
    };

    Storage.prototype.getChanged = function() {
        return this.changed;
    };

    Storage.prototype.canAdd = function(id) {
        return this._getSlot(id, true) !== undefined;
    }

    Storage.prototype.add = function(id, count) {
        assert.isDefined(id);

        // Calling add will add exactly 1 if not specified
        if(count === undefined) {
            count = 1;
        }

        assert.isTrue(count > 0, "Can not add null or negative item count!");

        // Get the target slot
        var slot = this._getSlot(id, true);
        if(slot.id === undefined) {
            slot.id = id;
            slot.count = 0;
            this.itemSlotMap[id] = slot;
        }

        // Add the item count to the slot
        slot.count += count;

        this.changed = true;
    };

    Storage.prototype.remove = function(id, count) {
        assert.isDefined(id);

        // Todo: Remove later when the code is more hardened
        assert.isTrue(this.hasItem(id), "remove(<id>) called with non-existing item, call hasItem(<id>) first!");

        // Calling remove will remove exactly 1 if not specified
        if(count === undefined) {
            count = 1;
        }

        // Get the target slot
        var slot = this._getSlot(id);
        assert.isDefined(slot, "Invalid slot found in Remove()");
        slot.count -= count;

        if(slot.count <= 0) {
            // If we no longer have any left clear out the slot
            slot.id = undefined;
            slot.metaData = undefined;
            slot.count = 0;

            delete this.itemSlotMap[id];
        }

        this.changed = true;
    };

    Storage.prototype.getSize = function() {
        return this.itemSlotSize;
    };

    Storage.prototype.increaseSize = function(additionalSize) {
        assert.isTrue(additionalSize > 0);

        this.itemSlotSize += additionalSize;
    }

    Storage.prototype.getSlotAt = function(index) {
        if(this.itemSlots === undefined || this.itemSlots.length < index) {
            return undefined;
        }

        return this.itemSlots[index];
    };

    Storage.prototype.hasItem = function(id)
    {
        return this.itemSlotMap[id] != undefined;
    };

    Storage.prototype.getItemCount = function(id) {
        if(this.itemSlotMap[id] === undefined) {
            return 0;
        }

        return this.itemSlotMap[id].count;
    };

    Storage.prototype.setMetadata = function(id, metadata) {
        var slot = this._getSlot(id);
        assert.isDefined(slot, "setMetadata() called on invalid item: " + id);

        slot.metaData = metadata;
    };

    Storage.prototype.getMetadata = function(id) {
        var slot = this._getSlot(id);
        assert.isDefined(slot, "getMetadata() called on invalid item: " + id);

        return slot.metaData;
    };

    // ---------------------------------------------------------------------------
    // loading / saving / reset
    // ---------------------------------------------------------------------------
    Storage.prototype.setSlotData = function(data) {
        assert.isDefined(data);

        this.itemSlots = data;
        this.nextFreeSlot = 0;

        this._rebuildSlotMap();

        this.changed = true;
    }

    Storage.prototype.reset = function() {
        this.itemSlots.length = 0;
        this._rebuildSlotMap();

        this.changed = true;
    }

    // ---------------------------------------------------------------------------
    // internal functions
    // ---------------------------------------------------------------------------
    Storage.prototype._getSlot = function(id, getEmptyIfNotFound) {
        if(this.itemSlotMap[id] !== undefined) {
            return this.itemSlotMap[id];
        }

        if(getEmptyIfNotFound === true) {
            var index = 0;
            console.log("Finding empty slot");
            while(index < this.itemSlotSize - 1) {
                if(this.itemSlots.length - 1 < index) {
                    console.log("Pushing new Slot");
                    this.itemSlots.push({id: undefined, metaData: undefined, count: 0 });
                }

                if(this.itemSlots[index].id === undefined) {
                    console.log("Found empty slot");
                    return this.itemSlots[index];
                }

                index++;
            }
        }

        return undefined;
    }

    Storage.prototype._rebuildSlotMap = function() {
        this.itemSlotMap = {};
        for(var i = 0; i < this.itemSlots.length; i++) {
            var id = this.itemSlots[i].id;
            if(id === undefined) {
                continue;
            }

            this.itemSlotMap[id] = this.itemSlots[i];
        };
    };

    var surrogate = function(){};
    surrogate.prototype = Storage.prototype;

	return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Storage.call(self); },
		create: function(id) { return new Storage(id); }
	}
});