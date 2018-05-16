
//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()


$(document).ready(function(){

  getData(InitSelect); // Invocamos el llenado de los selectores
  $('#buscar').on('click', () => {
    let busqueda = $('#checkPersonalizada')[0]
    if (busqueda.checked){
      getData(personalizarBusqueda)
    } else {
      getData(MostrarDatos);
    }
  })

})

//RESULTADO PARA LOS SELECTORES
function InitSelect(res){  
  var cities = [];
  var types = [];  
  $.each(res, function (index, value) {
    cities[index] = value.Ciudad
    types[index] = value.Tipo
  })
  cities = unique(cities)
  types = unique(types) 
  getSelectHTML(cities,'#ciudad');  
  getSelectHTML(types,'#tipo');  
}

// Hacemos un llenado de los selectores
function getSelectHTML(arry, select){    
  $.map(arry, function(val){
    var option = `<option value='${val}'>${val}</option>`;        
    $(select).append(option);
  })
}

//BUSQUEDA EN BASE A LOS PARAMETROS DE BUSQUEDA
function personalizarBusqueda(res){  
  let filtro = [],
      rango = $('#rangoPrecio').data('ionRangeSlider');
      city = $('#ciudad').val(),
      type = $('#tipo').val(),
      from = parseFloat(rango.result.from),
      to   = parseFloat(rango.result.to),
      add  = true

      
  $.each(res, function (index, value) {
    add = true
    let precio = parseFloat(value.Precio.substring(1,value.Precio.length).replace(/,/, ''))
    if (precio < from || precio > to) {
      add = false
    }
    if ((type != '') && add) {
      if (type != value.Tipo) {
        add = false
      }       
    }
    if ((city != '') && add) {
      if (city != value.Ciudad) {
        add = false
      }
    }
    if (add) {
      filtro.push(res[index])  
    }
  })

  MostrarDatos(filtro)
}

// Mostramos los resultados en pantalla de acuerdo a los criterios
// del usuario
function MostrarDatos(data) {
  if (data.length <= 0) 
    alert('No se encontraron datos.. Revise los precios por favor!')
  $(".itemMostrado").remove()
  $.each(data, function (index, value) {
    let template = `<div class='card horizontal itemMostrado'>
                      <div class='card-image'> <img src='img/home.jpg'> </div>
                      <div class='card-stacked'>
                        <div class='card card-content'>
                          <div><b> Dirección: </b>${value.Direccion} </div>
                          <div><b> Ciudad: </b>${value.Ciudad} </div>
                          <div><b> Telefono: </b>${value.Telefono}</div>
                          <div><b> Codigo Postal: </b>${value.Codigo_Postal} </div>
                          <div><b> Precio: </b><span class='precioTexto'>${value.Precio}</span> </div>
                          <div><b> Tipo: </b>${value.Tipo} </div>
                        </div>
                        <div class='card-action right-align'> <a href='#'>Ver más.</a> </div>
                      </div>
                    </div>`
    $('.lista').append(template)
  })
}

function getData(methodRes){
  $.ajax({
    url: 'data.json', //This URL is for Json file
    type:"get",
    dataType: "json",
    data: {},
    success: function(data) {
        methodRes(data);
    },
    error: function(err) {
        //Do alert is error
        console.log(err);
    }
  });
}

function unique(array){
    return array.filter(function(el, index, arr) {
        return index === arr.indexOf(el);
    });
}