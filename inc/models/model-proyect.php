<?php

$action = $_POST['action'];

include '../functions/conection.php';

if($action === "crear") {
    $proyect = $_POST['proyect'];
    $id_user = $_POST['idUser'];

    try {
        $stmt = $conn->prepare("INSERT INTO proyects (proyect, id_user) VALUE (?, ?)");
        $stmt->bind_param('si', $proyect, $id_user);
        $stmt->execute();

        if($stmt->affected_rows) {
            $answer = array(
                'answer' => 'success',
                'proyect' => $proyect,
                'id_user' => $id_user,
                'id_return' => $stmt->insert_id
            );
        }

        $stmt->close();
        $conn->close();
    }
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }
    echo json_encode($answer);
}


if($action === "borrar") {

    $id = $_POST['id'];

    //delete tasks
    try {
        $stmt = $conn->prepare("DELETE FROM task WHERE id_proyect = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();

        if($stmt->affected_rows > 0) {
            $answer = array(
                'answer_task' => 'success',
                'id_deleted_task' => $id
            );
        }
        $stmt->close();

    }
    catch(Exception $e){
        $answertask = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }


    //delete proyect
    try {
        $stmt = $conn->prepare("DELETE FROM proyects WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();

        if($stmt->affected_rows > 0) {
            $answer['answer_proyects'] = 'success';
            $answer['id_deleted_proyect'] = $id;
        }

        $stmt->close();
        $conn->close();
    }
    catch(Exception $e){
        $answertask = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }


    echo json_encode($answer);

}




