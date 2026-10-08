# PickPop 2.0 — entrega candidata local

**Atualização de publicação:** após autorização expressa, a versão 2.0 foi integrada em `main`, enviada ao GitHub e confirmada no domínio oficial. Consulte `DEPLOY-2.0.md` para os testes em produção, a pontuação Lighthouse publicada e o aviso não crítico do selo Netlify. O texto abaixo preserva o registro da entrega local anterior à autorização.

## Situação

MVP funcional implementado e testado localmente, continuando a identidade e os arquivos originais. A versão está na branch local `pickpop-2-mvp`; não foi enviada ao GitHub nem publicada na Netlify. O ZIP original e a versão de produção anterior foram preservados.

Arquitetura: páginas estáticas geradas por Python padrão, CSS e módulos JavaScript nativos. Sem migração de framework, banco de dados, backend de compras ou serviços pagos. O relatório de diagnóstico e a justificativa estão em `AUDIT-2.0.md`.

## Entrega por fase

| Fase | Implementado | Arquivos principais | Verificação executada | Pendências / participação do proprietário |
| --- | --- | --- | --- | --- |
| 1 — Fundação | Catálogo central validado, regras puras, destinos seguros, favoritos separados, build e prévia local. | `data/catalog.json`, `data/site.json`, `catalog.js`, `saved.js`, `build.py`, `serve.py`, `start-local.ps1`. | Oito testes unitários aprovados; geração de 36 páginas; iniciador testado em 8083, Home e catálogo HTTP 200. | Nenhuma credencial necessária para uso local. Dados reais dependem de fontes e revisão. |
| 2 — Identidade e experiência | Hero e ilustração CSS preservados; navegação compartilhada, categorias, cartões, responsividade, foco, alvos de toque e movimento reduzido; fontes locais licenciadas. | `templates/home.html`, `header.html`, `footer.html`, `styles.css`, `platform.css`, `assets/fonts/`. | 108 verificações de páginas/larguras; capturas desktop e mobile inspecionadas; 22 auditorias axe aprovadas. | Verificação em aparelhos físicos e leitor de tela continua recomendada; não se declara certificação WCAG. |
| 3 — Descoberta | Good Finder com termos/categoria/estilos/prioridade combinados; orçamento exato, ordenação, favoritos e opção de persistência; quiz de quatro etapas explicável; comparação de até três ideias; erro/nova tentativa e vazio. | `finder.js`, `cards.js`, `quiz.js`, `comparison.js`, templates `finder`, `results`, `quiz`. | Fluxos de busca, limites inclusivos, ausência de resultados, filtros combinados, armazenamento bloqueado/corrompido, recarga, abas, quiz, comparação e teclado aprovados no Chrome. | A experiência usa conceitos ilustrativos do catálogo; não é uma busca live na Amazon. |
| 4 — Conteúdo e SEO | Quatro guias, três coleções, 20 páginas de conceitos, About/Privacy/Disclosure/Contact; títulos e descrições individuais, canonical/OG, sitemap, robots e Schema factual. | `templates/articles/`, `collections/`, `guides/`, `ideas/`, `sitemap.xml`, `robots.txt`, `build.py`. | Validador aprovado: 36 páginas, 13 URLs no sitemap, 1.045 referências locais, metadados únicos e Schema sem preços/ofertas/avaliações. Links internos aprovados no navegador. | Google Search Console e indexação só após publicação autorizada; conceitos/filtros e contato sem endereço são noindex. |
| 5 — Preparação comercial | Cadastro preparado para links oficiais fornecidos, controles de ativação e divulgação; stub de API desativado; eventos locais sem envio de dados. | `catalog.js`, `amazon-adapter.js`, `metrics.js`, `page-events.js`, `data/site.json`, `disclosure/`. | Testes de URLs seguras, gating de afiliados e preços aprovados; navegador sem chamadas externas, sem tags nos links atuais. Políticas oficiais consultadas na auditoria. | Aprovação Associates, tag e links oficiais; produtos/fontes/imagens autorizados; contato empresarial. API de servidor e analytics externo ainda não implementados e exigem acesso/aprovação. |
| 6 — Revisão de lançamento | Artefato `dist` limpo, configuração Netlify, cabeçalhos de segurança, regressão e documentação. | `netlify.toml`, `_headers`, `tests/`, README, documentação. | Build, validador, oito testes unitários, 108 layouts, 22 auditorias axe e Lighthouse mobile/desktop aprovados; sem erros críticos de console/CSP. | Autorizar publicação e atualizar campos de build antes de integrar a produção. |

