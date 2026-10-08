# PickPop 3.0 — catálogo real

A versão atual tem seis produtos verificados com fotografias licenciadas, dez artigos e links com a tag `pickpop03-20`. Consulte `../docs/RELEASE-3.0.md` e `../docs/CATALOG-3.0.md` para as verificações e o cadastro atual. As instruções de dados demonstrativos abaixo documentam a fundação 2.0; o catálogo público agora usa registros verificados.

Evolução do projeto existente, com HTML estático, CSS original e módulos JavaScript. Não há React, banco de dados, servidor para visitantes ou dependências pagas. Todos os textos públicos estão em inglês americano.

## Visualizar

No Windows, abra `start-local.cmd`. Ele encontra Python 3 ou o runtime do Codex, gera as páginas e inicia uma prévia apenas neste computador.

Com Python 3.9 ou superior:

```sh
cd pickpop-site
python build.py
python serve.py --directory dist --port 8082
```

Abra `http://127.0.0.1:8082/`. Use Ctrl+C para parar. Se a porta estiver ocupada, escolha outra. Não abra `index.html` diretamente: o catálogo usa requisições locais e caminhos absolutos.

## Funcionalidades

- Good Finder: pesquisa real sobre o catálogo interno, cinco categorias, orçamento exato, estilos, prioridade e ordenação.
- Favoritos com persistência opcional, tratamento de armazenamento bloqueado e sincronização entre abas.
- Quiz Find Your Vibe em quatro etapas, com critérios determinísticos e motivos da seleção.
- Comparação de até três ideias, carregamento, erros com nova tentativa e estados sem resultados.
- Quatro guias editoriais, três coleções e páginas de detalhes, About, Privacy, Disclosure e Contact.
- Páginas estáticas com canonical, metadados individuais, Open Graph, sitemap e Schema factual. Filtros e detalhes demonstrativos não são indexáveis.
- Fontes locais com licenças, navegação por teclado, controles para celular e movimento reduzido.

O catálogo preserva **20 conceitos ilustrativos**, não produtos específicos verificados. Os valores são alvos editoriais demonstrativos, nunca preços atuais ou garantia de compra dentro do orçamento. Itens verificados sem preço autorizado não são excluídos por uma falsa promessa de preço.

Os botões atuais abrem pesquisas comuns na Amazon, sem tag ou comissão. API, links remunerados e analytics externos estão desativados. O endereço de contato depende de informação do proprietário; a página explica isso sem simular um formulário.

## Estrutura e edição

- `data/catalog.json`: fonte única do catálogo. Veja `../docs/CATALOG.md`.
- `data/site.json`: configurações públicas, nunca segredos.
- `templates/`: fonte das páginas, cabeçalho/rodapé compartilhados e artigos.
- `build.py`: gera 36 páginas na raiz e um artefato limpo em `dist/`.
- `assets/js/`: busca, favoritos, cartões, quiz, comparação e limites das futuras integrações.
- `assets/css/styles.css`: identidade preservada; `platform.css`: evolução da experiência.
- `assets/fonts/`: DM Sans e Outfit, com as licenças SIL OFL.
- `tests/`: regras de catálogo, fluxos no navegador, acessibilidade e validação estática.

Edite os templates; os HTML gerados são sobrescritos pelo build. `dist/` é gerado e ignorado pelo Git. O arquivo ZIP original permanece preservado. O build não publica o site.

## Testes

```sh
python build.py
python tests/validate_site.py
node --test tests/catalog.test.mjs
```

Os testes no navegador são opcionais para desenvolvimento; não fazem parte do build da Netlify. Com Node, Chrome e uma prévia em execução:

```sh
npm install --no-save --package-lock=false playwright axe-core lighthouse
```

Configure `PICKPOP_TEST_URL=http://127.0.0.1:8082` no terminal e execute `node tests/mvp.cjs` e `node tests/quality.cjs`. O teste de qualidade usa essa porta por padrão; o teste de fluxos usa 8080 quando a variável não é definida. `PICKPOP_BROWSER=msedge` seleciona Edge. `PICKPOP_AXE_PATH` permite usar uma cópia local do axe. Capturas e relatórios ficam em `tests/artifacts/`, ignorados no Git.

O teste de fluxos verifica todas as 36 páginas em 360, 768 e 1440 px, busca, orçamento, filtros, favoritos, quiz, comparação, teclado, links e metadados. O axe verifica páginas representativas em mobile/desktop. Lighthouse pode ser executado separadamente contra a prévia local. Testes automáticos não equivalem à certificação WCAG ou à verificação em celulares físicos.

## Netlify — somente após autorização

Configuração da conexão Git:

| Campo | Valor |
| --- | --- |
| Branch to deploy | `main`, apenas após aprovar e integrar o candidato |
| Base directory | `pickpop-site` |
| Build command | `python build.py` |
| Publish directory | `dist` |
| Functions directory | Manter padrão; não há funções neste MVP |
| Environment variables | Nenhuma necessária atualmente |

O `netlify.toml` na raiz do repositório fixa base, build e diretório de publicação, independentemente dos padrões antigos do painel. A configuração dentro desta pasta também permite usá-la isoladamente. É necessário Python 3.9+ no ambiente de build. Para envio manual autorizado, publique **somente o conteúdo de `pickpop-site/dist`**, não o repositório ou a pasta de fontes. Os cabeçalhos de segurança estão em `_headers`.

A conexão Git/Netlify pode publicar automaticamente um push na branch de produção. O proprietário autorizou expressamente a publicação da versão 2.0 após a revisão local. A versão anterior está preservada pela tag `pickpop-before-2.0-20261008`; o resultado da publicação deve ser confirmado no domínio oficial. O servidor local replica os cabeçalhos para os testes, mas usa cache desativado para facilitar a revisão.

## Entrega e pendências

Leia `../docs/AUDIT-2.0.md` para o diagnóstico e decisões, `../docs/RELEASE-2.0.md` para os resultados executados e `../docs/CATALOG.md` para cadastro e limites comerciais. A aprovação de publicação, um contato verdadeiro, os produtos verificados, links oficiais e eventuais acessos externos dependem do proprietário.
