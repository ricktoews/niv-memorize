const finalCharList = [...'.,!?;: \''];
const firstCharList = ['"\''];
const finalCharRe = new RegExp('[' + finalCharList.join('') + ']', 'g');
const firstCharRe = new RegExp('[' + firstCharList.join('') + ']', 'g');


const wordChar = /[-'\w]/
function altGetWordList(str) {
  var wordList = [];
  for (let i = 0; i < str.length; i++) {
    if (wordChar.test(str[i])) {
    }
  }
}


const finalCharsList = ['--'];
function isWordDivider(str) {
  str = str.replace(String.fromCharCode(160), ' ');
  var result = false;
  var finalChars = str.length > 1 ? str.substr(-2) : '';

  var finalChar = str.substr(-1);
  if (finalCharRe.test(finalChar)) {
    result = true;
  } else if (finalCharsList.indexOf(finalChars) !== -1) {
    result = true;
  }
  return result;
}

function getWordList(str) {
  str = str.replace(String.fromCharCode(160), ' ');
  str = str.replace(finalCharRe, ' ');
  str = str.replace(firstCharRe, ' ');
  str = str.replace(/--/g, ' ');
  var wordList = str.split(' ').filter(w => w.length);

  return wordList; 
}

function markCorrect(word) {
  return { correct: true, word };
}

function markIncorrect(word) {
  return { correct: false, word };
}

function memCompare(entered, auth) {
  var result = [];
  var status = [];
  for (let i = 0; i < entered.length; i++) {
    result[i] = entered[i].toUpperCase() === auth[i].toUpperCase();
    status[i] = result[i] ? markCorrect(auth[i]) : markIncorrect(entered[i]);
  }
  return status;
}

function isBlockFinished(status, memTextWords) {
  var incorrectList = status.filter(item => !item.correct);
  return (status.length === memTextWords.length && incorrectList.length === 0);
}

export { isWordDivider, getWordList, memCompare, isBlockFinished };

