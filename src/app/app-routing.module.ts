import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { TabsPage } from './pages/tabs/tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard] 
  },

  {
    // path:'menu',
    // component: CalenderPage,children:[
     
    // ]
    
      path: 'tabs',
      component: TabsPage, canActivate: [AuthGuard] ,children: [
        {
          path: '',
          loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
        },
        {
          path: 'home',
          loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
        },
        {
          path: 'profile',
          loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
        },
        {
          path: 'tickets',
          loadChildren: () => import('./pages/tickets/tickets.module').then( m => m.TicketsPageModule)
        },
    ]
    
  },
  {
    path: 'web-scan',
    loadChildren: () => import('./pages/web-scan/web-scan.module').then( m => m.WebScanPageModule)
  },
  {
    path: 'ticket-form',
    loadChildren: () => import('./pages/ticket-form/ticket-form.module').then( m => m.TicketFormPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule), canActivate: [AuthGuard] 
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./pages/tickets/tickets.module').then( m => m.TicketsPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
