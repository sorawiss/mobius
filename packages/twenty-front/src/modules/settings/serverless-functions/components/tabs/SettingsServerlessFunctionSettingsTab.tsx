import { SettingsServerlessFunctionNewForm } from '@/settings/serverless-functions/components/SettingsServerlessFunctionNewForm';
import { SettingsServerlessFunctionTabEnvironmentVariablesSection } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionTabEnvironmentVariablesSection';
import { useDeleteOneServerlessFunction } from '@/settings/serverless-functions/hooks/useDeleteOneServerlessFunction';
import { type ServerlessFunctionFormValues } from '@/settings/serverless-functions/hooks/useServerlessFunctionUpdateFormState';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SettingsPath } from 'twenty-shared/types';
import { H2Title } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { Section } from 'twenty-ui/layout';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { Trans, t } from '@lingui/react/macro';

const DELETE_FUNCTION_MODAL_ID = 'delete-function-modal';

export const SettingsServerlessFunctionSettingsTab = ({
  formValues,
  serverlessFunctionId,
  onChange,
  onCodeChange,
}: {
  formValues: ServerlessFunctionFormValues;
  serverlessFunctionId: string;
  onChange: (key: string) => (value: string) => void;
  onCodeChange: (filePath: string, value: string) => void;
}) => {
  const navigate = useNavigateSettings();
  const { openModal } = useModal();
  const { deleteOneServerlessFunction } = useDeleteOneServerlessFunction();

  const deleteFunction = async () => {
    await deleteOneServerlessFunction({ id: serverlessFunctionId });
    navigate(SettingsPath.ServerlessFunctions);
  };

  return (
    <>
      <SettingsServerlessFunctionNewForm
        formValues={formValues}
        onChange={onChange}
      />
      <SettingsServerlessFunctionTabEnvironmentVariablesSection
        formValues={formValues}
        onCodeChange={onCodeChange}
      />
      <Section>
        <H2Title title={t`Danger zone`} description={t`Delete this function`} />
        <Button
          accent="danger"
          onClick={() => openModal(DELETE_FUNCTION_MODAL_ID)}
          variant="secondary"
          size="small"
          title={t`Delete function`}
        />
      </Section>
      <ConfirmationModal
        confirmationValue={formValues.name}
        confirmationPlaceholder={formValues.name}
        modalId={DELETE_FUNCTION_MODAL_ID}
        title={t`Function Deletion`}
        subtitle={
          <>
            <Trans>
              This action cannot be undone. This will permanently delete your
              function. Please type in the function name to confirm.
            </Trans>
          </>
        }
        onConfirmClick={deleteFunction}
        confirmButtonText={t`Delete function`}
      />
    </>
  );
};
