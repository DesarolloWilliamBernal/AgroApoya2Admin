import { Component, OnInit } from '@angular/core';
import { EvalsatisfaccionService } from 'src/app/core/evalsatisfaccion.service';

@Component({
  selector: 'app-evaluacionoferta',
  templateUrl: './evaluacionoferta.component.html',
  styleUrls: ['./evaluacionoferta.component.css']
})
export class EvaluacionofertaComponent implements OnInit {
  DataOfertas: any = [];
  NOferta: string;
  keyword: string;
  CodEva: string;
  TPregunta: string;
  Sessionoferta: any;
  SNOferta: any;
  SCOferta: any;
  DataTipoPreguntas: any;
  keywordPre: string;
  SessionTipoPre: any;
  TituloForm: string = '';
  RespuestasForm: string = '';
  PreguntasOferta: any[];
  SessionSectorOferta: any;
  ValidaConsulta: string;
  ValidaTipo: boolean = true;
  ValidaAdministra: string;
  DataTEvaluacion: any = [];
  keywordE: string = 'nombre';
  ValidaNomFil: boolean = true;
  ValidaDetalle: string;

  constructor(private evaluacionservices: EvalsatisfaccionService) { }

  ngOnInit(): void {
    this.DataTEvaluacion = [
      {
        "id": "1",
        "nombre": "Por defecto"
      },
      {
        "id": "2",
        "nombre": "Post compra"
      }
    ]
    const input = document.getElementById('EvaDefect') as HTMLInputElement;
    if (input != null) {
      input.checked = true;
      this.OperaOpcion('0');
    }
    this.ConsultaOfertas();
    this.ConsultaTipoPreguntas();
  }

  ConsultaTipoPreguntas() {
    this.evaluacionservices.ConsultaTipoPreguntas('1').subscribe(ResultCons => {
      //console.log(ResultCons)
      this.DataTipoPreguntas = ResultCons;
      this.keywordPre = 'NombrePregunta';
    })
  }

  OperaOpcion(opcion: string) {
    this.Limpiar();
    switch (opcion) {
      case '0':
        this.ValidaAdministra = '0';
        break;
      case '1':
        this.ValidaAdministra = '1';
        break;
    }
    this.ConsultaPreguntasOferta();
  }

  ConsultaOfertas() {
    this.evaluacionservices.ConsultaOfertas('4', '0', '0', '0').subscribe(Resultado => {
      console.log(Resultado)
      this.DataOfertas = Resultado;
      this.keyword = 'Producto';
    })
  }

  Limpiar() {
    this.ValidaDetalle = '0';
    this.NOferta = '';
    this.CodEva = '';
    this.TPregunta = '';
    this.SNOferta = '';
    this.SCOferta = '';
    this.Sessionoferta = '';
    this.SessionSectorOferta = '';
  }


  selectNomOferta(oferta: any) {
    //console.log(oferta);
    this.SNOferta = oferta.Producto + ' - ' + oferta.DesSector;
    this.SCOferta = oferta.cd_cnsctvo;
    this.Sessionoferta = oferta.cd_cnsctvo;
    this.SessionSectorOferta = oferta.IdSector;
    this.ValidaNomFil = false;
    this.ValidaDetalle = '1';
    this.ConsultaPreguntasOferta();

  }

  selectTipoEvaluacion(oferta: any) {

  }

  ConsultaPreguntasOferta() {
    if (this.ValidaAdministra == '0') {
      const BodyConsulta = {
        CD_CNSCTVO: "0",
        ID_SCTOR_OFRTA: "0",
        ID_PRGNTA_OFR: 0
      }
      console.log(BodyConsulta)
      this.evaluacionservices.ConsultaPreguntasOferta('2', BodyConsulta).subscribe(ResultConst => {
        console.log(ResultConst)
        if (ResultConst.length > 0) {
          this.PreguntasOferta = ResultConst;
          this.ValidaConsulta = '1';
        }
        else {
          this.ValidaConsulta = '0';
          this.PreguntasOferta = [];
        }
      })
    }
    else {
      const BodyConsulta = {
        CD_CNSCTVO: this.Sessionoferta,
        ID_SCTOR_OFRTA: this.SessionSectorOferta,
        ID_PRGNTA_OFR: 0
      }
      this.evaluacionservices.ConsultaPreguntasOferta('1', BodyConsulta).subscribe(ResultConst => {
        console.log(ResultConst)
        if (ResultConst.length > 0) {
          this.PreguntasOferta = ResultConst;
          this.ValidaConsulta = '1';
        }
        else {
          this.ValidaConsulta = '0';
          this.PreguntasOferta = [];
        }
      })
    }
  }

