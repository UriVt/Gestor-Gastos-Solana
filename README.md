# Gestor-Gastos-Solana
# Student Budget Tracker - Solana Program

## 1. Descripción del Proyecto
Este proyecto es una aplicación de gestión de presupuesto personal (DApp) construida sobre la blockchain de Solana utilizando el framework **Anchor**. El programa permite a los estudiantes llevar un registro inmutable y seguro de sus gastos académicos y personales, asegurando que solo el dueño de la cartera pueda gestionar su información.

### Características Principales:
* **Seguridad por PDA:** Utiliza Program Derived Addresses (PDA) para almacenar los datos, garantizando que cada usuario tenga un espacio único basado en su llave pública.
* **CRUD Completo:** Permite Inicializar una wallet, Agregar gastos, Editar montos, Eliminar registros y Visualizar el historial.
* **Cálculo On-Chain:** Gestión de montos mediante tipos de datos `u64` para precisión financiera.

---

## 2. Estructura del Programa (Backend - Rust)

El programa se divide en instrucciones clave dentro del archivo `lib.rs`:

* **inicializar_wallet**: Crea la cuenta de almacenamiento en la blockchain y asigna el nombre del usuario.
* **agregar_gasto**: Empuja un nuevo objeto `Gasto` al vector de la cuenta.
* **editar_gasto**: Busca un gasto por su descripción y permite actualizar el monto (útil para ajustes de presupuesto).
* **eliminar_gasto**: Limpia el historial eliminando registros específicos mediante la función `.retain()`.
* **ver_gastos**: Genera logs en la blockchain para auditoría de transacciones.

---

## 3. Instrucciones de Uso

El archivo `client.ts` actúa como el panel de control del usuario. Se ha diseñado una sección de **CONFIGURACIÓN** al inicio para facilitar su uso sin modificar la lógica interna:

### Cómo operar el script:
1.  **Configurar Variables**: Al inicio del archivo, define qué quieres hacer:
    * `descripcionAgregar`: Escribe el nombre del gasto para crear uno nuevo.
    * `descripcionEditar`: Escribe el nombre de un gasto existente para cambiar su precio.
    * `descripcionEliminar`: Escribe el nombre del gasto que deseas borrar.
    * *Nota: Dejar cualquier campo en blanco `""` hará que el script ignore esa acción.*

2.  **Ejecución**:
    * En la terminal de Solana Playground, ejecuta el comando: `run`.
    * El script detectará automáticamente si necesitas inicializar tu cuenta antes de proceder.

3.  **Lectura de Resultados**:
    * El programa mostrará una tabla alineada en la consola con el historial completo.
    * **Total Acumulado**: El cliente calcula automáticamente la suma de todos los gastos registrados en la blockchain y la muestra al final.

---

## 4. Detalles Técnicos

* **Program ID**: `9hJFGrdLUzRt9nDnFSWzHgh9DqAhtMwQ5sLFv6CZjdkZ`
* **Semillas (Seeds)**: `[b"budget", wallet_pubkey]`
* **Límites de Almacenamiento**: El programa está optimizado para almacenar hasta 10 gastos simultáneos por usuario para gestionar eficientemente el espacio de renta en Solana.
* **Framework**: Anchor 0.30.1
* **Lenguajes**: Rust (Smart Contract) y TypeScript (Client/Tests).

---

## 5. Autor
**Uriel Velázquez Tovar** Estudiante de Ingeniería en Desarrollo y Gestión de Software.  
*Universidad Tecnológica del Valle de Toluca (UTVT)*
