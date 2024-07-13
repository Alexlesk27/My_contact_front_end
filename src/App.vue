<script setup>
import { ref } from 'vue';
import { client } from './api/client';
 // Certifique-se de que o caminho está correto

const name = ref('');
const email = ref('');
const phone = ref('');
const contacts = ref([]);
const showEditForm = ref(false);
const editContactId = ref(null);
const disableCreateForm = ref(false); // Variável para desabilitar o formulário de criação

async function handleForm() {
  await client.post(
    '/v1/contact',
    {
      name: name.value,
      email: email.value,
      phone: phone.value
    }
  );
  listContacts();
  clearForm();
}

async function listContacts() {
  contacts.value = (await client.get('/v1/contact')).data;
}

async function deleteContact(id) {
  await client.delete(`/v1/contact/${id}`);
  listContacts();
}

async function fillEditForm(contact) {
  editContactId.value = contact.id;
  name.value = contact.name;
  email.value = contact.email;
  phone.value = contact.phone;
  showEditForm.value = true;
  disableCreateForm.value = true; // Desabilita o formulário de criação
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

function clearForm() {
  name.value = '';
  email.value = '';
  phone.value = '';
  editContactId.value = null;
  showEditForm.value = false;
  disableCreateForm.value = false; // Habilita o formulário de criação
}

listContacts();
</script>

<template>
  <h1 id="my_contacts_label">Meus contatos</h1>
  <div class="container">
    <form @submit.prevent="handleForm" class="form">
      <input v-model="name" type="text" placeholder="Informe seu nome" class="input" :disabled="disableCreateForm">
      <input v-model="email" type="email" placeholder="Informe seu email" class="input" :disabled="disableCreateForm">
      <input v-model="phone" type="text" placeholder="Informe seu contato" class="input" :disabled="disableCreateForm">
      <input type="file" placeholder="Escolha uma imagem" class="input" :disabled="disableCreateForm">
      <button type="submit" class="button" :disabled="disableCreateForm">Salvar contato</button>
    </form>
  </div>

  <div class="contacts">
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th colspan="2">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.name }}</td>
          <td>{{ contact.email }}</td>
          <td>{{ contact.phone }}</td>
          
          <td><button @click="deleteContact(contact.id)" class="delete-button">Excluir</button></td>
          <td><button @click="fillEditForm(contact)" class="edit-button">Editar</button></td>
        </tr>
        
      </tbody>
    </table>
    
  </div>
  <h1 id="empty_list" v-if="contacts.length === 0">Lista Vazia</h1>

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