  AgregaPregunta() {
    var BodyInsert: any;
    if (this.ValidaAdministra == '0') {
      //Registra pregunta para evaluacion por defecto
      BodyInsert = {
        ID_PRGNTA_OFR: "0",
        CD_CNSCTVO: "00",
        ID_SCTOR_OFRTA: "00",
        CD_TPO_PRGNTA: this.SessionTipoPre,
        TTLO_PRGNTA: this.TituloForm,
        OPCIONES_PRGNTA: this.RespuestasForm,
        ORIGEN: 2
      }
    }
    else if (this.ValidaAdministra == '1') {
      //Registra pregunta para evaluacion de oferta
      BodyInsert = {
        ID_PRGNTA_OFR: "0",
        CD_CNSCTVO: this.Sessionoferta,
        ID_SCTOR_OFRTA: this.SessionSectorOferta,
        CD_TPO_PRGNTA: this.SessionTipoPre,
        TTLO_PRGNTA: this.TituloForm,
        OPCIONES_PRGNTA: this.RespuestasForm,
        ORIGEN: 1
      }
    }
    console.log(BodyInsert)
    this.evaluacionservices.ModificacionPregunta('3', BodyInsert).subscribe(ResultInsert => {
      console.log(ResultInsert)
      this.ConsultaPreguntasOferta();
      this.LimpiaTipopre();
    })
  }

  EliminaPregunta(pregunta: any) {
    if (this.ValidaAdministra == '0') {
      //bandera 4, origen 2, cnsctvo sector 0
      const BodyDelete = {
        ID_PRGNTA_OFR: pregunta.ID_PRGNTA_OFR,
        CD_CNSCTVO: "0",
        ID_SCTOR_OFRTA: "0",
        CD_TPO_PRGNTA: pregunta.CD_TPO_PRGNTA,
        TTLO_PRGNTA: pregunta.TITULO_PREGUNTA_OFR,
        OPCIONES_PRGNTA: pregunta.opciones_seleccion,
        ORIGEN: 2
      }
      console.log(BodyDelete)
      this.evaluacionservices.ModificacionPregunta('4', BodyDelete).subscribe(ResultInsert => {
        console.log(ResultInsert)
        this.ConsultaPreguntasOferta();
      })
    }
    else if (this.ValidaAdministra == '1') {
      const BodyDelete = {
        ID_PRGNTA_OFR: pregunta.ID_PRGNTA_OFR,
        CD_CNSCTVO: pregunta.CD_CNSCTVO,
        ID_SCTOR_OFRTA: pregunta.ID_SCTOR_OFRTA,
        CD_TPO_PRGNTA: pregunta.CD_TPO_PRGNTA,
        TTLO_PRGNTA: pregunta.TITULO_PREGUNTA_OFR,
        OPCIONES_PRGNTA: pregunta.opciones_seleccion,
        ORIGEN: 1
      }
      console.log(BodyDelete)
      this.evaluacionservices.ModificacionPregunta('4', BodyDelete).subscribe(ResultInsert => {
        console.log(ResultInsert)
        this.ConsultaPreguntasOferta();
      })
    }
  }

  selectTipoPregunta(pregunta: any) {
    if (pregunta.idPregunta == '3' || pregunta.idPregunta == '1') {
      this.ValidaTipo = true;
    }
    else {
      this.ValidaTipo = false;
    }
    this.SessionTipoPre = pregunta.idPregunta;
    //console.log(pregunta)
  }

  LimpiaTipopre() {
    this.SessionTipoPre = '';
    this.TituloForm = '';
    this.RespuestasForm = '';
    this.TPregunta = '';
  }

}