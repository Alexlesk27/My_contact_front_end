<script setup>
import { ref } from 'vue';
import { client } from './api/client';


const name = ref('');
const email = ref('');
const phone = ref('');
const contacts = ref([]);
const image = ref(null)
const editContactId = ref()

const errors = ref({
  name: '',
  email: '',
  phone: ''
});

const disableCreateForm = ref(false);
const showEditForm = ref(false);

async function handleForm() {
  if (validateForm()) {
    const form = new FormData;
    form.append("name", name.value)
    form.append("email", email.value)
    form.append("phone", phone.value)
    form.append("image", image.value)
    await client.post('/v1/contact', form);
    listContacts();
    clearForm();
  }
}

function validateForm() {
  let isValid = true;
  if (!name.value) {
    errors.value.name = 'Nome é obrigatório';
    isValid = false;
  } else {
    errors.value.name = '';
  }

  if (!email.value) {
    errors.value.email = 'Email é obrigatório';
    isValid = false;
  } else {
    errors.value.email = '';
  }

  if (!phone.value) {
    errors.value.phone = 'Telefone é obrigatório';
    isValid = false;
  } else {
    errors.value.phone = '';
  }

  return isValid;
}

function saveImage(event) {
  console.log(event)
  image.value = event.target.files[0]
}

async function listContacts() {
  contacts.value = (await client.get('/v1/contact')).data;
}

async function deleteContact(id) {
  await client.delete(`/v1/contact/${id}`);
  listContacts();
}

async function updateContact() {

  await client.put(`/v1/contact/${editContactId.value}`, {
    name: name.value,
    email: email.value,
    phone: phone.value
  });
  listContacts();
  clearForm();
  showEditForm.value = false;
  disableCreateForm.value = false; // Habilita o formulário de criação
}

function fillEditForm(contact) {
  name.value = contact.name;
  email.value = contact.email;
  phone.value = contact.phone;
  disableCreateForm.value = true;
  showEditForm.value = true;
  editContactId.value = contact.id;
}

function clearForm() {
  name.value = '';
  email.value = '';
  phone.value = '';
  disableCreateForm.value = false;
  showEditForm.value = false;
}

listContacts();
</script>

<template>
  <h1 id="my_contacts_label">Meus contatos</h1>
  <div class="container">
    <form @submit.prevent="handleForm" class="form">
      <div class="input-container">
        <input v-model="name" type="text" placeholder="Informe seu nome" class="input" :disabled="disableCreateForm"
          :class="{ 'input-error': errors.name }">
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <div class="input-container">
        <input v-model="email" type="email" placeholder="Informe seu email" class="input" :disabled="disableCreateForm"
          :class="{ 'input-error': errors.email }">
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      <div class="input-container">
        <input v-model="phone" type="text" placeholder="Informe seu contato" class="input" :disabled="disableCreateForm"
          :class="{ 'input-error': errors.phone }">
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>
      <input type="file" @change="saveImage" placeholder="Escolha uma imagem" class="input"
        :disabled="disableCreateForm">
      <button type="submit" class="button" :disabled="disableCreateForm">Salvar contato</button>
    </form>
  </div>

  <div class="contacts">
    <table v-if="contacts.length > 0">
      <thead>
        <tr>
          <th></th>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th colspan="2">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td><img style="width: 80px;" :src="contact.image" alt=""></td>
          <td>{{ contact.name }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.phone }}</td>
          <td><button @click="deleteContact(contact.id)" class="delete-button">Excluir</button></td>
          <td><button @click="fillEditForm(contact)" class="edit-button">Editar</button></td>
        </tr>
      </tbody>
    </table>
    <h1 v-if="contacts.length === 0">Lista Vazia</h1>
  </div>

  <div v-if="showEditForm" class="bottom-sheet">
    <div class="bottom-sheet-content">
      <h2>Editar Contato</h2>
      <form @submit.prevent="updateContact" class="form">
        <input v-model="name" type="text" placeholder="Informe seu nome" class="input">
        <input v-model="email" type="email" placeholder="Informe seu email" class="input">
        <input v-model="phone" type="text" placeholder="Informe seu contato" class="input">
        <button type="submit" class="button">Salvar alterações</button>
        <button type="button" class="button cancel-button" @click="clearForm">Cancelar</button>
      </form>
    </div>
  </div>
</template>