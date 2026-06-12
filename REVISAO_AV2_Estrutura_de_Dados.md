# Revisão AV2 – Estrutura de Dados (em C)

> Resumo objetivo para a prova: teoria essencial + códigos prontos das questões práticas.
> Temas: Listas sequenciais (desordenadas e ordenadas), Pilhas, Filas, e conceitos de C.

---

## MAPA RÁPIDO (cole na cabeça antes da prova)

| Estrutura | Regra | Inserção | Remoção | Acesso |
|-----------|-------|----------|---------|--------|
| Lista desordenada | livre | no fim: **O(1)** | O(n) (precisa achar/deslocar) | índice O(1) |
| Lista ordenada | sempre crescente | O(n) (acha posição + desloca) | O(n) (desloca) | índice O(1), **busca binária O(log n)** |
| Pilha (LIFO) | Último a entrar, primeiro a sair | push O(1) | pop O(1) | só o topo |
| Fila (FIFO) | Primeiro a entrar, primeiro a sair | enfileira no fim O(1) | desenfileira no início O(1) | início/fim |

- **LIFO** = Last In, First Out (pilha). **FIFO** = First In, First Out (fila).
- Variável de controle (`quantidade`/`n`): lista **vazia** quando `= 0`; **cheia** quando `= max`.
- Passagem por **referência (ponteiro `*`)** é o que permite uma função alterar variáveis da `main`.

---

# 1. Vetores e Listas Lineares Sequenciais (desordenadas)

## 1.1 Teoria — respostas-chave

**1. O que é vetor / lista sequencial desordenada?**
Vetor é uma coleção de elementos do **mesmo tipo**, armazenados em posições **contíguas** de memória, acessados por um **índice** (começa em 0). Uma lista linear sequencial desordenada usa um vetor + uma variável de quantidade, e os elementos ficam na **ordem de inserção** (sem critério de ordenação). O índice dá acesso direto: `v[i]` é **O(1)**.

**2. Por que a variável `quantidade`?**
Ela informa quantos elementos estão realmente em uso (o vetor tem tamanho fixo `max`, mas nem todas as posições estão preenchidas).
- Lista **vazia**: `quantidade == 0`
- Lista **cheia**: `quantidade == max`

**3. Complexidade de inserir/remover no FIM (desordenada)?**
- Inserir no fim: **O(1)** — basta `v[quantidade++] = valor`.
- Remover do fim: **O(1)** — basta `quantidade--`.
- (Remover do meio é O(n) porque precisa deslocar os seguintes.)

**4. Busca linear x binária na desordenada?**
Busca linear percorre item a item: **O(n)**. A busca **binária NÃO funciona em lista desordenada** porque ela exige que os dados estejam **ordenados** (ela compara com o meio e descarta metade; sem ordem isso não vale).

**5. Listas sequenciais x encadeadas:**
- **Vantagens da sequencial:** acesso direto por índice O(1); simples; boa localidade de memória (cache).
- **Desvantagens:** tamanho fixo (`max`); inserir/remover no meio é O(n) (desloca elementos).
- **Encadeada:** tamanho dinâmico, insere/remove em O(1) se tiver o ponteiro, mas **sem acesso por índice** (precisa percorrer) e gasta memória extra com ponteiros.

## 1.2 Práticas — códigos

### (a) Notas de alunos: inserir / listar / ler até negativo
```c
#include <stdio.h>
#define MAX 100

void inserir(float v[], int *qtd, float valor) {
    if (*qtd < MAX) {
        v[*qtd] = valor;
        (*qtd)++;
    } else {
        printf("Lista cheia!\n");
    }
}

void listar(float v[], int qtd) {
    printf("Lista: ");
    for (int i = 0; i < qtd; i++)
        printf("%.2f ", v[i]);
    printf("\n");
}

int main() {
    float v[MAX];
    int qtd = 0;       // inicializa lista vazia
    float x;

    printf("Digite notas (negativo para parar): ");
    while (scanf("%f", &x) == 1 && x >= 0) {
        inserir(v, &qtd, x);   // insere só valores nao negativos
    }
    listar(v, qtd);
    return 0;
}
```

