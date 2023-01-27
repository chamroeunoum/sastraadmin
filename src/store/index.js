import { createStore, createLogger } from 'vuex'
// import product from './modules/product'
import auth from './modules/authentication'
import user from './modules/user'
import book from './modules/book/book'
import bookType from './modules/book/type'
import matra from './modules/book/matra'
import kunty from './modules/book/kunty'
import matika from './modules/book/matika'
import chapter from './modules/book/chapter'
import part from './modules/book/part'
import section from './modules/book/section'
import task from './modules/task'
// import client from './modules/client'
// import staff from './modules/staff'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state: {
    // apiServer: 'http://sctservice.kabit.asia/api'
    // apiServer: 'http://127.0.0.1:8000/api'
    apiServer: 'http://127.0.0.1:8000/api' ,
    // branch: ''
  },
  modules: {
    // product ,
    auth,
    user,
    task,
    /**
     * Regulator Section
     */
    book,
    "bookType" : bookType ,
    matra,
    kunty,
    matika,
    chapter,
    part,
    section,
    // client,
    // staff
  },
  strict: debug,
  plugins: debug ? 
    [
      createLogger()
    ] : 
    [
      
    ]
})