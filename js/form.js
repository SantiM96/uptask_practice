eventLiseners();

function eventLiseners() { 
    document.querySelector('#formulario').addEventListener('submit', validateRegister);
}


function validateRegister(e) {
    e.preventDefault();

    let user = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        type = document.querySelector('#tipo').value;
    
    if (user === "" || password === "") {
        //Error en la validación
        swal({
            type: 'error',
            title: 'Error',
            text: 'Ambos campos son obligatorios'
        })
    }
    else { 
        //Validación correcta

        let dates = new FormData();
        dates.append('user', user);
        dates.append('password', password);
        dates.append('action', type);

        //console.log(dates.get('action'));


        //Llamado de Ajax
        let xhr = new XMLHttpRequest();

        //Open conection
        xhr.open('POST', 'inc/models/model-admin.php', true);

        //Return dates
        xhr.onload = function() { 
            if(this.status === 200) { 
                let answer = JSON.parse(xhr.responseText);

                console.log(answer);
                //if the user is creating a user
                if(answer.type === 'crear' && answer.answer === 'success') {
                    swal({
                        type: 'success',
                        title: 'Usuario Creado',
                        text: 'El usuario ha sido creado correctamente'
                    })
                    .then(result => { 
                        if (result.value) window.location.href = 'login.php';
                    })
                }
                else if(answer.type === 'crear' && answer.answer === 'error' && answer.error === 'Usuario existente') { 
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'El nombre ya está en uso'
                    })
                }
                else { 
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'El usuario no pudo ser creado'
                    })
                }

                //if the user is logging in
                if(answer.name && answer.answer === 'success') {
                    swal({
                        type: 'success',
                        title: 'Usuario Logeado',
                        text: 'Se ha logeado correctamente'
                    })
                    .then(result => { 
                        if (result.value) window.location.href = 'index.php';
                    })
                }
                else if(answer.type === 'login' && answer.answer === 'error') { 
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'El usuario o contraseña son inválidos'
                    })
                }
            }
        }

        //send
        xhr.send(dates);
    }
    
}

