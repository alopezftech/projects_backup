import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { AppComponent } from './app.component';
import { ExecutionListComponent } from './components/execution-list/execution-list.component';
import { LogDialogComponent } from './components/log-dialog/log-dialog.component';
import { TimeEditDialogComponent } from './components/time-edit-dialog/time-edit-dialog.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    ExecutionListComponent,
    LogDialogComponent,
    TimeEditDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
