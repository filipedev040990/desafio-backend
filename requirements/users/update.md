### Alterar o cadastro de um usuario

✅ Deve retornar 400 se o id não for fornecido
✅ Deve retornar 400 se um email for fornecido e for inválido
✅ Deve retornar 400 se um email for fornecido e já estiver em uso
✅ Deve criptografar a senha do usuárion se for fornecida
⛔ Deve retornar 400 se uma permissão inválida for informada
✅ Deve atualizar corretamente as permissões do usuário se forem fornecidas
✅ Deve retornar erro se tentar atualizar um usuario diferente do próprio se não tiver permissão pra isso
✅ Deve retornar 500 em caso de erro


### Input esperado
{
    id: string (via params)
    name: string
    email: string
    password: string
    permissions: number []
}

✅⛔