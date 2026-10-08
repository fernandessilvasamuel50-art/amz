# Cadastro e integrações do PickPop

## Fonte única

Edite `pickpop-site/data/catalog.json`, não cartões HTML. `schemaVersion` é 1. Os 20 registros atuais foram preservados do protótipo e continuam sendo conceitos demonstrativos. Não são produtos específicos, ofertas, avaliações ou resultados de uma API.

Cada registro usa:

| Campo | Uso |
| --- | --- |
| `id` | Identificador único, estável, letras minúsculas/números/hífens; usado em favoritos e URL. |
| `name`, `description`, `search`, `tags` | Conteúdo editorial em inglês americano; `search` fornece a consulta para a busca comum na Amazon. |
| `category` | `kitchen`, `home`, `tech`, `pets` ou `gifts`. O filtro Gifts também encontra registros com estilo `gift-ideas`. |
| `styles` | `minimalist`, `modern`, `cozy`, `budget-friendly`, `space-saving`, `gift-ideas`. Todos os estilos escolhidos precisam coincidir. |
| `priorities` | `saving-money`, `small-spaces`, `everyday-convenience`, `aesthetic-design`, `gift-giving`. |
| `planningBudget` | Alvo editorial demonstrativo em USD, nunca um preço da Amazon. Não limita itens verificados sem preço autorizado atual. |
| `emoji`, `color`, `chip`, `image` | Apresentação ilustrativa. A implementação atual usa símbolos, não imagens de produtos. Imagens futuras precisam de autorização e registro da origem. |
| `considerations` | Perguntas práticas antes da compra; não afirmações sobre especificações não verificadas. |
| `verification` | `status: demo` ou `verified`, `sources` e `reviewedAt`. Verificação exige fontes e data real de revisão. |
| `benefits`, `features` | Fatos documentados; vazios nos conceitos demonstrativos. |
| `asin`, `productUrl`, `affiliateUrl`, `price` | Nulos no catálogo atual. Nunca preencher com valores inventados. |

Termos de busca são normalizados; todas as palavras precisam existir no conteúdo editorial. Categoria, estilos, prioridade, favoritos e orçamento se combinam. O quiz utiliza a mesma função e não substitui buscas vazias por itens aleatórios.

## Dados reais e links remunerados

1. Escolha um produto real e registre fontes confiáveis, uma data real de revisão e as limitações verificadas. Confirme direitos de qualquer imagem. Não alegue teste físico sem realizá-lo.
2. Mude `verification.status` para `verified` somente após a revisão. Não use `planningBudget` como preço de um item verificado.
3. Cadastre um `productUrl` HTTPS oficial sem tag para um destino não remunerado. O código aceita apenas Amazon.com, www.amazon.com e, para links remunerados oficiais, amzn.to; não aceita credenciais na URL.
4. Para links remunerados, o proprietário deve fornecer o link oficial, confirmar a aprovação e informar o identificador em `data/site.json`. O registro precisa de `affiliateVerification: {"status":"owner-provided"}`. Os três controles de configuração são `affiliate.enabled`, `affiliate.approved` e `affiliate.associateTag`.
5. Links pagos ativados recebem `rel="sponsored"`, indicação junto à recomendação e a frase exigida pelo programa. As URLs não são geradas nem têm tags adicionadas automaticamente.
6. Gere novamente com `python build.py` e repita as verificações. Conferir a conformidade atual é uma etapa anterior à ativação; esta preparação não comprova aprovação da conta.

O modo atual mantém links comuns de pesquisa, sem comissão. As páginas de conceitos são `noindex`; páginas verificadas poderão ser indexadas após revisão editorial. Não há Schema de ofertas ou avaliações.

## API e preços

`amazon-adapter.js` é uma fronteira desativada, não uma integração concluída. Ativar `amazonContent.enabled` atualmente interrompe o build. Uma implementação futura exigirá acesso autorizado, servidor/função com segredos fora do frontend, validação e as regras vigentes de exibição e atualização. Nenhum scraping está previsto.

A função de preço aceita apenas dados autorizados e recentes de um provedor habilitado. Esse controle defensivo é testado com dados sintéticos isolados dos arquivos públicos. Ele não substitui as condições específicas da licença e não permite armazenar preços atuais manualmente no JSON público.

## Configuração e privacidade

`data/site.json` é público: nunca coloque senhas ou chaves ali. `contactEmail` recebe um endereço empresarial verdadeiro; nulo mantém uma mensagem honesta e a página fora do sitemap. `origin` define canonical/OG/sitemap.

`metrics.js` emite eventos locais `pickpop:metric`, sem rede, armazenamento ou texto bruto de buscas. Nenhum serviço recebe esses eventos. Um adaptador externo e sua configuração de privacidade precisam de aprovação; `analytics.enabled` interrompe o build enquanto isso não existir. Vendas na Amazon não são medidas diretamente pelo site.

## Referências oficiais

- [Amazon Associates Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement)
- [Amazon Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies)
- [Creators API onboarding](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api)
- [Netlify: build configuration](https://docs.netlify.com/build/configure-builds/overview/)
- [Outfit: licença das fontes](https://github.com/google/fonts/blob/main/ofl/outfit/OFL.txt)
- [DM Sans: licença das fontes](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt)

As fontes foram consultadas durante a revisão. Reconfirme as condições vigentes ao ativar recursos externos.
