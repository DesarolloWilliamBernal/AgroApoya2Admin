import { Component, OnInit, TemplateRef } from '@angular/core';
import { ValorarofertaService } from 'src/app/core/valoraroferta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { MetodosglobalesService } from 'src/app/core/metodosglobales.service';

@Component({
  selector: 'app-sectorizacion',
  templateUrl: './sectorizacion.component.html',
  styleUrls: ['./sectorizacion.component.css']
})
export class SectorizacionComponent implements OnInit {
  DesSect: string = '';
  CoordeSect: string = '';
  Cant: string = '';
  VlrFle: string = '';
  DataSectores: any;
  keyword: string = '';
  SectSelec: any;
  Respuesta: any;
  SessionOferta: any;
  DataSectorOferta: any[] = [];
  DataCoor: any[] = [];
  ValidaConsulta: string = '';
  txtValidaCons: string = '';
  NombreSec: string = '';
  Coor1: string = '';
  Coor2: string = '';
  SessionCDMunicipio: any;
  SessionCDRegion: any;
  SessionCiudad: any;
  SessionIdUsuario: any;
  ModalInsert: NgbModalRef | undefined;
  ModalRespuesta: NgbModalRef | undefined;
  CantidadSectores: number;
  SessionCantSecOferta: any;
  SessionNomOferta: string;
  markers: google.maps.Marker[] = [];
  geocoder = new google.maps.Geocoder();
  ValidaInsertSec: string = '';
  SessionSecCreado: any;
  ValidaCoord: string;
  DataOferta: any[];
  RutaImagen: string;
  map: google.maps.Map;
  marker: google.maps.Marker;
  responseDiv: HTMLDivElement;
  response: HTMLPreElement;
  Sector: string;
  Zona: string
  ValidaMapSector: string = '0';
  SessionNombreSector: any;
  Sessioncoordenada: any;
  area: google.maps.Polygon;
  Sessionzona: any;
  ValidaSelecZona: string;
  DataZonas: any = [];
  SessionzonaIns: any = '';
  keywordZonasInsertSecor: string = '';
  keywordZonasAsignaSector: string = '';
  ZonaInsertSecor: string = '';
  ZonaAsignaSector: string = '';
  seleczona: string = '0';
  NumUsuarios: string = '';
  UserSector: string = '';
  TiempoSector: string = '1';

  //Cantidades totales
  CantidadDispinible: number = 0;



  constructor(private modalService: NgbModal, public sectoresservices: ValorarofertaService, public rutas: Router, private cookies: CookieService, private ServiciosGenerales: MetodosglobalesService) {
  }

  ngOnInit(): void {
    this.DesSect = '';
    this.CoordeSect = '';
    this.Cant = '';
    this.VlrFle = '';
    this.SectSelec = '';
    this.SessionOferta = this.cookies.get('IDO');
    this.SessionIdUsuario = this.cookies.get('IDU');
    this.RutaImagen = this.ServiciosGenerales.RecuperaRutaImagenes();
    this.SessionCDMunicipio = '0';
    this.SessionCDRegion = '0';
    this.SessionCiudad = '0';
    this.CantidadSectores = 0;
    this.ValidaInsertSec = '0';
    this.Coor1 = '';
    this.Coor2 = '';
    this.SessionSecCreado = '';
    this.ConsultaCiudadOferta();
    this.ConsultaSectoresOferta();
    this.ConsultaDetalleOferta();

  }


  Centramapa(request: google.maps.GeocoderRequest): void {
    this.geocoder.geocode(request).then((result) => {
      const { results } = result;
      this.map.setCenter(results[0].geometry.location);
      return results;
    })
      .catch((e) => {
        //console.log("Geocode was not successful for the following reason: " + e);
      });
  }

