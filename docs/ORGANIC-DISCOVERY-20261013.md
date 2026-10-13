# Descoberta orgânica — 13/10/2026

## Acesso e fatos disponíveis

O proprietário decidiu manter `search.google.com` bloqueado. Nesta tarefa o domínio não foi acessado nem o bloqueio contornado. Status atual do sitemap no Google, número de páginas indexadas, exclusões, consultas, impressões, cliques e renderização pelo Google: **indisponíveis**. Não são zero.

O erro `Couldn't fetch` e as cinco inspeções sem indexação em `operations/search-console-status.json` são observações de **10/10**, não um diagnóstico atual. Naquela data o teste ao vivo conseguiu buscar a página e permitiu rastreamento/indexação. Não inferimos que o erro persista em13/10.

O sitemap público contém31URLs; robots permite rastreamento. Não houve alteração do XML, URLs canônicas, robots, token de propriedade ou solicitação de indexação. HTTP200 e HTML indexável não provam descoberta/indexação pelo Google. [Documentação oficial do relatório de sitemaps](https://support.google.com/webmasters/answer/7451001?hl=en).

## Problema comprovado e correção

A auditoria percorreu somente âncoras HTML de páginas indexáveis, partindo da Home, sem executar JavaScript ou usar o sitemap como substituto de navegação. Os10artigos já eram alcançáveis;10produtos também. O KONG Classic Medium não tinha entrada por outra página indexável: aparecia na busca interativa e no sitemap, mas estava isolado nesse percurso.

`Collections` passou a apresentar um índice textual dos11produtos, com nomes exatos, marcas, categorias e links para suas páginas existentes. Agora todos os11produtos estão a2passos da Home; os10artigos estão a1–2passos. Nenhuma página/produto/artigo adicional foi criado. O Good Finder permanece interativo e `noindex` para evitar indexação de combinações de filtros.

Somente os metadados das duas coleções temáticas ganharam descrições mais específicas:

- `/collections/coffee-corner/`: **Coffee Station Essentials: Brewers & Grinders | PickPop**. Descrição distingue CHEMEX, AeroPress Go e original Encore.
- `/collections/small-kitchen/`: **Small Kitchen Essentials: Cookware & Prep Tools | PickPop**. Descrição destaca tamanho, peso, cuidados e armazenamento, sem ofertas/avaliações.

Títulos individuais, descrições e conteúdo estático dos10artigos/11produtos foram conferidos. Os três guias prioritários já têm escolhas iniciais, limitações e links HTML para CHEMEX/Encore/Victorinox; não houve reescrita sem necessidade. As demais páginas mantêm fontes, identidade de modelo e metadados próprios. Fotografias, catálogo, tag americana `pickpop-20`, Pinterest e monitoramento preservados.

Referências técnicas consultadas em13/10: [links rastreáveis e texto de âncora](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [processamento de JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). O índice HTML reduz a dependência da renderização da busca, sem prometer indexação.

## Cinco oportunidades para o catálogo atual

Método: termos em inglês com decisão de compra explícita, conteúdo disponível e comparação pública de assuntos concorrentes. Pesquisa pública realizada em13/10/2026; buscas da ferramenta não constituem uma SERP Google configurada nos EUA. Não há volume americano, dificuldade numérica, posição do PickPop, tendência Google ou vendas atribuíveis disponíveis. Intenção é uma inferência editorial do termo, não demanda comprovada. Prioridade abaixo segue adequação ao catálogo; não recomenda criar mais artigos nesta rodada.

| Termo proposto | Página existente / produto | Evidência e concorrência observável | Próxima decisão |
| --- | --- | --- | --- |
| `coffee maker for small apartment` | `/guides/coffee-maker-small-apartment.html`; CHEMEX/Go | A pesquisa trouxe [Consumer Reports](https://www.consumerreports.org/cro/coffee-makers/buying-guide/index.htm) e guias compactos de outros editores. Disputa editorial visível, sem dificuldade calculada. | Manter distinção manual/automático, número de porções e espaço total; conferir consultas US no Search Console. |
| `coffee station essentials for small kitchens` | `/guides/coffee-station.html`, `/collections/coffee-corner/`; CHEMEX/Encore/Go | [Guia concorrente de coffee-bar essentials](https://www.homesandgardens.com/buying-guides/coffee-bar-essentials) apareceu na pesquisa. Termos próximos já foram observados no Pinterest Trends US em13/10; isso não mede procura no Google. | Collection recebeu metadados coerentes; usar o guia atual para decidir entre brewer e grinder, sem comprar ambos por obrigação. |
| `Baratza Encore grinder for filter coffee` | `/ideas/baratza-encore-black/`, guia de estação de café | [Baratza US](https://www.baratza.com/en-us/product/encoretm-zcg485?sku=ZCG485BLK1AUC1A) posiciona o original Encore para filter brewing. Pesquisa mais ampla trouxe discussões e reviews, frequentemente misturando ESP/ESP Pro; nenhum volume conhecido. | Preservar identificação do original Encore; evitar alegações de ESP e ranking “best” sem comparação testada. |
| `CHEMEX 6 cup capacity how many mugs` | `/ideas/chemex-six-cup/`, guias de cafeteira/drinkware | [Suporte oficial CHEMEX](https://chemexcoffeemaker.com/pages/classic-series-product-support) explica capacidade e cup size; resultados incluíram dúvidas e FAQs de vendedores. A fonte oficial também concorre por resposta. | Conteúdo atual já explica30fl oz e copos de5oz; não repetir em página nova nem prometer seis canecas. |
| `kitchen essentials for small apartments` | `/guides/small-apartment-kitchen-essentials.html`, `/guides/small-kitchen.html`; Victorinox/Lodge/Kuhn | Busca trouxe o [material de equipamentos da UCLA](https://www.sustain.ucla.edu/wp-content/uploads/2021/10/Zero-Waste-Kitchen-Companion-Final.pdf); temas de espaço/armazenamento têm presença comercial de [IKEA US](https://www.ikea.com/us/en/rooms/kitchen/gallery/enhet-a-compact-kitchen-that-fits-into-your-life-pub8867d920/). Não é prova de dificuldade baixa nem volume. | Manter seleção por tarefa, armazenamento e peso; comparar consultas específicas quando houver impressões. |

Fontes concorrentes foram registradas somente como evidência de conteúdo publicamente encontrado; seus preços, avaliações e alegações não foram copiados ou utilizados para fundamentar especificações do PickPop.

## Verificação manual necessária no Search Console

Na conta legítima do proprietário, selecionar a propriedade `https://pickpop.netlify.app/`:

1. **Sitemaps → sitemap.xml**: registrar status atual, último processamento/leitura, páginas descobertas e mensagem detalhada se houver falha. Não remover/reenviar automaticamente um sitemap válido. Se ainda houver `Couldn't fetch`, abrir o motivo e comparar a data com o teste HTTP público.
2. **Indexação → Páginas**: exportar totais e motivos das exclusões. Distinguir `Discovered — currently not indexed`, `Crawled — currently not indexed`, canonical alternativa, erro de servidor e exclusão intencional de `/find/`.
3. **Inspeção de URL**: consultar o estado registrado dos três guias `coffee-maker-small-apartment.html`, `coffee-station.html`, `small-apartment-kitchen-essentials.html` e dos produtos `chemex-six-cup/`, `baratza-encore-black/`, `victorinox-fibrox-chef/`. Todos usam `/guides/` ou `/ideas/` no domínio oficial. Registrar último rastreio e canonical escolhido. Teste ao vivo/ver HTML renderizado somente se surgir uma divergência concreta; não solicitar indexação repetidamente.
4. **Desempenho → Resultados da pesquisa**: filtro país **United States**, período e tipo Web explícitos; exportar consultas e páginas, impressões e cliques. Registrar data final disponível/atraso do relatório; dados ausentes ficam indisponíveis.

Entregar as exportações ou capturas dessas telas permite identificar quais páginas importantes continuam fora do índice. Não é necessário enviar senha ou código. O proprietário pode consultar em seu navegador; o bloqueio do navegador do agente permanece respeitado.

## Validação e publicação

- Build:34páginas estáticas,31URLs no sitemap.
- Validação do artefato:1.150referências locais, títulos/canonicals/metadados/schema e ausência de arquivos de desenvolvimento.
- Novo teste de descoberta: falhou antes da correção para o KONG isolado; passou depois para os21destinos importantes. Links da própria página são excluídos da contagem.
-15testes Node de catálogo/provedor/afiliados/privacidade aprovados.
- Fluxo de compra existente:18auditorias responsivas/acessibilidade,11modelos/links,3guias,3blocos de decisão,10destinos de Pins e teclado aprovados. Navegação Amazon interceptada; não foram gerados cliques comerciais.
- Coleções:9auditorias axe em360/768/1440px,11links do diretório e navegação por teclado sem JavaScript aprovadas. O primeiro harness de axe com JavaScript desabilitado falhou por timers; a ferramenta de acessibilidade foi separada do teste real de navegação sem JS e ambos passaram. Não foi diagnosticado como erro do site.
- Captura local de360px inspecionada; nenhum redesign ou CSS alterado. Não houve nova medição Lighthouse.
- Ponto de retorno preservado/push: `pickpop-before-google-discovery-20261013`, commit anterior `9672978`.
- Publicação e verificação pública: registrar após confirmação no domínio, sem acessar o painel Netlify bloqueado.

Próxima ação comercial: obter dados atuais do Search Console e comparar **consultas US → páginas com impressões → cliques orgânicos**, sem misturar Pinterest/QA/Amazon. Nesta entrega não há aumento de tráfego ou venda confirmado.
