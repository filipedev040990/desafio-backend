### Realizar o cadastro de um usuario

✅ Deve retornar 400 se algum campo obrigatório não for fornecido
✅ Deve retornar 400 se senha e confirmação de senha não forem iguais
✅ Deve retornar 400 se um email inválido for fornecido
✅ Deve retornar 400 se email fornecido já estiver em uso
⛔ Deve retornar 400 se uma permissão inválida for informada
✅ Deve criptografar a senha do usuário
✅ Deve gerar um token de acesso
✅ Deve salvar corretamente as permissões do usuário
✅ Deve retornar 200 com o id do usuario
✅ Deve retornar 500 em caso de erro

### Input esperado
{
    name: string
    email: string
    password: string
    password_confirmation: string
    permissions: number []
}

✅⛔