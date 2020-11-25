<?php include '../functions/conection.php';
    include '../functions/functions.php';
    
$action = $_POST['action'];


if($action === "crear") {

    $name_task = $_POST['nameTask'];
    $id_proyect = $_POST['idProyect'];
    $order = (int)$_POST['order'];
    

    try{
        $stmt = $conn->prepare("INSERT INTO task (name, id_proyect, order_show) VALUES (?, ?, ?)");
        $stmt->bind_param('sii', $name_task, $id_proyect, $order);
        $stmt->execute();

        if($stmt->affected_rows) {
            $answer = array(
                'answer' => 'success',
                'name_task' => $name_task,
                'id_proyect' => $id_proyect,
                'order' => $order,
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


if($action === "orders") {
    $task_id = $_POST['taskId'];
    $order = $_POST['newOrder'];

    try {
        $stmt = $conn->prepare("UPDATE task SET order_show = ? WHERE id = ?");
        $stmt->bind_param('ii', $order, $task_id);
        $stmt->execute();

        if($stmt->affected_rows) {
            $answer = array(
                'answer' => 'success',
                'id_reasigned' => $task_id,
                'new_id_reasigned' => $order
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
                'name_edited' => $name_edit,
                'id_edited' => $id_edit
            );
        }
        else {
            $answer = array(
                'answer' => 'without_changes',
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


if($action === "move") {
    
    $task_change = (int)$_POST['taskChange'];
    $order_change = (int)$_POST['orderChange'];
    $task_for_change = (int)$_POST['taskForChange'];
    $order_for_change = (int)$_POST['orderForChange'];
    
    /*$answer = array(
        'taskChange' => $task_change,
        'orderChange' => $order_change,
        'taskForChange' => $task_for_change,
        'orderForChange' => $order_for_change
    );*/
    
    try{
        $stmt = $conn->prepare("UPDATE task SET order_show = ? WHERE id = ?;");
        $stmt->bind_param('ii', $order_for_change, $task_change);
        $stmt->execute();

        if($stmt->affected_rows > 0) {
            $change_one = true;
        }

        $stmt->close();
    }
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage()
        );
    }
    try{
        $stmt = $conn->prepare("UPDATE task SET order_show = ? WHERE id = ?;");
        $stmt->bind_param('ii', $order_change, $task_for_change);
        $stmt->execute();

        if($stmt->affected_rows > 0) {
            $change_two = true;
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

    //answer
    if($change_one && $change_two) {
        $answer = array(
            'answer' => 'success',
            'task_changed' => $task_change,
            'task_changed_for' => $task_for_change,
            'order_changed' => $order_change,
            'order_changed_for' => $order_for_change
        );
    }
    else if($change_one){
        $answer = array(
            'answer' => 'error',
            'try_one' => 'fail'
        );
    }
    else {
        $answer = array(
            'answer' => 'error',
            'try_two' => 'fail'
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



