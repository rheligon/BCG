var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();

//Verificaciones al cliquear boton de logear
$('#loginButton').on('click', function () {
    
    var user = $('#usernameID').val();
    var pass = $('#passwordID').val();

    if (user === ""){
        if (idioma == 0){
            swal("Ups!","Debe indicar su nombre de usuario","error");
        } else {
            swal("Ups!","Indicate your username please","error");
        }        
    } else if (pass === "" ) {
        if (idioma == 0){
            swal("Ups!","Debe indicar su contraseña","error");
        } else {
            swal("Ups!","Indicate your password please","error");
        } 
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
                if (idioma == 0) {
                    swal("OK", mensaje, "success");
                } else {
                    swal("OK", "Successful Login", "success");
                }
                setTimeout(function(){
                    $(location).attr("href", '/');
                },2000)
            } else if (mensaje === "Cambiar contraseña") {
                if (idioma == 0) {
                    swal("OK","Login Exitoso, deberá cambiar su contraseña.", "success");
                } else {
                    swal("OK", "Successful Login. You must now change your password.", "success");
                }
                setTimeout(function(){
                    $(location).attr("href", '/cambioClave/');
                },2000)
            } else {
                swal("Ups!", mensaje, "error");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Error al intentar ingresar", "error");
            } else{
                swal("Ups!", "Attempting enter error", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}