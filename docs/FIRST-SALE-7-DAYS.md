# Missão primeira venda — baseline e operação de sete dias

**Janela: 12–18 de outubro de 2026.** Site: https://pickpop.netlify.app/. Tag: `pickpop03-20`. Marketing R$0. Onze produtos e dez artigos preservados; nenhum novo produto/artigo, anúncio, conta, serviço ou agendamento Pinterest criado. Os dias futuros abaixo ainda não foram executados.

## Auditoria do caminho do comprador

| Etapa | Constatação e ação executada | Limite da validação |
|---|---|---|
| Chegada por Pin | Os dez destinos existentes responderam200, sem redirecionamento, H1/conteúdo relevante e canonical limpo; UTMs por Pin preservados. Registro em `PIN-DESTINATION-AUDIT.json`. | Conferência de páginas, não comprovação de publicação/impressões Pinterest. Fila/agendamentos não alterados. |
| Descoberta | Finder/quiz/filtros/favoritos/comparação mantidos. Onze fotos de produtos no catálogo, zero registros demonstrativos. | Orçamento é preferência; sem preço autorizado não exclui produtos por preço presumido. |
| Decisão no guia | Nas três páginas prioritárias, o primeiro CTA estava a4731–5346px de rolagem em360px. Escolhas iniciais com foto, finalidade, divulgação e link direto agora aparecem a1098–1207px. | Menos rolagem medida em QA; não é melhoria de conversão comprovada nem teste A/B. |
| Decisão no produto | CHEMEX, Encore e Victorinox receberam “good fit”, quando considerar outra opção, conferência de modelo/acessórios e guia relacionado; descrições SEO individuais. | Orientação editorial baseada nas características existentes; sem teste físico, ranking público, estoque/preço ou avaliação inventados. |
| Saída Amazon | Onze URLs diretas `/dp/ASIN?tag=pickpop03-20`, modelo/ASIN/fontes preservados, sponsored/divulgação/abertura explícita em nova aba conferidos. Botões são acionáveis no teclado. | Navegação QA foi interceptada localmente. Nenhum clique comercial/pedido de teste; atribuição da conta não confirmada. |
| Diagnóstico | Painel QA só abre por opção explícita `diagnostics=1`, oculto em páginas normais e destinos Pins; não é analytics de negócio. Removido um grande emoji decorativo que atrasava as opções no guia de cafeteiras. | Ícones decorativos da identidade continuam; não são fotografias/produtos demonstrativos. |

## Três prioridades comerciais, não promessa de vendas

Pesquisa documentada em `PRODUCT-DEMAND-RESEARCH.md`, consulta12/10, sinais do marketplace americano em cache. Não há Google Trends US, volume/dificuldade validada ou conversões próprias que sustentem alegação de “mais vendido para nosso público”. Notas são editoriais provisórias.

| Produto / ASIN | Evidência observada e motivo de prioridade | Conteúdo otimizado |
|---|---|---|
| Original Baratza Encore Black / B007F183LK | Nota76/100. Snapshot #6 Burr Coffee Grinders; badge1K+ mensal arredondado, não unidades medidas por nós. Ticket fabricante observado separadamente no relatório. Complementa quem já tem brewer; não vender como ESP ou máquina de café. | Página do produto e coffee-station; escolha inicial explicita que grinder e brewer têm tarefas distintas. |
| Victorinox Fibrox black 5.2063.20 /45520 / B008M5U1C2 | Nota68. Snapshot #3 Chef's Knives, badge5K+; modelo/foto explicitamente identificados. Resolve preparo geral na cozinha; tamanho/armazenamento podem contraindicar. | Página do produto e kitchen-essentials; opção inicial de preparo sem forçar utensílios irrelevantes. |
| CHEMEX six-cup Classic CM-6A / B0000YWF5E | Nota66. Snapshot #13 Pour Over Coffee Makers, badge1K+; foto seis-cup confirmada. Conecta dois guias/destinos de café e oferece rotina compartilhada. | Página do produto, coffee-station e coffee-maker-small-apartment. Comparação com Go8fl oz mantida, apesar de não ser foco comercial deste trio. |

Lodge foi mantida, mas peso/tamanho limitam adequação a apartamentos; tech/pets mantidos sem promoção forçada nos guias de cozinha. OXO brush Large/1071061 continua com identificação de tamanho fotográfico em investigação; não foi escolhida para destaque. Fellow e RIO seguem suspensos. Nenhum existente foi excluído por demanda desconhecida.

## Links e validação que depende da Amazon

`AFFILIATE-AUDIT.csv` agora contém os onze produtos ativos, ASIN/modelo/link/foto/licença/data e status separados. Conferência técnica de tag/disclosure não demonstra que o proprietário recebeu cliques ou comissões.

