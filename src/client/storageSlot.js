declare('StorageSlot', function() {
	
	function StorageSlot() {
		
		this.itemId = undefined;
		this.count = 0;
		
		// Metadata is used for things like socketing, enchanting or other per-item extra information
		//  this info will be attached to the item in the slot and moved around with it
		this.metadata = undefined;

		// ---------------------------------------------------------------------------
		// slot functions
		// ---------------------------------------------------------------------------
		this.swap = function(other) {
			assert.isDefined(other);
			
			var otherId = other.getItem();
			var otherCount = other.getCount();
			var otherMetadata = other.getMetadata();
			
			other.setItem(this.itemId);
			other.setCount(this.count);
			other.setMetadata = this.metadata;
			
			this.itemId = otherId;
			this.count = otherCount;
			this.metadata = otherMetadata;
		};
		
		this.add = function(count) {
			this.count += count || 1;
		};
		
		this.remove = function(count) {
			this.count -= count || 1;
		};
		
		this.getItem = function() {
			return this.itemId;
		};
		
		this.setItem = function(id) {
			this.itemId = id;
		};
		
		this.getCount = function() {
			return this.count;
		};
		
		this.setMetadata = function(data) {
			this.metadata = data;
		};
		
		this.getMetadata = function(data) {
			return this.metadata;
		};
		
		this.clear = function() {
			this.itemId = undefined;
			this.count = 0;
			this.metadata = undefined;
		};
	};

	return {
		create: function() { return new StorageSlot(); }
	}
});