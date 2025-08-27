use anchor_lang::prelude::*;

declare_id!("EGTLKvCHNE2MEJSSM1iYbZXirc1EjrT471qGJbaBm7jc");

#[program]
pub mod note_fi {
    use super::*;

    pub fn create_note(ctx: Context<CreateNote>, title: String, content: String) -> Result<()> {
        let note = &mut ctx.accounts.note;
        let clock = Clock::get()?;
        require!(title.len() <= 100, NotesError::TitleTooLong);
        require!(content.len() <= 100, NotesError::ContentTooLong);
        require!(!title.trim().is_empty(), NotesError::TitleEmpty);
        require!(!content.trim().is_empty(), NotesError::ContentEmpty);

        note.author = ctx.accounts.author.key();
        note.title = title.clone();
        note.content = content.clone();
        note.created_at = clock.unix_timestamp;
        note.last_updated = clock.unix_timestamp;

        msg!(
            "Note created! Title: {}, Author: {}, Create at: {}",
            note.title,
            note.author,
            note.created_at,
        );

        Ok(())
    }

    pub fn update_note(ctx: Context<UpdateNote>, content: String) -> Result<()> {
        let note = &mut ctx.accounts.note;
        let clock = Clock::get()?;

        require!(note.author == ctx.accounts.author.key(), NotesError::Unauthorized);
        require!(content.len() <= 1000, NotesError::ContentTooLong);
        require!(!content.trim().is_empty(), NotesError::ContentEmpty);

        note.content = content.clone();
        note.last_updated = clock.unix_timestamp;

        msg!("Note {} update!", note.title);
        Ok(())
    }

    pub fn delete_note(ctx: Context<DeleteNote>) -> Result<()> {
        let note = &ctx.accounts.note;

        require!(note.author == ctx.accounts.author.key(), NotesError::Unauthorized);

        msg!("Note {} deleted!", note.title);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateNote<'info> {
    #[account(
        init,
        payer= author,
        space = 8 + Note::INIT_SPACE,
        seeds = [b"note", author.key().as_ref(), title.as_bytes()],
        bump,
    )]
    pub note: Account<'info, Note>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateNote<'info> {
    #[account(
        mut,
        seeds = [b"note", author.key().as_ref(), note.title.as_bytes()],
        bump,
    )]
    pub note: Account<'info, Note>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteNote<'info> {
     #[account(
        mut,
        seeds = [b"note", author.key().as_ref(), note.title.as_bytes()],
        bump,
        close = author,
    )]
    pub note: Account<'info, Note>,

    #[account(mut)]
    pub author: Signer<'info>
}

#[account]
#[derive(InitSpace)]
pub struct Note {
    pub author: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(100)]
    pub content: String,
    pub created_at: i64,
    pub last_updated: i64,
}

#[error_code]
pub enum NotesError {
    #[msg("Title can not be larger then 100 chars")]
    TitleTooLong,
    #[msg("Content can not be larger then 100 chars")]
    ContentTooLong,
    #[msg("Title can not be empty")]
    TitleEmpty,
    #[msg("Content can not be empty")]
    ContentEmpty,
    #[msg("Unauthorized")]
    Unauthorized,
}
