
eventLiseners();

const proyectList = document.querySelector('ul#proyectos');
const taskList = document.querySelector('.listado-pendientes ul');

function eventLiseners() { 
    //button for create a proyect
    document.querySelector('.crear-proyecto a').addEventListener('click', newProyect);

    //add task to the proyect
    if(document.querySelector('.nueva-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', addtask);
    }

    //change status or delete tasks with delegation
    document.querySelector('.listado-pendientes').addEventListener('click', modtask)
}

function newProyect(e) { 
    e.preventDefault();

    //create <input> with the proyect name
    let newProyect = document.createElement('li');
    newProyect.innerHTML = '<input type="text" id="new-proyect">';

    proyectList.appendChild(newProyect);
    document.getElementById('new-proyect').focus();

    //select new <input>
    let inputNewProyect = document.querySelector('#new-proyect');

    inputNewProyect.addEventListener('keypress', e => { 
        let key = e.keyCode;
        if(key == 13) {
            if(document.getElementById('new-proyect').value === "") {
                swal({
                    type: 'error',
                    title: 'Error',
                    text: 'El nombre del proyecto no puede estar vacío'
                })
            }
            else { 
                saveProyectDB(inputNewProyect.value);
                proyectList.removeChild(newProyect);
            }
            
        }
    });
}

function saveProyectDB(proyectName) {

    //call ajax
    let xhr = new XMLHttpRequest();

    //send dates by formdate
    let dates = new FormData();
    dates.append('proyect', proyectName);
    dates.append('action', 'crear');


    //open conection
    xhr.open('POST', 'inc/models/model-proyect.php', true);

    //return dates from model-proyect.php
    xhr.onload = function() { 
        if (this.status = 200) {
            let answer = JSON.parse(xhr.responseText);
            console.log(answer);

            let newProyect = document.createElement('li');
            newProyect.innerHTML = `
                <a href="index.php?id_return=${answer.id_return}" id="${answer.id_return}">
                    ${proyectName}
                </a>
            `;
            proyectList.appendChild(newProyect);

            //alert to create a new proyect
            swal({
                type: 'success',
                title: 'Proyecto Creado',
                text: 'El proyecto "' + proyectName + '" se ha creado correctamente'
            })
            .then(result => { 
                //redirect to the new URL
                if (result.value) window.location.href = 'index.php?id_return=' + answer.id_return;
            })
        }
    }
    //send dates
    xhr.send(dates);
}

function addtask(e) { 
    e.preventDefault();
    
    nameTask = document.querySelector('.nombre-tarea').value;
    idProyect = document.querySelector('.id_proyect').value;

    

    if(nameTask === "") {
        swal({
            type: 'error',
            title: 'Error',
            text: 'Ingrese un nombre a la tarea'
        })
    }
    else { 
        //call ajax
        let xhr = new XMLHttpRequest;

        //create FormDate
        let dates = new FormData();
        dates.append('nameTask', nameTask);
        dates.append('idProyect', idProyect);
        dates.append('action', 'crear');

        //open conection
        xhr.open('POST', 'inc/models/model-task.php', true);

        //return dates from model-task.php
        xhr.onload = function() {
            if (this.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                answer = JSON.parse(xhr.responseText);
                newTask = document.createElement('li');
                newTask.setAttribute("id", "task:" + answer.id_task);
                newTask.classList.add('tarea');
                
                newTask.innerHTML = `
                    <p>${answer.name_task}</p>
                    <div class="acciones">
                        <i class="far fa-check-circle"></i>
                        <i class="fas fa-trash"></i>
                    </div>
                `;


                taskList.appendChild(newTask);
                if (document.getElementById('no-task')) { 
                    taskList.removeChild(document.getElementById('no-task'));
                }
                document.querySelector('.nombre-tarea').value = "";

                

            }
        }
        //send
        xhr.send(dates);
    }

    
    
    



    
    
   //console.log(idProyect);
    
}

function modtask(e) {
    e.preventDefault();


    //mark or unmark circle
    if(e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('complete')) {
            e.target.classList.remove('complete');
        }
        else {
            e.target.classList.add('complete');
        }
    }

    //delete task
    if(e.target.classList.contains('fa-trash')) {
        let forDelete = e.target.parentNode.parentNode,
            parentDelete = forDelete.parentNode,
            idToDelete = forDelete.id;
        
        parentDelete.removeChild(forDelete);
    }


    
}




