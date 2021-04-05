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
- Não deve ser possível o cadastro por um usuário sem acesso de administrador
- Ao realizar o aluguel, o status do veículo deverá ser alterado para indisponível

# Devolução do veículo

> Requisitos Funcionais
- Deve ser possível realizar a devolução de um veículo

> Requisitos Não Funcionais
- N/A

> Regras de Negócio
- Se o veículo for devolvido com menos de 24 horas, deverá ser cobrado diária completa
- Ao realizar a devolução o veículo deverá ser liberado para outro aluguel
- Ao realizar a devolução o usuário deverá ser liberado para outro aluguel
- Ao realizar a devolução deverá ser calculado o total do aluguel
- Caso o horário da devolução seja superior ao horário previsto de entrega, deverá ser cobrado multa proporcional aos dias de atraso
- Caso haja multa deverá ser somado ao total do aluguel
