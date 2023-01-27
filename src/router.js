import { createRouter, createWebHashHistory } from 'vue-router'
import { isAdmin, isAuth } from './plugins/authentication'
import LoginComponent from './layouts/login/index.vue'
import DashboardComponent from './layouts/dashboard/index.vue'
import DashboardWidget from './components/main/dashboard.vue'
/**
 * Package Components
 */
import PackageCrud from './components/product/index.vue'
import PackageListCrud from './components/product/list.vue'
import PackageReadForPublic from './components/product/public-read.vue'
import PackageCreateCrud from './components/product/create.vue'
import PackageUpdateCrud from './components/product/update.vue'
import PackageGutterCrud from './components/product/gutter.vue'
/**
 * User Components
 */
import UserCrud from './components/user/index.vue'
import UserListCrud from './components/user/list.vue'
import UserCreateCrud from './components/user/create.vue'
import UserUpdateCrud from './components/user/update.vue'
import UserDetail from './components/user/detail.vue'
/**
 * Book Components
 */
 import BookCrud from './components/book/index.vue'
 import BookListCrud from './components/book/list.vue'
//  import BookCreateCrud from './components/book/create.vue'
//  import BookUpdateCrud from './components/book/update.vue'

/**
 * Task Components
 */
 import TaskCrud from './components/task/index.vue'
 import TaskListCrud from './components/task/list.vue'
 import TaskCreateCrud from './components/task/create.vue'
 import TaskUpdateCrud from './components/task/update.vue'
 import TaskDetail from './components/task/detail.vue'

/**
 * Matra Components
 */
 import MatraCrud from './components/book/matra/index.vue'
 import MatraListCrud from './components/book/matra/list.vue'
 import MatraCreateCrud from './components/matra/create.vue'
 import MatraUpdateCrud from './components/matra/update.vue'

/**
 * Client Components
 */
import ClientCrud from './components/client/index.vue'
/**
 * Staff Components
 */
import StaffCrud from './components/staff/index.vue'
/**
 * Error
 */