  AgregarMarcador(latLng: google.maps.LatLng, map: google.maps.Map) {
    if (this.markers.length > 0) {
      this.markers[0].setMap(null)
    }
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    this.markers = [];
    this.markers.push(marker);
  }
  ConsultaDetalleOferta() {
    //console.log('1', this.SessionOferta)
    this.sectoresservices.ConsultaOferta('1', this.SessionOferta).subscribe(ResultConsu => {
      //console.log(ResultConsu)
      this.DataOferta = ResultConsu;
      this.CantidadDispinible = ResultConsu[0].Unidades_disponibles;
      this.SessionNomOferta = ResultConsu[0].Nombre_Producto + ' - ' + ResultConsu[0].Descripcion_empaque + ' - ' + ResultConsu[0].Nombre_productor;
      this.SessionCantSecOferta = ResultConsu[0].Unidades_disponibles;
    })
  }
  ConsultaZonas(idCiudad: string, IdDepartamento: string) {
    const descripcion = {
      "Descripcion": ""
    }
    this.sectoresservices.ConsZona('1', '0', idCiudad, IdDepartamento, descripcion).subscribe(ResultadoCons => {
      this.DataZonas = ResultadoCons;
      this.keywordZonasInsertSecor = 'Descripcion';
      this.keywordZonasAsignaSector = 'Descripcion';
    })
  }
  LimpiaZona(result: string) {
    this.ZonaAsignaSector = result;
    this.seleczona = '0';
    this.Sector = '';
    this.Cant = '';
  }
  ConsultaCiudadOferta() {

    //console.log('1', this.SessionOferta)
    this.sectoresservices.ConsultaCiudadOferta('1', this.SessionOferta).subscribe(ResultadoCons => {
      //console.log(ResultadoCons)
      this.SessionCiudad = ResultadoCons[0].Cuidad;
      this.SessionCDMunicipio = ResultadoCons[0].CD_MNCPIO;
      this.SessionCDRegion = ResultadoCons[0].CD_RGION;
      this.ConsultaZonas(this.SessionCDMunicipio, this.SessionCDRegion);
    })
  }

  ConsultaSectorPoligono(idsector: string) {

    this.sectoresservices.ModificaSectorPoligono('3', idsector).subscribe(ResultadoCons => {
      // console.log(ResultadoCons);
      //{ID: 0, ID_SCTOR_OFRTA: 408, LTTUD: '4.729601477155', LNGTUD: '-74.0690865847988'}
      var aux = ResultadoCons.split('|');
      this.sectoresservices.ConsultaUsuarioSector('3', aux[0]).subscribe(ResultadoCons => {
        this.sectoresservices.ConsultaNumUsuariosSector('3', aux[0]).subscribe(ResultadoCons => {
          this.NumUsuarios = ResultadoCons.toString();
        })
      })
    })
  }

  ConsultaUsuariosSectr() {
    if (this.DataCoor.length < 3) {
      this.NumUsuarios = '0'
    } else {
      this.ConsultaSectorPoligono(this.SessionSecCreado);
    }
  }

  ConsultaUserSector(sector: any) {
    var selectSector = sector.SCTOR_OFRTA
    this.sectoresservices.ConsultaNumUsuariosSector('3', selectSector).subscribe(ResultadoCons => {
      this.UserSector = ResultadoCons.toString();
    })
  }
  LimpiaSector(result: string) {
    this.Sector = result;
    this.SectSelec = '0';
    this.ValidaCoord = "";
    this.UserSector = "";
  }

  ConsultaSectoresOferta() {
    this.sectoresservices.ConsultaSectoresOferta('1', this.SessionOferta).subscribe(ResultConsulta => {
      if (ResultConsulta.length > 0) {
        this.ValidaConsulta = '0';
        this.DataSectorOferta = ResultConsulta;
        this.CantidadSectores = 0
        for (let i = 0; i < ResultConsulta.length; i++) {
          this.CantidadSectores += ResultConsulta[i].CNTDAD;
        }
      }
      else {
        this.CantidadSectores = 0;
        this.ValidaConsulta = '1';
        this.DataSectorOferta = [];
        this.txtValidaCons = 'No se encuentran registros de sectores asociados a la oferta';
      }
    })

  }

