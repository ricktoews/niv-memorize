function splitBy(delim, text) {
	var parts = text.split(delim);
	parts = parts.map(p => p.trim());
	parts = parts.filter(p => p.length > 2);

	return parts;
}

function excerptRandomChunk(text) {
	var words = text.split(/\s/);
	var SECTION_LENGTH = Math.min(8, words.length);
	var startNdx = Math.floor(Math.random() * (words.length - SECTION_LENGTH));
	var sectionWords = words.slice(startNdx, startNdx + SECTION_LENGTH);

	var excerpt = sectionWords.join(' ');
	return excerpt;
}

function excerptByPunctuation(text) {
	var parts, partNdx, part;

	// First, try splitting by sentence.
	parts = splitBy(/[!?.]/, text);
	partNdx = Math.floor(Math.random() * parts.length);
	part = parts[partNdx];

	// If only one sentence, split by other punctuation.
	if (parts.length === 1) {
		parts = splitBy(/[;,]/, text);
		partNdx = Math.floor(Math.random() * parts.length);
		part = parts[partNdx];
	}

	return part;
}

export function getExcerpt(text) {
	var excerpt;

	excerpt = excerptByPunctuation(text);
/*
	var excerptType = Math.floor(Math.random() * 2);
	switch (excerptType) {
		case 0:
			excerpt = excerptByPunctuation(text);
			break;

		case 1:
			excerpt = excerptRandomChunk(text);
			break;

	}
*/
	return excerpt;
}

