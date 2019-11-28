export const queryLoginCliente = params => {
  return JSON.stringify({
    query: `
      query {
        login(
          email: "${params.email.toLowerCase()}",
          senha: "${params.senha}"){
            usuario{
              _id
              tipo
              nome
              email
              celular
              genero
              dataNascimento
            }
            cliente {
              formacaoAcademica
              formacaoProfissional
              habilidades
              experiencia
              endereco {
                cidade
                uf
                bairro
              }
              redeSocial {
                facebook
                lattes
                linkedin
              }          
            }
            token
            tokenExpiration
        }
      }
      `,
  });
};

export const queryLoginEmpresa = params => {
  return JSON.stringify({
    query: `
      query {
        login(
          email: "${params.email.toLowerCase()}",
          senha: "${params.senha}"){
          usuario{
            _id
            nome
            email      
            genero
            celular
            dataNascimento
            fotoPerfil
          }
          empresa{
            _id
            nome
            cnpj
            email
            telefone
            setor
            sobre
            vagas {
              nome
              tipo
            }
          }
          token
          tokenExpiration
        }
      }
      `,
  });
};
