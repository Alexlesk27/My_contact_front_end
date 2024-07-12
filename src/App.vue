<script setup>
import { ref } from 'vue';
import { client } from './api/client';

const name = ref();
const email = ref();
const phone = ref();
const contacts = ref([]);

async function handleForm() {
 await client.post(
    '/v1/contact',
    {
      name: name.value,
      email: email.value,
      phone: phone.value
    }
  )
  listContacts();
}

async function listContacts() {
  contacts.value = (await client.get('/v1/contact')).data
}

async function deleteContact(id){
  await client.delete(`/v1/contact/${id}`)
  listContacts();

}

listContacts();

</script>

<template>
  <div>
    <form @submit.prevent="handleForm">
      <input v-model="name" type="text" placeholder="Informe seu nome">
      <input v-model="email" type="email" placeholder="Informe seu email">
      <input v-model="phone" type="text" placeholder="Informe seu contato">
      <input type="file" placeholder="Escolha uma imagem">
      <button type="submit">Salvar contato</button>
    </form>
  </div>

  <div>
    <table>
      <thead>
        <tr>
          <th>
            nome
          </th>

          <th>
            email
          </th>

          <th>
            telefone
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts">
          <td>{{contact.name}}</td>
          <td>{{contact.email}}</td>
          <td>{{contact.phone}}</td>
          <button @click = deleteContact(contact.id)>delete</button>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped></style>
