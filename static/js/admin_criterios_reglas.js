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

        return $('#table-criterios').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-criterios').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

function vacio(str){
    if (str===""){
        return str
    }else if (str==="None"){
        return ""
    }else if (str===null){
        return ""
    }
    return str
}

//Eliminar criterio
$('#delButton').on('click', function () {
    var $btn;
   
    function del_crit(criterioId){
        $.ajax({
            type:"POST",
            url: "/admin/criterios_reglas/",
            data: {"criterioid": criterioId, "action": "del"},
            success: function(data){
                if (data.elim){
                    tabla.row($('#tr-'+ data.criterioid)).remove().draw();
                    $(".criterio-detalle").hide();
                    $("#Id_criterio").val(-1);
                    $("#Nom_criterio").val("");
                    
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

    var nomC = $('#Nom_criterio').val();
    var idC = $("#Id_criterio").val();

    if (idC>=0){
        if (idioma === 0){
            msj = "Seguro que desea eliminar el criterio '"+ nomC +"' ?";
        } else {
            msj = "Sure you want delete criteria '"+ nomC +"' ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading');
                $('#processing-modal').modal('toggle');
                del_crit(idC);
             }
             );
    }else{
        if (idioma === 0){
            swal("Ups!", "Por favor seleccionar el criterio a eliminar previamente.","error");
        } else {
            swal("Ups!", "Select criteria please.","error");
        }
    }
})

//Modificar Criterio
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_crit(criterioId, criterioNom, criterioMon1, criterioMon2, criterioMon3, criterioF1, criterioF2, criterioF3, criterioF4, criterioF5){
        $.ajax({
            type:"POST",
            url: "/admin/criterios_reglas/",
            data: {"criterioid":criterioId ,"criterionom": criterioNom, "criteriomon1": criterioMon1, "criteriomon2": criterioMon2, "criteriomon3": criterioMon3, "criterioF1": criterioF1, "criterioF2": criterioF2, "criterioF3": criterioF3, "criterioF4": criterioF4, "criterioF5": criterioF5, "action": "upd"},
            success: function(data){
                if (data.modif){
                    tabla.row($('#tr-'+ data.criterioid)).remove().draw();

                    var td1 = '<td>'+ '<a href="/admin/crit_reglas/'+ data.criterioid + '" nombre ="' + data.criterionom + '" id="'+ data.criterioid + '" monto1 = "' + data.criteriomon1+ '" monto2 = "' + data.criteriomon2+ '" monto3 = "' + data.criteriomon3+ '" fecha1 = "' + data.criterioF1+ '" fecha2 = "' + data.criterioF2+ '" fecha3 = "' + data.criterioF3+ '" fecha4 = "' + data.criterioF4+ '" fecha5 = "' + data.criterioF5 + '" type="criterio">' + data.criterionom + '</a></td>';

                    var td2 = '<td>' + vacio(data.criteriomon1) + '</td>';
                    var td3 = '<td>' + vacio(data.criteriomon2) + '</td>';
                    var td4 = '<td>' + vacio(data.criteriomon3) + '</td>';
                    var td5 = '<td>' + vacio(data.criterioF1) + '</td>';
                    var td6 = '<td>' + vacio(data.criterioF2) + '</td>';
                    var td7 = '<td>' + vacio(data.criterioF3) + '</td>';
                    var td8 = '<td>' + vacio(data.criterioF4) + '</td>';
                    var td9 = '<td>' + vacio(data.criterioF5) + '</td>';

                    $('#table-criterios > tbody').append('<tr id ="tr-'+data.criterioid+'"></tr>');

                    var jRow = $("#tr-"+data.criterioid).append(td1,td2,td3,td4,td5,td6,td7,td8,td9);

                    tabla.row.add(jRow).draw();
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

    var mon1c = $('#Mon1_criterio').val();
    var mon2c = $('#Mon2_criterio').val();
    var mon3c = $('#Mon3_criterio').val();
    var F1c = $('#F1_criterio').val();
    var F2c = $('#F2_criterio').val();
    var F3c = $('#F3_criterio').val();
    var F4c = $('#F4_criterio').val();
    var F5c = $('#F5_criterio').val();
    var nomC = $('#Nom_criterio').val();

    var idC = $("#Id_criterio").val();

    if (idC>=0){

        if (nomC.length===0 || nomC.length>20){
                if (idioma === 0){
                    swal("Ups!", "Recuerde que el nombre es obligatorio y debe tener máximo 20 caracteres", "info");
                }  else {
                    swal("Ups!", "Select criteria please.","error");
                }
        }else{
            if (idioma === 0){
                msj = "Seguro que desea modificar el criterio '"+ nomC +"' con los campos de la seccion de detalles?";
            } else {
                msj = "Sure you want modify criteria '"+ nomC +"' with the introduced details?";
            }
            swal({   title: "",
                 text: msj, 
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonText: "Ok"},
                 function(){
                    $btn = $(this).button('loading')
                    $('#processing-modal').modal('toggle');
                    upd_crit($("#Id_criterio").val(),nomC,mon1c,mon2c,mon3c,F1c,F2c,F3c,F4c,F5c);
                 }
                 );
        }
    }else{
        if (idioma === 0){
            swal("Ups!", "Por favor seleccionar el criterio a modificar previamente.","error");
        } else {
            swal("Ups!", "Select criteria please.","error");
        }
    }
})





//Mostrar Detalle al hacer click en código de criterio
$('#table-criterios').on('click','a[type=criterio]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_criterio").val();
    var a_id = $(this).attr("id");
    var a_nom = $(this).attr("nombre");
    var a_mon1 = $(this).attr("monto1");
    var a_mon2 = $(this).attr("monto2");
    var a_mon3 = $(this).attr("monto3");
    var a_f1 = $(this).attr("fecha1");
    var a_f2 = $(this).attr("fecha2");
    var a_f3 = $(this).attr("fecha3");
    var a_f4 = $(this).attr("fecha4");
    var a_f5 = $(this).attr("fecha5");
 
    $("#Id_criterio").val(a_id);
    $("#Nom_criterio").val(a_nom);
    $("#Mon1_criterio").val(a_mon1);
    $("#Mon2_criterio").val(a_mon2);
    $("#Mon3_criterio").val(a_mon3);
    $("#F1_criterio").val(a_f1);
    $("#F2_criterio").val(a_f2);
    $("#F3_criterio").val(a_f3);
    $("#F4_criterio").val(a_f4);
    $("#F5_criterio").val(a_f5);

    $(".criterio-detalle").show();

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
$('#form-add-criterio [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar criterio
$('#form-add-criterio').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {

                $("#add-criterio-modal").modal("toggle");
                $('#processing-modal').modal('toggle');
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_crit(criterioNom, criterioMon1, criterioMon2, criterioMon3, criterioF1, criterioF2, criterioF3, criterioF4, criterioF5){
                    $.ajax({
                        type:"POST",
                        url: "/admin/criterios_reglas/",
                        data: {"criterionom": criterioNom, "criteriomon1": criterioMon1, "criteriomon2": criterioMon2, "criteriomon3": criterioMon3, "criterioF1": criterioF1, "criterioF2": criterioF2, "criterioF3": criterioF3, "criterioF4": criterioF4, "criterioF5": criterioF5, "action": "add"},
                        success: function(data){
                            var a_idaux = $("#Id_criterio").val();

                            if (data.creado){
                                $("#Id_criterio").val(data.criterioid);
                                $("#Nom_criterio").val(data.criterionom);
                                $("#Mon1_criterio").val(data.criteriomon1);
                                $("#Mon2_criterio").val(data.criteriomon2);
                                $("#Mon3_criterio").val(data.criteriomon3);
                                $("#F1_criterio").val(data.criterioF1);
                                $("#F2_criterio").val(data.criterioF2);
                                $("#F3_criterio").val(data.criterioF3);
                                $("#F4_criterio").val(data.criterioF4);
                                $("#F5_criterio").val(data.criterioF5);
                                $(".criterio-detalle").show();

                                var td1 = '<td>'+ '<a href="/admin/criterios/'+ data.criterioid + '" nombre ="' + data.criterionom + '" id="'+ data.criterioid + '" monto1 = "' + data.criteriomon1+ '" monto2 = "' + data.criteriomon2+ '" monto3 = "' + data.criteriomon3+ '" fecha1 = "' + data.criterioF1+ '" fecha2 = "' + data.criterioF2+ '" fecha3 = "' + data.criterioF3+ '" fecha4 = "' + data.criterioF4+ '" fecha5 = "' + data.criterioF5 + '" type="criterio">' + data.criterionom + '</a></td>';

                                var td2 = '<td>' + vacio(data.criteriomon1) + '</td>';
                                var td3 = '<td>' + vacio(data.criteriomon2) + '</td>';
                                var td4 = '<td>' + vacio(data.criteriomon3) + '</td>';
                                var td5 = '<td>' + vacio(data.criterioF1) + '</td>';
                                var td6 = '<td>' + vacio(data.criterioF2) + '</td>';
                                var td7 = '<td>' + vacio(data.criterioF3) + '</td>';
                                var td8 = '<td>' + vacio(data.criterioF4) + '</td>';
                                var td9 = '<td>' + vacio(data.criterioF5) + '</td>';

                                $('#table-criterios > tbody').append('<tr id ="tr-'+data.criterioid+'"></tr>');

                                var jRow = $("#tr-"+data.criterioid).append(td1,td2,td3,td4,td5,td6,td7,td8,td9);

                                tabla.row.add(jRow).draw();
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

                            var a_id = $("#Id_criterio").val();
                            //Estilo de elemento elegido
                            $('#'+a_idaux).parent().css("background-color","")
                            $('#'+a_idaux).css("color","")
                            $('#'+a_id).parent().css("background-color","#337ab7")
                            $('#'+a_id).css("color","white")

                            $('#processing-modal').modal('toggle');
                            $btn.button('reset');
                        },
                        error: function(error){
                            if (idioma === 0){
                                msj = "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.";
                            } else {
                                msj = "Error occurred, verify fields and try againg please.";
                            }
                            swal({   title: "",
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

                var nomc_aux = $('#add-criterio-nombre').val();
                var mon1c = $('#add-criterio-mon1').val();
                var mon2c = $('#add-criterio-mon2').val();
                var mon3c = $('#add-criterio-mon3').val();
                var F1c = $('#add-criterio-F1').val();
                var F2c = $('#add-criterio-F2').val();
                var F3c = $('#add-criterio-F3').val();
                var F4c = $('#add-criterio-F4').val();
                var F5c = $('#add-criterio-F5').val();
                add_crit(nomc_aux,mon1c,mon2c,mon3c,F1c,F2c,F3c,F4c,F5c);

                $('#form-add-criterio').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});