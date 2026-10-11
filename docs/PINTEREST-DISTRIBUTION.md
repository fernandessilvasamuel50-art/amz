# Pinterest — distribuição confirmada em 10/10/2026

## Estado real

Conta Business gratuita **PickPop (@fernandessilvasamuel50)** autenticada e conferida no Business Hub. Conta pessoal existente convertida após autorização específica para os termos empresariais; nenhuma conta nova criada. Nome/site/categoria casa foram configurados com informações verdadeiras. Nenhum anúncio ativado.

Autorização expressa recebida para criar três pastas públicas e agendar Pins 01–10 de 12 a 21/10/2026 às 18h no horário mostrado pelo editor. Executado exclusivamente na interface oficial, com as imagens originais. **10 Pins confirmados na fila oficial; nenhum destes Pins publicado em 10/10.** Pins 11/12 ficam reservados, sem upload/agendamento/autorização desta rodada.

Pastas criadas e verificadas no perfil:

- [Coffee Station Ideas](https://br.pinterest.com/fernandessilvasamuel50/coffee-station-ideas/)
- [Small Kitchen Organization](https://br.pinterest.com/fernandessilvasamuel50/small-kitchen-organization/)
- [Everyday Kitchen Essentials](https://br.pinterest.com/fernandessilvasamuel50/everyday-kitchen-essentials/)

Pastas anteriores e seguidores preservados. Fotos/editorial Amazon e funcionalidades do site não foram alterados nesta distribuição.

## Agendamentos reais

[Fila oficial privada](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pins/) — exige login da conta correta.

O editor e a fila mostram **18:00**, mas não exibem um fuso. A aprovação especificou o horário exibido pelo Pinterest. America/New_York/Manaus permanecem intenções do planejamento inicial; não são confirmação de um instante UTC. `scheduledAt` está sem offset e `scheduledTimeZone` é null. Não modificar nem reenviar o lote apenas por essa ausência de indicação.

| Pin | Data de 2026 | Horário exibido | Pasta | Comprovante oficial |
|---|---|---|---|---|
| 01 | 2026-10-12 | 18:00 | Coffee Station Ideas | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934074558245345920/) |
| 02 | 2026-10-13 | 18:00 | Coffee Station Ideas | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934079351226339584/) |
| 03 | 2026-10-14 | 18:00 | Small Kitchen Organization | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934082285762746112/) |
| 04 | 2026-10-15 | 18:00 | Everyday Kitchen Essentials | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934087045458560192/) |
| 05 | 2026-10-16 | 18:00 | Coffee Station Ideas | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934087254469073024/) |
| 06 | 2026-10-17 | 18:00 | Small Kitchen Organization | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934088413372564416/) |
| 07 | 2026-10-18 | 18:00 | Small Kitchen Organization | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934088988731480704/) |
| 08 | 2026-10-19 | 18:00 | Everyday Kitchen Essentials | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934089673542702848/) |
| 09 | 2026-10-20 | 18:00 | Small Kitchen Organization | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934087722217994496/) |
| 10 | 2026-10-21 | 18:00 | Everyday Kitchen Essentials | [Agendamento privado](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pin/3934088130306901184/) |

Os links acima são de **Pins agendados, privados**, não URLs de publicações acessíveis ao público. `scheduledPinUrl` está registrado; `pinUrl` e `publishedAt` permanecem null até confirmação posterior. Reservas 11/12: proposta 22/10 às 18h/20h, sujeita a espaço na fila e nova autorização explícita.

## Revisões e evidências

- 12 imagens originais inspecionadas e preservadas por SHA-256, 1000×1500 PNG abaixo de 20 MB. Ilustrações editoriais próprias; nenhuma fotografia da Amazon reutilizada nas peças.
- Copy/alt revisados em inglês americano, títulos até 100 e descrições até 800 caracteres. Descrições avisam sobre os links de afiliado no destino.
- 12 URLs completas com UTM verificadas HTTP 200, H1 relevante e canonical sem UTM; 11 páginas distintas, com duas propostas diferentes para o guia coffee-station.
- Antes de cada confirmação nativa: imagem correspondente, título, descrição, destino, alt, pasta pública, data e 06:00 PM conferidos. Divulgação de conteúdo com IA aplicada; opção de pessoa gerada por IA não aplicada; sugestões automáticas de produtos semelhantes desativadas para estas ilustrações editoriais.
- Fila final mostrou **10 Pins**, títulos, três pastas, datas consecutivas 12–21/10 e 18:00. Captura completa em `pickpop-site/tests/artifacts/pinterest-scheduled-10-pins.jpg`; exportação somente da interface observada em `operations/private/pinterest-observed-scheduled-pins.json`, ambos fora do Git.
- Um carregamento intermediário da fila mostrou temporariamente zero e o detalhe ficou vazio. Retorno à navegação oficial resolveu; fila final confirmou os dez. Nenhum Pin reenviado ou duplicado por essa falha.
- Registros JSON/CSV e prévia atualizados; URLs de publicação/métricas ausentes não foram convertidas em zeros.
- Proteção de `prepare-distribution.py` preservada: não executar para regenerar a fila após conta/autorização/agendamentos reais. Não executar `generate.py`/`render.cjs`, que recriam imagens/manifesto. Sem alteração de código público, sem novo build/deploy do site.
- Prévia HTML local não teve teste automatizado de layout: file:// foi bloqueado pelo navegador. Nenhuma tentativa de contornar o bloqueio; imagens foram inspecionadas diretamente.

## Acompanhamento

Acompanhamento neste chat criado e confirmado na ferramenta oficial do Codex: **Conferir Pins do PickPop**, identificador `conferir-pins-do-pickpop`, ativo. Revisão diária às 19h do horário local do app durante a rodada, leitura somente. Verificar publicações/métricas de 12 a 22/10 e encerrar após relatório. Não autoriza novos Pins, reagendamento, anúncios ou a segunda rodada. Computador ligado/app em execução e sessão Pinterest legítima são necessários; novo login, se solicitado, fica com o proprietário. Não há execução futura confirmada ainda.

Ficar em silêncio sem alteração relevante. Avisar apenas publicação confirmada, dados úteis, falha ou necessidade de intervenção. Métricas dos Pins: impressões/cliques de saída quando Pinterest Analytics disponibilizar; visitas/origens agregadas quando Netlify disponibilizar; vendas/comissões apenas Amazon oficial. Não confundir contagens de hospedagem com visitantes qualificados. Não há métricas ou vendas deste lote disponíveis em 10/10.

**Próxima ação executável:** conferir a publicação do Pin 01 após a data agendada e registrar sua URL pública. O proprietário não precisa autorizar novamente os dez Pins já agendados. Pins 11/12 requerem autorização separada, quando houver espaço.

## Fontes oficiais

- [Business gratuito e conversão](https://help.pinterest.com/en/business/article/get-a-business-account)
- [Agendamento nativo](https://help.pinterest.com/en/business/article/schedule-pins)
- [Especificações de imagem e texto](https://help.pinterest.com/en/business/article/pinterest-product-specs)
- [Acompanhamentos no app e execução local](https://learn.chatgpt.com/docs/automations?surface=app)
