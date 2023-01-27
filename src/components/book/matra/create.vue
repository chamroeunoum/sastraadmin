<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-model:show="show" :on-after-leave="onClose" :on-after-enter="clearVariables" transform-origin="center">
        <n-card class="w-1/2 font-pvh text-xl" :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
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
                  <n-form-item label="អត្ថន័យ" path="meaning" class="w-4/5 mr-8" >
                    <n-input type="textarea" v-model:value="record.meaning" placeholder="អត្ថន័យ" />
                  </n-form-item>
                  <n-form-item v-if="kunties" label="គន្ថី" path="kunthy" class="w-4/5 mr-8" >
                    <n-select
                      v-model:value="kunty"
                      filterable
                      placeholder="សូមជ្រើសរើសគន្ថី"
                      :options="kunties"
                      @update:value="readMatikas"
                      clearable
                    />
                  </n-form-item>
                  <n-form-item v-if="matikas.length" label="មាតិកា" path="matika" class="w-4/5 mr-8" >
                    <n-select
                      v-model:value="matika"
                      filterable
                      placeholder="សូមជ្រើសរើសមាតិកា"
                      :options="matikas"
                      @update:value="readChapters"
                      clearable
                    />
                  </n-form-item>
                  <n-form-item v-if="chapters.length" label="ជំពូក" path="chapter" class="w-4/5 mr-8" >
                    <n-select
                      v-model:value="chapter"
                      filterable
                      placeholder="សូមជ្រើសរើសជំពូក"
                      :options="chapters"
                      @update:value="readParts"
                    />
                  </n-form-item>
                  <n-form-item v-if="parts.length" label="ផ្នែក" path="part" class="w-4/5 mr-8" >
                    <n-select
                      v-model:value="part"
                      filterable
                      placeholder="សូមជ្រើសរើសផ្នែក"
                      :options="parts"
                      @update:value="readSections"
                    />
                  </n-form-item>
                  <n-form-item v-if="sections.length" label="កថាភាគ" path="section" class="w-4/5 mr-8" >
                    <n-select
                      v-model:value="section"
                      filterable
                      placeholder="សូមជ្រើសរើសកថាភាគ"
                      :options="sections"
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
      </n-modal>
    </div>
    <!-- End of edit account -->
</template>
<script>
import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import { Save20Regular } from '@vicons/fluent'
import { DocumentPdf24Regular } from '@vicons/fluent'

