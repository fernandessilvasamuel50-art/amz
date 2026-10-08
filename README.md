# PickPop

**PickPop 2.0 publicado:** https://pickpop.netlify.app/ — confira `docs/DEPLOY-2.0.md` para a verificação em produção e as pendências comerciais.

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

As 20 ideias são demonstrativas, sem produtos reais, preços atuais, API ou comissões. Amazon abre como pesquisa comum. Contato empresarial e integrações permanecem desativados até receber informações verdadeiras.

A versão 2.0 foi desenvolvida na branch `pickpop-2-mvp`; sua publicação foi autorizada expressamente pelo proprietário. O ponto anterior está preservado pela tag `pickpop-before-2.0-20261008`. A configuração Netlify na raiz define base `pickpop-site`, build `python build.py` e publicação `dist`.
