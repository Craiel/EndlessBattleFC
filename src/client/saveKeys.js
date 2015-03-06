declare('SaveKeys', function() {
	return {
		idnGameVersion: StrSha('version'),
		idnGameBattleLevel: StrSha('battleLevel'),
		idnGameBattleDepth: StrSha('battleDepth'),
		idnName: StrSha('name'),
		idnLevel: StrSha('level'),
		idnPlayerBaseStats: StrSha('playerBaseStats'),
		idnPlayerSkillPoints: StrSha('playerSkillPoints'),
		idnPlayerStorageSlots: StrSha('playerStorageSlots'),
		idnMercenariesPurchased: StrSha('mercPurchased'),



		///// Potentially remove:
		idnMercenaryUpdateTime: StrSha('mercUpdateTime')
	};
});
