//idioma_tr es una variable global definida en la pagina
var tabla_edc = iniciar_tabla_edc(idioma_tr);
var tabla_det = iniciar_tabla_det(idioma_tr);
var csrftoken = $.cookie('csrftoken');
var prev_a; //Ultimo archivo seleccionado
var prev_a_edc; //Ultimo balance seleccionado
var prev_edcl; //Ultima lista de edc previsualizada
var prev_acc; //Accion a realizar al confirmar
var prev_edcl_j; //Ultimo json recibido al previsualizar

function iniciar_tabla_edc(idioma){

    if (idioma==="es"){

        return $('#table-edc').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "15%" },
                { "width": "10%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "25%" }
              ],
        })

    }else if (idioma==="en"){

        return $('#table-edc').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "15%" },
                { "width": "10%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "25%" }
              ],
        })
    };
}

function iniciar_tabla_det(idioma){

    if (idioma==="es"){

        return $('#table-detalle').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "7.5%" },
                { "width": "5%" },
                { "width": "15%" },
                { "width": "5%" },
                { "width": "15%" },
                { "width": "7.5%" },
                { "width": "15%" },
                { "width": "15%" },
                { "width": "15%" }
              ],
        })

    }else if (idioma==="en"){

        return $('#table-detalle').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "7.5%" },
                { "width": "5%" },
                { "width": "15%" },
                { "width": "5%" },
                { "width": "15%" },
                { "width": "7.5%" },
                { "width": "15%" },
                { "width": "15%" },
                { "width": "15%" }
              ],
        })
    };
}

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

//Cambiar estilo al hacer click en un archivo
$('li.archivo').on('click', function () {

    //Estilo de elemento elegido
    if (prev_a != undefined){
        prev_a.css("background-color","");
        prev_a.css("color","");
    };

    $(this).css("background-color","#337ab7");
    $(this).css("color","white");

    prev_a = $(this);
});

//Boton previsualizar contabilidad
$('#prevContaButton').on('click', function () {
    if (prev_a != undefined){
        if (prev_a.hasClass("conta")){
            $('#processing-modal').modal('toggle');
            prev_a_edc = undefined;
            tabla_edc.clear().draw();
            tabla_det.clear().draw();
            previsualizar(prev_a.attr("name"),'prevconta');
        }
    }
});

//Boton previsualizar corresponsal
$('#prevCorrButton').on('click', function () {
    if (prev_a != undefined){
        if (prev_a.hasClass("corr")){
            $('#processing-modal').modal('toggle');
            prev_a_edc = undefined;
            tabla_edc.clear().draw();
            tabla_det.clear().draw();
            previsualizar(prev_a.attr("name"),'prevcorr');
        }
    }
});

//Boton confirmar carga
$('#confButton').on('click', function () {
    if (prev_edcl != undefined){
        $('#processing-modal').modal('toggle');
        confirmar(prev_edcl_j,prev_acc);
    }else{
        alert("elija un archivo primero");
    }
});


