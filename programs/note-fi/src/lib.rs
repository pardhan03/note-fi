use anchor_lang::prelude::*;

declare_id!("FLWfWd44uNN8ZUEw2Xw9e7xt5NmAW7o7S33C2KAMUZE7");

#[program]
pub mod note_fi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
