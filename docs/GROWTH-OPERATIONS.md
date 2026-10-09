# Operação primeiras vendas — 2026-10-09

## Estado da execução

- Base preservada: `ca90fc7`, tag local `pickpop-before-growth-20261009`, branch `codex/first-sales`.
- Tag central confirmada: **pickpop03-20**. Os seis links existentes têm destinos diretos Amazon.com e ASINs conferidos; atribuição no painel Amazon ainda não acessível.
- Botões diretos acrescentados aos cinco artigos prioritários e ao início dos detalhes. Motivos, limitações, divulgação e preço não verificado aparecem juntos.
- Quatro artigos receberam comparações de decisão; o quinto está em finalização. Dez artigos mantidos.
- Origem dos cliques preservada com `strict-origin-when-cross-origin`; não há redirecionamento intermediário.
- Métricas externas continuam desligadas. Adaptador exige aprovação do proprietário e consentimento do visitante; diagnóstico local opcional não representa tráfego comercial.
- Google Search Console: sessão existente disponível; token HTML legítimo instalado, verificação pendente do deploy. Amazon Associates e Pinterest solicitaram login; nenhuma senha solicitada ou conta criada.
- OXO brush B000HD7FJ4 / 1071061: identidade e fotografia CC BY 4.0 conferidas; inclusão em andamento. Balança OXO: fotografia de versão antiga não corresponde ao modelo atual, item excluído.

## Próxima ação executável

Finalizar o quinto artigo e incluir a escova OXO, gerar as 12 peças originais de Pinterest, executar testes, publicar pelo Git/Netlify e concluir a verificação do Search Console. Manter candidatos sem identidade/fotografia comprovada fora do catálogo. Não publicar em redes sociais sem autorização correspondente.

## Pendências externas

- Amazon: proprietário validar os links no Link Checker e consultar relatórios oficiais; testes técnicos não confirmam comissões.
- Pinterest: login em conta própria e autorização para publicação; as peças serão rascunhos, nunca anunciadas como publicadas.
- Analytics: identificador/configuração e aprovação de privacidade necessários; sem dados de visitantes, países, vendas ou comissões disponíveis.

Este registro será atualizado com testes, commit, deploy, evidências e cronograma antes da entrega.

## Validações concluídas antes da publicação

- Sete produtos, sete fotos licenciadas reconferidas no Commons e inspecionadas, sete links com tag oficial. A meta progressiva de 12 ainda depende de cinco fotos/variantes verificáveis.
- Dez artigos, cinco otimizados; tabelas de decisão, motivos e limitações. Correções de largura em cartões e artigos em 360 px.
- Build: 30 páginas, 27 URLs no sitemap; 968 referências locais, títulos/canonicals/schema validados.
- 13 testes unitários aprovados; navegador funcional aprovado em 90 layouts a 360/768/1440 px.
- 38 auditorias axe sem violações automáticas e sem erros locais de console/CSP.
- Testes específicos: cinco guias, sete CTAs iniciais, navegação com origem e tag correta interceptada localmente, diagnóstico voluntário sem consulta bruta, busca OXO.
- Lighthouse local: Performance 97, Accessibility 100, Best Practices 100, SEO 100. Não são métricas de usuários reais.
- 12 PNGs de Pinterest inspecionados, textos e limites de formato validados. Nenhuma publicação/agendamento externo.
- Painel offline gerado com dados indisponíveis; rejeita eventos QA, números sem fonte/data e vendas sem relatório Amazon.
- Busca de padrões de credenciais no artefato não encontrou chaves privadas/tokens secretos usuais. O token HTML de Search Console é público, não senha.
- Fontes, auditoria individual de links e plano de 14 dias: GROWTH-RESEARCH.md, AFFILIATE-AUDIT.csv, FIRST-SALES-14-DAYS.md.

Próxima ação: publicar os arquivos já validados, verificar a versão no domínio oficial e concluir Search Console.
