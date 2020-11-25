
eventLiseners();

const proyectList = document.querySelector('ul#proyectos');
const taskList = document.querySelector('.listado-pendientes ul');

function eventLiseners() { 

    //waiting to content loading
    document.addEventListener('DOMContentLoaded', function() { 
        updateProgress();
        if (document.querySelectorAll('#proyectos li').length > 10) document.querySelector('.contenedor-proyectos').classList.add('scroll');
    });


    //button for create a proyect
    document.querySelector('.crear-proyecto a').addEventListener('click', newProyect);


    //add task to the proyect
    if(document.querySelector('.nueva-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', addTask);
    }


    //delete proyects and href
    document.querySelector('#proyectos').addEventListener('click', deleteProyect);


    //change status, delete, edit or move tasks with delegation
    document.querySelector('.listado-pendientes').addEventListener('click', modTask);
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
                let idUser = document.querySelector('.barra p');
                saveProyectDB(inputNewProyect.value, idUser.id);
                proyectList.removeChild(newProyect);
            }
            
        }
    });
}

function saveProyectDB(proyectName, id) {

    //call ajax
    let xhr = new XMLHttpRequest();

    //send dates by FormData
    let dates = new FormData();
    dates.append('proyect', proyectName);
    dates.append('idUser', id);
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

function updateOrderDB(taskId, newOrder) { 

    //call ajax
    let xhr = new XMLHttpRequest();


    //use FormData to send dates
    let dates = new FormData();
    dates.append('taskId', taskId);
    dates.append('newOrder', newOrder);
    dates.append('action', 'orders')


    //open connection
    xhr.open('POST', 'inc/models/model-task.php', true);

    //return dates
    xhr.onload = function() { 
        if (this.status == 200) { 
            console.log(JSON.parse(xhr.responseText));
        }
    }

    //send dates
    xhr.send(dates);
}

function addTask(e) { 
    e.preventDefault();
    
    let nameTask = document.querySelector('.nombre-tarea').value,
        idProyect = document.querySelector('.id_proyect').value;

    if(document.querySelector('.tarea')) { 
        let orderBefore = document.querySelector('.tarea');
        console.log(orderBefore);
    }

    
    if(nameTask === "") {
        swal({
            type: 'error',
            title: 'Error',
            text: 'Ingrese un nombre a la tarea'
        })
    }
    else { 

        //create new order
        allOrders = document.querySelectorAll('ul .tarea');
        newOrderAdd = allOrders.length + 1


        //call ajax
        let xhr = new XMLHttpRequest();

        //create FormDate
        let dates = new FormData();
        dates.append('nameTask', nameTask);
        dates.append('idProyect', idProyect);
        dates.append('order', newOrderAdd);
        dates.append('action', 'crear');

        //open conection
        xhr.open('POST', 'inc/models/model-task.php', true);

        //return dates from model-task.php
        xhr.onload = function() {
            if (this.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                answer = JSON.parse(xhr.responseText);


                newTask = document.createElement('li');
                newTask.style.order = newOrderAdd;
                newTask.setAttribute("id", "task:" + answer.id_task);
                newTask.classList.add('tarea');
                
                
                newTask.innerHTML = `
                    <p>${answer.name_task}</p>
                    <div id="order${answer.order}" class="acciones">
                        <i class="far fa-edit"></i>
                        <i class="far fa-check-circle"></i>
                        <i class="fas fa-trash"></i>
                        <div class="up-down">
                            <i class="fas fa-arrow-up"></i>
                            <i class="fas fa-arrow-down"></i>
                        </div>
                    </div>
                `;


                taskList.appendChild(newTask);
                if (document.getElementById('no-task')) { 
                    taskList.removeChild(document.getElementById('no-task'));
                }
                document.querySelector('.nombre-tarea').value = "";

                //update progress bar
                updateProgress()
            }
        }
        //send
        xhr.send(dates);
    }  
}

function deleteProyect(e) {
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
                
                //update progress bar
                updateProgress()
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
            textToDelete = forDelete.childNodes[1].textContent,
            orderToDelete = parseInt(forDelete.childNodes[3].id.replace('order', '')),
            totalLongList = document.querySelectorAll('ul .tarea').length;

        
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


                            //adjust other orders
                            for (let i = (orderToDelete + 1); i <= totalLongList; i++) { 

                                let elementToRest = getElementByOrder(i),
                                    taskId = parseInt(elementToRest.id.replace('task:', '')),    
                                    elementOrderId = elementToRest.childNodes[3],
                                    newOrderNum = parseInt(elementToRest.style.order) - 1;
                                
                                
                                elementOrderId.id = 'order' + newOrderNum;
                                elementToRest.style.order = newOrderNum;

                                updateOrderDB(taskId, newOrderNum);
                            }


                            parentDelete.removeChild(forDelete);

                            //update progress bar
                            updateProgress()
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
                            
                        
                            if (answer.answer == 'success') newP.innerHTML = answer.name_edited;
                            else newP.innerHTML = oldText;
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


    //Move order tasks
    if (e.target.classList.contains('fa-arrow-up') || e.target.classList.contains('fa-arrow-down')) { 
        
        let currentlyOrder = e.target.parentNode.parentNode.id,
            currentlyOrderId = parseInt(currentlyOrder.replace('order', '')),
            idProyect = document.querySelector('.id_proyect').value,
            taskChange = "",
            orderChange = "",
            taskForChange = "",
            orderForChange = "";
        
        
        listsAll = document.querySelectorAll('.tarea');


        //go up
        if (e.target.classList.contains('fa-arrow-up')) { 
            newOrder = (currentlyOrderId - 1);
            if (newOrder !== 0) { 
                //console.log('De "' + currentlyOrder + '" a "' + newOrder + '"');
                
                taskChange = parseInt(e.target.parentNode.parentNode.parentNode.id.replace('task:', ''));
                taskChangeElement = e.target.parentNode.parentNode.parentNode;
                orderChange = parseInt(e.target.parentNode.parentNode.parentNode.style.order);

                
                orderForChange = orderChange - 1;
                taskForChangeElement = getElementByOrder(orderForChange);
                taskForChange = parseInt(taskForChangeElement.id.replace('task:', ''));
            }
            else console.log("Ya es el primero");
        }

        //go down
        if (e.target.classList.contains('fa-arrow-down')) { 
            maxOrder = listsAll.length;
            console.log(maxOrder);
            console.log(currentlyOrderId);
            if (currentlyOrderId !== maxOrder) { 
                taskChange = parseInt(e.target.parentNode.parentNode.parentNode.id.replace('task:', ''));
                taskChangeElement = e.target.parentNode.parentNode.parentNode;
                orderChange = parseInt(e.target.parentNode.parentNode.parentNode.style.order);


                orderForChange = orderChange + 1;
                taskForChangeElement = getElementByOrder(orderForChange);
                taskForChange = parseInt(getElementByOrder(orderForChange).id.replace('task:', ''));
            }
            else console.log("Ya es el ultimo");
        }

        
        //apply order changes to the DB
        if (orderChange !== "") { 

            //call ajax
            let xhr = new XMLHttpRequest();

            //prepare dates to send with FormData
            let dates = new FormData();
            dates.append('taskChange', taskChange);
            dates.append('orderChange', orderChange);
            dates.append('taskForChange', taskForChange);
            dates.append('orderForChange', orderForChange);
            dates.append('action', 'move');


            //open connection
            xhr.open('POST', 'inc/models/model-task.php', true);

            //return dates from model-task.php
            xhr.onload = function() { 
                if (this.status === 200) { 
                    console.log(JSON.parse(xhr.responseText));
                    answer = JSON.parse(xhr.responseText);
                    if (answer.answer == 'success') { 
                        console.log(taskChangeElement);
                        console.log(taskForChangeElement);



                        taskChangeElement.style.order = orderForChange;
                        e.target.parentNode.parentNode.id = 'order' + orderForChange;

                        taskForChangeElement.style.order = orderChange;
                        taskForChangeElement.childNodes[3].id = 'order' + orderChange;
                        
                    }
                }
            }

            //send dates
            xhr.send(dates);
        }
    }

}

function getElementByOrder(order) { 
    listsAll = document.querySelectorAll('.tarea');
    listsAll.forEach(element => {
        if (element.style.order == order) { 
            elementoReturn = element;
        }
    });
    return elementoReturn;
}

function updateProgress() { 

    if (document.querySelector('.progress-bar')) {
        totalTasks = document.querySelectorAll('ul .tarea');
        totalCompleteTasks = document.querySelectorAll('i.complete');

        progress = ((totalCompleteTasks.length / totalTasks.length) * 100);

        percentProgress = document.querySelector('#percent');


        percentProgress.style.width = progress + '%';

        console.log(progress);
    }
}




