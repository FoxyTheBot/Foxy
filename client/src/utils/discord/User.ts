import { ImageSize, routes } from 'discordeno';
import { User } from 'discordeno/transformers';
import { bot } from "../../FoxyLauncher";

const getUserAvatar = (
  user: User,
  { size = 256, enableGif }: { size?: ImageSize; enableGif?: boolean } = {},
): string => {
  if (user.avatar) {
    const hash = bot.utils.iconBigintToHash(user.avatar);
    return bot.utils.formatImageURL(
      routes.USER_AVATAR(user.id, hash),
      size,
      enableGif && hash.startsWith('a_') ? 'gif' : 'png',
    );
  }

  return bot.utils.formatImageURL(routes.USER_DEFAULT_AVATAR(Number(user.discriminator) % 5));
};

const mentionUser = (userId: bigint | string): string => `<@${userId}>`;

export { getUserAvatar, mentionUser };