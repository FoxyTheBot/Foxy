import { Interaction } from 'discordeno/transformers';
import { AllowedMentionsTypes, InteractionResponseTypes } from 'discordeno/types';
import i18next from 'i18next';
import { mentionUser } from '../../utils/discord/User';
import { MessageFlags } from '../../utils/discord/Message';
import { bot } from '../../FoxyLauncher';
import ComponentInteractionContext from './ComponentInteractionContext';
import { ComponentInteraction } from '../../structures/types/Interactions';

const componentExecutor = async (interaction: Interaction): Promise<void> => {
  let receivedCommandName = interaction.message?.interaction?.name;

  if (!receivedCommandName && interaction.data?.customId) {
    const customIdParts = interaction.data.customId.split('|');
    let message = null;

    for (const part of customIdParts) {
      try {
        const messageId = BigInt(part);
        message = await bot.messages.get(messageId) || (await bot.helpers.getMessage(interaction.channelId, part));
        if (message) break;
      } catch {
        continue;
      }
    }

    if (!message) return;

    const getCommandName = async () => {
      const prefix = (await bot.database.getGuild(interaction.guildId)).guildSettings.prefix ?? process.env.DEFAULT_PREFIX;
      return bot.commands.find((cmd) => {
        const commandName = message.content.split(' ')[0].replace(prefix, '');
        return cmd.name === commandName || cmd.aliases?.includes(commandName);
      })?.name;
    };

    receivedCommandName = await getCommandName();
  }

  if (!receivedCommandName || !interaction.data?.customId) return;

  const [executorIndex, interactionTarget] = interaction.data.customId.split('|');
  const commandName = receivedCommandName.split(' ')[0];

  const errorReply = async (content: string) => {
    await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: `<:emoji:${bot.emotes.FOXY_CRY}> | ${content}`,
        flags: MessageFlags.EPHEMERAL,
        allowedMentions: { parse: [AllowedMentionsTypes.UserMentions] },
      },
    }).catch(() => null);
  };

  const user = await bot.database.getUser(interaction.user.id);
  const T = i18next.getFixedT(user.userSettings.language ?? 'pt-BR');
  const command = bot.commands.get(commandName || receivedCommandName);

  if (!command) return errorReply(T('permissions:UNKNOWN_SLASH'));
  if (!command.commandRelatedExecutions?.length) return;

  const isUserBanned = await user.isBanned;
  if (isUserBanned) {
    const banReason = user.banReason;
    return errorReply(T('permissions:BANNED_INFO', { banReason }));
  }

  if (interactionTarget !== `${interaction.user.id}` && interactionTarget.length > 1) {
    return errorReply(T('permissions:NOT_INTERACTION_OWNER', { owner: mentionUser(interactionTarget) }));
  }

  const execute = command.commandRelatedExecutions[Number(executorIndex)];
  if (!execute) return errorReply(T('permissions:UNKNOWN_INTERACTION'));

  const context = new ComponentInteractionContext(interaction as ComponentInteraction);

  try {
    await execute(context);
  } catch (err) {
    console.error(err);
    errorReply(T('events:error.title', { cmd: command.name }));
  }
};

export { componentExecutor };