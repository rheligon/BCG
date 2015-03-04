var csrftoken = $.cookie('csrftoken');

//Ejecutar Restore
$('#resButton').on('click', function () {
    var $btn;
   
    function restore_cuenta(cuentaCod){
        $.ajax({
            type:"POST",
            url: "/seguridad/backup_restore/",
            data: {"cuentacod": cuentaCod, "action": "res"},
            success: function(data){
                if (data.restored){
                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText)
                $('#processing-modal').modal('toggle');
                $btn.button('reset');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var idC = $("#Cuenta-sel").val();

    if (idC>=0){
        var codC = $("#opt-"+idC).html();

        swal({   title: "",
             text: "Seguro que desea restaurar la cuenta "+ codC +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                restore_cuenta(codC);
             }
             );
    }else{
        swal("Ups!","Por favor seleccionar la cuenta a restaurar previamente.","error");
    }
})

//Ejecutar Restore
$('#bkUpButton').on('click', function () {
    var $btn;
   
    function backup(){
        $.ajax({
            type:"POST",
            url: "/seguridad/backup_restore/",
            data: {"action": "bkUp"},
            success: function(data){
                if (data.bkUp){
                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText)
                $('#processing-modal').modal('toggle');
                $btn.button('reset');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    swal({   title: "",
         text: "Seguro que desea hacer un backup del sistema?",
         type: "warning",
         showCancelButton: true,
         confirmButtonText: "Ok"},
         function(){
            $btn = $(this).button('loading')
            $('#processing-modal').modal('toggle');
            backup();
         }
         );
})