<?php

    function currentlyPage() {
        $serverName = basename($_SERVER['PHP_SELF']);
        $pageName = str_replace(".php", "", $serverName);

        return $pageName;
    }

    function getProyects() {
        include 'conection.php';

        try {
            return $conn->query("SELECT id, proyect FROM proyects");
        }
        catch(Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    function currentlyProyect($id = null) {
        include 'conection.php';

        try {
            $stmt = $conn->prepare("SELECT proyect FROM proyects WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $stmt->bind_result($proyect);
            $stmt->fetch();
            
            return $proyect;
        }
        catch(Exception $e) {
            echo "Error: " . $e->getMessage();
            return "No se consiguió el nombre del proyecto";
        }

    }

    function getTasks($id = null) {
        include 'conection.php';

        try {
            return $conn->query("SELECT id, name FROM task WHERE id_proyect = {$id}");
        }
        catch(Exception $e) {
            echo "Error: " . $e->getMessage();
            return "No se consiguieron las tareas";
        }
    }



