# Pinterest — distribuição preparada em 10/10/2026

## Situação real

- Sessão disponível no navegador do Codex inicialmente não autenticada. Proprietário informou possuir conta pessoal e precisar de ajuda para convertê-la.
- Tela inicial de login informou conta vinculada ao Google; também oferece acesso oficial por QR com confirmação no aplicativo. A primeira tentativa de cadastro realizada pelo proprietário foi recusada com “Esse email já está em uso”. Proprietário depois indicou outro e-mail e autorizou preparar nova conta Business; formulário oficial reaberto. Nenhuma conta nova confirmada até este registro. Dados pessoais, senha e nascimento não são registrados neste relatório nem no Git.
- Login ainda precisa ser confirmado pela plataforma antes de consultar perfil, Business Hub, pastas ou fila.
- Nenhum Pin enviado, publicado ou agendado; nenhuma pasta criada; nenhum serviço pago ou integração de terceiros ativado.
- Ferramenta de terceiros encontrada na pesquisa de plugins não foi conectada: execução restrita ao Pinterest oficial.

## Preparação concluída

1. Lidos os registros existentes e revisadas as 12 peças. Imagens não alteradas: comparação de bytes/SHA-256 com Git aprovada.
2. Títulos, categorias, keywords e destinos preservados. Descrições revisadas para inglês natural e transparência de afiliação; alt texts descrevem as ilustrações reais.
3. PNGs 1000×1500, menores que 20 MB; títulos até 100 e descrições até 800 caracteres.
4. Os 12 links completos com UTM responderam HTTP 200 no PickPop publicado. H1 corresponde ao tema da peça; canonical aponta ao conteúdo sem UTM. Há 11 destinos únicos, pois duas peças abordam aspectos diferentes do mesmo guia de estação de café.
5. Fila local preparada, com 10 Pins no primeiro lote e dois reservados. Não é fila agendada na plataforma.
6. URLs de Pins, datas reais e métricas permanecem vazias/null, não zeros ou resultados inventados.
7. Verificação independente aprovada: PNGs/manifesto/CSV/registros consistentes, lotes de 10 + 2 e quatro casos de proteção de histórico real (conta, aprovação, agendamento e URL de Pin). Primeira execução da proteção foi impedida pelo diretório temporário do isolamento; repetição com arquivos existentes e mocks em memória aprovada. Nenhum build do site foi necessário, pois código público e imagens não mudaram.
8. Prévia HTML preparada, mas inspeção automatizada dessa página local não executada: a política do navegador bloqueou file://. Nenhuma tentativa de contornar o bloqueio; imagens já inspecionadas diretamente e prévia permanece disponível para revisão manual do proprietário.

## Arquivos prontos para revisão

- `marketing/pinterest/queue-review.html`: 12 imagens originais, título, descrição, alt, destino, horário e pasta sugeridos.
- `distribution-queue.csv` / `.json`: fonte operacional das propostas e registros individuais; status inicial awaiting-business-login-and-batch-approval.
- `pins.csv` / `.json`: textos revisados de publicação.
- `destination-review.json`: HTTP, canonical, H1, dimensões, limites e hashes conferidos.
- `prepare-distribution.py`: revisão sem publicação, sem login, sem bot ou agendamento externo. Não sobrescreve histórico real existente.

## Lotes propostos — não agendados

Fuso editorial America/New_York. Em 12–22/10/2026, UTC−04:00, igual a Manaus. Conferir a indicação do agendador na conta; não presumir seu fuso. Não há dados que provem um horário ideal para nossa conta.

