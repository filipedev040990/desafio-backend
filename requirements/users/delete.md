### Alterar o cadastro de um usuario

⛔ Deve retornar 400 se um id inválido for fornecido
⛔ Deve retornar 204 sem conteudo
⛔ Deve retornar 500 em caso de erro
⛔ Deve retornar erro se não tiver permissão para remover usuários
⛔ Deve retornar erro se tentar remover o próprio usuário


### Input esperado
{
    id: string
}

✅⛔