export default {
  components: {
    Save20Regular ,
    DocumentPdf24Regular
  },
  props: {
    model: {
      type: Object ,
      required: true ,
      default: () => {
        return reactive({
          name: 'Undefined' ,
          title: 'No title'
        })
      },
      // validator: (val) => {}
    } , 
    record: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          number: '' ,
          title: '' ,
          meaning: '' ,
          active: 1 ,
          regulator_id: 0 ,
          kunty_id: 0 ,
          matika_id: 0 ,
          chapter_id: 0 ,
          part_id: 0 ,
          section_id: 0
        })
      },
      // validator: (val) => {
      //   for(var field in ['id','username','firstname','lastname','email','phone','password','active'] ){
      //     if( !val.hasOwnProperty(field) ) return false
      //   }
      //   return true 
      // }
    },
    show: {
      type: Boolean ,
      default: false
    },
    onClose: {
      type: Function
    } ,
    // onShow: {
    //   type: Function
    // }
  },
  setup(props){
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()
    const route = useRoute()
    const btnSavingLoadingRef = ref(false)

    /**
     * Variables for select
     */
    /**
     * Select value
     */
    const kunty = ref(null)
    const matika = ref(null)
    const chapter = ref(null)
    const part = ref(null)
    const section = ref(null)
    /**
     * Select options
     */
    const kunties = ref([])
    const matikas = ref([]) 
    const chapters = ref([])
    const parts = ref([])
    const sections = ref([])

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
        },
        meaning: {
          required: true,
          message: 'សូមបញ្ចូលអត្ថន័យ',
          trigger: [ 'blur']
        }
    }
    
    /**
     * Some of the regulator which is the type of law does not has kunty but matika
     * So, we need to check this first before preccedding
     */
    
    function readKunty(regulatorId) {
      if( regulatorId == null || regulatorId <= 0 ) return false
      store.dispatch('regulator/kunty',{
        id: regulatorId
      }).then( res => {
        if( res.data.ok === true ){
          kunties.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
        }else{
          notify.error({
            title: "គន្ថី" ,
            description: "មានបញ្ហាក្នុងការអានគន្ថី។" ,
            duration: 3000
          })
        }
      })  
    }
    
    function readMatikas(kuntyId) {
      if( kuntyId == null || kuntyId <= 0 ) return false
      store.dispatch('regulator/matikasByKunty',{
        id: kuntyId
      }).then( res => {
        if( res.data.ok == true ){
          if( res.data.records.length > 0 ){
            matikas.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
          }else{
            // Kunty might does not have any matika, try to read chapters
            readChaptersByKunty(kuntyId)
          }
        }else{
          notify.error({
            title: "មាតិកា" ,
            description: "មានបញ្ហាក្នុងការអានមាតិកា។" ,
            duration: 3000
          })
        }
      })
    }

    function readChaptersByKunty(kuntyId){
      if( kuntyId == null || kuntyId <= 0 ) return false
      store.dispatch('regulator/chaptersByKunty',{
        id: kuntyId
      }).then( res => {
        if( res.data.ok == true ){
          chapters.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
        }else{
          notify.error({
            title: "ជំពូក" ,
            description: "មានបញ្ហាក្នុងការអានជំពូក។" ,
            duration: 3000
          })
        }
      })
    }

    function readChaptersByMatika(matikaId){
      if( matikaId == null || matikaId <= 0 ) return false
      store.dispatch('regulator/chaptersByMatika',{
        id: matikaId
      }).then( res => {
        if( res.data.ok == true ){
          chapters.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
        }else{
          notify.error({
            title: "ជំពូក" ,
            description: "មានបញ្ហាក្នុងការអានជំពូក។" ,
            duration: 3000
          })
        }
      })
    }

    function readParts(chapterId){
      if( chapterId == null || chapterId <= 0 ) return false
      store.dispatch('regulator/partsByChapter',{
        id: chapterId
      }).then( res => {
        if( res.data.ok == true ){
          parts.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
        }else{
          notify.error({
            title: "ផ្នែក" ,
            description: "មានបញ្ហាក្នុងការអានផ្នែក។" ,
            duration: 3000
          })
        }
      })
    }
    
    function readSections(partId){
      if( partId == null || partId <= 0 ) return false
      store.dispatch('regulator/sectionsByPart',{
        id: partId
      }).then( res => {
        if( res.data.ok == true ){
          sections.value = res.data.records.map( record => { return { label: record.number + "៖ " + record.title , value: record.id } } )
        }else{
          notify.error({
            title: "គន្ថី" ,
            description: "មានបញ្ហាក្នុងការអានគន្ថី។" ,
            duration: 3000
          })
        }
      })

    }

    function create(){
      if( props.record.number == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបញ្ចូល លេខមាត្រា' ,
          duration : 3000
        })
        return false
      }
      if( props.record.title == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបញ្ចូល ចំណងជើងមាត្រា' ,
          duration : 3000
        })
        return false
      }
      if( props.record.meaning == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបញ្ចូល អត្ថន័យមាត្រា' ,
          duration : 3000
        })
        return false
      }
      if( props.model === undefined || props.model.name == "" ){
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
      store.dispatch( props.model.name+'/create',{
        // id: props.record.id ,
        number: props.record.number.toString().padStart(4,'0') ,
        title: props.record.title ,
        meaning: props.record.meaning ,
        active: 1 ,
        regulator_id: route.params.id ,
        kunty_id: props.record.kunty_id ,
        matika_id: props.record.matika_id ,
        chapter_id: props.record.chapter_id ,
        part_id: props.record.part_id ,
        section_id: props.record.section_id
      }).then( res => {
        switch( res.status ){
          case 200 : 
          notify.success({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: 'រក្សារទុកព័ត៌មានរបស់ឯកសាររួចរាល់។' ,
            duration: 3000
          })
          props.record.id = res.data.record.id
          break;
        }
        clearVariables()
        props.onClose()
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
      matikas.value = []
      chapters.value = []
      parts.value = []
      sections.value = []
      kunty.value = null
      matika.value = null
      chapter.value = null
      part.value = null
      section.value = null
      btnSavingLoadingRef.value = false
    }
    // Read kunty
    readKunty(route.params.id)

    return {
      /**
       * Variables
       */
      rules ,
      kunties ,
      matikas ,
      chapters ,
      parts ,
      sections ,
      btnSavingLoadingRef ,
      kunty ,
      matika ,
      chapter ,
      part ,
      section ,
      /**
       * Functions
       */
      create ,
      readKunty ,
      readMatikas ,
      readChaptersByMatika ,
      readChaptersByKunty ,
      readParts ,
      readSections ,
      clearVariables
    }
  }
}
</script>