### (b) inserirSemRepetir (Atividade Estruturada 2)
```c
#include <stdio.h>

void inserirSemRepetir(int v[], int valor, int *pos, int max) {
    if (*pos >= max) {
        printf("Lista cheia!\n");
        return;
    }
    for (int i = 0; i < *pos; i++) {     // verifica se ja existe
        if (v[i] == valor) {
            printf("Valor %d ja existe!\n", valor);
            return;
        }
    }
    v[*pos] = valor;   // insere no fim
    (*pos)++;          // atualiza a quantidade
}
```

### (c) Dois vetores: intercalação, interseção, união, remover por índice
```c
#include <stdio.h>

void imprimir(int v[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", v[i]);
    printf("\n");
}

// Intercalação alternada: a0,b0,a1,b1,...
int intercala(int a[], int na, int b[], int nb, int r[]) {
    int i = 0, j = 0, k = 0;
    while (i < na || j < nb) {
        if (i < na) r[k++] = a[i++];
        if (j < nb) r[k++] = b[j++];
    }
    return k;
}

int existe(int v[], int n, int x) {
    for (int i = 0; i < n; i++) if (v[i] == x) return 1;
    return 0;
}

// Interseção: elementos comuns
int intersecao(int a[], int na, int b[], int nb, int r[]) {
    int k = 0;
    for (int i = 0; i < na; i++)
        if (existe(b, nb, a[i]) && !existe(r, k, a[i]))
            r[k++] = a[i];
    return k;
}

// União sem repetição
int uniao(int a[], int na, int b[], int nb, int r[]) {
    int k = 0;
    for (int i = 0; i < na; i++) if (!existe(r, k, a[i])) r[k++] = a[i];
    for (int j = 0; j < nb; j++) if (!existe(r, k, b[j])) r[k++] = b[j];
    return k;
}

void removerPeloIndice(int v[], int *quantidade, int indice) {
    if (indice < 0 || indice >= *quantidade) {   // valida o indice
        printf("Indice invalido!\n");
        return;
    }
    for (int i = indice; i < *quantidade - 1; i++)
        v[i] = v[i + 1];     // desloca para a esquerda
    (*quantidade)--;
}

int main() {
    int a[] = {1, 2, 3, 4}, na = 4;
    int b[] = {3, 4, 5, 6}, nb = 4;
    int r[20], nr;

    printf("A: "); imprimir(a, na);
    printf("B: "); imprimir(b, nb);

    nr = intercala(a, na, b, nb, r);
    printf("Intercalada: "); imprimir(r, nr);

    nr = intersecao(a, na, b, nb, r);
    printf("Intersecao: "); imprimir(r, nr);

    nr = uniao(a, na, b, nb, r);
    printf("Uniao: "); imprimir(r, nr);

    removerPeloIndice(r, &nr, 0);
    printf("Uniao apos remover indice 0: "); imprimir(r, nr);
    return 0;
}
```

---

# 2. Listas Sequenciais Ordenadas

## 2.1 Teoria — respostas-chave

**1. Ordenada x desordenada / por que não inserir no fim?**
Na ordenada os elementos seguem uma ordem (ex.: crescente). Não dá para inserir só no fim porque quebraria a ordem; é preciso achar a **posição certa** e deslocar os demais.

**2. Manter sempre ordenada:**
A inserção fica mais cara (O(n) por causa do deslocamento), mas a **busca fica muito mais rápida** (busca binária O(log n)). A remoção também desloca elementos (O(n)).

**3. Por que a binária é mais eficiente?**
Ela compara com o elemento do **meio** e descarta metade da lista a cada passo → **O(log n)**, enquanto a linear é O(n). Funcionamento: `inicio=0`, `fim=n-1`; calcula `meio`; se igual achou; se valor < v[meio] vai para a esquerda, senão para a direita.

**4. Vantagens/desvantagens da ordenada:**
- ✅ Busca rápida (binária O(log n)).
- ❌ Inserção e remoção custosas (O(n) por deslocamento).

## 2.2 Práticas — códigos

