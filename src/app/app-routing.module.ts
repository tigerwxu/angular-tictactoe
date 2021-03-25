import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: "pvp", component: BoardComponent },
  { path: "pvc", component: BoardComponent },
  { path: "", component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