| Pin | Data proposta | Horário Eastern | Pasta sugerida | Status real |
|---|---|---|---|---|
| 01 | 12/10 | 18h | Coffee Station Ideas | Aguardando conta/autorização |
| 02 | 13/10 | 18h | Coffee Station Ideas | Aguardando conta/autorização |
| 03 | 14/10 | 18h | Small Kitchen Organization | Aguardando conta/autorização |
| 04 | 15/10 | 18h | Everyday Kitchen Essentials | Aguardando conta/autorização |
| 05 | 16/10 | 18h | Coffee Station Ideas | Aguardando conta/autorização |
| 06 | 17/10 | 18h | Small Kitchen Organization | Aguardando conta/autorização |
| 07 | 18/10 | 18h | Small Kitchen Organization | Aguardando conta/autorização |
| 08 | 19/10 | 18h | Everyday Kitchen Essentials | Aguardando conta/autorização |
| 09 | 20/10 | 18h | Small Kitchen Organization | Aguardando conta/autorização |
| 10 | 21/10 | 18h | Everyday Kitchen Essentials | Aguardando conta/autorização |
| 11 | 22/10 | 18h | Everyday Kitchen Essentials | Reservado para próxima rodada |
| 12 | 22/10 | 20h | Coffee Station Ideas | Reservado para próxima rodada |

Pastas ainda não conferidas na conta. Não criar ou selecionar pastas alheias sem verificar seu contexto. Se a autorização chegar após o início proposto, deslocar o calendário e apresentar novamente as datas alteradas.

## Conectar a conta pessoal existente

1. Entrar pessoalmente em https://br.pinterest.com/login/ **no navegador do Codex desta conversa**. A sessão de outro navegador ou celular não autentica automaticamente esta aba. A tela informou vínculo Google: usar o botão Google da conta correspondente, em vez de uma senha Pinterest nova.
2. Depois do login, posso localizar a configuração visível. Caminho oficial desktop: Configurações → Gerenciar conta → Converter para conta Business.
3. Proprietário conclui a conversão e aceita os termos. Perfil Business é público; Pins e seguidores são preservados. Usar informações verdadeiras: PickPop e https://pickpop.netlify.app/. Não escolher anúncios pagos.
4. Confirmar Business Hub e perfil correto. Conferir pastas existentes, quantidade de Pins já agendados e fuso.
5. Preparar a prévia do lote e solicitar **autorização explícita para agendar os Pins 01–10**, especificando conta, datas, horários e pastas reais. A solicitação de preparar a fila não é autorização para clicar Agendar/Publicar.

## Execução após autorização

Usar somente Criar Pin e Agendar na interface oficial Pinterest, sem ads, terceiros, bots ou novos termos aceitos automaticamente. Limite oficial: até 10 Pins futuros, até 30 dias de antecedência; verificar espaço real. Preencher imagem correspondente, título, descrição, alt e URL exata. Confirmar a prévia antes da ação final.

Após cada ação, observar confirmação e fila no perfil. Registrar URL/ID oferecido pela plataforma, horário confirmado, estado scheduled ou published e evidência. Se um Pin agendado ainda não tiver URL pública disponível, manter URL null e registrar a confirmação/ID disponível; não inventar destino. Agendado não é publicado. Não repetir envio sem conferir se a tentativa anterior criou o Pin.

Pins 11/12 continuam reservados até haver espaço e aprovação específica da próxima rodada. Acompanhamento: Pinterest Analytics para impressões/cliques de saída por Pin, Netlify para páginas/origens agregadas e relatórios Amazon para pedidos/comissões. Dados ausentes permanecem indisponíveis. IPs da hospedagem não equivalem a compradores; testes e acessos do proprietário precisam ser registrados. Nenhuma métrica de Pinterest está acessível nesta etapa.

## Fontes oficiais consultadas em 10/10/2026

- [Conta Business gratuita e conversão](https://help.pinterest.com/en/business/article/get-a-business-account).
- [Agendamento nativo, 30 dias e 10 pendentes](https://help.pinterest.com/en/business/article/schedule-pins).
- [Formato e limites de texto/imagem](https://help.pinterest.com/en/business/article/pinterest-product-specs).

Próxima ação: proprietário conclui senha, nascimento verdadeiro e aceite dos termos no formulário Business oficial preparado com o último e-mail solicitado. Se o Pinterest indicar conta existente, usar o login dessa conta. Confirmar acesso real; em seguida, verificar perfil/pastas/fuso/fila e pedir aprovação do lote concreto antes de agendar.
