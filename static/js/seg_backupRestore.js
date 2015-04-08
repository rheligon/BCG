var csrftoken = $.cookie('csrftoken');

function dateFormat(fecha){
    var date = new Date(Date.parse(fecha));
    return date.toLocaleDateString();
    //return (date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear())
}

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

    function fecha_res(cuentaCod){
        var fhist;
        var fcons;

        $.ajax({
            type:"POST",
            url: "/seguridad/backup_restore/",
            data: {"cuentacod": cuentaCod, "action": "fecha"},
            success: function(data){
                fhist = data.fhist;
                fcons = data.fcons;
                res(cuentaCod,fhist,fcons);
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText)
                $('#processing-modal').modal('toggle');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    function res(cuentaCod,fhist,fcons){
        if (fcons != null){
            var f1 = dateFormat(fcons);
        }else{
            var f1 = "N/A";
        }

        if (fhist != null){
            var f2 = dateFormat(fhist);
        }else{
            var f2 = "N/A";
        }

        $('#processing-modal').modal('toggle');
        
        swal({   title: "",
             text: "Seguro que desea restaurar la cuenta "+ cuentaCod +" ?\nInformación almacenada en Backup:\nConciliación: "+f1+"\nHistorico: "+f2,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                restore_cuenta(cuentaCod);
             }
             );
    }

    var idC = $("#Cuenta-sel").val();

    if (idC>=0){
        var codC = $("#opt-"+idC).html();
        $('#processing-modal').modal('toggle');
        fecha_res(codC);
    }else{
        swal("Ups!","Por favor seleccionar la cuenta a restaurar previamente.","error");
    }
})

//Ejecutar Backup
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