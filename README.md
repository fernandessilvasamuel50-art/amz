# PickPop

**PickPop 3.0 — primeira entrega do catálogo real publicada:** https://pickpop.netlify.app/ — confira `docs/DEPLOY-3.0.md` e `docs/RELEASE-3.0.md` para a verificação em produção e as pendências comerciais. A meta de vinte produtos permanece pendente; seis passaram pelas verificações e estão públicos.

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

A versão 3.0 contém seis produtos reais com fontes, ASINs e fotografias independentes licenciadas; dez artigos completos e busca local. Links remunerados usam a tag oficial `pickpop03-20`. Não há preços/estoque ao vivo nem API conectada. A meta de vinte produtos ainda depende das verificações registradas em `docs/RESEARCH-3.0.md`. Consulte `docs/RELEASE-3.0.md` para testes e limitações.

A versão 2.0 foi desenvolvida na branch `pickpop-2-mvp`; sua publicação foi autorizada expressamente pelo proprietário. O ponto anterior está preservado pela tag `pickpop-before-2.0-20261008`. A configuração Netlify na raiz define base `pickpop-site`, build `python build.py` e publicação `dist`.
