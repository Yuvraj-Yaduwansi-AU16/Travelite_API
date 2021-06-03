let superurlnew;

if (window.location.href.includes('?')) {
  superurlnew = window.location.href.split('?')[0];
} else superurlnew = window.location.href;

const title = document.querySelector('#title');
const description = document.querySelector('#description');
const fromDate = document.querySelector('#from');
const to = document.querySelector('#to');
const cost = document.querySelector('#cost');
const seats = document.querySelector('#seats');

const id = superurlnew.split('/');

const updateProfile = async () => {
  const data = {
    title: title.value,
    description: description.value,
    from: fromDate.value,
    to: to.value,
    cost: cost.value,
    seats: seats.value,
  };

  try {
    const response = await axios.put(`/tours/${id[4]}`, data);
    if (response.status === 200) {
      window.location.replace(`/tours/${id[4]}`);
    }
  } catch (error) {
    window.location.replace(`/tours/${id[4]}`);
  }
};

const deleteProfile = async () => {
  try {
    const response = await await axios.delete(`/tours/${id[4]}`);
    if (response.status === 200) {
      window.location.replace(`/`);
    }
  } catch (error) {
    window.location.replace(`/tours/${id[4]}`);
  }
};

document.querySelector('#update-btn').addEventListener('click', updateProfile);
document
  .querySelector('#delete-btn-tour')
  .addEventListener('click', deleteProfile);
