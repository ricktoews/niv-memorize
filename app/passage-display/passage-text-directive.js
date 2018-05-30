angular.module('Memorize')

	.directive('passageText', function(KeyStrokeHelper, PassageParseHelper, drill) {
		var text;
		var wrong, wrongNdx = 0;
		var entryCorrect = true;
		var currentVerse, previousVerse; // Current and previous verse elements.
		var inputFields, lastInputField;
		var isShiftOn = false;
		var nextElId, prevElId;
		var nextInputField, prevInputField;
		var verseId;
		var latestKeydownEvent;

		function getKey(evt) {
			latestKeydownEvent = evt;

			var key = evt.which;
			if (key === 9) {
				handleTab();
			}
			else if (isEndOfWord(key)) {
				checkEntry();
			}

			KeyStrokeHelper.storeKey(key);
			return false;
		}

		function isCurrentVerse(el) {
			return el === currentVerse;
		}

		function getElId(evtObj) {
			if (isCurrentVerse(evtObj.currentTarget)) return true;
			previousVerse = currentVerse;
			currentVerse = evtObj.currentTarget;
//			isShiftOn = evtObj.shiftKey; // Leave shift key off for now. This isn't the right place to check it.
			if (currentVerse.id) {
				var ndx = parseInt(currentVerse.dataset.verse);
				nextElId = getNextElId(ndx);
				prevElId = getPrevElId(ndx);
				verseId = currentVerse.dataset.verseId;
			}
		}

		function getNextElId(ndx) {
			var id = 'verse-' + (ndx+1)
			if (document.getElementById(id))
				return id;
			else
				return 'verse-1';
		}

		function getPrevElId(ndx) {
			if (ndx > 1)
				return 'verse-' + (ndx-1);
			else
				return 'text-1';
		}

		function getNextPrevInputFields(el) {
			var result = -1;
			inputFields.forEach(function(item, ndx) {
				if (item === el) {
					nextInputField = inputFields[ndx+1] || null;
					prevInputField = inputFields[ndx-1] || null;
					result = wrong[ndx];
				}
			});
			return result;
		}

		function processInputField(el) {
			var ndx = getNextPrevInputFields(el);
			var word = el.value;
			if (PassageParseHelper.isWordMatch(ndx, word)) {
				if (el === lastInputField) {
					drill.saveRemedial(verseId);
					console.log('Move to next verse.');
					navToNext();
				}
				else
					navToNextInputField(el);
			}
			else {
				console.log('Entry is incorrect: retry.');
			}
			
		}

		function navToNextInputField(el) {
			if (isShiftOn) {
				focusInputField(prevInputField);
			}
			else {
				focusInputField(nextInputField);
			}
		}

		function focusInputField(el) {
			el.focus();
		}

		function handleTab() {
			latestKeydownEvent.preventDefault();
			var el = latestKeydownEvent.target;
			if (el.tagName === 'INPUT') {
				processInputField(el);
			}
			else {
				navToNext();
			}
		}

		function navToNext() {
			restoreText();
			latestKeydownEvent && latestKeydownEvent.preventDefault();
			if (isShiftOn) {
				focusText(prevElId);
			} else {
				focusText(nextElId);
			}
		}

		function focusText(id) {
			var el = document.getElementById(id);
			presentField(el);			
		}

		function isEndOfWord(key) {
			return KeyStrokeHelper.isPunctuation(key) || KeyStrokeHelper.isSpace(key);
		}

		function checkEntry() {
			var verseNum = currentVerse.dataset.verse;
			var result = PassageParseHelper.isMatch(verseNum, currentVerse.innerText);
			entryCorrect = result.correct;
			if (entryCorrect) {
				$(currentVerse).css('color', 'green');
				if (PassageParseHelper.isEntryComplete()) {
//					drill.save(verseId, -1);
					navToNext();
				}
			}
			else {
				$(currentVerse).css('color', 'red');
//				drill.save(verseId, result.incorrectNdx);
			}
		}

		function presentField(el) {
/*
			text = el.dataset.text;
			wrong = el.dataset.wrong.split('|')
						.map(function(item) { return parseInt(item,10); })
						.filter(function(item) { return !isNaN(item); });
			PassageParseHelper.parseText(el.dataset.text);
			el.className = 'rehearse-text';
			if (wrong.length > 0) {
				el.innerHTML = PassageParseHelper.addBlanks(wrong);
				inputFields = document.querySelectorAll('#' + el.id + ' input');
				lastInputField = inputFields[inputFields.length-1];
				document.querySelector('#' + el.id + ' input').focus();

			}
			else {
*/
				el.innerText = '';
				el.contentEditable = true;
				el.focus();
/*
			}
*/
		}

/*
		function constructPromptText(text, wrong) {
			if (!wrong || wrong.length === 0)
				return text;
			else {
				wrong.forEach(function(ndx, item) {
					
				});
			}
		}
*/

		function restoreText(el) {
			if (!el) {
				el = currentVerse;
			}
			el.contentEditable = false;
			el.className = 'text-input';
			var typedIn = el.innerText;
			el.innerHTML = PassageParseHelper.getPassage(el.dataset.verse);
		}

		return {
			restrict: 'AE',
			templateUrl: '/app/passage-display/enter-verse.tmpl.html',
			link: function(scope, el, attrs) {

				scope.firePresentField = function(evt) {
					var alreadyHere = isCurrentVerse(evt.currentTarget) ? true : false;
					getElId(evt);
					if (currentVerse && !alreadyHere) {
						presentField(currentVerse);
						previousVerse && restoreText(previousVerse);
					}
					return true;
				};

/*
				scope.fireRestoreText = function(evt) {
					var el = evt.currentTarget;
					if (el) {
						restoreText(el);
					}
					return false;
				};
*/
				scope.getKey = function(evt) {
					getElId(evt);
					getKey(evt);
				};
/*
				scope.adjustRemedial = function(evt) {
					var el = evt.currentTarget;
					var id = parseInt(el.id.substr(9), 10);
					scope.state = 'adjusting';
					var verseEl = el.parentNode.querySelectorAll('td')[2];
					var adjust = document.createElement('div');
					adjust.setAttribute('adjust-remedial', 'adjust-remedial');
					verseEl.appendChild(adjust);
console.log('adjustRemedial verse', verseEl);
				};
*/

/*
				scope.toggleRemedial = function(evt) {
					console.log('toggleRemedial', evt.currentTarget);
				}
*/
			}
		};
	});


