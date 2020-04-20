jQuery(document).ready(function($){

  categorySelectionMenuToggle(false);

  $('#categorySelectionButton').click(function(){
    categorySelectionMenuToggle(true);
  });

  $('#categorySelectionDoneButton').click(function(){
    categorySelectionMenuToggle(false);
  });

  var selectedCategories = [];
  $.each($("#selectedCategories #selected label"), function(){
    selectedCategories.push($(this).attr('data_category'));
    $('#selectMore label.category[data_category="'+$(this).attr('data_category')+'"]').addClass('checked');
    $('#selectMore label.category[data_category="'+$(this).attr('data_category')+'"] input').prop('checked', true);
  });
  $("input[name='category']").val(selectedCategories.toString());

  $('#selectMore label.category').on('click', function(evt){
    evt.stopPropagation();
    evt.preventDefault();

    if($(this).hasClass('checked')) {
      $(this).removeClass('checked');
      $("input",this).prop('checked', false);
    } else {
      $(this).addClass('checked');
      $("input",this).prop('checked', true);
    }

    var selectedCategories = [];
    $('#selectedCategories #selected label').remove();
    $.each($("#selectMore label input:checked"), function(){
      selectedCategories.push($(this).val());
      $('#selectedCategories #selected').prepend('<label class="category checked">'+$(this).val()+'</label>');
    });
    $("input[name='category']").val(selectedCategories.toString());
  })

  $('#pagination button').on('click', function(){
    let newUrl = new URL(window.location.href);

    direction = $(this).attr('id');
    page = newUrl.searchParams.get('page');

    if( direction == "next" ) page++;
    else page--;

    console.log(page);

    category = newUrl.searchParams.get('category');
    ordercolumn = newUrl.searchParams.get('ordercolumn');
    orderby = newUrl.searchParams.get('orderby');

    changeUrl(page, category, ordercolumn, orderby)
  })

});

function categorySelectionMenuToggle(categorySelection) {
  if( categorySelection === true ) {
    jQuery('#categorySelection').show();
    jQuery('#movieTitleSelection').hide();
    jQuery('#selectedCategories').hide();
    jQuery('#runtimeSelection').hide();
    jQuery('#filterButton').hide();
  } else {
    jQuery('#categorySelection').hide();
    jQuery('#movieTitleSelection').show();
    jQuery('#selectedCategories').show();
    jQuery('#runtimeSelection').show();
    jQuery('#filterButton').show();
  }
}

function changeCategory(category) {

  let newUrl = new URL(window.location.href);

  page = newUrl.searchParams.get('page');
  ordercolumn = newUrl.searchParams.get('ordercolumn');
  orderby = newUrl.searchParams.get('orderby');

  changeUrl(page, category, ordercolumn, orderby)

}

function changeOrder(ordercolumn) {

  let newUrl = new URL(window.location.href);

  page = newUrl.searchParams.get('page');
  category = newUrl.searchParams.get('category');
  orderby = newUrl.searchParams.get('orderby');

  if( orderby === "DESC") orderby = "ASC";
  else orderby = "DESC";

  changeUrl(page, category, ordercolumn, orderby);

}

function changeUrl(page, category, ordercolumn, orderby) {

  let newUrl = new URL(window.location.href);

  page ? newUrl.searchParams.set('page',page) : newUrl.searchParams.set('page','0');
  category ? newUrl.searchParams.set('category',category) : newUrl.searchParams.set('category','');
  ordercolumn && newUrl.searchParams.set('ordercolumn',ordercolumn);
  orderby && newUrl.searchParams.set('orderby',orderby);

  window.location.href = newUrl.href;

}
