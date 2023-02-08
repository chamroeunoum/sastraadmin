<template>
  <div class="pk-form-panel" >
    <div class="flex title-bar border-b border-gray-200">
        <!-- Title of crud -->
        <div class="flex-grow h-10 py-1 title relative" >
          <Icon size="24" class="text-red-600 mr-2 absolute top-2 left-0 " >
            <n-icon>
              <DocumentPdf24Regular />
            </n-icon>
          </Icon>
          <div class="leading-10 font-bold ml-8 text-left" v-html="bookTitle" ></div>
        </div>
      </div>
    <n-card class="w-1/2 mx-auto font-pvh text-xl" :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
      <template #header-extra>
        <n-button @click="$router.go(-1)" class="mr-4">
          បកក្រោយ
        </n-button>
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
      name: 'kunty' ,
      title: 'គន្ថី'
    })
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()
    const route = useRoute()
    const router = useRouter()
    const btnSavingLoadingRef = ref(false)

    /**
     * Variables
     */
    const book = reactive({
      id: 0 ,
      title : '' ,
      description: ''
    })
    /**
     * Select value
     */
    const record = reactive({
      number: '' ,
      title: ''
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
        book_id: book.id
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
      btnSavingLoadingRef.value = false
    }
    
    const bookTitle = computed( () => {
      return book.title != undefined && book.title != "" ? book.title : "សូមជ្រើសរើសសៀវភៅ"
    })

    function getBook(){
      store.dispatch('book/read',{
        id: record.book_id
      }).then( res => {
        if( res.data.ok ){
          book.id = res.data.record.id
          book.title = res.data.record.title
          book.description = res.data.record.description
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
      /**
       * Computed
       */
      bookTitle ,
      /**
       * Functions
       */
      create ,
      clearVariables
    }
  }
}
</script>