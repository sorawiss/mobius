import { agentChatPendingMessageState } from '@/ai/states/agentChatPendingMessageState';
import { useOpenAskAIPageInCommandMenu } from '@/command-menu/hooks/useOpenAskAIPageInCommandMenu';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { IconSparkles } from 'twenty-ui/display';
import { TextInput } from '@/ui/input/components/TextInput';

const StyledContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(6)};
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100%;
  max-width: 400px;
  padding: 0 ${({ theme }) => theme.spacing(4)};
`;

const StyledInputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const StyledIconContainer = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  align-items: center;
  z-index: 1;
`;

const StyledInput = styled(TextInput)`
  padding-left: ${({ theme }) => theme.spacing(10)};
  justify-content: center;
  padding-right: ${({ theme }) => theme.spacing(5)};
  height: 48px;
  font-size: ${({ theme }) => theme.font.size.md};
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  background: ${({ theme }) => theme.background.primary};
  
  &:hover {
    border-color: ${({ theme }) => theme.border.color.strong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color.blue}, ${({ theme }) => theme.boxShadow.strong};
  }
`;

export const AskAIInput = () => {
  const { t } = useLingui();
  const [value, setValue] = useState('');
  const setPendingMessage = useSetRecoilState(agentChatPendingMessageState);
  const { openAskAIPage } = useOpenAskAIPageInCommandMenu();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && value.trim()) {
      setPendingMessage(value);
      openAskAIPage();
      setValue('');
    }
  };

  return (
    <StyledContainer>
      <StyledInputContainer>
        <StyledIconContainer>
          <IconSparkles size={20} />
        </StyledIconContainer>
        <StyledInput
          placeholder={t`Ask anything...`}
          value={value}
          onChange={setValue}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </StyledInputContainer>
    </StyledContainer>
  );
};
