# Publicação autorizada do PickPop 2.0

O proprietário autorizou expressamente publicar em https://pickpop.netlify.app/ usando a integração/credenciais existentes, sem serviços pagos, alteração de DNS ou novas integrações externas.

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

Um push aprovado não comprova que houve deploy. Confirmar o novo script de entrada, o catálogo e as páginas no domínio oficial; executar os testes funcionais e auditorias no site publicado. O resultado final deve ser registrado separadamente após essa verificação.

Se a conexão Git não disparar a publicação e não houver sessão/credenciais Netlify disponíveis, o procedimento único restante é abrir o projeto PickPop na Netlify, entrar em **Deploys** e enviar a pasta `pickpop-site/dist` à área de deploy manual. Não criar outro site nem enviar a pasta com fontes/testes.

## Monetização

Configuração central em `data/site.json` e `data/catalog.json`, conforme `CATALOG.md`. Ainda faltam cadastro/autorização no programa americano, identificador e links oficiais fornecidos, recomendações de produtos realmente verificadas e contato empresarial. A API permanece desativada. A divulgação exigida e `rel="sponsored"` são aplicados ao ativar links pagos autorizados; não se afirma participação inexistente. Políticas oficiais foram consultadas novamente nesta preparação.
