import { Component, type ReactNode } from 'react';

/** Общие пропсы для UI-компонентов на основе ООП-наследования */
export interface ComponentUIProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * Базовый класс UI-компонента: единая точка для БЭМ-хелперов при работе с CSS Modules.
 * Наследники задают имя блока и подключают CSS Module.
 */
export abstract class ComponentUI<
  P extends ComponentUIProps = ComponentUIProps,
  S extends object = Record<string, never>,
> extends Component<P, S> {
  /** Имя BEM-блока (совпадает с корневым классом в CSS Module) */
  protected abstract readonly bemBlock: string;

  /** Собрать класс вида block__element--modifier из карты CSS Module */
  protected bem(
    styles: Record<string, string>,
    element?: string,
    modifier?: string
  ): string {
    const blockKey = this.bemBlock;
    const block = styles[blockKey];
    if (!element) {
      return block ?? '';
    }
    const elementKey = `${blockKey}__${element}`;
    const base = styles[elementKey];
    if (!modifier) {
      return [block, base].filter(Boolean).join(' ');
    }
    const modKey = `${elementKey}--${modifier}`;
    return [block, base, styles[modKey]].filter(Boolean).join(' ');
  }

  protected mergeClassNames(...parts: Array<string | undefined>): string {
    return parts.filter(Boolean).join(' ');
  }

  public abstract override render(): ReactNode;
}
