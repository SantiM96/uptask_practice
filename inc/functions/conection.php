<?php

$conn = new mysqli('localhost', 'root', 'root', 'uptask');

if($conn->connect_error) {
    echo $conn->connect_error;
}


$mensaje = "Hola desde conection";
