<?php 
    include 'inc/functions/session.php';
    include 'inc/templates/header.php';
    include 'inc/templates/bar.php'; 

    $id_proyect = $_GET['id_return'];
    $name_proyect = currentlyProyect($id_proyect);

    if(isset($_GET['id_return'])) {
        if(!checkUser($_SESSION['id'], $id_proyect)) {
            echo "<script language=\"javascript\">window.location.href=\"index.php\";</script>";
        }
    }
    
?>

<div class="contenedor">

    <?php include 'inc/templates/sidebar.php'; ?>

    <main class="contenido-principal">
        
        <?php if($name_proyect): ?>
        
            <h1>Página actual: <span><?php echo $name_proyect; ?></span></h1>
            <form action="index.php?id_return=<?php echo $id_proyect; ?>" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="<?php echo $id_proyect ?>" class="id_proyect" value="<?php echo $id_proyect ?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>
            
        <?php else:

            echo "<h1>Seleccione un Proyecto de la izquierda</h1>";

        endif; ?>

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
                <?php $tasks = getTasks($id_proyect);

                if($tasks->num_rows > 0):
                    foreach($tasks as $task): ?>
                        

                        <li style="order: <?php echo $task['order_show']; ?>" id="task:<?php echo $task['id'] ?>" class="tarea">
                            <p><?php echo $task['name'] ?></p>
                            <div id="order<?php echo $task['order_show']; ?>" class="acciones">
                                <i class="far fa-edit"></i>
                                <i class="far fa-check-circle <?php if(getStatus($task['id']) == 1) echo "complete"; ?>"></i>
                                <i class="fas fa-trash"></i>
                                <div class="up-down">
                                    <i class="fas fa-arrow-up"></i>
                                    <i class="fas fa-arrow-down"></i>
                                </div>
                            </div>
                        </li>  
                        
                    <?php endforeach; 
                else: ?>
                
                    <li id="no-task">
                        <p>No hay Tareas</p>
                    </li>  

                <?php endif; ?>

                
            </ul>
        </div>
    </main>
</div><!--.contenedor-->

<?php include 'inc/templates/footer.php'; ?>