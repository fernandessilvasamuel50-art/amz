# PickPop

**PickPop — operação primeiras vendas:** https://pickpop.netlify.app/ — sete produtos reais com fotografias licenciadas, dez artigos e links com a tag oficial `pickpop03-20`. Consulte `docs/GROWTH-OPERATIONS.md` para testes, publicação, Search Console e pendências comerciais. A meta inicial de 12 produtos depende de mais cinco itens com variantes e imagens verificadas.

Plataforma americana de descoberta de ideias de compra. A versão 2.0 continua o projeto original com Good Finder, filtros de estilo/orçamento, favoritos, quiz explicável, comparações, blog e coleções editoriais.

## Prévia local

Abra `pickpop-site/start-local.cmd` no Windows, ou:

```sh
cd pickpop-site
python build.py
python serve.py --directory dist --port 8082
```

Visite `http://127.0.0.1:8082/`. Python 3.9+ é usado apenas para gerar páginas e visualizar localmente. Não há publicação automática por esses comandos.

## Arquivos

- `pickpop-site/`: aplicação, templates, catálogo e testes. Consulte o [README completo](pickpop-site/README.md).
- `docs/AUDIT-2.0.md`: auditoria e arquitetura recomendada.
- `docs/CATALOG.md`: cadastro de dados e preparação das integrações.
- `docs/RELEASE-2.0.md`: entrega por fase e validações executadas.
- `pickpop-site-v1.zip`: arquivo original preservado.

A versão pública contém sete produtos reais com fontes, ASINs e fotografias independentes licenciadas; dez artigos completos e busca local. Cinco guias receberam comparações e recomendações comerciais. Não há preços/estoque ao vivo nem API conectada. Testes técnicos de links não confirmam pedidos ou atribuição no painel Amazon.

Os 12 Pins originais em `marketing/pinterest/` são rascunhos, não publicações ou agendamentos. O painel offline `operations/dashboard.html` exibe somente observações com fonte e data; métricas indisponíveis permanecem indisponíveis. Consulte `docs/FIRST-SALES-14-DAYS.md` para o cronograma de R$ 0.

A versão 2.0 foi desenvolvida na branch `pickpop-2-mvp`; sua publicação foi autorizada expressamente pelo proprietário. O ponto anterior está preservado pela tag `pickpop-before-2.0-20261008`. A configuração Netlify na raiz define base `pickpop-site`, build `python build.py` e publicação `dist`.
