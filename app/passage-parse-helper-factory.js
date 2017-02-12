angular.module('Memorize')
.factory('PassageParseHelper', function() {
	var entryComplete = false;
	var reconstructable;
	var masterWordList;

	function stripPunctuation(str) {
		var stripped = str.replace(/\W/g, '*');
		stripped = stripped.replace(/\*+/g, ' ');
		return stripped;
	}

	function compileWordList(text) {
		text = text.replace('--', ' ');
		reconstructable = text.split(' ');
		var stripped = stripPunctuation(text);
		var words = stripped.toLowerCase().trim().split(' ');

		return words;
	}

	function textCompare(master, entered) {
		var wordNdx = 0;
		var correct = true;
		var incorrectNdx = -1;
		while (correct && wordNdx < entered.length) {
			correct = entered[wordNdx] === master[wordNdx];
			if (!correct) {
				incorrectNdx = wordNdx;
			}
			wordNdx++;
		}
		entryComplete = entered.length === master.length;

		return {
			correct: correct,
			incorrectNdx: incorrectNdx
		};	
	}

	return {
		parseText: function(passageText) {
			masterWordList = compileWordList(passageText);
		},

		isEntryComplete: function() {
			return entryComplete;
		},

		isMatch: function(enteredText) {
			var enteredWords = compileWordList(enteredText);
			var result = textCompare(masterWordList, enteredWords);			

			return result;
		},

		addBlanks: function(positions) {
			var withBlanks = reconstructable.slice(0);
			_.each(positions, function(pos) {
				var toReplace = withBlanks[pos];
				toReplace = toReplace.replace(/(\w+)/, '<input type="text" data-correct="">')
				withBlanks[pos] = toReplace;
			});
			return withBlanks.join(' ');
		},

		addSpans: function(wrong) {
			var withSpans = reconstructable.slice(0);
/*
			_.each(withSpans, function(item, pos) {
				var cls = wrong.indexOf(pos) !== -1 ? 'class="remedial"' : '';
				withSpans[pos] = item.replace(/(\w+)/, '<span ng-click="toggleRemedial($evt) " '+cls+' data-pos="'+pos+'">$1</span>');
			});
			return withSpans.join(' ');
*/
			return withSpans;
		},

		isWordMatch: function(ndx, word) {
			var result = masterWordList[ndx] === word.toLowerCase();
			return result;
		}
	};
});


