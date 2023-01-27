<template>
  <div>
  <!-- Top action panel of crud -->
    <div class="flex title-bar border-b border-gray-200">
      <!-- Title of crud -->
      <div class="flex w-64 h-10 py-1 title " >
        <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div class="leading-8 font-bold" v-html="model.title" ></div>
      </div>
      <!-- Actions button of the crud -->
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <!-- New Button -->
        <div class="mt-1 ml-2">
          <n-button type="success" @click="showCreateModal()" >
            <template #icon>
              <n-icon>
                <Add20Regular />
              </n-icon>
            </template>
            បន្ថែម
          </n-button>
        </div>
        <div class="w-2/5 relative" >
          <input type="text" @keypress.enter="filterRecords(false)" v-model="table.search" class="bg-gray-100 px-2 h-9 my-1 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 " placeholder="ស្វែងរក" />
          <Icon size="27" class="absolute right-1 top-2 text-gray-400 hover:text-blue-700 cursor-pointer" @click="filterRecords(false)" >
            <n-icon>
              <Search20Regular />
            </n-icon>
          </Icon>
        </div>
        
      </div>
      <!-- Filter panel of crud -->
      <div class="filters-bar"></div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel relative">
      <table class="vcb-table" >
        <tr class="vcb-table-headers" >
          <th class="vcb-table-header" >ល.រ</th>
          <th class="vcb-table-header">ការបរិយាយ</th>
          <th class="vcb-table-header">ចាប់ផ្ដើម</th>
          <th class="vcb-table-header">បញ្ចប់</th>
          <th class="vcb-table-header">ចំណាយពេល</th>
          <th class="vcb-table-header">ទឹកប្រាក់</th>
          <th class="vcb-table-header">ប្រភេទទឹកប្រាក់</th>
          <th class="vcb-table-header text-right">ស្ថានភាព</th>
          <th class="vcb-table-header text-right w-40" >ប្រតិបត្តិការ</th>
        </tr>
        <tr v-for="(record, index) in table.records.matched" :key='index' class="vcb-table-row" >
          <td class="vcb-table-cell font-bold" >{{ index + 1 }}</td>
          <td class="vcb-table-cell" >{{ record.name }}</td>
          <td  class="vcb-table-cell" >{{ record.start }}</td>
          <td  class="vcb-table-cell" >{{ record.end }}</td>
          <td class="vcb-table-cell" >{{ record.duration }}</td>
          <td class="vcb-table-cell" >{{ record.amount }}</td>
          <td class="vcb-table-cell" >
            <n-icon v-if="parseInt( record.amount_type ) == 1" size="30" class="text-blue-500" title="ជាចំណូល" ><AttachMoneyOutlined /></n-icon>
            <n-icon v-if="parseInt( record.amount_type ) != 1" size="30" class="text-red-500" title="ជាចំណាយ" ><AttachMoneyOutlined /></n-icon>
          </td>
          <td class="vcb-table-cell" >{{ record.status }}</td>
          <!-- <td  class="vcb-table-cell text-right w-24" >
            <n-icon size="30" :class="'cursor-pointer ' + (record.active == 1 ? ' text-green-500 ' : ' text-gray-500 ') " @click="activateAccount(record)" :title="record.active == 1 ? 'គណនីនេះកំពុងបើកតំណើរការ' : 'គណនីនេះកំពុងត្រូវបានបិទមិនអាចប្រើប្រាស់បាន' " >
              <IosCheckmarkCircleOutline />
            </n-icon>
          </td> -->
          <td class="vcb-table-actions-panel text-right w-40" >
            <!-- <n-icon size="30" class="cursor-pointer text-blue-500" @click="$router.push('/'+model.name+'/'+record.id+'/detail')" title="ព័ត៌មានលម្អិតរបស់ម្ចាស់គណនី" >
              <ContactCard28Regular />
            </n-icon> -->
            <n-icon size="30" class="cursor-pointer text-blue-500" @click="showEditModal(record)" title="កែប្រែព័ត៌មាន" >
              <Edit20Regular />
            </n-icon>
            <n-icon size="30" class="cursor-pointer text-red-500" @click="deleteAccount(record)" title="លុបគណនីនេះចោល" >
              <TrashOutline />
            </n-icon>
            <div class="mx-2 leading-8" >-</div>
            <n-icon v-if=" record.status == 4 " size="30" class="cursor-pointer text-blue-500" @click="continueTask(record)" title="បន្ដការងារ" >
              <RefreshCircleOutline />
            </n-icon>
            <n-icon v-if=" record.status == 1 || record.status == 4 " size="30" class="cursor-pointer text-green-500" @click="endTask(record)" title="បញ្ចប់ការងារ" >
              <CertificateCheck />
            </n-icon>
            <n-icon v-if=" record.status == 1 " size="30" class="cursor-pointer text-yellow-500" @click="pendingTask(record)" title="ដាក់ពន្យាពេល" >
              <Pause />
            </n-icon>
            <n-icon v-if=" record.status == 0 || record.status == 2 " size="30" class="cursor-pointer text-green-500" @click="startTask(record)" title="ចាប់ផ្ដើម" >
              <Play />
            </n-icon>
          </td>
        </tr>
      </table>
      <!-- Loading -->
      <div v-if="table.loading" class="table-loading absolute left-0 top-0 right-0 bottom-0 bg-white bg-opacity-75 ">
        <div class="spinner mt-24">
          <Icon size="40" class="animate-spin  text-blue-500" >
           <IosRefresh />
          </Icon><br/><br/>
          កំពុងអាន...
        </div>
        <div class="absolute top-3 right-3 " @click="closeTableLoading" >
          <Icon size="40" class="text-red-600" >
           <CloseCircleOutline />
          </Icon>
        </div>
      </div>
    </div>
    <!-- Pagination of crud -->
    <div class="vcb-table-pagination">
      <!-- First -->
      <!-- Previous -->
      <div class="vcb-pagination-page" v-html='"<"' @click="previous()" ></div>
      <!-- Pages (7) -->
      <div v-for='item in table.pagination.totalPages' :key='item' class="vcb-pagination-page" @click="goTo(item)" >{{ item }}</div>
      <!-- Next -->
      <div class="vcb-pagination-page" v-html='">"' @click="next()" ></div>
      <!-- Last -->
      <!-- Go to -->
      <!-- Total per page -->
    </div>
    <!-- Form create account -->
    <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal"/>
    <!-- Form update account -->
    <update-form v-bind:model="model" v-bind:record="editRecord" v-bind:show="editModal.show" :onClose="closeEditModal"/>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { Switcher, Play, Pause, CertificateCheck} from '@vicons/carbon'
