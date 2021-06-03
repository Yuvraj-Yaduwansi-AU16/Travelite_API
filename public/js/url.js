if (
  window.location.href.includes('?') &&
  window.location.href.split('?')[1] !== ''
) {
  const query = window.location.href.split('?')[1].split('&');
  query.forEach((each) => {
    let [key, value] = each.split('=');

    if (key === 'limit') value = 'limit-' + value;

    document.querySelector(`#${value}`).setAttribute('checked', '');
  });
}

document.querySelector('#clear-btn').addEventListener('click', () => {
  document.querySelectorAll('input').forEach((each) => {
    each.removeAttribute('checked');
  });
});
