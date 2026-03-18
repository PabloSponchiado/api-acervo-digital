// Importa o tipo AlunoDTO, que define a "forma" dos dados de um aluno (como um molde/contrato)
import type AlunoDTO from "../dto/AlunoDTO.js";
// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel.js";

// Cria uma instância do DatabaseModel e acessa o pool de conexões com o banco de dados
// O "pool" é um conjunto de conexões reutilizáveis, mais eficiente que abrir/fechar uma por vez
const database = new DatabaseModel().pool;

// Define a classe Aluno, que representa um aluno no sistema
class Aluno {

    // Atributo privado: ID único do aluno no banco de dados (começa em 0, pois ainda não foi salvo)
    private id_aluno: number = 0;
    // Atributo privado: Registro Acadêmico do aluno (começa vazio)
    private ra: string = "";
    // Atributo privado: Primeiro nome do aluno
    private nome: string;
    // Atributo privado: Sobrenome do aluno
    private sobrenome: string;
    // Atributo privado: Data de nascimento do aluno
    private data_nascimento: Date;
    // Atributo privado: Endereço residencial do aluno
    private endereco: string;
    // Atributo privado: E-mail do aluno
    private email: string;
    // Atributo privado: Número de celular do aluno
    private celular: string;
    // Atributo privado: Status do aluno (true = ativo, false = inativo/removido)
    private status_aluno: boolean = true;

    // Construtor: método especial chamado automaticamente ao criar um novo objeto Aluno
    // Os parâmetros com "_" na frente são uma convenção para diferenciar dos atributos da classe
    constructor(
        _nome: string,           // Nome obrigatório
        _sobrenome: string,      // Sobrenome obrigatório
        _data_nascimento: Date,  // Data de nascimento obrigatória
        _endereco: string,       // Endereço obrigatório
        _email: string,          // E-mail obrigatório
        _celular?: string        // Celular opcional (o "?" indica que pode ser omitido)
    ) {
        // Atribui o valor recebido ao atributo interno da classe
        this.nome = _nome;
        this.sobrenome = _sobrenome;
        this.data_nascimento = _data_nascimento;
        this.endereco = _endereco;
        this.email = _email;
        // Se _celular foi informado, usa esse valor; senão, usa string vazia ("")
        // O operador "??" é chamado de "nullish coalescing" — retorna o lado direito se o esquerdo for null/undefined
        this.celular = _celular ?? "";
    }

    // ==================== GETTERS E SETTERS ====================
    // Getters e setters são métodos públicos que permitem ler/alterar atributos privados com segurança

    // Getter: retorna o ID do aluno
    public getIdAluno(): number {
        return this.id_aluno;
    }

    // Setter: define um novo valor para o ID do aluno
    public setIdAluno(id_aluno: number): void {
        this.id_aluno = id_aluno;
    }

    // Getter: retorna o RA do aluno
    public getRa(): string {
        return this.ra;
    }

    // Setter: define um novo valor para o RA do aluno
    public setRa(ra: string): void {
        this.ra = ra;
    }

    // Getter: retorna o nome do aluno
    public getNome(): string {
        return this.nome;
    }

    // Setter: define um novo valor para o nome do aluno
    public setNome(nome: string): void {
        this.nome = nome;
    }

    // Getter: retorna o sobrenome do aluno
    public getSobrenome(): string {
        return this.sobrenome;
    }

    // Setter: define um novo valor para o sobrenome do aluno
    public setSobrenome(sobrenome: string): void {
        this.sobrenome = sobrenome;
    }

    // Getter: retorna a data de nascimento do aluno
    public getDataNascimento(): Date {
        return this.data_nascimento;
    }

    // Setter: define uma nova data de nascimento para o aluno
    public setDataNascimento(data_nascimento: Date): void {
        this.data_nascimento = data_nascimento;
    }

    // Getter: retorna o endereço do aluno
    public getEndereco(): string {
        return this.endereco;
    }

