# Sistema de Venta de Billetes de Lotería - Frontend Angular

Frontend desarrollado en Angular para el sistema de venta de billetes de lotería de **Konex Innovation**.

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend ejecutándose en `http://localhost:8080/api`

## Instalación

```bash
# Instalar dependencias
npm install
```

## Configuración

El backend ya está configurado en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Si necesitas cambiar la URL del backend, modifica este archivo.

## Ejecutar la aplicación

```bash
# Modo desarrollo
npm start

# O con ng serve
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

## Estructura del Proyecto

```
lottery-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/          # Interfaces TypeScript
│   │   │   └── services/        # Servicios HTTP
│   │   ├── features/
│   │   │   ├── dashboard/       # Vista principal con estadísticas
│   │   │   ├── sorteos/         # Gestión de sorteos
│   │   │   ├── clientes/        # Gestión de clientes
│   │   │   └── billetes/        # VENTA DE BILLETES (principal)
│   │   └── layout/
│   │       └── navbar/          # Barra de navegación
│   └── environments/            # Configuración de entornos
```

## Componentes Principales

### 1. Dashboard
- Vista general con estadísticas
- Total de sorteos, clientes y billetes
- Accesos rápidos a funcionalidades

### 2. Sorteos
- Lista de sorteos disponibles
- Información de billetes disponibles y vendidos
- Estados visuales (Disponible, Últimos billetes, Agotado)

### 3. Clientes
- Lista de todos los clientes
- Historial de compras por cliente
- Información de contacto

### 4. Billetes - VENTA
**Flujo de venta paso a paso:**
1. Seleccionar sorteo
2. Ver y seleccionar billete disponible
3. Seleccionar cliente
4. Confirmar venta

**Características:**
- Grid visual de billetes disponibles
- Selección interactiva con feedback visual
- Validación de datos
- Notificaciones toast de éxito/error
- Manejo de errores (billete ya vendido, etc.)

## Conexión con el Backend

### Endpoints utilizados:

**Sorteos:**
- `GET /api/sorteos` - Listar sorteos
- `GET /api/sorteos/{id}` - Obtener sorteo por ID

**Clientes:**
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/{id}` - Obtener cliente por ID

**Billetes:**
- `GET /api/billetes` - Listar todos los billetes
- `GET /api/billetes/sorteo/{id}/disponibles` - Billetes disponibles de un sorteo
- `POST /api/billetes/vender` - Vender billete (endpoint principal)

## Tecnologías Utilizadas

- **Angular 19+** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje tipado
- **ngx-toastr** - Notificaciones toast
- **SCSS** - Estilos

## Manejo de Errores

El sistema maneja automáticamente:
- Errores de conexión con el backend
- Validaciones de formularios
- Billetes ya vendidos (409 Conflict)
- Errores del servidor (500)

Todos los errores se muestran al usuario mediante notificaciones toast.

## Características Destacadas

**Arquitectura Modular** - Separación clara de responsabilidades
**Componentes Standalone** - Sin módulos, más modernos
**Reactive Forms** - Validación robusta
**Material Design** - UI profesional y consistente
**Responsive Design** - Adaptable a diferentes pantallas
**Real-time Updates** - Actualización automática de datos
**Error Handling** - Manejo completo de errores
**Loading States** - Feedback visual durante operaciones

## Datos Precargados (Backend)

El backend viene con datos de prueba:
- **4 Sorteos** con diferentes fechas y cantidades de billetes
- **5 Clientes** registrados

## Notas Importantes

1. Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend
2. El CORS ya está configurado en el backend para `localhost:4200`
4. Las notificaciones toast aparecen automáticamente en la esquina superior derecha

## Estructura de Servicios

Todos los servicios están en `src/app/core/services/`:

- **SorteoService** - Gestión de sorteos
- **ClienteService** - Gestión de clientes
- **BilleteService** - Gestión de billetes y ventas

## Flujo de Venta Completo

1. Usuario accede a la sección "Billetes"
2. Selecciona un sorteo del dropdown
3. Sistema carga billetes disponibles (GET `/api/billetes/sorteo/{id}/disponibles`)
4. Usuario selecciona un billete del grid visual
5. Usuario selecciona un cliente del dropdown
6. Usuario confirma la venta
7. Sistema llama a POST `/api/billetes/vender`
8. Si exitoso: Muestra notificación de éxito y recarga billetes
9. Si falla: Muestra error específico (ej: "Billete ya vendido")

---
