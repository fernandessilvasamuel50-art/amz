# Sprint de conversão — 13/10/2026 (America/Manaus)

## Obstáculos medidos e alterações

Capturas/medidas em360,768e1440px foram guardadas em `operations/private/conversion-20261013/`, fora do Git. Medidas verticais são coordenadas da página ao carregar, não taxas de conversão ou resultados comerciais.

| Ponto em360px | Antes | Depois |
| --- | ---: | ---: |
| Primeiro acesso a um produto pela Home | 4.660px, nos resultados interativos | 590px, atalho HTML para CHEMEX |
| Atalho Home para Encore | 11.868px, nos resultados | 660px |
| Atalho Home para Victorinox | 12.699px, nos resultados | 715px |
| Primeiro View on Amazon: CHEMEX | 1.007px | 891px |
| Primeiro View on Amazon: original Encore | 1.265px | 1.088px |
| Primeiro View on Amazon: Victorinox | 1.032px | 910px |

Home: três atalhos internos discretos, por tarefa, antes da ilustração no celular. Levam às páginas reais existentes, sem exigir uma busca. O Finder mantém seu botão/funcionamento; os atalhos acrescentam cerca de235px ao restante da Home. Não foi alegado que o formulário ficou mais perto do início: a melhoria é o novo caminho direto.

Produtos: legendas junto às três fotografias preservam autor e licença, com âncora para o crédito completo visível na seção de fontes da própria página. Fonte original, link da licença, alterações da imagem, ShareAlike e aviso de não endosso continuam completos e acessíveis; não foram escondidos em um modal ou removidos. Isso reduz o bloco de atribuição antes do nome/decisão, especialmente no Encore. Fotografias não foram alteradas.

Os três artigos prioritários já ofereciam recomendações iniciais e vantagens/limitações concretas. As medidas e capturas confirmaram primeiros botões em1.098–1.206px; ficaram preservados. Os links de guia e comparações existentes permitem distinguir brewer/grinder e tarefas de cozinha. Sem reescrita de artigos, novo catálogo, ratings, preços ou oferta inventada.

## Pinterest: destinos e dados reais

Revisados16destinos existentes/preparados,11páginas públicas distintas. Café/porções → guia de cafeteiras; bancada/tray/cabinet → guia de estação; utensílios/tarefas → essenciais; armários/medidas → organização; armazenamento de alimentos/drinkware/temperos/presentes → guias específicos. HTTP200/canonical/UTM e conteúdo coerentes. Não foi encontrado destino claramente inadequado. Pins12–16 não foram tratados como publicados por estarem preparados/autorizados. Nenhum Pin, agenda, pasta, perfil ou automação foi modificado.

Consulta nativa Pinterest Analytics Overview nesta execução: **13/09–13/10/2026, UTC**, todos os conteúdos, métricas em tempo real estimadas. **3impressões,0engajamentos,0salvamentos,0cliques de saída**; tabela mostra Pin01 coffee-station com3impressões. Captura/estado oficial guardados privadamente. Público agregado tem atualização atrasada em2dias; países atuais indisponíveis. Não calculamos conversão/CTR ou concluímos ausência de compradores a partir desta amostra. Impressões podem incluir proprietário/QA.

Amazon US: somente baseline histórico informado pelo proprietário, **3cliques até12/10,0pedidos,US$0**, com possível QA/proprietário. Não houve consulta atual ao painel: bloqueio mantido por decisão anterior. Não foram gerados cliques Amazon/pedidos de teste.

Netlify: dados atuais de tráfego/país/fontes indisponíveis porque o proprietário mantém o domínio do painel bloqueado. Snapshot antigo inclui QA/bots e não é evidência atual de visitas qualificadas. Nenhum GA4/pixel/cookie/serviço de medição foi ativado.

Google: proprietário informou sitemap processado com31URLs e relatório histórico com somente a Home indexada. Registramos como informação do proprietário, com data de observação não fornecida; não transformamos esse histórico em status atual. Search Console permanece bloqueado. Rastreamento/indexabilidade/canonicals são testáveis publicamente, mas indexação atual, países, consultas e impressões ficam indisponíveis. Não houve ressubmissão ou solicitação de indexação.

## Arquivos e verificações

Alterados: `pickpop-site/build.py`, `templates/home.html`, `assets/css/platform.css`, Home gerada e páginas geradas de CHEMEX/original Encore/Victorinox. Novo teste `tests/conversion.cjs`. Registros desta execução neste relatório e em `docs/GROWTH-OPERATIONS.md`.

- Build:34páginas/31URLs.
- Validador:1.153referências locais, títulos/canonicals/OG/HTML/schema factuais; nenhum Offer/Merchant Listing fictício ou arquivo de desenvolvimento publicado.
-15testes Node de catálogo/provedores/afiliados/privacidade aprovados, incluindo proteção da tag US.
- MVP:102layouts em360/768/1440; busca relevante, filtros/orçamento honesto, favoritos/privacidade, comparação, quiz, erros e teclado aprovados.
- Jornada de compra anterior:18auditorias responsivas/axe,11modelos/links,3guias/3blocos editoriais,10destinos de Pins e teclado aprovados.
- Novo teste:12auditorias axe/responsivas da Home e dos3produtos; três atalhos móveis antes de800px; créditos completos/fonte/licença e links sponsored; percurso Home→CHEMEX→crédito por teclado sem JavaScript aprovado.
- Grafo HTML:11produtos/10artigos acessíveis; os três prioritários agora a1passo da Home. Canonicals/sitemap/robots não alterados.
-16destinos de Pins verificados no domínio público; agendamentos preservados.
- Catálogo/configuração/fotografias/artigos/Pinterest idênticos ao ponto de retorno por comparação Git. Onze links pagos mantêm ASIN e `pickpop-20`, rel sponsored e divulgação. Capturas antes/depois mobile/desktop inspecionadas.

Navegação Amazon bloqueada/interceptada nos testes. As visitas ao PickPop emQA não são aquisição orgânica. Não houve medição Lighthouse nova ou comprovação de aumento de vendas.

## Publicação e continuidade

Ponto de retorno: `pickpop-before-conversion-sprint-20261013`, em `3fe2475`, enviado ao remoto. Commit/publicação pública serão registrados após confirmação.

Três prioridades comerciais seguintes:

1. Conferir os cliques de saída dos Pins já publicados/agendados pelo acompanhamento existente, preservando períodos e possíveis visitas deQA; aguardar dados suficientes antes de escolher um vencedor ou mudar títulos.
2. Obter exportações atuais do Search Console e Netlify pela conta do proprietário: consultas/paísUS/páginas, distinguindo tráfego orgânico, Pinterest e testes. Não presumir atual o relatório com só a Home indexada.
3. Comparar cliques oficiais de `pickpop-20`, pedidos e comissões com os períodos de aquisição, usando relatórios legítimos da Amazon; excluir testes quando identificáveis e não atribuir vendas individualmente a um Pin sem prova.

Intervenção necessária do proprietário: exportações dos painéis bloqueados se quiser atualizar as métricas. Senhas/códigos não são necessários no chat. Nenhuma primeira venda ou melhora de conversão foi confirmada por esta entrega técnica.
