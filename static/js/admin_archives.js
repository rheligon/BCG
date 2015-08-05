var csrftoken = $.cookie('csrftoken');

/*
$( document ).ready(function() {
        setInterval(function() {
            console.log("hola")
        }, 2000);   
    
});*/

$('#Cuenta-sel').change(function() {
    
    var cuentaId = $('#Cuenta-sel').val();

    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        
        $('#minima_fecha').val("");
    }else{

        //borramos los campos
        $('#minima_fecha').val("");

    }


});   

//Mostramos como seria el nuevo estado de cuenta
$('#boton-consulta').on('click', function () {

    var cuenta = $('#Cuenta-sel').val()
    
    
    if (cuenta>=0){
        var codigoCuenta = $('#opt-'+cuenta).attr("codigo");
        console.log(codigoCuenta);
        consultar(codigoCuenta);
        //$('#minima_fecha').val("soy Gay");
        
    }else{
        swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
    }
    
});

function consultar(cuenta){
        $.ajax({
            type:"POST",
            url: "/admin/archives/",
            data: {"cuenta":cuenta, "action": "consultar"},
            success: function(data){

                if (data.exito){
                    swal({   title: "",
                             text: data.msg,
                             type: "success"
                         });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                
                swal("Ups!", "Hubo un error consultando la Cuenta, intente de Nuevo.", "error");
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};