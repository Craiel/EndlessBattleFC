declare('SaveKeys', function() {
	return {
		idnGameVersion: StrSha('version'),
		idnGameBattleLevel: StrSha('battleLevel'),
		idnGameBattleDepth: StrSha('battleDepth'),
		idnName: StrSha('name'),
		idnLevel: StrSha('level'),
		idnPlayerBaseStats: StrSha('playerBaseStats'),
		idnPlayerSkillPoints: StrSha('playerSkillPoints'),
        idnPlayerStatPoints: StrSha('playerStatPoints'),
		idnPlayerStorageSlots: StrSha('playerStorageSlots'),
        idnPlayerInventoryPurchased: StrSha('playerInventoryPurchased'),
		idnPlayerEquipment: StrSha('playerEquipment'),
		idnMercenariesPurchased: StrSha('mercPurchased'),

        idnPlayerEquip: StrSha('playerEquip'),

        idnNextItemId: StrSha('nextItemId'),

        idnSettingsInternalInfoToConsole: StrSha('setIntInfoToConsole'),
        idnSettingsInternalWarningToConsole: StrSha('setIntWarningToConsole'),

		///// Potentially remove:
		idnMercenaryUpdateTime: StrSha('mercUpdateTime')
	};
});
