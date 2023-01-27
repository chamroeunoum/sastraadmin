<template>
  <div>
  <!-- Top action panel of crud -->
    <div class="flex title-bar border-b border-gray-200">
      <!-- Title of crud -->
      <div class="flex-grow h-10 py-1 title relative" >
        <Icon size="27" class="text-red-600 mr-2 absolute top-2 left-0 " >
          <n-icon>
            <DocumentPdf24Regular />
          </n-icon>
        </Icon>
        <div class="leading-10 font-bold ml-8 text-left" v-html="regulatorTitle" ></div>
      </div>
      <!-- Actions button of the crud -->
      <div class="flex w-96 action-buttons flex-row-reverse">
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
        <div class="w-4/5 relative" >
          <input type="text" @keypress.enter="filterRecords(false)" v-model="table.search" class="bg-gray-100 px-2 h-9 my-1 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 " placeholder="ស្វែងរក" />
          <Icon size="27" class="absolute right-1 top-2 text-gray-400 hover:text-blue-700 cursor-pointer" @click="filterRecords(false)" >
            <n-icon>
              <Search20Regular />
            </n-icon>
          </Icon>
          <Icon size="27" class="absolute -left-10 top-2 text-gray-500 hover:text-blue-700 cursor-pointer" @click="filterPanel=!filterPanel">
            <n-icon>
              <Filter />
            </n-icon>
          </Icon>
        </div>
        
      </div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel relative flex">
      <table class="vcb-table" >
        <tr class="vcb-table-headers" >
          <th class="vcb-table-header" >ល.រ</th>
          <th class="vcb-table-header" >លេខមាត្រា</th>
          <th class="vcb-table-header">ចំណងជើង</th>
          <th class="vcb-table-header">គន្ថី</th>
          <th class="vcb-table-header w-44">មាតិកា</th>
          <th class="vcb-table-header w-44">ជំពូក</th>
          <th class="vcb-table-header w-44">ផ្នែក</th>
          <th class="vcb-table-header w-44">កថាភាគ</th>
          <th class="vcb-table-header text-right w-28" >ប្រតិបត្តិការ</th>
        </tr>
        <tr v-for="(record, index) in table.records.matched" :key='index' class="vcb-table-row" >
          <td class="vcb-table-cell font-bold" >{{ index + 1 }}</td>
          <td class="vcb-table-cell" >{{ record.number }}</td>
          <td class="vcb-table-cell" ><div v-html="applyTagMark(record.title)"></div></td>
          <td  class="vcb-table-cell" >{{ record.kunty != undefined && record.kunty !== null ? record.kunty.title : "" }}</td>
          <td  class="vcb-table-cell" >{{ record.matika != undefined && record.matika !== null ? record.matika.title : "" }}</td>
          <td  class="vcb-table-cell" >{{ record.chapter != undefined && record.chapter !== null ? record.chapter.title : "" }}</td>
          <td  class="vcb-table-cell" >{{ record.part != undefined && record.part !== null ? record.part.title : "" }}</td>
          <td  class="vcb-table-cell" >{{ record.section != undefined && record.section !== null ? record.section.title : "" }}</td>
          <td class="vcb-table-actions-panel text-right" >
            <n-icon size="22" class="cursor-pointer text-blue-500" @click="showEditModal(record)" title="កែប្រែព័ត៌មាន" >
              <Edit20Regular />
            </n-icon>
            <n-icon size="22" class="cursor-pointer text-red-500" @click="destroy(record)" title="លុបគណនីនេះចោល" >
              <TrashOutline />
            </n-icon>
            <n-icon size="22" :class="'cursor-pointer ' + (record.active == 1 ? ' text-green-500 ' : ' text-gray-500 ') " @click="activateRecord(record)" :title="record.active == 1 ? 'គណនីនេះកំពុងបើកតំណើរការ' : 'គណនីនេះកំពុងត្រូវបានបិទមិនអាចប្រើប្រាស់បាន' " >
              <IosCheckmarkCircleOutline />
            </n-icon>
            <!-- <n-icon size="30" :class="'cursor-pointer ' + (record.pdf == 1 ? ' text-green-500 ' : ' text-gray-500 ') " @click="activateRecord(record)" :title="record.active == 1 ? 'គណនីនេះកំពុងបើកតំណើរការ' : 'គណនីនេះកំពុងត្រូវបានបិទមិនអាចប្រើប្រាស់បាន' " >
              <DocumentPdf24Regular />
            </n-icon> -->
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
      <div class="vcb-pagination-page" v-html='"|<"' @click="first()" ></div>
      <!-- Previous -->
      <div class="vcb-pagination-page" v-html='"<"' @click="previous()" ></div>
      <!-- Pages (7) -->
      <div v-for="(page, index) in table.pagination.buttons" :key="index" class="vcb-pagination-page pages h-8 mx-2 font-bold" @click="table.pagination.page == page ? false : goTo(page) " >
        <div :class="'page w-8 h-8 text-center align-middle leading-8 cursor-pointer' + (table.pagination.page == page ? ' text-blue-500' : '' ) ">{{ page }}</div>
      </div>
      <!-- Next -->
      <div class="vcb-pagination-page" v-html='">"' @click="next()" ></div>
      <!-- Last -->
      <div class="vcb-pagination-page" v-html='">|"' @click="last()" ></div>
      <!-- Go to -->
      <!-- Total per page -->
    </div>
    <!-- Filter panel of crud -->
    <div v-if="filterPanel" class="vcb-filter-panel">
      <div class="filter-container relative w-full px-4 pb-16 pt-12 ">
        <div class="filter-layer w-full flex flex-row mb-4">
          <!-- Regulator filter -->
          <n-select
            v-model:value="selectedRegulator"
            @update:value="regulatorChange"
            :loading="bookSelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchRegulator"  
            filterable
            placeholder="សូមជ្រើសរើសលិខិតបទដ្ឋានគតិយុត្ត"
            :options="books"
            class="basis-1/3 px-2" 
          />
          <!-- End regulator filter -->
          <!-- Kunty filter -->
          <n-select
            v-if="toggleKunty"
            v-model:value="selectedKunty"
            @update:value="kuntyChange"
            :loading="kuntySelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchKunty"  
            filterable
            placeholder="សូមជ្រើសរើសគន្ថី"
            :options="kunties"
            class="basis-1/3 px-2" 
          />
          <!-- End kunty filter -->
          <!-- Matika filter -->
          <n-select
            v-if="toggleMatika"
            v-model:value="selectedMatika"
            @update:value="matikaChange"
            :loading="matikaSelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchMatika"  
            filterable
            placeholder="សូមជ្រើសរើសមាតិកា"
            :options="matikas"
            class="basis-1/3 px-2" 
          />
          <!-- End matika filter -->
        </div>
        <div class="filter-layer w-full flex flex-row">
          <!-- Chapter filter -->
          <n-select
            v-if="toggleChapter"
            v-model:value="selectedChapter"
            @update:value="chapterChange"
            :loading="chapterSelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchChapter"  
            filterable
            placeholder="សូមជ្រើសរើសជំពូក"
            :options="chapters"
            class="basis-1/3 px-2" 
          />
          <!-- End chapter filter -->
          <!-- Part filter -->
          <n-select
            v-if="togglePart"
            v-model:value="selectedPart"
            @update:value="partChange"
            :loading="partSelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchPart"  
            filterable
            placeholder="សូមជ្រើសរើសផ្នែក"
            :options="parts"
            class="basis-1/3 px-2" 
          />
          <!-- End part filter -->
          <!-- Section filter -->
          <n-select
            v-if="toggleSection"
            v-model:value="selectedSection"
            :loading="sectionSelectLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @search="handleSearchSection"  
            filterable
            placeholder="សូមជ្រើសរើសកថាភាគ"
            :options="sections"
            class="basis-1/3 px-2" 
          />
          <!-- End section filter -->
        </div>
        <Icon size="40" class="absolute right-0 top-0 cursor-pointer text-red-700" @click="filterPanel=!filterPanel" >
          <CloseCircleOutline />
        </Icon>
      </div>
    </div>
    <!-- Form create account -->
    <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal"/>
    <!-- Form update account -->
    <update-form v-bind:model="model" v-bind:record="editRecord" v-bind:show="editModal.show" :onClose="closeEditModal"/>
  </div>
