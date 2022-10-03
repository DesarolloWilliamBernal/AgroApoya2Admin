import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearofertaComponent } from './ofertas/components/crearoferta/crearoferta.component';
import { LoginComponent } from './usuario/components/login/login.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BuscarofertaComponent } from './ofertas/components/valoraroferta/buscaroferta/buscaroferta.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SidebarModule } from 'ng-sidebar';
import { SectorizacionComponent } from './ofertas/components/valoraroferta/sectorizacion/sectorizacion.component';
import { TransportistaComponent } from './ofertas/components/valoraroferta/transportista/transportista.component';
import { ConciliacionComponent } from './ofertas/components/valoraroferta/conciliacion/conciliacion.component';
import { ValoracionComponent} from './ofertas/components/valoraroferta/valoracion/valoracion.component';
import { CookieService } from 'ngx-cookie-service';
import { PlantillascorreoComponent } from './usuario/components/plantillascorreo/plantillascorreo.component'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GoogleMapsModule } from '@angular/google-maps';
import { CosteoComponent } from './ofertas/components/valoraroferta/costeo/costeo.component';
//import { MenuComponent } from './usuario/components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearofertaComponent,
    BuscarofertaComponent,
    SectorizacionComponent,
    TransportistaComponent,
    ConciliacionComponent,
    ValoracionComponent, 
    LoginComponent,
    PlantillascorreoComponent,
    CosteoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    AutocompleteLibModule,
    SidebarModule.forRoot(),
    AngularEditorModule,
    GoogleMapsModule
  ],
  providers: [
     { provide: LocationStrategy, useClass: HashLocationStrategy },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
