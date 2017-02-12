<?php
class TitleMatches {
	function __construct()
	{
	}

	public function get($str) {
		global $dbh;

        $sql = "
			SELECT book_id, book_name FROM bible_books
			WHERE book_name LIKE '$str%'
               ";

        $matches = array();
        $stmt = $dbh->prepare($sql);
		$stmt->bindColumn('book_id', $book_id);
		$stmt->bindColumn('book_name', $book_name);
        if ($stmt->execute()) {
            while ($stmt->fetch()) {
                $matches[] = array(
                    'book_id' => $book_id,
                    'book_name' => $book_name,
                );
            }
        }

        return $matches;
    }
}

