"use client"
import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
const PROGRAM_ID =  new PublicKey("EGTLKvCHNE2MEJSSM1iYbZXirc1EjrT471qGJbaBm7jc");

const IDL = {
  "address": "FLWfWd44uNN8ZUEw2Xw9e7xt5NmAW7o7S33C2KAMUZE7",
  "metadata": {
    "name": "note_fi",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "create_note",
      "discriminator": [
        103,
        2,
        208,
        242,
        86,
        156,
        151,
        107
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "author"
              },
              {
                "kind": "arg",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "delete_note",
      "discriminator": [
        182,
        211,
        115,
        229,
        163,
        88,
        108,
        217
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "author"
              },
              {
                "kind": "account",
                "path": "note.title",
                "account": "Note"
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "update_note",
      "discriminator": [
        103,
        129,
        251,
        34,
        33,
        154,
        210,
        148
      ],
      "accounts": [
        {
          "name": "note",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "author"
              },
              {
                "kind": "account",
                "path": "note.title",
                "account": "Note"
              }
            ]
          }
        },
        {
          "name": "author",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Note",
      "discriminator": [
        203,
        75,
        252,
        196,
        81,
        210,
        122,
        126
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "Title can not be larger then 100 chars"
    },
    {
      "code": 6001,
      "name": "ContentTooLong",
      "msg": "Content can not be larger then 100 chars"
    },
    {
      "code": 6002,
      "name": "TitleEmpty",
      "msg": "Title can not be empty"
    },
    {
      "code": 6003,
      "name": "ContentEmpty",
      "msg": "Content can not be empty"
    },
    {
      "code": 6004,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ],
  "types": [
    {
      "name": "Note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "created_at",
            "type": "i64"
          },
          {
            "name": "last_updated",
            "type": "i64"
          }
        ]
      }
    }
  ]
}

export default function Home() {

  const[notes, setNotes] = useState<any>([]);
  const[loading, setLoading] = useState<boolean>(false);
  const[message, setMessage] = useState("");
  const[title, setTitle] = useState("");
  const[content, setContent] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = () => {
    if(!wallet.publicKey || !wallet.signTransaction) {
      return null;
    }

    const provider =  new AnchorProvider(connection, wallet as any, {});
    return new Program(IDL as any, PROGRAM_ID, provider);
  };

  const loadNotes = () => {
    if(!wallet.publicKey) {
      return;
    };
    setLoading(true);
    try {
      const program = getProgram();
      const notes = program?.account?.note?.all([
        {
          memcmp: {
            offset: 8,
            bytes: wallet.publicKey.toBase58(),
          }
        }
      ]);
      setNotes(notes);
      setMessage("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Error loading the notes");
      console.log(error);
    }
  }

  const createNote = async () => {
    if(!title.trim() || !content.trim()){
      setMessage("Please fill the title and content!");
      return;
    }

    if(title.length > 100) {
      setMessage("Title too long (MAX length: 100 chars");
      return;
    }

    if(title.length > 100) {
      setMessage("Content too long (MAX length: 100 chars");
      return;
    }

    setLoading(true);
    try {
      const program = getProgram();
      if(!program) {
        return;
      }
    } catch (error) {
      
    }
  }

  return (
    <div>
      <p>Hello world program!</p>
    </div>
  );
}
