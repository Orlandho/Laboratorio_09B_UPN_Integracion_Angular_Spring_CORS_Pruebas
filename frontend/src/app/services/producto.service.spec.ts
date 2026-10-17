import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list products via GET /api/productos', () => {
    const mockData: Producto[] = [
      { id: 1, nombre: 'Teclado Mecanico', precio: 120, stock: 10 }
    ];

    service.listar().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].nombre).toBe('Teclado Mecanico');
    });

    const req = httpTesting.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should create a product via POST /api/productos', () => {
    const nuevo: Producto = { nombre: 'Mouse Gamer', precio: 65, stock: 5 };
    const creado: Producto = { ...nuevo, id: 2 };

    service.registrar(nuevo).subscribe(res => {
      expect(res.id).toBe(2);
    });

    const req = httpTesting.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevo);
    req.flush(creado);
  });
});
