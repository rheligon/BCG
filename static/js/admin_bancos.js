//idioma_tr es una variable global definida en la pagina
var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}
var tabla = iniciar_tabla(idiomaAux);

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-bancos').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-bancos').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

//Eliminar Banco
$('#delButton').on('click', function () {
    var $btn;
   
    function del_banc(bancoId){
        $.ajax({
            type:"POST",
            url: "/admin/bancos/",
            data: {"bancoid": bancoId, "action": "del"},
            success: function(data){

                if (data.elim){
                    tabla.row($('#tr-'+ data.bancoid)).remove().draw();
                    $(".banco-detalle").hide();
                    $('#Id_banco').val(-1);
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
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var codB = $('#Cod_banco').val();
    var idB = $("#Id_banco").val();
    if (idB>=0){
        if (idioma == 0){
            msj = "Seguro que desea eliminar el banco "+ codB +" ?";
        } else {
            msj = "Sure you want delete bank "+ codB +" ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_banc(idB);
             }
             );
    }else{
        if (idioma == 0){
            swal("Ups!","Por favor seleccionar el banco a eliminar previamente.","error");
        } else {
            swal("Ups!","Please select a bank for delete.","error");
        }
    }

})

//Modificar Banco
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_banc(bancoId, bancoNom, bancoCod){
        $.ajax({
            type:"POST",
            url: "/admin/bancos/",
            data: {"bancoid": bancoId, "banconom":bancoNom, "bancocod":bancoCod, "action": "upd"},
            success: function(data){
                var a_idaux = $('#Id_banco').val();

                if (data.modif){
                    tabla.row($('#tr-'+ data.bancoid)).remove().draw();

                    var td1 = '<td>'+ '<a href="/admin/bancos/'+ data.bancoid + '" nombre ="' + data.bancon + '" id="'+ data.bancoid + '" codigo = "' + data.bancoc + '" type="banco">' + data.bancoc + '</a></td>';

                    var td2 = '<td>' + data.bancon + '</td>';

                    $('#table-bancos > tbody').append('<tr id ="tr-'+data.bancoid+'"></tr>');

                    var jRow = $("#tr-"+data.bancoid).append(td1,td2);

                    tabla.row.add(jRow).draw();
                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "Ups!",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                    $("#Cod_banco").val(data.bancoc);
                    $("#Nom_banco").val(data.bancon);
                    $("#Id_banco").val(data.bancoid);
                    $(".banco-detalle").show();

                    var a_id = $('#Id_banco').val();
                    //Estilo de elemento elegido
                    $('#'+a_idaux).parent().css("background-color","")
                    $('#'+a_idaux).css("color","")
                    $('#'+a_id).parent().css("background-color","#337ab7")
                    $('#'+a_id).css("color","white")
                }
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var codB = $('#Cod_banco').val();
    var nomB = $('#Nom_banco').val();
    var idB = $("#Id_banco").val();

    if (idB>=0){
        if (idioma == 0){
            msj = "Seguro que desea modificar el banco "+ codB +" ?";
        } else {
            msj = "Sure you want modify bank "+ codB +" ?";
        }
        swal({   title: "",
                 text: msj,
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonText: "Ok"},
                 function(){
                    $btn = $(this).button('loading');
                    $('#processing-modal').modal('toggle');
                    upd_banc(idB, nomB, codB);
                 }
                 );
    }else{
        if (idioma == 0){
            swal("Ups!","Por favor seleccionar el banco a modificar previamente.","error");
        } else {
            swal("Ups!","Please select a bank for modify.","error");
        }
    }
})


//Mostrar Detalle al hacer click en código de banco
$('#table-bancos').on('click','a[type=banco]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_banco").val();
    var a_nom = $(this).attr("nombre");
    var a_cod = $(this).attr("codigo");
    var a_id = $(this).attr("id");
    $("#Cod_banco").val(a_cod);
    $("#Nom_banco").val(a_nom);
    $("#Id_banco").val(a_id);
    $(".banco-detalle").show();

    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","")
    $('#'+a_idaux).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")
});

//Resetear campos del formulario cuando se esconde
$('.modal:not(.modal-static)').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Tooltip de ayuda en que debe ingresar en el campo
$('#form-add-bank [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar banco
$('#form-add-bank').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {


                $("#add-banco-modal").modal("toggle");
                $('#processing-modal').modal('toggle');
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_banc(bancoCod, bancoNom){
                    $.ajax({
                        type:"POST",
                        url: "/admin/bancos/",
                        data: {"bancocod": bancoCod, "banconom": bancoNom, "action": "add"},
                        success: function(data){
                            var a_idaux = $("#Id_banco").val();

                            if (data.creado){
                                $("#Cod_banco").val(data.bancoc);
                                $("#Nom_banco").val(data.bancon);
                                $("#Id_banco").val(data.bancoid);
                                $(".banco-detalle").show();

                                var td1 = '<td>'+ '<a href="/admin/bancos/'+ data.bancoid + '" nombre ="' + data.bancon + '" id="'+ data.bancoid + '" codigo = "' + data.bancoc + '" type="banco">' + data.bancoc + '</a></td>';

                                var td2 = '<td>' + data.bancon + '</td>';

                                $('#table-bancos > tbody').append('<tr id ="tr-'+data.bancoid+'"></tr>');

                                var jRow = $("#tr-"+data.bancoid).append(td1,td2);

                                tabla.row.add(jRow).draw();
                                swal({   title: "",
                                         text: data.msg,
                                         type: "success",
                                         confirmButtonText: "Ok" });

                            }else{
                                swal({   title: "",
                                         text: data.msg,
                                         type: "warning",
                                         confirmButtonText: "Ok" });
                                $("#Cod_banco").val(data.bancoc);
                                $("#Nom_banco").val(data.bancon);
                                $("#Id_banco").val(data.bancoid);
                                $(".banco-detalle").show();
                            }

                            var a_id = $("#Id_banco").val();

                            //Estilo de elemento elegido
                            $('#'+a_idaux).parent().css("background-color","");
                            $('#'+a_idaux).css("color","");
                            $('#'+a_id).parent().css("background-color","#337ab7");
                            $('#'+a_id).css("color","white");

                            $('#processing-modal').modal('toggle');
                            $btn.button('reset');
                        },
                        error: function(error){
                            if (idioma == 0){
                                msj = "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.";
                            } else {
                                msj = "Error, verify fields and try again please.";
                            }
                            swal({   title: "Ups!",
                                         text: msj,
                                         type: "error",
                                         confirmButtonText: "Ok" });
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
                var codb_aux = $('#add-banco-codigo').val();
                var nomb_aux = $('#add-banco-nombre').val();
                add_banc(codb_aux,nomb_aux);

                $('#form-add-bank').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});