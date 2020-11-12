<?php


$name_task = $_POST['nameTask'];
$id_proyect = $_POST['idProyect'];
$action = $_POST['action'];


include '../functions/conection.php';

try{
    $stmt = $conn->prepare("INSERT INTO task (name, id_proyect) VALUES (?, ?)");
    $stmt->bind_param('si', $name_task, $id_proyect);
    $stmt->execute();

    if($stmt->affected_rows) {
        $answer = array(
            'answer' => 'success',
            'name_task' => $name_task,
            'id_proyect' => $id_proyect,
            'id_task' => $stmt->insert_id,
            'action' => $action
        );
    }
}
catch(Exception $e){
    $answer = array(
        'answer' => 'error',
        'error' => $e->getMessage()
    );
}











echo json_encode($answer);

