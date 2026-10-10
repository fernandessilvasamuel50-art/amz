# PickPop — catálogo e operação comercial

Site: https://pickpop.netlify.app/. Sete produtos reais com fontes, ASINs, fotografias licenciadas e links diretos associados à tag oficial **pickpop03-20**; dez artigos, cinco otimizados para decisões de compra. Atribuição, pedidos e comissões dependem dos relatórios oficiais Amazon, não de nossos testes técnicos.

O projeto continua a base original com HTML estático, CSS próprio e módulos JavaScript. Python gera as páginas; não há React, banco de dados ou servidor para visitantes. Conteúdo público em inglês americano. Nenhum preço, avaliação ou estoque ao vivo é apresentado.

## Visualizar localmente

No Windows, abra `start-local.cmd`. Ou use Python 3.9+:

```sh
cd pickpop-site
python build.py
python serve.py --directory dist --port 8082
```

Abra http://127.0.0.1:8082/. Ctrl+C encerra a prévia. Não abra o HTML diretamente: o catálogo usa requisições e caminhos absolutos. Esses comandos não publicam o site.

## Funcionalidades e limites

- Good Finder pesquisa nomes, marcas, categorias e palavras relacionadas; combina filtros, prioridades, estilos e ordenação. Sem preço autorizado, orçamento é preferência, não garantia.
- Favoritos com persistência opcional e armazenamento bloqueado tratado; quiz determinístico e explicável; comparação de até três produtos.
- Dez guias, três coleções, detalhes, About, Privacy, Affiliate Disclosure, Contact e créditos de imagens.
- Links Amazon diretos com `rel="sponsored"`, divulgação visível e origem preservada; sem redirecionamentos ocultos.
- HTML indexável com títulos, descrições, canonicals, Open Graph, sitemap e Schema factual. Não há avaliações/ofertas inventadas.
- Analytics externos e Creators API desativados. O adaptador de analytics exige aprovação do proprietário e consentimento. `/find/?diagnostics=1` habilita diagnóstico voluntário em memória, destinado apenas a QA, nunca ao painel comercial.
- `contactEmail` depende de um canal verdadeiro do proprietário; a página Contact explica sua ausência.

## Estrutura e edição

- `data/catalog.json`: catálogo central; fontes e licença por item. Veja `../docs/CATALOG-3.0.md` e `../docs/AFFILIATE-AUDIT.csv`.
- `data/site.json`: configurações públicas, tag e token público Search Console; nunca segredos.
- `data/editorial.json`: motivos das recomendações associadas aos artigos.
- `templates/`: fontes de páginas, artigos e componentes compartilhados.
- `build.py`: gera 30 páginas e o artefato limpo `dist/`, com 27 URLs no sitemap.
- `assets/js/`: busca, favoritos, quiz, comparação, provedores e diagnóstico.
- `assets/css/`: identidade visual e ajustes responsivos; fontes locais em `assets/fonts/` com licenças OFL.
- `tests/`: validação estática, catálogo, eventos, fluxos e acessibilidade.

Edite templates e dados; o build sobrescreve os HTML gerados. `dist/` e `tests/artifacts/` são ignorados pelo Git. O ZIP original está preservado.

## Testes

```sh
python build.py
python tests/validate_site.py
node --test tests/catalog.test.mjs tests/growth.test.mjs
```

Os testes opcionais de navegador precisam de Node, Chrome, Playwright e axe-core. Instale somente para desenvolvimento:

```sh
npm install --no-save --package-lock=false playwright axe-core lighthouse
```

Configure `PICKPOP_TEST_URL=http://127.0.0.1:8082` e execute `node tests/mvp.cjs`, `node tests/growth.cjs` e `node tests/quality.cjs`. `PICKPOP_BROWSER=msedge` seleciona Edge e `PICKPOP_AXE_PATH` permite uma cópia local do axe. O mvp verifica 30 páginas nas larguras 360, 768 e 1440; quality faz 38 auditorias representativas, incluindo console e CSP. Growth intercepta navegação Amazon para validar URLs sem criar cliques comerciais artificiais. Testes automáticos não certificam WCAG nem substituem celulares físicos.

## Netlify

| Campo | Valor |
| --- | --- |
| Branch | `main` |
| Base directory | `pickpop-site` |
| Build command | `python build.py` |
| Publish directory | `dist` |
| Functions | Padrão; não há funções ativas |
| Environment variables | Nenhuma necessária atualmente |

O `netlify.toml` da raiz fixa a configuração. Somente `dist/` deve ser publicado manualmente. Cabeçalhos de segurança estão em `_headers`; o servidor local os replica. Push em `main` pode gerar deploy automaticamente: publicar apenas dentro da autorização vigente. A operação primeiras vendas foi autorizada; o retorno anterior está preservado pela tag `pickpop-before-growth-20261009`. O selo da Netlify foi desativado no painel em 10/10/2026 para remover seu script conflitante com CSP, sem relaxar a proteção.

## Continuidade

Consulte `../docs/GROWTH-OPERATIONS.md` para estado real, testes e próxima ação; `../docs/FIRST-SALES-14-DAYS.md` para o plano; `../marketing/pinterest/` para 12 rascunhos originais; `../operations/` para o painel offline. Pins não estão publicados/agendados, medições comerciais continuam indisponíveis e a meta inicial de 12 produtos permanece em andamento. Não usar dados de QA como tráfego ou comissões.
