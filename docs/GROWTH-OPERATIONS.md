# Operação primeiras vendas — atualizado em 2026-10-10

## Estado atual e próxima ação

**Site atualizado e verificado:** https://pickpop.netlify.app/. Implementação `3ee2eb5`, atualização de privacidade `2dbb143` em `main`, com histórico em `codex/first-sales`. Retorno anterior preservado em `ca90fc7`, tag remota `pickpop-before-growth-20261009`. Sem gastos, alteração de DNS, criação de credenciais ou promessa de receita.

- **7 produtos reais / 7 fotografias licenciadas / 7 links remunerados com pickpop03-20.** Identidade e formato dos links auditados individualmente em AFFILIATE-AUDIT.csv. Atribuição, pedidos e comissões ainda não confirmados no painel Amazon.
- **10 artigos, 5 otimizados:** coffee-station, coffee-maker-small-apartment, small-apartment-kitchen-essentials, small-kitchen e smart-gifts. Comparações de decisão, produtos relevantes, motivos concretos, limitações e CTAs diretos.
- Good Finder, filtros, favoritos, quiz explicável e comparação preservados. Orçamento é preferência quando não existe preço autorizado.
- **12 peças Pinterest originais prontas, nenhuma publicada/agendada.** Conta e autorização específica pendentes. Segundo canal opcional: Instagram, três textos preparados, sem postagem ou conta criada.
- Search Console verificado via HTML. Sitemap reenviado em 10/10; teste ao vivo do próprio Google buscou o XML com êxito, mas o relatório de sitemaps ainda informa falha. Indexação e dados de desempenho pendentes.
- Aviso CSP do badge Netlify resolvido em 10/10 ao desativar o selo no painel existente. Proteção CSP mantida. Repetição pública: 38 auditorias aprovadas, zero violações e zero erros de console/CSP.
- **Netlify Web Analytics ativado em 10/10 após autorização expressa**, incluído no plano existente. Cobrança conferida: Free, US$ 0, sem upgrade. Política atualizada e publicação confirmada antes da ativação. GA4, pixels e Creators API continuam desligados.
- Painel offline distingue contagens brutas da hospedagem de resultados comerciais. Snapshot 09–10/10: **484 pageviews e 23 estimativa de IPs únicos**, incluindo QA, proprietário, inspeções e possíveis bots. Não são 23 compradores. Brasil 439 / EUA 40 são pageviews, não pessoas nem tráfego qualificado. Nenhuma comissão ou clique Amazon disponível.

**Próxima ação executável:** proprietário valida os sete links na ferramenta oficial Amazon e confirma o site registrado; revisa as peças e conecta/autoriza Pinterest para iniciar o cronograma de 12 publicações. Na próxima revisão técnica, verificar o processamento do sitemap e relatórios Google, respeitando cotas. Não repetir a pesquisa ou reconstruir a arquitetura.

## Implementação e decisões

- `pickpop-site/data/catalog.json`: inclusão OXO Good Grips Silicone Basting & Pastry Brush — Large, modelo 1071061, ASIN B000HD7FJ4. Foto Frank O'Grady, CC BY 4.0; fonte, licença, data e créditos registrados. Sem preço ou avaliação inventados.
- `data/editorial.json`, `build.py`, cinco templates de guias e HTML gerado: recomendações centralizadas, fotos reais, motivos, limitações, divulgação obrigatória e botões View on Amazon junto ao conteúdo útil.
- `assets/js/cards.js`, `page-events.js`: links diretos com sponsored e política strict-origin-when-cross-origin. Origem preservada sem expor consulta/caminho; nenhum redirecionamento intermediário. Não há evidência de que a política antiga tenha causado perda de comissões.
- `assets/css/platform.css`: tabelas legíveis com rolagem acessível e cartões ajustados para 360 px. Sem redesign.
- `data/site.json`: tag oficial preservada e token público legítimo de verificação Google. Nunca inserir credenciais secretas.
- `assets/js/metrics.js`, `analytics-adapter.js`, `diagnostics.js`: eventos com campos permitidos e tópicos agregados; sem consulta bruta, cookie, identificação de visitante ou transmissão por padrão. Diagnóstico opcional em memória é somente QA. Analytics depende de aprovação e consentimento.
- `tests/growth.test.mjs`, `growth.cjs`, `mvp.cjs`, `quality.cjs`: casos comerciais, eventos, acessibilidade, fotos carregadas e catálogo dinâmico.
- `marketing/pinterest/`: 12 PNGs 1000×1500, masters, gerador, contact-sheet, CSV/JSON com título, descrição, keyword, URL relevante, categoria, alt e datas sugeridas 12–22/10. Ilustrações e textos próprios, fontes locais OFL, nenhuma imagem Amazon. UTMs por peça; rascunhos, não links divulgados.
- `operations/report.py`, `observations.json`, `dashboard.html`: painel offline com fonte/data, rejeitando QA, números sem fonte e comissões sem relatório Amazon. Exportações privadas futuras ficam fora do Git.
- `operations/search-console-status.json`: observações reais da interface, sem dados pessoais da conta.
- `operations/hosting-analytics-status.json`: ativação, plano e snapshot agregado real; relatório offline mantém esses números separados das métricas comerciais. A hospedagem não mede eventos internos Good Finder nem cliques externos Amazon.
- READMEs atualizados para evitar instruções demonstrativas antigas contradizendo o catálogo público.

