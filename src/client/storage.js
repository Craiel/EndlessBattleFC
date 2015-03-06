declare('Storage', function() {
	include('Assert');
	include('Component');

	Storage.prototype = component.create();
	Storage.prototype.$super = parent;
	Storage.prototype.constructor = Storage;

	function Storage(id) {
		this.id = id + "Storage";

		// Allocate slots in multiples of 6 by default
		this.allocationCount = 6;
		this.allocationLimit = 36; // Hard-limit the storage to 36 slots for now
		
		// Items are stored in a slot like system as a 2 dim array with [id, count]
		this.itemSlots = undefined;
		this.itemSlotMap = {};
		this.nextFreeSlot = 0;

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

			// Find the slot of the item
			var slot = this._getSlot(id);
			if (slot === undefined) {
				// We don't have the item but we are allowed to store so accept
				return true;
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
			var slot = this._getSlot(id);
			if(slot === undefined) {
				slot = this._assignSlot(id);
				assert.isDefined(slot, "assignSlot failed!");
				this.needDictionaryUpdate = true;
			}
			
			// Add the item count to the slot
			slot.count++;
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
				this._releaseSlot(slot);
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
			var slot = this._getSlot(id);
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
		// loading / saving / reset
		// ---------------------------------------------------------------------------
		this.setSlotData = function(data) {
			assert.isDefined(data);

			this.itemSlots = data;
			this.nextFreeSlot = 0;

			this._updateFreeSlot();
			this._rebuildSlotMap();

			this.changed = true;
		}

		this.reset = function() {
			this.itemSlots.length = 0;
			this.itemSlotMap = {};

			this.changed = true;
			this.nextFreeSlot = 0;
		}

		// ---------------------------------------------------------------------------
		// internal functions
		// ---------------------------------------------------------------------------
		this._getSlot = function(id) {
			if(this.itemSlotMap[id] === undefined) {
				return undefined;
			}

			var slotNumber = this.itemSlotMap[id];
			if(this.itemSlots[slotNumber][0] !== id) {
				throw new Error("SlotMap is out of sync!");
			}

			return this.itemSlots[slotNumber];
		}

		this._assignSlot = function(id) {
			this._updateFreeSlot();

			var slot = this.itemSlots[this.nextFreeSlot++];
			slot.itemId = id;
			slot.count++;

			return slot;
		}

		this._releaseSlot = function(slot) {
			var itemId = slot.itemId;
			var slotNumber = this.itemSlotMap[itemId];

			slot.clear();

			this.nextFreeSlot = slotNumber;

			log.error("TODO: Find proper way to delete, closure does not like this:")
			delete self.itemSlotMap[itemId];
		}

		this._updateFreeSlot = function() {
			var found = false;
			while(found === false) {
				assert.isFalse(this.nextFreeSlot >= this.allocationLimit, "Slot count reached allocation limit: " + this.nextFreeSlot + " >= " + this.allocationLimit);

				if(this.itemSlots.length <= this.nextFreeSlot) {
					// Allocate a new set of slots, we reached the end
					for(var i = 0; i < this.allocationCount; i++) {
						var newSlot = { count: 0 };
						this.itemSlots.push(newSlot);
					};
				}

				var slot = this.itemSlots[this.nextFreeSlot];
				if(slot.itemId === undefined) {
					found = true;
				} else {
					this.nextFreeSlot++;
				};
			};
		};

		this._rebuildSlotMap = function() {
			this.itemSlotMap = {};
			for(var i = 0; i < this.itemSlots.length; i++) {
				var item = this.itemSlots[i].itemId;
				if(item === undefined) {
					continue;
				}

				this.itemSlotMap[item] = i;
			};
		};
	};

	return {
		create: function(id) { return new Storage(id); }
	}
});