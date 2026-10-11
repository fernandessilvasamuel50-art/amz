# Pinterest — distribuição inicial

**10 Pins confirmados como agendados na conta Business PickPop em 10/10/2026.** Pins 01–10: um por dia de 12 a 21/10, às **18h como exibido pelo Pinterest**. O editor não informou fuso; não afirmar instante UTC. Três pastas públicas criadas: Coffee Station Ideas, Small Kitchen Organization e Everyday Kitchen Essentials. Conversão da conta e agendamento autorizados separadamente pelo proprietário. Nenhuma conta nova, anúncio ou ferramenta externa paga.

[Perfil](https://br.pinterest.com/fernandessilvasamuel50/) · [Fila oficial privada](https://br.pinterest.com/fernandessilvasamuel50/scheduled-pins/) (login necessário).

**Agendado não é publicado.** Em 10/10, URLs públicas, datas de publicação e métricas deste lote continuam indisponíveis. Pins 11/12 prontos para a próxima rodada, sem envio/autorização. Datas propostas 22/10 às 18h/20h, sujeitas ao limite da fila e nova aprovação.

## Arquivos

- `pins.json` / `pins.csv`: títulos, descrições, keywords, imagens, destinos com UTM, alt e estado real. Conteúdo público em inglês americano.
- `distribution-queue.json` / `.csv`: agendamentos confirmados, URLs privadas da plataforma (`scheduledPinUrl`), pastas, autorização e campos futuros de publicação/métricas. Não inventar `pinUrl` antes da publicação.
- `queue-review.html`: revisão local das 12 peças, dez agendamentos e duas reservas. Não é o agendador do Pinterest.
- `destination-review.json`: 12 destinos HTTP 200, H1/canonical relevantes, dimensões, limites e SHA-256.
- `contact-sheet.jpg`, `pin-01.png` a `pin-12.png`: imagens originais preservadas. PNG 1000×1500, abaixo de 20 MB; títulos até 100, descrições até 800.
- Relatório completo: `docs/PINTEREST-DISTRIBUTION.md`. Evidências de UI em `operations/private/` e `pickpop-site/tests/artifacts/`, ignoradas no Git.

Ilustrações editoriais originais e tipografia, sem fotos Amazon ou representação de modelos específicos. Fontes Outfit/DM Sans sob OFL do repositório. Destinos úteis publicados, copy com transparência de afiliação e alt fiel. Divulgação de IA aplicada no editor nativo; sugestões automáticas de produtos semelhantes desativadas. Nenhuma imagem refeita.

## Continuidade

Acompanhamento ativo neste chat para conferir publicação e métricas disponíveis de 12 a 22/10. Precisa de app/computador ativo e sessão legítima; não publica nem agenda novos conteúdos. Seguir o relatório operacional e preservar os dez agendamentos, evitando duplicações.

Não executar `generate.py` ou `render.cjs` nesta etapa: podem sobrescrever as imagens/textos existentes. `prepare-distribution.py` verifica destinos e monta propostas antes do primeiro envio, mas **recusa regenerar uma fila com autorização ou histórico real**. Para nova rodada, editar registros preservando histórico e solicitar autorização específica; utilizar somente o [agendamento oficial](https://help.pinterest.com/en/business/article/schedule-pins), até 10 pendentes e 30 dias. Nunca registrar um agendamento como publicação nem impressões como visitas/vendas. Não há horário ideal demonstrado por dados da conta.
