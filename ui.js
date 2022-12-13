$(document).on('click', '.bullet-open-advanced', function() {
  $(this).val($(this).val() == '-' ? '+' : '-');
  $('.bullet-advanced').slideToggle();
});

function objectifyForm(formArray) {
  let obj = {};
  for (let i = 0; i < formArray.length; i++) {
    obj[formArray[i]['name']] = formArray[i]['value'];
  }
  return obj;
}

$(document).on('submit', '.bullet-gun', function() {
  let bullet = objectifyForm($(this).serializeArray());
  let duration = 5000 + Math.floor(Math.random() * 5000);
  let size = bullet['size'];
  bullet['position'] = `calc((100% - ${size}rem) * ${Math.random()*0.85+0.05})`;
  bullet['duration'] = duration;
  chrome.runtime.sendMessage({
    type: 'bullet-shot',
    bullet: bullet
  });
  $(this).find('input[name="content"]').focus().select();
  event.preventDefault();
});

$(document).on('input', 'input[name="opacity"]', function() {
  let opacity = $(this).val();
  $(this).next('.tooltiptext').text(`Opacity (${opacity})`);
});

function parentURL() {
  let url = window.location.href;
  return url.substring(url.indexOf('?url=')+'?url='.length);
}

$(document).on('change', 'input[name="opacity"]', function() {
  window.parent.postMessage({type: 'opacity', value: $(this).val()}, parentURL());
})

$(document).ready(function() {
  $('input[name="target"]').val(parentURL());
});
