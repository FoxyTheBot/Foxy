import { InputTextComponent } from 'discordeno/types';
import { ModalInteraction } from '../../structures/types/Interactions';

type FieldData = {
  customId: string;
  value: string;
};

const extractContent = (interaction: ModalInteraction): FieldData[] =>
  interaction.data.components.reduce<FieldData[]>((p, c) => {
    const fieldData = (c.components as InputTextComponent[])[0];
    p.push({ customId: fieldData.customId, value: fieldData.value as string });
    return p;
  }, []);

export { extractContent };