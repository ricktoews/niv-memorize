<?php
class Drill {

	public static function saveResult($data) {
        global $dbh;
		$payload = array('status' => 'success');

		$result = self::getResultId($data);
		if ($result['id'] !== -1) {
			if ($result['session_id'] !== session_id()) {
				$payload = self::updateResult($result, $data);
			}
		}
		else {
			$payload = self::addResult($data);
		}

		return $payload;
	}

	public static function saveRemedial($data) {
		global $dbh;
		$payload = array('status' => 'success');

		$delete = array();
		$results = self::getRemedialId($data);
		foreach ($results as &$item) {
			$item['tally'] -= 1;
			if ($item['tally'] <= 0) {
				$delete[] = $item['id'];
			}
		}
		self::updateRemedial($results);
		if (sizeof($delete) > 0) {
			self::deleteRemedial($delete);
		}

		return $results;

	}

	private static function updateRemedial($data) {
		global $dbh;
		foreach ($data as $item) {
			$sql = "
				UPDATE drill_results
				SET tally=:tally
				WHERE id=:id
			";
			$stmt = $dbh->prepare($sql);
			$stmt->bindParam('tally', $item['tally']);
			$stmt->bindParam('id', $item['id']);
			$result = $stmt->execute();
		}

		return true;
	}

	private static function deleteRemedial($delete) {
		global $dbh;
		$ids = join(', ', $delete);
		$sql = "
			DELETE FROM drill_results WHERE id IN ($ids)
		";
		$stmt = $dbh->prepare($sql);
		$result = $stmt->execute();
		return $result;
	}

	private function getResultId($data) {
		global $dbh;

		$sql = "
			SELECT id, tally, session_id FROM drill_results
			WHERE user_id=:user_id
			  AND text_table=:text_table
			  AND verse_id=:verse_id
			  AND position_wrong=:position_wrong
			";
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam('user_id', $data->user_id);
		$stmt->bindParam('text_table', $data->text_table);
		$stmt->bindParam('verse_id', $data->verse_id);
		$stmt->bindParam('position_wrong', $data->position_wrong);
		$result = $stmt->execute();
		$stmt->bindColumn('id', $id);
		$stmt->bindColumn('tally', $tally);
		$stmt->bindColumn('session_id', $session_id);
		$stmt->fetch(PDO::FETCH_BOUND);
		$payload = array(
			'id' => isset($id) ? $id*1 : -1,
			'tally' => $tally*1,
			'session_id' => $session_id
		);

		return $payload;
	}

	private function getRemedialId($data) {
		global $dbh;

		$sql = "
			SELECT id, tally, session_id FROM drill_results
			WHERE user_id=:user_id
			  AND text_table=:text_table
			  AND verse_id=:verse_id
		";

		$stmt = $dbh->prepare($sql);
		$stmt->bindParam('user_id', $data->user_id);
		$stmt->bindParam('text_table', $data->text_table);
		$stmt->bindParam('verse_id', $data->verse_id);
		$result = $stmt->execute();
		$stmt->bindColumn('id', $id);
		$stmt->bindColumn('tally', $tally);
		$stmt->bindColumn('session_id', $session_id);
		$payload = array();
		while ($stmt->fetch(PDO::FETCH_BOUND)) {
			$payload[] = array(
				'id' => isset($id) ? $id*1 : -1,
				'tally' => $tally*1,
				'session_id' => $session_id
			);
		}

		return $payload;
	}

	private function updateResult($result, $data) {
		global $dbh;

		$id = $result['id'];
		$tally = $result['tally'] + 1;

		$date = isset($data->date) ? $data->date : date('Y-m-d H:i:s');
		$sql = "
			UPDATE drill_results
			SET tally=:tally,
				date=:date,
				session_id=:session_id
			WHERE id=:id
		";
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam('tally', $tally);
		$stmt->bindParam('date', $date);
		$stmt->bindParam('session_id', session_id());
		$stmt->bindParam('id', $id);
		$result = $stmt->execute();
		if ($stmt->execute()) {
			$payload = array(
				'status' => 'success',
				'session' => session_id(),
			);
		}
		else {
			$payload = array(
				'status' => 'failure',
			);
		}
		
		return $payload;
	}

	private function addResult($data) {
		global $dbh;

		$date = isset($data->date) ? $data->date : date('Y-m-d H:i:s');

		$sql = "
			INSERT INTO drill_results (user_id, text_table, verse_id, position_wrong, tally, date, session_id) 
			VALUES (:user_id, :text_table, :verse_id, :position_wrong, 1, :date, :session_id)
		";
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam('user_id', $data->user_id);
		$stmt->bindParam('text_table', $data->text_table);
		$stmt->bindParam('verse_id', $data->verse_id);
		$stmt->bindParam('position_wrong', $data->position_wrong);
		$stmt->bindParam('date', $date);
		$stmt->bindParam('session_id', session_id());
		if ($stmt->execute()) {
			$payload = array(
				'status' => 'success',
				'session' => session_id(),
			);
		}
		else {
			$payload = array(
				'status' => 'failure',
			);
		}
		
		return $payload;
	}

	public static function checkPreviousDrill($user_id, $text_table, $verse_id) {
		global $dbh;

		$payload = array();
		$sql = "
			SELECT position_wrong, date FROM drill_results
			WHERE user_id=:user_id
			  AND text_table=:text_table
			  AND verse_id=:verse_id
			ORDER BY position_wrong
		";
		$stmt = $dbh->prepare($sql);
		$stmt->bindParam('user_id', $user_id);
		$stmt->bindParam('text_table', $text_table);
		$stmt->bindParam('verse_id', $verse_id);
		$stmt->execute();
		$stmt->bindColumn('position_wrong', $position_wrong);
		$stmt->bindColumn('date', $date);
		while ($stmt->fetch(PDO::FETCH_BOUND)) {
			$payload[] = array(
				'position_wrong' => 1*$position_wrong,
				'date' => $date,
			);
		}

		return $payload;
	}

	public static function getWrongPositions($user_id, $text_table, $verse_id) {
		$data = self::checkPreviousDrill($user_id, $text_table, $verse_id);
		$positions = array();
		foreach ($data as $rec) {
			if ($rec['position_wrong'] > -1) {
				$positions[] = $rec['position_wrong'];
			}
		}

		return $positions;
	}
}
