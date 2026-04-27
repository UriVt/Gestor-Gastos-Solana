async function interactuarConBudget() {

  // CONFIGURACIÓN: Cambia los datos aquí

  const nombreUsuario = "Uriel"; 

  //Si dejas vacio la descripcion en cualquiera de las funciones no haces ningun cambio

  // Para AGREGAR:
  const descripcionAgregar = "Camion Vuelta"; 
  const montoAgregar = 14;
  const categoriaAgregar = "Transporte";

  // Para EDITAR:
  const descripcionEditar = ""; 
  const nuevoMonto = 120;

  // Para ELIMINAR:
  const descripcionEliminar = ""; 
  // ========================================================

  console.log("Iniciando interacción con Budget Tracker...");

  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("budget"), pg.wallet.publicKey.toBuffer()],
    pg.program.programId
  );

  try {
    // 1. Verificar o Inicializar
    try {
      const cuenta = await pg.program.account.budgetWallet.fetch(pda);
      console.log("Cuenta encontrada. Usuario:", cuenta.nombreUsuario);
    } catch (e) {
      console.log("La cuenta no existe. Inicializando para:", nombreUsuario);
      const txInit = await pg.program.methods
        .inicializarWallet(nombreUsuario)
        .accounts({ walletCuenta: pda, owner: pg.wallet.publicKey, systemProgram: web3.SystemProgram.programId })
        .rpc();
      await pg.connection.confirmTransaction(txInit);
    }

    // 2. Lógica para AGREGAR
    if (descripcionAgregar !== "") {
      console.log(`Registrando gasto: ${descripcionAgregar}...`);
      const txAdd = await pg.program.methods
        .agregarGasto(new BN(montoAgregar), categoriaAgregar, descripcionAgregar)
        .accounts({ walletCuenta: pda, owner: pg.wallet.publicKey })
        .rpc();
      await pg.connection.confirmTransaction(txAdd);
      console.log("Gasto agregado con éxito.");
    }

    // 3. Lógica para EDITAR
    if (descripcionEditar !== "") {
      console.log(`Editando monto de: ${descripcionEditar}...`);
      const txEdit = await pg.program.methods
        .editarGasto(descripcionEditar, new BN(nuevoMonto))
        .accounts({ walletCuenta: pda, owner: pg.wallet.publicKey })
        .rpc();
      await pg.connection.confirmTransaction(txEdit);
      console.log("Edición confirmada.");
    }

    // 4. Lógica para ELIMINAR
    if (descripcionEliminar !== "") {
      console.log(`Eliminando todos los registros de: ${descripcionEliminar}...`);
      const txDel = await pg.program.methods
        .eliminarGasto(descripcionEliminar)
        .accounts({ walletCuenta: pda, owner: pg.wallet.publicKey })
        .rpc();
      await pg.connection.confirmTransaction(txDel);
      console.log("Eliminación completada.");
    }

    // 5. Resumen Final con Cálculo de Total
    const cuentaFinal = await pg.program.account.budgetWallet.fetch(pda);
    console.log("\n--- HISTORIAL DE GASTOS ---");
    
    if (cuentaFinal.gastos.length === 0) {
      console.log("No hay gastos registrados.");
    } else {
      let totalSuma = new BN(0); // Iniciamos el acumulador en 0

      cuentaFinal.gastos.forEach((g, i) => {
        // Sumamos el monto actual al total
        totalSuma = totalSuma.add(g.monto);
        
        console.log(`${i + 1}. ${g.descripcion.padEnd(15)} | $${g.monto.toString().padEnd(6)} | [${g.categoria}]`);
      });

      console.log("-------------------------------------------");
      console.log(`TOTAL ACUMULADO: $${totalSuma.toString()}`);
      console.log("-------------------------------------------");
    }

  } catch (err) {
    console.error("Error en la ejecución:", err.message);
  }
}

interactuarConBudget();