let superurl;

if (window.location.href.includes('?')) {
  superurl = window.location.href.split('?')[0];
} else superurl = window.location.href;

const name = document.querySelector('#name');
const address = document.querySelector('#address');
const description = document.querySelector('#description');
const website = document.querySelector('#website');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');

const id = superurl.split('/');

const updateProfile = async () => {
  const data = {
    name: name.value,
    address: address.value,
    website: website.value,
    phone: phone.value,
    email: email.value,
    description: description.value,
  };

  try {
    const response = await axios.put(`/agency/${id[4]}`, data);
    if (response.status === 200) {
      window.location.replace(`/agency/${id[4]}`);
    }
  } catch (error) {
    window.location.replace(`/agency/${id[4]}`);
  }
};

const deleteProfile = async () => {
  try {
    const response = await axios.delete(`/agency/${id[4]}`);
    if (response.status === 200) {
      window.location.replace('/');
    }
  } catch (error) {
    window.location.replace(`/agency/${id[4]}`);
  }
};

document.querySelector('#update-btn').addEventListener('click', updateProfile);
document.querySelector('#delete-btn').addEventListener('click', deleteProfile);
