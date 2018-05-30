angular.module('Memorize')
.factory('PassageParseHelper', function() {
	var entryComplete = false;
	var reconstructable;
	var masterWordList;
	var masterWordListByVerse = {};
	var masterTextObj = {};

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



	var registerPassage = function(textObjs) {
		textObjs.forEach(obj => {
			masterTextObj[obj.verse] = obj.text;
			parseMasterText(obj.verse, obj.text);
		});
	};

	var getPassage = function(verseNum) {
		if (!verseNum) {
			return masterTextObj;
		}
		else {
			return masterTextObj[verseNum];
		}
	};

	var parseMasterText =  function(verseNum, passageText) {
		masterWordListByVerse[verseNum] = compileWordList(passageText);
	};

	// Expected to become obsolete.
	var parseText =  function(passageText) {
		masterWordList = compileWordList(passageText);
	};

	var isEntryComplete = function() {
		return entryComplete;
	};

	var isMatch = function(verseNum, enteredText) {
		parseText(masterTextObj[verseNum]);
		var enteredWords = compileWordList(enteredText);
		var result = textCompare(masterWordList, enteredWords);			

		return result;
	};

	var addBlanks = function(positions) {
		var withBlanks = reconstructable.slice(0);
		_.each(positions, function(pos) {
			var toReplace = withBlanks[pos];
			toReplace = toReplace.replace(/(\w+)/, '<input type="text" data-correct="">')
			withBlanks[pos] = toReplace;
		});
		return withBlanks.join(' ');
	};

	var addSpans = function(wrong) {
		var withSpans = reconstructable.slice(0);
/*
			_.each(withSpans, function(item, pos) {
				var cls = wrong.indexOf(pos) !== -1 ? 'class="remedial"' : '';
				withSpans[pos] = item.replace(/(\w+)/, '<span ng-click="toggleRemedial($evt) " '+cls+' data-pos="'+pos+'">$1</span>');
			});
			return withSpans.join(' ');
*/
		return withSpans;
	};

	var isWordMatch = function(ndx, word) {
		var result = masterWordList[ndx] === word.toLowerCase();
		return result;
	};

	return {
		registerPassage: registerPassage,
		getPassage: getPassage,
		parseText: parseText,
		isEntryComplete: isEntryComplete,
		isMatch: isMatch,
		addBlanks: addBlanks,
		addSpans: addSpans,
		isWordMatch: isWordMatch
	};
});


