<?php
class Sources {
    private $_db;
    private $_sourceList;

    public function __construct($type) {
        global $dbh;
        $this->_db = $dbh;
        if ($type == 'bible') {
            $this->_getBibleBooks(); 
        }
    }


    public function getSources() {
        return $this->_sourceList;
    }


    private function _getBibleBooks() {
        $sql = "
		    SELECT book_id, book_name, MAX(bible_chapter*1) AS chapters 
		      FROM bible_books 
		      JOIN bible_niv ON book_id=bible_bookid 
		  GROUP BY book_id 
		  ORDER BY book_id
		";
        $stmt = $this->_db->prepare($sql);
		$stmt->bindColumn('book_id', $id);
		$stmt->bindColumn('book_name', $name);
		$stmt->bindColumn('chapters', $chapters);
        $list = array();
        if ($stmt->execute()) {
			$stmt->bind_result($id, $name, $chapters);
            while ($row = $stmt->fetch()) {
                $list[] = array('id' => $id, 'name' => $name, 'chapters' => $chapters);
            }
        }
        $this->_sourceList = $list;
    }


}
