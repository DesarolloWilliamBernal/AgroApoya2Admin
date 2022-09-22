import { Component, OnInit } from '@angular/core';
import { MetodosglobalesService } from './../../../core/metodosglobales.service'
import { CrearofertaService } from './../../../core/crearoferta.service'
import { ValorarofertaService } from './../../../core/valoraroferta.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crearoferta',
  templateUrl: './crearoferta.component.html',
  styleUrls: ['./crearoferta.component.css']
})
export class CrearofertaComponent implements OnInit {

  public respuestaImagenEnviada: any;
  public resultadoCarga: any;
  productor = 'nombre_persona';
  //Declaracion de variables
  ArrayProductos: any = [];
  ArrayEmpaque: any = [];
  ArrayCondicion: any = [];
  ArrayTamano: any = [];
  ArrayDepa: any = [];
  ArrayCiud: any = [];
  ArrayProductor: any = [];
  IdProducto: string = '0';
  IdEmpaque: string = '0';
  IdCondicion: string = '0';
  IdTamano: string = '0';
  DesProducto: string = '';
  ValorOferta: number;
  Unidades: number;
  ValorTotalOferta: number = 0;
  Vigencia: string = '';
  IdDepartamento: string = '0';
  IdCiudad: string = '0';
  UbicacionPar: string = '';
  Imagen1: string = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  Imagen2: string = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  Imagen3: string = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  Imagen4: string = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  Imagen5: string = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  NomImagen1: string = '0';
  NomImagen2: string = '0';
  NomImagen3: string = '0';
  NomImagen4: string = '0';
  NomImagen5: string = '0';
  RutaImagenes: string = '';
  ImagenCargada: string = '';
  file: FileList | undefined;
  IdProductor: string = '';
  EJornada: string = '0';
  ArrayJornada: any = [];
  Respuesta: string  = '';

  constructor(
    private SeriviciosGenerales: MetodosglobalesService,
    private ServiciosOferta: CrearofertaService,
    private modalService: NgbModal,
    private ServiciosValorar: ValorarofertaService
  ) { }

  ngOnInit(): void {
    this.RutaImagenes = this.SeriviciosGenerales.RecuperaRutaImagenes();
    this.CargaProductos();
    this.CargaDepartamento();
    this.CargarObjetosIniciales();
  }

  CargarObjetosIniciales() {
    const datosproductor = {
      nombre_persona: ''
    }
    this.ServiciosValorar.ConsultaProductor('1', '1', datosproductor).subscribe(Resultado => {
      this.ArrayProductor = Resultado;
      console.log(this.ArrayProductor);
    })
    this.ServiciosValorar.ConsultaJornada('1').subscribe(Resultado => {
      this.ArrayJornada = Resultado;
    })
  }

  selectProductor(item: any) {
    this.IdProductor = item.codigo_persona;
  }

  LimpiarCampos(campo: string) {
    if (campo == 'pd') {
      this.IdProducto = '0';
    }
  }

  CargaProductos() {
    this.ServiciosOferta.ConsultaProductos('1').subscribe(Resultado => {
      this.ArrayProductos = Resultado;
    })
  }

  CargaEmpaques(idproducto: string) {
    this.ServiciosOferta.ConsultaEmpaque(idproducto).subscribe(Resultado => {
      this.ArrayEmpaque = Resultado;
      console.log(Resultado)
    })
  }

  CargaCondicion(idproducto: string) {
    this.ServiciosOferta.ConsultaCondicion(idproducto).subscribe(Resultado => {
      this.ArrayCondicion = Resultado;
      console.log(Resultado)
    })
  }

  CargaTamano(idproducto: string) {
    this.ServiciosOferta.ConsultaTamano(idproducto).subscribe(Resultado => {
      this.ArrayTamano = Resultado;
      console.log(Resultado)
    })
  }

  CargaDepartamento() {
    this.ServiciosOferta.ConsultaDepartamento('4').subscribe(Resultado => {
      this.ArrayDepa = Resultado;
      console.log(Resultado)
    })
  }

  CargarCiudad(idmun: string) {
    this.ServiciosOferta.ConsultaCiudad(idmun).subscribe(Resultado => {
      this.ArrayCiud = Resultado;
    })
  }


  SelProducto(idproducto: string) {
    this.IdProducto = idproducto;
    this.CargaEmpaques(this.IdProducto);
    this.CargaCondicion(this.IdProducto);
    this.CargaTamano(this.IdProducto);
  }

  SelEmpaque(idempaque: string) {
    this.IdEmpaque = idempaque;
  }

