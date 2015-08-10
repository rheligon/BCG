var csrftoken = $.cookie('csrftoken');
var tabla_AD = iniciar_tabla_AD(idioma_tr);
var tabla_NAD = iniciar_tabla_NAD(idioma_tr);
var arregloQuitar = [];
var arregloAgregar = [];

//inicializar la tabla de destalles
function iniciar_tabla_AD(idioma){

    if (idioma==="es"){

        return $('#table-Adq').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "pageLength": 15,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "scrollCollapse": true,
            "autoWidth": false,
            "columns": [
                { "width": "80%" },
                { "width": "10%" },
                { "width": "10%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-Adq').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "pageLength": 15,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "scrollCollapse": true,
            "autoWidth": false,
            "columns": [
                { "width": "80%" },
                { "width": "10%" },
                { "width": "10%" },
              ],
        })
    };
}

//inicializar la tabla de destalles
function iniciar_tabla_NAD(idioma){

    if (idioma==="es"){

        return $('#table-NoAdq').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "pageLength": 15,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "scrollCollapse": true,
            "autoWidth": false,
            "columns": [
                { "width": "80%" },
                { "width": "10%" },
                { "width": "10%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-NoAdq').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "pageLength": 15,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "scrollCollapse": true,
            "autoWidth": false,
            "columns": [
                { "width": "80%" },
                { "width": "10%" },
                { "width": "10%" },
              ],
        })
    };
}

// agregar elementos a un arreglo sólo si éste no pertenece ya al arreglo
function checkAndAdd(name) {
    var found = arregloQuitar.some(function (el) {
        return el === name;
    });
    if (!found) {
        arregloQuitar.push(name); 
    }
}

// agregar elementos a un arreglo sólo si éste no pertenece ya al arreglo
function checkAndAddAgregar(name) {
    var found = arregloAgregar.some(function (el) {
        return el === name;
    });
    if (!found) {
        arregloAgregar.push(name); 
    }
}

//Introducir en el arreglo el id del checkbox que se haya clickeado
$('#quitarModButton').on('click', function () {
    arregloQuitar = [];   
    $('.chkSelection').each(function(){
        if ($(this).prop('checked')===true){
            var aux = $(this).attr('id').split("-")[1];
            checkAndAdd(aux); 
        };
    });
    console.log(arregloQuitar);
    $('#processing-modal').modal('toggle');
    
    //Llamar funcion de creación del mensaje
    quitarModulos(arregloQuitar);
    
});

//Quitar Modulos
function quitarModulos(array){
    $.ajax({
        type:"POST",
        url: "/SU/modulos/",
        data: {"arrayQuitar":array, "action":"quitarModulos"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            swal("OK", "Modulos eliminados", "success");
            setTimeout(function(){
                window.location.reload();
            },1500);
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al intertar eliminar los modulos", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Introducir en el arreglo el id del checkbox que se haya clickeado
$('#agregarModButton').on('click', function () {
    arregloAgregar = [];   
    $('.chkSelection2').each(function(){
        if ($(this).prop('checked')===true){
            var aux = $(this).attr('id').split("-")[1];
            checkAndAddAgregar(aux); 
        };
    });
    console.log(arregloAgregar);
    $('#processing-modal').modal('toggle');
    
    //Llamar funcion de creación del mensaje
    agregarModulos(arregloAgregar);
    
});

//Agregar Modulos
function agregarModulos(array){
    $.ajax({
        type:"POST",
        url: "/SU/modulos/",
        data: {"arrayAgregar":array, "action":"agregarModulos"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            swal("OK", "Modulos agregados", "success");
            setTimeout(function(){
                window.location.reload();
            },1500);
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al intertar agregar los modulos", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}