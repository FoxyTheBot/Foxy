import { Bot, Collection, Message, User, createHelpers, createRestManager } from 'discordeno';
import { CommandInterface } from './CommandInterfaces';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { BotWithCache } from 'discordeno/cache-plugin';
import DatabaseConnection from '../../../../../common/utils/database/DatabaseConnection';
import { colors } from '../../../../../common/utils/colors';
import { FoxyRestManager } from '../../../../../common/utils/RestManager';
import { emotes } from '../../../../../common/utils/emotes';
import ImageGenerator from '../../utils/images/ImageGenerator';
import FoxyHelpers from '../../utils/helpers/FoxyHelpers';
import { constants } from './constants';

export interface IdentifiedData<T> {
  id: number;
  data: T;
}

export interface FoxyClient extends BotWithCache<Bot> {
  commands: Collection<string, CommandInterface>;
  owner: User;
  clientId: bigint;
  username: string;
  isProduction: boolean;
  database: DatabaseConnection;
  helpers: ExtendedHelpers;
  rest: ExtendedRest;
  emotes: typeof emotes;
  colors: typeof colors;
  config: Object;
  locale: Function;
  foxy: {
    constants: typeof constants;
  };
  generators: ImageGenerator;
  isReady: boolean;
  hasGuildPermission: typeof botHasGuildPermissions;
  handleUnavailableGuild: Promise<Message>
}

export interface ExtendedRest extends ReturnType<typeof createRestManager> {
  foxy: FoxyRestManager;
}

export interface ExtendedHelpers extends ReturnType<typeof createHelpers> {
  foxy: FoxyHelpers;
}