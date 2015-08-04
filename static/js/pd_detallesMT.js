var csrftoken = $.cookie('csrftoken');
var tabla_det = iniciar_tabla_detalle(idioma_tr);
var tabla_det96 = iniciar_tabla_detalle96(idioma_tr);

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-mtn95').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-mtn95').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })
    };
}

//inicializar la tabla de destalles96
function iniciar_tabla_detalle96(idioma){

    if (idioma==="es"){

        return $('#table-mtn96').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": true,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-mtn96').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": true,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })
    };
}
