<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-model:show="show" :on-after-leave="onClose" transform-origin="center">
        <n-card class="w-1/2 font-pvh text-xl" :title="'កែប្រែ ' + model.title" :bordered="false" size="small">
          <template #header-extra>
            <n-button type="success" @click="update()" >
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
                <n-form-item label="ការបរិយាយនៃការងារ" path="name" class="w-4/5 mr-8" >
                    <n-input type="textarea" v-model:value="record.name" placeholder="ការបរិយាយនៃការងារ" />
                  </n-form-item>
                  <n-form-item label="រយះពេល (គិតជាថ្ងែ)" path="duration" class="w-4/5 mr-8" >
                    <n-input-number clearable v-model:value="record.duration" placeholder="រយះពេល" />
                  </n-form-item>
                  <n-form-item label="ទឹកប្រាក់" path="amount" class="w-4/5 mr-8" >
                    <n-input-number clearable v-model:value="record.amount" placeholder="ទឹកប្រាក់" />
                  </n-form-item>
                  <n-form-item label="ប្រភេទទឹកប្រាក់" path="amountType" class="w-4/5 mr-8" >
                    <n-switch class="text-xs" :rail-style="railStyle" >
                      <template #checked> ចំណូល </template>
                      <template #unchecked> ចំណាយ </template>
                    </n-switch>
                  </n-form-item>
                  <n-form-item label="អត្រាប្ដូរប្រាក់" path="exchangeRate" class="w-4/5 mr-8" >
                    <n-input-number clearable v-model:value="record.exchangeRate" placeholder="អត្រាប្ដូរប្រាក់" />
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
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import { Save20Regular } from '@vicons/fluent'

export default {
  components: {
    Save20Regular
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
      required: true ,
      default: () => {
        return reactive({
          id: 0 ,
          name: '' ,
          duration: 0 ,
          amount: 0.0 ,
          amountType: '' ,
          exchangeRate: 0.0 ,
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
    console.log( props.record )
    var store = useStore()
    const message = useMessage()
    const notify = useNotification()
    /**
     * Variables
     */    
    var rules = {
      name: {
          required: true,
          message: 'សូមបំពេញការបរិយាយនៃការងារ',
          trigger: [ 'blur']
        }
    }
    /**
     * Functions
     */
    function clearRecord(){
      props.record = {
        id : 0 ,
        name: '' ,
        duration: 0 ,
        amount: 0.0 ,
        amountType: '' ,
        exchangeRate: 0.0
      }
    }

    function update(){
      if( props.record.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញ ការបរិយាយអំពីការងារ' ,
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
      store.dispatch( props.model.name+'/update',{
        id: props.record.id ,
        name: props.record.name ,
        duration: props.record.duration ,
        amount: props.record.amount ,
        amount_type: props.record.amountType ,
        exchange_rate: props.record.exchangeRate
      }).then( res => {
        if( res.data.ok ){
          notify.warning({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: res.data.message ,
            duration: 2000
          })
          clearRecord()
          props.onClose()
        }else{
          notify.error({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
            duration: 2000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }
  
    function railStyle({focused, checked }){
      const style = {};
      if (checked) {
        props.record.amountType = 1
        style.background = "#2080f0";
        if (focused) {
          style.boxShadow = "0 0 0 2px #d0305040";
        }
      } else {
        props.record.amountType = 0
        style.background = "#d03050";
        if (focused) {
          style.boxShadow = "0 0 0 2px #2080f040";
        }
      }
      return style;
    }

    return {
      /**
       * Variables
       */
      rules ,
      /**
       * Functions
       */
      update ,
      railStyle
    }
  }
}
</script>