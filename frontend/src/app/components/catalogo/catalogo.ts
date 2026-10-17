import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productos = signal<Producto[]>([]);
  cargando = signal(false);
  error = signal('');
  criterio = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.criterio = q;
        this.buscarPorCriterio(q);
      } else {
        this.cargarProductos();
      }
    });
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set('');
    this.productoService.listar().subscribe({
      next: datos => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: err => {
        const msg = err.status === 0
          ? 'Error de conexión: El backend no está disponible o hay bloqueo CORS.'
          : `Error HTTP ${err.status}: ${err.statusText || 'No se pudo cargar los productos'}`;
        this.error.set(msg);
        this.cargando.set(false);
      }
    });
  }

  buscar(): void {
    const texto = this.criterio.trim();
    this.router.navigate(['/productos'], {
      queryParams: { q: texto || null }
    });
    if (!texto) {
      this.cargarProductos();
    } else {
      this.buscarPorCriterio(texto);
    }
  }

  private buscarPorCriterio(texto: string): void {
    this.cargando.set(true);
    this.error.set('');
    this.productoService.buscarPorNombre(texto).subscribe({
      next: datos => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(`Error al buscar: HTTP ${err.status}`);
        this.cargando.set(false);
      }
    });
  }

  limpiarBusqueda(): void {
    this.criterio = '';
    this.router.navigate(['/productos'], { queryParams: {} });
    this.cargarProductos();
  }

  eliminar(id?: number): void {
    if (!id || !confirm('¿Desea eliminar este producto de la base de datos?')) return;
    this.cargando.set(true);
    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: err => {
        this.error.set(`Error al eliminar: HTTP ${err.status}`);
        this.cargando.set(false);
      }
    });
  }
}
