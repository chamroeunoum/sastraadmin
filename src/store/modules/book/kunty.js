import crud from '../../../api/crud'

// initial state
const state = () => ({
  model: {
    name: "kunties" ,
    title: "គន្ថី" 
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
  async list ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/books/"+state.model.name + "?" + new URLSearchParams({
        // unit: params.unit ,
        // date: params.date ,
        // number: params.number ,
        // type: params.type ,
        search: params.search ,
        perPage: params.perPage ,
        page: params.page ,
        book_id: params.book_id
      }).toString()
    )
  },
  async read ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id)
  },
  async compact ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/books/"+state.model.name + "/compact" + ( params !== undefined ? "?" + new URLSearchParams({
      page: params.page ,
      perPage : params.perPage ,
      search: params.search ,
      book_id: params.book_id
    }).toString(): ""))
  },
  async create ({ state, commit, rootState },params) {
    return await crud.create(rootState.apiServer+"/books/"+state.model.name,params)
  },
  async update ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/books/"+state.model.name,params)
  },
  async delete ({ state, commit, rootState },params) {
    return await crud.delete(rootState.apiServer+"/books/"+state.model.name+"/"+params.id)
  },
  async upload({ state, commit, rootState },formData) {
    // return await crud.upload(rootState.apiServer+"/"+state.model.name+"/"+params.id+"/upload",{pdfs: params.pdfs})
    return await crud.upload(rootState.apiServer+"/books/"+state.model.name+"/upload",formData)
  },
  async activate ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/books/"+state.model.name+'/'+params.id+'/activate',{})
  },
  async deactivate ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/books/"+state.model.name+'/'+params.id+'/deactivate',{})
  },
  async matika ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id+"/matikas")
  },
  async chapter ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id+"/chapters")
  },
  async part ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id+"/parts")
  },
  async section ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id+"/sections")
  },
  async matra ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/books/"+state.model.name+"/"+params.id+"/matras")
  },
}

// mutations
const mutations = {
  // increment (state) {
  //   // `state` is the local module state
  //   state.count++
  // }
  setRecords (state, records) {
    state.records = records
  },
  setRecord (state, record) {
    state.record = record
  },

  // decrementProductInventory (state, { id }) {
  //   const product = state.all.find(product => product.id === id)
  //   product.inventory--
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}