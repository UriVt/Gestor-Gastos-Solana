describe("tests", () => {
  const program = pg.program;
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("budget"), pg.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("1. Inicializar", async () => {
    try {
      await program.methods.inicializarWallet("Uriel").accounts({
        walletCuenta: pda, owner: pg.wallet.publicKey, systemProgram: web3.SystemProgram.programId
      }).rpc();
    } catch (e) { console.log("La cuenta ya existe"); }
  });

  it("2. Agregar y Leer (Create & Read)", async () => {
    const desc = "GastoFinal";
    await program.methods.agregarGasto(new BN(100), "Cuentas", desc).accounts({
      walletCuenta: pda, owner: pg.wallet.publicKey
    }).rpc();

    // LEER LA CUENTA (Read)
    const cuenta = await program.account.budgetWallet.fetch(pda);
    console.log("Gastos en total:", cuenta.gastos.length);
    console.log("Última categoría:", cuenta.gastos[cuenta.gastos.length - 1].categoria);
  });

  it("3. Editar (Update)", async () => {
    await program.methods.editarGasto("GastoFinal", new BN(200)).accounts({
      walletCuenta: pda, owner: pg.wallet.publicKey
    }).rpc();
    
    const cuenta = await program.account.budgetWallet.fetch(pda);
    console.log("Monto actualizado:", cuenta.gastos.find(g => g.descripcion === "GastoFinal").monto.toString());
  });

  it("4. Eliminar (Delete)", async () => {
    await program.methods.eliminarGasto("GastoFinal").accounts({
      walletCuenta: pda, owner: pg.wallet.publicKey
    }).rpc();
    
    const cuenta = await program.account.budgetWallet.fetch(pda);
    console.log("Gastos tras eliminar:", cuenta.gastos.length);
  });
});