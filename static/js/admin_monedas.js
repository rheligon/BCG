//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');


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

//Agregar banco
$('#addButton').on('click', function () {
    var $btn = $(this).button('loading')
    
    function add_banc(bancoCod, bancoNom){
        $.ajax({
            type:"POST",
            url: "/addbank/",
            data: {"bancocod": bancoCod, "banconom": bancoNom},
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

                }else{
                    alert("Ya ese Banco existe en la Base de Datos");
                    $("#Cod_banco").val(data.bancoc);
                    $("#Nom_banco").val(data.bancon);
                    $("#Id_banco").val(data.bancoid);
                    $(".banco-detalle").show();
                }
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }
    add_banc("epacod3","epanom3");
    $btn.button('reset')
})

//Eliminar Banco
$('#delButton').on('click', function () {
    var $btn = $(this).button('loading')
    
    function del_banc(bancoId){
        $.ajax({
            type:"POST",
            url: "/test/",
            data: {"bancoid": bancoId},
            success: function(data){
                alert(data.msg);
                tabla.row($('#tr-'+ data.bancoid)).remove().draw();
                $(".banco-detalle").hide();
                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }
    if (confirm("Seguro que desea eliminar el banco?")){
        del_banc($("#Id_banco").val());
    }
    
})

//Mostrar Detalle al hacer click en código de banco
$('#table-bancos').on('click','a[type=banco]', function(event) {
    event.preventDefault();
    var a_nom = $(this).attr("nombre");
    var a_cod = $(this).attr("codigo");
    var a_id = $(this).attr("id");
    $("#Cod_banco").val(a_cod);
    $("#Nom_banco").val(a_nom);
    $("#Id_banco").val(a_id);
    $(".banco-detalle").show();
});