### inserirCresc, buscaBinaria, remover, bubbleSort + menu completo
```c
#include <stdio.h>
#define MAX 50

// Insere mantendo ordem crescente
void inserirCresc(float v[], int *n, int max, float valor) {
    if (*n >= max) { printf("Cheia!\n"); return; }
    int i = *n - 1;
    // desloca a direita enquanto o elemento for maior que o valor
    while (i >= 0 && v[i] > valor) {
        v[i + 1] = v[i];
        i--;
    }
    v[i + 1] = valor;   // insere na posicao correta
    (*n)++;
}

// Retorna indice ou -1
int buscaBinaria(float v[], int n, float valor) {
    int ini = 0, fim = n - 1;
    while (ini <= fim) {
        int meio = (ini + fim) / 2;
        if (v[meio] == valor) return meio;
        else if (v[meio] < valor) ini = meio + 1;
        else fim = meio - 1;
    }
    return -1;
}

// Remove um valor, deslocando o resto para a esquerda
void remover(float v[], int *n, float valor) {
    int pos = buscaBinaria(v, *n, valor);
    if (pos == -1) { printf("Valor nao encontrado!\n"); return; }
    for (int i = pos; i < *n - 1; i++)
        v[i] = v[i + 1];
    (*n)--;
}

// Bubble sort: COMPLEXIDADE O(n^2) porque sao DOIS lacos aninhados,
// comparando pares e trocando ate o vetor estar ordenado.
void bubbleSort(int v[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (v[j] > v[j + 1]) {
                int tmp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = tmp;
            }
}

void listar(float v[], int n) {
    for (int i = 0; i < n; i++) printf("%.1f ", v[i]);
    printf("\n");
}

int main() {
    float v[MAX];
    int n = 0, op;
    float x;

    do {
        printf("\n1-Inserir 2-Remover 3-Buscar 4-Listar 5-Sair: ");
        scanf("%d", &op);
        switch (op) {
            case 1: printf("Valor: "); scanf("%f", &x);
                    inserirCresc(v, &n, MAX, x); break;
            case 2: printf("Valor: "); scanf("%f", &x);
                    remover(v, &n, x); break;
            case 3: printf("Valor: "); scanf("%f", &x);
                    printf("Indice: %d\n", buscaBinaria(v, n, x)); break;
            case 4: listar(v, n); break;
        }
    } while (op != 5);
    return 0;
}
```

---

# 3. Pilhas Sequenciais (LIFO)

## 3.1 Teoria — respostas-chave

**1. O que caracteriza a pilha? LIFO:**
Pilha = estrutura **LIFO** (Last In, First Out): o **último** elemento inserido é o **primeiro** a sair. Insere e remove **sempre pelo topo**. Diferente da lista (acesso livre) e da fila (FIFO, sai pelo início).

**2. Operações e o índice `topo`:**
- `inicializar`: `topo = -1` (pilha vazia).
- `empilhar (push)`: incrementa o topo e guarda → `v[++topo] = x`.
- `desempilhar (pop)`: retorna `v[topo]` e decrementa → `topo--`.
- Cheia: `topo == max-1`. Vazia: `topo == -1`.

**3. Três aplicações:** desfazer (Ctrl+Z) em editores; inversão de sequências; verificação/validação de expressões (parênteses, pós-fixa); chamadas de função (pilha de execução).

## 3.2 Práticas — códigos

### (a) Decimal → binário usando pilha
```c
#include <stdio.h>
#define MAX 100

int main() {
    int pilha[MAX], topo = -1;
    int num;
    printf("Numero: "); scanf("%d", &num);

    if (num == 0) pilha[++topo] = 0;
    while (num > 0) {
        pilha[++topo] = num % 2;   // empilha o resto
        num /= 2;
    }
    printf("Binario: ");
    while (topo >= 0) printf("%d", pilha[topo--]);  // desempilha
    printf("\n");
    return 0;
}
```

### (b) Verificar parênteses balanceados
```c
#include <stdio.h>
#include <string.h>
#define MAX 100

int main() {
    char exp[MAX];
    int topo = -1;
    printf("Expressao: "); scanf("%s", exp);

    int ok = 1;
    for (int i = 0; exp[i] != '\0'; i++) {
        if (exp[i] == '(') topo++;          // empilha
        else if (exp[i] == ')') {
            if (topo == -1) { ok = 0; break; } // fecha sem abrir
            topo--;                            // desempilha
        }
    }
    if (ok && topo == -1) printf("Bem formada!\n");
    else printf("Mal formada!\n");
    return 0;
}
```