  ConsultaSectores(IdZona: string) {
    this.sectoresservices.ConsultaSectoresEtv('1', '0', IdZona, this.SessionOferta).subscribe(Result => {
      console.log(Result)
      this.DataSectores = Result;
      this.keyword = 'DSCRPCION_SCTOR';
    })
  }
  AsociaSector(templateRespuesta: any) {
    this.sectoresservices.ConsultaSectoresOferta('1', this.SessionOferta).subscribe(ResultConsulta => {
      this.CantidadSectores = 0
      for (let i = 0; i < ResultConsulta.length; i++) {
        this.CantidadSectores += ResultConsulta[i].CNTDAD;
      }
      if ((this.Cant + this.CantidadSectores) > this.SessionCantSecOferta) {
        this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
        this.Respuesta = 'Las cantidades a asignar superan las disponibles de la oferta, favor valida tu información.';
      } else if (this.CantidadSectores >= this.SessionCantSecOferta) {
        this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
        this.Respuesta = 'Las cantidades totales de la oferta ya fueron asignadas, no es posible asignar mas sectores.';
      }
      else if (this.Cant > this.SessionCantSecOferta) {
        this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
        this.Respuesta = 'Las cantidades a asignar superan las disponibles de la oferta, favor valida tu información.';
      }
      else {
        this.Respuesta = '';
        if (this.Cant != '' && this.VlrFle != '' && this.SectSelec != '') {
          const BodyInsert = {
            ID: "0",
            CD_CNSCTVO: this.SessionOferta,
            ID_SCTOR_OFRTA: this.SectSelec,
            CNTDAD: this.Cant,
            VLOR_FLTE_SGRDO: this.VlrFle
          }
          this.sectoresservices.OperacionSectores('3', BodyInsert).subscribe(ResultInsert => {
            var respuesta = ResultInsert.split('|')
            this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
            this.Respuesta = respuesta[1];
            this.ConsultaSectoresOferta();
            this.ValidaCoord = '0';
            this.LimpiaForm();
          })
        }
        else {
          this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
          this.Respuesta = 'Los campos Sector, Cantidad y Valor flete son obligatorios, favor valida tu información.';
        }
      }
      //this.LimpiaForm();
    })
  }

  EliminaSector(sector: any, templateRespuesta: any) {
    const BodyDelete = {
      ID: "0",
      CD_CNSCTVO: sector.CD_CNSCTVO,
      ID_SCTOR_OFRTA: sector.ID_SCTOR_OFRTA,
      CNTDAD: sector.CNTDAD,
      VLOR_FLTE_SGRDO: sector.VLOR_FLTE_SGRDO
    }
    this.sectoresservices.OperacionSectores('4', BodyDelete).subscribe(ResultDelet => {
      var respuesta = ResultDelet.split('|')
      this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
      this.Respuesta = respuesta[1]
      this.ConsultaSectoresOferta();
    })
  }

  AbreCreaSector(content: any, templateRespuesta: any) {
    //IdZona
    this.ValidaSelecZona = '1';
    this.NombreSec = '';
    this.ValidaCoord = '0';
    this.Coor1 = '';
    this.Coor2 = '';
    this.DataCoor = [];
    this.ModalInsert = this.modalService.open(content, { size: 'xl', keyboard: false, backdrop: 'static' })
    var element = document.getElementById('RadioPer') as HTMLInputElement
    element.focus();
    element.checked = true;
  }

