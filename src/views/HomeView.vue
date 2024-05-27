<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup>
import { computed, onMounted, ref } from 'vue'
import { authService } from '@/services/authService'
import { accountingService } from '@/services/accountingService'
import { labelTypeService } from '@/services/labelTypeService'
import { Modal } from 'bootstrap'

onMounted(async () => {
  const result = await labelTypeService.getAllLabelType()
  lableTypeArray.value = result.returnData

  // 自動登入-判別cookie是否有登入狀態
  if (authService.getToken) {
    const getResult = await accountingService.getAllAccountingData() // 登入後撈取清單
    datatableData.value = getResult.returnData
    if (getResult.returnCode != 2000) {
      alert('讀取資料失敗')
      isLogin.value = false
    }
    isLogin.value = true
  }
})

// 登入資訊物件
const isLogin = ref(false) // 是否登入
const userLoginInfo = ref({ email: '111', password: '222' }) // 登入input
// 登入
async function onLogin() {
  const loginResult = await authService.login(userLoginInfo.value)
  if (loginResult.returnCode != 2000) {
    alert('登入失敗')
    return
  }
  getDatatable()
  isLogin.value = true
}
// 登出
function onLogout() {
  isLogin.value = false
  authService.logout()
}

// -----------------------------------
// Datatable
const lableTypeArray = ref([]) // 下拉選單 - 消費類別
const datatableData = ref([]) // 帳本datatable資料

// Datatable - 排序
const sortDatatableByDate = computed(() =>
  datatableData.value.sort(function (a, b) {
    return new Date(a.recordTime) - new Date(b.recordTime)
  })
)
// Datatable - 格式化顯示金額
const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})
// Datatable - Get資料清單
async function getDatatable() {
  const getResult = await accountingService.getAllAccountingData() // [ ] 重撈datatable
  datatableData.value = getResult.returnData
  if (getResult.returnCode != 2000) {
    alert('讀取資料失敗')
  }
}

// -----------------------------------
// 表單 - 新增/修改
const formData = ref({ typeId: '', message: null, money: null, recordTime: null }) // 表單用響應式物件
const formEditMode = ref('新增模式') // 表單模式
const formDataModalToggle = ref(null) // 表單區塊 Modal 顯示開關
// 表單 - 切換模式 mode: 新增模式(default) | 修改模式
function changeFormEditMode(mode, ListedAccountingId) {
  formEditMode.value = mode
  if (ListedAccountingId) {
    const localData = datatableData.value.filter(function (data) {
      return data.accountingId === ListedAccountingId
    })[0] // 排序
    formData.value = { ...localData } // 需斷開響應式物件
  } else {
    formData.value = { typeId: '', message: null, money: null, recordTime: null }
  }
}
// 表單 - 送出 新增/修改
async function sendFormData() {
  if (!isValidatedFormValue()) {
    // 驗證資料未通過
    alert('尚有欄位未填寫')
    return
  }
  if (formEditMode.value === '新增模式') {
    const postResult = await accountingService.postInsertAccountingData(formData.value)
    if (postResult.returnCode != 2000) {
      alert('新增資料失敗')
      return
    }
    getDatatable()
  }
  if (formEditMode.value === '修改模式') {
    const postResult = await accountingService.putUpdateAccountingData(formData.value)
    if (postResult.returnCode != 2000) {
      alert('修改資料失敗')
      return
    }
    getDatatable()
  }
  Modal.getInstance(formDataModalToggle.value)?.hide() // 驗證通過 && 送出成功->關閉 modal
}
// 表單 - 驗證資料
function isValidatedFormValue() {
  return Boolean(formData.value.typeId && formData.value.money && formData.value.recordTime) // 必填欄位
}
// 表單 - 刪除
async function sendDeleteAccounting() {
  console.log(formData.value.accountingId)
  const deleteResult = await accountingService.deleteAccountingData({
    accountingId: formData.value.accountingId
  })
  if (deleteResult.returnCode != 2000) {
    alert('刪除資料失敗')
  }
  getDatatable()
}
</script>

<template>
  <main>
    <div class="container">
      <nav class="d-flex mt-5">
        <h2 class="d-flex justify-content-start me-auto">Easy Accounting Book</h2>
        <button
          type="button"
          class="btn btn-danger d-flex justify-content-end align-items-center"
          v-if="isLogin"
          @click="onLogout"
        >
          登出
        </button>
      </nav>
      <hr class="mt-3 mb-3" />
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
        <button
          type="button"
          class="btn btn-primary mb-3 float-end"
          data-bs-toggle="modal"
          data-bs-target="#formDataModal"
          @click="changeFormEditMode('新增模式', null)"
        >
          + 新增消費記錄
        </button>
        <!-- datatable -->
        <table class="table table-striped">
          <thead class="table-primary">
            <tr>
              <td>消費日期</td>
              <td>類型</td>
              <td>金額</td>
              <td>備註</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in sortDatatableByDate" :key="data.accountingId">
              <td>{{ new Date(data.recordTime).toLocaleString() }}</td>
              <td>{{ data.typeName }}</td>
              <td>
                {{ moneyFormatter.format(data.money) }}
              </td>
              <td>{{ data.message }}</td>
              <td>
                <button
                  class="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#formDataModal"
                  @click="changeFormEditMode('修改模式', data.accountingId)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
  <!-- 新增/修改表單 Modal -->
  <div
    class="modal fade"
    id="formDataModal"
    tabindex="-1"
    aria-labelledby="formDataModalLabel"
    aria-hidden="true"
    ref="formDataModalToggle"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="formDataModalLabel">
            <span v-if="formEditMode === '新增模式'">新增</span
            ><span v-if="formEditMode === '修改模式'">修改</span>消費紀錄
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- modal 主區域 -->
        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text">時間</span
            ><input type="datetime-local" class="form-control" v-model="formData.recordTime" />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">類型</span
            ><select name="LabelType" class="form-control" v-model="formData.typeId">
              <option disabled value="" selected>請選擇類型</option>
              <option v-for="label in lableTypeArray" :key="label.typeId" :value="label.typeId">
                {{ label.typeName }}
              </option>
            </select>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">金額</span
            ><input type="number" class="form-control" v-model="formData.money" />
          </div>
          <div>
            <span>備註</span
            ><textarea
              cols="30"
              rows="10"
              class="form-control"
              v-model="formData.message"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
            v-if="formEditMode === '修改模式'"
          >
            <i class="bi bi-trash"></i> 刪除
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="sendFormData">儲存</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 修改-刪除確認窗 Modal -->
  <div
    class="modal fade"
    id="deleteModal"
    tabindex="-1"
    aria-labelledby="deleteModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModal">確認刪除?</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-toggle="modal"
            data-bs-target="#formDataModal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="sendDeleteAccounting"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 登入區塊限制縮放寬度 */
.maxLoginFrame {
  max-width: 480px;
  min-width: 220px;
}
</style>
