import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.scss'
})
export class ProductoForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  id?: number;
  editando = false;
  guardando = signal(false);
  mensaje = signal('');
  error = signal('');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const valor = this.route.snapshot.paramMap.get('id');
    if (valor) {
      this.id = Number(valor);
      this.editando = true;
      this.guardando.set(true);
      this.productoService.buscarPorId(this.id).subscribe({
        next: (p: Producto) => {
          this.form.patchValue({
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock
          });
          this.guardando.set(false);
        },
        error: err => {
          this.error.set(`No se pudo cargar el producto. HTTP ${err.status}`);
          this.guardando.set(false);
        }
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set('Por favor complete los campos requeridos correctamente.');
      return;
    }

    const producto = this.form.getRawValue();
    this.guardando.set(true);
    this.mensaje.set('');
    this.error.set('');

    const peticion = this.editando && this.id
      ? this.productoService.actualizar(this.id, producto)
      : this.productoService.registrar(producto);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/productos']);
      },
      error: err => {
        this.error.set(`Error al guardar en el servidor: HTTP ${err.status}`);
        this.guardando.set(false);
      }
    });
  }
}
