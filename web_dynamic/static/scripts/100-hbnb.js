$(document).ready(function () {
  /*check the aminity */
  let id_ame_list;
  let id_st_list;
  let id_ct_list;
  let ame_list;
  let st_list;
  let addCheck = function() {
    id_ame_list = [];
    id_st_list = [];
    id_ct_list = [];
    ame_list = [];
    st_list = [];
    ct_list = [];
    //get amenities list
    $('div.amenities input[type=checkbox]').each(function () {
      if (this.checked) {
        ame_list.push($(this).attr('data-name'));
        id_ame_list.push($(this).attr('data-id'));
      }
    });
    $('div.amenities > h4').text(ame_list.join(', '));
    //get state list
    $('div.locations h2 input[type=checkbox]').each(function () {
      if (this.checked) {
        st_list.push($(this).attr('data-name'));
        id_st_list.push($(this).attr('data-id'));
      }
    });
    $('div.locations > h4').text(st_list.join(', '));
    //get city list
    $('div.locations li input[type=checkbox]').each(function () {
      if (this.checked) {
        st_list.push($(this).attr('data-name'));
        id_ct_list.push($(this).attr('data-id'));
      }
    });
    $('div.locations > h4').text(st_list.join(', '));
  }
  $('input[type=checkbox]').on('click', addCheck);
  /* update status */
  let url = 'http://0.0.0.0:5001/api/v1/status/';
  $.get(url, function(status) {
    if (status.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  /* search place handling */
  function get_place(dict) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      dataType: 'json',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(dict),
      success: function( data, textStatus, jQxhr ){
      	data.sort(function (a, b) {
          let keyA = a.name.toUpperCase();
          let keyB = b.name.toUpperCase();
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
        for (let i in data) {
          let d = data[i];
          let user_url = 'http://0.0.0.0:5001/api/v1/users/' + d.user_id;
          $.when($.ajax(user_url)).done(function(user_d) {
            let user = user_d.first_name + ' ' + user_d.last_name;
                  $('section.places').append(
      	      '<article>' +
      		  '<div class="title"><h2>' + d.name + '</h2>' +
      		  '<div class="price_by_night">' + d.price_by_night + '</div>' +
      		  '</div>' +
      		  '<div class="information">' +
                          '<div class="max_guest">' +
                            '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
                            '<br />' + d.max_guest + 'Guests' +
                          '</div>' +
                          '<div class="number_rooms">' +
                            '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
                            '<br />' + d.number_rooms + 'Bedrooms' +
                          '</div>' +
                          '<div class="number_bathrooms">' +
                            '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
                            '<br />' + d.number_bathrooms + 'Bathroom' +
                          '</div>' +
      		  '</div>' +
      		  '<div class="user"><strong>Owner: ' + user + '</strong></div>' +
      		  '<div class="description">' + d.description + '</div>' +
      	      '</article>');
          });
        }
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log( errorThrown );
      }
    });
  }

  $('button').click(function () {
    let dic = {'states': [], 'cities': [], 'amenities': []};
    for (let i in id_ame_list) {
      dic['amenities'].push(String(id_ame_list[i]));
    }
    for (let i in id_st_list) {
      dic['states'].push(String(id_st_list[i]));
    }
    for (let i in id_ct_list) {
      dic['cities'].push(String(id_ct_list[i]));
    }
    $('article').remove();
    get_place(dic, ame_list);
    ame_list = [];
    st_list = [];
    ct_list = [];
  });
  get_place({});
});
