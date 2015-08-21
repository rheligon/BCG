var csrftoken = $.cookie('csrftoken');


//Verificaciones al cliquear boton de logear
$('#loginButton').on('click', function () {
    
    var user = $('#usernameID').val();
    var pass = $('#passwordID').val();

    if (user === ""){
        swal("Ups!","Debe indicar su nombre de usuario","error");        
    } else if (pass === "" ) {
        swal("Ups!","Debe indicar su contraseña","error"); 
    } else {
        $('#processing-modal').modal('toggle');
        //Llamar funcion de creación del mensaje
        login(user,pass);
    }
});

//Logear
function login(user,pass){
    $.ajax({
        type:"POST",
        url: "/login/",
        data: {"user":user, "action":"login", "pass":pass},
        success: function(data){
            var mensaje = data.mens;
            $('#processing-modal').modal('toggle');
            if (mensaje === "Login exitoso"){
                swal("OK", mensaje, "success");
                setTimeout(function(){
                    $(location).attr("href", '/');
                },2000)
            } else {
                swal("Ups!", mensaje, "error");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Error al intentar ingresar", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}