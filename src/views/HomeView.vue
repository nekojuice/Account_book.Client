<script setup>
import { ref } from 'vue'
import { authService } from '@/services/authService'
import { accountingService } from '@/services/accountingService'

// 登入資訊物件
const userLoginInfo = ref({ email: '111', password: '222' })
// 登入
async function onLogin() {
  await authService.login(userLoginInfo.value)
  const result = await accountingService.getAllAccountingData()
  accountingData.value = result.returnData
}

// 帳本資料
const accountingData = ref([])
</script>

<template>
  <main>
    <div class="container">
      <div
        class="sm input-group d-flex flex-column bg-light border border-3 rounded-3 m-auto p-3 maxLoginFrame"
      >
        <span>帳號</span>
        <input type="text" class="mb-3" v-model="userLoginInfo.email" @keyup.enter="onLogin" />
        <span>密碼</span>
        <input
          type="password"
          class="mb-3"
          v-model="userLoginInfo.password"
          @keyup.enter="onLogin"
        />
        <button type="button" class="btn btn-primary" @click="onLogin" @keyup.enter="onLogin">
          登入
        </button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <td>消費日期</td>
          <td>類型</td>
          <td>金額</td>
          <td>備註</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in accountingData" :key="data.accountingId">
          <td>{{ data.recordTime }}</td>
          <td>{{ data.typeName }}</td>
          <td>{{ data.money }}</td>
          <td>{{ data.message }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.maxLoginFrame {
  max-width: 480px;
}
</style>
