# Correção urgente — identificação por marketplace

## Configuração vigente em 12/10/2026

| Marketplace | Domínio | Identificador confirmado pelo proprietário | Uso no PickPop |
|---|---|---|---|
| Estados Unidos | Amazon.com | `pickpop-20` | Ativo nos onze produtos |
| Brasil | Amazon.com.br | `pickpop03-20` | Não ativado; proibido nos links americanos |

A associação aos países foi informada pelo proprietário após conferir a interface de contas Amazon. Não foi conferida pelo agente em uma sessão autenticada. O sufixo `-20` não permite distinguir os dois países.

## Alterações

- Configuração central declara US, www.amazon.com e pickpop-20. Build/importador rejeitam qualquer divergência nessa associação, inclusive um lote e uma configuração que coincidam na tag brasileira.
- Onze links ativos, auditoria CSV e URLs americanas dos lotes preparados/pesquisa foram corrigidos. ASINs, modelos, fotografias, descrições, preços nulos e funcionalidades preservados. Nenhum link brasileiro foi convertido em americano.
- A busca só ativa links remunerados quando o marketplace, domínio, ASIN e tag correspondem à configuração confirmada. Em divergência, usa a página pública sem tag.
- Divulgação “As an Amazon Associate I earn from qualifying purchases.” e rel="sponsored" mantidos. Sem redirecionamento oculto.
- Documentos históricos e comprovantes privados mantêm o registro anterior, explicitamente superado por esta correção. Referências à antiga tag nesses registros não são instruções comerciais vigentes. Pinterest não alterado.
- RIO Mini e Fellow Walnut continuam suspensos. Nenhum produto adicionado.

## Validação oficial pendente

A [documentação oficial do Link Checker](https://affiliate-program.amazon.com/help/node/topic/G6253GFSARDQENZR) indica a ferramenta para links construídos/modificados fora de Associates Central. A tentativa de abrir https://affiliate-program.amazon.com/home/tools/linkchecker foi bloqueada pelo navegador por uma permissão salva. Não houve sessão autenticada, teste no Link Checker ou comprovação de atribuição.

O proprietário deve entrar no **Associates US**, selecionar **pickpop-20**, abrir Tools → Link Checker e verificar as onze URLs de `AFFILIATE-AUDIT.csv`. Também conferir o cadastro de https://pickpop.netlify.app/ nos sites da conta americana. Links gerados pelo próprio Associates seguem a orientação distinta descrita na página oficial. Se necessário, solicitar ao suporte confirmação dos links exibidos no site.

Não realizar compras pessoais de teste ou cliques artificiais. Cliques/pedidos/comissões só serão confirmados nos relatórios oficiais, quando disponíveis. A correção não comprova nem recupera atribuição de operações anteriores.

## Retorno, testes e publicação

Ponto de retorno: tag Git `pickpop-before-us-tag-fix-20261012`, commit `4799a69`. Os arquivos Pinterest com alterações anteriores à tarefa permanecem fora deste commit.

Build: 34 páginas, 31 URLs no sitemap. Testes executados: 12 testes Python de importação/guardas, 15 testes JavaScript de catálogo/busca/provedor/privacidade; validação estática de 1.139 referências internas. Verificações de navegador e confirmação de publicação registradas após execução abaixo.

Testes de navegador aprovados: fluxo MVP em 102 layouts (360/768/1440px), busca/filtros/orçamento/favoritos/comparação/quiz/teclado; cinco guias e CTAs dos onze produtos; três guias prioritários e três detalhes em 18 auditorias responsivas de acessibilidade, dez destinos de Pins preservados. Mais 38 auditorias automáticas de acessibilidade com headers de produção, sem erros de console/CSP. Saídas Amazon interceptadas localmente, sem gerar cliques comerciais. Auditoria do artefato: 54 ocorrências de links remunerados, onze destinos únicos, todos com pickpop-20, sponsored e divulgação; nenhuma URL americana com a tag brasileira. Onze identidades e fotografias comparadas ao ponto de retorno. Varredura limitada de padrões conhecidos de segredos sem ocorrências; não equivale a auditoria de segurança exaustiva.
