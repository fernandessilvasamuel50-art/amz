# Cadastro e manutenção do catálogo real

O catálogo público é `pickpop-site/data/catalog.json`. A configuração comercial está em `pickpop-site/data/site.json`; a tag vigente é **pickpop03-20**. A tag é pública, não uma senha ou chave de API.

Para cadastrar um item:

1. Confira a variante exata nas páginas Amazon.com e fabricante: nome, marca, modelo e ASIN. Registre `retailerName` como título consultado; `name` é o nome editorial legível do mesmo modelo. Não copie descrições comerciais: escreva uma descrição original.
2. Registre características documentadas em `features`, benefícios concretos em `benefits` e limitações em `considerations`. Estilos e prioridades são escolhas editoriais, não garantias de preço ou desempenho.
3. Use `verification.status: verified`, URLs das fontes, data e escopo da revisão. Estoque e preço atual não são verificados nesta versão. Mantenha `price` e `planningBudget` como `null`.
4. Confirme uma fotografia da mesma variante com permissão comercial. Acrescente o arquivo WebP em `assets/products/`; preencha autor, fonte, licença, URL da licença, mudanças, dimensões e alt. Marque `authorized` e `variantReviewed` apenas após conferir a evidência. CC BY-SA exige manter a licença também na adaptação; o crédito público gerado identifica isso. Não coloque imagens ainda pendentes na pasta pública.
5. `productUrl` usa `https://www.amazon.com/dp/ASIN`. O link remunerado direto usa o mesmo destino com `?tag=pickpop03-20`, sem redirecionador. `affiliateVerification.status: owner-tag-confirmed` registra a origem do identificador e o método de construção. Não implica teste de comissão ou aprovação final externa.
6. Rode o build e os testes. O build recusa ASIN inválido, destino diferente, foto ausente, crédito incompleto, imagem sem licença confirmada ou preço não autorizado. Não publique candidatos incompletos.

Se a tag mudar, atualize `site.json` e as URLs oficiais do catálogo; o build detecta divergências. Se os links remunerados forem desligados em `affiliate.enabled`, o destino volta à URL pública do produto. Disclosures atuais pressupõem participação informada pelo proprietário e devem ser revisados ao sair do programa.

Favoritos antigos de conceitos demonstrativos não são convertidos silenciosamente em favoritos de produtos distintos. Os IDs demonstrativos foram arquivados fora do site e os favoritos válidos do catálogo atual continuam funcionando, inclusive opt-out e memória temporária quando o armazenamento é bloqueado.

## Provedores

- `CuratedCatalogProvider.search(filters)`: pesquisa local determinística e transparente. Filtros desconhecidos não geram recomendações aleatórias; categoria, preferências e prioridade se combinam. Sem preço confiável, orçamento não remove o item.
- `AmazonCreatorsApiProvider`: fronteira desativada por padrão. Os testes injetam transporte sintético para validar contrato e falhas; não existe endpoint produtivo, SDK autenticado ou busca automática implementada. Uma futura integração deve funcionar no servidor, com credenciais protegidas, autorização válida e tratamento próprio das regras de imagens/preços/cache. O contrato atual de imagens locais não deve ser usado para baixar imagens da API automaticamente.

As [políticas oficiais](https://affiliate-program.amazon.com/help/operating/policies) exigem identificação e formatação apropriada dos Special Links. A [introdução da Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) descreve os requisitos de acesso separado. A conta e os relatórios Associates pertencem ao proprietário; o site não mede nem confirma vendas realizadas na Amazon.
