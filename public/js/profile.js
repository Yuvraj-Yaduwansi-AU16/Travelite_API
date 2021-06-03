const userId = document.querySelector('#delete-user').className.split(' ')[2];

document.querySelector('#delete-user').addEventListener('click', () => {
  axios.delete(`/users/${userId}`);
  window.location.replace(`/login`);
});

document.querySelectorAll('#unsubscribe').forEach((btn) => {
  const [, , , tourId, seats] = btn.className.split(' ');

  btn.addEventListener('click', () => {
    axios.put(`/users/${tourId}/deleteTour`);
    axios.put(`/tours/${tourId}/seats`, { seats: parseInt(seats) + 1 });

    setTimeout(() => window.location.replace(`/users/${userId}`), 100);
  });
});
