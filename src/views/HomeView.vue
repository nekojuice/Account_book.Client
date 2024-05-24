<script setup>
import { onMounted, ref } from 'vue'
import { authService } from '@/services/authService'
import { accountingService } from '@/services/accountingService'
import { labelTypeService } from '@/services/labelTypeService'

onMounted(async () => {
  const result = await labelTypeService.getAllLabelType()
  lableTypeArray.value = result.returnData
})

// 登入資訊物件
const isLogin = ref(false) // 是否登入
const userLoginInfo = ref({ email: '111', password: '222' }) // 登入input
// 登入
async function onLogin() {
  // 登入
  await authService.login(userLoginInfo.value)
  // 登入後撈取清單
  const getResult = await accountingService.getAllAccountingData()
  accountingData.value = getResult.returnData
  if (getResult.returnCode != 2000) {
    alert('讀取資料失敗')
  }
  isLogin.value = !isLogin.value
}
// 登出
function onLogout() {
  isLogin.value = !isLogin.value
  // TODO: 刪除 cookie
}

// 帳本datatable資料
const accountingData = ref([])

// 新增用物件
const insertData = ref({ typeId: '', message: null, money: null, recordTime: null })
// 消費類別-下拉選單
const lableTypeArray = ref([])
// 驗證 insertData
function isValidatedInsertData() {
  for (const prop in insertData.value) {
    if (!insertData.value[prop] && prop != 'message') return false
  }
  return true
}

// 送出新增
async function sendInsertAccounting() {
  if (!isValidatedInsertData()) {
    alert('尚有欄位未填寫')
    return
  }
  const postResult = await accountingService.postInsertAccountingData(insertData.value)
  if (postResult.returnCode != 2000) {
    alert('新增資料失敗')
  }
  const getResult = await accountingService.getAllAccountingData()
  accountingData.value = getResult.returnData
}
</script>

<template>
  <main>
    <div class="container">
      <nav><h2>Easy Accounting Book</h2></nav>

      <!-- 未登入 -->
      <div
        v-if="!isLogin"
        class="input-group d-flex flex-column bg-light border border-3 rounded-3 m-auto p-3 maxLoginFrame"
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

      <!-- 已登入 -->
      <div v-if="isLogin">
        <button type="button" class="btn btn-danger" @click="onLogout">登出</button>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          新增
        </button>
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
      </div>
    </div>
  </main>
  <!-- insert Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">新增一筆消費紀錄</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- 主區域 -->
        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text">時間</span
            ><input type="datetime-local" class="form-control" v-model="insertData.recordTime" />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">類型</span
            ><select name="LabelType" class="form-control" v-model="insertData.typeId">
              <option disabled value="" selected>請選擇類型</option>
              <option v-for="label in lableTypeArray" :key="label.typeId" :value="label.typeId">
                {{ label.typeName }}
              </option>
            </select>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">金額</span
            ><input type="number" class="form-control" v-model="insertData.money" />
          </div>
          <div>
            <span>備註</span
            ><textarea
              cols="30"
              rows="10"
              class="form-control"
              v-model="insertData.message"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="sendInsertAccounting">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maxLoginFrame {
  max-width: 480px;
  min-width: 220px;
}
</style>