Meta inicial: 12 produtos, faltam 5. Seleção focada em cozinha/organização/espaços pequenos. Balança OXO com foto de variante antiga e outros candidatos sem confirmação exata ficaram fora da publicação. Quantidade não supera licença e identidade. Fontes e oportunidades em GROWTH-RESEARCH.md; não há volumes de keywords, dificuldade ou rankings americanos inventados.

## Verificações executadas

### Antes da publicação — 09/10

- Build: **30 páginas, 27 URLs no sitemap**. Validação: **968 referências locais**, títulos, canonicals e Schema factuais.
- **13 testes unitários aprovados**.
- Fluxos no navegador: **90 layouts** (30 páginas × 360/768/1440 px), busca, filtros combinados, orçamento honesto, favoritos/privacidade, comparação, quiz/retry, teclado, links, imagens e metadados aprovados.
- Teste growth aprovado: cinco guias, sete CTAs iniciais, URL/tag/origem interceptadas sem gerar cliques Amazon artificiais, diagnóstico voluntário e busca OXO.
- **38 auditorias axe**, zero violações automatizadas e nenhum erro local de console/CSP.
- Lighthouse local: **97 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**.
- 12 peças visuais inspecionadas; limites PNG, dimensões, título e descrição aprovados. Validação de rejeições do painel offline aprovada.
- Busca de padrões de segredos não encontrou chaves privadas/tokens secretos usuais. Token HTML de Search Console é público.

### Produção — 09 e 10/10

- Catálogo público igual ao fonte; **7 fotos públicas iguais por SHA-256** aos arquivos licenciados revisados.
- MVP **90 layouts aprovados**, growth aprovado em produção, sem erros de execução da aplicação.
- Em 09/10, quality combinado falhou por 38 avisos CSP do badge injetado pela Netlify; axe sozinho teve zero violações. Não foi anunciado como aprovação integral.
- Em 10/10, configuração mostrou “The badge is not shown on this project”. Reexecução pública **quality aprovada: 38 auditorias, zero violações, zero erros console/CSP**, cabeçalhos de proteção presentes.
- Lighthouse público antes da correção: 91/100/92/100. **Após correção, em 10/10: 100/100/100/100**, sem runtimeError. Medição laboratorial pontual, não dados reais de usuários ou garantia futura.
- Capturas e relatórios em `pickpop-site/tests/artifacts/`, ignorados no Git. Não reutilizar eventos de teste como visitantes ou cliques comerciais.
- Atualização de privacidade em 10/10: build, 968 referências e 13 testes novamente aprovados; página pública respondeu 200 com descrição Netlify Web Analytics e CSP, sem badge. Configuração não adicionou SDK, cookie ou transmissão de eventos do navegador.
- Após `2dbb143`, growth público novamente aprovado: cinco guias, sete CTAs diretos, origem/tag interceptadas, diagnóstico QA e pesquisa OXO, sem page errors. Painel offline regenerado; rejeições de escopo QA, snapshot sem fonte e contagem negativa verificadas.

