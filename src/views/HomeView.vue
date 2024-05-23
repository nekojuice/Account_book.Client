<script setup>
import { ref } from 'vue'
import { authService } from '@/services/authService'
import { accountingService } from '@/services/accountingService'

// 登入資訊物件
const userLoginInfo = ref({ email: '', password: '' })
// 登入
async function login() {
  await authService.login(userLoginInfo.value)
}

function testbtn() {
  console.log(accountingService.getAllAccountingData())
}
</script>

<template>
  <main>
    <div class="container">
      <div
        class="sm input-group d-flex flex-column bg-light border border-3 rounded-3 m-auto p-3 maxLoginFrame"
      >
        <span>帳號</span>
        <input type="text" class="mb-3" v-model="userLoginInfo.email" />
        <span>密碼</span>
        <input type="password" class="mb-3" v-model="userLoginInfo.password" />
        <button type="button" class="btn btn-primary" @click="login">登入</button>
      </div>
    </div>

    <div><button type="button" @click="testbtn">test</button></div>
  </main>
</template>

<style scoped>
.maxLoginFrame {
  max-width: 480px;
}
</style>
