import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    // manda la informacion del usuario
    return { ...this._usuario }; // se desestructura para evitar manipularlo en otro lado de manera accidental. sirve como método de seguridad
  }

  constructor( private http: HttpClient ) { }


  registro( name: string, email: string, password: string ) {
    const url = `${ this.baseUrl }/auth/new`;
    const body = { name, email, password }

    return this.http.post<AuthResponse>( url, body) // si todo sale bien, se añade a la base de datos
        .pipe(
          tap( resp => { // si tenemos una respuesta exitosa se realiza lo siguiente
          // console.log(resp);
          if (resp.ok) {
            localStorage.setItem('token', resp.token!);

            // No es responsabilidad de este funcion hacer esta parte
            // this._usuario = {
            //   uid: resp.uid!,
            //   name: resp.name!,
            //   email: resp.email!
            // }
          }
          }),
          map( resp => resp.ok),// manda true
          catchError( err => of(err.error.msg))// manda false
        );

  }


  login( email: string, password: string) {
    const url = `${ this.baseUrl }/auth`;
    const body = { email, password }

    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( resp => {
          // console.log(resp);
          if (resp.ok) {
            localStorage.setItem('token', resp.token! );
            // this._usuario = {
            //   uid: resp.uid!,
            //   name: resp.name!,
            //   email: resp.email!
            // }
            // console.log(this._usuario.email);

          }
        }),
        map( resp => resp.ok),
        // catchError( err => of(false)) // of() retorna un observable
        catchError( err => of(err.error.msg)) // of() retorna un observable
      );
    // retorna un observable
  }




  // true: el token es valido
  // false el token es invalido
  validarToken(): Observable<boolean>{

    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');
      // Obtiene el token guardado, si no hay, se manda una cadena vacia

    return this.http.get<AuthResponse>( url, { headers } )
        .pipe(
          map( resp => { // solo se ejecuta si viene correctamente la informacion

            // true, token correcto
            localStorage.setItem('token', resp.token! ); // se establece el nuevo token generado por el backend
            this._usuario = {
              uid: resp.uid!,
              name: resp.name!,
              email: resp.email!
            }

            return resp.ok; 
          }),
          catchError(err => of(false)) // false, token incorrecto
        );
  }



  logout(){
    localStorage.clear();
  }
}
