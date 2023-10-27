# Cadastrar um novo cliente

> ## Caso de sucesso

1. ⛔ Criptografa a senha do cliente
2. ⛔ Salva os dados do cliente
3. ⛔ Retorna status 201 com id do cliente

> ## Exceções
1. ⛔ Retorna 400 se o nome do cliente não for fornecido
2. ⛔ Retorna 400 se o email do cliente não for fornecido
3. ⛔ Retorna 400 se o cpf do cliente não for fornecido
4. ⛔ Retorna 400 se a senha do cliente não for fornecida
5. ⛔ Retorna 500 se houver alguma falha na hora de salvar os dados


## Objeto Client
{
  	id: string
    name: string
    email: string
    password: string
    cpf: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}

✅
⛔