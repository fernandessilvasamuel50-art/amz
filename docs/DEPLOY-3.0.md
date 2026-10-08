# PickPop 3.0 — publicação verificada

Publicação autorizada pelo proprietário em **https://pickpop.netlify.app/**, pela integração Git existente. O commit de aplicação `127d034` foi integrado em `main` e enviado em 8 de outubro de 2026 UTC. Nenhum serviço pago, alteração de DNS ou nova credencial foi necessário. Não havia acesso autenticado ao painel Netlify; o resultado foi confirmado no próprio domínio.

## Conteúdo confirmado em produção

- Catálogo e configuração iguais ao artefato final, com normalização das quebras de linha do Git: **6 produtos reais, 6 fotografias licenciadas, 6 URLs Amazon.com e 6 links com `pickpop03-20`**.
- As seis fotografias públicas correspondem byte a byte aos arquivos locais revisados.
- Dez artigos completos acessíveis; todas as 26 páginas do sitemap, finder e contato retornaram HTTP 200.
- Sitemap, robots e CSS final conferidos contra o artefato. Canonical e Open Graph usam o domínio oficial.
- `/.env`, `/.git/HEAD`, `/build.py`, `/README.md` e `/tests/catalog.test.mjs` retornam HTTP 404.
- A divulgação “As an Amazon Associate I earn from qualifying purchases.” está presente. Os links remunerados diretos têm `rel="sponsored noopener noreferrer"`; os testes verificam a tag e o ASIN. Nenhuma compra ou comissão foi testada. A inscrição inicial e a tag foram informadas pelo proprietário, sem alegar aprovação final externa da conta.

## Qualidade publicada

- Lighthouse mobile: **93 Performance, 100 Accessibility, 92 Best Practices, 100 SEO**. Medição de laboratório, não resultado garantido para todos os visitantes.
- Axe: **28 auditorias, zero violações automáticas WCAG A/AA**. O comando estrito de console terminou com falha exclusivamente pelo aviso do selo Netlify descrito abaixo; não é declarado integralmente aprovado.
- A primeira execução funcional recebeu HTTP 403 durante a navegação automatizada, após os fluxos interativos. A conferência individual posterior encontrou HTTP 200 nas 28 páginas públicas. **A repetição isolada do teste completo foi aprovada**, incluindo busca, filtros, favoritos/privacidade/armazenamento, comparação, quiz, falhas/nova tentativa, teclado, links, fotografias e **87 layouts em 360/768/1440 px**. Não foram registrados erros JavaScript não tratados ou chamadas a serviços externos no teste funcional.

O script `/.netlify/scripts/hud?variant=public`, injetado pela hospedagem, produz um script inline no iframe `about:srcdoc` que a CSP bloqueia. É o mesmo aviso observado na versão 2.0. A proteção não foi enfraquecida. Quando disponível, o proprietário pode desativar **Project configuration → General → Powered by Netlify badge** no painel. A [documentação oficial](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/) descreve esse ajuste. Não houve falha crítica das funções do PickPop que exigisse restauração.

## Retorno e pendências

O ponto anterior está preservado no commit `972f4e4c61c15ebab72bc5119d5eb5a210ca1fd1`, na tag enviada `pickpop-before-3.0-20261008` e no ZIP local `.tools/backups/pickpop-before-3.0.zip`. Não é necessário reescrever o histórico para restaurar; use o histórico de deploy da Netlify ou um commit de reversão revisado.

A meta de vinte produtos permanece incompleta: quatorze candidatos sem conferência suficiente de identidade/fotografia ficaram fora da publicação. Consulte `RESEARCH-3.0.md`. Creators API e analytics externos continuam desativados. Faltam um contato empresarial verdadeiro, a conferência do domínio e dos links nas ferramentas da conta Associates e, futuramente, acesso autorizado à API. Não são necessárias senhas ou informações fiscais no código.
