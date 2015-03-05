declare('Storage', function() {
	include('Assert');
	include('Component');
	include('StorageSlot');

	// ---------------------------------------------------------------------------
	// internal functions
	// ---------------------------------------------------------------------------	
	var getStorageKey = function(id) {
		return 'storage_' + id + '_';
	}
	
	var getSlot = function(self, id) {
		if(self.itemSlotMap[id] === undefined) {
			return undefined;
		}
		
		var slotNumber = self.itemSlotMap(id);
		if(self.itemSlots[slotNumber][0] !== id) {
			throw new Error("SlotMap is out of sync!");
		}
		
		return self.itemSlots[slotNumber];
	}
	
	var assignSlot = function(self, id) {
		updateFreeSlot(self);

		var slot = self.itemSlots[self.nextFreeSlot++];
		slot.setItem(id);

		return slot;
	}
	
	var releaseSlot = function(self, slot) {
		var itemId = slot.getItem();
		var slotNumber = self.itemSlotMap(itemId);
		
		slot.clear();
		
		self.nextFreeSlot = slotNumber;
		delete self.itemSlotMap(itemId);
	}
	
	var updateFreeSlot = function(self) {
		var found = false;
		while(found === false) {
			assert.isFalse(self.nextFreeSlot >= self.allocationLimit, "Slot count reached allocation limit: " + self.nextFreeSlot + " >= " + self.allocationLimit);
			
			if(self.itemSlots.length <= self.nextFreeSlot) {
				// Allocate a new set of slots, we reached the end
				for(var i = 0; i < self.allocationCount; i++) {
					self.itemSlots.push(storageSlot.create());
				};
			}
			
			var slot = self.itemSlots[self.nextFreeSlot];
			if(slot.getItem() === undefined) {
				found = true;
			} else {
				self.nextFreeSlot++;
			};
		};
	};
	
	var rebuildSlotMap = function(self) {
		self.itemSlotMap = {};
		for(var i = 0; i < self.itemSlots.length; i++) {
			var item = self.itemSlots[i].getItem();
			if(item === undefined) {
				continue;
			}
			
			itemSlotMap[item] = i;
		};
	};
	
	// ---------------------------------------------------------------------------
	// Storage object
	// ---------------------------------------------------------------------------
	Storage.prototype = component.create();
	Storage.prototype.$super = parent;
	Storage.prototype.constructor = Storage;

	function Storage(id) {
		this.id = "Storage" + id;

		// Allocate slots in multiples of 6 by default
		this.allocationCount = 6;
		this.allocationLimit = 36; // Hard-limit the storage to 36 slots for now
		
		// Items are stored in a slot like system as a 2 dim array with [id, count]
		this.itemSlots = [];
		this.itemSlotMap = {};
		this.nextFreeSlot = 0;
		
		// Global limit will make the storage hold only n amount of items total and refuse any more after
		this.globalCount = 0;
		this.globalLimit = undefined;
		
		// Overrides can change the limit for an individual item and ignore the native limit set on the item
		this.limitOverrides = {};

		this.changed = false;

		// ---------------------------------------------------------------------------
		// basic functions
		// ---------------------------------------------------------------------------
		this.componentInit = this.init;
		this.init = function(limit) {
			this.componentInit();

			if(limit !== undefined) {
				this.allocationLimit = limit;
			}
		}

		// ---------------------------------------------------------------------------
		// storage functions
		// ---------------------------------------------------------------------------
		this.setChanged = function(value) {
			this.changed = value || true;
		};

		this.getChanged = function() {
			return this.changed;
		};

		this.canAdd = function(id) {
			assert.isDefined(id);
			
			// Check global limit first since it's the easiest test
			if(this.globalLimit && this.globalCount >= this.globalLimit) {
				return false;
			}
			
			// Get the individual override
			var limitOverride = this.limitOverrides[id];
			if(limitOverride && limitOverride <= 0) {
				// If we are not allowed to store this item at all bail out right away
				return false;
			}
			
			// Find the slot of the item
			var slot = getSlot(this, id);
			if (slot === undefined) {
				// We don't have the item but we are allowed to store so accept
				return true;
			}
			
			var currentCount = slot.getCount();
			if(limitOverride && currentCount >= limitOverride) {
				// Check if we already have as much as the override allows and bail
				return false;
			}
			
			// Now we need the item-info to go on
			var itemInfo = game.getItem(id);
	
			// See if this item has limited storage capacity
			var limit = itemInfo.storageLimit;
			if (limit && currentCount >= limit) {
				// We have reached the default storage capacity
				return false;
			}
	
			// Item is good to add
			return true;
		};
	
		this.add = function(id, value) {
			assert.isDefined(id);
			
			// This is a costly assert so we should get rid of it eventually
			//  but right now i want to make sure all code that adds things is aware of calling canAdd
			assert.isTrue(this.canAdd(id), "Item can not be added, call canAdd(<id>) before calling add(<id>)");
			
			// Calling add(<id>) will add exactly 1
			if(value === undefined) {
				value = 1;
			}
	
			// Get the target slot
			var slot = getSlot(this, id);
			if(slot === undefined) {
				slot = assignSlot(this, id);
				assert.isDefined(slot, "assignSlot failed!");
				this.needDictionaryUpdate = true;
			}
			
			// Add the item count to the slot
			slot.add(value);
			this.changed = true;
		};
		
		this.remove = function(id, value) {
			assert.isDefined(id);
			
			// Todo: Remove later when the code is more hardened
			assert.isTrue(this.hasItem(id), "remove(<id>) called with non-existing item, call hasItem(<id>) first!");
			
			// Calling remove(<id>) will remove exactly 1
			if(value === undefined) {
				value = 1;
			}
			
			// Get the target slot
			var slot = getSlot(this, id);
			if(slot.getCount() <= value) {
				releaseSlot(this, slot);
			} else {
				slot.remove(value);
			}
			
			this.needDictionaryUpdate = true;
			this.changed = true;
		};

		this.getLimit = function() {
			return this.allocationLimit;
		}

		// We don't allow lowering the limit for now
		this.raiseLimit = function(count) {
			if(count === undefined) {
				count = this.allocationCount;
			}

			this.allocationLimit += count;
		}

		this.getAllocationCount = function() {
			return this.allocationCount;
		}

		this.getSlotCount = function() {
			return this.itemSlots.length;
		};
		
		this.getSlotAt = function(index) {
			assert.isTrue(index >= 0 && index < this.itemSlots.length);
			
			return this.itemSlots[index];
		};
		
		this.hasItem = function(id)
		{
			return this.itemSlotMap[id] != undefined;
		};
	
		this.getItems = function() {
			return Object.keys(this.itemSlotMap);
		};
	
		this.getItemCount = function(id) {
			var slot = getSlot(this, id);
			if(slot === undefined) {
				return 0;
			}
	
			return slot.getCount();
		};
		
		this.setMetadata = function(id, metadata) {
			var slot = getSlot(this, id);
			assert.isDefined(slot, "setMetadata() called on invalid item: " + id);
			
			slot.setMetadata(metadata);
		};
		
		this.getMetadata = function(id) {
			var slot = getSlot(this, id);
			assert.isDefined(slot, "getMetadata() called on invalid item: " + id);
			
			return slot.getMetadata();
		};
	
		// ---------------------------------------------------------------------------
		// loading / saving
		// ---------------------------------------------------------------------------
		/*this.save = function() {
			var storageKey = getStorageKey(this.id);
			
			localStorage[storageKey + '_slot'] = JSON.stringify(this.itemSlots);
		};
	
		this.load = function() {
			var storageKey = getStorageKey(this.id);	
			var data = localStorage[storageKey + '_slot'];
			
			if(data) {
				this.itemSlots = JSON.parse(data) || [];
			}
			
		    this.nextFreeSlot = 0;
		    
		    updateFreeSlot(this);
		    rebuildSlotMap(this);
		    
		    this.changed = true;
		};
	
		this.reset = function(fullReset) {
			this.itemSlots = [];
			this.itemSlotMap = {};
		    
		    this.changed = true;
		    this.nextFreeSlot = 0;
		};*/
	};

	return {
		create: function(id) { return new Storage(id); }
	}
});