<?php
class Passage {
	private $_bible_table, $_book, $_book_id, $_chapter, $_verse;

	function __construct($book, $chapter = null, $verse = null)
	{
        global $dbh;
		global $maxverse;
        $this->_db = $dbh;
        $this->_bible_table = 'bible_niv';
        $this->_user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 11011;
		$ref = '';
		if ($chapter) $ref = $chapter;
		if ($verse) $ref .= ':' . $verse;
		if (gettype($book) == 'string') {
			$this->_book = $book;
			$this->_book_id = $this->_getBookId($book);
		}
		else
			$this->_book_id = $book;

		$this->_chapter = $chapter;
		$this->_verse = $verse;

		if (gettype($book) == 'string') {
			$this->_parseRef($ref);
		}
	}

	private function _parseRef($ref) {
		global $maxverse;
		$ref = preg_replace("/\s/", "", $ref);
		if (preg_match("/^(\d+):(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$chapter2 = $matches[1];
			$verse1 = $matches[2];
			$verse2 = $matches[2];
		}
		elseif (preg_match("/^(\d+):(\d+)-(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$chapter2 = $matches[1];
			$verse1 = $matches[2];
			$verse2 = $matches[3];
		}  
		elseif (preg_match("/^(\d+)-(\d+):(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$chapter2 = $matches[2];
			$verse1 = 1;
			$verse2 = $matches[3];
		}
		elseif (preg_match("/^(\d+):(\d+)-(\d+):(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$verse1 = $matches[2];
			$chapter2 = $matches[3];
			$verse2 = $matches[4];
		}
		elseif (preg_match("/^(\d+)-(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$verse1 = 1;
			$chapter2 = $matches[2];
			$verse2 = $maxverse["$this->_book_id $chapter2"];
		}
		elseif (preg_match("/^(\d+)$/", $ref, $matches)) {
			$chapter1 = $matches[1];
			$chapter2 = $matches[1];
			$verse1 = 1;
			$verse2 = $maxverse["$this->_book_id $chapter2"];
		}

		$this->verses = array();
		$c = $chapter1;
		$v = $verse1;
		while ($c <= $chapter2) {
            $this->verses[] = $this->loadPassageText($this->_bible_table, $this->_book, $this->_book_id, $c, $v);
			$v++;
			if ($v > $maxverse["$this->_book_id $c"] || $c == $chapter2 && $v > $verse2) {
				$c++;
				$v = 1;
			}
		}
	}


    function loadPassageText($bible_table, $book, $bookid, $c, $v)
    {
        if (preg_match("/^(\d+)-(\d+)$/", $v, $matches)) {
			$verse1 = $matches[2];
			$verse2 = $matches[1];

            $versesearch = " AND bible_verse BETWEEN $verse1 AND $verse2 ORDER BY bible_verse ";
        }
        else {
            $versesearch = " AND bible_verse=$v ";
        }
        $sql = "
			SELECT bible_id as verse_id, bible_bookid, bible_book, bible_chapter, bible_verse, bible_text FROM $bible_table
			INNER JOIN bible_books ON bible_bookid=book_id
			WHERE book_name=:name
			  AND bible_chapter=:chapter
			$versesearch
               ";

        $passage = array();
        $stmt = $this->_db->prepare($sql);
		$stmt->bindColumn(1, $verse_id);
		$stmt->bindColumn(2, $book_id);
		$stmt->bindColumn(3, $book);
		$stmt->bindColumn(4, $chapter);
		$stmt->bindColumn(5, $verse);
		$stmt->bindColumn(6, $text);
		$params = array(':name' => $book, ':chapter' => $c);
        if ($stmt->execute($params)) {
            while ($stmt->fetch()) {
                $passage = array(
                    'verse_id' => $verse_id,
                    'book_id' => $bookid,
                    'book' => $book,
                    'chapter' => $chapter,
                    'verse' => $verse,
                    'text' => preg_replace('/"/', '', $text),
					'wrong' => Drill::getWrongPositions($this->_user_id, $bible_table, $verse_id),
                );
            }
        }
//        $text = implode(' ', $texts);

        return $passage;
    }


    function getScriptureText() {
        return $this->verses;
    }


    private function _getBookId($name) {
        $sql = "SELECT book_id FROM bible_books WHERE book_name=:name";

        $stmt = $this->_db->prepare($sql);
		$stmt->bindColumn(1, $book_id);
		$params = array(':name' => $name);
        if ($stmt->execute($params)) {
            $stmt->fetch();
        }

        return $book_id;
    }


	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	function save($pattern) {
		$sql = "INSERT INTO passage_record (book_id, chapter, verse, pattern) VALUES (?, ?, ?, ?)";

		$stmt = $this->_db->prepare($sql);
		$stmt->bind_param('ddds', $this->_book_id, $this->_chapter, $this->_verse, $pattern);
		$result = $stmt->execute();
		$payload = array(
			'result' => $result,
			'book_id' => $this->_book_id,
			'chapter' => $this->_chapter,
			'verse' => $this->_verse,
			'pattern' => $pattern,
		);

		return $payload;
	}
}

