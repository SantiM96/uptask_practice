<?php

$user = $_POST['user'];
$password = $_POST['password'];
$action = $_POST['action'];

/*$datos = array(
    'user' => $user,
    'pass' => $password,
    'action' => $action
);
echo json_encode($datos);*/

// die(json_encode($action));



if($action === 'crear') {

    //hash password
    $options = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $options);

    include '../functions/conection.php';
    
    try{
        //check if username is already in use
        $stmt = $conn->prepare("SELECT user FROM users WHERE user = ?");
        $stmt->bind_param('s', $user);
        $stmt->execute();

        $stmt->bind_result($name_user);
        $stmt->fetch();
        if($name_user) {
            $answer = array(
                'answer' => 'error',
                'error' => 'Usuario existente',
                'type' => $action
            );
        }
        else {
            //create a new user
            try {
                $stmt = $conn->prepare("INSERT INTO users (user, password) VALUES (?, ?) ");
                $stmt->bind_param('ss', $user, $hash_password);
                $stmt->execute();
                if($stmt->affected_rows) {
                    $answer = array(
                        'answer' => 'success',
                        'insert_id' => $stmt->insert_id,
                        'type' => $action
                    );
                }
                $stmt->close();
            }
            catch(Exception $e) {
                $answer = array(
                    'answer' => 'error',
                    'error' => $e->getMessage(),
                    'type' => $action
                );
            }
            $conn->close();
        }


    }
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage(),
            'type' => $action
        );
    }
    
    echo json_encode($answer);


}

if($action === 'login') {

    include '../functions/conection.php';

    try{
        $stmt = $conn->prepare("SELECT id, user, password FROM users WHERE user = ?");
        $stmt->bind_param('s', $user);
        $stmt->execute();

        //login user
        $stmt->bind_result($id_user, $name_user, $pass_user);
        $stmt->fetch();
        if($name_user) {
            if(password_verify($password, $pass_user)) {
                $answer = array(
                    'answer' => 'success',
                    'id' => $id_user,
                    'name' => $name_user,
                    'pass' => $pass_user
                );
                session_start();
                $_SESSION['name'] = $name_user;
                $_SESSION['id'] = $id_user;
                $_SESSION['login'] = true;
            }
            else {
                $answer = array(
                    'answer' => 'error',
                    'error' => 'El password es incorrecto',
                    'type' => $action
                );
            }
        }
        else {
            $answer = array(
                'answer' => 'error',
                'error' => 'El usuario no existe',
                'type' => $action
            );
        }
        $stmt->close();
    }
    catch(Exception $e) {
        $answer = array(
            'answer' => 'error',
            'error' => $e->getMessage(),
            'type' => $action
        );
    }
    $conn->close();

    echo json_encode($answer);
}






