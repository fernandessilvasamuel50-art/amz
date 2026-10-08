# Publicação autorizada do PickPop 2.0

O proprietário autorizou expressamente publicar em https://pickpop.netlify.app/ usando a integração/credenciais existentes, sem serviços pagos, alteração de DNS ou novas integrações externas.

## Resultado: publicado e verificado

A integração Git publicou a versão 2.0 em **https://pickpop.netlify.app/** após o envio do commit `a49d04e` em `main`. A branch `pickpop-2-mvp` e a tag de retorno também foram enviadas. A publicação foi confirmada pelo conteúdo no domínio oficial, não somente pelo sucesso do push: script de entrada 2.0, catálogo igual ao revisado, quiz, sitemap e cabeçalhos de produção presentes. O painel Netlify pede login e não disponibilizou logs/ID de deploy nesta sessão; não foi criada nenhuma nova credencial.

Verificação em produção, em 8 de outubro de 2026 UTC (7 de outubro no horário local):

- **Teste funcional aprovado:** busca combinada, limites exatos, filtros, ordenação, favoritos/privacidade/armazenamento, comparação, quiz, falhas/nova tentativa, teclado, links e metadados; **108 layouts** nas 36 páginas, em 360/768/1440 px.
- **Acessibilidade:** 22 auditorias axe, **0 violações automáticas A/AA**. A asserção estrita de console do script `quality.cjs` falhou pelo aviso do selo da hospedagem descrito abaixo; não se declara esse comando integralmente aprovado em produção.
- **Lighthouse mobile na Home publicada:** Performance **92**, Accessibility **100**, Best Practices **92**, SEO **100**. Medição de laboratório, sem promessa de pontuação permanente ou certificação WCAG.
- **SEO/segurança:** 13 URLs no sitemap, robots ativo, canonical/OG oficiais, CSP e noindex dos filtros presentes. `/build.py`, `/README.md`, `/tests/mvp.cjs`, `/.env` e `/.git/HEAD` retornaram **404**.
- **Integrações:** catálogo demonstrativo preservado; afiliados, API e analytics externos seguem desativados. Nenhuma nova integração ou coleta foi ativada.

Relatórios e capturas de produção estão em `pickpop-site/tests/artifacts/results.json`, `quality.json`, `lighthouse-production-mobile.json`, `mobile.png` e `desktop.png`. Os relatórios locais anteriores estão em `tests/artifacts/predeploy/`. São artefatos locais ignorados pelo Git.

## Aviso não crítico da hospedagem

A Netlify injeta `/.netlify/scripts/hud?variant=public`, que tenta executar um script inline em um iframe `about:srcdoc`. A CSP bloqueia esse script, gerando um aviso no console e reduzindo Best Practices no Lighthouse. A origem foi confirmada em um navegador limpo antes de carregar o axe, pelo script injetado e pelo iframe; não vem do código do PickPop. Nenhuma função do site falhou por esse aviso. A proteção foi mantida.

O ajuste opcional é entrar no projeto PickPop na Netlify e selecionar **Project configuration → General → Powered by Netlify badge**, desativar e salvar. A [documentação oficial](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/) informa que não é necessário redeploy e que o bloqueio por CSP não afeta o restante do projeto. Não havia sessão Netlify nem configuração CLI autenticada disponível para executar esse ajuste nesta revisão. Não foi feito contorno ou enfraquecimento da CSP.

Não houve problema crítico que exigisse restauração. Nenhum plano pago foi contratado e nenhum DNS foi alterado.

## Ponto de retorno

- Versão anterior: `61e726918a9ae4d3ab6483eb9ef704496cd09249`.
- Tag: `pickpop-before-2.0-20261008`.
- Cópia local completa do código anterior: `.tools/backups/pickpop-before-2.0.zip`.
- Cópia da Home publicada anterior: `.tools/backups/published-home-before-2.0.html`.

Backups são locais e ignorados pelo Git. Em caso de falha crítica da nova versão, restaure o deploy anterior pelo histórico da Netlify ou faça um commit de reversão da mudança de versão, mantendo o histórico Git.

## Verificações anteriores ao envio

- Build de produção: aprovado, 36 páginas, 13 URLs no sitemap.
- Validação estática: aprovada, 1.045 referências locais, canonical/OG com domínio oficial, Schema factual.
- Testes unitários: 8 aprovados.
- Chrome local: fluxos funcionais aprovados e 108 layouts em 360/768/1440 px.
- Axe: 22 auditorias aprovadas, sem violações automáticas A/AA ou erros críticos de console/CSP.
- Segurança: sem assinaturas de credenciais encontradas nos arquivos de texto rastreados; sem arquivos de configuração sensíveis no artefato. Uma varredura não é garantia de ausência de toda vulnerabilidade.
- Desempenho: medições locais já registradas em `RELEASE-2.0.md`; não representam o domínio publicado.

## Publicação e confirmação

O caminho é integrar `pickpop-2-mvp` em `main` e enviar ao repositório já conectado. A configuração da raiz fixa base `pickpop-site`, comando `python build.py` e publish `dist`; não há funções ou variáveis secretas exigidas pelo MVP.

Um push aprovado não comprova que houve deploy. A confirmação do conteúdo e os testes no domínio oficial foram executados, conforme o resultado acima.

A conexão Git disparou a publicação; não foi necessário upload manual nem criar outro site.

## Monetização

Configuração central em `data/site.json` e `data/catalog.json`, conforme `CATALOG.md`. Ainda faltam cadastro/autorização no programa americano, identificador e links oficiais fornecidos, recomendações de produtos realmente verificadas e contato empresarial. A API permanece desativada. A divulgação exigida e `rel="sponsored"` são aplicados ao ativar links pagos autorizados; não se afirma participação inexistente. Políticas oficiais foram consultadas novamente nesta preparação.

Antes de se inscrever, ampliar conteúdo original útil e publicar recomendações verificadas. O site tem quatro artigos neste MVP; a Amazon recomenda conteúdo robusto e cita cerca de dez posts como referência, sem garantir aprovação. O processo oficial prevê revisão após pelo menos três vendas qualificadas nos primeiros 180 dias, excluindo compras pessoais. Consulte o [processo de avaliação oficial](https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM).

Depois da preparação editorial, cadastrar o domínio no [Amazon Associates americano](https://affiliate-program.amazon.com/), completar os dados reais solicitados pelo programa e fornecer a tag e URLs oficiais autorizadas. Não enviar senhas ou dados fiscais pelo catálogo/repositório. A API não é necessária para começar com links oficiais e conteúdo devidamente verificado.
