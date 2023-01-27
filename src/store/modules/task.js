import crud from '../../api/crud'

// initial state
const state = () => ({
  model: {
    name: "tasks" ,
    title: "ការងារ" 
  },
  records: [] ,
  record: null ,

})

// getters
const getters = {
  getRecords (state, getters, rootState) {
    return state.records
  },
  getRecord (state, getters, rootState) {
    return state.record
  }
}

// actions
const actions = {
  /**
   * CRUD Operations
   */
  async list ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/"+state.model.name + "?" + new URLSearchParams({
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  async read ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/"+params.id)
  },
  async create ({ state, commit, rootState },params) {
    return await crud.create(rootState.apiServer+"/"+state.model.name,params)
  },
  async update ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name,params)
  },
  async delete ({ state, commit, rootState },params) {
    return await crud.delete(rootState.apiServer+"/"+state.model.name,params)
  },
  /**
   * Operation for turning record from activate to deactivate and reverse
   */
  async activate({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/activate",params)
  },
  async deactivate({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/deactivate",params)
  },
  /**
   * Operations to turn the task into start, pending, end, new
   */
  async start({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/start",params)
  },
  async pending({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/pending",params)
  },
  async continue({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/continue",params)
  },
  async end({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/end",params)
  },
  /**
   * Get total number of tasks base on it status
   */
  async getTotalOfEachStatus({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_number_of_each_status")
  },
  async getTotalNumberOfNew({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_number_of_new")
  },
  async getTotalNumberOfInProgress({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_number_of_in_progress")
  },
  async getTotalNumberOfPending({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_number_of_pending")
  },
  async getTotalNumberOfEnded({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_number_of_ended")
  },
  /**
   * Operations to get the total earn base any criteria
   */
  async getTotalEarn({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_earn")
  },
  async getTotalEarnByMonthOfYear({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_earn_by_month_of_year/"+params.date)
  },
  async getTotalEarnBetween({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_earn_between/"+params.start+'/'+params.end)
  },
  /**
   * Operations to get the total earn base any criteria
   */
  async getTotalExpense({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_expense")
  },
  async getTotalExpenseByMonthOfYear({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_expense_by_month_of_year/"+params.date)
  },
  async getTotalExpenseBetween({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_expense_between/"+params.start+'/'+params.end)
  },
  /**
   * Get total expense and earn
   */
  async getTotalEarnExpenseByDay({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/total_tasks_earn_expense_by_day")
  },
}

// mutations
const mutations = {
  setRecords (state, records) {
    state.records = records
  },
  setRecord (state, record) {
    state.record = record
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}