<aside class="contenedor-proyectos">
        <div class="panel crear-proyecto">
            <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
        </div>
    
        <div class="panel lista-proyectos">
            <h2>Proyectos</h2>
            <ul id="proyectos">
                <?php 

                    $proyects = getProyects();

                    if($proyects) {
                        foreach($proyects as $proyect) { ?>

                            <li>
                                <a href="index.php?id_return=<?php echo $proyect['id']; ?>" id="<?php echo $proyect['id']; ?>"" class="link">
                                    <?php echo $proyect['proyect']; ?>
                                </a>
                                <i class="fas fa-minus-circle"></i>
                            </li>

                            <?php 
                        }
                    }
                ?> 
            </ul>
        </div>
    </aside>