Na própria conta Associates USA, confirmar que `pickpop03-20` é o Tracking ID selecionado e que o site oficial consta na lista de sites. Usar o [Link Checker oficial](https://affiliate-program.amazon.com/help/node/topic/G6253GFSARDQENZR) para os URLs diretos do CSV construídos fora de Associates Central; registrar o resultado real. Não gerar compras pessoais nem cliques repetidos para criar evidência. Se o instrumento não resolver a associação, usar o suporte oficial da conta, sem enviar credenciais pelo chat. A tentativa de abrir `affiliate-program.amazon.com` no navegador foi recusada pela permissão; não contornada. Nenhuma conta Amazon foi inspecionada nesta execução; atribuição e relatórios continuam pendentes.

[Ajuda oficial dos relatórios](https://affiliate-program.amazon.com/help/node/topic/GMWAK55DQX8JEK7C) consultada12/10: cliques, itens pedidos, enviados e ganhos são indicadores diferentes, com janelas e atualização próprias. Não chamar um pedido recente de comissão paga/venda finalmente qualificada; cancelamentos, devoluções e elegibilidade dependem da Amazon.

## Search Console e sitemap

- Tentativa de acesso a `search.google.com` recusada pela permissão de navegador; não contornada por API, outro navegador ou ferramenta. Último estado observado da conta continua10/10: erro de processamento/busca, teste ao vivo Google bem-sucedido e pedidos de indexação recusados por cota. **Estado atual da conta indisponível**, sem afirmar que o erro persiste ou foi resolvido.
- Verificação pública atual: sitemap HTTP200, XML válido e tipoXML, sem redirecionamento, **31URLs únicas**; todas responderam200, canonical correspondente e sem noindex/redirect oculto; robots permite rastreamento. Token de propriedade preservado. Não foi identificado erro técnico que justificasse reescrever XML, enfraquecer proteção ou reenviar às cegas.
- [Procedimento oficial](https://support.google.com/webmasters/answer/7451001?hl=en): ao restabelecer acesso, abrir detalhes do sitemap, ler o erro específico e fazer inspeção ao vivo do endereço exato antes de uma correção/reenvio. Respeitar cotas. HTTP200 em QA não é leitura pelo Google nem indexação confirmada.

## Indicadores efetivamente disponíveis

| Indicador | Janela12–18/10 | Fonte e o que significa |
|---|---|---|
| Páginas servidas / estimativa IPs / países / origens Netlify | **Indisponíveis nesta consulta** | Painel `app.netlify.com` bloqueado por permissão. Web Analytics foi autorizado/ativado em10/10, incluído no plano então conferido; nenhum upgrade/serviço novo. |
| Saídas Amazon registradas no PickPop | **Indisponíveis** | Eventos existentes não têm adaptador externo ativo. QA em memória não vira dado comercial. Netlify não fornece esta contagem de interação de navegador. |
| Cliques registrados pela Amazon | **Indisponíveis** | Somente relatório legítimo da Amazon, filtrado por `pickpop03-20`. Não equivalem necessariamente às saídas capturadas no site. |
| Pedidos, itens enviados e comissão Amazon | **Indisponíveis** | Não houve acesso/exportação oficial. Não presumir zero nem primeira venda. |
| Impressões/cliques/consultas Google | **Indisponíveis** | Sem nova observação da conta; sitemap entregue não prova indexação. |
| Impressões/cliques Pinterest | **Indisponíveis nesta missão** | Agendamentos não alterados; revisão apenas dos destinos. Acompanhamento existente registra publicação somente após confirmação oficial. |

**Referência histórica separada:** snapshot legítimo de10/10, período9/10 13h a10/10 13h34 conforme painel:484 páginas servidas,23 IPs únicos estimados,40 pageviews dos EUA. Inclui QA, proprietário, inspeção Google e possíveis bots; não pertence à semana atual, não comprova compradores americanos, cliques Amazon ou comissão. Não extrapolar tráfego de marketing.

O [funcionamento oficial Netlify](https://docs.netlify.com/manage/monitoring/web-analytics/how-web-analytics-works/) descreve estimativas por IP e diferentes agregações por período; não somar os valores diários como pessoas distintas. Não confundir Web Analytics com observabilidade de requisições nem com eventos client-side.

## Painel comparativo preparado e privacidade

`operations/dashboard.html` é **local/offline**, fora do build público; atualizado para12–18/10 e alimentado por `observations.json`. Campos distintos para `amazonClicks` (saída no PickPop) e `amazonReportedClicks` (relatório oficial). O gerador rejeita QA, contagens negativas/não finitas, cliques/pedidos/ganhos “Amazon” sem fonte Associates e tentativas de usar Netlify/Associates como contagem de saída client-side. Dados sintéticos dos testes não entram no painel.

Para atualizar: obter exportação/observação agregada legítima, preservar o original em `operations/private/`, preencher valor, fonte, data de consulta e `window:{start,end,timezone}`; executar o gerador existente. Janela/fuso ausentes aparecem explicitamente como não comparáveis. Registrar atrasos, consentimento/cobertura, bots e janelas QA. Não calcular conversão PickPop→Amazon com denominadores diferentes ou associar indivíduos aos pedidos. Relatórios Amazon agregados podem incluir compras diferentes do produto clicado.

Adapter GA4 já existente permanece **desativado**, sem Measurement ID nem nova aprovação específica de medição client-side. A autorização Netlify não ativa automaticamente terceiros. Para medir saídas reais: proprietário fornece configuração pública do serviço escolhido e aprova a medição/política/consentimento adequados; nenhuma senha/chave secreta no frontend. Não criamos novo serviço, pixel, redirect de rastreamento ou cobrança.

## Execução dos próximos sete dias

| Dia | Ação | Evidência e decisão |
|---|---|---|
| 1 —12/10 | Auditoria/seleção/ajustes técnicos, destinos Pins, testes e publicação autorizada. | Resultados registrados abaixo. Baseline comercial indisponível; visitas QA não são aquisição. |
| 2 —13/10 | Restabelecer legitimamente acesso aos painéis e validar onze URLs dentro da Amazon. Conferir publicação do lote pelo acompanhamento existente. | Registrar Link Checker/site associado e URL pública apenas após confirmação; sem duplicar Pins. |
| 3 —14/10 | Ler erro atual do sitemap e executar teste ao vivo Google, se houver acesso. | Corrigir apenas causa comprovada; eventual reenvio/indexação legítimos, respeitando cotas. Sem afirmar indexação por envio. |
| 4 —15/10 | Registrar Netlify, Pinterest e Amazon na mesma janela explícita, com seus fusos/métodos. | Sem dados, registrar indisponível e qual acesso falta; não substituir por eventos de teste. |
| 5 —16/10 | Examinar interesse nos guias de café/preparo e cliques Amazon oficiais quando disponíveis. | Impressões sem visitas: investigar peça/destino. Visitas sem saídas medidas: considerar cobertura/relevância, não concluir automaticamente fracasso. |
| 6 —17/10 | Revalidar rotas/modelos/links se houver erro real ou mudança de produto. | Corrigir problemas comprovados. Não ampliar catálogo nem redesenhar por falta de métricas. |
| 7 —18/10 | Fechar a primeira comparação da janela. | Resumir dados reais por fonte, pendências e próxima melhoria baseada em evidência. Se um relatório completo mostrar zero, registrar zero com fonte/data; se faltar relatório, continuar indisponível. |

Estas são ações futuras executáveis, **não automações novas** nem tarefas já realizadas. Publicação/visita/clique/pedido/comissão são estágios distintos. Não há promessa de receita.

## Validação e publicação

Executados: build34páginas/31URLs;11 testes importador;14 Node;5 testes do painel;1.139 referências;MVP102layouts360/768/1440;teste da missão com18auditorias de acessibilidade em três guias/três produtos, onze modelos/URLs, dez destinos, imagens carregadas, QA oculto, zero demos e saída por teclado interceptada. Growth passou cinco guias e onze CTAs; quality passou38auditorias com cabeçalhos de produção, sem erros console/CSP. Capturas mobile/desktop inspecionadas; sem erros da aplicação ou tráfego externo inesperado. Conferência dos onze objetos comprova que identidade, link, foto e fatos anteriores foram preservados, exceto os três novos blocos editoriais `buyingGuide`. Não foi executado novo Lighthouse, teste A/B, compra ou teste de comissão. Não se afirma certificação WCAG ou nova métrica de usuários reais.

Ponto de retorno: `pickpop-before-first-sale-20261012` em `73ead42`. A publicação e conferência do domínio são registradas abaixo quando confirmadas. Seguir mantendo Fellow/RIO suspensos ao usar rollback.

**Publicação confirmada:** commit `840fd4e`, pela integração Git/Netlify existente. Catálogo público confere com os onze registros locais; três guias mostram as escolhas iniciais, três produtos mostram os novos critérios e metadados, onze detalhes preservam tag/disclosure/sponsored; CSS confere byte a byte, XML/robots conferem normalizadas as quebras Windows/Linux; Fellow/RIO continuam404. Teste da missão passou também no domínio oficial:18auditorias responsivas, onze modelos/links, dez destinos, diagnóstico oculto e saída por teclado interceptada. Primeiros CTAs públicos em360px:coffee-station1149px,coffee-maker1206px,essentials1098px. Evidências privadas em `operations/private/first-sale-deploy.json` e `pickpop-site/tests/artifacts/first-sale.json`; visitas são QA, não aquisição. Nenhum ID de deploy do painel foi presumido.

Conferência inicial de produção detectou [Pretty URLs da Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/), que reescrevem alguns hrefs internos `.html` sem alterar canonical, conteúdo ou links Amazon. Foram testadas ambas as formas dos três guias:200 e canonical único `.html`. A asserção foi ajustada para aceitar somente esse alias conhecido, exigindo a página/canonical correto; comparação de documento continua integral depois dessa normalização. Diferenças de quebra de linha do XML/robots também foram verificadas, sem reescrever arquivos válidos nem atribuir o problema histórico de processamento Google a essas diferenças. Nenhum problema crítico exigiu rollback.