### (c) Palíndromo com pilha
```c
#include <stdio.h>
#include <string.h>
#define MAX 100

int main() {
    char palavra[MAX], pilha[MAX];
    int topo = -1;
    printf("Palavra: "); scanf("%s", palavra);

    int len = strlen(palavra);
    for (int i = 0; i < len / 2; i++)    // empilha a primeira metade
        pilha[++topo] = palavra[i];

    int ini = (len % 2 == 0) ? len / 2 : len / 2 + 1; // pula o meio se impar
    int palindromo = 1;
    for (int i = ini; i < len; i++) {
        if (pilha[topo--] != palavra[i]) { palindromo = 0; break; }
    }
    printf(palindromo ? "Eh palindromo!\n" : "Nao eh palindromo!\n");
    return 0;
}
```

### (d) Avaliador de expressão pós-fixa (ex.: "23+5*" = 25)
```c
#include <stdio.h>
#include <ctype.h>
#define MAX 100

int main() {
    char exp[MAX];
    int pilha[MAX], topo = -1;
    printf("Expressao pos-fixa: "); scanf("%s", exp);

    for (int i = 0; exp[i] != '\0'; i++) {
        char c = exp[i];
        if (isdigit(c)) {
            pilha[++topo] = c - '0';        // empilha operando
        } else {
            int b = pilha[topo--];          // pop dois valores
            int a = pilha[topo--];
            int r = 0;
            switch (c) {
                case '+': r = a + b; break;
                case '-': r = a - b; break;
                case '*': r = a * b; break;
                case '/': r = a / b; break;
            }
            pilha[++topo] = r;              // empilha o resultado
        }
    }
    printf("Resultado: %d\n", pilha[topo]);
    return 0;
}
```

---

# 4. Filas Sequenciais Simples (FIFO)

## 4.1 Teoria — respostas-chave

**1. Fila simples / FIFO:**
Fila = estrutura **FIFO** (First In, First Out): o **primeiro** a entrar é o **primeiro** a sair. Enfileira no **fim** e desenfileira no **início**.

**2. Diferença lista x pilha x fila:**
- Lista desordenada: insere/remove em qualquer posição.
- Pilha: insere e remove **no mesmo lado** (topo) → LIFO.
- Fila: insere num lado (fim), remove no outro (início) → FIFO.

**3. Por que dois índices (inicio e fim)?**
`fim` controla onde **inserir** (enfileirar); `inicio` controla de onde **remover** (desenfileirar). São extremos opostos, por isso dois índices.

**4. Desperdício de espaço / fila circular (só teoria):**
Quando remove muito, `inicio` avança e deixa posições vazias no começo que **não são reaproveitadas** na fila simples — pode parecer "cheia" mesmo com espaço livre no início. A **fila circular** resolve fazendo os índices "darem a volta" (com operador `%`/módulo), reaproveitando as posições do início.

## 4.2 Práticas — códigos

### (a) Menu: enfileirar / desenfileirar imprimindo múltiplos de 2 (Atividade 4)
```c
#include <stdio.h>
#define MAX 100

int main() {
    int fila[MAX], inicio = 0, fim = 0, op, x;

    do {
        printf("\n1-Enfileirar 2-Desenfileirar(multiplos de 2) 3-Sair: ");
        scanf("%d", &op);
        if (op == 1) {
            if (fim < MAX) {
                printf("Valor positivo: "); scanf("%d", &x);
                if (x > 0) fila[fim++] = x;   // fim incrementa e armazena
            } else printf("Fila cheia!\n");
        } else if (op == 2) {
            printf("Multiplos de 2: ");
            while (inicio < fim) {            // desenfileira todos
                if (fila[inicio] % 2 == 0) printf("%d ", fila[inicio]);
                inicio++;                     // inicio avanca
            }
            printf("\n");
        }
    } while (op != 3);
    return 0;
}
```

