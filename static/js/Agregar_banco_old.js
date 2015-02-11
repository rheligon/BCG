//Agregar banco old 

$('#addb-submit').on('click', function () {
    var $btn = $('#addButton').button('loading')
    
    function add_banc(bancoCod, bancoNom){
        $.ajax({
            type:"POST",
            url: "/admin/bancos/",
            data: {"bancocod": bancoCod, "banconom": bancoNom, "action": "add"},
            success: function(data){
                if (data.creado){
                    $("#Cod_banco").val(data.bancoc);
                    $("#Nom_banco").val(data.bancon);
                    $("#Id_banco").val(data.bancoid);
                    $(".banco-detalle").show();

                    var td1 = '<td>'+ '<a href="/admin/banco/'+ data.bancoid + '" nombre ="' + data.bancon + '" id="'+ data.bancoid + '" codigo = "' + data.bancoc + '" type="banco">' + data.bancoc + '</a></td>';

                    var td2 = '<td>' + data.bancon + '</td>';

                    $('#table-bancos > tbody').append('<tr id ="tr-'+data.bancoid+'"></tr>');

                    var jRow = $("#tr-"+data.bancoid).append(td1,td2);

                    tabla.row.add(jRow).draw();
                    alert("Banco agregado satisfactoriamente.");

                }else{
                    alert("Ya ese Banco existe en la Base de Datos");
                    $("#Cod_banco").val(data.bancoc);
                    $("#Nom_banco").val(data.bancon);
                    $("#Id_banco").val(data.bancoid);
                    $(".banco-detalle").show();
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
    var codb_aux = $('#add-codigo-banco').val();
    var nomb_aux = $('#add-nombre-banco').val();
    add_banc(codb_aux,nomb_aux);
    $('#add-banco-modal').reset();

})