  SelCondicion(idcondicion: string) {
    this.IdCondicion = idcondicion;
  }

  SelTamano(idtamano: string) {
    this.IdTamano = idtamano;
  }

  SelDepa(iddepa: string) {
    this.IdDepartamento = iddepa;
    this.CargarCiudad(this.IdDepartamento);
  }

  SelCiud(idciudad: string) {
    this.IdCiudad = idciudad;
  }

  CalculaValorTotal() {
    this.ValorTotalOferta = this.ValorOferta * this.Unidades;
  }



  Guardar(ModalRespuesta : any) {
    const datosinsert = {
      CD_PRDCTO: this.IdProducto,
      UND_EMPQUE: '0',
      CD_CNDCION: this.IdCondicion,
      CD_TMNO: this.IdTamano,
      DSCRPCION_PRDCTO: this.DesProducto,
      VR_UNDAD_EMPQUE: this.ValorOferta,
      CD_UNDAD: this.Unidades,
      VR_TOTAL_OFRTA: this.ValorTotalOferta,
      VGNCIA_DESDE: this.Vigencia,
      CD_JRNDA: this.EJornada,
      CD_RGION: this.IdDepartamento,
      CD_MNCPIO: this.IdCiudad,
      UBCCION_PRCLA: this.UbicacionPar,
      COORDENADAS_PRCLA: "12312312 - 43534534",
      USUCODIG: this.IdProductor,
      ID_PRODUCTOR: "0",
      CD_CNSCTVO: "0",
      CRCTRZCION: "0",
      OBS_EDICION: "0",
      IMAGEN1: this.NomImagen1,
      IMAGEN2: this.NomImagen2,
      IMAGEN3: this.NomImagen3,
      IMAGEN4: this.NomImagen4,
      IMAGEN5: this.NomImagen5
    }
    console.log(datosinsert)
    console.log(this.IdEmpaque)
    this.ServiciosOferta.CrearOferta('3', this.IdEmpaque, datosinsert).subscribe(Resultado => {
      this.Respuesta = Resultado.toString();
      this.modalService.dismissAll();
      this.modalService.open(ModalRespuesta, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
    })

  }

  SelEJornada(jornada: string) {
    this.EJornada = jornada;
  }

  Limpiar() {
    this.IdProducto = '0';
    this.IdEmpaque = '0';
    this.IdCondicion = '0';
    this.IdTamano = '0';
    this.DesProducto = '';
    this.ValorOferta = 0;
    this.Unidades = 0;
    this.ValorTotalOferta = 0;
    this.Vigencia = '';
    this.IdDepartamento = '0';
    this.IdCiudad = '0';
    this.UbicacionPar = '';
    this.Imagen1 = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
    this.Imagen2 = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
    this.Imagen3 = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
    this.Imagen4 = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
    this.Imagen5 = '../../../../assets/ImagenesAgroApoya2Admin/SubirImagen.png';
  }

  public CargaImagen(event: any, imagen: string) {
    this.ImagenCargada = imagen;
    this.file = event.target.files[0];
    console.log(event.target.files[0])
    this.ServiciosOferta.postFileImagen(event.target.files[0]).subscribe(
      response => {
        this.respuestaImagenEnviada = response;
        console.log(this.respuestaImagenEnviada);
        if (this.respuestaImagenEnviada <= 1) {
          console.log("Error en el servidor");
        } else {
          //console.log("Entra A Enviar");
          if (this.respuestaImagenEnviada == 'Archivo Subido Correctamente') {
            if (this.ImagenCargada == '1') {
              this.Imagen1 = this.RutaImagenes + event.target.files[0].name;
              this.NomImagen1 = event.target.files[0].name;
            }
            if (this.ImagenCargada == '2') {
              this.Imagen2 = this.RutaImagenes + event.target.files[0].name;
              this.NomImagen2 = event.target.files[0].name;
            }
            if (this.ImagenCargada == '3') {
              this.Imagen3 = this.RutaImagenes + event.target.files[0].name;
              this.NomImagen3 = event.target.files[0].name;
            }
            if (this.ImagenCargada == '4') {
              this.Imagen4 = this.RutaImagenes + event.target.files[0].name;
              this.NomImagen4 = event.target.files[0].name;
            }
            if (this.ImagenCargada == '5') {
              this.Imagen5 = this.RutaImagenes + event.target.files[0].name;
              this.NomImagen5 = event.target.files[0].name;
            }
          } else {
            this.resultadoCarga = 2;
            // console.log(this.resultadoCarga);
          }

        }
      },
      error => {

      }
    );
  }

}
