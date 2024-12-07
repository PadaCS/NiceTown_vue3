import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

import Promote from '../views/Promote/Promote.vue'
import PromoteDetail from '../views/Promote/Detail.vue'
import Support from '../views/Support/Support.vue'
import SupportDetail from '../views/Support/Detail.vue'
import UserBasis from '../views/User/Basis.vue'
import ResetPsw from '../views/User/ResetPsw.vue'
import Statistic from '../views/Statistic.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/promote',
      children: [
        {
          path: '/promote',
          name: 'promote',
          component: Promote,
        },
        {
          path: '/promoteDetail',
          name: 'promoteDetail',
          component: PromoteDetail,
        },
        {
          path: '/support',
          name: 'support',
          component: Support,
        },
        {
          path: '/supportDetail',
          name: 'supportDetail',
          component: SupportDetail,
        },
        {
          path: '/user/basis',
          name: 'userBasis',
          component: UserBasis,
        },
        {
          path: '/user/resetpsw',
          name: 'resetpsw',
          component: ResetPsw,
        },
        
        {
          path: '/statistic',
          name: 'statistic',
          component: Statistic,
        },
      ]
    },
  ],
})

export default router
