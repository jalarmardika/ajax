<?php
header("Content-Type:application/json"); 
$koneksi = mysqli_connect("localhost","root","","api");

$response = [];
if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if (isset($_GET['id']) and $_GET['id'] != "") {
		$book = mysqli_query($koneksi, "SELECT * FROM books WHERE id='$_GET[id]' ");
		if (mysqli_num_rows($book) > 0) {
			$response = mysqli_fetch_assoc($book);
		} else{
			http_response_code(404);
			$response = [
				'message' => 'Book Not Found'
			];
		}
	} else{
		$books = mysqli_query($koneksi, "SELECT * FROM books");
		$response["data"] = [];
		while ($fetch = mysqli_fetch_assoc($books)) {
			$response["data"][] = $fetch;
		}
	}
} elseif ($_SERVER['REQUEST_METHOD'] == "POST") {
	if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER['CONTENT_TYPE'] != "application/json") {
		http_response_code(400);
		$response = [
			'message' => 'Bad Request'
		];
	} else{
		$input = json_decode(file_get_contents("php://input"), true);

		if (isset($input['title']) and isset($input['issued']) and isset($input['author']) and isset($input['publisher'])) {
			if ($input['title'] == "" || $input['issued'] == "" || $input['author'] == "" || $input['publisher'] == "") {
				http_response_code(422);
				$response = [
					'message' => 'Form is incomplete'
				];
			} else{
				$title = $input['title'];
				$issued = $input['issued'];
				$author = $input['author'];
				$publisher = $input['publisher'];
				mysqli_query($koneksi, "INSERT INTO books (title, issued, author, publisher) VALUES ('$title', '$issued', '$author', '$publisher') ");

				$response = [
					'message' => 'Data Saved Successfully'
				];
			}
		} else{
			http_response_code(422);
			$response = [
				'message' => 'Form is incomplete'
			];
		}
	}
} elseif ($_SERVER['REQUEST_METHOD'] == "PUT") {
	if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER['CONTENT_TYPE'] != "application/x-www-form-urlencoded") {
		http_response_code(400);
		$response = [
			'message' => 'Bad Request'
		];
	} else{
		parse_str(file_get_contents("php://input"), $_PUT);
		if (isset($_GET['id']) and isset($_PUT['title']) and isset($_PUT['issued']) and isset($_PUT['author']) and isset($_PUT['publisher'])) {
			if ($_GET['id'] == "" || $_PUT['title'] == "" || $_PUT['issued'] == "" || $_PUT['author'] == "" || $_PUT['publisher'] == "") {
				http_response_code(422);
				$response = [
					'message' => 'Form is incomplete'
				];
			} else{
				$id = $_GET['id'];
				$book = mysqli_query($koneksi, "SELECT * FROM books WHERE id='$id' ");
				if (mysqli_num_rows($book) > 0) {
					$title = $_PUT['title'];
					$issued = $_PUT['issued'];
					$author = $_PUT['author'];
					$publisher = $_PUT['publisher'];
					mysqli_query($koneksi, "UPDATE books SET title='$title',issued='$issued',author='$author',publisher='$publisher' WHERE id='$id' ");

					$response = [
						'message' => 'Data Updated Successfully'
					];
				} else{
					http_response_code(404);
					$response = [
						'message' => 'Book Not Found'
					];
				}
			}
		} else{
			http_response_code(422);
			$response = [
				'message' => 'Form is incomplete'
			];
		}
	}
} elseif ($_SERVER['REQUEST_METHOD'] == "DELETE") {
	if (isset($_GET['id'])) {
		$book = mysqli_query($koneksi, "SELECT * FROM books WHERE id='$_GET[id]' ");
		if (mysqli_num_rows($book) > 0) {
			mysqli_query($koneksi, "DELETE FROM books WHERE id='$_GET[id]' ");
			$response = [
				'message' => 'Data Deleted Successfully'
			];
		} else{
			http_response_code(404);
			$response = [
				'message' => 'Book Not Found'
			];
		}
	}else{
		http_response_code(422);
		$response = [
			'message' => 'Request is invalid'
		];
	}
} else{
	http_response_code(405);
	$response = [
		'message' => 'Method Not Allowed'
	];
}


echo json_encode($response);
?>