# 🚀 Guia de Deploy no Vercel

## Método 1: Via Interface Web (Recomendado)

### Passo 1: Preparar o Projeto
1. Certifique-se de que todos os arquivos estão salvos
2. O arquivo `vercel.json` já está configurado na raiz do projeto (`Netflix-foda 2`)

### Passo 2: Criar Conta no Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **GitHub** (para conectar com seu repositório)

### Passo 3: Conectar Repositório do GitHub
1. No Vercel, clique em **"Add New Project"**
2. Se você já subiu o código para o GitHub (veja abaixo como fazer), o projeto deve aparecer na lista "Import Git Repository"
3. Clique em **Import** ao lado do seu repositório `Netflix-foda-2`

### Passo 4: Configurar o Deploy
1. **Framework Preset**: Other (ou HTML/Static)
2. **Root Directory**: `Netflix-foda` (Configuração IMPORTANTE!)
   - Clique em "Edit" ao lado de Root Directory e selecione a pasta `Netflix-foda`
3. **Build Command**: (deixe vazio)
4. **Output Directory**: (deixe vazio)
5. Clique em **"Deploy"**

---

## Como subir para o GitHub (Upload)

Se você ainda não colocou o código no GitHub, siga estes passos:

1. **Crie um Repositório no GitHub**:
   - Vá em https://github.com/new
   - Nomeie como `Netflix-foda-2`
   - Não marque "Initialize with readme" (pois já temos arquivos)

2. **Abra o Terminal** na pasta do projeto (`f:\Netflix-foda 2`) e rode os comandos:
   ```bash
   git init
   git add .
   git commit -m "Upload inicial do projeto"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/Netflix-foda-2.git
   git push -u origin main
   ```
   *(Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub)*

---

## ⚙️ Configurações Importantes

### Root Directory
- **Valor**: `Netflix-foda`
- Isso indica ao Vercel onde está o arquivo `index.html` principal. Antes estava em `Raiz`, mas agora movemos para simplificar.

### Rewrites (vercel.json)
O arquivo `vercel.json` ajuda o Vercel a lidar com rotas se necessário, mas como é um site estático simples, a configuração do "Root Directory" é a mais importante.

## ✅ Checklist Antes do Deploy

- [ ] Arquivos movidos da pasta `Raiz` para `Netflix-foda` (Feito!)
- [ ] Links internos corrigidos (Feito!)
- [ ] `vercel.json` atualizado

**Sucesso!** 🚀 Se der algum erro, verifique se o "Root Directory" foi configurado corretamente para `Netflix-foda`.
