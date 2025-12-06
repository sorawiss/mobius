import { atom } from 'recoil';

export const agentChatPendingMessageState = atom<string | null>({
  key: 'agentChatPendingMessageState',
  default: null,
});
