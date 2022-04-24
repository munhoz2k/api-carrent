# Cadastro de Carros

**RF**
- Deve ser possível cadastrar um novo carro
- Deve ser possível listar todas as categorias

**RN**
- Não deve ser possível cadastar um carro com uma placa já existente.
- O carro deve ser cadastrado com disponibilidade por padrão.
- O usuário responsavél pelo cadastro deve ser um usuário administrador


# Listagem de carros

**RF**
- Deve ser possível listar todos os carros disponíveis
- Deve ser possível listar todos os carros disponiveis pelo nome da categoria, marca e do carro

**RN**
- O usuário não precisa estar logado no sistema


# Cadastro de Espicificação no Carro 

**RF**
- Deve ser possível cadastarar uma especificação para um carro
- Deve ser possível listar todas as especificações
- Deve ser possível listar todos os carros

**RN**
- Não deve ser possível cadastrar uma especificação para um carro não cadastrado
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro
- O usuário responsável pelo cadastro deve ser um usuário administrador


# Cadastro de imagens do carro

**Rf**
- Deve ser possível cadastrar a imagem do carro 

**RNF**
- Utilizar o multer para o upload dos arquivos

**RN**
- O usuário de poder cadastrar mais de uma imagem para o mesmo carro
- O usuário responsável pelo cadastro deve ser um usuário administrador


# Alugel de Carros

**RF**
- Deve ser possível cadastrar um aluguel

**RN**
- O aluguel deve ter duração mínima de 24 horas
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário