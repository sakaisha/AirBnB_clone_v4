dy(function () {
  /* check the aminity */
  let addCheck = function () {
    let list = [];
    $('input[type=checkbox]').each(function () {
      if (this.checked) {
        list.push($(this).attr('data-name'));
      }
    });
    $('div.amenities > h4').text(list.join(', '));
  };
  $('input[type=checkbox]').on('click', addCheck);
});
