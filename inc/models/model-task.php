<?php include '../functions/conection.php';
    include '../functions/functions.php';
    
$action = $_POST['action'];


if($action === "crear") {

    $name_task = $_POST['nameTask'];
    $id_proyect = $_POST['idProyect'];
    

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
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }
    echo json_encode($answer);
}


if($action === "borrar") {

    $id_delete = $_POST['idToDelete'];
    $id_delete = str_replace('task:', '', $id_delete);


    try {
        $stmt = $conn->prepare("DELETE FROM task WHERE id = ?");
        $stmt->bind_param('i', $id_delete);
        $stmt->execute();

        if($stmt->affected_rows) {
            $answer = array(
                'answer' => 'success',
                'id_delete' => $id_delete,
                'action' => $action
            );
        }
        else {
            $answer = array(
                'answer' => 'error',
                'id_delete' => $id_delete,
                'action' => $action
            );
        }
    }
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }

    echo json_encode($answer);
}


if($action === "edit") {

    $name_edit = $_POST['nameToEdit'];
    $id_edit = $_POST['idToEdit'];
    $id_edit = (int)str_replace('task:', '', $id_edit);

    
    //change name in the DB with id
    try {
        $stmt = $conn->prepare("UPDATE task SET name = ? WHERE id = ?");
        $stmt->bind_param('si', $name_edit, $id_edit);
        $stmt->execute();

        if($stmt->affected_rows > 0) {
            $answer = array(
                'answer' => 'success',
                'name_edit' => $name_edit,
                'id_edit' => $id_edit
            );
        }
        else {
            $answer = array(
                'answer' => 'without changes',
                'name_edit' => $name_edit,
                'id_edit' => $id_edit
            );
        }

        $stmt->close();
        $conn->close();
    }
    catch(Exception $e) {
        $answer = array(
            "answer" => "error",
            "error: " => $e->getMessage()
        );
    }








    

    echo json_encode($answer);
}


if($action === "complete") {

    $id_complete = $_POST['idToComplete'];
    $id_complete = (int)str_replace('task:', '', $id_complete);

    $status = getStatus($id_complete);
    
    if($status === 0){
        $status = 1;
        try{
            $stmt = $conn->prepare("UPDATE task SET state = ? WHERE id = ?");
            $stmt->bind_param('ii', $status, $id_complete);
            $stmt->execute();

            if($stmt->affected_rows == 1){
                $status = 1;
                $answer = array(
                    'answer' => 'success',
                    'id_complete' => $id_complete,
                    'status' => $status,
                    'action' => $action
                );
            }
        }
        catch(Exception $e) {
            $answer = array(
                "answer" => "error",
                "error: " => $e->getMessage()
            );
        }
    }
    else{
        $status = 0;

        try{
            $stmt = $conn->prepare("UPDATE task SET state = ? WHERE id = ?");
            $stmt->bind_param('ii', $status, $id_complete);
            $stmt->execute();

            if($stmt->affected_rows == 1){
                $answer = array(
                    'answer' => 'success',
                    'id_complete' => $id_complete,
                    'status' => $status,
                    'action' => $action
                );
            }
        }
        catch(Exception $e) {
            $answer = array(
                "answer" => "error",
                "error: " => $e->getMessage()
            );
        }
    }

    echo json_encode($answer);
}



