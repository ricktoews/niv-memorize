<?php
class Verse {
    private $memorize_connect, $version_table;
    private $_db;

    function __construct($bible_table, $bookname, $bookid, $chapter, $verse)
    {
        global $dbh;
        $this->_db = $dbh;
        static $seq = 0;
        $this->memorize_connect = $memorize_connect;
        $this->version_table = $bible_table;
        $this->bookname = $bookname;
        $this->bookid = $bookid;
        $this->chapter = $chapter;
        $this->verse = $verse;
        $this->seq = $seq++;
        $this->reference = "$this->bookname $this->chapter:$this->verse";
        $this->getScriptureText();
    }


    function getScriptureText()
    {
        $params = array();
        if (preg_match("/^(\d+)-(\d+)$/", $this->verse, $matches)) {
            $versesearch = " AND bible_verse BETWEEN ? AND ? ORDER BY bible_verse ";
            array_unshift($params, $matches[2], $matches[1]);
        }
        else {
            $versesearch = " AND bible_verse=? ";
            array_unshift($params, $this->verse);
        }
        $sql = "SELECT * FROM $this->version_table
                INNER JOIN bible_books ON bible_bookid=book_id
                WHERE book_name=?
                  AND bible_chapter=?
                  $versesearch
               ";

        array_unshift($params, $this->bookname, $this->chapter);

        $stmt = $this->_db->prepare($sql);
        if ($stmt->execute($params)) {
            while ($data = $stmt->fetch()) {
                $texts[] = preg_replace('/"/', '', $row->bible_text);
            }
        }
        $this->text = implode(' ', $texts);
        return $this->text;
    }
}

