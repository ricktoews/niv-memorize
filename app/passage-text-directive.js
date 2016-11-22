	angular.module('Memorize')
	.directive('passageText', function(KeyStrokeHelper, PassageParseHelper, drill) {
		var text;
		var wrong, wrongNdx = 0;
		var entryCorrect = true;
		var currentVerse, previousVerse;
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
			if (currentVerse.id && currentVerse.id.substr(0,5) === 'text-') {
				var ndx = parseInt(currentVerse.id.substr(5), 10);
				nextElId = getNextElId(ndx);
				prevElId = getPrevElId(ndx);
				verseId = currentVerse.dataset.verseId;
			}
		}

		function getNextElId(ndx) {
			var id = 'text-' + (ndx+1)
			if (document.getElementById(id))
				return id;
			else
				return 'text-0';
		}

		function getPrevElId(ndx) {
			if (ndx > 0)
				return 'text-' + (ndx-1);
			else
				return 'text-0';
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
console.log('Go to previous verse.');
				focusText(prevElId);
			} else {
console.log('Go to next verse.');
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
			var result = PassageParseHelper.isMatch(currentVerse.innerText);
			entryCorrect = result.correct;
			if (entryCorrect) {
				$(currentVerse).css('color', 'green');
				if (PassageParseHelper.isEntryComplete()) {
console.log('entry is complete; saving and moving to next verse.');
					drill.save(verseId, -1);
					navToNext();
				}
			}
			else {
console.log('Entry not correct; should mark verse in some way.');
				$(currentVerse).css('color', 'red');
				drill.save(verseId, result.incorrectNdx);
			}
		}

		function presentField(el) {

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
				el.innerText = '';
				el.contentEditable = true;
				el.focus();
			}
		}

		function constructPromptText(text, wrong) {
			if (!wrong || wrong.length === 0)
				return text;
			else {
				wrong.forEach(function(ndx, item) {
					
				});
			}
		}

		function restoreText(el) {
			if (!el) {
				el = currentVerse;
			}
			el.contentEditable = false;
			el.className = '';
			var typedIn = el.innerText;
			el.innerHTML = el.dataset.text;
		}

		return {
			restrict: 'AE',
			template: '<div id="text-{{$index}}" ng-keydown="getKey($event)" ng-click="firePresentField($event)" contenteditable="false" ng-mouseout="fireRestoreText($event)" data-verse-id="{{item.verse_id}}" data-wrong="{{item.wrong.join(\'|\')}}" data-text="{{item.text}}">{{item.text}}</div>', 
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

				scope.fireRestoreText = function(evt) {
return false;
					var el = evt.currentTarget;
					if (el) {
						restoreText(el);
					}
					return false;
				};

				scope.getKey = function(evt) {
					getElId(evt);
					getKey(evt);
				};
			}
		};
	});


