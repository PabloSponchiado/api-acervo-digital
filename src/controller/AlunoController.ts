// Importa a classe Aluno do model — é daqui que vêm os métodos de acesso ao banco de dados
import Aluno from "../model/Aluno.js";
// Importa os tipos Request e Response do Express — representam a requisição e a resposta HTTP
// "type" indica que é uma importação apenas de tipo (só existe em tempo de compilação, não gera código JS)
import { type Request, type Response } from "express";
// Importa o tipo AlunoDTO para tipar os dados recebidos do front-end
import type AlunoDTO from "../dto/AlunoDTO.js";

// Define a classe AlunoController que HERDA da classe Aluno
// Isso permite que o controller acesse diretamente os métodos estáticos do model (listarAlunos, cadastrarAluno, etc.)
// A arquitetura MVC separa responsabilidades: o Model cuida do banco, o Controller cuida das requisições HTTP
class AlunoController extends Aluno {

    /**
     * Lista todos os alunos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de alunos em formato JSON.
     */
    // Método estático e assíncrono — recebe a requisição HTTP e devolve a resposta com todos os alunos
 static async todos(req: Request, res: Response): Promise<Response> {
    try {
        const listaDeAlunos = await Aluno.listarAlunos();
        return res.status(200).json(listaDeAlunos);
    } catch (error) {
        console.error(`Erro ao listar alunos: ${error}`);
        return res.status(500).json({ mensagem: 'Erro ao recuperar a lista de alunos.' });
    }
}

    /**
     * Retorna informações de um aluno
     * @param req Objeto de requisição HTTP
     * @param res Objeto de resposta HTTP.
     * @returns Informações de aluno em formato JSON.
     */
    // Método que busca um único aluno com base no ID informado na URL (ex: GET /aluno/5)
  static async aluno(
    req: Request<{ id: string }>,
    res: Response
): Promise<Response> {
    const idAluno = parseInt(req.params.id);

    if (isNaN(idAluno)) {
        return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    try {
        const aluno = await Aluno.listarAluno(idAluno);

        return aluno
            ? res.status(200).json(aluno)
            : res.status(404).json({ mensagem: 'Aluno não encontrado.' });

    } catch (error) {
        console.error(`Erro ao buscar aluno: ${error}`);
        return res.status(500).json({ mensagem: 'Erro ao recuperar as informações do aluno.' });
    }
}

    /**
      * Cadastra um novo aluno.
      * @param req Objeto de requisição HTTP com os dados do aluno.
      * @param res Objeto de resposta HTTP.
      * @returns Mensagem de sucesso ou erro em formato JSON.
      */
    // Método que recebe os dados do front-end e cria um novo aluno no banco de dados
  static async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
        const dadosRecebidos: AlunoDTO = req.body;

        const novoAluno = new Aluno(
            dadosRecebidos.nome,
            dadosRecebidos.sobrenome,
            dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
            dadosRecebidos.endereco ?? '',
            dadosRecebidos.email ?? '',
            dadosRecebidos.celular
        );

        const result = await Aluno.cadastrarAluno(novoAluno);

        return result
            ? res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso.' })
            : res.status(500).json({ mensagem: 'Não foi possível cadastrar o aluno no banco de dados.' });

    } catch (error) {
        console.error(`Erro ao cadastrar o aluno: ${error}`);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar o aluno.' });
    }
}

    /**
     * Remove um aluno.
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    // Método que recebe um ID pela URL e realiza a remoção lógica do aluno no banco
    // "Promise<Response>" indica que este método sempre retorna uma resposta HTTP ao final
  static async remover(
    req: Request<{ id: string }>,
    res: Response
): Promise<Response> {
    const idAluno = parseInt(req.params.id);

    if (isNaN(idAluno)) {
        return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    try {
        const result = await Aluno.removerAluno(idAluno);

        return result
            ? res.status(200).json({ mensagem: 'Aluno removido com sucesso.' })
            : res.status(404).json({ mensagem: 'Aluno não encontrado para exclusão.' });

    } catch (error) {
        console.error(`Erro ao remover aluno: ${error}`);
        return res.status(500).json({ mensagem: 'Erro ao remover aluno.' });
    }
}
    /**
     * Método para atualizar o cadastro de um aluno.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    // Método que recebe os novos dados do front-end e atualiza o cadastro do aluno no banco
   static async atualizar(
    req: Request<{ id: string }>,
    res: Response
): Promise<Response> {
    const idAluno = parseInt(req.params.id);

    if (isNaN(idAluno)) {
        return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    try {
        const dadosRecebidos: AlunoDTO = req.body;

        const aluno = new Aluno(
            dadosRecebidos.nome,
            dadosRecebidos.sobrenome,
            dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
            dadosRecebidos.endereco ?? '',
            dadosRecebidos.email ?? '',
            dadosRecebidos.celular
        );

        aluno.setIdAluno(idAluno);

        const result = await Aluno.atualizarAluno(aluno);

        return result
            ? res.status(200).json({ mensagem: 'Cadastro atualizado com sucesso.' })
            : res.status(404).json({ mensagem: 'Aluno não encontrado para atualização.' });

    } catch (error) {
        console.error(`Erro ao atualizar aluno: ${error}`);
        return res.status(500).json({ mensagem: 'Erro ao atualizar aluno.' });
    }
}
}

// Exporta a classe AlunoController para que possa ser importada e usada nas rotas da aplicação
export default AlunoController;