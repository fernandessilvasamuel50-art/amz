# Pinterest — primeiro conjunto

**12 rascunhos prontos; nenhum publicado ou agendado.** Os arquivos `pin-01.png` a `pin-12.png` têm 1000 × 1500 px. `pins.csv` e `pins.json` contêm título, descrição, palavra-chave editorial, imagem, URL com UTM, tema, texto alternativo e data sugerida. `contact-sheet.jpg` permite revisar o conjunto.

**Revisão de distribuição em 10/10/2026:** 12 destinos publicados responderam 200; canonicals sem UTM conferidos; 12 PNGs idênticos aos originais no Git. Descrições e textos alternativos revisados em inglês. `queue-review.html` apresenta as peças e os textos para aprovação; `distribution-queue.json` e `.csv` incluem proposta de horários, pastas e campos reais ainda vazios para URL do Pin, agendamento, publicação e métricas. `destination-review.json` registra a checagem dos destinos e hashes.

Lote 1: Pins 01–10, um por dia de **12 a 21/10/2026, 18h America/New_York**. Nesse período é também 18h America/Manaus. Lote 2: Pins 11/12 em 22/10, às 18h/20h, condicionado ao espaço na fila e aprovação. Horários são propostas consistentes, não picos de audiência comprovados. Pastas são sugestões, não pastas criadas ou verificadas na conta. Conferir fuso do agendador, perfil e quantidade já pendente antes de confirmar o lote.

As ilustrações vetoriais foram criadas para o PickPop, sem fotografias da Amazon. Os desenhos são esquemas de planejamento, não representações de modelos específicos. Fontes Outfit e DM Sans seguem os arquivos OFL do repositório. Os masters HTML e os geradores preservam a edição das peças.

**Ação do proprietário:** entrar na própria conta Pinterest, revisar este conjunto e autorizar a publicação. Caso seja necessário criar/converter uma conta business ou aceitar novos termos, o proprietário deve realizar essa etapa. Nenhuma conta foi criada.

Na conta business, usar o agendamento nativo gratuito: criar um Pin, inserir o título/descrição/URL do CSV, carregar a imagem correspondente e escolher a data. A [documentação oficial](https://help.pinterest.com/en/business/article/schedule-pins) informa até 30 dias de antecedência e 10 Pins pendentes, cadastrados individualmente. Para os 12 rascunhos, acrescentar os últimos dois quando a fila tiver espaço. As datas são sugestões, não comprovantes de agendamento; deslocar o calendário se a autorização chegar depois de 12/10.

O [formato recomendado](https://help.pinterest.com/en/business/article/pinterest-product-specs) é 2:3; o conjunto respeita título até 100 caracteres, descrição até 800 e PNG abaixo de 20 MB. Confirmar a prévia da própria conta antes de publicar. Sem anúncios pagos, automação não oficial ou comentários promocionais em massa. Respeitar as [Community Guidelines](https://policy.pinterest.com/en/community-guidelines) vigentes; a página também anuncia regras futuras para novembro, que precisam de nova consulta naquela data.

Todos os destinos são artigos ou coleções existentes do PickPop. URLs UTM não mudam canonicals ou a tag Amazon. As descrições avisam que o destino contém links de afiliado. Verificar o conteúdo e o link no Pin antes de publicar.

Registrar publicação real com URL do Pin e data em `operations/private/`; registrar métricas somente quando o Pinterest mostrar dados legítimos. Preparar uma peça não gera tráfego. Agendar não equivale a publicar. Impressões não equivalem a visitas ou compras.

Para repetir apenas a verificação local/de destinos, usar Python com Pillow e `prepare-distribution.py`. Ele nunca entra na conta, publica ou agenda; protege a fila contra sobrescrita depois de registrar conta/aprovação/publicação. Não executar `generate.py` ou `render.cjs` nesta etapa: recriam masters/manifesto e podem sobrescrever os textos revisados. Nenhuma imagem foi refeita nesta execução.
