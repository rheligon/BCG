var csrftoken = $.cookie('csrftoken');
var arregloQuitar = [];
var arregloAgregar = [];
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}


var tabla_AD = iniciar_tabla_AD(idiomaAux);
var tabla_NAD = iniciar_tabla_NAD(idiomaAux);

//inicializar la tabla de destalles
function iniciar_tabla_AD(idioma){

    if (idioma==="es"){

        return $('#table-Adq').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "pageLength": 5,
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
            "pageLength": 5,
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
            "pageLength": 5,
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
            "pageLength": 5,
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

//Agregar o sacar del arreglo quitar cuando se haya seleccionado un modulo
function chequear(elemento){

    var id = elemento.id.split("-")[1];
    var index = $.inArray(id, arregloQuitar);
 
    if ( index === -1 ) {
        arregloQuitar.push( id );
    } else {
        arregloQuitar.splice( index, 1 );
    }

}

//Agregar o sacar del arreglo agregar cuando se haya seleccionado un modulo
function chequearA(elemento){

    var id = elemento.id.split("-")[1];
    var index = $.inArray(id, arregloAgregar);
 
    if ( index === -1 ) {
        arregloAgregar.push( id );
    } else {
        arregloAgregar.splice( index, 1 );
    }

}

//Introducir en el arreglo el id del checkbox que se haya clickeado
$('#quitarModButton').on('click', function () {
    
    if (idioma== 0){
        msj = "¿Seguro que desea eliminar los módulos seleccionados?";
    } else {
        msj = "Sure you want to delete selected modules?";
    }
    swal({
        title: "",
        text: msj,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Ok"},
        function(){
            $('#processing-modal').modal('toggle');
            //Llamar funcion de creación del mensaje
            quitarModulos(arregloQuitar);
            arregloQuitar = [];
        }
    ); 
});

//Quitar Modulos
function quitarModulos(array){
    $.ajax({
        type:"POST",
        url: "/SU/modulos/",
        data: {"arrayQuitar":array, "action":"quitarModulos"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma== 0){
               swal("OK", "Modulos eliminados", "success");
            } else {
                swal("OK", "Deleted Modules", "success");
            }
            setTimeout(function(){
                history.go(0);
                window.location.href = window.location.href;
            },1500);
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar eliminar los modulos", "error");
            } else {
                swal("Ups!", "Error occurred trying to eliminate modules", "error");
            }
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
    
    if (idioma== 0){
        msj = "¿Seguro que desea agregar los módulos seleccionados?";
    } else {
        msj = "Sure you want to add selected modules?";
    }
    swal({
        title: "",
        text: msj,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Ok"},
        function(){
            $('#processing-modal').modal('toggle');
            //Llamar funcion de creación del mensaje
            agregarModulos(arregloAgregar);
            arregloAgregar = [];
        }
    ); 
});

//Agregar Modulos
function agregarModulos(array){
    $.ajax({
        type:"POST",
        url: "/SU/modulos/",
        data: {"arrayAgregar":array, "action":"agregarModulos"},
        success: function(data){
            $('#processing-modal').modal('toggle');
             if (idioma== 0){
               swal("OK", "Modulos agregados", "success");
            } else {
                swal("OK", "Added Modules", "success");
            }
            setTimeout(function(){
                history.go(0);
                window.location.href = window.location.href;
            },1500);
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar agregar los modulos", "error");
            } else {
                swal("Ups!", "Error occurred trying to insert modules", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}