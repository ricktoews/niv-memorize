angular.module('Memorize')
.factory('KeyStrokeHelper', function() {
	var punctuation = ',.!?();:"';
	var punctCodes = [
		188, // ,
		190, // .
		49,  // !
		191, // ?
		57,  // (
		48,  // )
		186  // ;:
	];
	var singleQuote = 222;
	var dash = 189;
	var spaceKeys = [13, 32];
	var letterKey = {
		min: 65,
		max: 90
	};

	var lastKey;
	var twoKeysBack;

	function isLetter(code) {
		return code >= letterKey.min && code <= letterKey.max;
	}

	function isSingleQuote(key) {
		var isApostrophe = isLetter(twoKeysBack) && lastKey === singleQuote && isLetter(key);
		var result = (lastKey === singleQuote && isApostrophe === false);
		return result;
	}

	function isDash(key) {
		var result = (lastKey === dash && key === dash);
		return result;
	}

	return {
		isPunctuation: function(key) {
			if (punctCodes.indexOf(key) !== -1) {
				return true;
			}
			else if (isSingleQuote(key) || isDash(key)) {
				return true;
			}
		},

		isSpace: function(key) {
			return spaceKeys.indexOf(key) !== -1;
		},

		storeKey: function(key) {
			twoKeysBack = lastKey;
			lastKey = key;
		},

		lastKey: function() {
			return {lastKey: lastKey, twoKeysBack: twoKeysBack };
		}
	};
});


