<template >
    <div class="flex flex-wrap justify-center p-4bg-white">
        <div v-for="i in 4" :key="i" class="flex flex-wrap flex-justify-center w-1/4 p-2">
            <div class="flex flex-wrap flex-justify bg-gray-100 w-full p-2 border-1" >
                <div class="w-full border-b border-gray-200 pb-2 mb-2 font-bold" >ទាំងមូល</div>
                <div class="task-earn text-green-500 w-1/2 text-left py-2 font-bold" >ចំណូល<br/>{{ task.totalEarn }} KHR</div>
                <div class="task-expense text-red-500 w-1/2 text-right py-2 font-bold" >ចំណាយ<br/>{{ task.totalExpense }} KHR</div>
                <div class="task-new w-1/2  text-left py-2" >ការងារថ្មី ៖ {{ task.totalNewTasks }}</div>
                <div class="task-in-progress w-1/2  text-right py-2" >{{ task.totalInProgressTasks }} ៖ ការងារកំពុងធ្វើ</div>
                <div class="task-pending w-1/2  text-left py-2" >ការងារដែលផ្អាក ៖ {{ task.totalPendingTasks }}</div>
                <div class="task-ended w-1/2  text-right py-2" >{{ task.totalEndedTasks }} ៖ ការងារបានបញ្ចប់</div>
            </div>
        </div>
    </div>
</template>
<script >
import { reactive } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'Dashboard',
    components: {
    },
    name: 'dashboard' ,
    setup() {
        const store = useStore();
        const task = reactive({
            /**
             * Total number of tasks base on it status
             */
            totalNewTasks: 0 ,
            totalInProgressTasks: 0 ,
            totalPendingTasks: 0 ,
            totalEndedTasks: 0 ,
            /**
             * Total earn and expense since the begining
             */
            totalExpense: 0.0 ,
            totalEarn: 0.0 ,
        })
        store.dispatch( 'task/getTotalEarnExpenseByDay' ).then( res => {
            task.totalNewTasks = res.data.new
            task.totalInProgressTasks = res.data.progress
            task.totalPendingTasks = res.data.pending
            task.totalEndedTasks = res.data.ended
            task.totalExpense = res.data.expense
            task.totalEarn = res.data.earn
        } )
        return { 
            task
        }
    }
}
</script>
<style scoped>
    
</style>