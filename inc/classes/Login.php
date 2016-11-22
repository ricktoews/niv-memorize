<?php
class Login {
	public static function login_with_fb($userid) {
		$data = self::getUserByFb($userid);
		self::updateLogin($data['id']);
		$_SESSION['user_id'] = $data['id'];

		return $data;
	}

	public static function getUserByFb($userid) {
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

	public static function logout() {
		setcookie(session_name(), '', 100);
		session_unset();
		session_destroy();
		$_SESSION = array();

		$status = 'success';
		$payload = array(
			'status' => $status
		);

		return $payload;
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

