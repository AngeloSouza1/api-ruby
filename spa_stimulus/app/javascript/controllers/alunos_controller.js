import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    connect() {
        this.renderLista();
    }

    static base_uri = "http://127.0.0.1:3000/";

    async cadastrar(event) {
        event.preventDefault();

        const nome = this.element.querySelector("input[name='nome']").value;
        const telefone = this.element.querySelector("input[name='telefone']").value;
        const matricula = this.element.querySelector("input[name='matricula']").value;

        if (!nome || nome === "") {
            alert("O nome é obrigatório");
            this.element.querySelector("input[name='nome']").focus();
            return;
        }

        if (!telefone || telefone === "") {
            alert("O telefone é obrigatório");
            this.element.querySelector("input[name='telefone']").focus();
            return;
        }

        if (!matricula || matricula === "") {
            alert("A matrícula é obrigatória");
            this.element.querySelector("input[name='matricula']").focus();
            return;
        }

        const payload = {
            nome: nome,
            telefone: telefone,
            matricula: matricula
        };

        const url = `${this.constructor.base_uri}/alunos`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status == 422) {
                    const erros = await response.json();
                    alert(JSON.stringify(erros));
                    return;
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            this.renderLista();

        } catch (error) {
            console.error('Erro ao cadastrar alunos:', error);
        }
    }


    async atualizar(event) {
      event.preventDefault();
  
      const id = this.element.querySelector("input[name='id']").value; 
      const nome = this.element.querySelector("input[name='nome']").value;
      const telefone = this.element.querySelector("input[name='telefone']").value;
      const matricula = this.element.querySelector("input[name='matricula']").value;
  
      if (!id || id == "") {
          alert("O Id é obrigatório");
          this.renderLista();
          return;
      }
  
      if (!nome || nome == "") {
          alert("O nome é obrigatório");
          this.element.querySelector("input[name='nome']").focus();
          return;
      }
  
      if (!telefone || telefone == "") {
          alert("O telefone é obrigatório");
          this.element.querySelector("input[name='telefone']").focus();
          return;
      }
  
      if (!matricula || matricula == "") {
          alert("A matrícula é obrigatória");
          this.element.querySelector("input[name='matricula']").focus();
          return;
      }
  
      const payload = {
          nome: nome,
          telefone: telefone,
          matricula: matricula
      };
  
      const url = `${this.constructor.base_uri}/alunos/${id}`;
  
      try {
          const response = await fetch(url, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
          });
  
          if (!response.ok) {
              if (response.status == 422) {
                  const erros = await response.json();
                  alert(JSON.stringify(erros));
                  return;
              }
              throw new Error(`Erro HTTP: ${response.status}`);
          }
  
          this.renderLista();
  
      } catch (error) {
          console.error('Erro ao atualizar aluno:', error);
      }
  }
  
   


    novo() {
        this.element.innerHTML = `
            <form data-action="submit->alunos#cadastrar">
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome</label>
                    <input type="text" class="form-control" name="nome" placeholder="Digite seu nome">
                </div>
                <div class="mb-3">
                    <label for="telefone" class="form-label">Telefone</label>
                    <input type="tel" class="form-control" name="telefone" placeholder="Digite seu telefone">
                </div>
                <div class="mb-3">
                    <label for="matricula" class="form-label">Matrícula</label>
                    <input type="text" class="form-control" name="matricula" placeholder="Digite sua matrícula">
                </div>
                <br>
                <button type="submit" class="btn btn-primary">Enviar</button>
                <button type="button" data-action="click->alunos#renderLista" class="btn btn-secondary">Cancelar</button>
            </form>
        `;
    }

    async renderLista() {
        try {
            const response = await fetch(`${this.constructor.base_uri}/alunos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const alunos = await response.json();

            if (alunos.length > 0) {
                this.element.innerHTML = `
                    <button class="btn btn-primary" data-action="click->alunos#novo">Novo</button>
                    <hr>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Matrícula</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${alunos.map(aluno => `
                                <tr>
                                    <td>${aluno.id}</td>
                                    <td>${aluno.nome}</td>  ~/Projetos/Cursos-Desenvolvedor   main *2 ❯                                                                                                                           3.1.0  16:10:09


                                    <td>${aluno.telefone}</td>
                                    <td>${aluno.matricula}</td>
                                    <td style="width: 200px">
                                        <button type="button" data-action="click->alunos#editar" data-aluno-id=${aluno.id} class="btn btn-warning">Editar</button>
                                        <button type="button" data-action="click->alunos#excluir" data-aluno-id=${aluno.id} class="btn btn-danger">Apagar</button>
                                    </td>
                                </tr>`
                            ).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                this.element.innerHTML = '<h3>Não tenho alunos cadastrados</h3>';
            }

        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        }
    }

    async editar(event) {
        try {
            this.element.innerHTML = 'carregando ...';
            const id = event.currentTarget.dataset.alunoId;

            const url = `${this.constructor.base_uri}/alunos/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const aluno = await response.json();

            this.element.innerHTML = `
                <form data-action="submit->alunos#atualizar">
                    <div class="mb-3">
                        <label for="nome" class="form-label">Nome</label>
                        <input type="hidden" name="id" value="${aluno.id}">
                        <input type="text" class="form-control" name="nome" value="${aluno.nome}" placeholder="Digite seu nome">
                    </div>
                    <div class="mb-3">
                        <label for="telefone" class="form-label">Telefone</label>
                        <input type="tel" class="form-control" name="telefone" value="${aluno.telefone}" placeholder="Digite seu telefone">
                    </div>
                    <div class="mb-3">
                        <label for="matricula" class="form-label">Matrícula</label>
                        <input type="text" class="form-control" name="matricula" value="${aluno.matricula}" placeholder="Digite sua matrícula">
                    </div>
                    <br>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                    <button type="button" data-action="click->alunos#renderLista" class="btn btn-secondary">Cancelar</button>
                </form>
            `;
        } catch (error) {
            console.error('Erro ao carregar dados do aluno:', error);
        }
    }

    async excluir(event) {
        const id = event.currentTarget.dataset.alunoId;

        if (confirm("Confirma exclusão?")) {
            try {
                const url = `${this.constructor.base_uri}/alunos/${id}`;
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status == 422) {
                        const erros = await response.json();
                        alert(JSON.stringify(erros));
                        return;
                    }
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                this.renderLista();

            } catch (error) {
                console.error('Erro ao excluir aluno:', error);
            }
        }
    }
}