import Page404 from './components/errors/404.vue'
let routes = [] 
if( !isAdmin() ){
    routes = [{ 
        path: '', 
        redirect: to => {
            return '/login'
        }
    },
    { 
        path: '/', 
        redirect: to => {
            return '/login'
        }
    },
    {
        name: 'Login',
        path: '/login',
        component: LoginComponent ,
        meta: {
            transition: 'slide-left'
        }
    },
    {
        name: "PackageDetailForPublic" ,
        path: '/readpackage/:id',
        component: PackageReadForPublic ,
        meta: { 
            transition: 'slide-right'
        },
    },
    /**
     * Dashboard
     */
    {
        name: "Dashboard" ,
        path: '/dashboard',
        component: DashboardComponent,
        meta: {
            transition: 'slide-left' ,
            requiresAuth: true,
            is_admin : true
        },
        children: [{
            name: 'DashboardWidgets' ,
            path: '',
            component: DashboardWidget ,
            meta : {
                transition: 'slide-left' ,
                requiresAuth: true ,
                is_admin : true
            }
        },
        // {
        //     name: "Package" ,
        //     path: '/package',
        //     component: PackageCrud ,
        //     meta: { 
        //         transition: 'slide-left' ,
        //         requiresAuth: true,
        //         is_admin : true
        //     },
        //     children: [
        //         {
        //             name: "PackageList" ,
        //             path: '',
        //             component: PackageListCrud ,
        //             meta: { 
        //                 transition: 'slide-right' ,
        //                 requiresAuth: true,
        //                 is_admin : true
        //             },
        //         },
        //         // {
        //         //     path: 'create',
        //         //     component: PackageCreateCrud ,
        //         //     meta: { 
        //         //         transition: 'slide-right' ,
        //         //         requiresAuth: true,
        //         //         is_admin : true
        //         //     },
        //         // },
        //         // {
        //         //     path: 'update',
        //         //     component: PackageCreateCrud ,
        //         //     meta: { 
        //         //         transition: 'slide-right' ,
        //         //         requiresAuth: true,
        //         //         is_admin : true
        //         //     },
        //         // }
        //     ]
        // },
        // {
        //     name: 'Receive' ,
        //     path: '/receive',
        //     component: PackageGutterCrud ,
        //     meta: { 
        //         transition: 'slide-right' ,
        //         requiresAuth: true ,
        //         is_admin : true
        //     },
        // },
        {
            name: 'User' ,
            path: '/user',
            component: UserCrud ,
            meta: { 
                transition: 'slide-right' ,
                requiresAuth: true,
                is_admin : true
            },
            children: [
                {
                    name: "UserList" ,
                    path: '' ,
                    component: UserListCrud
                },
                {
                    name: "UserDetail" ,
                    path: ':id/detail' ,
                    component: UserDetail
                },
                {
                    name: "UserCreate" ,
                    path: 'create' ,
                    component: UserCreateCrud
                },
                {
                    name: "UserUpdate" ,
                    path: 'update' ,
                    component: UserUpdateCrud
                }
            ]
        },
        {
            name: 'Book' ,
            path: '/book',
            component: BookCrud ,
            meta: { 
                transition: 'slide-right' ,
                requiresAuth: true,
                is_admin : true
            },
            children: [
                {
                    name: "BookList" ,
                    path: '' ,
                    component: BookListCrud
                },
                {
                    name: "MatraOfBook" ,
                    path: ':id/matra' ,
                    component: MatraListCrud,
                },
                // {
                //     name: "BookUpdate" ,
                //     path: 'update' ,
                //     component: BookUpdateCrud
                // }
            ]
        },
        /**
         * Task
         */
        {
            name: 'Task' ,
            path: '/task',
            component: TaskCrud ,
            meta: { 
                transition: 'slide-right' ,
                requiresAuth: true,
                is_admin : true
            },
            children: [
                {
                    name: "TaskList" ,
                    path: '' ,
                    component: TaskListCrud
                },
                {
                    name: "TaskDetail" ,
                    path: ':id/detail' ,
                    component: TaskDetail
                },
                {
                    name: "TaskCreate" ,
                    path: 'create' ,
                    component: TaskCreateCrud
                },
                {
                    name: "TaskUpdate" ,
                    path: 'update' ,
                    component: TaskUpdateCrud
                }
            ]
        },
        /**
         * Matra Section
         */
        {
            name: 'Matra' ,
            path: '/matra',
            component: MatraCrud ,
            meta: { 
                transition: 'slide-right' ,
                requiresAuth: true,
                is_admin : true
            },
            children: [
                {
                    name: "MatraList" ,
                    path: '' ,
                    component: MatraListCrud
                },
                // {
                //     name: "BookCreate" ,
                //     path: 'create' ,
                //     component: BookCreateCrud
                // },
                // {
                //     name: "BookUpdate" ,
                //     path: 'update' ,
                //     component: BookUpdateCrud
                // }
            ]
        }],
    }]
}else{
    routes = [{ 
        path: '', 
        redirect: to => {
            return '/login'
        }
    },
    { 
        path: '/', 
        redirect: to => {
            return '/login'
        }
    },
    {
        name: 'Login',
        path: '/login',
        component: LoginComponent ,
        meta: {
            transition: 'slide-left'
        }
    },
    {
        name: "PackageDetailForPublic" ,
        path: '/readpackage/:id',
        component: PackageReadForPublic ,
        meta: { 
            transition: 'slide-right'
        },
    },
    /**
     * Dashboard
     */
    {
        name: "Dashboard" ,
        path: '/dashboard',
        component: DashboardComponent,
        meta: {
            transition: 'slide-left' ,
            requiresAuth: true,
            is_admin : true
        },
        children: [{
            name: 'DashboardWidgets' ,
            path: '',
            component: DashboardWidget ,
            meta : {
                transition: 'slide-left' ,
                requiresAuth: true ,
                is_admin : true
            }
        },
        // {
        //     name: "Package" ,
        //     path: '/package',
        //     component: PackageCrud ,
        //     meta: { 
        //         transition: 'slide-left' ,
        //         requiresAuth: true,
        //         is_admin : true
        //     },
        //     children: [
        //         {
        //             name: "PackageList" ,
        //             path: '',
        //             component: PackageListCrud ,
        //             meta: { 
        //                 transition: 'slide-right' ,
        //                 requiresAuth: true,
        //                 is_admin : true
        //             },
        //         }
        //     ]
        // },
        // {
        //     path: '/client',
        //     component: ClientCrud ,
        //     meta: { 
        //         transition: 'slide-right' ,
        //         requiresAuth: true,
        //         is_admin : true
        //     },
        // }
        ]
    }]
}

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Meta Handling
router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !isAuth() ){
        if( to.path.includes('/readpackage') ) next()
        else{
            next({ path: '/login' })
        }
    }
    else if (to.path == '/login' && isAuth() ) {
        next({ path: '/dashboard' })
        // if( isAdmin() ){
        //     next({ path: '/dashboard' })
        // }else{
        //     next({ path: '/receive' })
        // }
    }
    else {
        next()
    }
})
// .beforeResolve(async to => {
//     if (to.meta.requiresCamera) {
//         try {
//         await askForCameraPermission()
//         } catch (error) {
//         if (error instanceof NotAllowedError) {
//             // ... handle the error and then cancel the navigation
//             return false
//         } else {
//             // unexpected error, cancel the navigation and pass the error to the global handler
//             throw error
//         }
//         }
//     }
// })

export default router