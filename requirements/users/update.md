### Alterar o cadastro de um usuario

⛔ Deve retornar 400 se o id não for fornecido
⛔ Deve retornar 400 se um email inválido for fornecido
⛔ Deve retornar 400 se email fornecido já estiver em uso
⛔ Deve criptografar a senha do usuário
⛔ Deve salvar corretamente as permissões do usuário
⛔ Deve retornar 200 com o token de acesso do usuario
⛔ Deve retornar 500 em caso de erro


### Input esperado
{
    id: string (via params)
    name: string
    email: string
    password: string
    permissions: number []
}

✅⛔