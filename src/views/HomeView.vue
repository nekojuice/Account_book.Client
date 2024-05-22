<script setup>
import { ref } from 'vue'

const account = ref('')
const password = ref('')
function login() {
  console.log(account.value)
  console.log(password.value)
}
</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="onSubmit">
        <div class="input-group mb-3 d-flex flex-column">
          <span>帳號</span>
          <input type="text" class="mb-3" v-model="account" />
          <span>密碼</span>
          <input type="password" class="mb-3" v-model="password" />
          <button type="submit" class="btn btn-primary" @click="login">登入</button>
        </div>
      </form>
    </div>
  </main>
</template>
