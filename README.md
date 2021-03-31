# Cadastro de veículos

> Requisitos Funcionais
- Deve ser possível cadastrar um novo veículo

> Requisitos Não Funcionais
- N/A

> Regras de Negócio
- Não deve ser possível cadastrar um veículo com uma placa já existente
- O veículo deve ser cadastrado com a disponibilidade habilitada por padrão
- Não deve ser possível o cadastro por um usuário sem acesso de administrador

# Listagem de veículos

> Requisitos Funcionais
- Deve ser possível listar todos os veículos disponíveis
- Deve ser possível listar todos os veículos disponíveis pelo nome da categoria
- Deve ser possível listar todos os veículos disponíveis pelo nome da marca
- Deve ser possível listar todos os veículos disponíveis pelo nome do veículo

> Requisitos Não Funcionais
- N/A

> Regras de Negócio
- O usuário não precisa estar logado no sistema

# Cadastro de especificações

> Requisitos Funcionais
- Deve ser possível cadastrar uma especificação para um veículo

> Requisitos Não Funcionais
- N/A

> Regras de Negócio
- Não deve ser possível cadastrar uma especificação para um veículo não cadastrado
- Não deve ser possível cadastrar uma especificação já existente para o mesmo veículo
- Não deve ser possível o cadastro por um usuário sem acesso de administrador

# Cadastro de imagens do veículo

> Requisitos Funcionais
- Deve ser possível cadastrar a imagem do veículo
- Deve ser possível listar todos os veículos cadastrados

> Requisitos Não Funcionais
- Utilizar o multer para upload dos arquivos

> Regras de Negócio
- O usuário deve poder cadastrar mais de uma imagem para o mesmo veículo
- Não deve ser possível o cadastro por um usuário sem acesso de administrador

# Agendamento de alugel

> Requisitos Funcionais
- Deve ser possível listar cadastrar um aluguel

> Requisitos Não Funcionais
- N/A

> Regras de Negócio
- O alugel deve ter duração mínima de 24 horas
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo veículo