Os caminhos da tabela são relativos a `pickpop-site/`, salvo a documentação nesta pasta. Os arquivos HTML públicos são gerados; alterações devem ser feitas nos templates e seguidas pelo build.

## Resultados reais

Medições feitas em 7 de outubro de 2026 no Chrome instalado, contra `http://127.0.0.1:8082/`, servindo `dist/` com os cabeçalhos de produção.

| Verificação | Resultado |
| --- | --- |
| Regras de catálogo/busca | 8 testes aprovados, 0 falhas. |
| Build | 36 páginas e 13 URLs indexáveis; nenhum deploy. |
| Validação estática | 1.045 referências locais, canonicals/títulos únicos, imagem social e artefato sem arquivos de desenvolvimento. |
| Navegador | 36 páginas × 360/768/1440 px = 108 verificações de layout, sem transbordamento horizontal detectado. |
| Fluxos | Busca, orçamento, ordenação, favoritos/privacidade, comparação, quiz, falhas/nova tentativa, teclado, menus e links aprovados. |
| Axe 4.14.0 | 22 auditorias em páginas representativas a 360/1440 px; 0 violações automáticas A/AA. |
| Console e rede | Sem erros críticos de JavaScript/CSP; nenhuma chamada externa durante a navegação testada. |
| Lighthouse 13.5.0 mobile, Home | Performance 98; Accessibility 100; Best Practices 100; SEO 100. LCP simulado 2,3 s; CLS 0. |
| Lighthouse 13.5.0 desktop, Home | Performance 100; Accessibility 100; Best Practices 100; SEO 100. LCP simulado 0,5 s; CLS 0. |

Relatórios e capturas locais: `pickpop-site/tests/artifacts/results.json`, `quality.json`, `lighthouse-mobile.json`, `lighthouse-desktop.json`, `mobile.png`, `desktop.png` e recortes de hero/finder/quiz. Esses artefatos são ignorados pelo Git; os procedimentos para reproduzir estão no README.

Lighthouse foi executado na Home, não em todas as páginas. São medições locais em laboratório, não resultados da Netlify publicada ou Core Web Vitals de usuários reais. O servidor de prévia desativa o cache, causando uma observação de back/forward cache. Há verificações de contraste que o axe marca como inconclusivas em símbolos e fundos sobrepostos; capturas e controles foram inspecionados, sem declaração de conformidade integral. Emulação do navegador não equivale a testar iPhone/Android físicos.

## Limites explícitos

- **Concluído e testado:** descoberta no catálogo interno, filtros, favoritos, quiz, comparação, conteúdo estático, SEO básico e build.
- **Demonstrativo:** os 20 conceitos e seus alvos editoriais de orçamento. Não há produtos específicos, preços atuais, avaliações, estoque ou testes físicos alegados.
- **Preparado e desativado:** cadastro de links remunerados e eventos locais. Nenhuma comissão ou ferramenta externa de medição foi ativada.
- **Dependente de implementação/acesso externo:** API autorizada com servidor e segredos, imagens reais autorizadas e analytics com configuração de privacidade.
- **Dependente de informação:** contato público verdadeiro. A página atual explica o estado sem coletar mensagens.

Não é possível afirmar elegibilidade do proprietário no programa Amazon Associates, medir vendas diretamente pelo site ou prometer indexação no Google a partir destes testes.

## Publicar somente com autorização

Antes de publicar, revise a experiência local e configure na Netlify: base `pickpop-site`, comando `python build.py`, diretório `dist`. Functions permanece sem uso; nenhuma variável de ambiente é exigida neste MVP. O ambiente de build precisa de Python 3.9+.

O próximo passo externo é autorizado separadamente: integrar as alterações na branch ligada à Netlify e publicar. Nenhum comando de deploy, push de produção, serviço pago ou integração com dados pessoais foi executado nesta revisão.
