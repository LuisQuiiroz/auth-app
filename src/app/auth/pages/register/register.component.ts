import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {


  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  miFormulario: FormGroup = this.fb.group({
    name: [ 'test10', [Validators.required, Validators.minLength(3)] ],
    email: [ 'test10@test.com', [Validators.required, Validators.pattern( this.emailPattern )] ],
    password: [ '123456', [Validators.required, Validators.minLength(6)] ]
  });

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService) { }

  ngOnInit(): void {
  }

  registro() {
    // console.log(this.miFormulario.value);
    // console.log(this.miFormulario.valid);

    const { name, email, password } = this.miFormulario.value;

    this.authService.registro( name, email, password )
        .subscribe( ok => {
          // console.log(ok);
          if ( ok === true ) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cuenta creada correctamente',
              showConfirmButton: false,
              timer: 1500
            })
            this.router.navigateByUrl('/dashboard');
            
          } else {
          Swal.fire('Error', ok, 'error')
          }
          
        });

  }

}
