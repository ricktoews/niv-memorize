<?php
class User {
	function __construct($userid) {
		$this->data = self::retrieveUser($userid);
		self::updateLogin($this->data['id']);
	}

	public function get() {
		return $this->data;
	}

	private static function retrieveUser($userid) {
        global $dbh;
		$sql = "SELECT id, created, last_login FROM users WHERE fb_userid=:userid";
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam(':userid', $userid);
		$stmt->execute();
		$stmt->bindColumn('id', $id);
		$stmt->bindColumn('created', $created);
		$stmt->bindColumn('last_login', $last_login);
		if ($stmt->fetch(PDO::FETCH_BOUND)) {
			$data = array(
				'id' => $id,
				'created' => $created,
				'last_login' => $last_login
			);
		}
		else {
			$data = self::create($userid);
		}

		return $data;
	}

	private static function updateLogin($id) {
		global $dbh;
		$now = date('Y-m-d H:i:s');
		$sql = "UPDATE users SET last_login=:now WHERE id=:id";
		$stmt = $dbh->prepare($sql);
		$params = array('now' => $now, 'id' => $id);
		$result = $stmt->execute($params);
		return $result;
	}

	private static function create($userid) {
		global $dbh;
		$now = date('Y-m-d H:i:s');
		$sql = "INSERT INTO users (fb_userid, created, last_login) VALUES (:userid, :created, :last_login)";
		$stmt = $dbh->prepare($sql);
		$params = array('userid' => $userid, 'created' => $now, 'last_login' => $now);
		$stmt->execute($params);
		$data = array(
			'id' => $dbh->lastInsertId(),
			'created' => $now,
			'last_login' => $now,
		);
		return $data;
	}
}
