import { Interaction, Message } from 'discordeno/transformers';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { CanResolve } from './UnleashedCommandExecutor';
import { bot } from '../../FoxyLauncher';
import { ExtendedUser } from '../../structures/types/DiscordUser';

function getOptionFromInteraction<T>(
  interaction: Interaction,
  name: string,
  shouldResolve: CanResolve,
  required: true,
): T;

function getOptionFromInteraction<T>(
  interaction: Interaction,
  name: string,
  shouldResolve: CanResolve,
  required?: false,
): T | undefined;

function getOptionFromInteraction<T>(
  interaction: Interaction,
  name: string,
  shouldResolve: CanResolve,
  required?: boolean,
): T | undefined;
function getOptionFromInteraction<T>(
  interaction: Interaction,
  name: string,
  shouldResolve: CanResolve,
  required?: boolean,
): T | undefined {
  let options = interaction.data?.options ?? [];

  if (options[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup)
    options = options[0].options ?? [];

  if (options[0]?.type === ApplicationCommandOptionTypes.SubCommand)
    options = options[0].options ?? [];

  const found = options.find((option) => option.name === name) as unknown as { value: T } | undefined;

  if (!found && required)
    throw new Error(`Option ${name} is required in ${interaction.data?.name}`);

  if (!found) return undefined;

  if (shouldResolve && shouldResolve !== "full-string")
    return interaction.data?.resolved?.[shouldResolve]?.get(
      BigInt(found.value as unknown as string),
    ) as unknown as T;

  return found?.value as T;
}

function getArgsFromMessage<T>(
  message: string,
  name: string,
  position: number,
  shouldResolve: CanResolve,
  messageContext: Message,
  required?: true,
): T;

function getArgsFromMessage<T>(
  message: string,
  name: string,
  position: number,
  shouldResolve: CanResolve,
  messageContext: Message,
  required?: boolean,
): T | undefined;

function getArgsFromMessage<T>(
  message: string,
  name: string,
  position: number,
  shouldResolve: CanResolve,
  messageContext: Message,
  required?: boolean,
): T | undefined {
  const args = message.split(' ');

  if (shouldResolve === "users") {
    async function getUser(userId: string): Promise<ExtendedUser | null> {
      const id = userId ? userId.replace(/[^0-9]/g, '') : userId;
      if (!id) return null;
      let user;
      try {
        user = bot.users.get(BigInt(id)) || await bot.helpers.getUser(id);
      } catch (error) {
        user = bot.users.get(messageContext.authorId) || await bot.helpers.getUser(messageContext.authorId);
      }

      return {
        ...user,
        asMention: `<@${user.id}>`,
      };
    }
    return getUser(args[position]) as unknown as T;
  }

  if (shouldResolve === "full-string") {
    const found = args.slice(position).join(' ') as unknown as T;
    if (!found && required) throw new Error(`Option ${name} is required in ${message}`);
    return found;
  }
  
  if (!shouldResolve) {
    const found = args.slice(position).join(' ') as unknown as T;
    if (!found && required) throw new Error(`Option ${name} is required in ${message}`);
    return found;
  }

  const found = args[position] as unknown as T;
  if (!found && required) throw new Error(`Option ${name} is required in ${message}`);
  return found;
}

export { getOptionFromInteraction, getArgsFromMessage };