### (b) Fila de char → minúscula → pilha → imprime (isalpha/tolower)
```c
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#define MAX 100

int main() {
    char texto[MAX], fila[MAX], pilha[MAX];
    int ini = 0, fim = 0, topo = -1;

    printf("Texto: "); scanf("%s", texto);
    for (int i = 0; texto[i] != '\0'; i++) fila[fim++] = texto[i]; // enfileira

    while (ini < fim) {                    // desenfileira e empilha
        char c = fila[ini++];
        if (isalpha(c)) pilha[++topo] = tolower(c);  // letra -> minuscula
        else pilha[++topo] = c;                      // outros sem alterar
    }
    printf("Resultado: ");
    while (topo >= 0) printf("%c", pilha[topo--]);   // desempilha
    printf("\n");
    return 0;
}
```

### (c) Fila com buscar e remover + menu
```c
#include <stdio.h>
#define MAX 100

int fila[MAX], inicio = 0, fim = 0;

void enfileirar(int x) {
    if (fim < MAX) fila[fim++] = x;
    else printf("Fila cheia!\n");
}

void listar() {
    printf("Fila: ");
    for (int i = inicio; i < fim; i++) printf("%d ", fila[i]);
    printf("\n");
}

int buscar(int x) {                 // percorre de inicio a fim
    for (int i = inicio; i < fim; i++)
        if (fila[i] == x) return i;
    return -1;
}

int remover() {                     // retira do inicio
    if (inicio == fim) { printf("Fila vazia!\n"); return -1; }
    return fila[inicio++];
}

int main() {
    int op, x;
    do {
        printf("\n1-Inserir 2-Listar 3-Buscar 4-Remover 5-Sair: ");
        scanf("%d", &op);
        switch (op) {
            case 1: printf("Valor: "); scanf("%d", &x); enfileirar(x); break;
            case 2: listar(); break;
            case 3: printf("Valor: "); scanf("%d", &x);
                    printf(buscar(x) != -1 ? "Encontrado!\n" : "Nao achou!\n"); break;
            case 4: { int r = remover(); if (r != -1) printf("Removido: %d\n", r); } break;
        }
    } while (op != 5);
    return 0;
}
```

---

# 5. Perguntas conceituais adicionais (C)

**1. Passagem por valor x por referência:**
- **Por valor:** a função recebe uma **cópia** do dado; alterar dentro da função **não** muda o original.
  ```c
  void naoMuda(int x) { x = 99; }      // nao altera a variavel da main
  ```
- **Por referência (ponteiro):** passa-se o **endereço** (`&`), e a função altera o original via `*`.
  ```c
  void muda(int *x) { *x = 99; }       // ALTERA a variavel da main
  // chamada: muda(&n);
  ```
- ➡️ **Só a passagem por referência (ponteiros) permite a função modificar variáveis da `main`.** Por isso `inserir`, `remover` etc. recebem `int *quantidade`.

**2. Variáveis globais x locais:**
- **Local:** declarada dentro de uma função; existe só naquele escopo; só é vista ali.
- **Global:** declarada fora de todas as funções; visível em todo o programa, vive durante toda a execução.
- **Problemas das globais:** qualquer função pode alterá-las (efeitos colaterais difíceis de rastrear), dificultam manutenção e reuso, e podem gerar bugs. Na **Atividade Estruturada 2**, usar o vetor/quantidade como global facilita no começo, mas o ideal é passá-los por **parâmetro (ponteiro)** para deixar claro quem altera o quê.

---

## CHECKLIST FINAL (decore isto)

1. `topo = -1` (pilha), `inicio = fim = 0` (fila), `quantidade = 0` (lista).
2. Pilha = LIFO (push/pop no topo). Fila = FIFO (enfileira no fim, desenfileira no início).
3. Busca binária só em lista **ordenada** → O(log n). Linear → O(n).
4. Inserir no fim da desordenada = O(1); inserir na ordenada = O(n) (desloca).
5. Bubble sort = O(n²) (dois laços aninhados).
6. Ponteiro (`*`/`&`) = passagem por referência = altera variável da `main`.
7. Funções de `<ctype.h>`: `isalpha()`, `isdigit()`, `tolower()`.

Boa prova! 🚀
