let superurl,
  review = 1;

if (window.location.href.includes('?')) {
  superurl = window.location.href.split('?')[0];
} else superurl = window.location.href;

const hackId = document.querySelector('#user-id-hack').className.split(' ')[2];
const superId = superurl.split('/')[4];

document.querySelectorAll('aside').forEach((each) => {
  if (hackId === each.className.split(' ')[2]) {
    const upHackId = each.className.split(' ')[3];

    each.firstElementChild.addEventListener('click', async () => {
      const response = await axios.delete(
        `/tours/${superId}/reviews/${upHackId}`
      );

      if (response.status === 200) window.location.replace(`/tours/${superId}`);
    });

    each.className = 'float-end';
    review++;
  }
});
