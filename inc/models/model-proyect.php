<?php

$proyect = $_POST['proyect'];
$action = $_POST['action'];

include '../functions/conection.php';

try {
    $stmt = $conn->prepare("INSERT INTO proyects (proyect) VALUE (?)");
    $stmt->bind_param('s', $proyect);
    $stmt->execute();

    if($stmt->affected_rows) {
        $answer = array(
            'answer' => 'success',
            'proyect' => $proyect,
            'id_return' => $stmt->insert_id
        );
    }

    $stmt->close();
}
catch(Exception $e) {
    $answer = array(
        'answer' => 'error',
        'error' => $e->getMessage()
    );
}

$conn->close();


echo json_encode($answer);