    // Setter: define um novo endereço para o aluno
    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }

    // Getter: retorna o e-mail do aluno
    public getEmail(): string {
        return this.email;
    }

    // Setter: define um novo e-mail para o aluno
    public setEmail(email: string): void {
        this.email = email;
    }

    // Getter: retorna o celular do aluno
    public getCelular(): string {
        return this.celular;
    }

    // Setter: define um novo número de celular para o aluno
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    // Getter duplicado do RA (mesma função que getRa acima — provavelmente um erro de duplicidade no código original)
    public getRA(): string {
        return this.ra;
    }

    // Setter duplicado do RA (mesma função que setRa acima)
    public setRA(ra: string): void {
        this.ra = ra;
    }

    // Getter: retorna o status do aluno (true = ativo, false = inativo)
    public getStatusAluno(): boolean {
        return this.status_aluno;
    }

    // Setter: define um novo status para o aluno
    public setStatusAluno(status_aluno: boolean): void {
        this.status_aluno = status_aluno;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================
    // Métodos "static" pertencem à classe, não ao objeto — são chamados como Aluno.listarAlunos()

    /**
     * Retorna uma lista com todos os alunos cadastrados no banco de dados
     * 
     * @returns Lista com todos os alunos cadastrados no banco de dados
     */
    // "async" indica que este método é assíncrono — ele pode "esperar" por operações demoradas (como banco de dados)
    // Retorna uma Promise que, quando resolvida, contém um Array de AlunoDTO ou null
  /**
 * Lista todos os alunos ativos no banco de dados.
 *
 * Melhorias aplicadas:
 * - Substituído forEach + push por map (mais idiomático e eficiente)
 * - Query com colunas explícitas em vez de SELECT * (evita dados desnecessários)
 * - Tipagem explícita na linha do banco (elimina uso de "any")
 * - Logging de erro mais informativo com console.error
 * - Comentários revisados para clareza pedagógica
 *
 * @returns Promise com array de AlunoDTO ou null em caso de erro
 */
static async listarAlunos(): Promise<Array<AlunoDTO> | null> {
  try {
    /*
     * ✅ MELHORIA: Evite SELECT *
     * Listar colunas explicitamente melhora a legibilidade, evita trazer
     * campos desnecessários e protege contra mudanças futuras no schema.
     */
    const querySelectAluno = `
      SELECT
        id_aluno,
        ra,
        nome,
        sobrenome,
        data_nascimento,
        endereco,
        email,
        celular,
        status_aluno
      FROM Aluno
      WHERE status_aluno = TRUE;
    `;

    /*
     * Executa a query no banco de dados.
     * "await" pausa a função aqui até o banco responder —
     * sem bloquear o restante da aplicação (isso é programação assíncrona).
     */
    const respostaBD = await database.query(querySelectAluno);

    /*
     * ✅ MELHORIA: Substituído forEach + push por map()
     *
     * O map() transforma cada linha em um AlunoDTO e já retorna o array pronto,
     * sem precisar criar uma lista vazia antes e empurrar item por item.
     * É mais conciso, mais legível e considerado boa prática em TypeScript.
     *
     * ✅ MELHORIA: Tipagem explícita no parâmetro da função
     * Substituímos (aluno: any) por uma interface inline.
     * Isso ativa a checagem de tipos do TypeScript, evitando erros silenciosos.
     */
    const listaDeAlunos: Array<AlunoDTO> = respostaBD.rows.map(
      (aluno: {
        id_aluno: number;
        ra: string;
        nome: string;
        sobrenome: string;
        data_nascimento: Date;
        endereco: string;
        email: string;
        celular: string;
        status_aluno: boolean;
      }): AlunoDTO => ({
        id_aluno: aluno.id_aluno,
        ra: aluno.ra,
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        data_nascimento: aluno.data_nascimento,
        endereco: aluno.endereco,
        email: aluno.email,
        celular: aluno.celular,
        status_aluno: aluno.status_aluno,
      })
    );

    // Retorna a lista de alunos transformados em DTOs
    return listaDeAlunos;

  } catch (error) {
    /*
     * ✅ MELHORIA: console.error em vez de console.log
     * Erros devem ser registrados como erros — isso facilita o monitoramento
     * em ferramentas de log (ex: Datadog, Sentry) e deixa claro no terminal
     * que algo inesperado aconteceu.
     *
     * ✅ MELHORIA: Verificação do tipo de erro antes de exibir a mensagem
     * Em TypeScript, o "error" no catch é do tipo "unknown" por padrão.
     * Verificar se é instância de Error antes de acessar .message é mais seguro
     * e evita crashes no próprio bloco de tratamento de erro.
     */
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error(`[AlunoModel] Erro ao listar alunos: ${mensagem}`);

    // Retorna null para sinalizar ao chamador que a operação falhou
    return null;
  }
}
    static async listarAluno(id_aluno: number): Promise<AlunoDTO | null> {
        try {
            // Bloco try: aqui tentamos executar o código que pode gerar um erro.
            // Se ocorrer algum erro dentro deste bloco, ele será capturado pelo catch.

            // Define a query SQL — o "$1" é um parâmetro que será substituído pelo valor real (id_aluno)
            // Isso é chamado de "prepared statement" e protege contra ataques de SQL Injection
            const querySelectAluno = `SELECT * FROM aluno WHERE id_aluno = $1`;

            // Executa a query passando o id_aluno como segundo argumento (substitui o $1)
            const respostaBD = await database.query(querySelectAluno, [id_aluno]);

            // Monta o objeto AlunoDTO com o primeiro resultado retornado (rows[0] = primeira linha)
            const alunoDTO: AlunoDTO = {
                id_aluno: respostaBD.rows[0].id_aluno,               // ID do aluno
                nome: respostaBD.rows[0].nome,                       // Nome do aluno
                sobrenome: respostaBD.rows[0].sobrenome,             // Sobrenome do aluno
                data_nascimento: respostaBD.rows[0].data_nascimento, // Data de nascimento do aluno
                endereco: respostaBD.rows[0].endereco,               // Endereço do aluno
                email: respostaBD.rows[0].email,                     // E-mail do aluno
                celular: respostaBD.rows[0].celular,                 // Celular do aluno
                ra: respostaBD.rows[0].ra,                           // Registro Acadêmico
                status_aluno: respostaBD.rows[0].status_aluno        // Status ativo/inativo
            };

            // Retorna o objeto aluno preenchido com os dados do banco
            return alunoDTO;
        } catch (error) {
            // Bloco catch: se algum erro ocorrer no bloco try, ele será capturado aqui.
            // Isso evita que o erro interrompa a execução do programa.

            // Exibe uma mensagem de erro no console para facilitar o debug
            console.log(`Erro ao realizar a consulta: ${error}`);

            // Retorna null para indicar que não foi possível buscar o aluno
            return null;
        }
    }

    /**
    * Cadastra um novo aluno no banco de dados
    * @param aluno Objeto Aluno contendo as informações a serem cadastradas
    * @returns Boolean indicando se o cadastro foi bem-sucedido
    */
    // Recebe um objeto Aluno completo e tenta inseri-lo no banco de dados
 /**
 * Cadastra um novo aluno no banco de dados.
 *
 * Melhorias aplicadas:
 * - Removidas aspas simples nos placeholders '$1' → $1 (mesmo bug crítico do atualizar)
 * - Valores do array alinhados com comentários inline para melhor leitura
 * - console.error com verificação de tipo segura (error instanceof Error)
 * - Comentários revisados e organizados pedagogicamente
 *
 * @param aluno - Objeto Aluno com os dados a serem inseridos
 * @returns Promise<boolean> — true se cadastrado com sucesso, false caso contrário
 */
static async cadastrarAluno(aluno: Aluno): Promise<boolean> {
  try {
    /*
     * ✅ CORREÇÃO CRÍTICA: Placeholders sem aspas simples
     *
     * ERRADO  → VALUES ('$1', '$2', ...)
     * CORRETO → VALUES ($1, $2, ...)
     *
     * Com aspas, o banco interpreta '$1' como texto literal — a substituição
     * pelo valor real nunca acontece, e a proteção contra SQL Injection
     * é completamente anulada. Esse bug impediria qualquer cadastro de funcionar.
     *
     * ℹ️ RETURNING id_aluno:
     * Instrui o banco a retornar o ID gerado automaticamente após o INSERT.
     * Isso permite confirmar que o registro foi criado e recuperar seu ID,
     * tudo em uma única operação — sem precisar de uma segunda consulta.
     */
    const queryInsertAluno = `
      INSERT INTO Aluno (nome, sobrenome, data_nascimento, endereco, email, celular)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_aluno;
    `;

    /*
     * Executa a query parametrizada com os dados do objeto Aluno.
     * Os valores do array são vinculados na ordem dos placeholders $1–$6.
     *
     * Normalização aplicada para consistência no banco:
     * - Textos descritivos (nome, endereço) → MAIÚSCULAS
     * - E-mail                              → minúsculas
     * - Datas e números                     → sem transformação
     */
    const respostaBD = await database.query(queryInsertAluno, [
      aluno.getNome().toUpperCase(),       // $1 — Nome
      aluno.getSobrenome().toUpperCase(),  // $2 — Sobrenome
      aluno.getDataNascimento(),           // $3 — Data de nascimento
      aluno.getEndereco().toUpperCase(),   // $4 — Endereço
      aluno.getEmail().toLowerCase(),      // $5 — E-mail
      aluno.getCelular(),                  // $6 — Celular
    ]);

    /*
     * Verifica se o banco retornou ao menos uma linha com o ID gerado.
     * rows.length > 0 confirma que o INSERT foi executado com sucesso.
     *
     * ℹ️ Por que não usar rowCount aqui?
     * Para INSERT com RETURNING, a forma mais confiável de confirmar o sucesso
     * é verificar se rows contém o registro retornado — rowCount pode variar
     * conforme o driver utilizado.
     */
    if (respostaBD.rows.length > 0) {
      console.log(`[AlunoModel] Aluno cadastrado com sucesso. ID: ${respostaBD.rows[0].id_aluno}`);
      return true;
    }

    // INSERT executou sem erros, mas nenhum ID foi retornado — indica falha silenciosa
    return false;

  } catch (error) {
    /*
     * ✅ MELHORIA: Verificação de tipo do erro antes de exibir a mensagem.
     * "error" no catch é do tipo unknown em TypeScript moderno.
     * Verificar instanceof Error antes de acessar .message é a forma segura.
     */
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error(`[AlunoModel] Erro ao cadastrar aluno: ${mensagem}`);

    return false;
  }
}
    /**
    * Remove um aluno do banco de dados
    * @param id_aluno ID do aluno a ser removido
    * @returns Boolean indicando se a remoção foi bem-sucedida
   */
    // Recebe o ID do aluno e realiza uma "remoção lógica" (não apaga do banco, apenas desativa)
  /**
 * Remove logicamente um aluno e seus empréstimos do sistema.
 *
 * ℹ️ Remoção LÓGICA vs FÍSICA:
 * - Física (DELETE): apaga o registro permanentemente do banco — sem volta.
 * - Lógica (UPDATE status = FALSE): apenas "esconde" o registro, preservando
 *   o histórico. É a abordagem preferida em sistemas reais, pois mantém
 *   a integridade dos dados e permite auditoria.
 *
 * Melhorias aplicadas:
 * - Adicionada verificação de rowCount após o UPDATE do aluno
 * - Variável `result` que existia mas nunca era usada foi aproveitada
 * - Invertida condição para early return (guard clause)
 * - console.error com verificação de tipo segura (error instanceof Error)
 * - Comentários revisados e organizados pedagogicamente
 *
 * @param id_aluno - ID do aluno a ser desativado
 * @returns Promise<boolean> — true se removido com sucesso, false caso contrário
 */
static async removerAluno(id_aluno: number): Promise<boolean> {
  try {
    /*
     * Consulta prévia: verifica se o aluno existe e está ativo antes de agir.
     * Evita executar queries de UPDATE desnecessárias no banco.
     */
    const aluno: AlunoDTO | null = await this.listarAluno(id_aluno);

    // Guard clause: se o aluno não existir ou já estiver inativo, encerra aqui
    if (!aluno || !aluno.status_aluno) {
      return false;
    }

    /*
     * PASSO 1 — Desativa os empréstimos vinculados ao aluno.
     *
     * Antes de desativar o aluno, desativamos seus empréstimos.
     * Essa ordem importa: garante consistência nos dados
     * (não deixamos empréstimos "ativos" para um aluno inativo).
     *
     * ℹ️ Não verificamos rowCount aqui porque é válido que o aluno
     * não tenha nenhum empréstimo — zero linhas afetadas não é um erro.
     */
    const queryDesativarEmprestimos = `
      UPDATE emprestimo
      SET status_emprestimo_registro = FALSE
      WHERE id_aluno = $1;
    `;

    await database.query(queryDesativarEmprestimos, [id_aluno]);

    /*
     * PASSO 2 — Desativa o próprio aluno.
     *
     * Só executado após os empréstimos serem tratados no passo anterior.
     * Armazenamos o resultado para verificar se o UPDATE realmente funcionou.
     */
    const queryDesativarAluno = `
      UPDATE aluno
      SET status_aluno = FALSE
      WHERE id_aluno = $1;
    `;

    const respostaBD = await database.query(queryDesativarAluno, [id_aluno]);

    /*
     * ✅ CORREÇÃO: rowCount estava sendo ignorado no código original.
     * A variável `result` era declarada mas nunca verificada — o método
     * retornava true mesmo se o UPDATE não afetasse nenhuma linha.
     *
     * rowCount pode ser null se o driver não souber quantas linhas foram afetadas,
     * por isso verificamos null explicitamente antes de comparar com 0.
     */
    if (respostaBD.rowCount !== null && respostaBD.rowCount !== 0) {
      return true;
    }

    // UPDATE executou sem erros, mas nenhuma linha foi afetada
    return false;

  } catch (error) {
    /*
     * ✅ MELHORIA: console.error + verificação de tipo do erro
     * "error" no catch é do tipo unknown em TypeScript moderno.
     * Verificar instanceof Error antes de acessar .message é a forma segura.
     */
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error(`[AlunoModel] Erro ao remover aluno: ${mensagem}`);

    return false;
  }
}
static async atualizarAluno(aluno: Aluno): Promise<boolean> {
  try {
    /*
     * Antes de atualizar, verifica se o aluno existe e está ativo.
     * Essa consulta prévia evita executar um UPDATE desnecessário no banco.
     * listarAluno() retorna null se não encontrar — por isso checamos logo abaixo.
     */
    const alunoConsulta: AlunoDTO | null = await this.listarAluno(aluno.id_aluno);

    // Se o aluno não existir ou estiver inativo, encerra aqui retornando false
    if (!alunoConsulta || !alunoConsulta.status_aluno) {
      return false;
    }

    /*
     * ✅ CORREÇÃO CRÍTICA: Placeholders sem aspas simples
     *
     * ERRADO  → nome = '$1'  (o banco interpreta como string literal "$1")
     * CORRETO → nome = $1    (o banco substitui pelo valor real do array)
     *
     * Usar '$1' com aspas além de quebrar a query, anula a proteção contra
     * SQL Injection que os placeholders parametrizados oferecem.
     */
    const queryAtualizarAluno = `
      UPDATE Aluno
      SET
        nome            = $1,
        sobrenome       = $2,
        data_nascimento = $3,
        endereco        = $4,
        celular         = $5,
        email           = $6
      WHERE id_aluno = $7
    `;

    /*
     * Executa a query parametrizada.
     * Os valores do array são vinculados aos placeholders $1–$7, na ordem.
     * Normalizar strings (upper/lowercase) garante consistência no banco.
     */
    const respostaBD = await database.query(queryAtualizarAluno, [
      aluno.getNome().toUpperCase(),        // $1 — Nome padronizado em maiúsculas
      aluno.getSobrenome().toUpperCase(),   // $2 — Sobrenome padronizado em maiúsculas
      aluno.getDataNascimento(),            // $3 — Data de nascimento
      aluno.getEndereco().toUpperCase(),    // $4 — Endereço padronizado em maiúsculas
      aluno.getCelular(),                   // $5 — Celular
      aluno.getEmail().toLowerCase(),       // $6 — E-mail padronizado em minúsculas
      aluno.id_aluno,                       // $7 — ID usado no WHERE
    ]);

    /*
     * ✅ MELHORIA: Verificação de rowCount com null antes de comparar
     *
     * rowCount pode ser null se o driver não souber quantas linhas foram afetadas.
     * Checar isso explicitamente evita comportamento inesperado.
     *
     * ✅ MELHORIA: Operador estrito !== em vez de !=
     * O operador !== não faz coerção de tipos (ex: "0" != 0 seria true com !=).
     * Em TypeScript, sempre prefira === e !== para comparações seguras.
     */
    if (respostaBD.rowCount !== null && respostaBD.rowCount !== 0) {
      return true;
    }

    // UPDATE executado, mas nenhuma linha foi afetada — retorna false
    return false;

  } catch (error) {
    /*
     * ✅ MELHORIA: console.error + verificação de tipo do erro
     * "error" no catch é do tipo unknown em TypeScript moderno.
     * Verificar instanceof Error antes de acessar .message é a forma segura.
     */
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error(`[AlunoModel] Erro ao atualizar aluno: ${mensagem}`);

    return false;
  }
}
}

// Exporta a classe Aluno para que possa ser importada e usada em outros arquivos do projeto
export default Aluno;