  CreaSector(templateRespuesta: any) {
    if (this.NombreSec != '' && this.SessionzonaIns != '') {
      var RadioPermanent = document.getElementById('RadioPer') as HTMLInputElement;
      var RadioParcial = document.getElementById('RadioPar') as HTMLInputElement;
      if (RadioPermanent.checked == true) {
        this.TiempoSector = '2';
      }
      if (RadioParcial.checked == true) {
        this.TiempoSector = '1';
      }
      const BodyInsert = {
        USUCODIG: this.SessionIdUsuario,
        SCTOR_OFR: 0,
        DSCRPCION_SCTOR: this.NombreSec,
        CD_RGION: this.SessionCDRegion,
        CD_MNCPIO: this.SessionCDMunicipio,
        cd_cnsctvo: this.SessionOferta,
        TEMPORAL: this.TiempoSector,
        ID_ZONA: this.SessionzonaIns
      }
      this.sectoresservices.InsertarSector('3', BodyInsert).subscribe(ResultInsert => {
        const arrayRes = ResultInsert.split('|')
        //console.log(arrayRes)
        this.SessionSecCreado = arrayRes[0];
        this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
        this.Respuesta = arrayRes[1];
        //this.ConsultaCiudadOferta();
        this.ValidaSelecZona = '2';
        if (this.SessionSecCreado != undefined) {
          //console.log('Entra')
          this.ValidaInsertSec = '1';
          this.CreaMapa();
        }
        else {
          this.ValidaInsertSec = '0';
        }
      })
    }
    else {
      this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
      this.Respuesta = "Los campos Nombre sector y coordenadas son obligatorios, favor valida tu información."
    }
  }

  CerrModalMap(templateRespuesta: any) {
    //this.ConsultaCiudadOferta();
    this.ConsultaCoordenadas();
    if (this.DataCoor.length >= 3) {
      this.ValidaInsertSec = '0';
      this.ValidaCoord = '0';
      this.Coor1 = '';
      this.Coor2 = '';
      this.DataCoor = [];
      this.modalService.dismissAll();
      this.SessionSecCreado = '0';

      this.LimpiaZona('');
    }
    else {
      this.modalService.open(templateRespuesta);
      this.Respuesta = 'Recuerda que debes registrar minimo 3 coordenadas por sector, favor valida tu información.';
    }
  }

