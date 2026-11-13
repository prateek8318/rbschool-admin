import { useEffect } from 'react';

/** Sets the browser tab title. */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    if (title) document.title = `${title} · RB Education Admin`;
  }, [title]);
};

/** Toggle pill used for multi-select (batches, subjects, roles...). */
export const chipClass = (on: boolean) => `chip ${on ? 'chip-on' : 'chip-off'}`;
