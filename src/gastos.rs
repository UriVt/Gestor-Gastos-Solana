use anchor_lang::prelude::*;

declare_id!("9hJFGrdLUzRt9nDnFSWzHgh9DqAhtMwQ5sLFv6CZjdkZ");

#[program]
pub mod budget_tracker {
    use super::*;

    pub fn inicializar_wallet(ctx: Context<NuevaWallet>, nombre: String) -> Result<()> {
        ctx.accounts.wallet_cuenta.set_inner(BudgetWallet {
            owner: ctx.accounts.owner.key(),
            nombre_usuario: nombre,
            gastos: Vec::new(),
        });
        Ok(())
    }

    pub fn agregar_gasto(ctx: Context<GestionarGasto>, monto: u64, categoria: String, descripcion: String) -> Result<()> {
        let nuevo = Gasto { monto, categoria, descripcion, fecha: Clock::get()?.unix_timestamp };
        ctx.accounts.wallet_cuenta.gastos.push(nuevo);
        Ok(())
    }

    pub fn editar_gasto(ctx: Context<GestionarGasto>, descripcion: String, nuevo_monto: u64) -> Result<()> {
        let gastos = &mut ctx.accounts.wallet_cuenta.gastos;
        if let Some(gasto) = gastos.iter_mut().find(|g| g.descripcion == descripcion) {
            gasto.monto = nuevo_monto;
            return Ok(());
        }
        Err(Errores::GastoNoEncontrado.into())
    }

    pub fn eliminar_gasto(ctx: Context<GestionarGasto>, descripcion: String) -> Result<()> {
        let gastos = &mut ctx.accounts.wallet_cuenta.gastos;
        gastos.retain(|g| g.descripcion != descripcion);
        Ok(())
    }

    // INSTRUCCIÓN DE LECTURA (Read)
    pub fn ver_gastos(ctx: Context<GestionarGasto>) -> Result<()> {
        let gastos = &ctx.accounts.wallet_cuenta.gastos;
        msg!("Historial de gastos para {}: {:#?}", ctx.accounts.wallet_cuenta.nombre_usuario, gastos);
        Ok(())
    }
}

#[error_code]
pub enum Errores {
    #[msg("No eres el dueño.")] NoEresElOwner,
    #[msg("Gasto no encontrado.")] GastoNoEncontrado,
}

#[account]
#[derive(InitSpace)]
pub struct BudgetWallet {
    pub owner: Pubkey,
    #[max_len(20)] pub nombre_usuario: String,
    #[max_len(10)] pub gastos: Vec<Gasto>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct Gasto {
    pub monto: u64,
    #[max_len(20)] pub categoria: String,
    #[max_len(20)] pub descripcion: String,
    pub fecha: i64,
}

#[derive(Accounts)]
pub struct NuevaWallet<'info> {
    #[account(mut)] pub owner: Signer<'info>,
    #[account(init, payer = owner, space = 8 + BudgetWallet::INIT_SPACE, seeds = [b"budget", owner.key().as_ref()], bump)]
    pub wallet_cuenta: Account<'info, BudgetWallet>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GestionarGasto<'info> {
    pub owner: Signer<'info>,
    #[account(mut)] pub wallet_cuenta: Account<'info, BudgetWallet>,
}