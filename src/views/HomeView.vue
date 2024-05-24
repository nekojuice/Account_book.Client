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
})
// 消費類別-下拉選單 (初始化)
const lableTypeArray = ref([])

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

// -----------------------------------
// 帳本datatable資料
const accountingData = ref([])
// 排序datatable
const sortDatatableByDate = computed(() =>
  accountingData.value.sort(function (a, b) {
    return new Date(a.recordTime) - new Date(b.recordTime)
  })
)
// watch(accountingData, () => {
//   accountingData.value.sort(function (a, b) {
//     return new Date(a.recordTime) - new Date(b.recordTime)
//   })
//})

// 表單用物件
const formData = ref({ typeId: '', message: null, money: null, recordTime: null })

// 資料 CRUD
// 表單模式: 新增模式(default) | 修改模式
const formEditMode = ref('新增模式')
function changeFormEditMode(mode, ListedAccountingId) {
  formEditMode.value = mode
  if (ListedAccountingId) {
    formData.value = accountingData.value.filter(function (data) {
      return data.accountingId === ListedAccountingId
    })[0]
  } else {
    formData.value = { typeId: '', message: null, money: null, recordTime: null }
  }
}

// FormDataModal 控制顯示
const refFormDataModal = ref(null)
// 送出表單
async function sendFormData() {
  if (!isValidatedFormValue()) {
    alert('尚有欄位未填寫')
    return
  }
  if (formEditMode.value === '新增模式') {
    const postResult = await accountingService.postInsertAccountingData(formData.value)
    if (postResult.returnCode != 2000) {
      alert('新增資料失敗')
      return
    }
    const getResult = await accountingService.getAllAccountingData() // [ ] 重撈datatable?
    accountingData.value = getResult.returnData
  }
  if (formEditMode.value === '修改模式') {
    const postResult = await accountingService.putUpdateAccountingData(formData.value)
    if (postResult.returnCode != 2000) {
      alert('修改資料失敗')
      return
    }
    const getResult = await accountingService.getAllAccountingData() // [ ] 重撈datatable?
    accountingData.value = getResult.returnData
  }
  Modal.getInstance(refFormDataModal.value)?.hide() // 需要條件控制是否關閉 modal
}
// 驗證 formData 三個必填欄位
function isValidatedFormValue() {
  return Boolean(formData.value.typeId && formData.value.money && formData.value.recordTime)
}
async function sendDeleteAccounting() {
  console.log(formData.value.accountingId)
  const deleteResult = await accountingService.deleteAccountingData({
    accountingId: formData.value.accountingId
  })
  if (deleteResult.returnCode != 2000) {
    alert('刪除資料失敗')
  }
  const getResult = await accountingService.getAllAccountingData() // [ ] 重撈datatable?
  accountingData.value = getResult.returnData
}
</script>

<template>
  <main>
    <div class="container">
      <nav>
        <h2>Easy Accounting Book</h2>
        <button type="button" class="btn btn-danger" v-if="isLogin" @click="onLogout">登出</button>
      </nav>

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
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#formDataModal"
          @click="changeFormEditMode('新增模式', null)"
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
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in sortDatatableByDate" :key="data.accountingId">
              <td>{{ data.recordTime }}</td>
              <td>{{ data.typeName }}</td>
              <td>{{ data.money }}</td>
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
  <!-- formData Modal -->
  <div
    class="modal fade"
    id="formDataModal"
    tabindex="-1"
    aria-labelledby="formDataModalLabel"
    aria-hidden="true"
    ref="refFormDataModal"
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
        <!-- BUG v-model 雙向綁定會造成，送出前datatable資料就更改，
          若取消會造成資料不同步 -->
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
  <!-- delete confirm Modal -->
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
        <!-- <div class="modal-body"></div> -->
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
.maxLoginFrame {
  max-width: 480px;
  min-width: 220px;
}
</style>