//Buscar datos de archivo elegido
function previsualizar(archivo,accion){
    $.ajax({
        type:"POST",
        url: "/procd/cargAut/",
        data: {"archivo_nom": archivo, "action":accion},
        success: function(data){
            var json_data = jQuery.parseJSON(data.res);
            console.log(json_data);

            prev_edcl_j = data.res;
            prev_edcl = json_data.edcl;

            for (var i=0; i<json_data.edcl.length; i++){
                //json_data.edcl[i]
                var cod_cta = json_data.edcl[i].R
                var edo_cta = json_data.edcl[i].cod28c
                var pags = json_data.edcl[i].pagsBal.length

                if (accion === "prevconta"){
                    prev_acc = "cargconta";
                    var td2 = '<td> L </td>';
                }else if (accion === "prevcorr"){
                    prev_acc = "cargcorr";
                    var td2 = '<td> S </td>';
                }
                
                var td3 = '<td>' + edo_cta + '</td>';

                for (var j=0; j<pags; j++){

                    var td1 = '<td><a edc="'+edo_cta+'" pag="'+j+'">' + cod_cta + '</a></td>';
                    console.log(i+" "+j);
                    var fechai = json_data.edcl[i].pagsBal[j].inicial.fecha.match(/.{1,2}/g).reverse().join('/');
                    var fechaf = json_data.edcl[i].pagsBal[j].final.fecha.match(/.{1,2}/g).reverse().join('/');
                    //Se cambia la , por . en los montos para poder formatearlo luego
                    var montoi = parseFloat(json_data.edcl[i].pagsBal[j].inicial.monto.replace(',','.'));
                    var montof = parseFloat(json_data.edcl[i].pagsBal[j].final.monto.replace(',','.'));

                    var td4 = '<td>' + (j+1) + '</td>';
                    var td5 = '<td>' + json_data.edcl[i].pagsBal[j].MoFi+' '+ fechai +' '+json_data.edcl[i].pagsBal[j].inicial.DoC+' '+ $.formatNumber(montoi,{locale:idioma_tr})+'</td>';
                    var td6 = '<td>' + json_data.edcl[i].pagsBal[j].MoFf+' '+ fechaf +' '+json_data.edcl[i].pagsBal[j].final.DoC+' '+ $.formatNumber(montof,{locale:idioma_tr}) +'</td>';
    
    
                    $('#table-edc > tbody').append('<tr class="text-center" id ="tr-'+cod_cta+"-"+i+j+'"></tr>');
                    var jRow = $("#tr-"+cod_cta+"-"+i+j).append(td1,td2,td3,td4,td5,td6);
                    tabla_edc.row.add(jRow);
                }
                tabla_edc.draw();
            }

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error procesando el archivo especificado.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Mostrar Detalle al hacer click en el balance especificado
$('#table-edc').on('click','a', function(event) {
    event.preventDefault();
    tabla_det.clear().draw();

    //Estilo de elemento elegido
    if (prev_a_edc != undefined){
        prev_a_edc.parent().css("background-color","");
        prev_a_edc.css("color","");
    }

    $(this).parent().css("background-color","#337ab7");
    $(this).css("color","white");
    prev_a_edc = $(this);

    //Comenzar a extraer los datos

    var pag = parseInt($(this).attr('pag'));
    var edc = $(this).attr('edc');

    for (i=0;i<prev_edcl.length;i++){
        if (prev_edcl[i].cod28c === edc){
            var index = i;
        }
    }

    var transferencias = prev_edcl[index].pagsTrans;

    var td1 = '<td>'+edc+'</td>';

    for (var i=0;i<transferencias[pag].length;i++){
        //Se saca la fecha, se divide cada dos caracteres, se voltea y se une con /
        var fecha = transferencias[pag][i].trans.fecha.match(/.{1,2}/g).reverse().join('/');
        
        //Se cambia la , por . en los montos para poder formatearlo luego
        var monto = parseFloat(transferencias[pag][i].trans.monto.replace(',','.'));

        var td2 = '<td>' + (i+1) + '</td>';
        var td3 = '<td>' + fecha + '</td>';
        var td4 = '<td>' + transferencias[pag][i].trans.DoC + '</td>';
        var td5 = '<td>' + $.formatNumber(monto,{locale:idioma_tr}) + '</td>';
        var td6 = '<td>' + transferencias[pag][i].trans.tipo + '</td>';
        var td7 = '<td>' + transferencias[pag][i].trans.refNostro + '</td>';
        var td8 = '<td>' + vacio(transferencias[pag][i].trans.refVostro) + '</td>';
        var td9 = '<td>' + vacio(transferencias[pag][i].desc) + '</td>';

        $('#table-detalle > tbody').append('<tr class="text-center" id ="tr-'+edc+"-det-"+i+'"></tr>');
        var jRow = $("#tr-"+edc+"-det-"+i).append(td1,td2,td3,td4,td5,td6,td7,td8,td9);
        tabla_det.row.add(jRow).draw();
    }
});

//Cargar archivo elegido
function confirmar(edcl,accion){
    $.ajax({
        type:"POST",
        url: "/procd/cargAut/",
        data: {"edcl": edcl, "action":accion},
        success: function(data){
            swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error procesando el archivo especificado.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};