  CreaMapa() {
    this.geocoder.geocode({ address: this.SessionCiudad }).then((result) => {
      const { results } = result;
      var lati = results[0].geometry.location.lat();
      var longi = results[0].geometry.location.lng();
      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 13,
          center: {
            lat: lati,
            lng: longi
          },
        }
      );
      this.map.addListener("click", (e: any) => {
        this.AgregarMarcador(e.latLng, this.map);
        this.Coor1 = e.latLng.toString()
        this.Coor1 = this.Coor1.substring(1, 15)
        this.Coor2 = e.latLng.toString()
        this.Coor2 = this.Coor2.substring(this.Coor2.indexOf('-'), this.Coor2.length - 1)
      });
    })
  }

  AgregarCoordenada(templateRespuesta: any) {
    if (this.Coor1 != '' && this.Coor2 != '') {
      const BodyInsertCoo = {
        ID: 0,
        ID_SCTOR_OFRTA: Number(this.SessionSecCreado),
        LTTUD: this.Coor1,
        LNGTUD: this.Coor2
      }
      this.sectoresservices.InsertarCoordenadas('3', BodyInsertCoo).subscribe(Resultado => {
        console.log(BodyInsertCoo)
        const arrayRes = Resultado.split('|')
        this.Respuesta = arrayRes[1];
        this.Coor1 = '';
        this.Coor2 = '';
        this.ConsultaCoordenadas();
        //this.ConsultaUsuariosSectr();
      })
    }
    else {
      this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
      this.Respuesta = "Los campos coordenadas son obligatorios, recuerda dar click en el mapa para recuperar las coordenadas.";
    }
  }

  EliminaCoordenada(coordenada: any) {
    //console.log(coordenada)
    const BodyInsertCoo = {
      ID: coordenada.consecutivo,
      ID_SCTOR_OFRTA: Number(this.SessionSecCreado),
      LTTUD: coordenada.Latitud,
      LNGTUD: coordenada.Longitud
    }
    this.sectoresservices.InsertarCoordenadas('4', BodyInsertCoo).subscribe(Resultado => {
      this.Coor1 = '';
      this.Coor2 = '';
      this.ConsultaCoordenadas();
      //this.ConsultaUsuariosSectr();
      this.markers[0].setMap(null)
    })

  }

  ConsultaCoordenadas() {
    this.sectoresservices.ConsultaCoordenada('1', this.SessionSecCreado).subscribe(Result => {
      if (Result.length > 0) {
        if (this.area != undefined) {
          this.area.setMap(null)
        }
        this.ValidaCoord = '1';
        this.DataCoor = Result;
        var coordenadas = '';
        for (var i = 0; i < this.DataCoor.length; i++) {
          coordenadas += this.DataCoor[i].Latitud.trim() + ',' + this.DataCoor[i].Longitud.trim() + '|';
        }
        var nuevaCoord = coordenadas.substring(0, coordenadas.length - 1)
        //var nuevaCoord = "4.711719820895,-74.11319514221|4.712746307730,-74.10924693054|4.709923465287,-74.10795947022|4.708554810281,-74.11036272949|4.711719820895,-74.11319514221";
        var bounds = new google.maps.LatLngBounds;
        var coords = nuevaCoord.split('|').map(function (data: string) {
          var info = data.split(','), // Separamos por coma
            coord = { // Creamos el obj de coordenada
              lat: parseFloat(info[0]),
              lng: parseFloat(info[1])
            };
          // Agregamos la coordenada al bounds
          bounds.extend(coord);
          return coord;
        });
        this.area = new google.maps.Polygon({
          paths: coords,
          strokeColor: '#397c97',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#B1B0B0',
          fillOpacity: 0.35,
        });
        this.area.setMap(this.map);
      }
      else {
        this.ValidaCoord = '0';
        this.DataCoor = [];
      }
      this.ConsultaUsuariosSectr();
    })
  }

  LimpiaModal() {
    this.NombreSec = '';
    this.Coor1 = '';
    this.Coor2 = '';
  }

  selectZona(item: any) {
    //this.Sessionzona = item.id;
    this.ConsultaSectores(item.id);
    if (this.Cant != "" && this.Cant != "0") {
      this.seleczona = '1';
    }
    //Cada vez que seleccione una zona debo ir a consultar los sectores de esa zona, metodo ConsultaSectores(),
    //a dicho metodo falta agregarle parametro idzona
  }
  BlurCantidad(ModalRespuesta: any) {
    console.log(this.UserSector)
    if (this.CantidadDispinible >= Number(this.Cant)) {
      if (this.ZonaAsignaSector != "" && this.ZonaAsignaSector != "0") {
        this.seleczona = '1';
      }
    } else {
      this.Cant = "";
      this.modalService.open(ModalRespuesta, { ariaLabelledBy: 'modal-basic-title' });
      this.Respuesta = 'La cantidad seleccionada supera la cantidad disponible para la oferta.';
    }
  }

  selectSector(item: any, modalmapa: any) {
    this.ConsultaUserSector(item);
    this.modalService.open(modalmapa, { size: 'lg' });
    this.ValidaMapSector = '1';
    this.VlrFle = '';
    this.SectSelec = item.SCTOR_OFRTA;
    this.SessionNombreSector = item.DSCRPCION_SCTOR;
    this.Sessioncoordenada = item.coordenadas;
    this.ConsultaMapaSector();
    this.ValidaCoord = '3';
  }

  ConsultaMapaSector() {
    this.geocoder.geocode({ address: this.SessionCiudad }).then((result) => {
      const { results } = result;
      var bounds = new google.maps.LatLngBounds;
      console.log(this.Sessioncoordenada)
      var coords = this.Sessioncoordenada.split('|').map(function (data: string) {
        var info = data.split(','), // Separamos por coma
          coord = { // Creamos el obj de coordenada
            lat: parseFloat(info[0]),
            lng: parseFloat(info[1])
          };
        // Agregamos la coordenada al bounds
        bounds.extend(coord);
        return coord;
      });
      var area = new google.maps.Polygon({
        paths: coords,
        strokeColor: '#397c97',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#B1B0B0',
        fillOpacity: 0.35
      });
      this.map = new google.maps.Map(
        document.getElementById("mapCS") as HTMLElement,
        {
          zoom: 15,
          center: bounds.getCenter(),
          mapTypeId: "terrain",
        }
      );
      area.setMap(this.map);
    })

  }

  AgregarMarcadorSector(lat: any, long: any, map: google.maps.Map) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: map,
    });
    this.markers.push(marker);
  }

  LimpiaForm() {
    this.Cant = '';
    this.VlrFle = '';
    this.seleczona = '0';
    this.Sector = '';
    this.Zona = '';
    this.ZonaAsignaSector = '';
    this.ZonaInsertSecor = '';
    this.ValidaCoord = '0';
  }

  Enviar(templateRespuesta: any) {
    this.modalService.open(templateRespuesta, { ariaLabelledBy: 'modal-basic-title' })
    if (this.CantidadSectores == this.SessionCantSecOferta) {
      const Body = {
        usucodig: this.SessionIdUsuario,
        cnctivoOferta: this.SessionOferta,
        ObsEstado: "",
        estado: 13,
        parametro1: "",
        parametro2: "",
        parametro3: ""
      }
      this.sectoresservices.ActualizaEstadoOferta('3', Body).subscribe(ResultUpda => {
        var respuesta = ResultUpda.split('|')
        this.Respuesta = respuesta[1];
        if (respuesta[0] != '-1') {
          this.rutas.navigateByUrl('/home/transportista');
          this.ConsultaSectoresOferta();
          for (var i = 0; i < this.DataSectorOferta.length; i++) {
            this.sectoresservices.CorreoMasivo('1', '6', '3', this.SessionOferta, this.DataSectorOferta[i].ID_SCTOR_OFRTA).subscribe(ResultCorreo => {
              //console.log(ResultCorreo)
            })
          }
          this.EnviarSms('4');
          this.InsertaLinks();
        }
      })

      

    }
    else {
      this.Respuesta = 'Las cantidades totales de la oferta aun no han sido asignadas, favor valida tu información.';
    }
  }

  InsertaLinks(){
    const DatosLink = {
      CD_CNSCTVO: this.SessionOferta,
      PRFJO_URL: this.ServiciosGenerales.RecuperarRutaAmbiente()
    }
    console.log(DatosLink)
    this.sectoresservices.InsertaLinks('3', DatosLink).subscribe(Resultado => {
      console.log(Resultado)
    })
  }

  ValidaCerrar(ModalRespuesta: any) {
    if (this.ValidaInsertSec == '1') {
      this.modalService.open(ModalRespuesta, { ariaLabelledBy: 'modal-basic-title' });
      this.Respuesta = 'Ya iniciaste el registro de un sector, favor finaliza el proceso.';
    }
    else {
      this.ConsultaSectorPoligono(this.SessionSecCreado);
      this.ModalInsert?.close();
    }
  }

  EnviarSms(bandera: string) {
    this.sectoresservices.EnviarSms(bandera, '0', this.SessionOferta, '0', '0', '0', '0').subscribe(Resultado => {
      //console.log(Resultado)
    })
  }

  selectZonaInsert(item: any) {
    //En este metodo debe habilitar los campos y botones del campo this.ValidaSelecZona siempre y cuando el valor sea diferente a 0
    //Tambien se debe recuperar la zona seleccionada y guardarla en la variable SessionzonaIns
    this.SessionzonaIns = item.id;
    this.ValidaSelecZona = '0';
  }
  LimpiaZonaInsert(result: string) {
    this.ZonaInsertSecor = result;
    this.ValidaSelecZona = '1';
    this.NombreSec = '';
  }
}
