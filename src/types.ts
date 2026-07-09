/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Poem {
  id: string;
  title: string;
  author: string;
  content: string;
  theme: string;
  createdAt?: string;
  isUserCreated?: boolean;
  alignment?: 'left' | 'center';
  imageUrl?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AmbientSound {
  id: string;
  name: string;
  emoji: string;
  playing: boolean;
}
