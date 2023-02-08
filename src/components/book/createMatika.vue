<template>
  <div class="pk-form-panel" >
    <div class="flex title-bar border-b border-gray-200">
        <!-- Title of crud -->
        <div class="flex-grow h-10 py-1 title relative" >
          <Icon size="40" class="text-red-600 mr-2 absolute top-2 left-0 " >
            <n-icon>
              <DocumentPdf24Regular />
            </n-icon>
          </Icon>
          <div class="leading-10 font-bold ml-8 text-left" >Title</div>
        </div>
      </div>
    <n-card class="w-1/2 mx-auto font-pvh text-xl" :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
      <template #header-extra>
        <n-button type="success" :disabled="btnSavingLoadingRef" @click="create()" :loading="btnSavingLoadingRef" >
          <template #icon>
            <n-icon>
              <Save20Regular />
            </n-icon>
          </template>
          រក្សារទុក
        </n-button>
      </template>
      <!-- Form edit account -->
      <div class="crud-create-form w-full border-t">
        <div class=" mx-auto p-4 flex-wrap">
          <div class="crud-form-panel w-full flex flex-wrap ">
            <n-form 
              class="w-full text-left font-btb text-lg flex flex-wrap" 
              :label-width="80"
              :model="record"
              :rules="rules"
              size="large"
              ref="formRef"
            >
              <n-form-item label="លេខ" path="number" class="w-4/5 mr-8" >
                <n-input v-model:value="record.number" placeholder="លេខ" />
              </n-form-item>
              <n-form-item label="ចំណងជើង" path="title" class="w-4/5 mr-8" >
                <n-input v-model:value="record.title" placeholder="ចំណងជើង" />
              </n-form-item>
              <n-form-item v-if="kunties" label="គន្ថី" path="kunthy" class="w-4/5 mr-8" >
                <n-select
                  v-model:value="record.kunty_id"
                  filterable
                  placeholder="សូមជ្រើសរើសគន្ថី"
                  :options="kunties"
                  @search="handleSearchKunty"  
                  clearable
                />
              </n-form-item>
            </n-form>
            <div class="w-1/2 h-8"></div>  
          </div>
        </div>
      </div>
      <!-- End form edit account -->
      <template #footer></template>
    </n-card>
  </div>
</template>
<script>
import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useDialog, useMessage, useNotification } from 'naive-ui'

import { Switcher, Filter, CharacterPatterns } from '@vicons/carbon'
import { Icon } from '@vicons/utils'
import { IosCheckmarkCircleOutline, IosRefresh } from '@vicons/ionicons4'
import { TrashOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { Edit20Regular, Key16Regular, Save20Regular, Add20Regular, Search20Regular , ContactCard28Regular, DocumentPdf24Regular } from '@vicons/fluent'

export default {
  components: {
    Save20Regular ,
    DocumentPdf24Regular ,
    Icon
  },
  setup(){
    const model = reactive({
      name: 'matika' ,
      title: 'មាតិកា'
    })
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()
    const route = useRoute()
    const btnSavingLoadingRef = ref(false)

    const book = reactive({
      id: 0 ,
      title : '' ,
      description: ''
    })
    /**
     * Variables for select
     */
    /**
     * Select value
     */
    const record = reactive({
      number: '' ,
      title: '' ,
      meaning: '' ,
      book_id: 0 ,
      kunty_id: 0
    })

    /**
     * Variables
     */    
    const rules = {
        number: {
          required: true,
          message: 'សូមបញ្ចូលលេខ',
          trigger: [ 'blur']
        },
        title: {
          required: true,
          message: 'សូមបញ្ចូលចំណងជើង',
          trigger: [ 'blur']
        }
    }

    function create(){
      if( record.number == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបញ្ចូល លេខមាត្រា' ,
          duration : 3000
        })
        return false
      }
      if( record.title == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបញ្ចូល ចំណងជើងមាត្រា' ,
          duration : 3000
        })
        return false
      }
      if( model === undefined || model.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។' ,
          duration : 3000
        })
        return false
      }

      /**
       * Saving information of the regulator
       */
      notify.info({
        title: 'រក្សារទុកព័ត៌មាន' ,
        description: 'កំពុងរក្សារទុកមាត្រា។' ,
        duration: 3000
      })
      btnSavingLoadingRef.value = true
      store.dispatch( model.name+'/create',{
        // id: record.id ,
        number: record.number.toString().padStart(4,'0') ,
        title: record.title ,
        book_id: book.id ,
        kunty_id: record.kunty_id
      }).then( res => {
        switch( res.status ){
          case 200 : 
          notify.success({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: 'រក្សារទុកព័ត៌មានរបស់ឯកសាររួចរាល់។' ,
            duration: 3000
          })
          break;
        }
        clearVariables()
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
          duration : 3000
        })
      })
    }
    /**
     * Clear any variable from the form
     */
    function clearVariables(){
      record.number = ""
      record.title = ""
      record.kunty_id = kunties.value.length > 0 ? kunties.value[0].value : 0
      btnSavingLoadingRef.value = false
    }
    
    /**
     * Load pivot data of this model
     */
    const kunties = ref([])
    const toggleKunty = computed( () => {
      return kunties.value != undefined && kunties.value.length > 0
    })
    const selectedKunty = ref(null)
    const kuntySelectLoading = ref(false)
    
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
        book_id: book.id
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
          record.kunty_id = kunties.value.length > 0 ? kunties.value[0].value : 0
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

    function getBook(){
      store.dispatch('book/read',{
        id: record.book_id
      }).then( res => {
        if( res.data.ok ){
          book.id = res.data.record.id
          book.title = res.data.record.title
          book.description = res.data.record.description
          getKunties("")
          return false
        }
        notify.warning({
          title: 'អានសៀវភៅ' ,
          description: 'មានបញ្ហាក្នុងពេលអានសៀវភៅ។'
        })
      }).catch( err => {
        notify.error({
            title: 'អានសៀវភៅ' ,
            description: 'មានបញ្ហាក្នុងពេលអានសៀវភៅ។'
          })
        console.log( err )
      })
    }

    record.book_id = route.params.id > 0 ? route.params.id : 0
    /**
     * Get kunty base on book_id
     */
    getBook()

    return {
      /**
       * Variables
       */
      model,
      record,
      rules ,
      btnSavingLoadingRef ,
      kunties,
      /**
       * Computed
       */
      toggleKunty ,
      /**
       * Functions
       */
      create ,
      clearVariables ,
      getKunties ,
      handleSearchKunty ,
    }
  }
}
</script>