</template>
<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { Switcher, Filter, CharacterPatterns } from '@vicons/carbon'
import { Icon } from '@vicons/utils'
import { IosCheckmarkCircleOutline, IosRefresh } from '@vicons/ionicons4'
import { TrashOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { Edit20Regular, Key16Regular, Save20Regular, Add20Regular, Search20Regular , ContactCard28Regular, DocumentPdf24Regular } from '@vicons/fluent'
/**
 * CRUD component form
 */
import CreateForm from './create.vue'
import UpdateForm from './update.vue'
export default {
  name: "Matra" ,
  components: {
    QrcodeVue ,
    Vue3Barcode,
    Switcher,
    Add20Regular ,
    Icon,
    IosCheckmarkCircleOutline,
    CreateForm,
    IosRefresh ,
    CloseCircleOutline ,
    UpdateForm,
    Search20Regular ,
    Edit20Regular,
    Key16Regular,
    DocumentPdf24Regular ,
    Save20Regular ,
    TrashOutline ,
    ContactCard28Regular ,
    Filter
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    const route = useRoute()
    /**
     * Variables
     */    
    const model = reactive( {
      name: "matra" ,
      title: "មាត្រា នៃ លិខិតបទដ្ឋានគតិយុត្ត"
    })
    const table = reactive( {
      loading: false , 
      search: '' ,
      records: {
        all: [] ,
        matched: []
      },
      columns: {
        searchable: {
          number: '' ,
          title: '' ,
          meaning: ''
        },
        format: {
          id: 0 ,
          number: '' ,
          title: '' ,
          meaning: '' ,
          kunthy: '' ,
          chapter: '' ,
          part: '' ,
          section: ''
        }
      } ,
      pagination: {
        perPage: 20 ,
        page: 1 ,
        totalPages: 0 ,
        totalRecords: 0 ,
        start: 0 ,
        end: 0 ,
        buttons: []
      }
    })
    const filterPanel = ref(false)

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
      store.dispatch('regulator/matras',{
        regulator_id: route.params.id > 0 ? route.params.id : '' ,
        kunty_id: selectedKunty.value !== null ? selectedKunty.value : '' ,
        matika_id: selectedMatika.value !== null ? selectedMatika.value : '' ,
        chapter_id: selectedChapter.value !== null ? selectedChapter.value : '' ,
        part_id: selectedPart.value !== null ? selectedPart.value : '' ,
        section_id: selectedSection.value !== null ? selectedSection.value : '' ,
        search: table.search ,
        perPage: table.pagination.perPage ,
        page: table.pagination.page
      }).then(res => {
        store.commit('matra/setRecords', res.data.records )
        table.records.all = table.records.matched = res.data.records
        table.pagination = res.data.pagination
        var paginationNumberList = 5
        if( ( table.pagination.page - ( paginationNumberList - 1 ) ) < 1 ){
          table.pagination.start = 1
          table.pagination.end = table.pagination.totalPages > 9 ? 9 : table.pagination.totalPages
        }
        else{
          table.pagination.start = table.pagination.page  - ( paginationNumberList - 1 )
          table.pagination.end = table.pagination.page + 4 >= table.pagination.totalPages ? table.pagination.totalPages : table.pagination.page + 4
        }
        /**
         * Create pagination buttons
         */
        table.pagination.buttons = []
        for(var i=table.pagination.start;i<=table.pagination.end;i++){
          table.pagination.buttons.push(i)
        }
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
    function first(){
      goTo( table.pagination.page > 0 ? 1 : 0)
    }
    function last(){
      goTo( table.pagination.totalPages > 0 ? table.pagination.totalPages : 1 )
    }
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
    const paginationButtons = computed(()=>{
      /**
       * 9 Buttons is recommended
       */
      return table.pagination.totalPages ? table.pagination.totalPages : 0
    })

    function activateRecord(record){
      dialog.warning({
        title: "បិទ ឬ បើក ឯកសារ" ,
        content: "តើអ្នកចង់ " + ( record.active == 1 ? "បិទ" : "បើក" )+ " មាត្រានេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch( model.name+(parseInt(record.active)==1?'/deactivate':'/activate'),{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'ស្ថានភាពមាត្រា' ,
                description: 'ស្ថានភាពមាត្រាបានកែប្រែជោគជ័យ។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.error({
                title: 'ស្ថានភាពគណនី' ,
                description: 'មានបញ្ហាក្នុងពេលកែប្រែស្ថានភាពមាត្រា។' ,
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
    const editRecord = reactive({
      id: 0 ,
      number : 0 ,
      meaning: '' ,
      regulator_id: 0 ,
      kunty_id : 0 ,
      matika_id : 0 ,
      chapter_id : 0 ,
      part_id : 0 ,
      section_id : 0
    })
    function showEditModal(record){
      editRecord.id = record.id 
      editRecord.number = record.number 
      editRecord.title = record.title 
      editRecord.meaning = record.meaning 
      editRecord.regulator_id = record.regulator_id 
      editRecord.kunty_id = record.kunty_id 
      editRecord.matika_id = record.matika_id 
      editRecord.chapter_id = record.chapter_id 
      editRecord.part_id = record.part_id 
      editRecord.section_id = record.section_id 
      editRecord['regulator'] = record.regulator
      editRecord['kunty'] = record.kunty
      editRecord['matika'] = record.matika
      editRecord['chapter'] = record.chapter
      editRecord['part'] = record.part
      editRecord['section'] = record.section

      editModal.show = true
    }
    function closeEditModal(record){
      editModal.show = false
      getRecords()
    }
    function inputPassword(record){
      changePasswordModal.account = record
      changePasswordModal.form = {
        id: record.id ,
        password: record.password
      }
      changePasswordModal.show = true
    }

    function destroy(record){
      dialog.warning({
        title: "លុបមាត្រា" ,
        content: "តើអ្នកចង់ លុប មាត្រានេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបមាត្រា' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.success({
                title: 'លុបមាត្រា' ,
                description: 'មានបញ្ហាក្នុងពេលលុបមាត្រា។' ,
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

    /**
     * Load pivot data of this model
     */
    const books = ref([])
    const selectedRegulator = ref(null)
    const bookSelectLoading = ref(false)
    const regulatorTimeoutHelper = ref(null)
    
    function regulatorChange(val){
      kunties.value = []
      selectedKunty.value = null
      matikas.value = []
      selectedMatika.value = null
      chapters.value = [] 
      selectedChapter.value = null
      parts.value = [] 
      selectedPart.value = null
      sections.value = [] 
      selectedSection.value = null
      getRecords()
      if( !(val > 0) ) return ;
      store.dispatch('regulator/kunty',{id : val }).then( res =>{
        /**
         * Apply the kunty, matika to the dropdownlist
         */
        if( res.data.ok ){
          if( Array.isArray( res.data.record.kunties ) && res.data.record.kunties.length > 0 ){
            kunties.value = res.data.record.kunties.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }else{
            store.dispatch('regulator/matika',{id:val}).then(res => {
              if( Array.isArray( res.data.record.matikas ) && res.data.record.matikas.length > 0 ){
                matikas.value = res.data.record.matikas.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
              }
            }).catch( err => {
              console.log( err )
              notify.error({
                title: "អានមាតិកានៃគន្ថី" ,
                description: "មានបញ្ហាពេលអានមាតិកានៃគន្ថី" ,
                duration: 3000
              })
            })
          }
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          title: "អានគន្ថី" ,
          description: "មានបញ្ហាពេលអានគន្ថី" ,
          duration: 3000
        })
      })

      /** Code of getting full sttucture of regulator */
      // if( res.data.structure !== null && Array.isArray( res.data.structure ) && res.data.structure.length ){
      //       /**
      //        * Get kunty
      //        */
      //       if( res.data.structure[0].type == 'kunty' ){
      //         kunties.value = res.data.structure.map( kunty => { 
      //           /**
      //            * Get matika
      //            */
      //           // if( Array.isArray( kunty.children ) && kunty.children.length ){
      //           //   matikas.value = kunty.children.map( matika => {
      //           //     /**
      //           //      * Get chapter
      //           //      */
      //           //     if( Array.isArray( matika.children ) && matika.children.length ){
      //           //       chapters.value = matika.children.map( chapter => {
      //           //         /**
      //           //          * Get part
      //           //          */
      //           //         if( Array.isArray( chapter.children ) && chapter.children.length ){
      //           //           parts.value = chapter.children.map( part => {
      //           //             /**
      //           //              * Get section
      //           //              */
      //           //             if( Array.isArray( part.children ) && part.children.length ){
      //           //               sections.value = part.children.map( section => {
      //           //                 return { label: section.title , value: section.id }     
      //           //               })
      //           //             }
      //           //             return { label: part.title , value: part.id }     
      //           //           })
      //           //         }
      //           //         return { label: chapter.title , value: chapter.id }     
      //           //       })
      //           //     }
      //           //     return { label: matika.title , value: matika.id }     
      //           //   })
      //           // }
      //           return { label: kunty.title , value: kunty.id } 
      //         })
      //         console.log( kunties.value != undefined && kunties.value.length > 0 )
      //       }else if( res.data.structure[0].type == 'matika' ){
      //         kunties.value = []
      //         /**
      //          * Get matika
      //          */
      //         if( Array.isArray( kunty.children ) && kunty.children.length ){
      //           matikas.value = kunty.children.map( matika => {
      //             // /**
      //             //  * Get chapter
      //             //  */
      //             // if( Array.isArray( matika.children ) && matika.children.length ){
      //             //   chapters.value = matika.children.map( chapter => {
      //             //     /**
      //             //      * Get part
      //             //      */
      //             //     if( Array.isArray( chapter.children ) && chapter.children.length ){
      //             //       parts.value = chapter.children.map( part => {
      //             //         /**
      //             //          * Get section
      //             //          */
      //             //         if( Array.isArray( part.children ) && part.children.length ){
      //             //           sections.value = part.children.map( section => {
      //             //             return { label: section.title , value: section.id }     
      //             //           })
      //             //         }
      //             //         return { label: part.title , value: part.id }     
      //             //       })
      //             //     }
      //             //     return { label: chapter.title , value: chapter.id }     
      //             //   })
      //             // }
      //             return { label: matika.title , value: matika.id }     
      //           })
      //         }
      //       }
      //     }

    }

    function handleSearchRegulator(query){
      clearTimeout( regulatorTimeoutHelper.value )
      regulatorTimeoutHelper.value = setTimeout( () => {
        if (!query.length) {
          books.value = [];
          return;
        }
        getRegulators(query)
      }, 1000 )
    }

    function getRegulators(query){
      books.value = []
      bookSelectLoading.value = true 
      store.dispatch('regulator/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query
      }).then(res=>{
        if(res.data.ok){
          store.commit('regulator/setRecords',res.data.records)
          books.value = res.data.records.map( 
            record => { 
              return {
                label: record.objective , 
                value: record.id
              } 
            } 
          )
          selectedRegulator.value = []
        }else{
          notify.error({
            title: 'អានលិខិតបទដ្ឋានគតិយុត្ត' ,
            description: 'មានបញ្ហាក្នុងពេលអានលិខិតបទដ្ឋានគតិយុត្ត។'
          })
        }
      }).catch(err =>{
        notify.error({
          title: 'អានលិខិតបទដ្ឋានគតិយុត្ត' ,
          description: 'មានបញ្ហាក្នុងពេលអានលិខិតបទដ្ឋានគតិយុត្ត។'
        })
        console.log( err )
      })
      bookSelectLoading.value = false
    }

    function getRegulator(){
      if( route.params.id != undefined && route.params.id > 0 ){
        store.dispatch('regulator/read',{
          id: route.params.id
        }).then(res=>{
          if(res.data.ok){
            store.commit('regulator/setRecord',res.data.record)
          }else{
            notify.error({
              title: 'អានលិខិតបទដ្ឋានគតិយុត្ត' ,
              description: 'មានបញ្ហាក្នុងពេលអានលិខិតបទដ្ឋានគតិយុត្ត។'
            })
          }
        }).catch(err =>{
          notify.error({
            title: 'អានលិខិតបទដ្ឋានគតិយុត្ត' ,
            description: 'មានបញ្ហាក្នុងពេលអានលិខិតបទដ្ឋានគតិយុត្ត។'
          })
          console.log( err )
        })
      }
    }
    
    const regulatorTitle = computed( () => {
      console.log( store.getters['regulator/getRecord'] )
      return store.getters['regulator/getRecord'] !== null && store.getters['regulator/getRecord'] !== undefined && store.getters['regulator/getRecord'].id > 0 ? store.getters['regulator/getRecord'].title : ''
    })

    /**
     * Load pivot data of this model
     */
    const kunties = ref([])
    const toggleKunty = computed( () => {
      return kunties.value != undefined && kunties.value.length > 0
    })
    const selectedKunty = ref(null)
    const kuntySelectLoading = ref(false)
    
    function kuntyChange(val){
      matikas.value = []
      selectedMatika.value = null
      chapters.value = [] 
      selectedChapter.value = null
      parts.value = [] 
      selectedPart.value = null
      sections.value = [] 
      selectedSection.value = null
      getRecords()
      if( !(val > 0) ) return ;
      store.dispatch('kunty/matika',{id : val }).then( res =>{
        /**
         * Apply the kunty, matika to the dropdownlist
         */
        if( res.data.ok ){
          if( Array.isArray( res.data.record.matikas ) && res.data.record.matikas.length > 0 ){
            matikas.value = res.data.record.matikas.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }else{
            store.dispatch('kunty/chapter',{id:val}).then(res => {
              if( Array.isArray( res.data.record.chapters ) && res.data.record.chapters.length > 0 ){
                chapters.value = res.data.record.chapters.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
              }
            }).catch( err => {
              console.log( err )
              notify.error({
                title: "អានជំពូកនៃមាតិកា" ,
                description: "មានបញ្ហាពេលអានជំពូកនៃមាតិកា" ,
                duration: 3000
              })
            })
          }
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          title: "អានមាតិកា" ,
          description: "មានបញ្ហាពេលអានមាតិកា" ,
          duration: 3000
        })
      })
    }

    function handleSearchKunty(query){
      if (!query.length) {
        kunties.value = [];
        return;
      }
      getKunties(query)
    }

    function getKunties(query){
      kunties.value = []
      kuntySelectLoading.value = true 
      store.dispatch('kunty/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query ,
        regulator_id: selectedRegulator.value
      }).then(res=>{
        if(res.data.ok){
          store.commit('kunty/setRecords',res.data.records)
          kunties.value = res.data.records.map( 
            record => { 
              return {
                label: record.title , 
                value: record.id
              } 
            } 
          )
          selectedKunty.value = []
        }else{
          notify.error({
            title: 'អានគន្ថី' ,
            description: 'មានបញ្ហាក្នុងពេលអានគន្ថី។'
          })
        }
      }).catch(err =>{
        notify.error({
          title: 'អានគន្ថី' ,
          description: 'មានបញ្ហាក្នុងពេលអានគន្ថី។'
        })
        console.log( err )
      })
      kuntySelectLoading.value = false
    }

    /**
     * Load pivot data of this model
     */
    const matikas = ref([])
    const toggleMatika = computed( () => {
      return matikas.value != undefined && matikas.value.length > 0
    })
    const selectedMatika = ref(null)
    const matikaSelectLoading = ref(false)

    function matikaChange(val){
      chapters.value = [] 
      selectedChapter.value = null
      parts.value = [] 
      selectedPart.value = null
      sections.value = [] 
      selectedSection.value = null
      getRecords()
      if( !(val > 0) ) return ;
      store.dispatch('matika/chapter',{id : val }).then( res =>{
        /**
         * Apply the kunty, matika to the dropdownlist
         */
        if( res.data.ok ){
          if( Array.isArray( res.data.record.chapters ) && res.data.record.chapters.length > 0 ){
            chapters.value = res.data.record.chapters.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          title: "អានជំពូក" ,
          description: "មានបញ្ហាពេលអានជំពូក" ,
          duration: 3000
        })
      })
    }
    
    function handleSearchMatika(query){
      if (!query.length) {
        matikas.value = [];
        return;
      }
      getMatikas(query)
    }

    function getMatikas(query){
      matikas.value = []
      matikaSelectLoading.value = true 
      store.dispatch('matika/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query ,
        regulator_id: selectedRegulator.value ,
        kunty_id: selectedKunty.value
      }).then(res=>{
        if(res.data.ok){
          store.commit('matika/setRecords',res.data.records)
          matikas.value = res.data.records.map( 
            record => { 
              return {
                label: record.title , 
                value: record.id
              } 
            } 
          )
          selectedMatika.value = []
        }else{
          notify.error({
            title: 'អានមាតិកា' ,
            description: 'មានបញ្ហាក្នុងពេលអានមាតិកា។'
          })
        }
      }).catch(err =>{
        notify.error({
            title: 'អានមាតិកា' ,
            description: 'មានបញ្ហាក្នុងពេលអានមាតិកា។'
          })
        console.log( err )
      })
      matikaSelectLoading.value = false
    }

    /**
     * Load pivot data of this model
     */
    const chapters = ref([])
    const toggleChapter = computed( () => {
      return chapters.value != undefined && chapters.value.length > 0
    })
    const selectedChapter = ref(null)
    const chapterSelectLoading = ref(false)

    function chapterChange(val){
      parts.value = [] 
      selectedPart.value = null
      sections.value = [] 
      selectedSection.value = null
      getRecords()
      if( !(val > 0) ) return ;
      store.dispatch('chapter/part',{id : val }).then( res =>{
        /**
         * Apply the kunty, matika to the dropdownlist
         */
        if( res.data.ok ){
          if( Array.isArray( res.data.record.parts ) && res.data.record.parts.length > 0 ){
            parts.value = res.data.record.parts.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          title: "អានផ្នែក" ,
          description: "មានបញ្ហាពេលអានផ្នែក" ,
          duration: 3000
        })
      })
    }
    
    function handleSearchChapter(query){
      if (!query.length) {
        chapters.value = [];
        return;
      }
    }

    function getChapters(query){
      chapters.value = []
      chapterSelectLoading.value = true 
      store.dispatch('chapter/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query ,
        regulator_id: selectedRegulator.value ,
        kunty_id: selectedKunty.value ,
        matika_id: selectedMatika.value
      }).then(res=>{
        if(res.data.ok){
          store.commit('chapter/setRecords',res.data.records)
          chapters.value = res.data.records.map( 
            record => { 
              return {
                label: record.title , 
                value: record.id
              } 
            } 
          )
          selectedChapter.value = []
        }else{
          notify.error({
            title: 'អានជំពូក' ,
            description: 'មានបញ្ហាក្នុងពេលអានជំពូក។'
          })
        }
      }).catch(err =>{
        notify.error({
            title: 'អានជំពូក' ,
            description: 'មានបញ្ហាក្នុងពេលអានជំពូក។'
          })
        console.log( err )
      })
      chapterSelectLoading.value = false
    }

    /**
     * Load pivot data of this model
     */
    const parts = ref([])
    const selectedPart = ref(null)
    const togglePart = computed( () => {
      return parts.value != undefined && parts.value.length > 0
    })
    const partSelectLoading = ref(false)
    
    function partChange(val){
      sections.value = [] 
      selectedSection.value = null
      getRecords()
      if( !(val > 0) ) return ;
      store.dispatch('part/section',{id : val }).then( res =>{
        /**
         * Apply the kunty, matika to the dropdownlist
         */
        if( res.data.ok ){
          if( Array.isArray( res.data.record.sections ) && res.data.record.sections.length > 0 ){
            sections.value = res.data.record.sections.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          title: "អានកថាភាគ" ,
          description: "មានបញ្ហាពេលអានកថាភាគ។" ,
          duration: 3000
        })
      })
    }

    function handleSearchPart(query){
      if (!query.length) {
        parts.value = [];
        return;
      }
      getParts(query)
    }

    function getParts(query){
      parts.value = []
      partSelectLoading.value = true 
      store.dispatch('part/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query ,
        regulator_id: selectedRegulator.value ,
        kunty_id: selectedKunty.value ,
        matika_id: selectedMatika.value ,
        chapter_id: selectedChapter.value
      }).then(res=>{
        if(res.data.ok){
          store.commit('part/setRecords',res.data.records)
          parts.value = res.data.records.map( 
            record => { 
              return {
                label: record.title , 
                value: record.id
              } 
            } 
          )
          selectedPart.value = []
        }else{
          notify.error({
            title: 'អានផ្នែក' ,
            description: 'មានបញ្ហាក្នុងពេលអានផ្នែក។'
          })
        }
      }).catch(err =>{
        notify.error({
            title: 'អានផ្នែក' ,
            description: 'មានបញ្ហាក្នុងពេលអានផ្នែក។'
          })
        console.log( err )
      })
      partSelectLoading.value = false
    }

    /**
     * Load pivot data of this model
     */
    const sections = ref([])
    const selectedSection = ref(null)
    const toggleSection = computed( () => {
      return sections.value != undefined && sections.value.length > 0
    })
    const sectionSelectLoading = ref(false)
    
    function handleSearchSection(query){
      if (!query.length) {
        sections.value = [];
        return;
      }
      getSections(query)
    }

    function getSections(query){
      sections.value = []
      sectionSelectLoading.value = true 
      store.dispatch('section/compact',{
        page: 1 ,
        perPage : 100 ,
        search : query ,
        regulator_id: selectedRegulator.value ,
        kunty_id: selectedKunty.value ,
        matika_id: selectedMatika.value ,
        chapter_id: selectedChapter.value ,
        part_id: selectedPart.value
      }).then(res=>{
        if(res.data.ok){
          store.commit('section/setRecords',res.data.records)
          sections.value = res.data.records.map( 
            record => { 
              return {
                label: record.title , 
                value: record.id
              } 
            } 
          )
          selectedSection.value = []
        }else{
          notify.error({
            title: 'អានកថាភាគ' ,
            description: 'មានបញ្ហាក្នុងពេលអានកថាភាគ។'
          })
        }
      }).catch(err =>{
        notify.error({
            title: 'អានកថាភាគ' ,
            description: 'មានបញ្ហាក្នុងពេលអានកថាភាគ។'
          })
        console.log( err )
      })
      sectionSelectLoading.value = false
    }

    /**
     * Mark the matched text with in search box
     */
     function applyTagMark(str){
      // Split the string by whitespace
      if( table.search.trim() != "" ){
        var arrStrSearch = table.search.split(/(\s+)/).filter( e => e.trim().length > 0).map( e => e.replaceAll(" ","") )
        for( var i in arrStrSearch ){
          if( str.includes( arrStrSearch[i] ) ) str = str.replaceAll( arrStrSearch[i] , '<mark>' + arrStrSearch[i] + '</mark>' ) 
        }
      }
      return str
    }

    /**
     * Initial the data
     */
    getRecords()
    getRegulator()


    return {
      /**
       * Variables
       */
      model ,
      table ,
      filterPanel ,
      regulatorTitle ,
      /**
       * Regulator, Kunty, Matika, Chapter, Part, Section filter
       */
      books ,
      selectedRegulator ,
      bookSelectLoading ,
      regulatorChange ,

      kunties ,
      toggleKunty ,
      selectedKunty ,
      kuntySelectLoading ,
      kuntyChange ,

      matikas ,
      toggleMatika ,
      selectedMatika ,
      matikaSelectLoading ,
      matikaChange ,

      chapters ,
      toggleChapter ,
      selectedChapter ,
      chapterSelectLoading ,
      chapterChange ,

      parts ,
      togglePart ,
      selectedPart ,
      partSelectLoading ,
      partChange ,

      sections ,
      toggleSection ,
      selectedSection ,
      sectionSelectLoading ,
      /**
       * Table
       */
      filterRecords ,
      getRegulators ,
      handleSearchRegulator ,
      
      getKunties ,
      handleSearchKunty ,

      getMatikas ,
      handleSearchMatika ,

      getChapters ,
      handleSearchChapter ,

      getParts ,
      handleSearchPart ,

      getSections ,
      handleSearchSection ,
      /**
       * Pagination functions
       */
      updatePerpage ,
      goTo ,
      previous ,
      next ,
      first ,
      last ,
      paginationButtons ,
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
      activateRecord ,
      destroy ,
      applyTagMark
    }
  }
}

</script>

<style scoped>
  .vcb-table-panel {
    @apply absolute right-4 left-4 mt-4 mb-16 top-12 bottom-auto overflow-auto;
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
  .vcb-filter-panel {
    @apply flex flex-row fixed bg-white right-0 bottom-0 left-0 border border-l p-3 ;
  }
  .vcb-table-cell {
    @apply leading-6 align-text-top;
  }
</style>