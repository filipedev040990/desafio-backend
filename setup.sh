echo "Instalando as dependências do projeto ..."
npm install

echo "Dependências instaladas!"

echo "Configurando husky ..."
rm -rf .husky &&
npx husky install &&
npx husky add .husky/pre-commit "npx lint-staged" &&
npx husky add .husky/pre-push "npm run test:ci" &&

echo "husky configurado!"

echo "Verificando funcionamento do jest ..."
npm t

echo "Jest funcionando!"