import { AttachMoneyOutlined } from '@vicons/material'
import { Icon } from '@vicons/utils'
import { IosCheckmarkCircleOutline, IosRefresh } from '@vicons/ionicons4'
import { TrashOutline, CloseCircleOutline, RefreshCircleOutline } from '@vicons/ionicons5'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { Edit20Regular, Key16Regular, Save20Regular, Add20Regular, Search20Regular , ContactCard28Regular } from '@vicons/fluent'
/**
 * CRUD component form
 */
import CreateForm from './create.vue'
import UpdateForm from './update.vue'
export default {
  name: "User" ,
  components: {
    QrcodeVue ,
    Vue3Barcode,
    Switcher,
    Add20Regular ,
    RefreshCircleOutline ,
    AttachMoneyOutlined ,
    Play ,
    Pause ,
    CertificateCheck ,
    Icon,
    IosCheckmarkCircleOutline,
    CreateForm,
    IosRefresh ,
    CloseCircleOutline ,
    UpdateForm,
    Search20Regular ,
    Edit20Regular,
    Key16Regular,
    Save20Regular ,
    TrashOutline ,
    ContactCard28Regular
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()

    /**
     * Variables
     */    
    var model = reactive( {
      name: "task" ,
      title: "ការងារ"
    })
    var table = reactive( {
      loading: false ,
      search: '' ,
      records: {
        all: [] ,
        matched: []
      },
      columns: {
        searchable: {
          username: '' ,
          firstname: '' ,
          lastname: '' ,
          email: '' ,
          phone: '' ,
          active: ''
        },
        format: {
          username: '' ,
          firstname: '' ,
          lastname: '' ,
          email: '' ,
          phone: '' ,
          active: ''
        }
      } ,
      pagination: {
        perPage: 20 ,
        page: 1 ,
        totalPages: 0 ,
        totalRecords: 0
      }
    })

    function filterRecords(helper=true){
      if( helper ){
        table.records.matched = []
        if( table.search != "" ) {
          for(var index in table.records.all ){
            for(var field in table.records.all[index] ){
              if( (""+table.records.all[index][field]).includes( table.search ) !== false ) {
                table.records.matched.push( table.records.all[index] )
                break;
              }
            }
          }
        }
        if( table.records.matched.length <= 0 ) {
          table.records.matched = table.records.all
        }
      }else{
        setTimeout( goTo(1) , 500 )
      }
    }

    /**
     * Functions
     */
    function getRecords(){
      /**
       * Clear time interval after calling
       */
      window.clearTimeout()
      table.loading = true
      store.dispatch(model.name+'/list',{
        search: table.search ,
        perPage: table.pagination.perPage ,
        page: table.pagination.page
      }).then(res => {
        table.records.all = table.records.matched = res.data.records
        table.pagination = res.data.pagination
        closeTableLoading()
      }).catch( err => {
        console.log( err )
      })
    }
    function closeTableLoading(){
      table.loading = false
    }
    /**
     * Pagination functions
     */
    function previous(){
      goTo( table.pagination.page <= 1 ? 1 : table.pagination.page - 1 )
    }
    function next(){
      goTo( table.pagination.page >= table.pagination.totalPages ? table.pagination.totalPages : table.pagination.page + 1 )
    }
    function goTo(page){
      table.pagination.page = page > table.pagination.totalPages ? table.pagination.totalPages : ( page < 1 ? 1 : page)
      getRecords()
    }
    function updatePerpage(perPage){
      table.pagination.perPage = perPage < 5 ? 5 : ( perPage > 100 ? 100 : perPgae )
      table.pagination.page = 1
      getRecords()
    }

    // function activateAccount(record){
    //   dialog.warning({
    //     title: "បិទ ឬ បើក គណនី" ,
    //     content: "តើអ្នកចង់ " + ( record.active == 1 ? "បិទ" : "បើក" )+ " គណនីនេះមែនទេ ?" ,
    //     positiveText: 'បាទ / ចាស',
    //     negativeText: 'ទេ',
    //     onPositiveClick: () => {
    //       store.dispatch( model.name+'/update',{
    //         id: record.id ,
    //         active: record.active == 1 ? 0 : 1
    //       }).then( res => {
    //         if( res.data.ok ){
    //           notify.success({
    //             title: 'ស្ថានភាពគណនី' ,
    //             description: 'ស្ថានភាពគណនីបានកែប្រែជោគជ័យ។' ,
    //             duration: 3000
    //           })
    //         }else{
    //           notify.error({
    //             title: 'ស្ថានភាពគណនី' ,
    //             description: 'មានបញ្ហាក្នុងពេលកែប្រែស្ថានភាពគណនី។' ,
    //             duration: 3000
    //           })
    //         }
    //       }).catch( err => {
    //         message.error( err )
    //       })
    //     },
    //     onNegativeClick: () => {
          
    //     }
    //   })
    // }
    /**
     * Create modal handling
     */
    var createModal = reactive({show:false})
    function showCreateModal(){
      createModal.show = true
    }

    function closeCreateModal(){
      createModal.show = false
      getRecords()
    }

    var editModal = reactive({show:false})
    var editRecord = reactive({
      id: 0 ,
      name: '' ,
      duration: 0 ,
      amount: 0.0 ,
      amount_type: 0 ,
      exchange_rate: 0.0 
    })
    function showEditModal(record){
      editRecord.id = record.id
      editRecord.name = record.name ,
      editRecord.duration = record.duration ,
      editRecord.amount = record.amount ,
      editRecord.amountType = record.amount_type ,
      editRecord.exchangeRate = record.exchange_rate
      editModal.show = true
    }
    function closeEditModal(record){
      editModal.show = false
      getRecords()
    }

    function deleteRecord(record){
      dialog.warning({
        title: "លុបព័ត៌មាន" ,
        content: "តើអ្នកចង់ លុបមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'មានបញ្ហាក្នុងពេលលុបទិន្នន័យ។' ,
                duration: 3000
              })
            }
        }).catch( err => {
          message.error( err )
        })
        },
        onNegativeClick: () => {
        }
      })
    }
    function startTask(record){
      store.dispatch(model.name+'/start',{id:record.id}).then( res => {
        if( res.data.ok ){
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
          getRecords()
        }else{
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }
    function pendingTask(record){
      store.dispatch(model.name+'/pending',{id:record.id}).then( res => {
        if( res.data.ok ){
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
          getRecords()
        }else{
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }
    function continueTask(record){
      store.dispatch(model.name+'/continue',{id:record.id}).then( res => {
        if( res.data.ok ){
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
          getRecords()
        }else{
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }
    function endTask(record){
      store.dispatch(model.name+'/end',{id:record.id}).then( res => {
        if( res.data.ok ){
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
          getRecords()
        }else{
          notify.success({
            title: 'ការងារ' ,
            description: res.data.message ,
            duration: 3000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }

    /**
     * Initial the data
     */
    getRecords()


    return {
      /**
       * Variables
       */
      model ,
      table ,
      /**
       * Table
       */
      filterRecords ,
      /**
       * Pagination functions
       */
      updatePerpage ,
      goTo ,
      previous ,
      next ,
      /**
       * Loading overlay
       */
      closeTableLoading ,
      /**
       * Creating
       */
      createModal ,
      showCreateModal ,
      closeCreateModal ,     
      /**
       * Editing
       */
      editModal ,
      showEditModal ,
      closeEditModal , 
      editRecord ,
      /**
       * Functions
       */
      // activateAccount ,
      deleteRecord ,
      /**
       * Start, Pending, Continue, End Task
       */
      startTask,
      pendingTask,
      continueTask,
      endTask
    }
  }
}

</script>

<style scoped>
  .vcb-table-panel {
    @apply absolute right-4 left-4 mt-4 mb-16 top-12 bottom-0 overflow-auto;
  }
  .vcb-table {
    @apply w-full ;
  }
  .vcb-table tr.vcb-table-row {
    @apply border-b border-gray-100 text-left ;
  }
  .vcb-table tr.vcb-table-row td {
    @apply p-2;
  }
  .vcb-table-actions-panel {
    @apply flex flex-row-reverse ;
  }
  .vcb-table-actions-panel .vcb-action-button {
    @apply  rounded-full border border-gray-200 w-8 h-8 mx-2 text-center cursor-pointer hover:border-blue-500 hover:text-blue-500  duration-300;
  }
  .vcb-table-headers {
    @apply border-b border-gray-200;
  }
  .vcb-table-headers .vcb-table-header {
    @apply px-2 py-4 text-left ;
  }
  .vcb-table-pagination {
    @apply flex flex-row absolute bg-white right-0 bottom-0 border border-l p-3 ;
  }
  .vcb-pagination-page {
    @apply  rounded-full border border-gray-200 mx-1 leading-7 w-8 h-8 font-bold cursor-pointer hover:text-blue-500 hover:border-blue-500 duration-300;
  }
</style>