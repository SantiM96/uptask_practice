<?php

function authenticated_user() {
    if(!check_user()) {
        header('Location:login.php');
        exit();
    }
}
function check_user() {
    return isset($_SESSION['name']);
}
session_start();
authenticated_user();