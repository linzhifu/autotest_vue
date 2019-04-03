import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import User from '@/components/User'
import Project from '@/components/Project'
import WebManager from '@/components/WebManager'
import ApiManager from '@/components/ApiManager'
import ApiCase from '@/components/ApiCase'
import WebCase from '@/components/WebCase'
import WebType from '@/components/WebType'
import ApiType from '@/components/ApiType'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login/'
    },
    {
      path: '/login/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home/',
      component: Home,
      children: [
        {
          path: '',
          redirect: 'user'
        },
        {
          path: 'user',
          component: User
        },
        {
          path: 'project',
          component: Project
        },
        {
          path: 'webManager/:projectId?',
          component: WebManager
        },
        {
          path: 'apiManager/:projectId?',
          component: ApiManager
        },
        {
          path: 'apiCase/:apiManagerId?',
          component: ApiCase
        },
        {
          path: 'webCase/:webManagerId?',
          component: WebCase
        },
        {
          path: 'webType/:webManagerId?',
          component: WebType
        },
        {
          path: 'apiType/:webManagerId?',
          component: ApiType
        }
      ]
    }
  ]
})
