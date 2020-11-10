    <script src="js/sweetalert2.all.min.js"></script>
    <?php 
        $page = currentlyPage();
        if($page === "login" || $page === "crear-cuenta") {
            echo '<script src="js/form.js"></script>';
        }
    ?>
    
</body>
</html>