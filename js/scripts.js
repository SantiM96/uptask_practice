
eventLiseners();

const proyectList = document.querySelector('ul#proyectos');
const taskList = document.querySelector('.listado-pendientes ul');

function eventLiseners() { 
    //button for create a proyect
    document.querySelector('.crear-proyecto a').addEventListener('click', newProyect);


    //add task to the proyect
    if(document.querySelector('.nueva-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', addTask);
    }


    //delete proyects and href
    document.querySelector('#proyectos').addEventListener('click', deleteTask);


    //change status, delete or edit tasks with delegation
    document.querySelector('.listado-pendientes').addEventListener('click', modTask)
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

function addTask(e) { 
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
        let xhr = new XMLHttpRequest();

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
                        <i class="far fa-edit"></i>
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
}

function deleteTask(e) {
    e.preventDefault();
    let nameToDelete = e.target.parentNode.childNodes[1].textContent;


    if(e.target.classList.contains('link')) window.location.href = e.target.parentNode.childNodes[1].href;

    if(e.target.classList.contains('fa-minus-circle')) {
        swal({
            title: '¿Desea eliminar ' + nameToDelete + '?',
            text: 'Si borras "' + nameToDelete + '" se eliminará junto con todas las tareas asociadas',
            type: "warning",
            confirmButtonText: "Borrar",
            confirmButtonColor: "#fa0505",
            showCancelButton: true,
            cancelButtontext: "Cancelar",
        })
            .then(willDelete => {
                //redirect to the new URL
                if (willDelete.value) {
                
                    let idDeleteProyect = e.target.parentNode.childNodes[1].id;
                    
                    //delete asosied tasks
                    
                    //call ajax
                    let xhr = new XMLHttpRequest();

                    //send dates with the FormData
                    let dates = new FormData();
                    dates.append('id', idDeleteProyect);
                    dates.append('action', 'borrar');

                    //open conection
                    xhr.open('POST', 'inc/models/model-proyect.php', true);

                    //return dates
                    xhr.onload = function() { 
                        if (this.status == 200) { 
                            let answer = JSON.parse(xhr.responseText);

                            if(answer.answer_proyects === 'success' || answer.answer_task === 'success') { 
                                window.location.href = e.target.parentNode.childNodes[1].href;
                            }
                        }
                    }

                    //send dates
                    xhr.send(dates);


                    //delete proyect


                }
            });

    }
}

function modTask(e) {
    e.preventDefault();
    let idToComplete = e.target.parentNode.parentNode.id;


    //mark or unmark circle
    if (e.target.classList.contains('fa-check-circle')) {
        
        //call ajax
        let xhr = new XMLHttpRequest();

        //create FormData to send the dates
        let dates = new FormData();
        dates.append('idToComplete', idToComplete);
        dates.append('action', 'complete');


        //open conection
        xhr.open('POST', 'inc/models/model-task.php', true);

        //return dates
        xhr.onload = function () {
            if (this.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                if (e.target.classList.contains('complete')) {
                    e.target.classList.remove('complete');
                }
                else {
                    e.target.classList.add('complete');
                }
            }
        }

        //send dates
        xhr.send(dates);
        


        
    }


    //delete tasks
    if (e.target.classList.contains('fa-trash')) {

        let forDelete = e.target.parentNode.parentNode,
            parentDelete = forDelete.parentNode,
            idToDelete = forDelete.id,
            textToDelete = forDelete.childNodes[1].textContent;
        
        
        swal({
            title: "¿Estás seguro?",
            text: 'Deseas eliminar la tarea "' + textToDelete + '"',
            type: "warning",
            confirmButtonText: "Borrar",
            confirmButtonColor: "#fa0505",
            showCancelButton: true,
            cancelButtontext: "Cancelar",
        })
            .then(willDelete => {
                //redirect to the new URL
                if (willDelete.value) {
                    swal({
                        title: "Tarea Borrada",
                        text: 'La tarea "' + textToDelete + '" se ha borrado correctamente',
                        type: "success",
                    })

                    //delete the task from the DB

                    
                    //call ajax
                    let xhr = new XMLHttpRequest();

                    //create FormData to send the dates
                    let dates = new FormData();
                    dates.append('idToDelete', idToDelete);
                    dates.append('action', 'borrar');


                    //open conection
                    xhr.open('POST', 'inc/models/model-task.php', true);

                    //return dates
                    xhr.onload = function() {
                        if (this.status == 200) {
                            console.log(JSON.parse(xhr.responseText));

                            parentDelete.removeChild(forDelete);
                        }
                    }

                    //send dates
                    xhr.send(dates);
                }
            
            })
    }


    //edit tasks
    if (e.target.classList.contains('fa-edit')) {
        //console.log("quiero editar " + 
        //e.target.parentNode.parentNode.childNodes[1].textContent);

        if (document.querySelector('.listado-pendientes ul li input')) {
            swal({
                type: "warning",
                title: "Aguarde",
                text: 'Presione enter para guardar los cambios de la anterior tarea',
            })
        }
        else { 
        
            let oldText = e.target.parentNode.parentNode.childNodes[1].textContent,
                parentToReplace = e.target.parentNode.parentNode,
                oldName = e.target.parentNode.parentNode.childNodes,
                editTarget = e.target;


            //create input with the value from old text from the <p>
            let newInput = document.createElement('input'),
                PForInput = document.createElement('p');
            
            
            newInput.value = oldText;
            PForInput.appendChild(newInput);

            //remove <p> and replace for input
            parentToReplace.removeChild(oldName[1]);
            

            parentToReplace.prepend(PForInput);
            newInput.focus();

            //listening to the key pressed, waiting for it to be enter
            document.querySelector('.listado-pendientes ul li input').addEventListener('keypress', e => {
                let key = e.keyCode;
                
                if(key === 13) {

                    //call ajax
                    let xhr = new XMLHttpRequest();

                    //create FormDate to send dates
                    let dates = new FormData();
                    dates.append('idToEdit', idToComplete);
                    dates.append('nameToEdit', newInput.value);
                    dates.append('action', 'edit');


                    //open conection
                    xhr.open('POST', 'inc/models/model-task.php', true);

                    //return dates from model-task-php
                    xhr.onload = function() { 
                        if(this.status === 200) { 
                            console.log(JSON.parse(xhr.responseText));
                            let answer = JSON.parse(xhr.responseText);
                            parentToReplace.removeChild(PForInput);


                            let newP = document.createElement('p'),
                                filling = document.createElement('p');
                            
                        
                            newP.innerHTML = answer.name_edit;
                            filling.classList.add('none');


                            parentToReplace.prepend(newP);
                            parentToReplace.prepend(filling);
                        }
                    }

                    //send dates with the dates
                    xhr.send(dates);






                    

                }
            });
        }
        
        
        


    
    }

}

