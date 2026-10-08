# PickPop 3.0 — primeira entrega do catálogo real

## Escopo e estado

Esta entrega continua o gerador estático e os componentes do PickPop 2.0. Não introduz framework, servidor, banco de dados ou serviço pago. A publicação foi autorizada expressamente pelo proprietário.

**Meta de 20 produtos ainda não atingida:** seis produtos passaram pela conferência de identidade, fontes e fotografia licenciada correspondente. Quatorze candidatos permanecem fora do artefato público; consulte `RESEARCH-3.0.md`. Não são publicados como produtos reais sem essas verificações. Não há garantia de estoque atual, preço, vendedor ou comissão.

- 6 produtos reais no catálogo publicado: CHEMEX CM-6A, Logitech M185 Swift Grey, Logitech K120 US, Logitech C920, Lodge L10SK3 de 12 polegadas e KONG Classic Medium vermelho.
- 6 fotografias independentes: licenças CC BY, CC BY-SA ou CC0, atribuídas nas páginas dos produtos e em `/image-credits/`. WebP com dimensão máxima de 960 px; adaptação sob a mesma licença indicada. Nenhuma imagem foi copiada da Amazon.
- 6 URLs de produto Amazon.com com ASIN conferido nos títulos das páginas consultadas; 6 URLs diretas com a tag **pickpop03-20**, fornecida pelo proprietário. A versão anterior da tag foi substituída antes da publicação.
- 10 artigos originais, de 565 a 657 palavras no corpo, com fontes, orientações, comparações e links internos. Não há alegação de testes físicos.
- Busca local por nome, marca, modelo, categoria, descrição, características e palavras relacionadas. Filtros combinados, ordenação alfabética, favoritos, comparação de até três produtos e quiz explicável preservados.
- Orçamento não exclui produtos sem preço autorizado e não é uma promessa de preço. Não há preços, ofertas, notas de avaliação ou estoque inventados.
- `CuratedCatalogProvider` funciona imediatamente. `AmazonCreatorsApiProvider` está desativado; testes de contrato usam transporte sintético, sem chamadas à Amazon.
- Identificação de afiliação perto dos cartões e botões, no rodapé e em `/disclosure/`; links remunerados têm `rel="sponsored noopener noreferrer"`.
- Canonical/OG oficiais, 26 URLs no sitemap, artigos e produtos verificáveis indexáveis; filtros sem indexação. Build estático de 29 páginas compatível com a Netlify atual.

## Validação dos links e limites

As páginas sem tag foram consultadas na Amazon e seus títulos conferidos contra os produtos; fontes de fabricante documentam os atributos. Os testes verificam hostname, HTTPS, ASIN no caminho, ausência de redirecionamento oculto, tag exata e atributos patrocinados. A ferramenta de pesquisa não conseguiu obter as URLs com query de afiliado (cache miss); isso não foi declarado como teste HTTP aprovado. O formato é uma URL direta Amazon.com `/dp/ASIN?tag=pickpop03-20`, permitida para Special Links criados pelo participante. Não houve compra, verificação de comissão ou acesso ao painel Associates. A atribuição comercial precisa ser conferida nas ferramentas e relatórios da conta do proprietário.

O campo de habilitação comercial corresponde à autorização e confirmação de cadastro inicial pelo proprietário, não a uma certificação externa de aprovação final da conta. A Creators API exige acesso separado e continua desligada.

## Testes executados antes do deploy

- Build Python: **aprovado**, 29 páginas e 26 URLs de sitemap.
- Node: **10 testes aprovados** para catálogo, palavras-chave, filtros combinados, orçamento, ordenação, favoritos, destinos patrocinados e contratos de provedores com falhas simuladas.
- Validação estática: **aprovada**, 908 referências locais, títulos/canonicals individuais, schemas factuais e nenhum arquivo de desenvolvimento no artefato.
- Chrome/Playwright: **aprovado**, busca, filtros, favoritos persistentes e opt-out, armazenamento bloqueado/corrompido e entre abas, comparação, quiz, falha/nova tentativa, teclado, imagens, links e **87 layouts em 360/768/1440 px**.
- Axe 4.14.0: **28 auditorias sem violações automáticas WCAG A/AA**, com cabeçalhos de produção e sem erros de console/CSP no ambiente local. Verificações incompletas exigem revisão humana; não é certificação WCAG.
- Fotografias: fontes/licenças conferidas e imagens inspecionadas visualmente; itens com variantes incertas excluídos.
- Assinaturas comuns de credenciais: nenhuma encontrada no artefato de texto. Nenhuma chave da Amazon ou Netlify foi criada ou adicionada ao frontend.

Lighthouse mobile local: **97 Performance, 100 Accessibility, 100 Best Practices e 100 SEO**. São medidas de laboratório, não dados de usuários reais. A revisão visual final também removeu o círculo decorativo dos cartões que cobria parte das fotografias.

Capturas e relatórios de laboratório ficam em `pickpop-site/tests/artifacts/`, ignorados pelo Git. Estado de produção será registrado após a verificação efetiva do domínio.

## Arquivos principais alterados

`data/site.json`, `data/catalog.json`, `assets/products/`, `assets/js/catalog.js`, `providers.js`, `amazon-adapter.js`, `cards.js`, `finder.js`, `quiz.js`, `comparison.js`, `assets/css/platform.css`, `build.py`, templates de finder/resultados/quiz/about/privacy/footer, dez templates de artigos, testes e páginas geradas. O catálogo demonstrativo anterior foi preservado em `docs/catalog-demo-2.0.json`, fora de `dist/`.

## Ponto de retorno e publicação

- Commit anterior publicado: `972f4e4c61c15ebab72bc5119d5eb5a210ca1fd1`.
- Tag local: `pickpop-before-3.0-20261008`.
- Arquivo ZIP do código anterior: `.tools/backups/pickpop-before-3.0.zip`, ignorado pelo Git.
- Desenvolvimento: `codex/pickpop-3`. Publicação via integração Git existente da branch `main`; base `pickpop-site`, build `python build.py`, publish `dist`.

## Pendências

1. Ampliar o catálogo de seis para vinte itens, confirmando ASIN, variante e uma foto autorizada para cada item. Home e Organization ainda não têm itens publicados; filtros apresentam vazio honestamente. Canecas também não foram publicadas sem foto da variante exata.
2. Proprietário: cadastrar/confirmar o domínio oficial na conta Associates, conferir o reconhecimento dos links com a ferramenta oficial e acompanhar a revisão da conta e os relatórios. O site não confirma vendas da Amazon.
3. Fornecer um e-mail empresarial verdadeiro para habilitar o contato público. Não foi inventado endereço.
4. API: solicitar acesso quando elegível e implementar/revisar um endpoint seguro no servidor, incluindo regras de cache, imagens, preço e validade. Não fornecer segredos no catálogo.
5. Eventual aviso do selo da Netlify já documentado na versão 2.0: verificar em produção; não enfraquecer a CSP para ocultá-lo.

## Fontes oficiais consultadas

- [Amazon Associates — Program Policies](https://affiliate-program.amazon.com/help/operating/policies): requisitos de Special Links, identificação e uso de conteúdo.
- [Amazon Creators API — Introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction): operações e acesso autorizado separado do cadastro inicial.
- Fontes de fabricantes e licenças específicas estão nos registros de `data/catalog.json` e nas páginas públicas de cada produto.
- Artigos de armazenamento e estação de trabalho incluem FDA, FoodSafety.gov, McCormick e OSHA onde há afirmações verificáveis; sugestões de organização são orientações editoriais.