## Google Search Console — ações e limites reais

- Propriedade URL-prefix verificada por Tag HTML na conta existente em 09/10. Preservar o token público no projeto.
- Sitemap enviado em 09/10; relatório apresentou “Não foi possível buscar/ler”. XML público respondeu 200/application/xml, 27 URLs, robots permite rastreamento. Requisição com User-Agent de teste não foi confundida com rastreamento Google.
- **10/10: teste em tempo real do próprio Google em sitemap.xml:** rastreamento permitido **Sim**, busca **Com êxito**, indexação permitida **Sim**. Isso confirma acesso pelo instrumento de inspeção, não processamento do sitemap nem indexação de artigos.
- Reenvio único aceito em 10/10; tabela ainda mostra tipo desconhecido, erro de busca e 0 páginas descobertas. Esse 0 é do processamento do sitemap, não visitantes, indexação total ou vendas. Não alterar XML válido ou enfraquecer segurança com causa não demonstrada.
- Cinco guias inspecionados em 09/10: desconhecidos/não indexados. Coffee-station continua nesse estado em 10/10. Isso não prova ausência de todo o site no Google.
- Coffee-station teve teste ao vivo bem-sucedido em 09/10, indexação permitida e breadcrumb válido.
- Solicitação de indexação não aceita por cota diária em 09/10. Uma tentativa legítima no dia seguinte, 10/10, novamente recusada por **cota excedida**. Não contornar limites; nenhuma solicitação anunciada como aceita.
- Desempenho revisitado em 10/10: **dados em processamento / nenhum dado**, exportação desativada. Impressões, cliques, países e consultas continuam indisponíveis.

## Pendências do proprietário e próximos 14 dias

1. **Amazon:** acessar a própria conta, confirmar PickPop na lista de sites e validar sete URLs do CSV na ferramenta oficial. Não fazer compras pessoais de teste. Pedidos/comissões somente dos relatórios oficiais; nenhuma senha no chat.
2. **Pinterest:** revisar contact-sheet e pins.csv, conectar conta própria e autorizar publicação. Agendamento nativo gratuito: até 10 pendentes, janela de até 30 dias; preparar 10 e abastecer os dois restantes depois. Não criar conta/aceitar termos automaticamente.
3. **Medição:** Netlify Web Analytics já ativo e gratuito no plano conferido. Revisar por períodos consistentes e registrar janelas de testes; relatórios incluem dados de QA e não confirmam pessoas ou vendas. Para eventos Good Finder/cliques Amazon, GA4 opcional ainda exige Measurement ID público, consentimento/configuração e aprovação específica; a autorização concedida foi somente para Netlify.
4. **Contato:** fornecer endereço público verdadeiro quando desejar ativar canal direto.
5. **Catálogo/API:** cinco itens adicionais com fotos das variantes exatas; Creators API depende de autorização/credenciais futuras, continua desligada.

Cronograma executável e critérios de decisão em FIRST-SALES-14-DAYS.md. Dias 1–3: links, propriedade Google, páginas; dias 4–7: iniciar Pins após autorização e primeira revisão de dados; dias 8–14: publicar o restante, revisar métricas disponíveis e escolher a próxima melhoria por evidências. Pinterest é prioridade; Instagram segundo canal opcional. **Nenhuma URL foi divulgada em redes sociais, nenhum Pin agendado/publicado, nenhuma venda/comissão confirmada. R$ 0 gastos.**

## Registro final de publicação

Painel Netlify confirmou **Published main @2dbb143**; domínio público confirmou a privacidade atualizada. Registros offline posteriores usam commit com `[skip netlify]`, pois não alteram o artefato público e evitam deploy redundante. O ponto de retorno permanece disponível.

Documentação consultada em 10/10: [Netlify Web Analytics](https://docs.netlify.com/manage/monitoring/web-analytics/overview/), [funcionamento dos dados](https://docs.netlify.com/manage/monitoring/web-analytics/how-web-analytics-works/) e [controle de deploys](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/). A gratuidade foi conferida na conta existente, não presumida para todo plano ou usuário.
