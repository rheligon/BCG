//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');


function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-mon').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-mon').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};


//Mostrar Detalle al hacer click en código de banco
$('#table-mon').on('click','a[type=moneda]', function(event) {
    event.preventDefault();
    var a_nom = $(this).attr("nombre");
    var a_cod = $(this).attr("codigo");
    var a_cam = $(this).attr("cambio");
    var a_id = $(this).attr("id");
    $("#Cod_moneda").val(a_cod);
    $("#Nom_moneda").val(a_nom);
    $("#Cam_moneda").val(a_cam);
    $("#Id_moneda").val(a_id);
    $(".moneda-detalle").show();
});

//Eliminar Moneda
$('#delButton').on('click', function () {
    var $btn;
   
    function del_mon(monId){
        $.ajax({
            type:"POST",
            url: "/admin/monedas/",
            data: {"monedaid": monId, "action": "del"},
            success: function(data){
                alert(data.msg);

                if (data.elim){
                    tabla.row($('#tr-'+ data.monedaid)).remove().draw();
                    $(".moneda-detalle").hide();
                }

                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    if (confirm("Seguro que desea eliminar la moneda?")){
        $btn = $(this).button('loading')
        del_mon($("#Id_moneda").val());
    }
})


//Resetear campos del formulario cuando se esconde
$('.modal').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Tooltip de ayuda en que debe ingresar en el campo
$('#form-add-moneda [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar banco
$('#form-add-moneda').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {

                $("#add-moneda-modal").modal("toggle");
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_moneda(monedaCod, monedaNom, monedaCam){
                    $.ajax({
                        type:"POST",
                        url: "/admin/monedas/",
                        data: {"moncod": monedaCod, "monnom": monedaNom, "moncam": monedaCam, "action": "add"},
                        success: function(data){
                            if (data.creado){
                                    $("#Cod_moneda").val(data.moncod);
                                    $("#Nom_moneda").val(data.monnom);
                                    $("#Cam_moneda").val(data.moncam);
                                    $("#Id_moneda").val(data.monedaid);
                                    $(".moneda-detalle").show();

                                var td1 = '<td>'+ '<a href="/admin/moneda/'+ data.monedaid + '" nombre ="' + data.monnom + '" id="'+ data.monedaid + '" codigo = "' + data.moncod + '" cambio = "' + data.moncam + '" type="moneda">' + data.moncod + '</a></td>';

                                var td2 = '<td>' + data.monnom + '</td>';

                                var td3 = '<td>' + data.moncam + '</td>';


                                $('#table-mon> tbody').append('<tr id ="tr-'+data.monedaid+'"></tr>');

                                var jRow = $("#tr-"+data.monedaid).append(td1,td2,td3);

                                tabla.row.add(jRow).draw();
                                alert("Moneda agregada satisfactoriamente.");

                            }else{
                                alert("Ya esa Moneda existe en la Base de Datos");
                                $("#Cod_moneda").val(data.moncod);
                                $("#Nom_moneda").val(data.monnom);
                                $("#Cam_moneda").val(data.moncam);
                                $("#Id_moneda").val(data.monedaid);
                                $(".moneda-detalle").show();
                            }
                            
                            $btn.button('reset');
                        },
                        error: function(error){
                            alert("Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.")
                            $btn.button('reset');
                        },
                        dataType:'json',
                        headers:{
                            'X-CSRFToken':csrftoken
                        }
                    });
                    return false;
                }
                var codm_aux = $('#add-moneda-codigo').val();
                var nomm_aux = $('#add-moneda-nombre').val();
                var camm_aux = $('#add-moneda-cambio').val();
                add_moneda(codm_aux,nomm_aux,camm_aux);

                $('#form-add-moneda').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});