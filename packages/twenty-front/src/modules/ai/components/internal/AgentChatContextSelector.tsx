import { useWorkspaceFavorites } from '@/favorites/hooks/useWorkspaceFavorites';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuInput } from '@/ui/layout/dropdown/components/DropdownMenuInput';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { t } from '@lingui/core/macro';
import { useState } from 'react';
import { IconPlus } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { MenuItem } from 'twenty-ui/navigation';

export const AgentChatContextSelector = () => {
  const dropdownId = 'agent-chat-context-selector-dropdown';
  const { closeDropdown } = useCloseDropdown();
  const [inputValue, setInputValue] = useState('');
  const { activeNonSystemObjectMetadataItems } = useFilteredObjectMetadataItems();
  const { workspaceFavoritesObjectMetadataItems } = useWorkspaceFavorites();

  const filteredItems = workspaceFavoritesObjectMetadataItems.filter((item) =>
    item.labelPlural.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleSelect = (itemLabel: string) => {
    // TODO: Implement context selection logic
    console.log('Selected context:', itemLabel);
    setInputValue('');
    closeDropdown(dropdownId);
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      dropdownPlacement="bottom-start"
      clickableComponent={
        <Button
          variant="secondary"
          size="small"
          Icon={IconPlus}
          title={t`Add Context`}
        />
      }
      dropdownComponents={
        <DropdownContent>
          <DropdownMenuInput
            instanceId={`${dropdownId}-input`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t`Search tables...`}
            autoFocus
          />
          <DropdownMenuItemsContainer>
            {filteredItems.map((item) => (
              <MenuItem
                key={item.id}
                text={item.labelPlural}
                onClick={() => handleSelect(item.labelPlural)}
              />
            ))}
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
